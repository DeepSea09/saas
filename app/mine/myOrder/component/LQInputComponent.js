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
    NativeModules,
    TextInput
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../../constant/fontAndColor';
export  default class LQInputComponent extends PureComponent {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <View style={{width:width,height:Pixel.getPixel(49),paddingLeft:Pixel.getPixel(15),
            paddingRight: Pixel.getPixel(15),flexDirection: 'row',backgroundColor:'#fff'}}>
                <View style={{flex:1,alignItems: 'center',flexDirection: 'row'}}>
                    <Text style={{fontSize: Pixel.getPixel(15),color:'#222222'}}>单车指导价(</Text>
                    <Text style={{fontSize: Pixel.getPixel(12),color:'#222222'}}>可修改</Text>
                    <Text style={{fontSize: Pixel.getPixel(15),color:'#222222'}}>)</Text>
                </View>
                <View style={{flex:1,justifyContent: 'flex-end',alignItems: 'center',flexDirection: 'row'}}>
                    <TextInput
                        keyboardType={'numeric'}
                        style={styles.textInput}
                        maxLength={15}
                        defaultValue={this.props.money}
                        underlineColorAndroid='transparent'
                        ref={(input) => {this.instructionsInput = input}}
                        onChangeText={(text)=>{this.props.inputMoney(text)}}
                    />
                    <Text style={{fontSize: Pixel.getPixel(12),color:'#90A1B5'}}>万元</Text>
                </View>
            </View>
        );
    }


}

const styles = StyleSheet.create({
    textInput: {
        flex: 1,
        borderColor: '#00000000',
        textAlign: 'right',
        fontSize: Pixel.getFontPixel(14),
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        backgroundColor: 'white',
        color: '#90A1B5',
    },
});
