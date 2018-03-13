import React, {Component} from "react";
import {
    AppRegistry,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    InteractionManager,
    TouchableWithoutFeedback
} from "react-native";
import BaseComponent from "../component/BaseComponent";
import NavigationBar from "../component/NavigationBar";
import * as FontAndColor from "../constant/fontAndColor";
import PixelUtil from "../utils/PixelUtil";
import MyButton from "../component/MyButton";
import LoginInputText from "./component/LoginInputText";
import {request} from "../utils/RequestUtil";
import * as AppUrls from "../constant/appUrls";
import md5 from "react-native-md5";
import StorageUtil from "../utils/StorageUtil";
import SetLoginPwdGesture from "./SetLoginPwdGesture";
import MainPage from "../main/MainPage";
import * as StorageKeyNames from "../constant/storageKeyNames";
import LoginGesture from './LoginGesture';
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Pixel = new PixelUtil();
var Platform = require('Platform');
export default class LoginFailPwd extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            renderPlaceholderOnly: true,
        }
    }

    initFinish = () => {
        InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: false});
            // this.Verifycode();
            this.refs.phone.setInputTextValue(this.props.userName);
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
                        centerText={"设置登录密码"}
                        rightText={""}
                    />
                </View>
            </TouchableWithoutFeedback>);
        }
        return (
            <View style={styles.container}>
                <NavigationBar
                    leftImageShow={false}
                    leftTextShow={true}
                    centerText={"设置登录密码"}
                    rightText={""}
                    leftText={""}
                    leftImageCallBack={this.backPage}
                />
                <View style={{width: width, height: Pixel.getPixel(15)} }/>
                <LoginInputText
                    ref="phone"
                    textPlaceholder={'请输入手机号码'}
                    rightIcon={false}
                    clearValue={false}
                    maxLength={11}
                    editable={false}
                    viewStytle={[styles.itemStyel, {borderBottomWidth: 0}]}
                    keyboardType={'phone-pad'}
                    leftIconUri={require('./../../images/login/phone.png')}/>
                <View style={{width: width, height: Pixel.getPixel(10)} }/>
                <LoginInputText
                    ref="password"
                    textPlaceholder={'请设置登录密码'}
                    rightIcon={false}
                    leftIcon={true}
                    clearValue={true}
                    maxLength={16}
                    secureTextEntry={true}
                    leftIconUri={require('./../../images/login/password.png')}
                    viewStytle={styles.itemStyel}/>
                <LoginInputText
                    ref="passwordAgain"
                    textPlaceholder={'请再次输入密码'}
                    rightIcon={false}
                    leftIcon={true}
                    clearValue={true}
                    maxLength={16}
                    secureTextEntry={true}
                    leftIconUri={require('./../../images/login/password.png')}
                    viewStytle={[styles.itemStyel, {borderBottomWidth: 0}]}/>
                <View style={{width: width, height: Pixel.getPixel(44)} }/>
                <MyButton buttonType={MyButton.TEXTBUTTON}
                          content={'确认'}
                          parentStyle={styles.buttonStyle}
                          childStyle={styles.buttonTextStyle}
                          mOnPress={this.setPwd}/>
                {this.loadingView()}
            </View>
        );
    }

    //修改密码
    setPwd = () => {
        let phone = this.refs.phone.getInputTextValue();
        let newPassword = this.refs.password.getInputTextValue();
        let newPasswordAgain = this.refs.passwordAgain.getInputTextValue();
        if (typeof(phone) == "undefined" || phone == "") {
            this.props.showToast("手机号不能为空");
        } else if (phone.length != 11) {
            this.props.showToast("请输入正确的手机号");
        } else if (typeof(newPassword) == "undefined" || newPassword == "") {
            this.props.showToast("新密码不能为空");
        } else if (newPassword.length < 6) {
            this.props.showToast("密码必须为6~16位");
        } else if (typeof(newPasswordAgain) == "undefined" || newPasswordAgain == "") {
            this.props.showToast("再次确认密码不能为空");
        } else if (newPassword !== newPasswordAgain) {
            this.props.showToast("两次密码输入不一致");
        } else {
            let device_code = '';

            if (Platform.OS === 'android') {
                device_code = 'dycd_platform_android';
            } else {
                device_code = 'dycd_platform_ios';
            }
            let maps = {
                device_code: device_code,
                confirm_pwd: md5.hex_md5(newPasswordAgain),
                pwd: md5.hex_md5(newPassword),
            };
            // this.props.showModal(true);
            this.setState({
                loading: true,
            });
            request(AppUrls.SETPWD, 'Post', maps)
                .then((response) => {
                    // this.props.showModal(false);
                    this.setState({
                        loading: false,
                    });
                    if (response.mycode == "1") {
                        StorageUtil.mGetItem(response.mjson.data.phone + "", (data) => {
                            if (data.code == 1) {
                                if (data.result != null) {
                                    StorageUtil.mSetItem(StorageKeyNames.ISLOGIN, 'true');
                                    this.loginPage(this.loginSuccess)
                                } else {
                                    StorageUtil.mSetItem(StorageKeyNames.ISLOGIN, 'true');
                                    this.loginPage(this.setLoginGesture)
                                }
                            }
                        })
                    } else {
                        this.props.showToast(response.mjson.msg + "");
                    }
                }, (error) => {
                    // this.props.showModal(false);
                    this.setState({
                        loading: false,
                    });
                    if (error.mycode == -300 || error.mycode == -500) {
                        this.props.showToast("设置失败");
                    } else {
                        this.props.showToast(error.mjson.msg + "");
                    }
                });
        }
    }

    setLoginGesture = {
        name: 'SetLoginPwdGesture',
        component: SetLoginPwdGesture,
        params: {
            from: 'login'
        }
    }

    loginSuccess = {
        name: 'LoginGesture',
        component: LoginGesture,
        params: {}
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