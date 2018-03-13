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
    TouchableWithoutFeedback
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
import NewNumber from './NewNumber'
import ResultIndicativeScene from '../ResultIndicativeScene'
import ZSBaseComponent from  '../component/ZSBaseComponent'

let Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');
let Pixel = new PixelUtil();
let Platform = require('Platform');

let dose_need_old_number_sms_code = false; //是否需要向旧的手机号发送短信验证码  他行对公客户必须输入验证码，其他的不需要

let mobile_no = ''
let sms_code = ''
let sms_no = ''

export default class InformationFillScene extends ZSBaseComponent {

    constructor(props) {
        super(props);


        console.log(props)

        if (this.props.account.account_open_type === 1 && this.props.account.bind_bank_card_type === 0) {
            dose_need_old_number_sms_code = true;

        }
        this.state = {
            renderPlaceholderOnly: true,
        }
    }

    componentWillUnmount() {
        dose_need_old_number_sms_code = false
    }
    initFinish = () => {
        InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: false});
        });
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
                        leftImageShow={true}
                        leftTextShow={false}
                        centerText={"修改银行预留手机号"}
                        rightText={""}
                        leftImageCallBack={this.backPage}
                        centerTextStyle={{paddingLeft: 0, paddingRight: 0}}
                    />
                </View>
            </TouchableWithoutFeedback>);
        }
        return (
            <TouchableWithoutFeedback
                onPress={()=>{
                    this.dismissKeyboard()
                }}
            >
                <View style={styles.container}>
                    <NavigationBar
                        leftImageShow={true}
                        leftTextShow={false}
                        centerText={"修改银行预留手机号"}
                        rightText={""}
                        leftImageCallBack={()=>{
                            this.props.callBack()
                            this.backPage()
                        }}
                        centerTextStyle={{paddingLeft: 0, paddingRight: 0}}
                    />
                    <View style={{width: width, marginTop: 15,}}>

                        <TextInputItem
                            title={'资金账号'}
                            value={(this.props.account.bind_bank_card_type === 1&&this.props.account.account_open_type ===1)?this.props.account.bank_card_no:this.props.account.cz_elec_account}
                            keyboardType={'numeric'}
                            editable={false}
                        />
                        <TextInputItem
                            title={this.props.account.account_open_type === 1 ? '企业名称' : '真实姓名'}
                            value={this.props.account.bank_card_name}
                            editable={false}
                        />
                        <TextInputItem
                            title={this.props.account.account_open_type === 1 ? '企业组织机构代码' : '证件号码'}
                            value={this.props.account.cert_no}
                            textPlaceholder={'请输入短信验证码'}
                            keyboardType={'numeric'}
                            editable={false}
                            separator={false}
                        />

                    </View>


                    <View style={{width: width, marginTop: 15,}}>
                        <TextInputItem
                            ref={'mobile'}
                            title={dose_need_old_number_sms_code ? '旧手机号' : '新手机号'}
                            textPlaceholder={'请输入您的手机号'}
                            keyboardType={'numeric'}
                            rightButton={true}
                            maxLength={11}
                            editable={dose_need_old_number_sms_code ? false : true}
                            value={dose_need_old_number_sms_code ? this.props.account.operate_mobile : ''}
                            callBackSms={this.smscode}
                        />
                        <TextInputItem
                            ref={'sms_code'}
                            titleStyle={{letterSpacing: 8}}
                            inputTextStyle={{paddingLeft: 8}}
                            title={'验证码'}
                            textPlaceholder={'请输入短信验证码'}
                            separator={false}
                            keyboardType={'numeric'}
                            //value={'332036'}
                        />
                    </View>


                    <MyButton buttonType={MyButton.TEXTBUTTON}
                              content={'下一步'}
                              parentStyle={styles.buttonStyle}
                              childStyle={styles.buttonTextStyle}
                              mOnPress={this.next}/>
                    {this.out_of_service()}
                </View>
            </TouchableWithoutFeedback>

        )
    }


    smscode = () => {
        if(!this.verify(false)) { return};

        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code === 1) {

                let result = JSON.parse(data.result)
                let params = {
                    enter_base_id: result.company_base_id,
                    mobile_no: mobile_no,
                    sub_acct_no: this.props.account.bank_card_no,
                    type: 2
                }

                request(AppUrls.ZS_SEND_SMS_CODE, 'POST', params).then((response) => {
                    this.refs.mobile.StartCountDown();
                    console.log(response);
                    sms_no = response.mjson.data.sms_no
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

    next = ()=>{
        this.dismissKeyboard()
        if(dose_need_old_number_sms_code){

            if(!this.verify(true)) {return}

            this.toNextPage({
                component:NewNumber,
                name:'NewNumber',
                params:{
                    account:this.props.account,
                    old_sms_code:sms_code,
                    old_sms_no:sms_no
                }
            })
        } else {
            if(!this.verify(true)) { return};

            this.props.showModal(true)

            StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
                if (data.code === 1) {

                    let result = JSON.parse(data.result)
                    let params = {
                        user_type:this.props.account.account_open_type,
                        new_mobile_no:mobile_no,
                        new_sms_code:sms_code,
                        new_sms_no:sms_no,
                        sub_acct_no:this.props.account.bank_card_no,
                        enter_base_id: result.company_base_id,
                    }


                    request(AppUrls.ZS_BANK_MODIFY_MOBILE, 'POST', params).then((response) => {
                        this.props.showModal(false)

                        this.toNextPage({
                            component:ResultIndicativeScene,
                            name:'ResultIndicativeScene',
                            params:{
                                type:5,
                                status:1,
                                params:params,
                                dose_need_old_number_sms_code:dose_need_old_number_sms_code,
                                callBack:this.props.callBack
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

                        if(error.mycode===8010007){  // 存疑

                            this.toNextPage({
                                component:ResultIndicativeScene,
                                name:'ResultIndicativeScene',
                                params:{
                                    type:5,
                                    status:0,
                                    params:params,
                                    dose_need_old_number_sms_code:dose_need_old_number_sms_code,
                                    error:error.mjson,
                                    callBack:this.props.callBack
                                }
                            })
                        }else if(error.mycode === -300 || error.mycode === -500){
                            this.props.showToast(error.mjson.msg)
                        }else {
                            this.toNextPage({
                                component: ResultIndicativeScene,
                                name: 'ResultIndicativeScene',
                                params: {
                                    type: 5,
                                    status: 2,
                                    account: params,
                                    error:error.mjson,
                                    dose_need_old_number_sms_code:dose_need_old_number_sms_code,
                                    callBack:this.props.callBack
                                }
                            })
                        }
                    })

                } else {
                    this.props.showToast('获取信息失败')
                }
            })
        }
    }

    verify = (with_sms_code) => {

        mobile_no = this.refs.mobile.getInputTextValue();
        sms_code = this.refs.sms_code.getInputTextValue();

        if (mobile_no === '' || mobile_no === null) {
            this.props.showToast('请输入手机号码');
            return false
        }
        if (mobile_no.length !== 11) {
            this.props.showToast('手机号格式有误');
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

