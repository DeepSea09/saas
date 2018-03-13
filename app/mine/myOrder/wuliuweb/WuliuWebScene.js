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
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
import NavigatorView from '../../../component/AllNavigationView';
import * as Urls from '../../../constant/appUrls';
import * as fontAndColor from '../../../constant/fontAndColor';
import BaseComponent from '../../../component/BaseComponent';
let oldUrl = '';
import WebViewTitle from '../../accountManage/component/WebViewTitle';
import WuliuShare from './WuliuShare';
export  default class WuliuWebScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        this.shareData=null;
        if(Urls.BASEURL=='http://api-gateway.test.dycd.com/'){
            this.webUrl='http://test.bms.dycd.com/platform/logistics.html';
        }else if(Urls.BASEURL=='http://dev.api-gateway.dycd.com/'){
            this.webUrl='http://devwd.bms.dycd.com/platform/logistics.html/';
        }else if(Urls.BASEURL=='https://gatewayapi.dycd.com/' || Urls.BASEURL=='https://stgatewayapi.dycd.com/'){
            this.webUrl='http://bms.dycd.com/platform/logistics.html';
        }
        this.state = {
            renderPlaceholderOnly: true,
        };
    }

    componentDidMount() {
        oldUrl = this.webUrl;
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
        if (oldUrl == this.webUrl) {
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
                    source={{uri:this.webUrl,method: 'GET'}}
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
                <WuliuShare ref="sharedView" shareData={this.shareData} webpageUrl={this.webUrl}/>
                <NavigatorView title='物流服务' backIconClick={()=>{
                    this.props.showModal(false);
                    console.log('====',oldUrl+'---'+this.webUrl)
                    if(oldUrl==this.webUrl){
                        this.backPage();

                    }else{
                        this.refs.www.goBack();
                    }
                }} renderRihtFootView={this.renderRightView}/>
            </View>
        );
    }

    renderRightView = () => {
        return (
            <TouchableOpacity onPress={
                () => {
                    this.refs.sharedView.isVisible(true);
                }
            }>
                <View style={{
                    marginLeft: Pixel.getPixel(10),
                    width: Pixel.getPixel(60),
                    height: Pixel.getPixel(40),
                    flexDirection:'row-reverse',
                    alignItems: 'center'
                }}>
                    <Image
                        style={{width:Pixel.getPixel(22),height:Pixel.getPixel(22)}}
                        source={require('../../../../images/wuliu_share_icon.png')}></Image>
                </View>
            </TouchableOpacity>
        )


    }

    onNavigationStateChange = (navState) => {
        oldUrl = navState.url;
        let urls = oldUrl.split('?');
        if (urls[0] == 'http://dycd.tocarsource.com/') {
            let id = urls[1].replace('id=','');
            // let navigatorParams = {
            //     name: "CarInfoScene",
            //     component: CarInfoScene,
            //     params: {
            //         carID: id,
            //         from:'webview'
            //     }
            // };
            // let mainParams = {
            //     name: "MainPage",
            //     component: MainPage,
            //     params: {
            //     }
            // };
            // this.loginPage(navigatorParams,mainParams)
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
                <NavigatorView
                    title="物流服务"
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