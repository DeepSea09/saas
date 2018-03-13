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
    InteractionManager,
    Dimensions,
    TextInput
} from 'react-native'

const {width, height} = Dimensions.get('window');
import BaseComponent from "../../component/BaseComponent";
import NavigatorView from '../../component/AllNavigationView';
import * as fontAndColor from '../../constant/fontAndColor';
import PixelUtil from '../../utils/PixelUtil';
import MyButton from "../../component/MyButton";
import * as AppUrls from "../../constant/appUrls";
import {request} from "../../utils/RequestUtil";
import AccountScene from "../../mine/accountManage/RechargeScene";
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";
import * as webBackUrl from "../../constant/webBackUrl";
import AccountWebScene from "../../mine/accountManage/AccountWebScene";
import * as Urls from '../../constant/appUrls';

const Pixel = new PixelUtil();

export default class CheckStand extends BaseComponent {

    constructor(props) {
        super(props);
        this.balance='';
        this.payMoney='';
        this.accountInfo=null;
        this.cashier_desk_trans_serial_no='';
        this.accountInfo = '';
        this.transSerialNo = '';
        this.isShowFinancing = 0;
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
        this.getData();
    };

    getData = () => {
        let maps = {
            api: Urls.CASHIER_TABLE,
            supervise_order_num:this.props.orderNums
        };
        request(Urls.FINANCE, 'Post', maps)

            .then((response) => {
                    if (response.mjson.data == null  || response.mjson.data.length==0) {
                        this.setState({renderPlaceholderOnly: 'null'});
                        if(!this.isEmpty(response.mjson.msg)){
                            this.props.showToast(response.mjson.msg);
                            this.props.callBack()
                        }

                    } else {
                        let data=response.mjson.data;
                        this.cashier_desk_trans_serial_no=data.cashier_desk_trans_serial_no;
                        this.accountInfo=data.account_info;
                        this.payMoney=data.money_count;
                        this.setState({
                            renderPlaceholderOnly: 'success',

                        });
                    }
                },
                (error) => {
                    this.setState({renderPlaceholderOnly: 'error', isRefreshing: false});
                });
    }

    isEmpty = (str)=>{
        if(typeof(str) != 'undefined' && str !== null && str !== ''){
            return false;
        }else {
            return true;
        }
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
                    <View style={{backgroundColor: 'white', marginTop: Pixel.getTitlePixel(65)}}>
                        <View style={styles.needPayBar}>
                            <Text allowFontScaling={false} style={{
                                fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                                marginTop: Pixel.getPixel(25)
                            }}>需支付金额</Text>
                            <Text allowFontScaling={false} style={{
                                marginTop: Pixel.getPixel(6),
                                //fontWeight: 'bold',
                                fontSize: Pixel.getFontPixel(38)
                            }}>{parseFloat(this.payMoney).toFixed(2)+'元'}</Text>
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
                    <MyButton buttonType={MyButton.TEXTBUTTON}
                              content={'支付'}
                              parentStyle={styles.loginBtnStyle}
                              childStyle={styles.loginButtonTextStyle}
                              mOnPress={this.goPay}/>
                </View>
            )
        }
    }

    goPay = () => {

        this.goInitialPay();
    };

    goInitialPay = () => {
        this.props.showModal(true);
        let url = AppUrls.SUPERVISE_PAY;
        let maps = {
            cashier_desk_trans_serial_no: this.cashier_desk_trans_serial_no,
            transfer_accounts_url: webBackUrl.SUPERVICEPAY,
            api:url
        };
        request(AppUrls.FINANCE, 'post', maps).then((response) => {
            this.props.showModal(false);
            if (response.mjson.code === 1) {
                if (response.mjson.data == null  || response.mjson.data.length==0) {
                    if(!this.isEmpty(response.mjson.msg)){
                        this.props.showToast(response.mjson.msg);
                        this.props.callBack();
                    }

                }else{
                    this.transSerialNo = response.mjson.data.trans_serial_no;
                    this.toNextPage({
                        name: 'AccountWebScene',
                        component: AccountWebScene,
                        params: {
                            title: '支付',
                            webUrl: response.mjson.data.transfer_accounts_url,
                            backUrl: webBackUrl.SUPERVICEPAY,
                            callBack:
                                ()=>{this.props.callBack()}
                        }
                    });
                }
            } else {
                this.props.showToast(response.mjson.msg);
            }
        }, (error) => {
            //this.props.showToast('账户支付失败');
            this.props.showToast(error.mjson.msg);
        });

    };

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
    }
});