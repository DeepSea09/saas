import  React, {Component, PropTypes} from  'react'
import  {
    View,
    WebView,
    BackAndroid,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    InteractionManager
} from  'react-native'

import  PixelUtil from '../../utils/PixelUtil'
var Pixel = new PixelUtil();
import {request} from '../../utils/RequestUtil';
import * as fontAndColor from '../../constant/fontAndColor';
import BaseComponent from "../../component/BaseComponent";
import NavigationView from '../../component/AllNavigationView';
import * as AppUrls from '../../constant/appUrls';
import CustomerAddScene from "./ClientAddScene";
import WebViewTitle from "../../mine/accountManage/component/WebViewTitle";
/*
 * 获取屏幕的宽和高
 **/
const {width, height} = Dimensions.get('window');
let oldUrl = '';

export default class StoreReceptionManageScene extends BaseComponent {

    /**
     *
     **/
    constructor(props) {
        super(props);
        this.state = {
            renderPlaceholderOnly: true
        };
    }

    /**
     *
     **/
    componentDidMount() {
        oldUrl = this.props.webUrl;
        BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
        InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: false});
        });
    }

    /**
     *
     **/
    render() {
        if (this.state.renderPlaceholderOnly) {
            return (
                <View style={styles.container}>
                    <NavigationView
                        backIconClick={this.backPage}
                        title="门店接待管理"
                        renderRihtFootView={this._navigatorRightView}
                    />
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <WebViewTitle ref="webviewtitle"/>
                    <WebView
                        ref="www"
                        style={{width: width, height: height, backgroundColor: fontAndColor.COLORA3}}
                        source={{uri: AppUrls.STORE_RECEPTION_MANAGE, method: 'GET'}}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        scalesPageToFit={false}
                        onLoadStart={() => {
                            this.refs.webviewtitle.firstProgress();
                        }}
                        onLoadEnd={() => {
                            this.refs.webviewtitle.lastProgress();
                        }}
                        //onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                    />
                    <NavigationView
                        backIconClick={this.backPage}
                        title="门店接待管理"
                        renderRihtFootView={this._navigatorRightView}
                    />
                </View>
            );
        }
    }

    /**
     *
     **/
    _navigatorRightView = () => {
        return (
            <TouchableOpacity
                style={{
                    width: Pixel.getPixel(53), height: Pixel.getPixel(27),
                    justifyContent: 'center', alignItems: 'flex-end',
                }}
                activeOpacity={0.8} onPress={() => {
                this.toNextPage({
                    name: 'ClientAddScene',
                    component: CustomerAddScene,
                    params: {}
                })
            }}>
                <Image source={require('../../../images/employee_manage.png')}/>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Pixel.getPixel(0),
        backgroundColor: fontAndColor.COLORA3,
    }
});
