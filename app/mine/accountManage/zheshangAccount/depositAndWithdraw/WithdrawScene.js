/**
 * Created by dingyonggang on 2017/10/27.
 */

import React, {Component} from "react";
import {
    View,
    Text, Image,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    InteractionManager,
    TouchableWithoutFeedback,
    ScrollView,
    Button
} from "react-native";
import BaseComponent from "../../../../component/BaseComponent";
import NavigationBar from "../../../../component/NavigationBar";
import * as FontAndColor from "../../../../constant/fontAndColor";
import PixelUtil from "../../../../utils/PixelUtil";
import MyButton from "../../../../component/MyButton";
import {request} from "../../../../utils/RequestUtil";
import * as AppUrls from "../../../../constant/appUrls";
import StorageUtil from "../../../../utils/StorageUtil";
import * as StorageKeyNames from "../../../../constant/storageKeyNames";
import SText from '../component/SaasText'
import SmsFillScene from './SmsFillScene'
import ResultIndicativeScene from '../ResultIndicativeScene'
import ZSBaseComponent from  '../component/ZSBaseComponent'

let Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');
let Pixel = new PixelUtil();
let Platform = require('Platform');

export default class WithdrawScene extends ZSBaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            renderPlaceholderOnly: true,
            sms_pad: false,
            money_input: '',
            allow_withdraw_amount: ''
        }
    }

    initFinish() {
        this.loadInstruction()
        this.setState({
            renderPlaceholderOnly: false,
        })
    }

    loadInstruction = () => {
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code === 1 && data.result !== null) {
                let datas = JSON.parse(data.result);
                //this.isOpenContract = datas.is_open_electron_repayment_contract;
                let maps = {
                    enter_base_id: datas.company_base_id,
                };

                //TODO
                request(AppUrls.ZS_QUOTA, 'Post', maps)
                    .then((response) => {
                        this.setState({
                            allow_withdraw_amount: response.mjson.data.allow_withdraw_amount,
                        })
                    }, (error) => {
                        this.props.showToast(error.mjson.msg)

                    });
            } else {
                this.props.showToast('限额说明查询失败');
                this.setState({
                    renderPlaceholderOnly: 'error',
                    isRefreshing: false
                });
            }
        })
    }


    render() {

        if (this.state.renderPlaceholderOnly) {
            return (
                <View style={{flex: 1, backgroundColor: FontAndColor.COLORA3}}>
                    <NavigationBar
                        leftImageShow={false}
                        leftTextShow={true}
                        leftText={""}
                        centerText={'提现'}
                        rightText={""}

                    />
                </View>
            )
        }


        let a = Array.from(this.props.account.bind_bank_card_no)
        let s = '';
        for (let i = 0; i < a.length; i++) {
            if (i >= 4 && i < a.length - 4) {
                s += '*'
            } else {
                s += a[i];
            }
        }

        return (
            <View style={{flex: 1, backgroundColor: FontAndColor.COLORA3}}>
                <NavigationBar
                    leftImageShow={true}
                    leftTextShow={false}
                    centerText={'提现'}
                    rightText={''}
                    leftImageCallBack={() => {
                        this.props.callBack()
                        this.backPage();
                    }}
                />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                >


                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        marginTop: 15,
                        paddingVertical: 20
                    }}>
                        <Image source={require('../../../../../images/account/zheshang_bank.png')}
                               style={{width: 55, height: 55, marginHorizontal: 15}}/>
                        <View>
                            <SText style={{fontSize: 17, marginBottom: 10}}>{this.props.account.bind_sub_bank_name}</SText>
                            <SText
                                style={{color: FontAndColor.COLORA1}}>{this.props.account.bind_bank_card_name}{s}</SText>
                        </View>
                    </View>

                    <View style={{backgroundColor: 'white', marginTop: 10}}>
                        <View style={{marginHorizontal: 15,}}>
                            <View style={{
                                borderBottomWidth: StyleSheet.hairlineWidth,
                                borderBottomColor: FontAndColor.COLORA4
                            }}>
                                <SText style={{marginVertical: 15, fontSize: 15}}>提现金额（元）</SText>
                                <View style={{flexDirection: 'row',}}>
                                    <SText style={{marginRight: 5, marginTop: 5, fontSize: 14}}>￥</SText>
                                    <TextInput
                                        style={{
                                            height: 40,
                                            fontSize: Pixel.getPixel(35),
                                            flex: 1,
                                            marginBottom: 15,
                                            padding: 0
                                        }}
                                        keyboardType={'numeric'}
                                        underlineColorAndroid={"#00000000"}
                                        onChangeText={(text) => {
                                                this.setState({
                                                    money_input: text
                                                })
                                        }}
                                        value={this.state.money_input}
                                    />
                                </View>
                            </View>
                            <View style={{paddingVertical: 10}}>
                                <View style={{flexDirection: 'row', marginBottom: 5}}>
                                    <SText
                                        style={{color: FontAndColor.COLORA1}}>{this.props.account.bank_name}现金余额:</SText>
                                    <SText>{this.props.account.balance}元</SText>
                                    <SText
                                        style={{color: FontAndColor.COLORB4, fontSize: 16, textAlign: 'right', flex: 1}}
                                        onPress={() => {

                                            this.setState({
                                                money_input: this.state.allow_withdraw_amount,
                                            })
                                        }}
                                    >全部提现</SText>

                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <SText style={{color: FontAndColor.COLORA1}}>可取余额:</SText>
                                    <SText>{this.state.allow_withdraw_amount}元</SText>
                                </View>

                            </View>
                        </View>

                    </View>

                    <MyButton
                        buttonType={MyButton.TEXTBUTTON}
                        content={'确认提现'}
                        parentStyle={styles.next_button_parent}
                        childStyle={{fontSize: 18, color: 'white'}}
                        mOnPress={() => {

                            if (parseFloat(this.state.allow_withdraw_amount) < parseFloat(this.state.money_input)) {
                                this.props.showToast('可提余额不足');
                                return;
                            }
                            let money = parseFloat(this.state.money_input)
                            if (money <= 0 || this.state.money_input === null || this.state.money_input === '') {
                                this.props.showToast('请输入金额')
                                return;
                            }
                            this.setState({
                                sms_pad: true
                            })
                        }}

                    />

                    <View style={{marginHorizontal: 30, marginVertical: 40}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
                            <View style={{height: 1, backgroundColor: FontAndColor.COLORA4, flex: 1, marginRight: 15}}/>
                            <SText style={{color: FontAndColor.COLORA1}}>温馨提示</SText>
                            <View style={{height: 1, backgroundColor: FontAndColor.COLORA4, flex: 1, marginLeft: 15}}/>
                        </View>
                        <SText style={{color: FontAndColor.COLORA1, marginBottom: 5, lineHeight: 20}}>1  个人7*24小时，实时到账。</SText>

                        <SText style={{color: FontAndColor.COLORA1, lineHeight: 20}}>{"2  企业工作日 9:00-16:30实时到账，其他时间单笔  <=5w 实时到账"}</SText>


                    </View>

                </ScrollView>


                {this.state.sms_pad ?
                    <SmsFillScene
                        showModal={this.props.showModal}
                        showToast={this.props.showToast}
                        money={parseFloat(this.state.money_input)}
                        type={1}
                        account={this.props.account}
                        closeCallBack={() => {
                            this.setState({
                                sms_pad: false
                            })
                        }}
                        codeCallBack={this.withdraw}
                    />
                    : null
                }
                {this.out_of_service()}
            </View>

        )
    }

    withdraw = (sms_code, sms_no) => {

        this.props.showModal(true)
        this.dismissKeyboard();
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code === 1) {
                let result = JSON.parse(data.result)
                let params = {
                    amount: parseFloat(this.state.money_input),
                    enter_base_id: result.company_base_id,
                    sub_acct_no: this.props.account.bank_card_no,
                    sms_code: sms_code,
                    sms_no: sms_no?sms_no:"000000"
                }

                request(AppUrls.ZS_WITHDRAW, 'POST', params).then((response) => {
                    this.props.showModal(false)
                    this.setState({
                        sms_pad: false
                    })

                    this.toNextPage({
                        component: ResultIndicativeScene,
                        name: 'ResultIndicativeScene',
                        params: {
                            type: 3,
                            status: 1,
                            params: params,
                            callBack:this.props.callBack,
                        }
                    })
                }, (error) => {

                    this.props.showModal(false)
                    this.setState({
                        sms_pad: false
                    })


                    if(error.mycode === 8050324){  // 不在服务时间内
                        this.setState({
                            out_of_service_msg:error.mjson.msg,
                            alert:true
                        })
                        return
                    }

                    if (error.mycode === 8010007) {  // 存疑
                        this.toNextPage({
                            component: ResultIndicativeScene,
                            name: 'ResultIndicativeScene',
                            params: {
                                type: 3,
                                status: 0,
                                params: params,
                                error:error.mjson,
                                callBack:this.props.callBack,
                            }
                        })

                    }else if(error.mycode === -300 || error.mycode === -500){
                        this.props.showToast(error.mjson.msg)
                    }else {
                        this.toNextPage({
                            component: ResultIndicativeScene,
                            name: 'ResultIndicativeScene',
                            params: {
                                type: 3,
                                status: 2,
                                params: params,
                                error:error.mjson,
                                callBack:this.props.callBack,
                            }
                        })
                    }
                })
            }
        })
    }
}
const styles = StyleSheet.create({
    deposit_container_selected: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: FontAndColor.COLORB0,
        borderBottomWidth: 1,
        height: 50
    },
    deposit_container_deselected: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: FontAndColor.COLORA4,
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 50
    },

    deposit_title_selected: {
        color: FontAndColor.COLORB0,
        fontSize: 16,
    },
    deposit_title_deselected: {
        color: 'black',
        fontSize: 16,
    },
    next_button_parent: {
        backgroundColor: FontAndColor.COLORB0,
        marginTop: 50,
        height: 50,
        width: width - 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        borderRadius: 3,
    }
})