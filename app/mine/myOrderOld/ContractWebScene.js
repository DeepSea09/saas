/**
 * Created by hanmeng on 2017/6/21.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    InteractionManager,
    WebView,
    BackAndroid,
    Linking
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import NavigationView from '../../component/AllNavigationView';
import * as fontAndColor from '../../constant/fontAndColor';
import BaseComponent from '../../component/BaseComponent';
let oldUrl = '';
import WebViewTitle from '../../mine/accountManage/component/WebViewTitle';
export  default class ContractWebScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            renderPlaceholderOnly: 'blank',
        };
    }

    componentDidMount() {
        try {
            BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
        } catch (e) {

        } finally {
            //InteractionManager.runAfterInteractions(() => {
                this.setState({renderPlaceholderOnly: 'success'});
            //});
        }
    }

    handleBack = () => {
        this.backPage();
        return true;
    };


    render() {

        if (this.state.renderPlaceholderOnly!=='success') {
            return this._renderPlaceholderView();
        }
        //Linking.openURL("http://test.dms.dycd.com//Uploads/bestsign/contract/2017/6/21/1498029055420.pdf");
        return (
            <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1}}>
                <WebViewTitle ref="webviewtitle"/>
                <WebView
                    ref="www"
                    style={{
                        width: width, height: height, backgroundColor: fontAndColor.COLORA3
                    }}
                    source={{uri: this.props.webUrl, method: 'GET'}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    scalesPageToFit={false}
                    automaticallyAdjustContentInsets={false}
                    onLoadStart={() => {
                        this.refs.webviewtitle.firstProgress();
                    }}
                    onLoadEnd={() => {
                        this.refs.webviewtitle.lastProgress();
                    }}
                    onError={()=>{
                        this.setState({renderPlaceholderOnly: 'error'});
                    }}
                    onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                />
                <NavigationView
                    title="合同"
                    backIconClick={() => {
                        this.props.showModal(false);
                        this.backPage();
                    }}
                />
            </View>
        );
    }

    onNavigationStateChange = (navState) => {
        oldUrl = navState.url;
    };

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height, backgroundColor: fontAndColor.COLORA3}}>
                <NavigationView
                    title="合同"
                    backIconClick={() => {
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