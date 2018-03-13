/**
 * Created by lhc on 2017/2/15.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    ListView,
    InteractionManager,
    TouchableWithoutFeedback
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../constant/fontAndColor';
import BaseComponent from '../../component/BaseComponent';
import NavigationView from '../../component/AllNavigationView';
import WithdrawalsInput from './component/WithdrawalsInput';
import WithdrawalsDialog from './component/WithdrawalsDialog';
import {request} from '../../utils/RequestUtil';
import * as Urls from '../../constant/appUrls';
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";
import * as webBackUrl from "../../constant/webBackUrl";
import AccountWebScene from './AccountWebScene';
import WithdrawalsAboutScene from './WithdrawalsAboutScene';
export  default class WithdrawalsScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        this.hight = Platform.OS === 'android' ? height + Pixel.getPixel(25) : height;
        this.state = {
            renderPlaceholderOnly: 'blank',
            id: '',
            type: '',
            cardNumber: '',
        };
    }

    initFinish = () => {

        StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data) => {
            if (data.code == 1) {
                let userData = JSON.parse(data.result);
                StorageUtil.mGetItem(String(userData['base_user_id'] + StorageKeyNames.HF_INDICATIVE_LAYER), (subData) => {
                    if (subData.code == 1) {
                        let obj = JSON.parse(subData.result);
                        if (obj == null) {
                            obj = {};
                        }
                        if (obj[StorageKeyNames.HF_WITHDRAW_BUTTON] == null) {
                            obj[StorageKeyNames.HF_WITHDRAW_BUTTON] = false;
                            obj[StorageKeyNames.HF_WITHDRAW_INSTRUCTION] = false;
                            StorageUtil.mSetItem(String(userData['base_user_id'] + StorageKeyNames.HF_INDICATIVE_LAYER), JSON.stringify(obj), () => {})
                        }
                        this.setState({
                            renderPlaceholderOnly: 'success',
                            mbtxShow: obj[StorageKeyNames.HF_WITHDRAW_BUTTON],
                            mbslsjShow: obj[StorageKeyNames.HF_WITHDRAW_INSTRUCTION],

                        })
                    }

                })

            }
        })

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
                            this.getBankData(datas.company_base_id, response.mjson.data.account.account_open_type);
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

    getBankData = (id, type) => {
        let maps = {
            enter_base_id: id,
            user_type: type
        };
        request(Urls.USER_BANK_QUERY, 'Post', maps)
            .then((response) => {
                    this.setState({
                        renderPlaceholderOnly: 'success',
                        id: id,
                        type: type,
                        cardNumber: response.mjson.data.bank_card_no[0]
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
                <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1}}>
                    <View style={{backgroundColor: '#fff',width:width,
                height:Pixel.getPixel(44),justifyContent:'center',
                marginTop:Pixel.getTitlePixel(79),paddingLeft:Pixel.getPixel(15),
                paddingRight:Pixel.getPixel(15)}}>
                        <Text allowFontScaling={false}
                              style={{fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),color: '#000'}}>
                            银行卡号：{this.state.cardNumber}</Text>
                    </View>
                    <View style={{backgroundColor: '#fff',width:width,height:Pixel.getPixel(146),justifyContent:'center',
                marginTop:Pixel.getPixel(10),paddingLeft: Pixel.getPixel(15),paddingRight:Pixel.getPixel(15)}}>
                        <View style={{flex:1,justifyContent:'center'}}>
                            <Text allowFontScaling={false}
                                  style={{fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),color: '#000'}}>
                                提取金额(元)</Text>
                        </View>
                        <WithdrawalsInput ref="withdrawalsinput"/>
                        <View
                            style={{backgroundColor: fontAndColor.COLORA3,width:width-Pixel.getPixel(30),height:Pixel.getPixel(1)}}></View>
                        <View style={{flex:1,flexDirection: 'row',alignItems: 'center'}}>
                            <Text allowFontScaling={false}
                                  style={{fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),color: fontAndColor.COLORA1}}>
                                可提现金额：</Text>
                            <Text allowFontScaling={false}
                                  style={{fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),color: '#000'}}>
                                {this.props.money}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={()=>{
                        this.withdrawals();
                }} activeOpacity={0.8} style={{marginTop:Pixel.getPixel(28),marginLeft:Pixel.getPixel(15),marginRight:Pixel.getPixel(15),
                borderRadius: Pixel.getPixel(4),backgroundColor: fontAndColor.COLORB0,width:width-Pixel.getPixel(30),
                height:Pixel.getPixel(44),justifyContent:'center',alignItems: 'center'}}>
                        <Text allowFontScaling={false} style={{fontSize: Pixel.getPixel(15),color: '#fff'}}>
                            提现</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{
                        this.toNextPage({name:'WithdrawalsAboutScene',component:WithdrawalsAboutScene,params:{

                        }})
                    }} activeOpacity={0.8} style={{marginTop:Pixel.getPixel(15),width:width,alignItems:'center'}}>
                        <Text allowFontScaling={false}
                              style={{fontSize: Pixel.getPixel(14),color: fontAndColor.COLORB4}}>
                            银行受理及到账时间 ></Text>
                    </TouchableOpacity>
                    <Text allowFontScaling={false} style={{color: fontAndColor.COLORA1,fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                              marginTop:Pixel.getPixel(20),marginLeft:Pixel.getPixel(15),marginRight:Pixel.getPixel(15),lineHeight:18}}>
                        提现可能由于某些不可抗拒因素造成无法实时到账或账户余额对应不上等问题，原因如下:{"\n"}
                        1.提现过程中异常操作，如中途取消，网络异常等，当出现异常操作时为保证您的资金安全我们将对提现金额进行短暂冻结{"\n"}
                        2.提现成功后银行返回的提现成功结果延迟

                    </Text>

                </View>
                <NavigationView
                    title="提现"
                    backIconClick={this.backPage}
                />
                {
                    this.state.mbtxShow == false ?
                        <View style={{position: 'absolute',bottom:0,top:0,width:width}}>
                            <TouchableWithoutFeedback

                                onPress={()=>{

                                    StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data)=>{
                                        if (data.code ==1){
                                            let userData = JSON.parse(data.result);
                                            StorageUtil.mGetItem( String(userData['base_user_id']+StorageKeyNames.HF_INDICATIVE_LAYER) ,(subData)=>{
                                                if (subData.code == 1){
                                                    let obj = JSON.parse(subData.result);
                                                    obj[StorageKeyNames.HF_WITHDRAW_BUTTON] = true;
                                                    StorageUtil.mSetItem(String(userData['base_user_id']+StorageKeyNames.HF_INDICATIVE_LAYER), JSON.stringify(obj), ()=>{
                                                        this.setState({
                                                            mbtxShow: obj[StorageKeyNames.HF_WITHDRAW_BUTTON],
                                                            mbslsjShow: obj[StorageKeyNames.HF_WITHDRAW_INSTRUCTION],
                                                        })

                                                    })

                                                }
                                            })
                                        }
                                    })


                                }}
                                >
                                <Image style={{resizeMode:'stretch',width:width,height:Pixel.getPixel(660)}}
                                       source={Platform.OS === 'android'?require('../../../images/tishimengban/tixian_android.png'):require('../../../images/tishimengban/tixian.png')}/>
                            </TouchableWithoutFeedback>
                            <View style = {{flex:1, backgroundColor:'rgba(0,0,0,.7)'}}/>
                        </View> : null
                }
                {
                    this.state.mbslsjShow == false && this.state.mbtxShow == true ?
                        <View style={{position: 'absolute',bottom:0,top:0,width:width}}>
                            <TouchableWithoutFeedback

                                onPress={()=>{

                                    StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data)=>{
                                        if (data.code ==1){
                                            let userData = JSON.parse(data.result);
                                            StorageUtil.mGetItem( String(userData['base_user_id']+StorageKeyNames.HF_INDICATIVE_LAYER) ,(subData)=>{
                                                if (subData.code == 1){
                                                    let obj = JSON.parse(subData.result);
                                                    obj[StorageKeyNames.HF_WITHDRAW_INSTRUCTION] = true;
                                                    StorageUtil.mSetItem(String(userData['base_user_id']+StorageKeyNames.HF_INDICATIVE_LAYER), JSON.stringify(obj), ()=>{
                                                        this.setState({
                                                            mbtxShow: obj[StorageKeyNames.HF_WITHDRAW_BUTTON],
                                                            mbslsjShow: obj[StorageKeyNames.HF_WITHDRAW_INSTRUCTION],
                                                        })

                                                    })

                                                }
                                            })
                                        }
                                    })


                                }}
                            >
                                <Image style={{resizeMode:'stretch',width:width,height:Pixel.getPixel(660)}}
                                       source={Platform.OS === 'android'?require('../../../images/tishimengban/shoulitime_andr.png'):require('../../../images/tishimengban/shoulitime.png')}/>
                            </TouchableWithoutFeedback>
                            <View style = {{flex:1, backgroundColor:'rgba(0,0,0,.7)'}}/>
                        </View> : null
                }
            </View >
        );
    }

    withdrawals = () => {
        let money = this.refs.withdrawalsinput.getTextValue();
        if (money == '') {
            this.props.showToast('请输入提现金额');
            return;
        }
        this.props.showModal(true);
        let maps = {
            amount: money,
            enter_base_id: this.state.id,
            oper_flag: '1',
            reback_url: webBackUrl.WITHDRAWALS,
            user_type: this.state.type,
        };
        request(Urls.USER_ACCOUNT_WITHDRAW, 'Post', maps)
            .then((response) => {
                    this.props.showModal(false);
                    this.toNextPage({
                        name: 'AccountWebScene', component: AccountWebScene, params: {
                            title: '提现', webUrl: response.mjson.data.auth_url +
                            '?authTokenId=' + response.mjson.data.auth_token, callBack: () => {
                                this.props.callBack();
                            }, backUrl: webBackUrl.WITHDRAWALS
                        }
                    });
                },
                (error) => {
                    if (error.mycode == -300 || error.mycode == -500) {
                        this.props.showToast('提现失败');
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
                    title="提现"
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
        height: 1,

    },
    margin: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)

    },
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'}
})