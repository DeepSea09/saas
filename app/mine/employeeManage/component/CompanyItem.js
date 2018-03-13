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
    TextInput,
    KeyboardAvoidingView
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../../constant/fontAndColor';
export  default class CompanyItem extends PureComponent {

    constructor(props) {
        super(props);
        this.state={
            value :false
        }
    }

    setValue=(values)=>{
        this.setState({
            value:values
        });
    }

    render() {
        return (<TouchableOpacity onPress={()=>{
            this.props.callBack(!this.state.value);
                this.setState({
                    value:!this.state.value
                });
            }} activeOpacity={0.8} style={[{width:width,height:Pixel.getPixel(44),paddingRight:Pixel.getPixel(15),paddingLeft:
            Pixel.getPixel(15),backgroundColor: '#fff',flexDirection: 'row'}]}>
            <View style={{flex:1,justifyContent:'center'}}>
                <Text allowFontScaling={false}  style={[{color: '#000',fontSize: Pixel.getFontPixel(14)},this.state.value?
                    {color: fontAndColor.COLORB0}:{}]}>
                    {this.props.name}</Text>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems: 'flex-end'}}>
                <Image style={{width:Pixel.getPixel(14),height:Pixel.getPixel(14)}}
                       source={require('../../../../images/mainImage/celljiantou.png')}/>
            </View>
        </TouchableOpacity>);
    }

}