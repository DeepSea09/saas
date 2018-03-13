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
import {request} from '../../utils/RequestUtil';
import * as Urls from '../../constant/appUrls';
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";
import Switch from './component/Switch';
import AccountDeductProtocolScene from "./AccountDeductProtocolScene";
import OpenTrustAccountView from "./component/OpenTrustAccountView";
export  default class AccountSettingScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            renderPlaceholderOnly: 'blank',
            protocolType:0,
            accountOpenType: this.props.accountOpenType,
            trustAccountState: this.props.trustAccountState,
            onlyTrustAccount: false
        };
    }

    initFinish=()=>{

        this.loadData();
    }

    allRefresh=()=>{
        this.loadData();
    }

    loadData=()=>{

        this.setState({
            renderPlaceholderOnly:'loading'
        });
        let maps = {
            api: Urls.FIRST_REPAYMENT_CONTRACT,
        };
        request(Urls.FINANCE, 'Post', maps).then((response) => {
                this.contractData = response.mjson.data;
                this.setState({
                    renderPlaceholderOnly:'success',
                    protocolType:response.mjson.data.open_status,
                });
            },
            (error) => {
                this.setState({onlyTrustAccount: true, renderPlaceholderOnly: 'success'});
            });
    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        }
        let trustAccountState = this.state.trustAccountState == 0 ? '未开通' : '已开通';
        let trustAccountStateColor = this.state.trustAccountState == 0 ? fontAndColor.COLORB2 : fontAndColor.COLORA1;
        return (
            <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1,paddingTop:Pixel.getTitlePixel(64)}}>
                {/*<View style={{marginTop:Pixel.getTitlePixel(15),backgroundColor:'#fff'*/}
                {/*,paddingRight: Pixel.getPixel(15),*/}
                 {/*paddingLeft:Pixel.getPixel(15),height:Pixel.getPixel(44),flexDirection: 'row'}}>*/}
                    {/*<View style={{flex:1,justifyContent:'center'}}>*/}
                        {/*<Text allowFontScaling={false}  style={{color:'#000',fontSize: Pixel.getFontPixel(14)}}>开通电子账户</Text>*/}
                    {/*</View>*/}
                    {/*<View style={{flex:1,justifyContent:'center',alignItems: 'flex-end'}}>*/}
                            {/*<Switch/>*/}
                    {/*</View>*/}
                {/*</View>*/}
                {
                    !this.state.onlyTrustAccount && (
                        <TouchableOpacity style={styles.cellView} onPress={this.pushDeductProtocol}>
                            <View style={{justifyContent: 'center'}}>
                                <Text allowFontScaling={false}
                                      style={{color: '#000', fontSize: Pixel.getFontPixel(14)}}>电子账户还款设置</Text>
                                {
                                    this.state.protocolType == 1 && (
                                        <Text allowFontScaling={false} style={{
                                            color: fontAndColor.COLORA1,
                                            fontSize: Pixel.getFontPixel(12),
                                            marginTop: Pixel.getPixel(5)
                                        }}>查看《账户划扣授权委托书》</Text>
                                    )
                                }
                            </View>
                            <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                <Text allowFontScaling={false} style={[{
                                    color: fontAndColor.COLORB2,
                                    fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28)
                                }, this.state.protocolType == 1 && {color: fontAndColor.COLORA1}]}>{this.state.protocolType == 1 ? '已开启' : '未开启'}</Text>
                                <Image style={{marginLeft: Pixel.getPixel(5)}}
                                       source={require('../../../images/mainImage/celljiantou.png')}/>
                            </View>
                        </TouchableOpacity>)
                }
                <View style={{height: Pixel.getPixel(5), backgroundColor: fontAndColor.COLORA3}}/>
                {
                    this.state.accountOpenType == 2 && (<TouchableOpacity style={styles.cellView}
                                      onPress={this.getTrustContract}>
                        <View style={{justifyContent: 'center'}}>
                            <Text allowFontScaling={false} style={{color: '#000', fontSize: Pixel.getFontPixel(14)}}>升级开通“转呗”</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                            <Text allowFontScaling={false} style={{color: trustAccountStateColor, fontSize: Pixel.getFontPixel(14)}}>{trustAccountState}</Text>
                            <Image style={{marginLeft: Pixel.getPixel(5)}}
                                   source={require('../../../images/mainImage/celljiantou.png')}/>
                        </View>
                    </TouchableOpacity>)
                }
                <OpenTrustAccountView ref="openAccount" callBack={this.openTrustAccount}
                                      showModal={this.props.showModal}
                                      navigator={this.props.navigator}/>
                <NavigationView
                    title="账户设置"
                    backIconClick={this.backPage}
                />
            </View>
        );
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor: fontAndColor.COLORA3}}>
                {this.loadView()}
                <NavigationView
                    title="账户设置"
                    backIconClick={this.backPage}
                />
            </View>
        );
    }

    /**
     *   获取信托相关可供浏览的合同
     **/
    getTrustContract = () => {
        if (this.state.trustAccountState == 0) {
            this.props.showModal(true);
            let maps = {
                source_type: '3',
                fund_channel: '信托'
            };
            request(Urls.AGREEMENT_LISTS, 'Post', maps)
                .then((response) => {
                    this.props.showModal(false);
                    //console.log('USER_ACCOUNT_INFO=====', response.mjson.data['zsyxt'].status);
                    /*                this.toNextPage({
                     name: 'AccountFlowScene',
                     component: AccountFlowScene, params: {}
                     })*/
                    this.contractList = response.mjson.data.list;
                    this.refs.openAccount.changeStateWithData(true, this.contractList);
                }, (error) => {
                    this.props.showModal(false);
                    this.props.showToast(error.mjson.msg);
                });
        }
    };

    /**
     *   开通信托账户
     **/
    openTrustAccount = () => {
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1) {
                let datas = JSON.parse(data.result);
                let maps = {
                    enter_base_id: datas.company_base_id
                    //enter_base_id: 8018
                };
                request(Urls.OPEN_PERSON_TRUST_ACCOUNT, 'Post', maps)
                    .then((response) => {
                        this.props.showModal(false);
                        this.props.showToast('升级成功');
                        //this.trustAccountState = 3;
                        // 此接口未返回开户成功后的账户状态，手动置为3，
                        // 配合setState用以触发AccountTitle中componentWillReceiveProps生命周期方法
                        this.props.changeState(3);
                        this.setState({
                            trustAccountState: 3
                        });
                    }, (error) => {
                        this.props.showModal(false);
                        this.props.showToast(error.mjson.msg);
                    });
            } else {
                this.props.showModal(false);
                this.props.showToast('升级失败');
            }
        });
    };

    pushDeductProtocol=()=>{
        if (this.props.userLevel != 2) {
            this.props.showToast('您的账户未授信，请先去授信');
        } else {
            this.toNextPage({
                name: 'AccountDeductProtocolScene',
                component: AccountDeductProtocolScene,
                params: {
                    protocolType:this.state.protocolType,
                    contractData:this.contractData,
                }
            });
        }
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
    topViewStyle: {
        flex: 1,
        height: Pixel.getPixel(44),
        justifyContent: 'center'
    },
    cellView:{
        marginTop:Pixel.getTitlePixel(15),
        backgroundColor:'#fff',
        paddingRight: Pixel.getPixel(15),
        paddingLeft:Pixel.getPixel(15),
        flexDirection: 'row',
        paddingVertical:Pixel.getPixel(10),
        alignItems:'center',
        justifyContent:'space-between',
    }
})