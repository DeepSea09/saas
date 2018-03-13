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
    BackAndroid
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
import NavigationView from '../component/AllNavigationView';
import * as fontAndColor from '../constant/fontAndColor';
import BaseComponent from '../component/BaseComponent';
let oldUrl = '';
import WebViewTitle from '../mine/accountManage/component/WebViewTitle';
import CarInfoScene from '../carSource/CarInfoScene';
import MainPage from './MainPage'
export  default class WebScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            renderPlaceholderOnly: true,
        };
    }

    componentDidMount() {
        oldUrl = this.props.webUrl;
        try {
            BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
        } catch (e) {

        } finally {
            //InteractionManager.runAfterInteractions(() => {
                this.setState({renderPlaceholderOnly: false});
            //});
        }
    }

    handleBack = () => {
        this.props.showModal(false);
        if (oldUrl == this.props.webUrl) {
            this.backPage();
        } else {
            this.refs.www.goBack();
        }
        return true;
    }


    render() {
        if (this.state.renderPlaceholderOnly) {
            return this._renderPlaceholderView();
        }
        return (
            <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1}}>
                <WebViewTitle ref="webviewtitle"/>
                <WebView
                    ref="www"
                    style={{width:width,height:height,backgroundColor:
                    fontAndColor.COLORA3}}
                    source={{uri:this.props.webUrl,method: 'GET'}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    scalesPageToFit={false}
                    onLoadStart={()=>{
                        this.refs.webviewtitle.firstProgress();
                    }}
                    onLoadEnd={()=>{
                         this.refs.webviewtitle.lastProgress();
                    }}
                    onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                />
                <NavigationView
                    title= {this.props.title?this.props.title:'公告'}
                    backIconClick={()=>{
                         this.props.showModal(false);
                        console.log(this.props.webUrl)
                        if(oldUrl==this.props.webUrl){
                                this.backPage();

                        }else{
                            this.refs.www.goBack();
                        }
                    }}
                />
            </View>
        );
    }

    onNavigationStateChange = (navState) => {
        oldUrl = navState.url;
        let urls = oldUrl.split('?');
        if (urls[0] == 'http://dycd.tocarsource.com/') {
            let id = urls[1].replace('id=','');
            let navigatorParams = {
                name: "CarInfoScene",
                component: CarInfoScene,
                params: {
                    carID: id,
                    from:'webview'
                }
            };
            let mainParams = {
                name: "MainPage",
                component: MainPage,
                params: {
                }
            };
            this.loginPage(navigatorParams,mainParams)
        }
    }

    loginPage = (mProps,mainParams) => {
        const navigator = this.props.navigator;
        if (navigator) {
            navigator.immediatelyResetRouteStack([{...mainParams},{
                ...mProps
            }])
        }
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor: fontAndColor.COLORA3}}>
                <NavigationView
                    title="公告"
                    backIconClick={()=>{
                         this.props.showModal(false);
                        this.backPage();
                    }}
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