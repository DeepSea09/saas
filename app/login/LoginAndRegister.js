import React, {Component} from "react";
import {
    AppRegistry,
    View,
    Text,
    StyleSheet,
    Image,
    InteractionManager,
    TouchableWithoutFeedback,
    BackAndroid,
    NativeModules
} from "react-native";
import BaseComponent from "../component/BaseComponent";
import MyButton from "../component/MyButton";
import * as FontAndColor from "../constant/fontAndColor";
import LoginScene from "./LoginScene";
import Register from "./Register";
import PixelUtil from "../utils/PixelUtil";
import QuotaApplication from './QuotaApplication';

var Pixel = new PixelUtil();
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

export default class LoginAndRegister extends BaseComponent {

    constructor(props) {
        super(props);
        //初始化方法
        this.state = {
            renderPlaceholderOnly: true,
        }
    }
    /**
     * from @zhaojian
     *
     * 返回到手机桌面
     **/
    handleBack = () => {
        NativeModules.VinScan.goBack();
        return true;
    }

    componentDidMount() {
        try {
            BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
        } catch (e) {

        } finally {
            this.initFinish();
        }
    }

    initFinish = () => {
        //InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: false});
            // this.Verifycode();
        //});
    }

    render() {
        if (this.state.renderPlaceholderOnly) {
            return ( <TouchableWithoutFeedback onPress={() => {
                this.setState({
                    show: false,
                });
            }}>
                <View/>
            </TouchableWithoutFeedback>);
        }
        return (
            <Image source={require('./../../images/login/loginAndRegist.png')} style={styles.iconStyle}>
                <MyButton buttonType={MyButton.TEXTBUTTON} content="登录"
                          parentStyle={[styles.buttonStyle, {marginTop: height / 3 * 2}]}
                          childStyle={styles.buttonTextStyle} mOnPress={() => {
                    this.toNextPage({
                        name: 'LoginScene',
                        component: LoginScene,
                        params: {},
                    })
                }}/>
                <MyButton buttonType={MyButton.TEXTBUTTON} content="注册" parentStyle={styles.buttonStyle}
                          childStyle={styles.buttonTextStyle} mOnPress={() => {
                    this.toNextPage({
                        name: 'Register',
                        component: Register,
                        params: {},
                    })
                }}/>
            </Image>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    fontStyle: {
        color: '#cc092f',
        alignSelf: 'center',
        fontSize: Pixel.getFontPixel(30),
        marginTop: Pixel.getPixel(50),
    },
    iconStyle: {
        flex: 1,
        height: height,
        width: width,
        resizeMode: 'cover',
        alignItems: 'center',
    },
    buttonStyle: {
        borderColor: FontAndColor.COLORA3,
        borderWidth: 1,
        width: width - Pixel.getPixel(80),
        height: Pixel.getPixel(44),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Pixel.getPixel(12),
        marginBottom: Pixel.getPixel(12),
    },
    buttonTextStyle: {
        fontSize: Pixel.getFontPixel(18),
        color: FontAndColor.COLORA3,
    }
});