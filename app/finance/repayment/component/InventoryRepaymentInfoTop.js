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
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../../constant/fontAndColor';
export default class InventoryRepaymentInfoTop extends PureComponent {

    constructor(props) {
        super(props);
        // 初始状态
    }

    render() {
        let movies = this.props.itemData;
        return (
            <View
                style={{marginTop: Pixel.getTitlePixel(64),
                    width:width,height:Pixel.getPixel(87),
                    backgroundColor: '#ffffff',
                    paddingLeft:Pixel.getPixel(15),
                    paddingRight:Pixel.getPixel(15)}}>
                <View style={{flex:1,flexDirection:'row'}}>
                    <View style={{flex:1,justifyContent:'center',alignItems:'flex-start'}}>
                        <Text allowFontScaling={false} 
                            style={{fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),color:fontAndColor.COLORA1}}>单号：{movies.loan_number}</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                        <Text allowFontScaling={false} 
                            style={{fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),color:fontAndColor.COLORA1}}>放款时间：{movies.loan_time_str}</Text>
                    </View>
                </View>
                <View
                    style={{height:1,backgroundColor: fontAndColor.COLORA3,width:width-Pixel.getPixel(30)}}></View>
                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                    <Text allowFontScaling={false} 
                        style={{fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                            color:fontAndColor.COLORA1}}>放款额：</Text>
                    <Text allowFontScaling={false} 
                        style={{fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                            color:fontAndColor.COLORA0}}>{movies.loan_mny_str} | {movies.loanperiod_type}</Text>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({

    image: {
        width: 43,
        height: 43,
    },
    Separator: {
        height: Pixel.getPixel(1),
        backgroundColor: fontAndColor.COLORA3

    },
    margin: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)

    },
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'},
    parentStyle: {
        height: Pixel.getPixel(44),
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        backgroundColor: fontAndColor.COLORB0,
    },
    childStyle: {
        fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
        color: '#ffffff',
    }
})