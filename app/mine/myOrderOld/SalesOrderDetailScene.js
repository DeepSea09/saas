/**
 * Created by hanmeng on 2017/5/11.
 */

import React, {Component, PropTypes} from 'react'

import {
    StyleSheet,
    View,
    Text,
    ListView,
    Platform,
    TouchableOpacity,
    Image,
    Dimensions,
    NativeModules,
    BackAndroid,
    InteractionManager,
    TextInput,
    RefreshControl
} from  'react-native'

const {width, height} = Dimensions.get('window');
import BaseComponent from "../../component/BaseComponent";
import NavigatorView from '../../component/AllNavigationView';
import * as fontAndColor from '../../constant/fontAndColor';
import PixelUtil from '../../utils/PixelUtil';
import InputAmountScene from "./InputAmountScene";
import InputVinInfo from "./InputVinInfo";
import StepView from "./component/StepView";
import ExplainModal from "./component/ExplainModal";
import MakePhoneModal from "./component/MakePhoneModal";
import ChooseModal from "./component/ChooseModal";
import TransactionPrice from "./component/TransactionPrice";
import {request} from "../../utils/RequestUtil";
import * as AppUrls from "../../constant/appUrls";
import ContactLayout from "./component/ContactLayout";
import GetCarCountDown from "./component/GetCarCountDown";
import DepositCountDown from "./component/DepositCountDown";
import CheckStand from "../../finance/CheckStand";
import * as Net from '../../utils/RequestUtil';
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";
import AccountScene from "../accountManage/RechargeScene";
import VinInfo from '../../publish/component/VinInfo';
import AccountWebScene from "../accountManage/AccountWebScene";
import ContractWebScene from "./ContractWebScene";
import OrderSearchScene from "./OrderSearchScene";
import AccountManageScene from "../accountManage/AccountTypeSelectScene";
import BindCardScene from "../accountManage/BindCardScene";
import WaitActivationAccountScene from "../accountManage/WaitActivationAccountScene";
import AccountModal from "../../component/AccountModal";
import AccountForOrderModal from "./component/AccountForOrderModal";
import ContractScene from "./ContractScene";
import RepaymentInfoScene from "../../finance/repayment/RepaymentCreditInfoScene";
import InventoryPlanInfoScene from "../../finance/repayment/InventoryPlanInfoScene";
import NewPurchaseRepaymentInfoScene from "../../finance/repayment/NewPurchaseRepaymentInfoScene";
import SalesInfo from "./component/SalesInfo";
import MyAccountScene from "../accountManage/MyAccountScene";
const Pixel = new PixelUtil();

const IS_ANDROID = Platform.OS === 'android';

export default class SalesOrderDetailScene extends BaseComponent {

    constructor(props) {
        super(props);

        //let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.items = [];
        this.mList = [];
        this.listViewStyle = Pixel.getPixel(0);
        this.orderDetail = '';
        this.orderState = -1;
        this.topState = -1;
        this.bottomState = -1;
        this.contactData = {};
        this.carAmount = 0;
        this.deposit = 0;
        this.carVin = '';
        this.leftTime = 0;
        this.closeOrder = 0;
        this.financeInfo = {};

        this.modelData = [];
        this.modelInfo = {};
        this.carData = {'v_type': 1};

        this.modelData = [];
        this.scanType = [{model_name: '扫描前风挡'}, {model_name: '扫描行驶证'}];

        this.state = {
            dataSource: [],
            renderPlaceholderOnly: 'blank',
            isRefreshing: false
        }
    }

    componentDidMount() {
        try {
            BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
        } catch (e) {

        } finally {
            //InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: 'loading'});
            this.initFinish();
            //});
        }
    }

    initFinish = () => {
        /*        this.setState({
         dataSource: this.state.dataSource.cloneWithRows(['','','']),
         renderPlaceholderOnly: 'success'
         });*/
        this.loadData();
    };

    /**
     *   整百判断
     **/
    isNumberByHundred = (number) => {
        let re = /^[0-9]*[0-9]$/i;
        if (re.test(number) && number % 100 === 0 && number !== 0) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * 更新车辆定价、订金
     **/
    updateDepositAmount = (newAmount, newDeposit) => {
        //this.props.showModal(true);
        this.carAmount = newAmount;
        this.deposit = newDeposit;
    };

    /**
     * 补差价提示栏
     * @param financeInfo
     **/
    isShowFinance = (financeInfo, savePrice) => {
        if (financeInfo.is_show_finance == 1) {
            this.financeInfo = financeInfo;
            this.mList = [];
            if (this.orderDetail.orders_item_data[0].car_vin.length === 17) {
                this.mList = ['0', '1', '2', '3', '4', '5', '7', '9'];
            } else {
                this.mList = ['0', '1', '2', '3', '4', '5', '6', '7', '9'];
            }
            let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            this.setState({
                dataSource: ds.cloneWithRows(this.mList),
                //dataSource: this.state.dataSource.cloneWithRows(this.mList),
                isRefreshing: false,
                renderPlaceholderOnly: 'success'
            });
            this.props.showModal(false);
        } else {
            this.mList = [];
            if (this.orderDetail.orders_item_data[0].car_vin.length === 17) {
                this.mList = ['0', '1', '2', '4', '5', '7', '9'];
            } else {
                this.mList = ['0', '1', '2', '4', '5', '6', '7', '9'];
            }
            let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            this.setState({
                dataSource: ds.cloneWithRows(this.mList),
                isRefreshing: false,
                renderPlaceholderOnly: 'success'
            });
            if (savePrice) {
                this.savePrice();
            } else {
                this.props.showModal(false);
            }
        }
    };

    /**
     *   成交价本地检查
     *   price 成交价
     *   deposit 订金
     *   type 1成交价  2订金
     *   返回值 检查是否通过
     **/
    localCheckPrice = (price, deposit, type) => {
        if (price === 0) {
            //return '成交价不能为0';
            this.transactionPrice.updatePrompting('成交价不能为0');
            this.props.showToast('成交价不能为0');
            /*            this.amountInput.changeColor(fontAndColor.COLORB2);
             this.depositInput.changeColor(fontAndColor.COLORA2);*/
            return false;
        } else if (!this.isNumberByHundred(price)) {
            this.transactionPrice.updatePrompting('成交价请输入整百金额');
            this.props.showToast('成交价请输入整百金额');
            return false;
        } else if (!this.isNumberByHundred(deposit) && deposit !== 0) {
            this.transactionPrice.updatePrompting('订金请输入整百金额');
            this.props.showToast('订金请输入整百金额');
            return false;
        } else if (deposit > (price * 0.2)) {
            this.transactionPrice.updatePrompting('您设定的订金已超出最大金额');
            this.props.showToast('您设定的订金已超出最大金额');
            return false;
        } else {
            if (type === 1) {
                this.checkPrice(price, deposit);
            }
            let pay = price * 0.2 >= 100 ? price * 0.2 : 0;
            this.transactionPrice.updatePrompting('订金买家最多可付' + pay + '元');
            //this.props.showToast('订金买家最多可付' + pay + '元');
            return true;
        }
    };

    /**
     *   定价提交前置流程
     **/
    prepareSavePrice = () => {
        let inputTransaction = this.transactionPrice.getTransaction();
        let inputDeposit = this.transactionPrice.getDeposit();
        //console.log('prepareSavePrice==inputTransaction==', inputTransaction);
        //console.log('prepareSavePrice==inputDeposit==', inputDeposit);
        // 判断Input控件中的数额与此页面中数额比较
        // Input控件中成交价 == 此页面成交价 && Input控件中订金 == 此页面订金 直接走savePrice
        if (inputTransaction === this.carAmount && inputDeposit === this.deposit) {
            if (this.localCheckPrice(this.carAmount, this.deposit, 2)) {
                this.savePrice();
            }
        }
        // Input控件中成交价 == 此页面成交价 && Input控件中订金 != 此页面订金 只走localCheckPrice & type = 2
        else if (inputTransaction === this.carAmount && inputDeposit !== this.deposit) {
            this.deposit = inputDeposit;
            this.localCheckPrice(this.carAmount, this.deposit, 2);
        }
        // (Input控件中成交价 != 此页面成交价 && Input控件中订金 == 此页面订金) ||
        // (Input控件中成交价 != 此页面成交价 && Input控件中订金 != 此页面订金)  localCheckPrice & type = 1(走checkPrice)
        else {
            this.carAmount = inputTransaction;
            this.deposit = inputDeposit;
            this.localCheckPrice(this.carAmount, this.deposit, 1);
        }
    };

    /**
     *  定价检查接口
     **/
    checkPrice = (price, deposit) => {
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    company_id: datas.company_base_id,
                    car_id: this.orderDetail.orders_item_data[0].car_id,
                    order_id: this.orderDetail.id,
                    pricing_amount: price,
                    deposit_amount: deposit
                };
                let url = AppUrls.ORDER_CHECK_PRICE;
                request(url, 'post', maps).then((response) => {
                    if (response.mjson.msg === 'ok' && response.mjson.code === 1) {
                        this.props.showModal(false);
                        this.isShowFinance(response.mjson.data, true);
                    } else {
                        this.props.showToast(response.mjson.msg);
                    }
                }, (error) => {
                    this.props.showToast(error.mjson.msg);
                });
            } else {
                this.props.showToast('车辆定价检查失败');
            }
        });
    };

    /**
     *  定价提交
     **/
    savePrice = () => {
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                //console.log('this.vinInput.value======',this.vinInput.value);
                let maps = {
                    company_id: datas.company_base_id,
                    car_id: this.orderDetail.orders_item_data[0].car_id,
                    order_id: this.orderDetail.id,
                    pricing_amount: this.carAmount,
                    deposit_amount: this.deposit,
                    car_vin: this.orderDetail.orders_item_data[0].car_vin.length === 17 ?
                        this.orderDetail.orders_item_data[0].car_vin : this.carVin
                };
                let url = AppUrls.ORDER_SAVE_PRICE;
                request(url, 'post', maps).then((response) => {
                    if (response.mjson.msg === 'ok' && response.mjson.code === 1) {
                        this.loadData();
                    } else {
                        this.props.showToast(response.mjson.msg);
                    }
                }, (error) => {
                    if (error.mjson.code == '6390000') {
                        this.props.showModal(false);
                        if (error.mjson.data.account_card_status == 0) {
                            this.refs.accountmodal.changeShowType(height,
                                '您还未开通资金账户，为方便您使用金融产品及购物车，' +
                                '请尽快开通！', '去开户', '看看再说', () => {
                                    this.toNextPage({
                                        name: 'MyAccountScene',
                                        component: MyAccountScene,
                                        params: {
                                            callBack: () => {
                                            }
                                        }
                                    });
                                });
                        } else if (error.mjson.data.account_card_status == 1) {
                            this.refs.accountmodal.changeShowType(height,
                                '您的资金账户还未绑定银行卡，为方便您使用金融产品及购物车，请尽快绑定。'
                                , '去绑卡', '看看再说', () => {
                                    this.toNextPage({
                                        name: 'MyAccountScene',
                                        component: MyAccountScene,
                                        params: {
                                            callBack: () => {
                                            }
                                        }
                                    });
                                });
                        } else if (error.mjson.data.account_card_status == 2) {
                            this.refs.accountmodal.changeShowType(height,
                                '您的账户还未激活，为方便您使用金融产品及购物车，请尽快激活。'
                                , '去激活', '看看再说', () => {
                                    this.toNextPage({
                                        name: 'MyAccountScene',
                                        component: MyAccountScene,
                                        params: {
                                            callBack: () => {
                                            }
                                        }
                                    });
                                });
                        } else if (error.mjson.data.account_card_status == 5) {
                            this.props.showToast('请您先开通平台账户');
                        } else {
                            this.props.showToast(error.mjson.msg);
                        }
                    } else if (error.mjson.code == '6350085') {
                        this.props.showModal(false);
                        this.refs.loanModal.changeShowType(true, '提示', '库存融资车辆请您先出库再交易', '确定');
                    } else {
                        this.props.showToast(error.mjson.msg);
                    }
                });
            } else {
                this.props.showToast('成交价提交失败');
            }
        });
    };

    getLeftTime = (serverTime, cancelTime) => {
        let currentTime = new Date(serverTime.replace(/-/g, '/')).valueOf();
        let oldTime = new Date(cancelTime.replace(/-/g, '/')).valueOf();
        return parseFloat(currentTime) - parseFloat(oldTime);
    };

    loadData = () => {
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    company_id: datas.company_base_id,
                    order_id: this.props.orderId,
                    type: 2,
                    sort: 2
                };
                let url = AppUrls.ORDER_DETAIL;
                request(url, 'post', maps).then((response) => {
                    if (response.mjson.msg === 'ok' && response.mjson.code === 1) {
                        this.props.showModal(false);
                        this.orderDetail = response.mjson.data;
                        let status = response.mjson.data.status;
                        let cancelStatus = response.mjson.data.cancel_status;
                        this.leftTime = this.getLeftTime(this.orderDetail.server_time, this.orderDetail.cancel_time);
                        this.closeOrder = this.getLeftTime(this.orderDetail.server_time, this.orderDetail.pricing_time);
                        this.carAmount = 0;
                        //this.carVin = this.orderDetail.orders_item_data[0].car_vin;
                        //  判断订单处于取消状态 获取取消时订单状态，如已付款判断是否同意退款
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
     *  根据订单详情接口的 status 和 cancel_status 字段组合判断页面渲染
     */
    stateMapping = (status, cancelStatus) => {
        switch (status) {
            case 0:  // 已拍下，价格未定
            case 1:
                if (cancelStatus === 0) {
                    this.orderState = 0;
                    this.topState = -1;
                    this.bottomState = 0;
                } else if (cancelStatus === 1) {
                    this.orderState = 0;
                    this.topState = 0;
                    this.bottomState = 5;
                } else if (cancelStatus === 2) {
                    this.orderState = 0;
                    this.topState = -1;
                    if (this.orderDetail.cancel_side == 3) {
                        this.bottomState = 6;
                    } else {
                        this.bottomState = 2;
                    }
                } else if (cancelStatus === 3) {
                    this.orderState = 0;
                    this.topState = -1;
                    if (this.orderDetail.cancel_side == 3) {
                        this.bottomState = 6;
                    } else {
                        this.bottomState = 2;
                    }
                }
                break;
            case 2:  // 已拍下，价格已定
            case 3:
            case 4:
                if (cancelStatus === 0) {
                    this.orderState = 1;
                    if (this.orderDetail.orders_item_data[0].car_finance_data.pledge_type == 2 &&
                        this.orderDetail.orders_item_data[0].car_finance_data.pledge_status == 1) {
                        this.topState = 1;
                    } else {
                        this.topState = -1;
                    }
                    this.bottomState = 1;
                } else if (cancelStatus === 1) {
                    this.orderState = 1;
                    this.topState = 0;
                    this.bottomState = 5;
                } else if (cancelStatus === 2) {
                    this.orderState = 1;
                    this.topState = -1;
                    if (this.orderDetail.cancel_side == 3) {
                        this.bottomState = 6;
                    } else {
                        this.bottomState = 2;
                    }
                } else if (cancelStatus === 3) {
                    this.orderState = 1;
                    this.topState = -1;
                    if (this.orderDetail.cancel_side == 3) {
                        this.bottomState = 6;
                    } else {
                        this.bottomState = 2;
                    }
                }
                break;
            case 5:  // 订金到账
            case 6:
            case 7:
            case 12:  //融资相关状态
            case 13:
            case 14:
            case 15:
            case 16:
            case 160:
            case 17:
            case 18:
            case 19:  //
            case 20:  //
            case 21:  //
            case 22:  //
            case 23:  //
            case 24:  //
            case 200:  //
            case 201:  //
            case 202:  //
            case 50:  //
            case 51:  //
                if (cancelStatus === 0) {
                    this.orderState = 2;
                    if (this.orderDetail.orders_item_data[0].car_finance_data.pledge_type == 2 &&
                        this.orderDetail.orders_item_data[0].car_finance_data.pledge_status == 1) {
                        this.topState = 1;
                    } else {
                        this.topState = -1;
                    }
                    if (status === 21 && this.orderDetail.prepayment_status == 3) {
                        this.bottomState = 8;
                    } else if (status === 17 || status === 19 || status === 20 || status === 21 || status === 22 ||
                        status === 23 || status === 24) {
                        this.bottomState = -1;
                    } else {
                        this.bottomState = 1;
                    }
                } else if (cancelStatus === 1) {
                    this.orderState = 2;
                    this.topState = 0;
                    this.bottomState = 5;
                } else if (cancelStatus === 2) {
                    this.orderState = 2;
                    this.topState = -1;
                    if (this.orderDetail.cancel_side == 3) {
                        this.bottomState = 6;
                    } else if (this.orderDetail.cancel_side == 2) {
                        this.bottomState = 3;
                    } else {
                        if (this.orderDetail.cancel_is_agree == 2) {
                            this.bottomState = 4;
                        } else {
                            this.bottomState = 3;
                        }
                    }
                } else if (cancelStatus === 3) {
                    this.orderState = 2;
                    this.topState = -1;
                    if (this.orderDetail.cancel_side == 3) {
                        this.bottomState = 6;
                    } else if (this.orderDetail.cancel_side == 2) {
                        this.bottomState = 3;
                    } else {
                        if (this.orderDetail.cancel_is_agree == 2) {
                            this.bottomState = 4;
                        } else {
                            this.bottomState = 3;
                        }
                    }
                }
                break;
            case 8: // 结清尾款
            case 9:
            case 10:
            case 90:
            case 91:
            case 203:
                if (cancelStatus === 0) {
                    this.orderState = 3;
                    if (this.orderDetail.orders_item_data[0].car_finance_data.pledge_type == 2 &&
                        this.orderDetail.orders_item_data[0].car_finance_data.pledge_status == 1) {
                        this.topState = 1;
                    } else {
                        this.topState = -1;
                    }
                    if (status === 9 && this.orderDetail.prepayment_status == 3) {
                        this.bottomState = 8;
                    } else {
                        if (this.orderDetail.pay_type == 'dingcheng' || this.orderDetail.pay_type == 'offline') {
                            this.bottomState = -1;
                        } else {
                            this.bottomState = 7;
                        }
                    }
                } else if (cancelStatus === 1) {
                    this.orderState = 3;
                    this.topState = 0;
                    this.bottomState = 5;
                } else if (cancelStatus === 2) {
                    this.orderState = 3;
                    this.topState = -1;
                    if (this.orderDetail.cancel_side == 3) {
                        this.bottomState = 6;
                    } else if (this.orderDetail.cancel_side == 2) {
                        this.bottomState = 3;
                    } else {
                        if (this.orderDetail.cancel_is_agree == 2) {
                            this.bottomState = 4;
                        } else {
                            this.bottomState = 3;
                        }
                    }
                } else if (cancelStatus === 3) {
                    this.orderState = 3;
                    this.topState = -1;
                    if (this.orderDetail.cancel_side == 3) {
                        this.bottomState = 6;
                    } else if (this.orderDetail.cancel_side == 2) {
                        this.bottomState = 3;
                    } else {
                        if (this.orderDetail.cancel_is_agree == 2) {
                            this.bottomState = 4;
                        } else {
                            this.bottomState = 3;
                        }
                    }
                }
                break;
            case 11:  // 订单完成
                if (cancelStatus === 0) {
                    this.orderState = 4;
                    this.topState = -1;
                    this.bottomState = -1;
                } else if (cancelStatus === 1) {
                    this.orderState = 4;
                    this.topState = 0;
                    this.bottomState = 5;
                } else if (cancelStatus === 2) {
                    this.orderState = 4;
                    this.topState = -1;
                    if (this.orderDetail.cancel_side == 3) {
                        this.bottomState = 6;
                    } else if (this.orderDetail.cancel_side == 2) {
                        this.bottomState = 3;
                    } else {
                        if (this.orderDetail.cancel_is_agree == 2) {
                            this.bottomState = 4;
                        } else {
                            this.bottomState = 3;
                        }
                    }
                } else if (cancelStatus === 3) {
                    this.orderState = 4;
                    this.topState = -1;
                    if (this.orderDetail.cancel_side == 3) {
                        this.bottomState = 6;
                    } else if (this.orderDetail.cancel_side == 2) {
                        this.bottomState = 3;
                    } else {
                        if (this.orderDetail.cancel_is_agree == 2) {
                            this.bottomState = 4;
                        } else {
                            this.bottomState = 3;
                        }
                    }
                }
                break;
            case 200:

                break;
        }
    };

    initDetailPageTop = (topState) => {
        //  根据订单状态初始化详情页悬浮头、悬浮底
        switch (topState) {
            case 0:
                this.listViewStyle = Pixel.getPixel(0);
                return (
                    <View style={{marginTop: Pixel.getTitlePixel(65)}}>
                        <View style={styles.tradingCountdown}>
                            <Text allowFontScaling={false}>
                                <Text allowFontScaling={false} style={{
                                    marginLeft: Pixel.getPixel(15),
                                    fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                                    color: fontAndColor.COLORB7
                                }}>处理申请剩余时间</Text>
                                <DepositCountDown leftTime={this.leftTime}/>
                                <Text allowFontScaling={false} style={{
                                    fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                                    color: fontAndColor.COLORB7
                                }}>超时未处理默认为不同意，订单自动取消</Text>
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
                            <Text allowFontScaling={false}>
                                <Text allowFontScaling={false} style={{
                                    marginLeft: Pixel.getPixel(15),
                                    fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                                    color: fontAndColor.COLORB7
                                }}>完成交易剩余时间</Text>
                                <GetCarCountDown leftTime={this.closeOrder}/>
                                <Text allowFontScaling={false} style={{
                                    fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                                    color: fontAndColor.COLORB7
                                }}>超时订单将关闭。</Text>
                            </Text>
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


    initDetailPageBottom = (orderState) => {
        switch (orderState) {
            case 0:
                let negativeText = '';
                let positiveText = '';
                let content = '';
                let positiveOperation = '';
                return (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity
                            onPress={() => {
                                negativeText = '取消';
                                positiveText = '确定';
                                content = '确定后取消订单。如买家有已支付款项将退款，如您有补差价款可提现。';
                                positiveOperation = this.cancelOrder;
                                this.refs.chooseModal.changeShowType(true, negativeText, positiveText, content, positiveOperation);
                            }}>
                            <View style={styles.buttonCancel}>
                                <Text allowFontScaling={false} style={{color: fontAndColor.COLORA2}}>取消订单</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                //console.log('韩梦测试测试测试====',this.carVin);
                                negativeText = '再想想';
                                positiveText = '没问题';
                                content = '此车是库存融资质押车辆，请在买家支付订金后操作车辆出库。';
                                positiveOperation = this.prepareSavePrice;
                                    //if (this.orderDetail.orders_item_data[0].car_finance_data.pledge_type == 1 &&
                                    //this.orderDetail.orders_item_data[0].car_finance_data.pledge_status == 1) {
                                    //this.refs.loanModal.changeShowType(true, '提示', '库存融资车辆请您先出库再交易', '确定');
                                    //} else {
                                this.prepareSavePrice();
                                    //}
                            }}>
                            <View style={styles.buttonConfirm}>
                                <Text allowFontScaling={false} style={{color: '#ffffff'}}>确认</Text>
                            </View>
                        </TouchableOpacity>
                        <ChooseModal ref='chooseModal' title='提示'
                                     negativeButtonStyle={styles.negativeButtonStyle}
                                     negativeTextStyle={styles.negativeTextStyle} negativeText={negativeText}
                                     positiveButtonStyle={styles.positiveButtonStyle}
                                     positiveTextStyle={styles.positiveTextStyle} positiveText={positiveText}
                                     buttonsMargin={Pixel.getPixel(20)}
                                     positiveOperation={positiveOperation}
                                     content={content}/>
                        <ExplainModal ref='loanModal' title='提示' buttonStyle={styles.expButton}
                                      textStyle={styles.expText}
                                      text='确定' content='库存融资车辆请您先出库再交易'/>
                    </View>
                )
                break;
            case 1:
                return (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity
                            onPress={() => {
                                //this.refs.chooseModal.changeShowState(true);
                                this.refs.chooseModal.changeShowType(true, '取消', '确定', '确定后取消订单。如买家有已支付款项将退款，如您有补差价款可提现。',
                                    this.cancelOrder);
                            }}>
                            <View style={styles.buttonCancel}>
                                <Text allowFontScaling={false} style={{color: fontAndColor.COLORA2}}>取消订单</Text>
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
            case 3:
                return (
                    <View style={[styles.bottomBar, {justifyContent: 'center'}]}>
                        <Text allowFontScaling={false} style={{
                            textAlign: 'center',
                            fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                            color: fontAndColor.COLORB0
                        }}>
                            交易关闭(同意退款)
                        </Text>
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
                            交易关闭(不同意退款)
                        </Text>
                    </View>
                );
                break;
            case 5:
                return (
                    <View style={{backgroundColor: '#ffffff'}}>
                        <View style={{alignItems: 'center', height: Pixel.getPixel(30), justifyContent: 'center'}}>
                            <Text allowFontScaling={false} style={{color: fontAndColor.COLORB2}}>
                                买家申请取消订单，如买家已支付款项选择同意后将退回
                            </Text>
                        </View>
                        <View style={styles.bottomBar}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.showModal(true);
                                    this.denyCancel();
                                }}>
                                <View style={styles.buttonCancel}>
                                    <Text allowFontScaling={false} style={{color: fontAndColor.COLORA2}}>不同意</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.showModal(true);
                                    this.allowCancel();
                                }}>
                                <View style={styles.buttonConfirm}>
                                    <Text allowFontScaling={false} style={{color: '#ffffff'}}>同意</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
                break;
            case 6:
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
            case 7:
                return (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity
                            onPress={() => {
                                this.refs.cancelModal.changeShowType(true, '提示', '订单尾款已结清联系客服取消订单', '确定');
                            }}>
                            <View style={styles.buttonCancel}>
                                <Text allowFontScaling={false} style={{color: fontAndColor.COLORA2}}>取消订单</Text>
                            </View>
                        </TouchableOpacity>
                        <ExplainModal ref='cancelModal' title='提示' buttonStyle={styles.expButton}
                                      textStyle={styles.expText}
                                      text='确定' content='订单尾款已结清联系客服取消订单'/>
                    </View>
                )
                break;
            case 8:
                return (
                    <View style={[styles.bottomBar, {justifyContent: 'center'}]}>
                        <Text allowFontScaling={false} style={{
                            textAlign: 'center',
                            fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                            color: fontAndColor.COLORB0
                        }}>
                            交易暂停，请撤销或完成发起的提前还款，之后可继续交易。如需取消订单请点击我要咨询拨打客服。
                        </Text>
                    </View>
                );
                break;
            default:
                return null;
                break;
        }
    };

    initListData = (orderState, merchantNum, customerServiceNum) => {
        switch (orderState) {
            case 0:  //未定价
                this.mList = [];
                this.items = [];
                this.contactData = {};
                if (this.orderDetail.orders_item_data[0].car_vin.length === 17) {
                    this.mList = ['0', '1', '2', '4', '5', '7', '9'];
                } else {
                    this.mList = ['0', '1', '2', '4', '5', '6', '7', '9'];
                }
                this.contactData = {
                    layoutTitle: '确认成交价',
                    layoutContent: '确认成交价，待买家付定金，确认后价格不可修改。',
                    setPrompt: false,
                    MerchantNum: merchantNum,
                    CustomerServiceNum: customerServiceNum
                };
                this.items.push({title: '创建订单', nodeState: 1, isLast: false, isFirst: true});
                this.items.push({title: '订金到账', nodeState: 2, isLast: false, isFirst: false});
                this.items.push({title: '结清尾款', nodeState: 2, isLast: false, isFirst: false});
                this.items.push({title: '完成交易', nodeState: 2, isLast: true, isFirst: false});
                break;
            case 1:  //已定价
                this.mList = [];
                this.items = [];
                this.contactData = {};
                this.mList = ['0', '1', '5', '7', '9'];
                this.contactData = {
                    layoutTitle: '查看到账',
                    layoutContent: '您可以查看买家已支付到账的金额，但暂不可提现，请在交割车辆时要求买家点击"确认验收"按钮，否则将无法提现。',
                    setPrompt: false,
                    MerchantNum: merchantNum,
                    CustomerServiceNum: customerServiceNum
                };
                this.items.push({title: '创建订单', nodeState: 1, isLast: false, isFirst: true});
                this.items.push({title: '订金到账', nodeState: 2, isLast: false, isFirst: false});
                this.items.push({title: '结清尾款', nodeState: 2, isLast: false, isFirst: false});
                this.items.push({title: '完成交易', nodeState: 2, isLast: true, isFirst: false});
                break;
            case 2:  //订金到账
                this.mList = [];
                this.items = [];
                this.contactData = {};
                this.mList = ['0', '1', '5', '7', '9'];
                this.contactData = {
                    layoutTitle: '查看到账',
                    layoutContent: '您可以查看买家已支付到账的金额，但暂不可提现，请在交割车辆时要求买家点击"确认验收"按钮，否则将无法提现。',
                    setPrompt: false,
                    MerchantNum: merchantNum,
                    CustomerServiceNum: customerServiceNum
                };
                if (this.orderDetail.totalpay_amount > 0) {
                    this.items.push({title: '创建订单', nodeState: 1, isLast: false, isFirst: true});
                    this.items.push({title: '全款到账', nodeState: 2, isLast: false, isFirst: false});
                    this.items.push({title: '完成交易', nodeState: 2, isLast: true, isFirst: false});
                } else {
                    this.items.push({title: '创建订单', nodeState: 0, isLast: false, isFirst: true});
                    this.items.push({title: '订金到账', nodeState: 1, isLast: false, isFirst: false});
                    this.items.push({title: '结清尾款', nodeState: 2, isLast: false, isFirst: false});
                    this.items.push({title: '完成交易', nodeState: 2, isLast: true, isFirst: false});
                }
                break;
            case 3:  // 结清尾款   全款单查看到账
                this.mList = [];
                this.items = [];
                this.contactData = {};
                this.mList = ['0', '1', '5', '7', '9'];
                this.contactData = {
                    layoutTitle: '查看到账',
                    layoutContent: '您可以查看买家已支付到账的金额，但暂不可提现，请在交割车辆时要求买家点击"确认验收"按钮，否则将无法提现。',
                    setPrompt: false,
                    MerchantNum: merchantNum,
                    CustomerServiceNum: customerServiceNum
                };
                if (this.orderDetail.totalpay_amount > 0) {
                    this.items.push({title: '创建订单', nodeState: 0, isLast: false, isFirst: true});
                    this.items.push({title: '全款到账', nodeState: 1, isLast: false, isFirst: false});
                    this.items.push({title: '完成交易', nodeState: 2, isLast: true, isFirst: false});
                } else {
                    this.items.push({title: '创建订单', nodeState: 0, isLast: false, isFirst: true});
                    this.items.push({title: '订金到账', nodeState: 0, isLast: false, isFirst: false});
                    this.items.push({title: '结清尾款', nodeState: 1, isLast: false, isFirst: false});
                    this.items.push({title: '完成交易', nodeState: 2, isLast: true, isFirst: false});
                }
                break;
            case 4: // 完成交易
                this.mList = [];
                this.items = [];
                this.contactData = {};
                if (this.orderDetail.orders_item_data[0].pledge_sub_payment_number &&
                    this.orderDetail.orders_item_data[0].pledge_sub_payment_number.length > 0 &&
                    this.orderDetail.orders_item_data[0].car_finance_data.pledge_type &&
                    this.orderDetail.orders_item_data[0].car_finance_data.pledge_type == 2) {
                    this.mList = ['0', '1', '4', '5', '7', '10', '9'];
                    this.contactData = {
                        layoutTitle: '已完成',
                        layoutContent: '提前还款成功，请办理解除质押手续，剩余车款可提现。',
                        setPrompt: false
                    };
                } else {
                    this.mList = ['0', '1', '5', '7', '9'];
                    this.contactData = {
                        layoutTitle: '已完成',
                        layoutContent: '车款可提现。',
                        setPrompt: false
                    };
                }
                if (this.orderDetail.totalpay_amount > 0) {
                    this.items.push({title: '创建订单', nodeState: 0, isLast: false, isFirst: true});
                    this.items.push({title: '全款到账', nodeState: 0, isLast: false, isFirst: false});
                    this.items.push({title: '完成交易', nodeState: 1, isLast: true, isFirst: false});
                } else {
                    this.items.push({title: '创建订单', nodeState: 0, isLast: false, isFirst: true});
                    this.items.push({title: '订金到账', nodeState: 0, isLast: false, isFirst: false});
                    this.items.push({title: '结清尾款', nodeState: 0, isLast: false, isFirst: false});
                    this.items.push({title: '完成交易', nodeState: 1, isLast: true, isFirst: false});
                }
                break;
            default:
                break;
        }
    };

    orderCancelHandler = (result) => {
        let url = AppUrls.ORDER_CANCEL_HANDLER;
        request(url, 'post', {
            order_id: this.orderDetail.id,
            result: result
        }).then((response) => {
            //this.props.showModal(false);
            this.loadData();
        }, (error) => {
            //this.props.showModal(false);
            //console.log("成交价提交失败");
            this.props.showToast('处理取消订单申请失败');
        });
    };

    allowCancel = () => {
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    company_id: datas.company_base_id,
                    order_id: this.orderDetail.id
                };
                let url = AppUrls.ORDER_ALLOW_CANCEL;
                request(url, 'post', maps).then((response) => {
                    if (response.mjson.msg === 'ok' && response.mjson.code === 1) {
                        this.loadData();
                    } else {
                        this.props.showToast(response.mjson.msg);
                    }
                }, (error) => {
                    //this.props.showToast('处理取消订单申请失败');
                    this.props.showToast(error.mjson.msg);
                });
            } else {
                this.props.showToast('处理取消订单申请失败');
            }
        });
    };

    denyCancel = () => {
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    company_id: datas.company_base_id,
                    order_id: this.orderDetail.id
                };
                let url = AppUrls.ORDER_DENY_CANCEL;
                request(url, 'post', maps).then((response) => {
                    if (response.mjson.msg === 'ok' && response.mjson.code === 1) {
                        this.loadData();
                    } else {
                        this.props.showToast(response.mjson.msg);
                    }
                }, (error) => {
                    //this.props.showToast('处理取消订单申请失败');
                    this.props.showToast(error.mjson.msg);
                });
            } else {
                this.props.showToast('处理取消订单申请失败');
            }
        });
    };

    //扫描
    _onScanPress = () => {
        this.vinModal.refresh(this.scanType);
        this.vinModal.openModal(1);
    };

    _vinPress = (mType, index) => {
        if (mType === 0) {
            this.modelInfo['brand_id'] = this.modelData[index].brand_id;
            this.modelInfo['model_id'] = this.modelData[index].model_id;
            this.modelInfo['series_id'] = this.modelData[index].series_id;
            this.modelInfo['model_year'] = this.modelData[index].model_year;
            this.modelInfo['model_name'] = this.modelData[index].model_name;
            //this._insertVinAndModel(this.vin, JSON.stringify(this.modelInfo), this.modelInfo['model_name']);
        } else if (mType === 1) {
            if (IS_ANDROID === true) {
                NativeModules.VinScan.scan(parseInt(index)).then((vl) => {
                    this.vinInput.setNativeProps({
                        text: vl
                    });
                    this._onVinChange(vl);
                }, (error) => {
                });
            } else {
                this.timer = setTimeout(
                    () => {
                        NativeModules.VinScan.scan(parseInt(index)).then((vl) => {
                            this.vinInput.setNativeProps({
                                text: vl
                            });
                            this._onVinChange(vl);
                        }, (error) => {
                        });
                    },
                    500
                );
            }
        }
    };

    _onVinChange = (text) => {
        this.carVin = text;
        if (text.length === 17) {
            this.props.showModal(true);
            this.vinInput.blur();
            Net.request(AppUrls.VININFO, 'post', {vin: text}).then(
                (response) => {
                    this.props.showModal(false);
                    if (response.mycode === 1) {
                        let rd = response.mjson.data;
                        if (rd.length === 0) {
                            this.props.showToast('车架号校验失败');
                        }
                    } else {
                        this.props.showToast('车架号校验失败');
                    }
                },
                (error) => {
                    //this.props.showModal(false);
                    this.props.showToast('车架号校验失败');
                }
            );
        }
    };

    /**
     * 取消订单请求
     */
    cancelOrder = () => {
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    company_id: datas.company_base_id,
                    order_id: this.orderDetail.id,
                    type: 2
                };
                let url = AppUrls.ORDER_CANCEL;
                request(url, 'post', maps).then((response) => {
                    if (response.mjson.msg === 'ok' && response.mjson.code === 1) {
                        this.loadData();
                    } else {
                        this.props.showToast(response.mjson.msg);
                    }
                }, (error) => {
                    //this.props.showToast('取消订单失败');
                    this.props.showToast(error.mjson.msg);
                });
            } else {
                this.props.showToast('取消订单失败');
            }
        });
    };

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
                                //webUrl: response.mjson.data.contract_file_path
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

    dateReversal = (time) => {
        const date = new Date();
        date.setTime(time);
        return (date.getFullYear() + "-" + (this.PrefixInteger(date.getMonth() + 1, 2)) + "-" +
        (this.PrefixInteger(date.getDate(), 2)));
    };

    PrefixInteger = (num, length) => {
        return (Array(length).join('0') + num).slice(-length);
    };

    // 下拉刷新数据
    refreshingData = () => {
        //this.orderListData = [];
        this.carAmount = 0;
        this.setState({isRefreshing: true});
        this.loadData();
    };

    refundJudgment = (amount) => {
        if (amount > 0) {
            return amount + '元(补偿)';
        } else if (amount < 0) {
            return amount + '元(退还)';
        } else {
            return amount;
        }
    };

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return ( <View style={styles.container}>
                {this.loadView()}
                <NavigatorView title='订单详情' backIconClick={this.backPage}/>
            </View>);
        } else {
            return (
                <View style={styles.container}>
                    <VinInfo viewData={this.scanType} vinPress={this._vinPress} ref={(modal) => {
                        this.vinModal = modal
                    }}/>
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
                    <ExplainModal ref='expModal' title='补差额说明' buttonStyle={styles.expButton} textStyle={styles.expText}
                                  text='知道了'
                                  content='为了确保交易金额可支付贷款本息，请您补足成交价与贷款本息，及额外30日利息（是交易持续时期可能产生的利息，根据实际日期付息）的差额。如未能在30日内完成交易，则自动关闭交易，并退还双方已支付的款项。'/>
                    <View style={{flex: 1}}/>
                    {this.initDetailPageBottom(this.bottomState)}
                    <AccountForOrderModal ref="accountmodal"/>
                </View>
            )
        }
    }

    _renderSeperator = (sectionID: number, rowID: number, adjacentRowHighlighted: bool) => {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{backgroundColor: fontAndColor.COLORA3, height: Pixel.getPixel(10)}}/>
        )
    }

    /**
     *
     * @param rowData
     * @param selectionID
     * @param rowID
     * @returns {XML}
     * @private
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
                    layoutTitle={this.contactData.layoutTitle ? this.contactData.layoutTitle : ''}
                    layoutContent={this.contactData.layoutContent ? this.contactData.layoutContent : ''}
                    setPrompt={this.contactData.setPrompt ? this.contactData.setPrompt : false}
                    promptTitle={this.contactData.promptTitle ? this.contactData.promptTitle : ''}
                    promptContent={this.contactData.promptContent ? this.contactData.promptContent : ''}
                    showShopId={this.orderDetail.buyer_company_id}/>
            )
        } else if (rowData === '2') {
            return (
                <TransactionPrice amount={this.carAmount}
                                  deposit={this.deposit}
                                  updateDepositAmount={this.updateDepositAmount}
                                  isShowFinance={this.isShowFinance}
                                  showToast={this.props.showToast}
                                  showModal={this.props.showModal}
                                  ref={(ref) => {this.transactionPrice = ref}}
                                  carId={this.orderDetail.orders_item_data[0].car_id}
                                  orderId={this.orderDetail.id}/>

            )
            //this.carAmount = this.orderDetail.orders_item_data[0].transaction_price;
            //console.log('this.carAmount', this.carAmount);
        } else if (rowData === '3') {
            return (
                <View style={styles.itemType7}>
                    <View style={{height: Pixel.getPixel(40), alignItems: 'center', flexDirection: 'row'}}>
                        <Text allowFontScaling={false} style={{
                            fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                            marginLeft: Pixel.getPixel(15)
                        }}>车辆已融资,交易需补差额</Text>
                        <Text allowFontScaling={false} style={{
                            fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                            color: fontAndColor.COLORB2
                        }}>{this.financeInfo ? this.financeInfo.seller_add_amount : 0}元</Text>
                        <View style={{flex: 1}}/>
                        <Text allowFontScaling={false}
                              onPress={() => {
                                  this.refs.expModal.changeShowType(true, '补差额说明', '为了确保交易金额可支付贷款本息，请您补足成交价与贷款本息，及额外30日利息（是交易持续时期可能产生的利息，根据实际日期付息）的差额。如未能在30日内完成交易，则自动关闭交易，并退还双方已支付的款项。',
                                      '知道了');
                              }}
                              style={{marginRight: Pixel.getPixel(15), color: fontAndColor.COLORB4}}>补差额说明</Text>
                    </View>
                    <View style={styles.separatedLine}/>
                    <View style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        marginLeft: Pixel.getPixel(15),
                        marginTop: Pixel.getPixel(20),
                        marginRight: Pixel.getPixel(15)
                    }}>
                        <Text allowFontScaling={false} style={styles.orderInfo}>贷款本金</Text>
                        <View style={{flex: 1}}/>
                        <Text allowFontScaling={false}
                              style={styles.infoContentRed}>{this.financeInfo ? this.financeInfo.seller_finance_amount : 0}元</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text allowFontScaling={false} style={styles.orderInfo}>贷款利息</Text>
                        <View style={{flex: 1}}/>
                        <Text allowFontScaling={false}
                              style={styles.infoContentRed}>{this.financeInfo ? this.financeInfo.interest_amount : 0}元</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text allowFontScaling={false} style={styles.orderInfo}>30日利息</Text>
                        <View style={{flex: 1}}/>
                        <Text allowFontScaling={false}
                              style={styles.infoContentRed}>{this.financeInfo ? this.financeInfo.days_interest_amount : 0}元</Text>
                    </View>
                    <View style={{
                        marginTop: Pixel.getPixel(20),
                        marginRight: Pixel.getPixel(15),
                        marginLeft: Pixel.getPixel(15),
                        height: 1,
                        backgroundColor: fontAndColor.COLORA4
                    }}/>
                    <View style={{height: Pixel.getPixel(40), alignItems: 'center', flexDirection: 'row'}}>
                        <TouchableOpacity
                            onPress={() => {
                                this.toNextPage({
                                    name: 'AccountScene',
                                    component: AccountScene,
                                    params: {}
                                });
                            }}>
                            <View style={{
                                marginLeft: Pixel.getPixel(15),
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
        } else if (rowData === '4') {
            return (
                <View style={styles.itemType2}>
                    <Image
                        style={{marginLeft: Pixel.getPixel(15)}}
                        source={require('../../../images/mainImage/agreed_sign.png')}/>
                    <Text allowFontScaling={false} style={{color: fontAndColor.COLORA1, marginLeft: Pixel.getPixel(5)}}>我已同意签署</Text>
                    <Text allowFontScaling={false}
                          onPress={() => {
                              this.getTypeContractInfo(1)
                          }}
                          style={{color: fontAndColor.COLORA2}}>《买卖协议》</Text>
                    {/*<Text allowFontScaling={false}  style={{color: fontAndColor.COLORA1}}>和</Text>
                     <Text allowFontScaling={false} 
                     onPress={() => {
                     this.getTypeContractInfo(4)
                     }}
                     style={{color: fontAndColor.COLORA2}}>《授权声明》</Text>*/}
                    {
                        this.orderDetail.orders_item_data[0].car_finance_data.pledge_type == 2 &&
                        this.orderDetail.orders_item_data[0].car_finance_data.pledge_status == 1 &&
                        <Text
                            onPress={() => {
                                this.getTypeContractInfo(4)
                            }}
                            style={{color: fontAndColor.COLORA2}}>《授权声明》</Text>
                    }
                </View>
            )
        } else if (rowData === '5') {
            //let initRegDate = this.dateReversal(this.orderDetail.orders_item_data[0].car_data.init_reg + '000');
            //let imageUrl = this.orderDetail.orders_item_data[0].car_data.imgs;
            let initReg = this.orderDetail.orders_item_data[0].car_data.init_reg;
            let mileage = this.orderDetail.orders_item_data[0].car_data.mileage;
            let initRegDate = initReg === 0 ? '暂无' : this.dateReversal(initReg + '000');
            let imageUrl = this.orderDetail.orders_item_data[0].car_data.imgs;
            {/*return (*/
            }
            {/*<View style={styles.itemType3}>*/
            }
            {/*<View style={{*/
            }
            {/*height: Pixel.getPixel(40),*/
            }
            {/*marginLeft: Pixel.getPixel(15),*/
            }
            {/*justifyContent: 'center'*/
            }
            {/*}}>*/
            }
            {/*<Text style={styles.orderInfo}>订单号:{this.orderDetail.order_no}</Text>*/
            }
            //             <Text style={styles.orderInfo}>订单日期:{this.orderDetail.created_time}</Text>
            //         </View>
            //         <View style={styles.separatedLine}/>
            //         <View style={{flexDirection: 'row', height: Pixel.getPixel(105), alignItems: 'center'}}>
            //             <Image style={styles.image}
            //                    source={imageUrl.length ? {uri: imageUrl[0].icon_url} : require('../../../images/carSourceImages/car_null_img.png')}/>
            //             <View style={{marginLeft: Pixel.getPixel(10)}}>
            //                 <Text style={{width: width - Pixel.getPixel(15 + 120 + 10 + 15)}}
            //                       numberOfLines={1}>{this.orderDetail.orders_item_data[0].car_data.model_name}</Text>
            //                 <View style={{flexDirection: 'row', marginTop: Pixel.getPixel(10), alignItems: 'center'}}>
            //                     <Text style={styles.carDescribeTitle}>里程：</Text>
            //                     <Text style={styles.carDescribe}>{mileage}万</Text>
            //                 </View>
            //                 <View style={{flexDirection: 'row', marginTop: Pixel.getPixel(5), alignItems: 'center'}}>
            //                     <Text style={styles.carDescribeTitle}>上牌：</Text>
            //                     <Text style={styles.carDescribe}>{initRegDate}</Text>
            //                 </View>
            //                 {this.orderState !== 0 ? <View
            //                     style={{flexDirection: 'row', marginTop: Pixel.getPixel(5), alignItems: 'center'}}>
            //                     <Text style={styles.carDescribeTitle}>成交价：</Text>
            //                     <Text style={styles.carDescribe}>{this.orderDetail.transaction_amount}元</Text>
            //                 </View> : null}
            //             </View>
            //         </View>
            //     </View>
            // )
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
                    <View style={{flexDirection: 'row', height: Pixel.getPixel(105)}}>
                        <View style={{flex: 1, backgroundColor: '#fff', justifyContent: 'center'}}>
                            <Image style={styles.image} source={imageUrl.length
                                ? {uri: imageUrl[0].icon_url} :
                                require('../../../images/carSourceImages/car_null_img.png')}/>
                        </View>
                        <View style={{
                            flex: 2, backgroundColor: '#fff', justifyContent: 'center',
                            marginRight: Pixel.getPixel(15), paddingLeft: Pixel.getPixel(10)
                        }}>
                            <Text allowFontScaling={false}
                                  style={{width: width - Pixel.getPixel(15 + 120 + 10 + 15)}}
                                  numberOfLines={1}>{this.orderDetail.orders_item_data[0]
                                .car_data.model_name}</Text>
                            <View style={{
                                marginTop: Pixel.getPixel(10), flexDirection: 'row',
                            }}>
                                <Text
                                    allowFontScaling={false}
                                    style={{
                                        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                                        color: fontAndColor.COLORA1
                                    }}>里程：</Text>
                                <Text
                                    allowFontScaling={false}
                                    style={{
                                        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                                        color: '#000'
                                    }}>{mileage}万</Text>
                            </View>
                            <View style={{
                                marginTop: Pixel.getPixel(5), flexDirection: 'row',
                            }}>
                                <Text
                                    allowFontScaling={false}
                                    style={{
                                        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                                        color: fontAndColor.COLORA1
                                    }}>上牌：</Text>
                                <Text
                                    allowFontScaling={false}
                                    style={{
                                        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                                        color: '#000'
                                    }}>{initRegDate}</Text>
                            </View>
                            {this.orderState !== 0 && this.orderState !== 1 ?
                                <View style={{
                                    marginTop: Pixel.getPixel(5), flexDirection: 'row',
                                }}>
                                    <Text
                                        allowFontScaling={false}
                                        style={{
                                            fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                                            color: fontAndColor.COLORA1
                                        }}>成交价：</Text>
                                    <Text
                                        allowFontScaling={false}
                                        style={{
                                            fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                                            color: '#000'
                                        }}>{this.orderDetail.transaction_amount}元</Text>
                                </View>
                                : <View/>}
                        </View>
                    </View>
                </View>
            )
        } else if (rowData === '6') {
            return (
                <View style={styles.itemType6}>
                    <Text allowFontScaling={false} style={{
                        marginLeft: Pixel.getPixel(15),
                        marginTop: Pixel.getPixel(3),
                        color: fontAndColor.COLORB2
                    }}>*</Text>
                    <Text allowFontScaling={false}>车架号</Text>
                    <TextInput style={{
                        marginLeft: Pixel.getPixel(10),
                        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                        padding: 0,
                        width: Pixel.getPixel(180)
                    }}
                               placeholder='输入车架号'
                               underlineColorAndroid='transparent'
                               maxLength={17}
                               onChangeText={this._onVinChange}
                               keyboardType={'ascii-capable'}
                               placeholderTextColor={fontAndColor.COLORA4}
                               ref={(input) => {
                                   this.vinInput = input
                               }}
                               placheolderFontSize={Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}/>
                    <View style={{flex: 1}}/>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={this._onScanPress}>
                        <View style={{flexDirection: 'row'}}>
                            {/*<Text allowFontScaling={false}  style={{color: fontAndColor.COLORA2}}>扫描</Text>*/}
                            <Image
                                style={{marginRight: Pixel.getPixel(15)}}
                                source={require('../../../images/mainImage/scanning.png')}/>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        } else if (rowData === '7') {
            return (
                <SalesInfo orderDetail={this.orderDetail} orderState={this.orderState}/>
            )
        } else if (rowData === '8') {
            return (
                <View style={styles.itemType5}>
                    <View style={{height: Pixel.getPixel(40), alignItems: 'center', flexDirection: 'row'}}>
                        <Text allowFontScaling={false} style={{
                            fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                            marginLeft: Pixel.getPixel(15)
                        }}>单车融资还款</Text>
                        <View style={{flex: 1}}/>
                        <Text allowFontScaling={false} style={{color: fontAndColor.COLORA2}}>还款单号:</Text>
                        <Text allowFontScaling={false} style={{color: fontAndColor.COLORA2}}>232222333</Text>
                        <Image
                            style={styles.backIcon}
                            source={require('../../../images/mainImage/celljiantou.png')}/>
                    </View>
                    <View style={styles.separatedLine}/>
                    <View style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        marginLeft: Pixel.getPixel(15),
                        marginTop: Pixel.getPixel(20),
                        marginRight: Pixel.getPixel(15)
                    }}>
                        <Text allowFontScaling={false} style={styles.orderInfo}>本金</Text>
                        <View style={{flex: 1}}/>
                        <Text allowFontScaling={false} style={styles.infoContent}>100000元</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text allowFontScaling={false} style={styles.orderInfo}>利息</Text>
                        <View style={{flex: 1}}/>
                        <Text allowFontScaling={false} style={styles.infoContent}>100000元</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text allowFontScaling={false} style={styles.orderInfo}>居间费</Text>
                        <View style={{flex: 1}}/>
                        <Text allowFontScaling={false} style={styles.infoContent}>100000元</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text allowFontScaling={false} style={styles.orderInfo}>还款总计</Text>
                        <View style={{flex: 1}}/>
                        <Text allowFontScaling={false} style={styles.infoContent}>100000元</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text allowFontScaling={false} style={styles.orderInfo}>剩余总计</Text>
                        <View style={{flex: 1}}/>
                        <Text allowFontScaling={false} style={styles.infoContent}>100000元</Text>
                    </View>
                </View>
            )
        } else if (rowData === '9') {
            return (
                <View style={styles.itemType9}>
                    <View style={{height: Pixel.getPixel(40), alignItems: 'center', flexDirection: 'row'}}>
                        <Text allowFontScaling={false} style={{
                            fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                            marginLeft: Pixel.getPixel(15)
                        }}>买家信息</Text>
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
                        <Text allowFontScaling={false} style={styles.infoContent}>{this.orderDetail.buyer_name}</Text>
                    </View>
                    {/*<View style={styles.infoItem}>
                     <Text allowFontScaling={false}  style={styles.orderInfo}>联系方式</Text>
                     <View style={{flex: 1}}/>
                     <Text allowFontScaling={false}  style={styles.infoContent}>{this.orderDetail.buyer_phone}</Text>
                     </View>*/}
                    <View style={styles.infoItem}>
                        <Text allowFontScaling={false} style={styles.orderInfo}>企业名称</Text>
                        <View style={{flex: 1}}/>
                        <Text allowFontScaling={false}
                              style={styles.infoContent}>{this.orderDetail.buyer_company_name}</Text>
                    </View>
                </View>
            )
        } else if (rowData === '10') {
            let paymentId = this.orderDetail.orders_item_data[0].car_finance_data.payment_id ?
                this.orderDetail.orders_item_data[0].car_finance_data.payment_id : 0;
            let paymentNumber = this.orderDetail.orders_item_data[0].pledge_sub_payment_number ?
                this.orderDetail.orders_item_data[0].pledge_sub_payment_number : 0;
            let pledgeType = this.orderDetail.orders_item_data[0].car_finance_data.pledge_type ?
                this.orderDetail.orders_item_data[0].car_finance_data.pledge_type : 0;
            return (
                <TouchableOpacity
                    style={styles.itemType10}
                    activeOpacity={0.9}
                    onPress={() => {
                        // 跳转金融页面  还款详情
                        /*if (pledgeType == 2 && paymentNumber != 0) {
                         this.toNextPage({
                         name: 'RepaymentInfoScene',
                         component: RepaymentInfoScene,
                         params: {
                         loan_id: paymentId,
                         loan_number: paymentNumber,
                         type: pledgeType,
                         from: 'SingleRepaymentPage'
                         }
                         });
                         } else {
                         this.props.showToast('车辆质押状态错误');
                         }*/
                    }}>
                    <View style={{alignItems: 'center', flexDirection: 'row', height: Pixel.getPixel(44)}}>
                        <Text style={{
                            marginLeft: Pixel.getPixel(15),
                            fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                            color: fontAndColor.COLORA0
                        }}>还款单号</Text>
                        <View style={{flex: 1}}/>
                        <Text style={{
                            marginRight: Pixel.getPixel(10),
                            fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                            color: fontAndColor.COLORA1
                        }}>{this.orderDetail.orders_item_data[0].pledge_sub_payment_number ? this.orderDetail.orders_item_data[0].pledge_sub_payment_number : '未生成还款单号'}</Text>
                        {/*<Image source={require('../../../images/mainImage/celljiantou.png')}
                         style={{marginRight: Pixel.getPixel(15)}}/>*/}
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
        marginLeft: Pixel.getPixel(15),
        fontSize: Pixel.getFontPixel(fontAndColor.TITLEFONT40),
        color: fontAndColor.COLORB2,
        marginTop: Pixel.getPixel(21)
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
        height: Pixel.getPixel(151)
    },
    itemType9: {
        backgroundColor: '#ffffff',
        height: Pixel.getPixel(121)
    },
    itemType7: {
        backgroundColor: '#ffffff'
        //height: Pixel.getPixel(200)
    },
    infoContent: {
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28)
    },
    infoContentRed: {
        color: fontAndColor.COLORB2,
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
        height: Pixel.getPixel(200)
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
        color: fontAndColor.COLORA2,
    },
    itemType6: {
        alignItems: 'center',
        flexDirection: 'row',
        height: Pixel.getPixel(44),
        backgroundColor: '#ffffff',
        justifyContent: 'center'
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
    bottomBar: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#ffffff',
        height: Pixel.getPixel(50),
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: fontAndColor.COLORA4
    },
    tradingCountdown: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: Pixel.getPixel(15),
        paddingRight: Pixel.getPixel(15),
        paddingTop: Pixel.getPixel(10),
        paddingBottom: Pixel.getPixel(10),
        //height: Pixel.getPixel(40),
        backgroundColor: fontAndColor.COLORB6
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
    itemType10: {
        backgroundColor: '#ffffff',
        height: Pixel.getPixel(44)
    }
});