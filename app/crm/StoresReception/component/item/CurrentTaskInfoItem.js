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

export default class CurrentTaskInfoItem extends BaseComponent {

    /**
     *
     **/
    constructor(props) {
        super(props);
        this.childItems = [];
        this.clientInfo = this.props.rowData;
        this.currentTask = this.props.data.maps[this.props.data.maps.length - 1] ?
            this.props.data.maps[this.props.data.maps.length - 1] : '';
        if (this.clientInfo.customerStatus == 2) {
            this.childItems.push({name: '客户状态', value: ''});
            this.childItems.push({name: '跟进时间', value: ''});
            this.childItems.push({name: '消息提醒日期', value: ''});
            this.childItems.push({name: '客户是否到店', value: ''});
            this.childItems.push({name: '跟踪内容', value: ''});
        } else {
            this.childItems.push({name: '客户状态', value: ''});
            this.childItems.push({name: '跟进时间', value: ''});
            this.childItems.push({name: '跟踪内容', value: ''});
        }
    }

    /**
     *
     **/
    initFinish = () => {
        /*this.setState({
         renderPlaceholderOnly: 'success'
         });*/
    }

    /**
     *  获取表单内数据
     **/
    getItemData = () => {
        return this.childItems;
    };

    /**
     *   客户状态映射
     **/
    customerStatusMapping = (status, come) => {
        let createTime = this.currentTask.createTime ? this.currentTask.createTime : '暂无记录';
        let customerFlowMessage = this.currentTask.customerFlowMessage ? this.currentTask.customerFlowMessage : '暂无记录';
        let pushTime = this.currentTask.pushTime ? this.currentTask.pushTime.substring(0, 10) : '暂无记录';
        if (status == 1) {
            this.childItems[0].value = '初次';
            this.childItems[1].value = '暂无记录';
            this.childItems[2].value = '暂无记录';
        } else if (status == 2) {
            this.childItems[0].value = '电话邀约';
            this.childItems[1].value = createTime;
            this.childItems[4].value = customerFlowMessage;
            this.childItems[2].value = pushTime;
            if (come == 1) {
                this.childItems[3].value = '到店';
            } else {
                this.childItems[3].value = '未到店';
            }
        } else if (status == 3) {
            this.childItems[0].value = '已购买';
            this.childItems[1].value = createTime;
            this.childItems[2].value = customerFlowMessage;
        } else if (status == 4) {
            this.childItems[0].value = '置换';
            this.childItems[1].value = createTime;
            this.childItems[2].value = customerFlowMessage;
        } else if (status == 5) {
            this.childItems[0].value = '复购';
            this.childItems[1].value = createTime;
            this.childItems[2].value = customerFlowMessage;
        }
    };

    /**
     *
     **/
    render() {
        this.customerStatusMapping(this.clientInfo.customerStatus, this.clientInfo.customerCome);
        let items = [];
        for (let i = 0; i < this.childItems.length; i++) {
            items.push(<View
                key={i + 'bo'}
                style={{
                    backgroundColor: '#fff'
                }}>
                <View style={{
                    backgroundColor: '#00000000',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    width: width
                }}>
                    <Text allowFontScaling={false}
                          style={{
                              marginLeft: Pixel.getPixel(15),
                              marginTop: Pixel.getPixel(15),
                              fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                              color: fontAndColor.COLORA0
                          }}>{this.childItems[i].name}</Text>
                    <View style={{flex: 1}}/>
                    <View style={{
                        width: width - Pixel.getPixel(115),
                        marginRight: Pixel.getPixel(15), marginTop: Pixel.getPixel(15),
                        marginBottom: Pixel.getPixel(15),
                    }}>
                        <Text allowFontScaling={false}
                              style={{
                                  alignSelf: 'flex-end',
                                  textAlign: 'left',
                                  fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                                  color: fontAndColor.COLORA0
                              }}>{this.childItems[i].value}</Text>
                    </View>
                </View>
                <View style={{
                    width: width,
                    height: Pixel.getPixel(1),
                    backgroundColor: fontAndColor.COLORA3
                }}/>
            </View>)
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
                        allowFontScaling={false}>当前任务信息</Text>
                </View>
                <View style={{
                    height: 1,
                    backgroundColor: fontAndColor.COLORA3
                }}/>
                {items}
            </View>
        )
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