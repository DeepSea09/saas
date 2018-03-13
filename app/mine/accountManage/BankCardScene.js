/**
 * Created by lhc on 2017/2/15.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    ListView,
    InteractionManager
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../constant/fontAndColor';
import BaseComponent from '../../component/BaseComponent';
import NavigationView from '../../component/AllNavigationView';
const childItems = [];
import {request} from '../../utils/RequestUtil';
import * as Urls from '../../constant/appUrls';
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";
import * as webBackUrl from "../../constant/webBackUrl";
import AccountWebScene from './AccountWebScene';
export  default class BankCardScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            renderPlaceholderOnly: 'blank',
            source: []
        };
    }

    initFinish = () => {
        this.getData();
    }

    allRefresh = () => {
        this.setState({
            renderPlaceholderOnly: 'loading',
        });
        this.getData();
    }

    getData = () => {
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    enter_base_ids: datas.company_base_id,
                    child_type: '1'
                };
                request(Urls.USER_ACCOUNT_INFO, 'Post', maps)
                    .then((response) => {
                            this.getBankData(datas.company_base_id,response.mjson.data.account.account_open_type);
                        },
                        (error) => {
                            this.setState({
                                renderPlaceholderOnly: 'error',
                            });
                        });
            } else {
                this.setState({
                    renderPlaceholderOnly: 'error',
                });
            }
        })
    }

    getBankData=(id,type)=>{
        let maps = {
            enter_base_id: id,
            user_type: type
        };
        request(Urls.USER_BANK_QUERY, 'Post', maps)
            .then((response) => {
                    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                    this.setState({
                        renderPlaceholderOnly: 'success',
                        source:ds.cloneWithRows(response.mjson.data.bank_card_no)
                    });
                },
                (error) => {
                    this.setState({
                        renderPlaceholderOnly: 'error',
                    });
                });
    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        }
        return (
            <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1}}>
                <ListView
                    removeClippedSubviews={false}
                    style={{marginTop: Pixel.getTitlePixel(79),marginRight:Pixel.getPixel(15),marginLeft:Pixel.getPixel(15)}}
                    dataSource={this.state.source}
                    renderRow={this._renderRow}
                />
                <NavigationView
                    title="银行卡"
                    backIconClick={this.backPage}
                />
            </View>
        );
    }

    _renderRow = (movie, sectionId, rowId) => {
        return (
            <View
                style={{ height: Pixel.getPixel(100),backgroundColor: '#fff', flexDirection: 'row'
                    ,width:width-Pixel.getPixel(30),borderWidth: 1,borderColor: fontAndColor.COLORA4,
                    borderRadius:Pixel.getPixel(6),paddingRight:Pixel.getPixel(15),paddingLeft:Pixel.getPixel(15)
                }}>
                <View style={{flex:2,justifyContent:'center'}}>
                    <Text allowFontScaling={false}  style={{fontSize: Pixel.getFontPixel(17),color:'#000'}}>银行卡号</Text>
                    <Text allowFontScaling={false} 
                        style={{fontSize: Pixel.getFontPixel(15),color:fontAndColor.COLORA1,marginTop:Pixel.getPixel(5)}}>
                        {movie}
                    </Text>
                </View>
                <TouchableOpacity onPress={()=>{
                        this.getNoBankData();
                    }} activeOpacity={0.8} style={{flex:1,justifyContent:'center',alignItems: 'flex-end'}}>
                    <Text allowFontScaling={false}  style={{fontSize: Pixel.getFontPixel(15),color:fontAndColor.COLORA2}}>解除绑定</Text>
                </TouchableOpacity>
            </View>
        )


    }

    getNoBankData=()=>{
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    enter_base_ids: datas.company_base_id,
                    child_type: '1'
                };
                request(Urls.USER_ACCOUNT_INFO, 'Post', maps)
                    .then((response) => {
                            this.unBind(datas.company_base_id,response.mjson.data.account.account_open_type)
                        },
                        (error) => {
                            if (error.mycode == -300 || error.mycode == -500) {
                                this.props.showToast('获取账户信息失败');
                            } else {
                                this.props.showToast(error.mjson.msg);
                            }
                        });
            } else {
                this.props.showModal(false);
                this.props.showToast('获取账户信息失败');
            }
        })
    }

    unBind=(id,type)=>{
        let maps = {
            enter_base_id: id,
            reback_url:webBackUrl.UNBINDCARD,
            user_type:type
        };
        request(Urls.USER_BANK_UNBIND, 'Post', maps)
            .then((response) => {
                    this.props.showModal(false);
                    this.toNextPage({name:'AccountWebScene',component:AccountWebScene,params:{
                        title:'解绑银行卡',webUrl:response.mjson.data.auth_url+
                        '?authTokenId='+response.mjson.data.auth_token,callBack:()=>{
                            this.props.callBack();
                        },backUrl:webBackUrl.UNBINDCARD
                    }});
                },
                (error) => {
                    if (error.mycode == -300 || error.mycode == -500) {
                        this.props.showToast('解绑失败');
                    } else {
                        this.props.showToast(error.mjson.msg);
                    }
                });
    }


    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor: fontAndColor.COLORA3}}>
                {this.loadView()}
                <NavigationView
                    title="银行卡"
                    backIconClick={this.backPage}
                />
            </View>
        );
    }


}
const styles = StyleSheet.create({

    image: {
        width: 43,
        height: 43,
    },
    Separator: {
        backgroundColor: fontAndColor.COLORA3,
        height: Pixel.getPixel(10),

    },
    margin: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)

    },
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'}
})