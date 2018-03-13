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
import LQAndComponent from './LQAndComponent';

export  default class LQTransportItem extends PureComponent {

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(props) {
        this.refs.lqselectcomponenttop.setSelectName(props.transName);
    }

    render() {
        return (
            <View style={{width:width,justifyContent:'center',alignItems:'center',
            backgroundColor:'#fff',height:Pixel.getPixel(98)}}>
                <LQSelectComponent ref="lqselectcomponenttop" leftName={'运输类型'} select={()=>{
                    this.props.selectTransport();
                }}/>
                <View style={{width:width-Pixel.getPixel(30),height:Pixel.getPixel(1),
                backgroundColor:'#D8D8D8'}}></View>
                <LQAndComponent ref="lqselectcomponentbottom" leftName={'数量'} changeNumber={(number)=>{
                    this.props.changeNumber(number);
                }}/>
            </View>
        );
    }


}
