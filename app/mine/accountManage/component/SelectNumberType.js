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
    PixelRatio
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../../constant/fontAndColor';
import DateTimePicker from 'react-native-modal-datetime-picker'
let onePT = 1 / PixelRatio.get(); //一个像素
export  default class SelectNumberType extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            value:'',
            number:''
        }
    }

    setValue=(name,values)=>{
        this.setState({
            value:name,
            number:values
        });
    }

    getNumber=()=>{
        return this.state.number;
    }


    render() {
        return (<TouchableOpacity onPress={()=>{
            this.props.callBack();
        }} activeOpacity={0.8} style={{width:width-Pixel.getPixel(30),height:Pixel.getPixel(44),backgroundColor:'#fff'
            ,borderBottomColor:fontAndColor.COLORA4,borderBottomWidth:onePT,flexDirection: 'row'}}>
            <View style={{flex:1,justifyContent:'center'}}>
                <Text allowFontScaling={false}  style={[{color: fontAndColor.COLORA1,fontSize: Pixel.getFontPixel(14)},this.state.value==''?
                {color: fontAndColor.COLORA1}:{color: '#000'}]}>
                    {this.state.value==''?'请选择企业证件类型':this.state.value}</Text>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems: 'flex-end'}}>
                <Image style={{width:Pixel.getPixel(14),height:Pixel.getPixel(14)}}
                       source={require('../../../../images/mainImage/celljiantou.png')}/>
            </View>
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