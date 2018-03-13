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
    InteractionManager,
    Animated
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../../constant/fontAndColor';
export  default class Switch extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            fadeAnim: new Animated.Value(0),
        }
    }
    render() {
        return (<TouchableOpacity onPress={()=>{
            let value = 0;
            if(this.state.isOpen){
                value = 0;
            }else{
                value = 1;
            }
            this.setState({
                isOpen:!this.state.isOpen
            });
            Animated.timing(          // Uses easing functions
            this.state.fadeAnim,    // The value to drive
            {toValue: value},           // Configuration
        ).start();                // Don't forget start!
        }} activeOpacity={1} style={{width:Pixel.getPixel(55),height:Pixel.getPixel(31),
        borderRadius:100,backgroundColor:fontAndColor.COLORA3,justifyContent:'center',
        }}>
            <Animated.View style={{opacity: this.state.fadeAnim,backgroundColor:'#4AD762',
            width:Pixel.getPixel(55),height:Pixel.getPixel(31),
        borderRadius:100,position: 'absolute',left:0,top: 0
        }}>
            </Animated.View>
            <Animated.View style={{width:Pixel.getPixel(27),height:Pixel.getPixel(27),backgroundColor:'#fff',borderRadius:100,
            marginLeft:Pixel.getPixel(2),marginRight:Pixel.getPixel(2),
            transform: [{
                 translateX: this.state.fadeAnim.interpolate({
                 inputRange: [0, 1],
                 outputRange: [0, Pixel.getPixel(24)]  // 0 : 150, 0.5 : 75, 1 : 0
                }),
            }],
            }}></Animated.View>
        </TouchableOpacity>);
    }


}
const styles = StyleSheet.create({

    image: {
        width: 43,
        height: 43,
    },
    Separator: {
        backgroundColor: fontAndColor.COLORA3,
        height: Pixel.getPixel(10),

    },
    margin: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)

    },
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'}
})