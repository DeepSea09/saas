/**
 * Created by dingyonggang on 2017/10/27.
 */
import React, {Component} from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    InteractionManager,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    ScrollView
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
import TextInputItem from '../component/TextInputItem'
import ChooseBankNameScene from '../component/ChooseBankNameScene'
import ResultIndicativeScene from '../ResultIndicativeScene'
import ZSBaseComponent from  '../component/ZSBaseComponent'

let Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');
let Pixel = new PixelUtil();
let Platform = require('Platform');

let bank_no = '' // 支行编号
let sub_bank_no = '' //总行编号
let sub_bank_name = '' //总行名字
let bank_card_no = ''
let bank_name = ''
let mobile_no = ''
let sms_code = ''
let sms_no = ''


export default class ModifyBankCard extends ZSBaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            renderPlaceholderOnly: true,
            loading_bank: false,
            bankName: ''
        }
    }

    initFinish = () => {
        this.setState({renderPlaceholderOnly: false});
    }

    render() {
        if (this.state.renderPlaceholderOnly) {
            return ( <TouchableWithoutFeedback onPress={() => {
                this.setState({
                    show: false,
                });
            }}>
                <View style={{flex: 1, backgroundColor: FontAndColor.COLORA3}}>
                    <NavigationBar
                        leftImageShow={false}
                        leftTextShow={true}
                        leftText={""}
                        centerText={'更换银行卡'}
                        rightText={""}
                        centerTextStyle={{paddingHorizontal: 0}}
                    />
                </View>
            </TouchableWithoutFeedback>);
        }

        return (


            <TouchableWithoutFeedback
                onPress={() => {
                    this.dismissKeyboard()
                }}
            >
                <View style={styles.container}>
                    <NavigationBar
                        leftImageShow={true}
                        leftTextShow={false}
                        centerText={"更换银行卡"}
                        rightText={""}
                        leftImageCallBack={() => {
                            this.props.callBack()
                            this.backPage()
                        }}
                        centerTextStyle={{paddingLeft: 0, paddingRight: 0}}
                    />

                    <ScrollView>


                        <KeyboardAvoidingView keyboardVerticalOffset={5}>


                            <View style={{width: width, marginTop: 15,}}>

                                <TextInputItem
                                    title={'资金账号'}
                                    value={(this.props.account.bind_bank_card_type === 1&&this.props.account.account_open_type ===1)?this.props.account.bank_card_no:this.props.account.cz_elec_account}
                                    keyboardType={'numeric'}
                                    editable={false}
                                />
                                <TextInputItem
                                    title={'原银行卡'}
                                    value={this.props.account.bind_bank_card_no}
                                    editable={false}
                                />
                                <TextInputItem
                                    title={'账户余额'}
                                    value={this.props.account.balance}
                                    textPlaceholder={'请输入短信验证码'}
                                    keyboardType={'numeric'}
                                    editable={false}
                                    separator={false}
                                />

                            </View>
                            <View style={{width: width, marginTop: 15,}}>
                                <TextInputItem
                                    ref={'bank_card_no'}
                                    title={'新银行卡'}
                                    textPlaceholder={'请输入您的新银行卡卡号'}
                                    keyboardType={'numeric'}
                                    //value={'6223093310090136493'}
                                    onChangeText={this.bank}
                                    loading={this.state.loading_bank}
                                    annotation={this.state.bankName}
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        this.toNextPage({
                                            component: ChooseBankNameScene,
                                            name: 'ChooseBankNameScene',
                                            params: {
                                                callBack: this.bankComeBack,
                                                bank_card_no: this.state.bankName === '' ? '' : this.refs.bank_card_no.getInputTextValue()
                                            },
                                        })
                                    }}
                                >
                                    <TextInputItem
                                        ref={'bank_name'}
                                        titleStyle={{letterSpacing: 8}}
                                        inputTextStyle={{paddingLeft: 8}}
                                        title={'开户行'}
                                        textPlaceholder={'请输入开户行支行信息'}
                                        rightIcon={true}
                                        editable={false}
                                    />
                                </TouchableOpacity>
                                <TextInputItem
                                    ref='mobile_no'
                                    titleStyle={{letterSpacing: 8}}
                                    inputTextStyle={{paddingLeft: 8}}
                                    title={'手机号'}
                                    keyboardType={'numeric'}
                                    editable={false}
                                    rightButton={true}
                                    value={this.props.account.operate_mobile}
                                    callBackSms={this.smscode}
                                />
                                <TextInputItem
                                    ref='sms_code'
                                    titleStyle={{letterSpacing: 8}}
                                    inputTextStyle={{paddingLeft: 8}}
                                    title={'验证码'}
                                    keyboardType={'numeric'}
                                    textPlaceholder={'请输入短信验证码'}
                                    separator={false}
                                />
                            </View>
                        </KeyboardAvoidingView>
                    </ScrollView>
                    <MyButton buttonType={MyButton.TEXTBUTTON}
                              content={'更换银行卡'}
                              parentStyle={styles.buttonStyle}
                              childStyle={styles.buttonTextStyle}
                              mOnPress={this.change}/>
                    {this.out_of_service()}
                </View>
            </TouchableWithoutFeedback>

        );
    }

    // 更换银行卡
    change = () => {

        this.dismissKeyboard()
        if (!this.verify(true)) {
            return
        }

        this.props.showModal(true)

        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code === 1) {
                let result = JSON.parse(data.result)
                let device_code = '';

                if (Platform.OS === 'android') {
                    device_code = 'dycd_platform_android';
                } else {
                    device_code = 'dycd_platform_ios';
                }
                let params = {
                    device_code: device_code,
                    bank_no: bank_no,
                    enter_base_id: result.company_base_id,
                    new_acct_no: bank_card_no,
                    sms_code: sms_code,
                    sms_no: sms_no,
                    user_type: this.props.account.account_open_type,
                    sub_acct_no: this.props.account.bank_card_no,
                    bank_name: bank_name,
                    sub_bank_no: sub_bank_no,
                    sub_bank_name:sub_bank_name
                }


                request(AppUrls.ZS_MODIFY_BANK_CARD, 'POST', params).then((response) => {
                    this.props.showModal(false)
                    this.toNextPage({
                        component: ResultIndicativeScene,
                        name: 'ResultIndicativeScene',
                        params: {
                            params: params,
                            type: 4,
                            status: 1,
                            callBack: this.props.callBack
                        }
                    })

                }, (error) => {
                    this.props.showModal(false)

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
                                type: 4,
                                status: 0,
                                params: params,
                                error: error.mjson,
                                callBack: this.props.callBack
                            }
                        })

                    } else if (error.mycode === -300 || error.mycode === -500) {
                        this.props.showToast(error.mycode)
                    } else {
                        this.toNextPage({
                            component: ResultIndicativeScene,
                            name: 'ResultIndicativeScene',
                            params: {
                                type: 4,
                                status: 2,
                                account: params,
                                error: error.mjson,
                                callBack: this.props.callBack
                            }
                        })
                    }

                })

            }
        })

    }

    // 解析银行卡所在总行名称
    bank = (text) => {

        if (text.length < 10) {
            this.setState({
                bankName: ''
            })
            return;
        }

        if (text.length >= 10 && this.state.bankName === '') {

            let params = {
                bankCardNo: text,
                page: 1,
                rows: 20,
            }


            this.setState({
                loading_bank: true,
            })
            request(AppUrls.ZS_PARSE_BANK, 'POST', params).then((response) => {

                this.setState({
                    loading_bank: false,
                })

                if (response.mjson.data.info_list !== null && response.mjson.data.info_list.length > 0) {
                    this.setState({
                        bankName: response.mjson.data.info_list[0].subbankname,
                    })
                    sub_bank_no = response.mjson.data.info_list[0].subbankno
                    sub_bank_name =response.mjson.data.info_list[0].subbankname
                }


            }, (error) => {
                this.setState({
                    loading_bank: false,
                })
            })
        }


    }

//获取短信验证码
    smscode = () => {

        if (!this.verify(false)) {
            return
        }

        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code === 1) {

                let result = JSON.parse(data.result)
                let params = {
                    enter_base_id: result.company_base_id,
                    from_bank_id: bank_no,
                    mobile_no: mobile_no,
                    sub_acct_no: this.props.account.sub_acc_no,
                    type: 2  //2变更结算账号或客户信息，
                }

                request(AppUrls.ZS_SEND_SMS_CODE, 'POST', params).then((response) => {
                    this.refs.mobile_no.StartCountDown();
                    sms_no = response.mjson.data.sms_no;
                    //console.log(response);

                }, (error) => {
                    this.props.showModal(false)
                    if(error.mycode === 8050324){  // 不在服务时间内
                        this.setState({
                            out_of_service_msg:error.mjson.msg,
                            alert:true
                        })
                        return
                    }
                    this.props.showToast('验证码发送失败')
                })

            } else {
                this.props.showToast('获取信息失败')
            }
        })

    }


    verify = (with_sms_code) => {

        bank_card_no = this.refs.bank_card_no.getInputTextValue();
        bank_name = this.refs.bank_name.getInputTextValue();
        mobile_no = this.refs.mobile_no.getInputTextValue();
        sms_code = this.refs.sms_code.getInputTextValue();

        if (bank_card_no === '' || bank_card_no === null) {
            this.props.showToast('请输入新银行卡号');
            return false
        }
        if (bank_name === '' || bank_name === null) {
            this.props.showToast('请输入开户行名称');
            return false
        }

        if (with_sms_code) {
            if (sms_code === '' || sms_code === null) {
                this.props.showToast('请输入验证码');
                return false
            }
        }
        return true
    }


    bankComeBack = (bank, sub_bank) => {

        sub_bank_no = sub_bank.subbankno ? sub_bank.subbankno : sub_bank_no
        sub_bank_name = sub_bank.subbankname? sub_bank.subbankname: sub_bank_name
        bank_no = bank.bankno;
        this.refs.bank_name.setInputTextValue(bank.bankname)
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: FontAndColor.COLORA3,
    },
    buttonStyle: {
        height: Pixel.getPixel(44),
        width: width - Pixel.getPixel(30),
        backgroundColor: FontAndColor.COLORB0,
        marginVertical: Pixel.getPixel(30),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Pixel.getPixel(4),
    },
    buttonTextStyle: {
        color: FontAndColor.COLORA3,
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT)
    },
    itemStyel: {
        backgroundColor: "#ffffff",
        paddingLeft: Pixel.getPixel(15),
        paddingRight: Pixel.getPixel(15),
    },
});

