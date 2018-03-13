import React, {Component, PropTypes} from "react";
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    TouchableWithoutFeedback,
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

export default class ConfirmButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showImage:false
        }
    }

    render() {
        return (
            <View style={{width:width,height:Pixel.getPixel(20),backgroundColor:FontAndColor.COLORA3,flexDirection: 'row',
            alignItems: 'center'}}>

                <TouchableOpacity onPress={()=>{
                    this.props.imageButton(!this.state.showImage);
                   this.setState({
                       showImage:!this.state.showImage
                   });
                }} activeOpacity={1} style={{height:Pixel.getPixel(20),width:Pixel.getPixel(24),justifyContent:'center'}}>
                    <Image style={{height:Pixel.getPixel(16),width:Pixel.getPixel(16)}}
                           source={this.state.showImage?require('../../../images/login/okconfirm.png'):require('../../../images/login/noconfirm.png')}></Image>
                </TouchableOpacity>
                <Text allowFontScaling={false}  style={{color: FontAndColor.COLORA1,fontSize:
                Pixel.getFontPixel(FontAndColor.CONTENTFONT24),backgroundColor:FontAndColor.COLORA3}}>我已详细阅读并同意</Text>
                <TouchableOpacity onPress={()=>{
                    this.props.textButton();
                }}>
                    <Text allowFontScaling={false}  style={{color: FontAndColor.COLORA2,fontSize:
                Pixel.getFontPixel(FontAndColor.CONTENTFONT24),backgroundColor:FontAndColor.COLORA3}}>《电子账户服务协议》</Text>
                </TouchableOpacity>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    componentStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: onePT,
        borderBottomColor: FontAndColor.COLORA4,
        height: Pixel.getPixel(45),
    }

});