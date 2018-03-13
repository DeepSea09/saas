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
export  default class AddEmployeeInput extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.default?this.props.default:''
        }
    }

    changeVisible = (value) => {
        this.setState({});
    }

    render() {
        let pwd = false;
        if(this.props.items.name=='密码'||this.props.items.name=='确认密码'){
            pwd = true;
        }else{
            pwd = false;
        }
        return (<View style={{width:width,height:Pixel.getPixel(45),backgroundColor:'#fff'}}>
            <KeyboardAvoidingView behavior={'height'} keyboardVerticalOffset={5}>
            <View style={{width:width,height:Pixel.getPixel(44),backgroundColor:'#00000000',flexDirection: 'row',
            paddingLeft: Pixel.getPixel(15),paddingRight: Pixel.getPixel(15)}}>
                <View style={{flex:1,justifyContent:'center'}}>
                    <Text allowFontScaling={false}  style={{fontSize: Pixel.getFontPixel(14),color:'#000'}}>{this.props.items.name}</Text>
                </View>
                <View style={{flex:1,justifyContent:'flex-end',alignItems:'center',flexDirection: 'row'}}>
                    <TextInput style={{fontSize: Pixel.getFontPixel(14),color: fontAndColor.COLORA2,
                    textAlign: 'right',width:width/2-Pixel.getPixel(19),marginRight:Pixel.getPixel(5),height:Pixel.getPixel(44),
                    paddingLeft: 0,
                    paddingRight: 0,
                    paddingTop: 0,
                    paddingBottom: 0,}}
                               returnKeyType={"search"}
                               secureTextEntry={pwd}
                               placeholder={'请输入'+this.props.items.name}
                               underlineColorAndroid={"#00000000"}
                               value={this.state.value}
                               maxLength={this.props.items.name=='账号'?11:32}
                               onChangeText={this.goSearch}/>
                    <Image style={{width:Pixel.getPixel(14),height:Pixel.getPixel(14)}}
                           source={require('../../../../images/mainImage/celljiantou.png')}/>
                </View>
            </View>
            <View style={{width:width,height:Pixel.getPixel(1),backgroundColor:fontAndColor.COLORA3}}>

            </View>
            </KeyboardAvoidingView>
        </View>);
    }

    goSearch = (text) => {
        this.props.items.value = text;
        this.setState({
            value: text
        });
    }
}