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
    TextInput
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../../constant/fontAndColor';
export  default class WithdrawalsInput extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
    }

    getTextValue=()=>{
        return this.state.value;
    }


    render() {
        return (
            <View style={{flex:2,flexDirection: 'row',}}>
                <Text allowFontScaling={false}  style={{fontSize: Pixel.getFontPixel(22),color: '#000',fontWeight: 'bold',marginTop:Pixel.getPixel(15)}}>
                    ¥</Text>
                <TextInput style={{fontSize: Pixel.getFontPixel(38),color: '#000',fontWeight: 'bold',width:width}}
                           returnKeyType={"search"}
                           placeholder={'提现金额'}
                           keyboardType={'numeric'}
                           maxLength={11}
                           underlineColorAndroid={"#00000000"}
                           value={this.state.value}
                           onChangeText={this.goSearch}/>
            </View>

        );
    }

    chkPrice=(obj)=> {
        obj = obj.replace(/[^\d.]/g, "");
        //必须保证第一位为数字而不是.
        obj = obj.replace(/^\./g, "");
        //保证只有出现一个.而没有多个.
        obj = obj.replace(/\.{2,}/g, ".");
        //保证.只出现一次，而不能出现两次以上
        obj = obj.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        return obj;
    }

    goSearch = (text) => {
        let test = this.chkPrice(text)
            this.setState({
                value: test
            });
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