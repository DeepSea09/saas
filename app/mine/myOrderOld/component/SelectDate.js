/**
 * Created by hanmeng on 2017/5/13.
 */

import React, {Component, PropTypes} from 'react'

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    TextInput
} from  'react-native'

const {width, height} = Dimensions.get('window');
import BaseComponent from "../../../component/BaseComponent";
import NavigatorView from '../../../component/AllNavigationView';
import * as fontAndColor from '../../../constant/fontAndColor';
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
import DateTimePicker from 'react-native-modal-datetime-picker';


export default class SelectDate extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            isDateTimePickerVisible: false
        }
    }

    render() {
        return (
            <View style={{height: Pixel.getPixel(95), backgroundColor: '#ffffff'}}>
                <View style={{
                    flexDirection: 'row',
                    marginLeft: Pixel.getPixel(15),
                    marginRight: Pixel.getPixel(25),
                    marginTop: Pixel.getPixel(17)
                }}>
                    <Text allowFontScaling={false}  style={{fontSize: Pixel.getPixel(fontAndColor.BUTTONFONT30)}}>创建订单日期</Text>
                    <View style={{flex: 1}}/>
                    <Text allowFontScaling={false} 
                        onPress={() => {
                            this.setState({
                                startDate: '选择开始时间',
                                endDate: '选择结束时间'
                            });
                            this.props.updateStartDate('选择开始时间');
                            this.props.updateEndDate('选择结束时间');
                        }}
                        style={{
                            fontSize: Pixel.getPixel(fontAndColor.BUTTONFONT30),
                            color: fontAndColor.COLORB0
                        }}>清除</Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: Pixel.getPixel(16), alignItems: 'center'}}>
                    <TouchableOpacity style={styles.dateBox} onPress={() => {
                        this._showDateTimePicker('start')
                    }}>
                        <Text allowFontScaling={false} 
                            style={this.state.startDate === '选择开始时间' ? styles.unSelectDate : styles.selectDate}>{this.state.startDate}</Text>
                    </TouchableOpacity>
                    <Text allowFontScaling={false} >至</Text>
                    <TouchableOpacity style={styles.dateBox} onPress={() => {
                        this._showDateTimePicker('end')
                    }}>
                        <Text allowFontScaling={false} 
                            style={this.state.endDate === '选择结束时间' ? styles.unSelectDate : styles.selectDate}>{this.state.endDate}</Text>
                    </TouchableOpacity>
                </View>
                <DateTimePicker
                    titleIOS="请选择日期"
                    confirmTextIOS='确定'
                    cancelTextIOS='取消'
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}/>
            </View>
        )
    }

    _showDateTimePicker = (type) => {
        this.type = type;
        this.setState({isDateTimePickerVisible: true})
    };

    _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

    _handleDatePicked = (date) => {
        console.log('A date has been picked: ', date);
        let d = this.dateFormat(date, 'yyyy-MM-dd');
        if (this.type === 'start') {
            this.setState({
                startDate: d,
                isDateTimePickerVisible: false
            });
            this.props.updateStartDate(d);
        } else {
            this.setState({
                endDate: d,
                isDateTimePickerVisible: false
            });
            this.props.updateEndDate(d);
        }

        //this._hideDateTimePicker();
    };

    dateFormat = (date, fmt) => {
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


}

const styles = StyleSheet.create({
    carType: {
        marginLeft: Pixel.getPixel(15),
        fontSize: Pixel.getPixel(fontAndColor.BUTTONFONT30),
        marginTop: Pixel.getPixel(17)
    },
    dateBox: {
        marginLeft: Pixel.getPixel(16),
        marginRight: Pixel.getPixel(16),
        justifyContent: 'center',
        //width: Pixel.getPixel(140),
        flex: 1,
        height: Pixel.getPixel(32),
        backgroundColor: fontAndColor.COLORA3
    },
    selectDate: {
        textAlign: 'center'
    },
    unSelectDate: {
        textAlign: 'center',
        color: fontAndColor.COLORA1
    }
});