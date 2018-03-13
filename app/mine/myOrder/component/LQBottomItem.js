/**
 * Created by lhc on 2017/2/15.
 */
import React, {Component, PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    ListView,
    NativeModules
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../../constant/fontAndColor';
import LQSelectComponent from './LQSelectComponent';

export  default class PurchasePickerItem extends PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{width:width,height:Pixel.getPixel(210),
            backgroundColor:fontAndColor.COLORA3,paddingLeft:Pixel.getPixel(15),
            paddingRight:Pixel.getPixel(15)}}>
                <View style={{width:width-Pixel.getPixel(30),marginTop:Pixel.getPixel(19)}}>
                    <Text style={{fontSize: Pixel.getFontPixel(12),color:'#000'}}>
                        友情提示：
                    </Text>
                    <Text style={{fontSize: Pixel.getFontPixel(12),color:'#9e9e9e',lineHeight: 16,
                    marginTop:Pixel.getPixel(3)}}>
                        1.请确保银行预留手机号码准确，短信验证码将发送给您银行预留手机号码。
                    </Text>
                    <Text style={{fontSize: Pixel.getFontPixel(12),color:'#9e9e9e',lineHeight: 16,
                    marginTop:Pixel.getPixel(3)}}>
                        2.如您输入的“单车指导价”低于车辆实际价值，出险后 即无法获得车辆实际价值的赔偿金。
                    </Text>
                </View>
                <View style={{width:width-Pixel.getPixel(30),marginTop:Pixel.getPixel(21),
                alignItems: 'center',justifyContent:'center',flexDirection: 'row'}}>
                    <Image style={{width:Pixel.getPixel(12),height:Pixel.getPixel(15)}}
                    source={require('../../../../images/phone.png')}/>
                    <Text style={{fontSize: Pixel.getFontPixel(13),color:fontAndColor.COLORB0,
                    marginLeft:Pixel.getPixel(7)}}>
                        010-59230023
                    </Text>
                </View>
            </View>
        );
    }


}
