import React, {Component} from "react";
import {
    AppRegistry,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    InteractionManager,
    TouchableWithoutFeedback
} from "react-native";
import BaseComponent from "../component/BaseComponent";
import NavigationBar from "../component/NavigationBar";
import * as FontAndColor from "../constant/fontAndColor";
import PixelUtil from "../utils/PixelUtil";
import MyButton from "../component/MyButton";
import LoginInputText from "./component/LoginInputText";
import LoginFailPwd from "./LoginFailPwd";
import {request} from "../utils/RequestUtil";
import * as AppUrls from "../constant/appUrls";
import StorageUtil from "../utils/StorageUtil";
import * as StorageKeyNames from "../constant/storageKeyNames";

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Pixel = new PixelUtil();

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Platform = require('Platform');

var imgSrc: '';
var imgSid: '';
var smsCode: '';

export default class LoginFailSmsVerify extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            verifyCodeUrl: null,
            renderPlaceholderOnly: true,
        }
    }

    initFinish = () => {
        InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: false});
            this.Verifycode();
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
                        leftImageShow={false}
                        leftTextShow={true}
                        leftText={""}
                        centerText={"短信验证"}
                        rightText={""}
                    />
                </View>
            </TouchableWithoutFeedback>);
        }
        return (
            <View style={styles.container}>
                <NavigationBar
                    leftImageShow={true}
                    leftTextShow={false}
                    clearValue={true}
                    centerText={"短信验证"}
                    rightText={"  "}
                    leftImageCallBack={this.backPage}/>
                <View style={{width: width, height: Pixel.getPixel(15)} }/>
                <LoginInputText
                    ref="userName"
                    textPlaceholder={'请输入手机号码'}
                    rightIcon={false}
                    clearValue={true}
                    viewStytle={[styles.itemStyel, {borderBottomWidth: 0}]}
                    keyboardType={'phone-pad'}
                    maxLength={11}
                    leftIconUri={require('./../../images/login/phone.png')}/>
                <View style={{width: width, height: Pixel.getPixel(10)} }/>
                <LoginInputText
                    ref="verifycode"
                    textPlaceholder={'请输入验证码'}
                    viewStytle={styles.itemStyel}
                    keyboardType={'phone-pad'}
                    leftIconUri={require('./../../images/login/virty.png')}
                    rightIconSource={this.state.verifyCodeUrl ? this.state.verifyCodeUrl : null}
                    rightIconClick={this.Verifycode}
                    rightIconStyle={{width: Pixel.getPixel(100), height: Pixel.getPixel(32)}}/>

                <LoginInputText
                    ref="smscode"
                    textPlaceholder={'请输入短信验证码'}
                    keyboardType={'phone-pad'}
                    viewStytle={[styles.itemStyel, {borderBottomWidth: 0}]}
                    leftIconUri={require('./../../images/login/sms.png')}
                    rightIcon={false}
                    rightButton={true}
                    callBackSms={this.Smscode}/>
                <View style={{width: width, height: Pixel.getPixel(44)} }/>
                <MyButton buttonType={MyButton.TEXTBUTTON}
                          content={'提交'}
                          parentStyle={styles.buttonStyle}
                          childStyle={styles.buttonTextStyle}
                          mOnPress={this.login}/>
                {this.loadingView()}
            </View>
        );
    }

    Verifycode = () => {
        this.refs.verifycode.lodingStatus(true);
        let maps = {};
        request(AppUrls.IDENTIFYING, 'Post', maps)
            .then((response) => {
                this.refs.verifycode.lodingStatus(false);
                imgSrc = response.mjson.data.img_src;
                imgSid = response.mjson.data.img_sid;
                this.setState({
                    verifyCodeUrl: {uri: response.mjson.data.img_src},
                });
            }, (error) => {
                this.refs.verifycode.lodingStatus(false);
                this.setState({
                    verifyCode: null,
                });
                if (error.mycode == -300 || error.mycode == -500) {
                    this.props.showToast("获取失败");
                } else {
                    this.props.showToast(error.mjson.msg + "");
                }
            });
    }

    //获取短信验证码
    Smscode = () => {
        let userName = this.refs.userName.getInputTextValue();
        let verifyCode = this.refs.verifycode.getInputTextValue();
        if (typeof(userName) == "undefined" || userName == "" || userName.length != 11) {
            this.props.showToast("请输入正确的用户名");
        } else if (typeof(verifyCode) == "undefined" || verifyCode == "") {
            this.props.showToast("验证码不能为空");
        } else {
            let device_code = '';
            if (Platform.OS === 'android') {
                device_code = 'dycd_platform_android';
            } else {
                device_code = 'dycd_platform_ios';
            }
            let maps = {
                device_code: device_code,
                img_code: verifyCode,
                img_sid: imgSid,
                phone: userName,
                type: "2",
            };
            // this.props.showModal(true);
            this.setState({
                loading: true,
            });
            request(AppUrls.SEND_SMS, 'Post', maps)
                .then((response) => {
                    // this.props.showModal(false);
                    this.setState({
                        loading: false,
                    });
                    if (response.mjson.code == "1") {
                        this.refs.smscode.StartCountDown();
                        // this.refs.smscode.setInputTextValue(response.mjson.data.code + "");
                    } else {
                        this.props.showToast(response.mjson.msg + "");
                    }
                }, (error) => {
                    // this.props.showModal(false);
                    this.setState({
                        loading: false,
                    });
                    if (error.mycode == -300 || error.mycode == -500) {
                        this.props.showToast("短信验证码获取失败");
                    } else if (error.mycode == 7040012) {
                        this.Verifycode();
                        this.props.showToast(error.mjson.msg + "");
                    } else {
                        this.props.showToast(error.mjson.msg + "");
                    }
                });
        }
    }


    rightTextCallBack = () => {
        this.toNextPage({
            name: 'LoginFailPwd',
            component: LoginFailPwd,
            params: {},
        })
    }

    // 登录
    login = () => {
        let userName = this.refs.userName.getInputTextValue();
        let verifyCode = this.refs.verifycode.getInputTextValue();
        let smsCode = this.refs.smscode.getInputTextValue();
        if (typeof(userName) == "undefined" || userName == "") {
            this.props.showToast("用户名不能为空");
        } else if (userName.length != 11) {
            this.props.showToast("请输入正确的用户名");
        } else if (typeof(verifyCode) == "undefined" || verifyCode == "") {
            this.props.showToast("验证码不能为空");
        } else if (typeof(smsCode) == "undefined" || smsCode == "") {
            this.props.showToast("短信验证码不能为空");
        } else {
            let device_code = '';
            if (Platform.OS === 'android') {
                device_code = 'dycd_platform_android';
            } else {
                device_code = 'dycd_platform_ios';
            }
            let maps = {
                device_code: device_code,
                code: smsCode,
                login_type: "1",
                phone: userName,
                pwd: "",
            };
            // this.props.showModal(true);
            this.setState({
                loading: true,
            });
            request(AppUrls.LOGIN, 'Post', maps)
                .then((response) => {
                    // this.props.showModal(false);
                    this.setState({
                        loading: false,
                    });
                    if (response.mycode == "1") {

                        global.userName = userName;
                        if (response.mjson.data.user_level == 2) {
                            if (response.mjson.data.enterprise_list == [] || response.mjson.data.enterprise_list == "") {
                                this.props.showToast("无授信企业");
                            } else {
                                // 保存用户登录状态
                                StorageUtil.mSetItem(StorageKeyNames.LOGIN_TYPE, '1');
                                StorageUtil.mSetItem(StorageKeyNames.USER_INFO, JSON.stringify(response.mjson.data));
                                // 保存用户信息
                                StorageUtil.mSetItem(StorageKeyNames.BASE_USER_ID, response.mjson.data.base_user_id + "");
                                StorageUtil.mSetItem(StorageKeyNames.ENTERPRISE_LIST, JSON.stringify(response.mjson.data.enterprise_list));
                                StorageUtil.mSetItem(StorageKeyNames.HEAD_PORTRAIT_URL, response.mjson.data.head_portrait_url + "");
                                StorageUtil.mSetItem(StorageKeyNames.IDCARD_NUMBER, response.mjson.data.idcard_number + "");
                                StorageUtil.mSetItem(StorageKeyNames.PHONE, response.mjson.data.phone + "");
                                StorageUtil.mSetItem(StorageKeyNames.REAL_NAME, response.mjson.data.real_name + "");
                                StorageUtil.mSetItem(StorageKeyNames.TOKEN, response.mjson.data.token + "");
                                StorageUtil.mSetItem(StorageKeyNames.USER_LEVEL, response.mjson.data.user_level + "");
                                this.setLoginPwd.params.userName = userName;
                                this.loginPage(this.setLoginPwd);
                            }
                        } else {
                            // 保存用户登录状态
                            StorageUtil.mSetItem(StorageKeyNames.LOGIN_TYPE, '1');
                            StorageUtil.mSetItem(StorageKeyNames.USER_INFO, JSON.stringify(response.mjson.data));
                            // 保存用户信息
                            StorageUtil.mSetItem(StorageKeyNames.BASE_USER_ID, response.mjson.data.base_user_id + "");
                            StorageUtil.mSetItem(StorageKeyNames.ENTERPRISE_LIST, JSON.stringify(response.mjson.data.enterprise_list));
                            StorageUtil.mSetItem(StorageKeyNames.HEAD_PORTRAIT_URL, response.mjson.data.head_portrait_url + "");
                            StorageUtil.mSetItem(StorageKeyNames.IDCARD_NUMBER, response.mjson.data.idcard_number + "");
                            StorageUtil.mSetItem(StorageKeyNames.PHONE, response.mjson.data.phone + "");
                            StorageUtil.mSetItem(StorageKeyNames.REAL_NAME, response.mjson.data.real_name + "");
                            StorageUtil.mSetItem(StorageKeyNames.TOKEN, response.mjson.data.token + "");
                            StorageUtil.mSetItem(StorageKeyNames.USER_LEVEL, response.mjson.data.user_level + "");
                            this.setLoginPwd.params.userName = userName;
                            this.loginPage(this.setLoginPwd);
                        }
                    } else {
                        this.props.showToast(response.mjson.msg);
                    }
                }, (error) => {
                    // this.props.showModal(false);
                    this.setState({
                        loading: false,
                    });
                    if (error.mycode == -300 || error.mycode == -500) {
                        this.props.showToast("登录失败");
                    } else if (error.mycode == 7040004) {
                        this.Verifycode();
                        this.props.showToast(error.mjson.msg + "");
                    } else {
                        this.props.showToast(error.mjson.msg + "");
                    }
                });
        }
    }

    setLoginPwd = {
        name: 'LoginFailPwd',
        component: LoginFailPwd,
        params: {
            from: 'login',
            userName: '',
        }
    }

    loginPage = (mProps) => {
        const navigator = this.props.navigator;
        if (navigator) {
            navigator.immediatelyResetRouteStack([{
                ...mProps
            }])
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
        marginBottom: Pixel.getPixel(30),
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