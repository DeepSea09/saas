/**
 * Created by hanmeng on 2017/5/13.
 * 收银台
 */

import React, {Component, PropTypes} from 'react'

import {
    StyleSheet,
    View,
    Text,
    BackAndroid,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native'

const {width, height} = Dimensions.get('window');
import BaseComponent from "../component/BaseComponent";
import NavigatorView from '../component/AllNavigationView';
import * as fontAndColor from '../constant/fontAndColor';
import PixelUtil from '../utils/PixelUtil';
import MyButton from "../component/MyButton";
import ExplainModal from "../mine/myOrder/component/ExplainModal";
import * as AppUrls from "../constant/appUrls";
import {request} from "../utils/RequestUtil";
import AccountScene from "../mine/accountManage/RechargeScene";
import StorageUtil from "../utils/StorageUtil";
import * as StorageKeyNames from "../constant/storageKeyNames";
import * as webBackUrl from "../constant/webBackUrl";
import AccountWebScene from "../mine/accountManage/AccountWebScene";
import ChooseModal from "../mine/myOrder/component/ChooseModal";
const Pixel = new PixelUtil();

export default class StorageCheckStand extends BaseComponent {

    constructor(props) {
        super(props);
        this.accountInfo = '';
        this.transSerialNo = '';
        this.isShowFinancing = 0;
        this.creditBalanceMny = 0;
        this.isConfigUserAuth = 0;
        this.state = {
            renderPlaceholderOnly: 'blank',
            isRefreshing: false
        }
    }

    componentDidMount() {
        try {
            BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
        } catch (e) {

        } finally {
            this.setState({renderPlaceholderOnly: 'loading'});
            this.initFinish();
        }
    }

    initFinish = () => {
        this.loadData();
    };

    loadData = () => {
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                this.isDoneCredit = datas.is_done_credit;
                //this.creditBalanceMny = datas.credit_balance_mny;
                let maps = {
                    enter_base_ids: datas.company_base_id,
                };
                let url = AppUrls.USER_ACCOUNT_INFO;
                request(url, 'post', maps).then((response) => {
                    this.props.showModal(false);
                    this.accountInfo = response.mjson.data.account;
                    if (this.accountInfo) {
                        this.setState({
                            isRefreshing: false,
                            renderPlaceholderOnly: 'success'
                        });
                    } else {
                        this.props.showToast('用户信息查询失败');
                        this.setState({
                            isRefreshing: false,
                            renderPlaceholderOnly: 'null'
                        });
                    }
                }, (error) => {
                    this.props.showToast('用户信息查询失败');
                    this.setState({
                        isRefreshing: false,
                        renderPlaceholderOnly: 'error'
                    });
                });
            } else {
                this.props.showToast('用户信息查询失败');
            }
        });
    };

    /**
     *   非物流支付返回的View
     **/
    normalPay = () => {
        return (
            <View style={{backgroundColor: 'white'}}>
                <View style={styles.needPayBar}>
                    <Text allowFontScaling={false} style={{
                        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                        marginTop: Pixel.getPixel(25)
                    }}>需支付金额</Text>
                    <Text allowFontScaling={false} style={{
                        marginTop: Pixel.getPixel(6),
                        //fontWeight: 'bold',
                        fontSize: Pixel.getFontPixel(38)
                    }}>{parseFloat(this.props.payAmount).toFixed(2)}元</Text>
                </View>
                <View style={styles.separatedLine}/>
                <View style={styles.accountBar}>
                    <Text allowFontScaling={false} style={styles.title}>账户：</Text>
                    <Text allowFontScaling={false}
                          style={styles.content}>{this.accountInfo.bank_card_name + ' ' + this.accountInfo.bank_card_no}</Text>
                </View>
                <View style={styles.separatedLine}/>
                <View style={styles.accountBar}>
                    <Text allowFontScaling={false} style={styles.title}>账户可用金额：</Text>
                    <Text allowFontScaling={false} style={styles.content}>{this.accountInfo.balance}元</Text>
                    <View style={{flex: 1}}/>
                    <TouchableOpacity
                        onPress={() => {
                            this.toNextPage({
                                name: 'AccountScene',
                                component: AccountScene,
                                params: {}
                            });
                        }}>
                        <View style={{
                            height: Pixel.getPixel(27),
                            width: Pixel.getPixel(70),
                            borderRadius: Pixel.getPixel(2),
                            borderWidth: Pixel.getPixel(1),
                            borderColor: fontAndColor.COLORB0,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: Pixel.getPixel(15)
                        }}>
                            <Text allowFontScaling={false} style={{
                                fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                                color: fontAndColor.COLORB0
                            }}>充值</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    };


    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return ( <View style={styles.container}>
                {this.loadView()}
                <NavigatorView title='收银台' backIconClick={this.backPage}/>
            </View>);
        } else {
            return (
                <View style={styles.container}>
                    <NavigatorView title='收银台' backIconClick={this.backPage}/>
                    <ScrollView style={{marginTop: Pixel.getTitlePixel(65)}}>
                        {this.normalPay()}
                        <MyButton buttonType={MyButton.TEXTBUTTON}
                                  content={'账户支付'}
                                  parentStyle={styles.loginBtnStyle}
                                  childStyle={styles.loginButtonTextStyle}
                                  mOnPress={this.goStorePay}/>
                        <ExplainModal ref='expModal' title='提示' buttonStyle={styles.expButton}
                                      textStyle={styles.expText}
                                      text='确定' content='此车在质押中，需要卖方解除质押后可申请订单融资。'/>
                        <ChooseModal ref='chooseModal' title='提示'
                                     negativeButtonStyle={styles.negativeButtonStyle}
                                     negativeTextStyle={styles.negativeTextStyle} negativeText='取消'
                                     positiveButtonStyle={styles.positiveButtonStyle}
                                     positiveTextStyle={styles.positiveTextStyle} positiveText='确认'
                                     buttonsMargin={Pixel.getPixel(20)}
                                     positiveOperation={() => {}}
                                     prompt="温馨提示: 选择后无法修改"
                                     content=''/>
                    </ScrollView>
                </View>
            )
        }
    }

    /**
     *  申请提车函后支付仓储费回调
     */
    checkStorePay = () => {
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    company_id: datas.company_base_id,
                    order_id: this.props.orderId,
                    trans_serial_no: this.transSerialNo
                };
                let url = AppUrls.PAY_STORE_AMOUNT_CALLBACK;
                request(url, 'post', maps).then((response) => {
                    if (response.mjson.msg === 'ok' && response.mjson.code === 1) {
                        if (response.mjson.data.pay_status == 1) {
                            this.props.showToast('支付成功');
                            this.props.callBack();
                            let navigator = this.props.navigator;
                            for (let i = 0; i < navigator.getCurrentRoutes().length; i++) {
                                if (navigator.getCurrentRoutes()[i].name == 'ProcurementOrderDetailScene') {
                                    navigator.popToRoute(navigator.getCurrentRoutes()[i]);
                                    break;
                                }
                            }
                        } else {
                            this.props.showToast('支付失败');
                        }
                    } else {
                        this.props.showToast(response.mjson.msg);
                    }
                }, (error) => {
                    //this.props.showToast('账户支付检查失败');
                    this.props.showToast(error.mjson.msg);
                });
            } else {
                this.props.showToast('账户支付检查失败');
            }
        });
    };


    /**
     *  申请提车函后支付仓储费
     */
    goStorePay = () => {
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    company_id: datas.company_base_id,
                    order_id: this.props.orderId,
                    reback_url: webBackUrl.PAY
                };
                let url = AppUrls.PAY_STORE_AMOUNT;
                request(url, 'post', maps).then((response) => {
                    //this.loadData();
                    //this.props.showToast('支付成功');
                    if (response.mjson.msg === 'ok' && response.mjson.code === 1) {
                        this.props.showModal(false);
                        this.transSerialNo = response.mjson.data.trans_serial_no;
                        this.toNextPage({
                            name: 'AccountWebScene',
                            component: AccountWebScene,
                            params: {
                                title: '支付',
                                webUrl: response.mjson.data.auth_url + '?authTokenId=' + response.mjson.data.auth_token,
                                callBack: () => {
                                    this.checkStorePay()
                                },// 这个callBack就是点击webview容器页面的返回按钮后"收银台"执行的动作
                                backUrl: webBackUrl.PAY
                            }
                        });
                    } else {
                        this.props.showToast(response.mjson.msg);
                    }
                }, (error) => {
                    //this.props.showToast('账户支付失败');
                    this.props.showToast(error.mjson.msg);
                });
            } else {
                this.props.showToast('账户支付失败');
            }
        });
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Pixel.getPixel(0),   //设置listView 顶在最上面
        backgroundColor: fontAndColor.COLORA3
    },
    needPayBar: {
        alignItems: 'center',
        height: Pixel.getPixel(110),
        backgroundColor: 'white'
    },
    separatedLine: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15),
        height: 1,
        backgroundColor: fontAndColor.COLORA4
    },
    accountBar: {
        flexDirection: 'row',
        height: Pixel.getPixel(43),
        backgroundColor: 'white',
        alignItems: 'center'
    },
    title: {
        marginLeft: Pixel.getPixel(15),
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        color: fontAndColor.COLORA1
    },
    content: {
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28)
    },
    loginBtnStyle: {
        height: Pixel.getPixel(44),
        width: width - Pixel.getPixel(30),
        backgroundColor: fontAndColor.COLORB0,
        marginTop: Pixel.getPixel(30),
        marginBottom: Pixel.getPixel(30),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Pixel.getPixel(4),
        marginLeft: Pixel.getPixel(15)
    },
    loginButtonTextStyle: {
        color: fontAndColor.COLORA3,
        fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT)
    },
    loginBtnStyle1: {
        height: Pixel.getPixel(44),
        width: width - Pixel.getPixel(30),
        backgroundColor: fontAndColor.COLORB1,
        marginTop: Pixel.getPixel(20),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Pixel.getPixel(4),
        marginLeft: Pixel.getPixel(15)
    },
    expButton: {
        marginBottom: Pixel.getPixel(20),
        width: Pixel.getPixel(100),
        height: Pixel.getPixel(32),
        marginTop: Pixel.getPixel(32),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        borderWidth: 1,
        backgroundColor: fontAndColor.COLORB0,
        borderColor: fontAndColor.COLORB0
    },
    expText: {
        fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),
        color: '#ffffff'
    },
    tradingCountdown: {
        marginTop: Pixel.getTitlePixel(65),
        flexDirection: 'row',
        alignItems: 'center',
        height: Pixel.getPixel(70),
        backgroundColor: fontAndColor.COLORB6
    },
    negativeButtonStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Pixel.getPixel(100),
        height: Pixel.getPixel(32),
        borderRadius: 3,
        borderWidth: 1,
        borderColor: fontAndColor.COLORB0
    },
    negativeTextStyle: {
        fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),
        color: fontAndColor.COLORB0
    },
    positiveButtonStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: Pixel.getPixel(15),
        backgroundColor: fontAndColor.COLORB0,
        width: Pixel.getPixel(100),
        height: Pixel.getPixel(32),
        borderRadius: 3,
        borderWidth: 1,
        borderColor: fontAndColor.COLORB0
    },
    positiveTextStyle: {
        fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),
        color: '#ffffff'
    },
});