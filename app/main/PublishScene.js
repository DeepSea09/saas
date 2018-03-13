/**
 * Created by yujinzhong on 2017/2/8.
 */


import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    NativeModules,
    BackAndroid,
    InteractionManager
} from 'react-native';

import  PixelUtil from '../utils/PixelUtil';
import BaseComponent from '../component/BaseComponent';
import NewCarScene from '../publish/NewCarScene';

const  publishReceive = require('../../images/mainImage/publishReceive.png');
const publishNew = require('../../images/mainImage/publishNew.png');
const Pixel = new PixelUtil();

export default class PublishScene extends BaseComponent {

    handleBack = () => {
        NativeModules.VinScan.goBack();
        return true;
    }

    componentDidMount() {
        try {
            BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
        } catch (e) {

        } finally {
            //InteractionManager.runAfterInteractions(() => {
                this.setState({renderPlaceholderOnly: 'loading'});
                this.initFinish();
            //});
        }
    }

    initFinish=()=>{};

    constructor(props){
        super(props);
    }

    _receivePress = ()=>{

    };

    newCarParams = {
        name: 'NewCarScene',
        component: NewCarScene,
        params: {}
    };

    _newPress = ()=>{
        this.props.callBack(this.newCarParams);
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.fillSpace}/>
                <View style={styles.contentContainer}>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={()=>{this._newPress()}}
                    >
                        <View style={styles.rowCenter}>
                            <Image style={styles.img} source={publishNew}/>
                            <Text allowFontScaling={false}  style={styles.fontMain}>发布新车源</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.fillSpace}/>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={()=>{this._receivePress()}}>
                        <View style={styles.rowCenter}>
                            <Image style={styles.img} source={publishReceive}/>
                            <Text allowFontScaling={false}  style={styles.fontMain}>订阅车源</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    contentContainer:{
        flexDirection:'row',
        marginBottom:Pixel.getPixel(155),
        width:Pixel.getPixel(242)
    },
    btnContainer: {
        flexDirection:'row'
    },
    img:{
        width:Pixel.getPixel(67),
        height:Pixel.getPixel(67),
        borderRadius:Pixel.getPixel(67/2)
    },
    fontMain:{
        fontSize:Pixel.getFontPixel(14),
        color:'#000000',
        marginTop:Pixel.getPixel(10)
    },
    rowCenter:{
        alignItems:'center'
    },
    fillSpace:{
        flex:1
    }
});
