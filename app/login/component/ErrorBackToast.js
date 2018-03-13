import React, {Component, PropTypes} from "react";
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    ActivityIndicator,
    PixelRatio,
    TouchableOpacity
} from "react-native";
import * as FontAndColor from "../../constant/fontAndColor";
import PixelUtil from "../../utils/PixelUtil";

var Pixel = new PixelUtil();
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var onePT = 1 / PixelRatio.get(); //一个像素

export default class ErrorBackToast extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            content:''
        }
    }

    show = (content) => {
        this.setState({show: true,content:content});
    }

    render() {
        return (
            <TouchableOpacity onPress={()=>{
                this.setState({show:false});
            }} activeOpacity={1} style={{width:this.state.show?width:0,height:height,
            position: 'absolute',
            justifyContent:'center',alignItems:'center',overflow:'hidden',backgroundColor:'rgba(0,0,0,0.3)'}}>
                <View style={{width:width-Pixel.getPixel(90),backgroundColor:'#fff',
                borderRadius:Pixel.getPixel(5),justifyContent:'center',alignItems:'center',
                borderColor:FontAndColor.COLORB0,borderWidth:onePT}}>
                    <Text style={{marginTop:Pixel.getPixel(20),color: FontAndColor.COLORB0,
                    fontSize: Pixel.getFontPixel(18)}}>提示</Text>
                    <Text style={{marginTop:Pixel.getPixel(20),color: '#000',
                    fontSize: Pixel.getFontPixel(14),marginLeft:Pixel.getPixel(15),
                    marginRight:Pixel.getPixel(15)}}>{this.state.content}</Text>
                    <TouchableOpacity onPress={()=>{
                        this.setState({show:false});
                    }} activeOpacity={0.8} style={{width:Pixel.getPixel(80),
                    height:Pixel.getPixel(40),backgroundColor:FontAndColor.COLORB0,
                    borderRadius:Pixel.getPixel(7),marginTop:Pixel.getPixel(20),
                    marginBottom:Pixel.getPixel(20),justifyContent:'center',
                    alignItems:'center'}}>
                        <Text style={{color: '#fff',
                    fontSize: Pixel.getFontPixel(18)}}>确定</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    }
}
