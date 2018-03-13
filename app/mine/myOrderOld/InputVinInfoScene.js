/**
 * Created by hanmeng on 2017/5/13.
 */

import React, {Component, PropTypes} from 'react'

import {
    StyleSheet,
    View,
    Text,
    ListView,
    TouchableOpacity,
    Image,
    Dimensions,
    TextInput
} from  'react-native'

const {width, height} = Dimensions.get('window');
import BaseComponent from "../../component/BaseComponent";
import NavigatorView from '../../component/AllNavigationView';
import * as fontAndColor from '../../constant/fontAndColor';
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();

export default class InputVinInfoScene extends BaseComponent {
    render() {
        return (
            <View style={styles.container}>
                <NavigatorView title='输入车架号' backIconClick={this.backPage} renderRihtFootView={this.renderRihtFootView}/>

                <View style={styles.inputBar}>
                    <TextInput style={{flex: 1, marginLeft: Pixel.getPixel(15), fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}} placeholder='请输入车架号'/>
                    <Image
                        style={{marginRight: Pixel.getPixel(15)}}
                        source={require('../../../images/login/clear.png')}/>
                </View>
            </View>
        )
    }

    renderRihtFootView = () => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.backPage();
                }}
                activeOpacity={0.9}
            >
                <Text allowFontScaling={false}  style={{color: '#ffffff'}}>完成</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: fontAndColor.COLORA3
    },
    inputBar: {
        alignItems: 'center',
        marginTop: Pixel.getPixel(74),
        backgroundColor: '#ffffff',
        height: Pixel.getPixel(44),
        flexDirection: 'row'
    }
});