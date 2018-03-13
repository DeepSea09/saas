/**
 * Created by hanmeng on 2017/5/15.
 */
import React, {Component, PropTypes} from "react";
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
} from "react-native";
import * as fontAndColor from "../../../constant/fontAndColor";
import PixelUtil from "../../../utils/PixelUtil";
var Pixel = new PixelUtil();

//const TIME = 60;
export default class GetCarCountDown extends Component {

    constructor(props) {
        super(props);
        //初始化方法
        let leftTime = this.props.leftTime;
        this.state = {
            countDown: false,
            //value: '获取验证码',
            day: this.formatLongToTimeStr(leftTime).day,
            hour: this.formatLongToTimeStr(leftTime).hour,
            minute: this.formatLongToTimeStr(leftTime).minute
        };
        //this.countTime = TIME;
        this.timer = null;
        this.value1 = this.state.day;
        this.value2 = this.state.hour;
        this.value3 = this.state.minute;
    }

    formatLongToTimeStr = (timeStamp) => {
        let left = 86400000 * 30 - timeStamp;
        if (left <= 0) {
            return {day: 0, hour: 0, minute: 0};
        }
        let day = 0;
        let hour = 0;
        let minute = 0;
        let second = 0;
        second = left / 1000;
        if (second > 60) {
            minute = second / 60;
            second = second % 60;
        }
        if (minute > 60) {
            hour = minute / 60;
            minute = minute % 60;
        }
        if (hour > 24) {
            day = hour / 24;
            hour = hour % 24;
        }
        return {day: parseInt(day), hour: parseInt(hour), minute: parseInt(minute)};
    };

    initFinish = () => {
    }

    componentDidMount() {
        if (86400000 * 30 - this.props.leftTime > 0) {
            this.StartCountDown();
        }
    }

    render() {
        return (
            <Text allowFontScaling={false}  style={styles.textStyle}>{this.state.day}天{this.state.hour}时{this.state.minute}分</Text>
        );
    }

    //开始计算操作
    StartCountDown = () => {
        if (!this.state.countDown && this.timer === null) {
            /*            this.timer = setInterval(() => {
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
             }, 1000)*/
            this.timer = setInterval(() => {
                if (this.value3 === 0) {
                    if (this.value2 === 0) {
                        if (this.value1 <= 0) {
                            this.endCountDown();
                            return;
                        }
                        this.value1 = --this.value1;
                        this.value2 = 59;
                        this.value3 = 59;
                        this.setState({
                            minute: this.value3,
                            hour: this.value2,
                            day: this.value1,
                        });
                    } else {
                        this.value2 = --this.value2;
                        this.value3 = 59;
                        this.setState({
                            minute: this.value3,
                            hour: this.value2
                        });
                    }
                } else {
                    this.value3 = --this.value3;
                    this.setState({
                        minute: this.value3
                    });
                }
            }, 60000)
        }
    }

    //结束计算操作
    endCountDown = () => {
        if (this.timer !== null) {
            clearInterval(this.timer);
            this.timer = null;
        }
        //this.countTime = TIME;
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
        flexDirection: 'row'
    },
    textStyle: {
        fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
        color: fontAndColor.COLORB2
    }
});