/**
 * Created by hanmeng on 2017/5/18.
 */
import React, {Component, PropTypes} from 'react'

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    TextInput
} from  'react-native'

const {width, height} = Dimensions.get('window');
import * as fontAndColor from '../../../constant/fontAndColor';
import PixelUtil from '../../../utils/PixelUtil';
import InputAmountScene from "../InputAmountScene";
import BaseComponent from "../../../component/BaseComponent";
import PriceInput from "./PriceInput";
import DepositInputState from "./DepositInputState";
import StorageUtil from "../../../utils/StorageUtil";
import * as StorageKeyNames from "../../../constant/storageKeyNames";
import * as AppUrls from "../../../constant/appUrls";
import {request} from "../../../utils/RequestUtil";
const Pixel = new PixelUtil();


export default class TransactionPrice extends BaseComponent {

    constructor(props) {
        super(props);
        this.oldAmount = this.props.amount;
        this.amount = this.props.amount;
        this.deposit = this.props.deposit;
        this.state = {
            depositInputState: '请输入成交价'
        }
    }

    /*    isShowFinance = (financeInfo) => {
     this.props.isShowFinance(financeInfo);
     };*/

    componentWillReceiveProps(nextProps) {
        this.amount = nextProps.amount;
        this.deposit = nextProps.deposit;
    }

    render() {
        return (
            <View style={styles.itemType4}>
                <PriceInput title="成交价(元)"
                            ref={(ref) => {this.amountInput = ref}}
                            amount={this.amount}
                            updateAmount={this.updateAmount}
                            showModal={this.props.showModal}
                            inputOnBlur={() => {
                                this.localCheckPrice(this.amount, this.deposit, 1)
                            }}/>
                <View style={styles.separatedLine}/>
                <PriceInput title="应付订金(元)"
                            ref={(ref) => {this.depositInput = ref}}
                            amount={this.deposit}
                            updateAmount={this.updateDeposit}
                            showModal={this.props.showModal}
                            inputOnBlur={() => {
                                this.localCheckPrice(this.amount, this.deposit, 2)
                            }}/>
                {/*<View style={styles.separatedLine}/>*/}
                <Image style={{marginTop: Pixel.getPixel(-3)}}
                       source={require('../../../../images/transact/line.png')}/>
                <DepositInputState depositInputState={this.state.depositInputState}/>
            </View>
        )
    }

    /**
     *   获取输入的成交价
     **/
    getTransaction = () => {
        let transaction = this.amountInput.getAmount();
        this.oldAmount = transaction;
        return transaction;
    };

    /**
     *   获取输入的订金
     **/
    getDeposit = () => {
        return this.depositInput.getAmount();
    };

    /**
     *   成交价本地检查
     *   price 成交价
     *   deposit 订金
     *   type 1成交价  2订金
     **/
    localCheckPrice = (price, deposit, type) => {
        if (price === 0) {
            //return '成交价不能为0';
            this.updatePrompting('成交价不能为0');
/*            this.amountInput.changeColor(fontAndColor.COLORB2);
            this.depositInput.changeColor(fontAndColor.COLORA2);*/
        } else if (!this.isNumberByHundred(price)) {
            this.updatePrompting('成交价请输入整百金额');
        } else if (!this.isNumberByHundred(deposit) && deposit !== 0) {
            this.updatePrompting('订金请输入整百金额');
        } else if (deposit > (price * 0.2)) {
            this.updatePrompting('您设定的订金已超出最大金额');
        } else {
            if (type === 1) {
                this.checkPrice(price, deposit);
            }
            let pay = price * 0.2 >= 100 ? price * 0.2 : 0;
            this.updatePrompting('订金买家最多可付' + pay + '元');
        }
    };

    /**
     *   刷新TextInput字体颜色
     **/
    refreshTextInputColor = () => {
        this.depositInput.getFocus();
        this.amountInput.getFocus();
    };

    /**
     *   提示文案更新
     **/
    updatePrompting = (text) => {
        this.setState({depositInputState: text});
    };

    /**
     *  定价检查接口
     **/
    checkPrice = (price, deposit) => {
        //console.log('price', price + ',  ' + deposit + ',  ' + this.oldAmount);
        if (this.oldAmount != price) {
            this.oldAmount = price;
            this.props.showModal(true);
            StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
                if (data.code == 1 && data.result != null) {
                    let datas = JSON.parse(data.result);
                    let maps = {
                        company_id: datas.company_base_id,
                        car_id: this.props.carId,
                        order_id: this.props.orderId,
                        pricing_amount: price,
                        deposit_amount: deposit
                    };
                    let url = AppUrls.ORDER_CHECK_PRICE;
                    request(url, 'post', maps).then((response) => {
                        if (response.mjson.msg === 'ok' && response.mjson.code === 1) {
                            this.props.showModal(false);
                            this.props.isShowFinance(response.mjson.data, false);
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
        }
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

    updateAmount = (newAmount) => {
        this.props.updateDepositAmount(newAmount, this.deposit);
        this.amount = newAmount;
    };

    updateDeposit = (newDeposit) => {
        this.props.updateDepositAmount(this.amount, newDeposit);
        this.deposit = newDeposit;
    };

/*    updateDepositAmount = (newAmount, newDeposit) => {
        this.props.updateDeposit(newAmount, newDeposit);
        this.amount = newAmount;
        this.deposit = newDeposit;
    };*/
}

const styles = StyleSheet.create({
    separatedLine: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15),
        height: 0.5,
        backgroundColor: fontAndColor.COLORA4
    },
    itemType4: {
        backgroundColor: '#ffffff',
        height: Pixel.getPixel(133)
    }
});