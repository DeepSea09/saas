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
export default class DepositCountDown extends Component {

    constructor(props) {
        super(props);
        //初始化方法
        let leftTime = this.props.leftTime;
        /*        this.state = {
         countDown: false,
         hour: 23 - this.formatLongToTimeStr(leftTime).hour > 0 ? 23 - this.formatLongToTimeStr(leftTime).hour : 0,
         minute: 59 - this.formatLongToTimeStr(leftTime).minute > 0 &&
         23 - this.formatLongToTimeStr(leftTime).hour >= 0 ? 59 - this.formatLongToTimeStr(leftTime).minute : 0
         };*/
        this.state = {
            countDown: false,
            hour: this.formatLongToTimeStr(leftTime).hour,
            minute: this.formatLongToTimeStr(leftTime).minute
        };
        this.timer = null;
        this.value1 = this.state.hour;
        this.value2 = this.state.minute;
    }

    /*    static propTypes = {
     // leftIconShow: PropTypes.bool,
     // inputPlaceholder: PropTypes.string,
     // inputTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),

     callBackSms: PropTypes.func,//发送短语验证码
     }*/

    formatLongToTimeStr = (timeStamp) => {
        let left = 86400000 - timeStamp;
        if (left <= 0) {
            return {hour: 0, minute: 0};
        }
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
        //console.log('间隔时间:::', parseInt(hour) + ":" + parseInt(minute)  + ":"  + parseInt(second));
        return {hour: parseInt(hour), minute: parseInt(minute)};
    };

    componentDidMount() {
        if (86400000 - this.props.leftTime > 0) {
            this.StartCountDown();
        }
    }

    render() {
        return (
            <Text allowFontScaling={false}  style={styles.textStyle}>{this.state.hour}时{this.state.minute}分</Text>
        );
    }

    //开始计算操作
    StartCountDown = () => {
        if (this.value1 <= 0 && this.value2 <= 0) {
            return;
        }
        if (!this.state.countDown && this.timer === null) {
            this.timer = setInterval(() => {
                if (this.value2 === 0) {
                    if (this.value1 <= 0) {
                        this.endCountDown();
                        return;
                    }
                    this.value1 = --this.value1;
                    this.value2 = 59;
                    this.setState({
                        minute: this.value2,
                        hour: this.value1
                    });
                } else {
                    this.value2 = --this.value2;
                    this.setState({
                        minute: this.value2
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