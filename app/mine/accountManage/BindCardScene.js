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
let childItems = [];
import {request} from '../../utils/RequestUtil';
import * as Urls from '../../constant/appUrls';
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";
import * as webBackUrl from "../../constant/webBackUrl";
import OpenIndividualAccountScene from './OpenIndividualAccountScene';
import OpenEnterpriseAccountScene from './OpenEnterpriseAccountScene';
import AccountWebScene from './AccountWebScene';
export  default class BindCardScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        childItems = [];
        childItems.push({
            title: '绑定银行卡',
            value: require('../../../images/mainImage/bindcard.png'), click: () => {
                this.getAccountData(1);
            }
        });
        childItems.push({
            title: '修改账户信息',
            value: require('../../../images/mainImage/changeaccount.png'), click: () => {
                this.getAccountData(2);
            }
        });
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            renderPlaceholderOnly: 'blank',
            source: ds.cloneWithRows(childItems)
        };
    }

    getAccountData = (clickType) => {
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
                            if (clickType == 1) {
                                this.bindCard(datas.company_base_id, response.mjson.data.account.account_open_type)
                            } else {
                                this.props.showModal(false);
                                if (response.mjson.data.account.account_open_type == '1') {
                                    this.toNextPage({
                                        name: 'OpenEnterpriseAccountScene',
                                        component: OpenEnterpriseAccountScene,
                                        params: {isChange:'true',callBack:()=>{
                                            this.props.callBack();
                                        },title:'修改企业账户',buttonText:'确认修改'}
                                    });
                                } else {
                                    this.toNextPage({
                                        name: 'OpenIndividualAccountScene',
                                        component: OpenIndividualAccountScene,
                                        params: {isChange:'true',callBack:()=>{
                                            this.props.callBack();
                                        },title:'修改个人账户',buttonText:'确认修改'}
                                    });
                                }
                            }
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
                this.props.showToast('用户信息查询失败');
            }
        })
    }

    bindCard = (enter_base_id, user_type) => {
        let maps = {
            enter_base_id: enter_base_id,
            user_type: user_type,
            reback_url: webBackUrl.BINDCARD
        };

        request(Urls.USER_BANK_BIND, 'Post', maps)
            .then((response) => {
                    this.props.showModal(false);
                    this.toNextPage({
                        name: 'AccountWebScene', component: AccountWebScene, params: {
                            title: '绑定银行卡', webUrl: response.mjson.data.auth_url +
                            '?authTokenId=' + response.mjson.data.auth_token, callBack: () => {
                                this.props.callBack();
                            }, backUrl: webBackUrl.BINDCARD

                        }
                    });
                },
                (error) => {
                    if (error.mycode == -300 || error.mycode == -500) {
                        this.props.showToast('获取账户信息失败');
                    } else {
                        this.props.showToast(error.mjson.msg);
                    }
                });
    }

    initFinish = () => {
        this.setState({
            renderPlaceholderOnly: 'success',
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
                    style={{marginTop: Pixel.getTitlePixel(79)}}
                    dataSource={this.state.source}
                    renderRow={this._renderRow}
                    renderSeparator={this._renderSeparator}
                    renderFooter={this._renderFooter}
                />
                <NavigationView
                    title="绑定银行卡"
                    backIconClick={this.backPage}
                />
            </View>
        );
    }
	_renderFooter() {

		return (
            <View >
                <Text allowFontScaling={false}  style={{color: fontAndColor.COLORA1,fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                              marginTop:Pixel.getPixel(20),marginLeft:Pixel.getPixel(15),marginRight:Pixel.getPixel(15),lineHeight:18}}>
                    1.绑定银行卡时请注意，如果提醒绑定信息错误，超过三次，银行将对银行卡进行锁定，请谨慎操作。{"\n"}
                    2.请输入您名下正确的卡号及银行预留信息，否则可能造成绑卡失败。{"\n"}
                    3.银行反馈绑卡结果可能会有延迟，请耐心等待。

                </Text>
            </View>



		)
	}
    _renderRow = (movie, sectionId, rowId) => {
        return (
            <TouchableOpacity onPress={()=>{
                movie.click();
            }} activeOpacity={0.8}
                              style={{width:width,height:Pixel.getPixel(44),backgroundColor:'#fff',flexDirection: 'row'}}>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Image style={{width:Pixel.getPixel(24),height:Pixel.getPixel(24)}}
                           source={movie.value}/>
                </View>
                <View style={{flex:4,justifyContent:'center'}}>
                    <Text allowFontScaling={false}  style={{fontSize: Pixel.getFontPixel(14),color: '#000'}}>{movie.title}</Text>
                </View>
                <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                    <Image style={{width:Pixel.getPixel(14),height:Pixel.getPixel(14),marginRight:Pixel.getPixel(15)}}
                           source={require('../../../images/mainImage/celljiantou.png')}/>
                </View>
            </TouchableOpacity>
        )

    }

    _renderSeparator(sectionId, rowId) {

        return (
            <View style={styles.Separator} key={sectionId + rowId}>
            </View>
        )
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor: fontAndColor.COLORA3}}>
                {this.loadView()}
                <NavigationView
                    title="绑定银行卡"
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
        height: Pixel.getPixel(1),


    },
    margin: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)

    },
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'}
})