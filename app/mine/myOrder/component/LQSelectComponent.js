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
export  default class PurchasePickerItem extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            selectName: ''
        }
    }

    setSelectName = (name) => {
        this.setState({
            selectName: name
        });
    }

    render() {
        return (
            <View style={{width:width,height:Pixel.getPixel(49),paddingLeft:Pixel.getPixel(15),
            paddingRight: Pixel.getPixel(15),flexDirection: 'row',backgroundColor:'#fff'}}>
                <View style={{flex:1,justifyContent:'center'}}>
                    <Text allowFontScaling={false} style={{fontSize: Pixel.getFontPixel(15),color:'#222222'}}>
                        {this.props.leftName}
                    </Text>
                </View>
                <TouchableOpacity onPress={()=>{
                    this.props.select();
                }} activeOpacity={0.9}
                                  style={{flex:2,justifyContent: 'flex-end',alignItems: 'center',flexDirection: 'row'}}>
                    <Text numberOfLines={1} allowFontScaling={false} style={{fontSize: Pixel.getFontPixel(14),color:'#90A1B5',
                    marginRight:Pixel.getPixel(10)}}>
                        {this.state.selectName}
                    </Text>
                    <Image style={{width:Pixel.getPixel(8),height:Pixel.getPixel(14)}}
                           source={require('../../../../images/financeImages/celljiantou.png')}></Image>
                </TouchableOpacity>
            </View>
        );
    }


}
