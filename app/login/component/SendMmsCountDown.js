import React, {Component, PropTypes} from "react";
import {AppRegistry, StyleSheet, Text, View, TextInput, Image, PixelRatio} from "react-native";
import MyButton from "../../component/MyButton";
import * as FontAndColor from "../../constant/fontAndColor";
import PixelUtil from "../../utils/PixelUtil";
var Pixel = new PixelUtil();

const TIME = 60;
export default class sendMmsCountDown extends Component {
    constructor(props) {
        super(props);
        //初始化方法
        this.state = {
            countDown: false,
            value: '获取验证码'
        }
        this.countTime = TIME;
        this.timer = null;
        this.oldTime = 0;
        this.newTime = 10000;
    }

    static propTypes = {
        // leftIconShow: PropTypes.bool,
        // inputPlaceholder: PropTypes.string,
        // inputTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        parentStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        childStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        pressParentStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        pressChildStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),


        callBackSms: PropTypes.func,//发送短语验证码
    }

    initFinish = () => {
    }

    render() {
        return (
            <View>
                <MyButton buttonType={MyButton.TEXTBUTTON} content={this.state.value}
                          parentStyle={this.state.countDown ? [styles.pressButtonStyle, this.props.pressParentStyle]: [styles.buttonStyle,this.props.parentStyle]}
                          childStyle={this.state.countDown ? [styles.pressTextStyle,this.props.pressChildStyle] : [styles.textStyle,this.props.childStyle]}
                          mOnPress={this.onSendPress}/>
            </View>
        );
    }

    onSendPress = () => {
        //屏蔽用户连续点击
        this.newTime = (new Date()).valueOf();
        if ((this.newTime - this.oldTime) > 2000) {
            this.oldTime = this.newTime;
            if (this.countTime === TIME) {
                this.props.callBackSms();
            }
        }
    }

    //开始计算操作
    StartCountDown = () => {
        if (!this.state.countDown && this.timer === null) {
            this.timer = setInterval(() => {
                if (this.countTime <= 0) {
                    this.setState({
                        countDown: false,
                        value: '获取验证码',
                    });
                    this.endCountDown();
                } else {
                    this.setState({
                        countDown: true,
                        value: --this.countTime + 'S后重发',
                    });
                }
            }, 1000)
        }
    }

    //结束计算操作
    endCountDown = () => {
        if (this.timer !== null) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.countTime = TIME;
    }

    componentWillUnmount() {
        if (this.timer !== null) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}

const styles = StyleSheet.create({
    container: {
        width: Pixel.getPixel(50),
        height: Pixel.getPixel(20),
    },
    buttonStyle: {
        borderWidth: 1,
        width: Pixel.getPixel(100),
        height: Pixel.getPixel(32),
        alignItems: 'center',
        justifyContent: 'center',

        borderColor: FontAndColor.COLORB0,
    },
    textStyle: {
        color: FontAndColor.COLORB0,
        fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT),
    },
    pressButtonStyle: {
        borderWidth: 1,
        width: Pixel.getPixel(100),
        height: Pixel.getPixel(32),
        alignItems: 'center',
        justifyContent: 'center',

        borderColor: FontAndColor.COLORA1,
    },
    pressTextStyle: {
        color: FontAndColor.COLORA1,
        fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT),
    },
});