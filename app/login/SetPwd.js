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
import {request} from "../utils/RequestUtil";
import * as AppUrls from "../constant/appUrls";
import md5 from "react-native-md5";

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Pixel = new PixelUtil();
var Platform = require('Platform');

export default class SetPwd extends BaseComponent {
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
                        centerText={"修改登录密码"}
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
                    centerText={"修改登录密码"}
                    rightText={"  "}
                    clearValue={true}
                    leftImageCallBack={this.backPage}/>
                <View style={{width: width, height: Pixel.getPixel(15)} }/>
                <LoginInputText
                    ref="oldPassword"
                    rightIcon={false}
                    leftIcon={false}
                    clearValue={true}
                    textPlaceholder={"请输入原登录密码"}
                    secureTextEntry={true}
                    viewStytle={[styles.itemStyel, {borderBottomWidth: 0}]}/>
                <View style={{width: width, height: Pixel.getPixel(10)} }/>
                <LoginInputText
                    ref="newPassword"
                    rightIcon={false}
                    leftIcon={false}
                    clearValue={true}
                    textPlaceholder={"请设置新密码"}
                    secureTextEntry={true}
                    maxLength={16}
                    viewStytle={[styles.itemStyel, {borderBottomWidth: 0}]}/>
                <View style={{width: width, height: Pixel.getPixel(10)} }/>
                <LoginInputText
                    ref="newPasswordAgain"
                    rightIcon={false}
                    leftIcon={false}
                    clearValue={true}
                    textPlaceholder={"请再次填写新密码"}
                    secureTextEntry={true}
                    maxLength={16}
                    viewStytle={[styles.itemStyel, {borderBottomWidth: 0}]}/>
                <View style={{width: width, height: Pixel.getPixel(44)} }/>
                <MyButton buttonType={MyButton.TEXTBUTTON}
                          content={'确定'}
                          parentStyle={styles.buttonStyle}
                          childStyle={styles.buttonTextStyle}
                          mOnPress={this.setPwd}/>
                {this.loadingView()}
            </View>
        );
    }

    //修改密码
    setPwd = () => {
        let oldPassword = this.refs.oldPassword.getInputTextValue();
        let newPassword = this.refs.newPassword.getInputTextValue();
        let newPasswordAgain = this.refs.newPasswordAgain.getInputTextValue();
        if (typeof(oldPassword) == "undefined" || oldPassword == "") {
            this.props.showToast("原密码不能为空");
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
                old_pwd: md5.hex_md5(oldPassword),
                confirm_pwd: md5.hex_md5(newPasswordAgain),
                pwd: md5.hex_md5(newPassword),
            };
            // this.props.showModal(true);
            this.setState({
                loading: true,
            });
            request(AppUrls.CHANGEPWD, 'Post', maps)
                .then((response) => {
                    // this.props.showModal(false);
                    this.setState({
                        loading: false,
                    });
                    if (response.mycode == "1") {
                        this.props.showToast("设置成功");
                        this.backPage();
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
    },
});