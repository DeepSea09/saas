/**
 * Created by hanmeng on 2017/8/6.
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
import * as fontAndColor from '../../../../constant/fontAndColor';
import PixelUtil from '../../../../utils/PixelUtil';
import BaseComponent from "../../../../component/BaseComponent";
import ClientInfoSelected from "../ClientInfoSelected";
import CustomerInfoInput from "../ClientInfoInput";
import SelectScene from "../../SelectScene";
const Pixel = new PixelUtil();
import DateTimePicker from 'react-native-modal-datetime-picker';

export default class FollowTaskInfoItem extends BaseComponent {

    /**
     *
     **/
    constructor(props) {
        super(props);
        this.childItems = [];
        this.clientInfo = this.props.rowData;
        this.clientState = [];
        if (this.clientInfo.customerStatus == 1) {
            this.clientState = ['电话邀约', '已购买', '置换', '复购'];
        } else if (this.clientInfo.customerStatus == 2) {
            this.clientState = ['电话邀约', '已购买', '置换', '复购'];
        } else if (this.clientInfo.customerStatus == 3) {
            this.clientState = ['已购买', '置换', '复购'];
        } else if (this.clientInfo.customerStatus == 4) {
            this.clientState = ['置换'];
        } else if (this.clientInfo.customerStatus == 5) {
            this.clientState = ['复购'];
        }

        this.childItems.push({name: '客户状态', value: '', parameter: 'customerStatus'});
/*        this.childItems.push({name: '消息提醒日期', value: ''});
        this.childItems.push({name: '客户是否到店', value: ''});
        this.childItems.push({name: '跟踪内容', value: ''});*/
        this.state = {
            childItems: this.childItems,
            isDateTimePickerVisible: false
        }
    }

    /**
     *   获取表单内数据
     **/
    getItemData = () => {
        return this.childItems;
    };

    /**
     *
     **/
    showFollowTask = (str) => {
        this.childItems.splice(1, 3);
        //console.log('this.childItems=====111====', this.childItems);
        if (str == '电话邀约') {
            this.childItems.push({name: '消息提醒日期', value: '', parameter: 'remind'});
            this.childItems.push({name: '客户是否到店', value: '', parameter: 'comeIf'});
        }
        this.childItems.push({name: '跟踪内容', value: '', parameter: 'custFlow'});
        this.setState({
            childItems: this.childItems
        });
    };

    /**
     *   获取表单内数据
     **/
    getItemData = () => {
        return this.state.childItems;
    };

    /**
     *
     **/
    render() {
        let items = [];
        if (this.props.editState != 'look') {
            for (let i = 0; i < this.state.childItems.length; i++) {
                if (this.state.childItems[i].name == '客户状态') {
                    items.push(<ClientInfoSelected ref='selectsex' key={i + 'bo'} items={this.state.childItems[i]}
                                                   toSelect={() => {
                                                       this.toNextPage({
                                                           name: 'SelectScene',
                                                           component: SelectScene,
                                                           params: {
                                                               regShowData: this.clientState,
                                                               title: '客户状态',
                                                               callBack: (name) => {
                                                                   if (name === '电话邀约') {
                                                                       this.state.childItems[i].value = 2;
                                                                   } else if (name === '已购买') {
                                                                       this.state.childItems[i].value = 3;
                                                                   } else if (name === '置换') {
                                                                       this.state.childItems[i].value = 4;
                                                                   } else if (name === '复购') {
                                                                       this.state.childItems[i].value = 5;
                                                                   }
                                                                   this.refs.selectsex.setValue(name);
                                                                   this.showFollowTask(name);
                                                               }
                                                           }
                                                       })
                                                   }}/>);
                } else if (this.state.childItems[i].name == '消息提醒日期') {
                    items.push(<ClientInfoSelected ref="company" key={i + 'bo'} items={this.state.childItems[i]}
                                                   toSelect={() => {
                                                       this._showDateTimePicker();
                                                   }}/>);
                } else if (this.state.childItems[i].name == '客户是否到店') {
                    items.push(<ClientInfoSelected ref='juese' key={i + 'bo'} items={this.state.childItems[i]}
                                                   toSelect={() => {
                                                       this.toNextPage({
                                                           name: 'SelectScene',
                                                           component: SelectScene,
                                                           params: {
                                                               regShowData: ['已到店', '未到店'],
                                                               title: '地域',
                                                               callBack: (name) => {
                                                                   if (name === '已到店') {
                                                                       this.state.childItems[i].value = 'yes';
                                                                   } else {
                                                                       this.state.childItems[i].value = 'no';
                                                                   }
                                                                   this.refs.juese.setValue(name);
                                                               }
                                                           }
                                                       })
                                                   }}/>);
                } else if (this.state.childItems[i].name == '跟踪内容') {
                    items.push(<CustomerInfoInput key={i + 'bo'} items={this.state.childItems[i]}/>);
                }

            }
        }
        return (
            <View style={{
                flex: 1,
                backgroundColor: 'white'
            }}>
                <View style={{height: Pixel.getPixel(44), flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{
                        marginLeft: Pixel.getPixel(15),
                        backgroundColor: fontAndColor.COLORB0,
                        height: Pixel.getPixel(11),
                        width: Pixel.getPixel(3)
                    }}/>
                    <Text
                        style={{marginLeft: Pixel.getPixel(5), fontWeight: 'bold'}}
                        allowFontScaling={false}>本次任务跟踪</Text>
                </View>
                <View style={{
                    height: 1,
                    backgroundColor: fontAndColor.COLORA3
                }}/>
                {items}
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

    /**
     *
     * @private
     **/
    _showDateTimePicker = () => {
        this.setState({isDateTimePickerVisible: true})
    };

    /**
     *
     * @private
     **/
    _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

    /**
     *
     * @private
     **/
    _handleDatePicked = (date) => {
        //console.log('A date has been picked: ', date);
        let d = this.dateFormat(date, 'yyyy-MM-dd');
        this.refs.company.setValue(d);
        this.state.childItems[1].value = d;
        this.setState({
            isDateTimePickerVisible: false
        });
        //this.props.updateStartDate(d);

        //this._hideDateTimePicker();
    };

    /**
     *
     * @private
     **/
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
    separatedLine: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15),
        height: 1,
        backgroundColor: fontAndColor.COLORA4
    },
});