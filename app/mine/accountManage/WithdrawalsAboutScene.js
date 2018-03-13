/**
 * Created by lhc on 2017/2/15.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    ListView,
    InteractionManager
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../constant/fontAndColor';
import BaseComponent from '../../component/BaseComponent';
import NavigationView from '../../component/AllNavigationView';
export  default class WithdrawalsAboutScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            renderPlaceholderOnly: 'blank',
        };
    }

    initFinish = () => {
       this.setState({
           renderPlaceholderOnly:'success'
       });
    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        }
        return (
            <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1}}>
                <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1}}>
                    <View style={{width:width,height:Pixel.getPixel(166),backgroundColor: '#fff',paddingLeft:Pixel.getPixel(15),
                paddingRight:Pixel.getPixel(15),marginTop:Pixel.getTitlePixel(79)}}>
                        <View style={{width:width-Pixel.getPixel(30),height:Pixel.getPixel(44),justifyContent:'center',
                    }}>
                            <Text allowFontScaling={false}  style={{color: '#000',fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28)}}>
                                银行受理业务时间：
                            </Text>
                        </View>
                        <View style={{width:width-Pixel.getPixel(30),height:Pixel.getPixel(1),justifyContent:'center',
                    alignItems: 'center',backgroundColor: fontAndColor.COLORA3}}></View>
                        <View style={{width:width-Pixel.getPixel(30),height:Pixel.getPixel(102),justifyContent:'center',
                    }}>
                            <Text allowFontScaling={false} 
                                style={{color: '#000',fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),marginTop:Pixel.getPixel(7)}}>
                                提现金额5W以下，7 X24小时受理，准实时到帐
                            </Text>
                            <Text allowFontScaling={false} 
                                style={{color: '#000',fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),marginTop:Pixel.getPixel(7)}}>
                                提现金额5W以上，需在工作日9：00～16：30时间段内，到帐时间以银行处理时间为准；
                            </Text>
                            <Text allowFontScaling={false} 
                                style={{color: '#000',fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),marginTop:Pixel.getPixel(7)}}>
                                提现金额5W以上，非工作时间以外的时间，人行大额通道关闭，银行无法受理，将提现失败；
                            </Text>
                        </View>
                    </View>
                </View>
                <NavigationView
                    title="银行受理及到账时间"
                    backIconClick={this.backPage}
                />
            </View>
        );
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor: fontAndColor.COLORA3}}>
                {this.loadView()}
                <NavigationView
                    title="银行受理及到账时间"
                    backIconClick={this.backPage}
                />
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
        backgroundColor: fontAndColor.COLORA3,
        height: 1,

    },
    margin: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)

    },
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'}
})