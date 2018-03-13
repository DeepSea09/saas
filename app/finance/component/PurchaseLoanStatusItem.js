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
    ListView
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../constant/fontAndColor';
export  default class PurchasePickerChildItem extends PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.parentView}>
                <View style={{
                    width: Pixel.getPixel(44),
                    height: Pixel.getPixel(70), alignItems: 'center'
                }}>
                    {this.props.index == 0 ? null : <View style={{
                            width: Pixel.getPixel(1),
                            height: Pixel.getPixel(23),
                            backgroundColor: fontAndColor.COLORA4
                        }}/>}
                    {this.props.index == 0 ?
                        <View style={[{
                            width: Pixel.getPixel(15),
                            height: Pixel.getPixel(15),
                            backgroundColor: '#B3EDED',
                            borderRadius: 10,
                            marginTop: Pixel.getPixel(20)
                        }]}>
                            <View style={[{
                                width: Pixel.getPixel(10),
                                height: Pixel.getPixel(10),
                                backgroundColor: '#05C5C2',
                                borderRadius: 10,
                                marginTop: Pixel.getPixel(2.5),
                                marginLeft: Pixel.getPixel(2.5)
                            }]}>

                            </View>
                        </View>
                        : <View style={[{
                            width: Pixel.getPixel(5),
                            height: Pixel.getPixel(5),
                            backgroundColor: fontAndColor.COLORA4,
                            borderRadius: 100
                        }]}/>}
                    {this.props.index == this.props.lastIndex ? null :
                        <View style={{width: Pixel.getPixel(1), flex: 1, backgroundColor: fontAndColor.COLORA4}}/>}
                </View>
                <View style={{flex: 1}}>
                    <View style={{flex: 1, height: Pixel.getPixel(69.5)}}>
                        <Text allowFontScaling={false}  style={[{
                            fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                            marginTop:Pixel.getPixel(18)
                        },this.props.index==0?{color: fontAndColor.COLORA0,}:{color: fontAndColor.COLORA1}]}>{this.props.items.info}</Text>
                        <Text allowFontScaling={false}  style={{
                            fontSize: Pixel.getFontPixel(fontAndColor.MARKFONT22),
                            color: fontAndColor.COLORA1,marginTop:Pixel.getPixel(10)
                        }}>{this.props.items.createtime}</Text>
                    </View>
                    <View style={{
                        width: width,
                        height: Pixel.getPixel(0.5),
                        backgroundColor: fontAndColor.COLORA3
                    }}></View>
                </View>
            </View>
        );
    }

}
const styles = StyleSheet.create({
    parentView: {
        flex: 1,
        height: Pixel.getPixel(70),
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderColor: '#00000000'
    }
})