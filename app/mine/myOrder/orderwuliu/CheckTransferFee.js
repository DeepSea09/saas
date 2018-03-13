import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View, TouchableOpacity, Dimensions, TextInput, Image,
} from 'react-native';
import BaseComponent from '../../../component/BaseComponent';
import NavigatorView from '../../../component/AllNavigationView';

const {width} = Dimensions.get('window');
import * as FontAndColor from '../../../constant/fontAndColor';
import PixelUtil from '../../../utils/PixelUtil';
import StorageUtil from "../../../utils/StorageUtil";
import * as StorageKeyNames from "../../../constant/storageKeyNames";

const share_icon_wechat = require('../../../../images/share_icon_wechat.png');

import {request} from '../../../utils/RequestUtil';
import * as Urls from '../../../constant/appUrls';

const Pixel = new PixelUtil();
let addressDatas = [{title: '发车地址', value: '湖北省武汉市武昌区街坊邻居阿拉丁就附近阿斯蒂芬逻', image: share_icon_wechat},
    {title: '收车地址/到库自提', value: '湖北省武汉市武昌区街坊邻居阿拉丁就附近阿斯蒂芬逻', image: share_icon_wechat}];
export default class CheckTransferFee extends BaseComponent {
    constructor(props) {
        super(props);
        this.num = '';//识别号
        this.riseText = '';//抬头
        this.telText = '';
        this.addressText = '';
        this.state = {
            renderPlaceholderOnly: false,
        }
    }

    initFinish() {
        this.setState({
            renderPlaceholderOnly: 'success'
        });
    }

    _renderItem = () => {
        return (
            <View style={{flex: 1}}>
                <View style={{
                    backgroundColor: 'white',
                    paddingHorizontal: Pixel.getPixel(15)
                }}>
                    {
                        addressDatas.map((data, index) => {
                            return (
                                <View key={index + 'fee'} style={[styles.content_title_text_wrap,index == 1 && {borderBottomWidth: 0}]}>
                                    <Image source={data.image}/>
                                    <View style={{flex:1,marginLeft: Pixel.getPixel(15),}}>
                                        <Text style={styles.content_title_text}>{data.title}</Text>
                                        <Text style={[styles.content_title_text,{marginTop:Pixel.getPixel(3)},]}>{data.value}</Text>
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>

                <Text style={{
                    marginLeft: Pixel.getPixel(15),
                    marginVertical: Pixel.getPixel(10),
                    fontSize: Pixel.getPixel(14),
                    color: FontAndColor.COLORA1
                }}>车辆信息信息</Text>


            </View>
        );

    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return ( <View style={styles.container}>
                {this.loadView()}
                <NavigatorView title='查询运价' backIconClick={this.backPage}/>
            </View>);
        } else {
            return (<View style={styles.container}>
                <View style={{flex: 1, marginTop: Pixel.getTitlePixel(65),}}>
                    {
                        this._renderItem()
                    }
                </View>
                <NavigatorView title='查询运价' backIconClick={this.backPage}/>
            </View>)
        }

    }


}

const styles = StyleSheet.create({
    container: {
        backgroundColor: FontAndColor.COLORA3,
        flex: 1,
    },
    content_title_text_wrap: {
        height: Pixel.getPixel(80),
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: Pixel.getPixel(1),
        borderColor: FontAndColor.COLORA4,
        backgroundColor: 'white',
    },
    content_title_text: {
        fontSize: Pixel.getFontPixel(15),
        color: 'black',
    },
});
