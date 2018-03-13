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
    InteractionManager,
    WebView,
    BackAndroid,
    NativeModules,
    Linking,
    Platform
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
import NavigationView from '../component/AllNavigationView';
import * as fontAndColor from '../constant/fontAndColor';
import BaseComponent from '../component/BaseComponent';
export  default class WebScene extends BaseComponent {

    handleBack = () => {
        NativeModules.VinScan.goBack();
        return true;
    }

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            renderPlaceholderOnly: true,
        };
    }

    componentDidMount() {
        try {
            BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
        } catch (e) {

        } finally {
            //InteractionManager.runAfterInteractions(() => {
                this.setState({renderPlaceholderOnly: false});
            //});

            if (Platform.OS === 'android') {
                Linking.openURL(this.props.url);
            } else {
                NativeModules.SystomTools.openAppaleShop();
            }
        }

    }


    render() {
        if (this.state.renderPlaceholderOnly) {
            return this._renderPlaceholderView();
        }
        return (
            <View style={{backgroundColor: fontAndColor.COLORA3,
            flex: 1}}>

                <View style={{flex:1,justifyContent:'center',
                alignItems:'center'}}>
                    <TouchableOpacity onPress={()=>{
                        if(Platform.OS === 'android'){
                            Linking.openURL(this.props.url);
                        }else{
                            NativeModules.SystomTools.openAppaleShop();
                        }
                    }} activeOpacity={0.9} style={{
                        width:width/2,height:Pixel.getPixel(50),
                        backgroundColor:fontAndColor.COLORB0,
                        alignItems:'center',justifyContent:'center'
                    }}>
                        <Text allowFontScaling={false} style={{fontSize:Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                            color:'#fff'}}>打开浏览器下载</Text>
                    </TouchableOpacity>
                </View>

                <NavigationView
                    title="更新"
                />
            </View>
        );
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor: fontAndColor.COLORA3}}>
                <NavigationView
                    title="更新"
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
        height: Pixel.getPixel(10),

    },
    margin: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)

    },
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'}
})