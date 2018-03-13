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
    TextInput
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
import DDApplyLendScene from "./lend/DDApplyLendScene";
import ChooseModal from "../mine/myOrder/component/ChooseModal";
const Pixel = new PixelUtil();

export default class CheckStand extends BaseComponent {

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
                this.creditBalanceMny = datas.credit_balance_mny;
                let maps = {
                    enter_base_ids: datas.company_base_id,
                };
                let url = AppUrls.USER_ACCOUNT_INFO;
                request(url, 'post', maps).then((response) => {
                    this.props.showModal(false);
                    this.accountInfo = response.mjson.data.account;
                    if (this.accountInfo) {
                        if (this.props.payType == 2) {
                            this.getConfigUserAuth();
                        } else {
                            this.setState({
                                isRefreshing: false,
                                renderPlaceholderOnly: 'success'
                            });
                        }
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
     *   检查此订单卖家是否是"线下支付"白名单用户
     **/
    getConfigUserAuth = () => {
        // 车辆正在质押状态
        if (this.props.isSellerFinance == 1) {
            this.getMergeWhitePoStatus();
        } else {
            // "线下支付"白名单接口
            StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
                if (data.code == 1 && data.result != null) {
                    let datas = JSON.parse(data.result);
                    let maps = {
                        type: 1,
                        //value: datas.company_base_id
                        value: this.props.orderId,
                        company_id: datas.company_base_id
                    }
                    let url = AppUrls.IS_CONFIG_USER_AUTH;
                    request(url, 'post', maps).then((response) => {
                        this.isConfigUserAuth = response.mjson.data.status;
                        this.getMergeWhitePoStatus();
                    }, (error) => {
                        //this.props.showToast(error.mjson.msg);
                        this.getMergeWhitePoStatus();
                    });
                } else {
                    //this.props.showToast('账户检查失败');
                    this.getMergeWhitePoStatus();
                }
            });
        }
    };

    /**
     *  鼎诚支付、 线下支付提示框
     **/
    payPrompting = (type) => {
        let negativeText = '';
        let positiveText = '';
        let content = '';
        let positiveOperation = '';
        if (type === 0) {
            negativeText = '取消';
            positiveText = '确认';
            content = '您确认选择鼎诚融资代付？';
            positiveOperation = this.dingChengPay;
            this.refs.chooseModal.changeShowType(true, negativeText, positiveText, content, positiveOperation);
        } else {
            negativeText = '取消';
            positiveText = '确认';
            content = '您确认选择线下支付？';
            positiveOperation = this.dingOfflinePay;
            this.refs.chooseModal.changeShowType(true, negativeText, positiveText, content, positiveOperation);
        }
    };

    /**
     *   鼎诚支付
     **/
    dingChengPay = () => {
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    company_id: datas.company_base_id,
                    order_id: this.props.orderId,
                    logistics_type: this.props.logisticsType,
                    reback_url: webBackUrl.PAY,
                    pay_type: 1
                };
                let url = AppUrls.PAY_BALANCE;
                request(url, 'post', maps).then((response) => {
                    if (response.mjson.msg === 'ok' && response.mjson.code === 1) {
                        this.props.callBack();
                        this.backPage();
                    } else {
                        this.props.showToast(response.mjson.msg);
                    }
                }, (error) => {
                    this.props.showToast(error.mjson.msg);
                });
            } else {
                this.props.showToast('账户支付检查失败');
            }
        });
    };

    /**
     *   线下支付
     **/
    dingOfflinePay = () => {
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    company_id: datas.company_base_id,
                    order_id: this.props.orderId,
                    logistics_type: this.props.logisticsType,
                    reback_url: webBackUrl.PAY,
                    pay_type: 2
                };
                let url = AppUrls.PAY_BALANCE;
                request(url, 'post', maps).then((response) => {
                    if (response.mjson.msg === 'ok' && response.mjson.code === 1) {
                        this.props.callBack();
                        this.backPage();
                    } else {
                        this.props.showToast(response.mjson.msg);
                    }
                }, (error) => {
                    this.props.showToast(error.mjson.msg);
                });
            } else {
                this.props.showToast('账户支付检查失败');
            }
        });
    };

    /**
     *  检查用户是否是"订单融资"白名单用户
     */
    getMergeWhitePoStatus = () => {
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let isDoneCredit = datas.is_done_credit;
                let mergeId = datas.merge_id;
                //let mergeId = 1110;
                if (isDoneCredit == 0) {
                    this.isShowFinancing = 0;
                    this.setState({
                        isRefreshing: false,
                        renderPlaceholderOnly: 'success'
                    });
                } else {
                    let maps = {
                        api: AppUrls.ORDER_GET_MERGE_WHITE_PO_STATUS,
                        merge_id: mergeId
                    };
                    let url = AppUrls.FINANCE;
                    request(url, 'post', maps).then((response) => {
                        if (response.mjson.code === 1) {
                            this.isShowFinancing = 1;
                            this.setState({
                                isRefreshing: false,
                                renderPlaceholderOnly: 'success'
                            });
                        } else {
                            this.isShowFinancing = 0;
                            this.setState({
                                isRefreshing: false,
                                renderPlaceholderOnly: 'success'
                            });
                        }
                    }, (error) => {
                        this.isShowFinancing = 0;
                        this.setState({
                            isRefreshing: false,
                            renderPlaceholderOnly: 'success'
                        });
                    });
                }
            } else {
                this.isShowFinancing = 0;
                this.setState({
                    isRefreshing: false,
                    renderPlaceholderOnly: 'success'
                });
            }
        });
    };

    /**
     *   物流支付返回的View
     **/
    logisticsPay = () => {
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
                    }}>{(parseFloat(this.props.payAmount) + parseFloat(this.props.transAmount)).toFixed(2)}元</Text>
                </View>
                <View style={styles.separatedLine}/>
                <View style={styles.accountBar}>
                    <Text allowFontScaling={false} style={styles.title}>尾款金额：</Text>
                    <Text allowFontScaling={false}
                          style={styles.content}>{parseFloat(this.props.payAmount)}元</Text>
                </View>
                <View style={styles.separatedLine}/>
                <View style={styles.accountBar}>
                    <Text allowFontScaling={false} style={styles.title}>运单费用：</Text>
                    <Text allowFontScaling={false} style={styles.content}>{this.props.transAmount}元</Text>
                </View>
                <View style={{height: Pixel.getPixel(10),
                    backgroundColor: fontAndColor.COLORA3}}/>
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

    /**
     *
     * */
    pageRouting = (logisticsType) => {
        //console.log('this.props.payType====', this.props.payType);
        if (logisticsType && (this.props.payType == 2 || this.props.payType == 6)) {
            return this.logisticsPay();
        } else {
            return this.normalPay();
        }
        //return this.normalPay();
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
                        {this.pageRouting(this.props.logisticsType)}
                        <MyButton buttonType={MyButton.TEXTBUTTON}
                                  content={'账户支付'}
                                  parentStyle={styles.loginBtnStyle}
                                  childStyle={styles.loginButtonTextStyle}
                                  mOnPress={this.goPay}/>
                        {this.props.isSellerFinance == 0 && this.props.payType == 2 && !this.props.logisticsType &&
                        (<MyButton buttonType={MyButton.TEXTBUTTON}
                                   content={'鼎诚融资代付'}
                                   parentStyle={[styles.loginBtnStyle, {marginTop: Pixel.getPixel(0)}]}
                                   childStyle={styles.loginButtonTextStyle}
                                   mOnPress={() => {
                                       this.payPrompting(0)
                                   }}/>)
                        }
                        {this.props.isSellerFinance == 0 && this.isConfigUserAuth == 1 && this.props.payType == 2
                        && !this.props.logisticsType &&
                        (<MyButton buttonType={MyButton.TEXTBUTTON}
                                   content={'线下支付'}
                                   parentStyle={[styles.loginBtnStyle, {marginTop: Pixel.getPixel(0)}]}
                                   childStyle={styles.loginButtonTextStyle}
                                   mOnPress={() => {
                                       this.payPrompting(1)
                                   }}/>)
                        }
                        {/*---订单融资---*/}
                        {this.isShowFinancing == 1 && this.props.payType == 2 &&
                        <View>
                            <View style={{
                                alignItems: 'center',
                                flexDirection: 'row',
                                //marginTop: Pixel.getPixel(35)
                            }}>
                                <View style={{
                                    marginRight: Pixel.getPixel(15),
                                    marginLeft: Pixel.getPixel(15),
                                    backgroundColor: fontAndColor.COLORA1,
                                    height: 1,
                                    flex: 1
                                }}/>
                                <Text allowFontScaling={false} style={{
                                    fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                                    color: fontAndColor.COLORA1
                                }}>可选融资方案</Text>
                                <View style={{
                                    marginRight: Pixel.getPixel(15),
                                    marginLeft: Pixel.getPixel(15),
                                    backgroundColor: fontAndColor.COLORA1,
                                    height: 1,
                                    flex: 1
                                }}/>
                            </View>
                            <MyButton
                                mOnPress={this.goApplyLoan}
                                buttonType={MyButton.TEXTBUTTON}
                                content={'订单融资'}
                                parentStyle={styles.loginBtnStyle1}
                                childStyle={styles.loginButtonTextStyle}/>
                            <Text allowFontScaling={false} style={{
                                marginLeft: Pixel.getPixel(15),
                                marginRight: Pixel.getPixel(15),
                                fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                                color: fontAndColor.COLORA1,
                                marginTop: Pixel.getPixel(10)
                            }}>车辆交易背景下的，基于车辆买卖订单的，对买车人购车的融资业务。</Text>
                        </View> }
                        <ExplainModal ref='expModal' title='提示' buttonStyle={styles.expButton}
                                      textStyle={styles.expText}
                                      text='确定' content='此车在质押中，需要卖方解除质押后可申请订单融资。'/>
                        <ChooseModal ref='chooseModal' title='提示'
                                     negativeButtonStyle={styles.negativeButtonStyle}
                                     negativeTextStyle={styles.negativeTextStyle} negativeText='取消'
                                     positiveButtonStyle={styles.positiveButtonStyle}
                                     positiveTextStyle={styles.positiveTextStyle} positiveText='确认'
                                     buttonsMargin={Pixel.getPixel(20)}
                                     positiveOperation={() => {
                                     }}
                                     prompt="温馨提示: 选择后无法修改"
                                     content=''/>
                    </ScrollView>
                </View>
            )
        }
    }

    /**
     *   全款支付检查
     **/
    checkFullPay = () => {
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    company_id: datas.company_base_id,
                    order_id: this.props.orderId,
                    trans_serial_no: this.transSerialNo
                };
                let url = AppUrls.ORDER_CHECK_PAY_FULL;
                request(url, 'post', maps).then((response) => {
                    if (response.mjson.msg === 'ok' && response.mjson.code === 1) {
                        if (response.mjson.data.pay_status == 1) {
                            this.props.showToast('支付成功');
                            this.props.callBack();
                            this.backPage();
                        } else {
                            this.props.showToast('支付失败');
                        }
                    } else {
                        this.props.showToast(response.mjson.msg);
                    }
                }, (error) => {
                    this.props.showToast(error.mjson.msg);
                });
            } else {
                this.props.showToast('账户支付检查失败');
            }
        });
    };

    /**
     *  订金、尾款支付检查
     */
    checkPay = () => {
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    company_id: datas.company_base_id,
                    order_id: this.props.orderId,
                    type: this.props.payType,
                    trans_serial_no: this.transSerialNo
                };
                let url = AppUrls.ORDER_CHECK_PAY;
                request(url, 'post', maps).then((response) => {
                    if (response.mjson.msg === 'ok' && response.mjson.code === 1) {
                        if (response.mjson.data.pay_status == 1) {
                            this.props.showToast('支付成功');
                            this.props.callBack();
                            this.backPage();
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
     *  首付款支付检查
     */
    checkInitialPay = () => {
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    company_id: datas.company_base_id,
                    order_id: this.props.orderId,
                    trans_serial_no: this.transSerialNo
                };
                let url = AppUrls.FIRST_PAYMENT_PAY_CALLBACK;
                request(url, 'post', maps).then((response) => {
                    if (response.mjson.msg === 'ok' && response.mjson.code === 1) {
                        if (response.mjson.data.pay_status == 1) {
                            this.props.showToast('支付成功');
                            this.props.callBack();
                            this.backPage();
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
     *  跳转订单融资申请页
     */
    goApplyLoan = () => {
        this.props.showModal(true);
        if (this.props.pledgeType == 1 && this.props.pledgeStatus == 1) {
            this.refs.expModal.changeShowType(true, '提示', '此车在质押中，需要卖方解除质押后可申请订单融资。', '确定');
        } else {
            StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
                if (data.code == 1 && data.result != null) {
                    let datas = JSON.parse(data.result);
                    let mergeId = datas.merge_id;
                    let maps = {
                        //api: AppUrls.ADD_PLATFORM_ORDER_CAR,
                        merge_id: mergeId,
                        platform_car_id: this.props.carId,
                        platform_order_number: this.props.orderNo,
                        register_seller_user_id: this.props.sellerId
                    };
                    let url = AppUrls.ADD_PLATFORM_ORDER_CAR;
                    request(url, 'Post', maps).then((response) => {
                        if (response.mjson.msg === 'ok' && response.mjson.code === 1) {
                            if (response.mjson.data.status === 1) {
                                this.props.showModal(false);
                                this.toNextPage({
                                    name: 'DDApplyLendScene',
                                    component: DDApplyLendScene,
                                    params: {
                                        orderNo: this.props.orderNo,
                                        orderId: this.props.orderId,
                                        callBack: this.props.callBack,
                                        sceneName: 'CheckStand'
                                    }
                                });
                            } else {
                                this.props.showToast(response.mjson.msg);
                            }
                        } else {
                            this.props.showToast(response.mjson.msg);
                        }
                    }, (error) => {
                        //this.props.showToast('确认验收失败');
                        this.props.showToast('添加订单融资车辆失败');
                    });
                } else {
                    this.props.showToast('添加订单融资车辆失败');
                }
            });
        }
    };

    /**
     *  支付分发
     */
    goPay = () => {
/*        if (this.props.payType == 1 || this.props.payType == 2) {
            if (this.props.payFull) {
                this.goFullPay();
            } else {
                this.goDepositPay();
            }
        } else {
            this.goInitialPay();
        }*/
        if (this.props.payType == 1) {
            this.goDepositPay();
        } else if (this.props.payType == 2) {
            this.goBalancePay();
        } else {
            this.goInitialPay();
        }
    };

    /**
     *  全款支付
     */
    goFullPay = () => {
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    company_id: datas.company_base_id,
                    order_id: this.props.orderId,
                    reback_url: webBackUrl.PAY
                };
                let url = AppUrls.ORDER_PAY_FULL;
                request(url, 'post', maps).then((response) => {
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
                                    this.checkFullPay()
                                },// 这个callBack就是点击webview容器页面的返回按钮后"收银台"执行的动作
                                backUrl: webBackUrl.PAY
                            }
                        });
                    } else {
                        this.props.showToast(response.mjson.msg);
                    }
                }, (error) => {
                    this.props.showToast(error.mjson.msg);
                });
            } else {
                this.props.showToast('账户支付失败');
            }
        });
    };

    /**
     *  首付款支付
     */
    goInitialPay = () => {
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    company_id: datas.company_base_id,
                    order_id: this.props.orderId,
                    back_url: webBackUrl.PAY,
                    loan_amount: this.props.applyLoanAmount,
                    finance_no: this.props.financeNo
                };
                let url = AppUrls.FIRST_PAYMENT_PAY;
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
                                    this.checkInitialPay()
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
    };

    /**
     *  订金支付
     */
    goDepositPay = () => {
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    company_id: datas.company_base_id,
                    order_id: this.props.orderId,
                    type: this.props.payType,
                    reback_url: webBackUrl.PAY
                };
                let url = AppUrls.ORDER_PAY;
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
                                    this.checkPay()
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

    /**
     *  尾款、全款支付
     */
    goBalancePay = () => {
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    company_id: datas.company_base_id,
                    order_id: this.props.orderId,
                    logistics_type: this.props.logisticsType ? 1 : 0,
                    reback_url: webBackUrl.PAY,
                    pay_type: 0
                };
                let url = AppUrls.PAY_BALANCE;
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
                                    this.checkPay()
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