/**
 * Created by hanmeng on 2017/5/11.
 */

import React, {Component, PropTypes} from 'react'

import {
    StyleSheet,
    View,
    Text,
    ListView,
    TouchableOpacity,
    Image,
    Dimensions,
    BackAndroid,
    RefreshControl,
    Platform,
    NativeModules,
    Linking
} from  'react-native'

const {width, height} = Dimensions.get('window');
import BaseComponent from "../../component/BaseComponent";
import NavigatorView from '../../component/AllNavigationView';
import * as fontAndColor from '../../constant/fontAndColor';
import PixelUtil from '../../utils/PixelUtil';
import DepositCountDown from "./component/DepositCountDown";
import GetCarCountDown from "./component/GetCarCountDown";
import StepView from "./component/StepView";
import * as AppUrls from "../../constant/appUrls";
import {request} from "../../utils/RequestUtil";
import ExplainModal from "./component/ExplainModal";
import ContactLayout from "./component/ContactLayout";
import ChooseModal from "./component/ChooseModal";
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";
import AccountWebScene from "../accountManage/AccountWebScene";
import WebScene from "../../main/WebScene";
import ContractWebScene from "./ContractWebScene";
import ContractScene from "./ContractScene";
import LoanInfo from "./component/LoanInfo";
import DDDetailScene from "../../finance/lend/DDDetailScene";
import ProcurementInfo from "./component/ProcurementInfo";
import AccountScene from "../accountManage/AccountScene";
import CancelOrderReasonScene from "./CancelOrderReasonScene";
import CheckStand from "./CheckStand";
const Pixel = new PixelUtil();

export default class ProcurementOrderDetailScene extends BaseComponent {

    /**
     *   constructor
     **/
    constructor(props) {
        super(props);
        this.items = [];
        this.mList = [];
        this.listViewStyle = Pixel.getPixel(0);
        this.orderDetail = '';
        this.orderState = -1;
        this.topState = -1;
        this.bottomState = -1;
        this.contactData = {};
        this.leftTime = 0;
        this.financeInfo = {};
        this.companyId = 0;
        this.applyLoanAmount = '请输入申请贷款金额';
        this.state = {
            dataSource: [],
            renderPlaceholderOnly: 'blank',
            isRefreshing: false
        }
    }

    /**
     *
     **/
    componentDidMount() {
        try {
            BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
        } catch (e) {
        } finally {
            this.setState({renderPlaceholderOnly: 'loading'});
            this.initFinish();
        }
    }

    /**
     * from @hanmeng
     **/
    initFinish = () => {
        this.loadData();
    };

    /**
     * from @hanmeng
     *
     *
     **/
    dateReversal = (time) => {
        const date = new Date();
        date.setTime(time);
        return (date.getFullYear() + "-" + (this.PrefixInteger(date.getMonth() + 1, 2)) + "-" +
        (this.PrefixInteger(date.getDate(), 2)));
    };

    /**
     * from @hanmeng
     **/
    PrefixInteger = (num, length) => {
        return (Array(length).join('0') + num).slice(-length);
    };

    /**
     * 获取订单剩余时间
     * @param serverTime
     * @param createdTime  订单创建时间
     **/
    getLeftTime = (serverTime, createdTime) => {
        let currentTime = new Date(serverTime.replace(/-/g, '/')).valueOf();
        let oldTime = new Date(createdTime.replace(/-/g, '/')).valueOf();
        return parseFloat(currentTime) - parseFloat(oldTime);
    };

    /**
     * 判断订单详情页显示内容
     * @param orderState   订单状态
     * @param merchantNum   商家电话
     * @param customerServiceNum   客服电话
     **/
    initListData = (orderState, merchantNum, customerServiceNum) => {
        switch (orderState) {
            case 0: //创建订单
                this.mList = [];
                this.items = [];
                this.contactData = {};
                this.mList = ['0', '1', '3', '6'];
                this.contactData = {
                    layoutTitle: '已拍下',
                    layoutContent: '请先与卖家联系商议成交价，待卖家确认后支付订金。',
                    setPrompt: false,
                    MerchantNum: merchantNum,
                    CustomerServiceNum: customerServiceNum
                };
                this.items.push({title: '创建订单', nodeState: 1, isLast: false, isFirst: true});
                this.items.push({title: '已付订金', nodeState: 2, isLast: false, isFirst: false});
                this.items.push({title: '结清尾款', nodeState: 2, isLast: false, isFirst: false});
                this.items.push({title: '完成交易', nodeState: 2, isLast: true, isFirst: false});
                break;
            case 1: // 待付订金
                this.mList = [];
                this.items = [];
                this.contactData = {};
                this.mList = ['0', '1', '2', '3', '4', '6'];
                this.contactData = {
                    layoutTitle: '付订金',
                    layoutContent: '请尽快支付订金' + this.orderDetail.deposit_amount + '元，支付后卖家可查看到账金额，但不可提现。',
                    setPrompt: true,
                    promptTitle: '订金说明',
                    promptContent: '交付订金后卖家会为您保留车源，且卖家不可提现，如果交易最终未完成，您可以和卖家协商退回订金。',
                    MerchantNum: merchantNum,
                    CustomerServiceNum: customerServiceNum
                };
                this.items.push({title: '创建订单', nodeState: 1, isLast: false, isFirst: true});
                this.items.push({title: '已付订金', nodeState: 2, isLast: false, isFirst: false});
                this.items.push({title: '结清尾款', nodeState: 2, isLast: false, isFirst: false});
                this.items.push({title: '完成交易', nodeState: 2, isLast: true, isFirst: false});
                break;
            case 2: // 已付订金(待付尾款)
                this.mList = [];
                this.items = [];
                this.contactData = {};
                this.mList = ['0', '1', '3', '4', '6'];
                if (this.orderDetail.totalpay_amount > 0) {
                    this.contactData = {
                        layoutTitle: '付全款',
                        layoutContent: '支付后卖家可查看到账金额，但不可提现。',
                        setPrompt: false
                    };
                    this.items.push({title: '创建订单', nodeState: 1, isLast: false, isFirst: true});
                    this.items.push({title: '已付全款', nodeState: 2, isLast: false, isFirst: false});
                    this.items.push({title: '完成交易', nodeState: 2, isLast: true, isFirst: false});
                } else {
                    this.contactData = {
                        layoutTitle: '付尾款',
                        layoutContent: '支付后卖家可查看到账金额，但不可提现。',
                        setPrompt: false
                    };
                    this.items.push({title: '创建订单', nodeState: 0, isLast: false, isFirst: true});
                    this.items.push({title: '已付订金', nodeState: 1, isLast: false, isFirst: false});
                    this.items.push({title: '结清尾款', nodeState: 2, isLast: false, isFirst: false});
                    this.items.push({title: '完成交易', nodeState: 2, isLast: true, isFirst: false});
                }
                break;
            case 3: // 全款付清
                this.mList = [];
                this.items = [];
                this.contactData = {};
                this.mList = ['0', '1', '2', '3', '4', '6'];
                this.contactData = {
                    layoutTitle: '全款已付清',
                    layoutContent: '确认验收车辆后卖家可提款，手续齐全。',
                    setPrompt: false,
                    MerchantNum: merchantNum,
                    CustomerServiceNum: customerServiceNum
                };
                if (this.orderDetail.totalpay_amount > 0) {
                    this.items.push({title: '创建订单', nodeState: 0, isLast: false, isFirst: true});
                    this.items.push({title: '已付全款', nodeState: 1, isLast: false, isFirst: false});
                    this.items.push({title: '完成交易', nodeState: 2, isLast: true, isFirst: false});
                } else {
                    this.items.push({title: '创建订单', nodeState: 0, isLast: false, isFirst: true});
                    this.items.push({title: '已付订金', nodeState: 0, isLast: false, isFirst: false});
                    this.items.push({title: '结清尾款', nodeState: 1, isLast: false, isFirst: false});
                    this.items.push({title: '完成交易', nodeState: 2, isLast: true, isFirst: false});
                }
                break;
            case 4: // 已完成
                this.mList = [];
                this.items = [];
                this.contactData = {};
                this.mList = ['0', '1', '3', '4', '6'];
                this.contactData = {
                    layoutTitle: '已完成',
                    layoutContent: '恭喜您交易已完成',
                    setPrompt: false,
                    MerchantNum: merchantNum,
                    CustomerServiceNum: customerServiceNum
                };
                if (this.orderDetail.totalpay_amount > 0) {
                    this.items.push({title: '创建订单', nodeState: 0, isLast: false, isFirst: true});
                    this.items.push({title: '已付全款', nodeState: 0, isLast: false, isFirst: false});
                    this.items.push({title: '完成交易', nodeState: 1, isLast: true, isFirst: false});
                } else {
                    this.items.push({title: '创建订单', nodeState: 0, isLast: false, isFirst: true});
                    this.items.push({title: '已付订金', nodeState: 0, isLast: false, isFirst: false});
                    this.items.push({title: '结清尾款', nodeState: 0, isLast: false, isFirst: false});
                    this.items.push({title: '完成交易', nodeState: 1, isLast: true, isFirst: false});
                }
                break;
            case 5: // 订单融资处理中
                this.mList = [];
                if (this.orderDetail.status === 16) {
                    this.contactData = {};
                    this.mList = ['1', '3', '7'];
                    this.contactData = {
                        layoutTitle: '订单融资处理中',
                        layoutContent: '恭喜您首付已经支付成功，预计10分钟内生成合同，之后请您签署',
                        setPrompt: false
                    };
                } else if (this.orderDetail.status === 17 || this.orderDetail.status === 19 || this.orderDetail.status === 20 || this.orderDetail.status === 21 || this.orderDetail.status === 22 ||
                    this.orderDetail.status === 23 || this.orderDetail.status === 24) {
                    this.contactData = {};
                    this.mList = ['1', '3', '7'];
                    this.contactData = {
                        layoutTitle: '订单融资处理中',
                        layoutContent: '您确认车辆无误，点击“验收确认”后，24小时内即可为您结放贷款。',
                        setPrompt: false
                    };
                } else {
                    this.mList = ['3', '7'];
                }
                break;
            case 6: // 待付首付款
                this.mList = [];
                this.items = [];
                this.contactData = {};
                this.mList = ['0', '1', '3', '4', '5', '6'];
                let amount = '  ';
                /*                if (this.applyLoanAmount === '请输入申请贷款金额') {
                 amount = '';
                 }*/
                this.contactData = {
                    layoutTitle: '付首付款',
                    layoutContent: '恭喜您的' + amount + '元贷款已经授权，请尽快支付首付款以便尽快完成融资。',
                    setPrompt: true,
                    promptTitle: '首付款说明',
                    promptContent: '车贷房贷前您需先支付首付款，卖家可查看到账金额，但不可提现。如交易最终未完成，首付款可退回。'
                };
                if (this.orderDetail.totalpay_amount > 0) {
                    this.items.push({title: '创建订单', nodeState: 1, isLast: false, isFirst: true});
                    this.items.push({title: '已付全款', nodeState: 2, isLast: false, isFirst: false});
                    this.items.push({title: '完成交易', nodeState: 2, isLast: true, isFirst: false});
                } else {
                    this.items.push({title: '创建订单', nodeState: 0, isLast: false, isFirst: true});
                    this.items.push({title: '已付订金', nodeState: 1, isLast: false, isFirst: false});
                    this.items.push({title: '结清尾款', nodeState: 2, isLast: false, isFirst: false});
                    this.items.push({title: '完成交易', nodeState: 2, isLast: true, isFirst: false});
                }
                break;
            case 7: // 融资单确认验收车辆
                this.mList = [];
                this.items = [];
                this.contactData = {};
                this.mList = ['0', '1', '2', '3', '4', '7', '6'];
                this.contactData = {
                    layoutTitle: '确认验收车辆',
                    layoutContent: '您确认车辆无误，点击"验收确认"后，24小时内即可为您结放贷款。',
                    setPrompt: false
                };
                if (this.orderDetail.totalpay_amount > 0) {
                    this.items.push({title: '创建订单', nodeState: 1, isLast: false, isFirst: true});
                    this.items.push({title: '已付全款', nodeState: 2, isLast: false, isFirst: false});
                    this.items.push({title: '完成交易', nodeState: 2, isLast: true, isFirst: false});
                } else {
                    this.items.push({title: '创建订单', nodeState: 0, isLast: false, isFirst: true});
                    this.items.push({title: '已付订金', nodeState: 1, isLast: false, isFirst: false});
                    this.items.push({title: '结清尾款', nodeState: 2, isLast: false, isFirst: false});
                    this.items.push({title: '完成交易', nodeState: 2, isLast: true, isFirst: false});
                }
                break;
            case 8: // 融资单完成交易
                this.mList = [];
                this.items = [];
                this.contactData = {};
                this.mList = ['0', '1', '3', '4', '7', '6'];
                this.contactData = {
                    layoutTitle: '已完成',
                    layoutContent: '恭喜您交易已完成',
                    setPrompt: false
                };
                if (this.orderDetail.totalpay_amount > 0) {
                    this.items.push({title: '创建订单', nodeState: 0, isLast: false, isFirst: true});
                    this.items.push({title: '已付全款', nodeState: 0, isLast: false, isFirst: false});
                    this.items.push({title: '完成交易', nodeState: 1, isLast: true, isFirst: false});
                } else {
                    this.items.push({title: '创建订单', nodeState: 0, isLast: false, isFirst: true});
                    this.items.push({title: '已付订金', nodeState: 0, isLast: false, isFirst: false});
                    this.items.push({title: '结清尾款', nodeState: 0, isLast: false, isFirst: false});
                    this.items.push({title: '完成交易', nodeState: 1, isLast: true, isFirst: false});
                }
                break;
            default:
                break;
        }
    };

    /**
     * 根据订单状态初始化详情页悬浮头
     * @param topState 页面悬浮头状态
     * @returns 返回顶部布局
     **/
    initDetailPageTop = (topState) => {
        switch (topState) {
            case 0:
                this.listViewStyle = Pixel.getPixel(0);
                return (
                    <View style={{marginTop: Pixel.getTitlePixel(65)}}>
                        <View style={styles.tradingCountdown}>
                            <Text allowFontScaling={false}>
                                <Text allowFontScaling={false} style={{
                                    fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                                    color: fontAndColor.COLORB7
                                }}>订金支付剩余时间</Text>
                                <DepositCountDown leftTime={this.leftTime}/>
                                <Text allowFontScaling={false} style={{
                                    fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                                    color: fontAndColor.COLORB7
                                }}>超时未付订单自动取消</Text>
                            </Text>
                        </View>
                        <View style={{backgroundColor: fontAndColor.COLORB8, height: 1}}/>
                    </View>
                )
                break;
            case 1:
                this.listViewStyle = Pixel.getPixel(0);
                return (
                    <View style={{marginTop: Pixel.getTitlePixel(65)}}>
                        <View style={styles.tradingCountdown}>
                            <Text allowFontScaling={false} style={{
                                marginLeft: Pixel.getPixel(15),
                                fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                                color: fontAndColor.COLORB7
                            }}>订金支付剩余时间：</Text>
                            <GetCarCountDown />
                        </View>
                        <View style={{backgroundColor: fontAndColor.COLORB8, height: 1}}/>
                    </View>
                )
                break;
            case 2:
                this.listViewStyle = Pixel.getPixel(0);
                return (
                    <View style={{marginTop: Pixel.getTitlePixel(65)}}>
                        <View style={styles.tradingCountdown}>
                            <Text allowFontScaling={false} style={{
                                marginLeft: Pixel.getPixel(15),
                                fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                                color: fontAndColor.COLORB7
                            }}>您申请的贷款已准备放款，申请发车后付款到卖家账户，卖家可提现全部车款。</Text>
                        </View>
                        <View style={{backgroundColor: fontAndColor.COLORB8, height: 1}}/>
                    </View>
                )
                break;
            case 3:
                this.listViewStyle = Pixel.getPixel(0);
                return (
                    <View style={{marginTop: Pixel.getTitlePixel(65)}}>
                        <View style={styles.tradingCountdown}>
                            <Text allowFontScaling={false} style={{
                                marginLeft: Pixel.getPixel(15),
                                fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                                color: fontAndColor.COLORB7
                            }}>正在准备放款请稍后。</Text>
                        </View>
                        <View style={{backgroundColor: fontAndColor.COLORB8, height: 1}}/>
                    </View>
                )
                break;
            default:
                this.listViewStyle = Pixel.getTitlePixel(65);
                return null;
                break;
        }
    };

    /**
     * 拨打客服
     * @param phoneNumer
     **/
    callClick = (phoneNumer) => {
        if (Platform.OS === 'android') {
            NativeModules.VinScan.callPhone(phoneNumer);
        } else {
            Linking.openURL('tel:' + phoneNumer);
        }
    };

    /**
     * 取消订单请求
     **/
    cancelOrder = () => {
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    company_id: datas.company_base_id,
                    order_id: this.orderDetail.id,
                    type: 1
                };
                let url = AppUrls.ORDER_CANCEL;
                request(url, 'post', maps).then((response) => {
                    if (response.mjson.msg === 'ok' && response.mjson.code === 1) {
                        this.loadData();
                    } else {
                        this.props.showToast(response.mjson.msg);
                    }
                }, (error) => {
                    //this.props.showToast('取消订单申请失败');
                    this.props.showToast(error.mjson.msg);
                });
            } else {
                this.props.showToast('取消订单申请失败');
            }
        });
    };


    /**
     * 普通流程确认验收请求
     **/
    confirmCar = () => {
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    company_id: datas.company_base_id,
                    order_id: this.orderDetail.id
                };
                let url = AppUrls.ORDER_CONFIRM_CAR;
                request(url, 'post', maps).then((response) => {
                    if (response.mjson.msg === 'ok' && response.mjson.code === 1) {
                        this.loadData();
                    } else {
                        this.props.showToast(response.mjson.msg);
                    }
                }, (error) => {
                    if (error.mjson.code == '6350087') {
                        this.loadData();
                    } else {
                        //this.props.showToast('确认验收失败');
                        this.props.showToast(error.mjson.msg);
                    }
                });
            } else {
                this.props.showToast('确认验收失败');
            }
        });
    };

    /**
     * 融资流程确认验收请求
     **/
    loanConfirmCar = () => {
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    company_id: datas.company_base_id,
                    order_id: this.orderDetail.id
                };
                let url = AppUrls.CONFIRM_FINANCING_ORDER;
                request(url, 'post', maps).then((response) => {
                    if (response.mjson.msg === 'ok' && response.mjson.code === 1) {
                        this.loadData();
                    } else {
                        this.props.showToast(response.mjson.msg);
                    }
                }, (error) => {
                    //this.props.showToast('确认验收失败');
                    if (error.mjson.code == '6350087' || error.mjson.code == '6350082') {
                        this.loadData();
                    } else {
                        this.props.showToast(error.mjson.msg);
                    }
                });
            } else {
                this.props.showToast('确认验收失败');
            }
        });
    };

    /**
     * 撤销取消订单请求
     **/
    revertOrder = () => {
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    company_id: datas.company_base_id,
                    order_id: this.orderDetail.id
                };
                let url = AppUrls.ORDER_REVERT;
                request(url, 'post', maps).then((response) => {
                    if (response.mjson.msg === 'ok' && response.mjson.code === 1) {
                        this.loadData();
                    } else {
                        this.props.showToast(response.mjson.msg);
                    }
                }, (error) => {
                    //this.props.showToast('恢复订单失败');
                    this.props.showToast(error.mjson.msg);
                });
            } else {
                this.props.showToast('恢复订单失败');
            }
        });
    };

    /**
     * from @hanmeng
     * 合同预览页加载
     **/
    getTypeContractInfo = (type) => {
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    company_id: datas.company_base_id,
                    order_id: this.orderDetail.id,
                    type: type
                };
                let url = AppUrls.ORDER_GET_CONTRACT;
                request(url, 'post', maps).then((response) => {
                    if (response.mjson.msg === 'ok' && response.mjson.code === 1) {
                        //console.log(response.mjson.data);
                        this.props.showModal(false);
                        this.toNextPage({
                            name: 'ContractScene',
                            component: ContractScene,
                            params: {
                                contractList: response.mjson.data.contract_image_path
                            }
                        });
                    } else {
                        this.props.showToast(response.mjson.msg);
                    }
                }, (error) => {
                    this.props.showToast(error.mjson.msg);
                });
            } else {
                this.props.showToast('查看合同失败');
            }
        });
    };

    /**
     * from @hanmeng
     **/
    payCallBack = () => {
        this.props.showModal(true);
        this.loadData();
    };

    /**
     * 根据订单状态初始化详情页悬浮底
     * @param orderState 页面悬浮底状态
     * @returns {*}
     **/
    initDetailPageBottom = (orderState) => {
        switch (orderState) {
            case 0:
                return (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity
                            onPress={() => {
                                this.refs.chooseModal.changeShowType(true, '取消', '确定', '卖家将在您发起取消申请24小时内回复，如已支付订金将与卖家协商退款。',
                                    this.cancelOrder);
                            }}>
                            <View style={styles.buttonCancel}>
                                <Text allowFontScaling={false} style={{color: fontAndColor.COLORA2}}>申请取消订单</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.refs.payModal.changeShowType(true, '提示', '请咨询卖家，确认成交价', '确定');
                            }}>
                            <View style={styles.buttonConfirm}>
                                <Text allowFontScaling={false} style={{color: '#ffffff'}}>支付</Text>
                            </View>
                        </TouchableOpacity>
                        <ChooseModal ref='chooseModal' title='提示'
                                     negativeButtonStyle={styles.negativeButtonStyle}
                                     negativeTextStyle={styles.negativeTextStyle} negativeText='取消'
                                     positiveButtonStyle={styles.positiveButtonStyle}
                                     positiveTextStyle={styles.positiveTextStyle} positiveText='确定'
                                     buttonsMargin={Pixel.getPixel(20)}
                                     positiveOperation={this.cancelOrder}
                                     content=''/>
                        <ExplainModal ref='payModal' title='提示' buttonStyle={styles.expButton}
                                      textStyle={styles.expText}
                                      text='确定' content='请咨询卖家，确认成交价'/>
                    </View>
                )
                break;
            case 1:
                let applyAmount = this.applyLoanAmount === '请输入申请贷款金额' ? 0 : this.applyLoanAmount;
                let balanceAmount = this.orderDetail.totalpay_amount > 0 ? this.orderDetail.totalpay_amount : this.orderDetail.balance_amount;
                return (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity
                            onPress={() => {
                                this.refs.chooseModal.changeShowType(true, '取消', '确定', '卖家将在您发起取消申请24小时内回复，如已支付订金将与卖家协商退款。',
                                    this.cancelOrder);
                            }}>
                            <View style={styles.buttonCancel}>
                                <Text allowFontScaling={false} style={{color: fontAndColor.COLORA2}}>申请取消订单</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                if (this.applyLoanAmount === '请输入申请贷款金额' && this.orderState == 6) {
                                    this.props.showToast('请输入申请贷款金额');
                                } else {
                                    this.toNextPage({
                                        name: 'CheckStand',
                                        component: CheckStand,
                                        params: {
                                            payAmount: this.orderState === 1 ?
                                                this.orderDetail.deposit_amount :
                                                parseFloat(balanceAmount - applyAmount +
                                                    parseFloat(this.financeInfo.obd_mny ? this.financeInfo.obd_mny : 0) +
                                                    parseFloat(this.financeInfo.fee_mny ? this.financeInfo.fee_mny : 0) +
                                                    parseFloat(this.financeInfo.supervision_fee ? this.financeInfo.supervision_fee : 0)).toFixed(2),
                                            orderId: this.props.orderId,
                                            orderNo: this.orderDetail.order_no,
                                            payType: this.orderState,
                                            payFull: this.orderDetail.totalpay_amount > 0,
                                            sellerId: this.orderDetail.seller_id,
                                            carId: this.orderDetail.orders_item_data[0].car_id,
                                            pledgeType: this.orderDetail.orders_item_data[0].car_finance_data.pledge_type,
                                            pledgeStatus: this.orderDetail.orders_item_data[0].car_finance_data.pledge_status,
                                            isSellerFinance: this.orderDetail.is_seller_finance,
                                            applyLoanAmount: this.applyLoanAmount,
                                            financeNo: this.orderDetail.finance_no,
                                            callBack: this.payCallBack
                                        }
                                    });
                                }
                            }}>
                            <View style={styles.buttonConfirm}>
                                <Text allowFontScaling={false} style={{color: '#ffffff'}}>支付</Text>
                            </View>
                        </TouchableOpacity>
                        <ChooseModal ref='chooseModal' title='提示'
                                     negativeButtonStyle={styles.negativeButtonStyle}
                                     negativeTextStyle={styles.negativeTextStyle} negativeText='取消'
                                     positiveButtonStyle={styles.positiveButtonStyle}
                                     positiveTextStyle={styles.positiveTextStyle} positiveText='确定'
                                     buttonsMargin={Pixel.getPixel(20)}
                                     positiveOperation={this.cancelOrder}
                                     content=''/>
                    </View>
                )
                break;
            case 2:
                return (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity
                            onPress={() => {
                                //this.refs.expModal.changeShowType(true, '提示', '订单尾款已结清联系客服取消订单', '确定');
                                this.toNextPage({
                                    name: 'CancelOrderReasonScene',
                                    component: CancelOrderReasonScene,
                                    params: {
                                        order_id: this.orderDetail.id,
                                        refresh: this.payCallBack
                                    }
                                });
                            }}>
                            <View style={styles.buttonCancel}>
                                <Text allowFontScaling={false} style={{color: fontAndColor.COLORA2}}>申请取消订单</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                if (this.orderState == 3) {
                                    this.refs.chooseModal.changeShowType(true, '取消', '确定', '确定后卖家可提现全款。',
                                        this.confirmCar);
                                } else if (this.orderState == 7) {
                                    this.refs.chooseModal.changeShowType(true, '取消', '确定', '确定后安排放款，放款完成后卖家可提现全款。',
                                        this.loanConfirmCar);
                                }
                                //this.props.showModal(true);
                                //this.confirmCar();
                            }}>
                            <View style={styles.buttonConfirm}>
                                <Text allowFontScaling={false} style={{color: '#ffffff'}}>确认验收</Text>
                            </View>
                        </TouchableOpacity>
                        <ChooseModal ref='chooseModal' title='注意'
                                     negativeButtonStyle={styles.negativeButtonStyle}
                                     negativeTextStyle={styles.negativeTextStyle} negativeText='取消'
                                     positiveButtonStyle={styles.positiveButtonStyle}
                                     positiveTextStyle={styles.positiveTextStyle} positiveText='确定'
                                     buttonsMargin={Pixel.getPixel(20)}
                                     positiveOperation={this.confirmCar}
                                     content=''/>
                        <ExplainModal ref='expModal' title='提示' buttonStyle={styles.expButton}
                                      textStyle={styles.expText}
                                      text='确定' content='订单尾款已结清联系客服取消订单'/>
                    </View>
                )
                break;
            case 3:
                return (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.showModal(true);
                                this.revertOrder();
                            }}>
                            <View style={[styles.buttonCancel, {width: Pixel.getPixel(137)}]}>
                                <Text allowFontScaling={false} style={{color: fontAndColor.COLORA2}}>撤回取消订单申请</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                );
                break;
            case 4:
                return (
                    <View style={[styles.bottomBar, {justifyContent: 'center'}]}>
                        <Text allowFontScaling={false} style={{
                            textAlign: 'center',
                            fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                            color: fontAndColor.COLORB0
                        }}>
                            交易关闭
                        </Text>
                    </View>
                );
                break;
            case 5:
                return (
                    <View style={[styles.bottomBar, {justifyContent: 'center'}]}>
                        <Text allowFontScaling={false} style={{
                            textAlign: 'center',
                            fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                            color: fontAndColor.COLORB0
                        }}>
                            交易已关闭(卖家同意退款)
                        </Text>
                    </View>
                );
                break;
            case 6:
                return (
                    <TouchableOpacity
                        onPress={() => {
                            this.callClick('4008365111');
                        }}>
                        <View style={[styles.bottomBar, {justifyContent: 'center', flexDirection: 'column'}]}>
                            <Text allowFontScaling={false} style={{
                                textAlign: 'center',
                                fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                                color: fontAndColor.COLORB0
                            }}>
                                交易已关闭(卖家不同意退款)
                            </Text>
                            <Text allowFontScaling={false} style={{
                                marginTop: Pixel.getPixel(5),
                                textAlign: 'center',
                                fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                                color: fontAndColor.COLORB0
                            }}>
                                点击拨打客服退款
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
                break;
            case 7:
                return (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity
                            onPress={() => {

                            }}>
                            <View style={styles.buttonCancel}>
                                <Text allowFontScaling={false} style={{color: fontAndColor.COLORA2}}>款项支付中</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )
                break;
            case 8:
                return (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity
                            onPress={() => {
                                //this.props.showModal(true);
                                //this.revertOrder();
                            }}>
                            <View style={[styles.buttonCancel, {width: Pixel.getPixel(137)}]}>
                                <Text allowFontScaling={false} style={{color: fontAndColor.COLORA2}}>正在处理中请稍后</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                );
                break;
            case 9:
                return (
                    <View style={[styles.bottomBar, {justifyContent: 'center'}]}>
                        <Text allowFontScaling={false} style={{
                            textAlign: 'center',
                            fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                            color: fontAndColor.COLORB0
                        }}>
                            交易关闭(后台取消订单)
                        </Text>
                    </View>
                );
                break;
            case 10:
                return (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity
                            onPress={() => {
                                this.refs.cancelModal.changeShowType(true, '提示', '已申请订单融资请联系客服取消订单', '确定');
                            }}>
                            <View style={styles.buttonCancel}>
                                <Text allowFontScaling={false} style={{color: fontAndColor.COLORA2}}>申请取消订单</Text>
                            </View>
                        </TouchableOpacity>
                        <ExplainModal ref='cancelModal' title='提示' buttonStyle={styles.expButton}
                                      textStyle={styles.expText}
                                      text='确定' content='订单尾款已结清联系客服取消订单'/>
                    </View>
                )
                break;
            case 11:
                return (
                    <View style={styles.bottomBar}>
                        {/*<TouchableOpacity
                         onPress={() => {
                         this.refs.chooseModal.changeShowType(true, '取消', '确定', '卖家将在您发起取消申请24小时内回复，如已支付订金将与卖家协商退款。',
                         this.cancelOrder);
                         }}>
                         <View style={styles.buttonCancel}>
                         <Text allowFontScaling={false} style={{color: fontAndColor.COLORA2}}>申请取消订单</Text>
                         </View>
                         </TouchableOpacity>*/}
                        <TouchableOpacity
                            onPress={() => {
                                if (this.orderState == 3) {
                                    this.refs.chooseModal.changeShowType(true, '取消', '确定', '确定后卖家可提现全款。',
                                        this.confirmCar);
                                } else if (this.orderState == 7) {
                                    this.refs.chooseModal.changeShowType(true, '取消', '确定', '确定后安排放款，放款完成后卖家可提现全款。',
                                        this.loanConfirmCar);
                                }
                                //this.props.showModal(true);
                                //this.confirmCar();
                            }}>
                            <View style={styles.buttonConfirm}>
                                <Text allowFontScaling={false} style={{color: '#ffffff'}}>确认验收</Text>
                            </View>
                        </TouchableOpacity>
                        <ChooseModal ref='chooseModal' title='注意'
                                     negativeButtonStyle={styles.negativeButtonStyle}
                                     negativeTextStyle={styles.negativeTextStyle} negativeText='取消'
                                     positiveButtonStyle={styles.positiveButtonStyle}
                                     positiveTextStyle={styles.positiveTextStyle} positiveText='确定'
                                     buttonsMargin={Pixel.getPixel(20)}
                                     positiveOperation={this.confirmCar}
                                     content=''/>
                    </View>
                )
                break;
            case 12:
                return (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity
                            onPress={() => {
                                this.refs.chooseModal.changeShowType(true, '取消', '确定', '卖家将在您发起取消申请24小时内回复，如已支付订金将与卖家协商退款。',
                                    this.cancelOrder);
                            }}>
                            <View style={styles.buttonCancel}>
                                <Text allowFontScaling={false} style={{color: fontAndColor.COLORA2}}>申请取消订单</Text>
                            </View>
                        </TouchableOpacity>
                        <ChooseModal ref='chooseModal' title='提示'
                                     negativeButtonStyle={styles.negativeButtonStyle}
                                     negativeTextStyle={styles.negativeTextStyle} negativeText='取消'
                                     positiveButtonStyle={styles.positiveButtonStyle}
                                     positiveTextStyle={styles.positiveTextStyle} positiveText='确定'
                                     buttonsMargin={Pixel.getPixel(20)}
                                     positiveOperation={this.cancelOrder}
                                     content=''/>
                    </View>
                )
                break;
            case 13:
                return (
                    <View style={[styles.bottomBar, {justifyContent: 'center'}]}>
                        <View style={[styles.bottomBar, {justifyContent: 'center', flexDirection: 'column'}]}>
                            <Text allowFontScaling={false} style={{
                                textAlign: 'center',
                                fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                                color: fontAndColor.COLORB0
                            }}>
                                交易已关闭
                            </Text>
                            <Text allowFontScaling={false} style={{
                                marginTop: Pixel.getPixel(5),
                                textAlign: 'center',
                                fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                                color: fontAndColor.COLORB0
                            }}>
                                订金及其它款项已退
                            </Text>
                        </View>
                    </View>
                );
                break;
            case 14:
                return (
                    <View style={[styles.bottomBar, {justifyContent: 'center'}]}>
                        <View style={[styles.bottomBar, {justifyContent: 'center', flexDirection: 'column'}]}>
                            <Text allowFontScaling={false} style={{
                                textAlign: 'center',
                                fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                                color: fontAndColor.COLORB0
                            }}>
                                交易已关闭
                            </Text>
                            <Text allowFontScaling={false} style={{
                                marginTop: Pixel.getPixel(5),
                                textAlign: 'center',
                                fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                                color: fontAndColor.COLORB0
                            }}>
                                订金补偿卖家，其它款项已退
                            </Text>
                        </View>
                    </View>
                );
                break;
            case 15:
                return (
                    <View style={[styles.bottomBar, {justifyContent: 'center'}]}>
                        <View style={[styles.bottomBar, {justifyContent: 'center', flexDirection: 'column'}]}>
                            <Text allowFontScaling={false} style={{
                                textAlign: 'center',
                                fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                                color: fontAndColor.COLORB0
                            }}>
                                交易已关闭
                            </Text>
                            <Text allowFontScaling={false} style={{
                                marginTop: Pixel.getPixel(5),
                                textAlign: 'center',
                                fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                                color: fontAndColor.COLORB0
                            }}>
                                退款处理中
                            </Text>
                        </View>
                    </View>
                );
                break;
            default:
                return null;
                break;
        }
    };

    /**
     *  根据订单详情接口的 status 和 cancel_status 字段组合判断页面渲染
     *  orderState为详情内容渲染
     *  topState为吸顶渲染 （倒计时）
     *  bottomState为吸底渲染（各种功能按钮）
     **/
    stateMapping = (status, cancelStatus) => {
        switch (status) {
            case 0:  // 已拍下，价格未定  0=>'创建订单'
            case 1:  //  1=>'订单定价中'
                if (cancelStatus === 0) {
                    this.orderState = 0;
                    this.topState = 0;
                    this.bottomState = 0;
                } else if (cancelStatus === 1) {
                    this.orderState = 0;
                    this.topState = -1;
                    this.bottomState = 3;
                } else if (cancelStatus === 2) {
                    this.orderState = 0;
                    this.topState = -1;
                    this.bottomState = 4;
                } else if (cancelStatus === 3) {
                    this.orderState = 0;
                    this.topState = -1;
                    this.bottomState = 4;
                }
                break;
            case 2: // 待付订金  2=>'订单定价完成'
            case 3: // 3=>'订金支付中'
            case 4:  // 4=>'订金支付失败'
                if (cancelStatus === 0) {
                    this.orderState = 1;
                    this.topState = 0;
                    if (status === 3) {
                        this.bottomState = 1;
                    } else {
                        this.bottomState = 1;
                    }
                } else if (cancelStatus === 1) {
                    this.orderState = 1;
                    this.topState = -1;
                    this.bottomState = 3;
                } else if (cancelStatus === 2) {
                    this.orderState = 1;
                    this.topState = -1;
                    this.bottomState = 4;
                } else if (cancelStatus === 3) {
                    this.orderState = 1;
                    this.topState = -1;
                    this.bottomState = 4;
                }

                break;
            case 5:  // 待付尾款  5=>'订金支付完成'
            case 6:  // 6=>'尾款支付中'
            case 7:  // 7=>'尾款支付失败'
            case 200:  // 200=>'待付全款',
            case 201:  // 201=>'全款支付中',
            case 202:  // 202=>'全款支付失败',
            case 50:  // 50=>'鼎城代付中',
            case 51:  // 51=>'线下支付中',
                if (cancelStatus === 0) {
                    this.orderState = 2;
                    this.topState = -1;
                    if (status === 50 || status === 51) {
                        this.bottomState = 12;
                    } else {
                        this.bottomState = 1;
                    }
                } else if (cancelStatus === 1) {
                    this.orderState = 2;
                    this.topState = -1;
                    this.bottomState = 3;
                } else if (cancelStatus === 2) {
                    this.orderState = 2;
                    this.topState = -1;
                    if (this.orderDetail.cancel_is_agree == 1) {
                        this.bottomState = 5;
                    } else if ((this.orderDetail.cancel_is_agree == 0 || this.orderDetail.cancel_is_agree == 2) &&
                        this.orderDetail.refund_data.is_who == 1 &&
                        this.orderDetail.refund_data.status == 2) {
                        this.bottomState = 13;
                    } else if ((this.orderDetail.cancel_is_agree == 0 || this.orderDetail.cancel_is_agree == 2) &&
                        this.orderDetail.refund_data.is_who == 2 &&
                        this.orderDetail.refund_data.status == 2) {
                        this.bottomState = 14;
                    } else if (this.orderDetail.cancel_is_agree == 2) {
                        this.bottomState = 6;
                    } else if (this.orderDetail.cancel_is_agree == 0 && this.orderDetail.cancel_side == 3) {
                        this.bottomState = 15;
                    } else {
                        this.bottomState = 4;
                    }
                } else if (cancelStatus === 3) {
                    this.orderState = 2;
                    this.topState = -1;
                    if (this.orderDetail.cancel_is_agree == 1) {
                        this.bottomState = 5;
                    } else if ((this.orderDetail.cancel_is_agree == 0 || this.orderDetail.cancel_is_agree == 2) &&
                        this.orderDetail.refund_data.is_who == 1 &&
                        this.orderDetail.refund_data.status == 2) {
                        this.bottomState = 13;
                    } else if ((this.orderDetail.cancel_is_agree == 0 || this.orderDetail.cancel_is_agree == 2) &&
                        this.orderDetail.refund_data.is_who == 2 &&
                        this.orderDetail.refund_data.status == 2) {
                        this.bottomState = 14;
                    } else if (this.orderDetail.cancel_is_agree == 2) {
                        this.bottomState = 6;
                    } else if (this.orderDetail.cancel_is_agree == 0 && this.orderDetail.cancel_side == 3) {
                        this.bottomState = 15;
                    } else {
                        this.bottomState = 4;
                    }
                }
                break;
            case 8: // 全款付清  8=>'尾款支付完成'
            case 203: // 203=>'全款支付完成',
            case 9: // 9=>'确认验收中'
            case 10: // 10=>'确认验收失败'
            case 90: // 90=>'质押车辆提前还款失败',
            case 91: // 91=>'质押车辆提前还款成功',
                if (cancelStatus === 0) {
                    this.orderState = 3;
                    this.topState = -1;
                    if (status === 9) {
                        this.bottomState = 8;
                    } else {
                        if (this.orderDetail.pay_type == 'dingcheng' || this.orderDetail.pay_type == 'offline') {
                            this.bottomState = 11;
                        } else {
                            this.bottomState = 2;
                        }
                    }
                } else if (cancelStatus === 1) {
                    this.orderState = 3;
                    this.topState = -1;
                    this.bottomState = 3;
                } else if (cancelStatus === 2) {
                    this.orderState = 3;
                    this.topState = -1;
                    if (this.orderDetail.cancel_is_agree == 1) {
                        this.bottomState = 5;
                    } else if ((this.orderDetail.cancel_is_agree == 0 || this.orderDetail.cancel_is_agree == 2) &&
                        this.orderDetail.refund_data.is_who == 1 &&
                        this.orderDetail.refund_data.status == 2) {
                        this.bottomState = 13;
                    } else if ((this.orderDetail.cancel_is_agree == 0 || this.orderDetail.cancel_is_agree == 2) &&
                        this.orderDetail.refund_data.is_who == 2 &&
                        this.orderDetail.refund_data.status == 2) {
                        this.bottomState = 14;
                    } else if (this.orderDetail.cancel_is_agree == 2) {
                        this.bottomState = 6;
                    } else if (this.orderDetail.cancel_is_agree == 0 && this.orderDetail.cancel_side == 3) {
                        this.bottomState = 15;
                    } else {
                        this.bottomState = 4;
                    }
                } else if (cancelStatus === 3) {
                    this.orderState = 3;
                    this.topState = -1;
                    if (this.orderDetail.cancel_is_agree == 1) {
                        this.bottomState = 5;
                    } else if ((this.orderDetail.cancel_is_agree == 0 || this.orderDetail.cancel_is_agree == 2) &&
                        this.orderDetail.refund_data.is_who == 1 &&
                        this.orderDetail.refund_data.status == 2) {
                        this.bottomState = 13;
                    } else if ((this.orderDetail.cancel_is_agree == 0 || this.orderDetail.cancel_is_agree == 2) &&
                        this.orderDetail.refund_data.is_who == 2 &&
                        this.orderDetail.refund_data.status == 2) {
                        this.bottomState = 14;
                    } else if (this.orderDetail.cancel_is_agree == 2) {
                        this.bottomState = 6;
                    } else if (this.orderDetail.cancel_is_agree == 0 && this.orderDetail.cancel_side == 3) {
                        this.bottomState = 15;
                    } else {
                        this.bottomState = 4;
                    }
                }
                break;
            case 11:  // 订单完成 11=>'确认验收完成'
                if (cancelStatus === 0) {
                    this.orderState = 4;
                    this.topState = -1;
                    this.bottomState = -1;
                } else if (cancelStatus === 1) {
                    this.orderState = 4;
                    this.topState = -1;
                    this.bottomState = 3;
                } else if (cancelStatus === 2) {
                    this.orderState = 4;
                    this.topState = -1;
                    if (this.orderDetail.cancel_is_agree == 1) {
                        this.bottomState = 5;
                    } else if ((this.orderDetail.cancel_is_agree == 0 || this.orderDetail.cancel_is_agree == 2) &&
                        this.orderDetail.refund_data.is_who == 1 &&
                        this.orderDetail.refund_data.status == 2) {
                        this.bottomState = 13;
                    } else if ((this.orderDetail.cancel_is_agree == 0 || this.orderDetail.cancel_is_agree == 2) &&
                        this.orderDetail.refund_data.is_who == 2 &&
                        this.orderDetail.refund_data.status == 2) {
                        this.bottomState = 14;
                    } else if (this.orderDetail.cancel_is_agree == 2) {
                        this.bottomState = 6;
                    } else if (this.orderDetail.cancel_is_agree == 0 && this.orderDetail.cancel_side == 3) {
                        this.bottomState = 15;
                    } else {
                        this.bottomState = 4;
                    }
                } else if (cancelStatus === 3) {
                    this.orderState = 4;
                    this.topState = -1;
                    if (this.orderDetail.cancel_is_agree == 1) {
                        this.bottomState = 5;
                    } else if ((this.orderDetail.cancel_is_agree == 0 || this.orderDetail.cancel_is_agree == 2) &&
                        this.orderDetail.refund_data.is_who == 1 &&
                        this.orderDetail.refund_data.status == 2) {
                        this.bottomState = 13;
                    } else if ((this.orderDetail.cancel_is_agree == 0 || this.orderDetail.cancel_is_agree == 2) &&
                        this.orderDetail.refund_data.is_who == 2 &&
                        this.orderDetail.refund_data.status == 2) {
                        this.bottomState = 14;
                    } else if (this.orderDetail.cancel_is_agree == 2) {
                        this.bottomState = 6;
                    } else if (this.orderDetail.cancel_is_agree == 0 && this.orderDetail.cancel_side == 3) {
                        this.bottomState = 15;
                    } else {
                        this.bottomState = 4;
                    }
                }
                break;
            case 12:  //12=>'订单融资处理中',
            case 16:  //16=>'支付首付款完成',
            case 17:  //17=>'融资单确认验收中',
            case 19:  //19=>'融资单放款成功',
            case 20:  //20=>'融资单放款失败',
            case 21:  //21=>'融资单质押车辆提前还款中',
            case 22:  //22=>'融资单质押车辆提前还款失败',
            case 23:  //23=>'融资单质押车辆提前还款成功',
            case 24:  //24=>'融资单确认验收失败',
                if (cancelStatus === 0) {
                    this.orderState = 5;
                    this.topState = -1;
                    if (status === 17 || status === 19 || status === 20 || status === 21 || status === 22 ||
                        status === 23 || status === 24) {
                        this.bottomState = -1;
                    } else {
                        this.bottomState = 12;
                    }
                } else if (cancelStatus === 1) {
                    this.orderState = 5;
                    this.topState = -1;
                    this.bottomState = 3;
                } else if (cancelStatus === 2) {
                    this.orderState = 5;
                    this.topState = -1;
                    if (this.orderDetail.cancel_is_agree == 1) {
                        this.bottomState = 5;
                    } else if ((this.orderDetail.cancel_is_agree == 0 || this.orderDetail.cancel_is_agree == 2) &&
                        this.orderDetail.refund_data.is_who == 1 &&
                        this.orderDetail.refund_data.status == 2) {
                        this.bottomState = 13;
                    } else if ((this.orderDetail.cancel_is_agree == 0 || this.orderDetail.cancel_is_agree == 2) &&
                        this.orderDetail.refund_data.is_who == 2 &&
                        this.orderDetail.refund_data.status == 2) {
                        this.bottomState = 14;
                    } else if (this.orderDetail.cancel_is_agree == 2) {
                        this.bottomState = 6;
                    } else if (this.orderDetail.cancel_is_agree == 0 && this.orderDetail.cancel_side == 3) {
                        this.bottomState = 15;
                    } else {
                        this.bottomState = 4;
                    }
                } else if (cancelStatus === 3) {
                    this.orderState = 5;
                    this.topState = -1;
                    if (this.orderDetail.cancel_is_agree == 1) {
                        this.bottomState = 5;
                    } else if ((this.orderDetail.cancel_is_agree == 0 || this.orderDetail.cancel_is_agree == 2) &&
                        this.orderDetail.refund_data.is_who == 1 &&
                        this.orderDetail.refund_data.status == 2) {
                        this.bottomState = 13;
                    } else if ((this.orderDetail.cancel_is_agree == 0 || this.orderDetail.cancel_is_agree == 2) &&
                        this.orderDetail.refund_data.is_who == 2 &&
                        this.orderDetail.refund_data.status == 2) {
                        this.bottomState = 14;
                    } else if (this.orderDetail.cancel_is_agree == 2) {
                        this.bottomState = 6;
                    } else if (this.orderDetail.cancel_is_agree == 0 && this.orderDetail.cancel_side == 3) {
                        this.bottomState = 15;
                    } else {
                        this.bottomState = 4;
                    }
                }
                break;
            case 13:  //13=>'订单融资完成',
            case 14:  //14=>'支付首付款中',
            case 15:  //15=>'支付首付款失败',
                if (cancelStatus === 0) {
                    this.orderState = 6;
                    this.topState = -1;
                    if (status === 6) {
                        this.bottomState = 1;
                    } else {
                        this.bottomState = 1;
                    }
                } else if (cancelStatus === 1) {
                    this.orderState = 6;
                    this.topState = -1;
                    this.bottomState = 3;
                } else if (cancelStatus === 2) {
                    this.orderState = 6;
                    this.topState = -1;
                    if (this.orderDetail.cancel_is_agree == 1) {
                        this.bottomState = 5;
                    } else if ((this.orderDetail.cancel_is_agree == 0 || this.orderDetail.cancel_is_agree == 2) &&
                        this.orderDetail.refund_data.is_who == 1 &&
                        this.orderDetail.refund_data.status == 2) {
                        this.bottomState = 13;
                    } else if ((this.orderDetail.cancel_is_agree == 0 || this.orderDetail.cancel_is_agree == 2) &&
                        this.orderDetail.refund_data.is_who == 2 &&
                        this.orderDetail.refund_data.status == 2) {
                        this.bottomState = 14;
                    } else if (this.orderDetail.cancel_is_agree == 2) {
                        this.bottomState = 6;
                    } else if (this.orderDetail.cancel_is_agree == 0 && this.orderDetail.cancel_side == 3) {
                        this.bottomState = 15;
                    } else {
                        this.bottomState = 4;
                    }
                } else if (cancelStatus === 3) {
                    this.orderState = 6;
                    this.topState = -1;
                    if (this.orderDetail.cancel_is_agree == 1) {
                        this.bottomState = 5;
                    } else if ((this.orderDetail.cancel_is_agree == 0 || this.orderDetail.cancel_is_agree == 2) &&
                        this.orderDetail.refund_data.is_who == 1 &&
                        this.orderDetail.refund_data.status == 2) {
                        this.bottomState = 13;
                    } else if ((this.orderDetail.cancel_is_agree == 0 || this.orderDetail.cancel_is_agree == 2) &&
                        this.orderDetail.refund_data.is_who == 2 &&
                        this.orderDetail.refund_data.status == 2) {
                        this.bottomState = 14;
                    } else if (this.orderDetail.cancel_is_agree == 2) {
                        this.bottomState = 6;
                    } else if (this.orderDetail.cancel_is_agree == 0 && this.orderDetail.cancel_side == 3) {
                        this.bottomState = 15;
                    } else {
                        this.bottomState = 4;
                    }
                }
                break;
            case 18:  //18=>'融资单确认验收失败',
            case 160:  //160=>'支付首付款完成',
                if (cancelStatus === 0) {
                    this.orderState = 7;
                    this.topState = -1;
                    this.bottomState = 11;
                } else if (cancelStatus === 1) {
                    this.orderState = 7;
                    this.topState = -1;
                    this.bottomState = 3;
                } else if (cancelStatus === 2) {
                    this.orderState = 7;
                    this.topState = -1;
                    if (this.orderDetail.cancel_is_agree == 1) {
                        this.bottomState = 5;
                    } else if ((this.orderDetail.cancel_is_agree == 0 || this.orderDetail.cancel_is_agree == 2) &&
                        this.orderDetail.refund_data.is_who == 1 &&
                        this.orderDetail.refund_data.status == 2) {
                        this.bottomState = 13;
                    } else if ((this.orderDetail.cancel_is_agree == 0 || this.orderDetail.cancel_is_agree == 2) &&
                        this.orderDetail.refund_data.is_who == 2 &&
                        this.orderDetail.refund_data.status == 2) {
                        this.bottomState = 14;
                    } else if (this.orderDetail.cancel_is_agree == 2) {
                        this.bottomState = 6;
                    } else if (this.orderDetail.cancel_is_agree == 0 && this.orderDetail.cancel_side == 3) {
                        this.bottomState = 15;
                    } else {
                        this.bottomState = 4;
                    }
                } else if (cancelStatus === 3) {
                    this.orderState = 7;
                    this.topState = -1;
                    if (this.orderDetail.cancel_is_agree == 1) {
                        this.bottomState = 5;
                    } else if ((this.orderDetail.cancel_is_agree == 0 || this.orderDetail.cancel_is_agree == 2) &&
                        this.orderDetail.refund_data.is_who == 1 &&
                        this.orderDetail.refund_data.status == 2) {
                        this.bottomState = 13;
                    } else if ((this.orderDetail.cancel_is_agree == 0 || this.orderDetail.cancel_is_agree == 2) &&
                        this.orderDetail.refund_data.is_who == 2 &&
                        this.orderDetail.refund_data.status == 2) {
                        this.bottomState = 14;
                    } else if (this.orderDetail.cancel_is_agree == 2) {
                        this.bottomState = 6;
                    } else if (this.orderDetail.cancel_is_agree == 0 && this.orderDetail.cancel_side == 3) {
                        this.bottomState = 15;
                    } else {
                        this.bottomState = 4;
                    }
                }
                break;
        }
    };

    /**
     * from @hanmeng
     * 详情页数据加载
     **/
    loadData = () => {
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                this.companyId = datas.company_base_id;
                let maps = {
                    company_id: datas.company_base_id,
                    order_id: this.props.orderId,
                    type: 2,
                    sort: 1
                };
                let url = AppUrls.ORDER_DETAIL;
                request(url, 'post', maps).then((response) => {
                    if (response.mjson.msg === 'ok' && response.mjson.code === 1) {
                        this.props.showModal(false);
                        this.orderDetail = response.mjson.data;
                        let status = response.mjson.data.status;
                        let cancelStatus = response.mjson.data.cancel_status;
                        this.leftTime = this.getLeftTime(this.orderDetail.server_time, this.orderDetail.created_time);
                        //console.log('this.leftTime====', this.leftTime);
                        //this.props.showToast('this.leftTime===='+ this.leftTime);
                        if (cancelStatus == 2 || cancelStatus == 3) {
                            if (this.orderDetail.order_flows.length > 0) {
                                let cancel = this.orderDetail.order_flows;
                                for (let state in cancel) {
                                    status = cancel[state];
                                }
                            } else {
                                status = 0;
                            }
                        }
                        this.stateMapping(status, cancelStatus);
                        this.financeInfo = this.orderDetail.finance_data;
                        this.initListData(this.orderState);
                        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        this.setState({
                            dataSource: ds.cloneWithRows(this.mList),
                            isRefreshing: false,
                            renderPlaceholderOnly: 'success'
                        });
                    } else {
                        this.props.showToast(response.mjson.msg);
                        this.setState({
                            isRefreshing: false,
                            renderPlaceholderOnly: 'null'
                        });
                    }
                }, (error) => {
                    //this.props.showToast('获取订单详情失败');
                    this.props.showToast(error.mjson.msg);
                    this.setState({
                        isRefreshing: false,
                        renderPlaceholderOnly: 'error'
                    });
                });
            } else {
                this.props.showToast('获取订单详情失败');
            }
        });
    };

    /**
     * from @hanmeng
     * 根据输入数字更新贷款金额
     **/
    updateLoanAmount = (newAmount) => {
        //this.props.showModal(true);
        this.applyLoanAmount = newAmount;
        this.cl.setLayoutContent('恭喜您的' + newAmount + '元贷款已经授权，请尽快支付首付款以便尽快完成融资。');
    };

    /**
     * from @hanmeng
     * 根据输入的贷款额度，更新贷款数据
     **/
    refreshLoanInfo = (financeInfo) => {
        //console.log('new.financeInfo==='+financeInfo.obd_mny);
        this.financeInfo = financeInfo;
    };

    /**
     * from @hanmeng
     * 下拉刷新数据
     **/
    refreshingData = () => {
        //this.orderListData = [];
        this.setState({isRefreshing: true});
        this.loadData();
    };

    /**
     * from @hanmeng
     *
     *
     **/
    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return ( <View style={styles.container}>
                {this.loadView()}
                <NavigatorView title='订单详情' backIconClick={this.backPage}/>
            </View>);
        } else {
            return (
                <View style={styles.container}>
                    <NavigatorView title='订单详情' backIconClick={this.backPage}/>
                    {this.initDetailPageTop(this.topState)}
                    <ListView
                        removeClippedSubviews={false}
                        style={{marginTop: this.listViewStyle}}
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow}
                        renderSeparator={this._renderSeperator}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this.refreshingData}
                                tintColor={[fontAndColor.COLORB0]}
                                colors={[fontAndColor.COLORB0]}
                            />
                        }/>
                    <View style={{flex: 1}}/>
                    {this.initDetailPageBottom(this.bottomState)}
                </View>
            )
        }
    }

    /**
     * from @hanmeng
     *
     *
     **/
    _renderSeperator = (sectionID: number, rowID: number, adjacentRowHighlighted: bool) => {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{backgroundColor: fontAndColor.COLORA3, height: Pixel.getPixel(10)}}/>
        )
    }

    /**
     * from @hanmeng
     *
     *
     **/
    _renderRow = (rowData, selectionID, rowID) => {
        //item 布局
        if (rowData === '0') {
            return (
                <View style={styles.itemType0}>
                    <StepView items={this.items}/>
                </View>
            )
        } else if (rowData === '1') {
            return (
                <ContactLayout
                    ref={(ref) => {
                        this.cl = ref
                    }}
                    layoutTitle={this.contactData.layoutTitle ? this.contactData.layoutTitle : ''}
                    layoutContent={this.contactData.layoutContent ? this.contactData.layoutContent : ''}
                    setPrompt={this.contactData.setPrompt ? this.contactData.setPrompt : false}
                    promptTitle={this.contactData.promptTitle ? this.contactData.promptTitle : ''}
                    promptContent={this.contactData.promptContent ? this.contactData.promptContent : ''}
                    showShopId={this.orderDetail.seller_company_id}/>
            )
        } else if (rowData === '2') {
            return (
                <View style={styles.itemType2}>
                    <Image
                        style={{marginLeft: Pixel.getPixel(15)}}
                        source={require('../../../images/mainImage/agreed_sign.png')}/>
                    <Text allowFontScaling={false} style={{color: fontAndColor.COLORA1, marginLeft: Pixel.getPixel(5)}}>我已同意签署</Text>
                    {
                        this.orderState == 1 &&
                        <Text allowFontScaling={false}
                              onPress={() => {
                                  this.getTypeContractInfo(1)
                              }}
                              style={{color: fontAndColor.COLORA2}}>《买卖协议》</Text>
                    }
                    {/*<Text allowFontScaling={false}  style={{color: fontAndColor.COLORA1}}>和</Text>
                     <Text allowFontScaling={false}
                     onPress={() => {
                     this.getTypeContractInfo(2)
                     }}
                     style={{color: fontAndColor.COLORA2}}>《授权声明》</Text>*/}
                    {
                        (this.orderState == 3 || this.orderState == 7) &&
                        <Text allowFontScaling={false}
                              onPress={() => {
                                  this.getTypeContractInfo(2)
                              }}
                              style={{color: fontAndColor.COLORA2}}>《买卖协议附件》</Text>
                    }{/*{
                 (this.orderState == 6 || this.orderState == 7) &&
                 <Text allowFontScaling={false}
                 onPress={() => {
                 this.getTypeContractInfo(3)
                 }}
                 style={{color: fontAndColor.COLORA2}}>《售后回租协议》</Text>
                 }*/}

                </View>
            )
        } else if (rowData === '3') {
            let initReg = this.orderDetail.orders_item_data[0].car_data.init_reg;
            let mileage = this.orderDetail.orders_item_data[0].car_data.mileage;
            let initRegDate = initReg === 0 ? '暂无' : this.dateReversal(initReg + '000');
            let imageUrl = this.orderDetail.orders_item_data[0].car_data.imgs;
            /*let imageUrl = [];
             let initRegDate = this.dateReversal('1496462' + '000');*/
            return (
                <View style={styles.itemType3}>
                    <View style={{
                        height: Pixel.getPixel(40),
                        marginLeft: Pixel.getPixel(15),
                        justifyContent: 'center'
                    }}>
                        <Text allowFontScaling={false} style={styles.orderInfo}>订单号:{this.orderDetail.order_no}</Text>
                        <Text allowFontScaling={false}
                              style={styles.orderInfo}>订单日期:{this.orderDetail.created_time}</Text>
                    </View>
                    <View style={styles.separatedLine}/>
                    <View style={{flexDirection: 'row', height: Pixel.getPixel(105), alignItems: 'center'}}>
                        <Image style={styles.image}
                               source={imageUrl.length ? {uri: imageUrl[0].icon_url} : require('../../../images/carSourceImages/car_null_img.png')}/>
                        <View style={{marginLeft: Pixel.getPixel(10)}}>
                            <Text allowFontScaling={false} style={{width: width - Pixel.getPixel(15 + 120 + 10 + 15)}}
                                  numberOfLines={1}>{this.orderDetail.orders_item_data[0].car_data.model_name}</Text>
                            <View style={{flexDirection: 'row', marginTop: Pixel.getPixel(10), alignItems: 'center'}}>
                                <Text allowFontScaling={false} style={styles.carDescribeTitle}>里程：</Text>
                                <Text allowFontScaling={false}
                                      style={styles.carDescribe}>{mileage}万</Text>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: Pixel.getPixel(5), alignItems: 'center'}}>
                                <Text allowFontScaling={false} style={styles.carDescribeTitle}>上牌：</Text>
                                <Text allowFontScaling={false} style={styles.carDescribe}>{initRegDate}</Text>
                            </View>
                            {this.orderState !== 0 ? <View
                                style={{flexDirection: 'row', marginTop: Pixel.getPixel(5), alignItems: 'center'}}>
                                <Text allowFontScaling={false} style={styles.carDescribeTitle}>成交价：</Text>
                                <Text allowFontScaling={false}
                                      style={styles.carDescribe}>{this.orderDetail.transaction_amount}元</Text>
                            </View> : null}
                        </View>
                    </View>
                </View>
            )
        } else if (rowData === '4') {
            return (
                <ProcurementInfo orderDetail={this.orderDetail} orderState={this.orderState}/>
            )
        } else if (rowData === '5') {
            return (
                <LoanInfo
                    refresh={this.payCallBack}
                    balanceAmount={this.orderDetail.totalpay_amount > 0 ? this.orderDetail.totalpay_amount : this.orderDetail.balance_amount}
                    financeInfo={this.financeInfo}
                    loanCode={this.orderDetail.finance_no}
                    navigator={this.props.navigator}
                    updateLoanAmount={this.updateLoanAmount}
                    refreshLoanInfo={this.refreshLoanInfo}
                    applyLoanAmount={this.applyLoanAmount}
                    orderId={this.orderDetail.id}
                    orderNo={this.orderDetail.order_no}
                    companyId={this.companyId}/>
            )
        } else if (rowData === '6') {
            return (
                <View style={styles.itemType6}>
                    <View style={{height: Pixel.getPixel(40), alignItems: 'center', flexDirection: 'row'}}>
                        <Text allowFontScaling={false} style={{
                            fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                            marginLeft: Pixel.getPixel(15)
                        }}>卖家信息</Text>
                    </View>
                    <View style={styles.separatedLine}/>
                    <View style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        marginLeft: Pixel.getPixel(15),
                        marginTop: Pixel.getPixel(20),
                        marginRight: Pixel.getPixel(15)
                    }}>
                        <Text allowFontScaling={false} style={styles.orderInfo}>姓名</Text>
                        <View style={{flex: 1}}/>
                        <Text allowFontScaling={false} style={styles.infoContent}>{this.orderDetail.seller_name}</Text>
                    </View>
                    {/*<View style={styles.infoItem}>
                     <Text allowFontScaling={false}  style={styles.orderInfo}>联系方式</Text>
                     <View style={{flex: 1}}/>
                     <Text allowFontScaling={false}  style={styles.infoContent}>{this.orderDetail.seller_phone}</Text>
                     </View>*/}
                    <View style={styles.infoItem}>
                        <Text allowFontScaling={false} style={styles.orderInfo}>企业名称</Text>
                        <View style={{flex: 1}}/>
                        <Text allowFontScaling={false}
                              style={styles.infoContent}>{this.orderDetail.seller_company_name}</Text>
                    </View>
                </View>
            )
        } else if (rowData === '7') {
            return (
                <TouchableOpacity
                    style={styles.itemType7}
                    onPress={() => {
                        console.log(this.orderDetail.finance_no);
                        // 跳转金融页面  借款详情
                        this.toNextPage({
                            name: 'DDDetailScene',
                            component: DDDetailScene,
                            params: {
                                financeNo: this.orderDetail.finance_no,
                                orderNo: this.orderDetail.order_no,
                                FromScene: "DingDanXiangQingScene",
                                backRefresh: () => {
                                    this.payCallBack();
                                }
                            }

                        });
                    }}>
                    <View style={{alignItems: 'center', flexDirection: 'row', height: Pixel.getPixel(44)}}>
                        <Text allowFontScaling={false} style={{
                            marginLeft: Pixel.getPixel(15),
                            fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                            color: fontAndColor.COLORA0
                        }}>借款单号</Text>
                        <View style={{flex: 1}}/>
                        <Text allowFontScaling={false} style={{
                            marginRight: Pixel.getPixel(10),
                            fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                            color: fontAndColor.COLORA1
                        }}>{this.orderDetail.finance_no ? this.orderDetail.finance_no : '未生成借款单号'}</Text>
                        <Image source={require('../../../images/mainImage/celljiantou.png')}
                               style={{marginRight: Pixel.getPixel(15)}}/>
                    </View>
                </TouchableOpacity>
            )
        } else if (rowData === '8') {
            return (
                <TouchableOpacity
                    style={styles.itemType7}
                    onPress={() => {
                        // 跳转金融页面
                        //this.props.showToast('rowData === 7');
                    }}>
                    <View style={{alignItems: 'center', flexDirection: 'row', height: Pixel.getPixel(44)}}>
                        <Text allowFontScaling={false} style={{
                            marginLeft: Pixel.getPixel(15),
                            fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                            color: fontAndColor.COLORA0
                        }}>贷款信息</Text>
                        <View style={{flex: 1}}/>
                        <Text allowFontScaling={false} style={{
                            marginRight: Pixel.getPixel(10),
                            fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                            color: fontAndColor.COLORA1
                        }}>贷款单号：</Text>
                        <Image source={require('../../../images/mainImage/celljiantou.png')}
                               style={{marginRight: Pixel.getPixel(15)}}/>
                    </View>
                </TouchableOpacity>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: fontAndColor.COLORA3
    },
    backIcon: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(12),
        height: Pixel.getPixel(15),
        width: Pixel.getPixel(15)
    },
    separatedLine: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15),
        height: 1,
        backgroundColor: fontAndColor.COLORA4
    },
    carDescribeTitle: {
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
        color: fontAndColor.COLORA1
    },
    carDescribe: {
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
        color: fontAndColor.COLORA0
    },
    image: {
        marginLeft: Pixel.getPixel(15),
        width: Pixel.getPixel(120),
        height: Pixel.getPixel(80),
        resizeMode: 'stretch'
    },
    itemType0: {
        height: Pixel.getPixel(80),
        backgroundColor: '#ffffff',
        //flexDirection: 'row',
        //alignItems: 'center'
        justifyContent: 'center'
    },
    itemType1: {
        backgroundColor: '#ffffff',
        flexDirection: 'row'
    },
    itemType1Ttile: {
        fontSize: Pixel.getFontPixel(fontAndColor.TITLEFONT40),
        color: fontAndColor.COLORB2
    },
    itemType1Content: {
        marginLeft: Pixel.getPixel(15),
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        marginTop: Pixel.getPixel(7),
        marginBottom: Pixel.getPixel(21)
    },
    itemType2: {
        alignItems: 'center',
        height: Pixel.getPixel(19),
        flexDirection: 'row'
    },
    itemType3: {
        backgroundColor: '#ffffff',
        height: Pixel.getPixel(146)
    },
    orderInfo: {
        color: fontAndColor.COLORA1,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28)
    },
    itemType4: {
        backgroundColor: '#ffffff',
        //height: Pixel.getPixel(151)
    },
    itemType6: {
        backgroundColor: '#ffffff',
        height: Pixel.getPixel(121)
    },
    infoContent: {
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28)
    },
    infoItem: {
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: Pixel.getPixel(15),
        marginTop: Pixel.getPixel(10),
        marginRight: Pixel.getPixel(15)
    },
    itemType5: {
        backgroundColor: '#ffffff',
        height: Pixel.getPixel(240)
    },
    inputBorder: {
        alignItems: 'center',
        marginLeft: Pixel.getPixel(15),
        marginRight: Pixel.getPixel(15),
        height: Pixel.getPixel(40),
        marginTop: Pixel.getPixel(13),
        flexDirection: 'row',
        borderColor: fontAndColor.COLORB0,
        borderWidth: Pixel.getPixel(1),
        borderRadius: Pixel.getPixel(2)
    },
    inputStyle: {
        flex: 1,
        marginLeft: Pixel.getPixel(10),
        textAlign: 'left',
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        color: fontAndColor.COLORA2
    },
    bottomBar: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#ffffff',
        height: Pixel.getPixel(50),
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: fontAndColor.COLORA4
    },
    buttonConfirm: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Pixel.getPixel(15),
        backgroundColor: fontAndColor.COLORB0,
        height: Pixel.getPixel(32),
        width: Pixel.getPixel(100),
        borderRadius: Pixel.getPixel(2),
        borderWidth: Pixel.getPixel(1),
        borderColor: fontAndColor.COLORB0
    },
    buttonCancel: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Pixel.getPixel(15),
        height: Pixel.getPixel(32),
        width: Pixel.getPixel(100),
        borderRadius: Pixel.getPixel(2),
        borderWidth: Pixel.getPixel(1),
        borderColor: fontAndColor.COLORA2
    },
    tradingCountdown: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: Pixel.getPixel(15),
        paddingRight: Pixel.getPixel(15),
        paddingTop: Pixel.getPixel(10),
        paddingBottom: Pixel.getPixel(10),
        backgroundColor: fontAndColor.COLORB6
    },
    expButton: {
        marginBottom: Pixel.getPixel(20),
        width: Pixel.getPixel(100),
        height: Pixel.getPixel(35),
        marginTop: Pixel.getPixel(16),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        borderWidth: 1,
        borderColor: fontAndColor.COLORB0
    },
    expText: {
        fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),
        color: fontAndColor.COLORB0
    },
    positiveTextStyle: {
        fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),
        color: '#ffffff'
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
    negativeTextStyle: {
        fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),
        color: fontAndColor.COLORB0
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
    itemType7: {
        backgroundColor: '#ffffff',
        height: Pixel.getPixel(44)
    }
});