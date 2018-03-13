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
import md5 from "react-native-md5";
import StorageUtil from "../../../../utils/StorageUtil";
import * as StorageKeyNames from "../../../../constant/storageKeyNames";
import TextInputItem from '../component/TextInputItem'
import ResultIndicativeScene from '../ResultIndicativeScene'
import ZSBaseComponent from  '../component/ZSBaseComponent'

let Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');
let Pixel = new PixelUtil();
let Platform = require('Platform');

let new_mobile;
let new_sms_code;
let new_sms_no;


export default class NameAndIdScene extends ZSBaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            renderPlaceholderOnly: true,
        }
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
                        leftImageCallBack={this.backPage}
                        centerTextStyle={{paddingLeft: 0, paddingRight: 0}}
                    />
                    <View style={{width: width, marginTop: 15,}}>

                        <TextInputItem
                            ref = {'new_mobile'}
                            title={'新手机号'}
                            textPlaceholder={'请输入您的手机号'}
                            keyboardType={'numeric'}
                            rightButton={true}
                            maxLength={11}
                            callBackSms={this.smscode}
                        />
                        <TextInputItem
                            ref={'new_sms_code'}
                            titleStyle={{letterSpacing: 8}}
                            inputTextStyle={{paddingLeft: 8}}
                            title={'验证码'}
                            textPlaceholder={'请输入短信验证码'}
                            separator={false}
                            keyboardType={'numeric'}
                        />
                    </View>
                    <MyButton buttonType={MyButton.TEXTBUTTON}
                              content={'确认'}
                              parentStyle={styles.buttonStyle}
                              childStyle={styles.buttonTextStyle}
                              mOnPress={this.next}/>
                    {this.out_of_service()}
                </View>

            </TouchableWithoutFeedback>


        );
    }

    smscode = () => {
        if (!this.verify(false)) {
            return
        }

        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code === 1) {

                let result = JSON.parse(data.result)
                let params = {
                    enter_base_id: result.company_base_id,
                    mobile_no: new_mobile,
                    sub_acct_no: this.props.account.bank_card_no,
                    type: 2
                }

                request(AppUrls.ZS_SEND_SMS_CODE, 'POST', params).then((response) => {
                    this.refs.new_mobile.StartCountDown();
                    new_sms_no=response.mjson.data.sms_no
                    console.log(response);

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

    next = () => {

        this.dismissKeyboard()
        if (!this.verify(true)) {
            return
        }

        this.props.showModal(true)

        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code === 1) {

                let result = JSON.parse(data.result)
                let params = {
                    user_type: this.props.account.account_open_type,
                    new_mobile_no: new_mobile,
                    new_sms_code: new_sms_code,
                    new_sms_no:new_sms_no,
                    old_sms_code:this.props.old_sms_code,
                    old_sms_no:this.props.old_sms_no,
                    sub_acct_no: this.props.account.bank_card_no,
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
                            callBack:this.props.callBack
                        }
                    })

                }, (error) => {
                    this.props.showModal(false)

                    if(error.mycode===8010007){  // 存疑

                        this.toNextPage({
                            component:ResultIndicativeScene,
                            name:'ResultIndicativeScene',
                            params:{
                                type:5,
                                status:0,
                                account:params,
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

    verify = (with_sms_code) => {

        new_mobile = this.refs.new_mobile.getInputTextValue();
        new_sms_code = this.refs.new_sms_code.getInputTextValue();

        if (new_mobile === '' || new_mobile === null) {
            this.props.showToast('请输入手机号码');
            return false
        }
        if (new_mobile.length !== 11) {
            this.props.showToast('手机号格式有误');
            return false
        }

        if (with_sms_code) {
            if (new_sms_code === '' || new_sms_code === null) {
                this.props.showToast('请输入验证码');
                return false
            }
        }

        return true
    }


    backN = (n) => {
        const navigator = this.props.navigator;
        if (navigator) {
            navigator.popN(n);
        }
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

