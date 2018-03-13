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
export  default class LQAndComponent extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            number: 1
        }
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
                <View style={{flex:1,alignItems: 'flex-end',justifyContent: 'center'}}>
                    <View style={{width:Pixel.getPixel(92),height:Pixel.getPixel(27),
                    flexDirection: 'row'}}>
                        <TouchableOpacity onPress={()=>{
                            if(this.state.number>1){
                                this.setState({number:this.state.number-1},()=>{
                                this.props.changeNumber(this.state.number);
                            });
                            }
                        }} activeOpacity={0.8}
                                          style={{flex:2,justifyContent:'center',alignItems:'center',
                                          borderWidth:1,borderColor:'#d8d8d8'}}>
                            <Image
                                source={this.state.number>1?require('../../../../images/jian.png'):
                                   require('../../../../images/unjian.png')}/>

                        </TouchableOpacity>
                        <View style={{flex:3,justifyContent:'center',alignItems:'center',
                        borderTopWidth:1,borderBottomWidth:1,borderColor:'#d8d8d8'}}>
                            <Text style={{fontSize: Pixel.getFontPixel(14),color:'#000'}}>
                                {this.state.number}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={()=>{
                            this.setState({number:this.state.number+1},()=>{
                                this.props.changeNumber(this.state.number);
                            });
                        }} activeOpacity={0.8}
                                          style={{flex:2,justifyContent:'center',alignItems:'center',
                                          borderWidth:1,borderColor:'#d8d8d8'}}>
                            <Image style={{width:Pixel.getPixel(12),height:Pixel.getPixel(12)}}
                                   source={require('../../../../images/canjia.png')}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }


}
