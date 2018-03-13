/**
 * Created by lhc on 2017/2/15.
 */
import React, {Component,PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    ListView,
    InteractionManager
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../../constant/fontAndColor';
import DateTimePicker from 'react-native-modal-datetime-picker'
export  default class SelectDate extends PureComponent {

    constructor(props) {
        super(props);
        this.state={
            isDateTimePickerVisible:false
        }
    }

    changeVisible=(value)=>{
        this.setState({
            isDateTimePickerVisible:value
        });
    }


    render() {
        return(<DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
            titleIOS="请选择日期"
            confirmTextIOS='确定'
            cancelTextIOS='取消'
        />);
    }

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false })

    _handleDatePicked = (date) => {
        let tempdate=dateFormat(date,'yyyy-MM-dd');
        // let tempdate=dateFormat(Date.parse(new Date()),'yyyy-MM-dd')
        // let select = Date.parse(new Date(date));
        // let mm = Date.parse(new Date());
        // let aa = Math.ceil((select-mm)/1000/60/60/24);
        this.props.callBack(tempdate);
        this._hideDateTimePicker();
    }

}
const dateFormat = (date,fmt) => {
    let o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
const styles = StyleSheet.create({

    image: {
        width: 43,
        height: 43,
    },
    Separator: {
        backgroundColor: fontAndColor.COLORA3,
        height: Pixel.getPixel(10),

    },
    margin: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)

    },
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'}
})