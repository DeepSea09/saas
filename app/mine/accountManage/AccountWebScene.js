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
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import NavigationView from '../../component/AllNavigationView';
import * as fontAndColor from '../../constant/fontAndColor';
import BaseComponent from '../../component/BaseComponent';
import MainPage from '../../main/MainPage';
import * as webBackUrl from '../../constant/webBackUrl';
let oldUrl = '';
import WebViewTitle from './component/WebViewTitle';
export  default class AccountWebScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            renderPlaceholderOnly: 'blank',
        };
    }

    componentDidMount() {
        oldUrl = this.props.webUrl;
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
        this.props.showModal(false);
        if (oldUrl == this.props.webUrl && this.props.backUrl != webBackUrl.PAY) {
            this.backPage();
        } else if (this.props.backUrl == webBackUrl.PAY) {
            this.props.showModal(false);
            this.props.callBack();
            this.backPage();
        } else {
            try {
                this.refs.www.goBack();
            } catch (e) {

            } finally {

            }
        }
        return true;
    }


    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        }
        return (
            <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1}}>
                <WebViewTitle ref="webviewtitle"/>
                <WebView
                    ref="www"
                    style={{
                        width: width, height: height,
                        backgroundColor: fontAndColor.COLORA3
                    }}
                    source={{uri: this.props.webUrl, method: 'GET'}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    automaticallyAdjustContentInsets={false}
                    scalesPageToFit={false}
                    onLoadStart={() => {
                        this.refs.webviewtitle.firstProgress();

                    }}
                    onLoadEnd={() => {
                        this.refs.webviewtitle.lastProgress();
                    }}
                    onError={() => {
                        this.setState({renderPlaceholderOnly: 'error'});
                    }}
                    onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                />
                <NavigationView
                    title={this.props.title}
                    backIconClick={() => {
                        this.props.showModal(false);
                        if (oldUrl == this.props.webUrl && this.props.backUrl != webBackUrl.PAY) {
                            this.backPage();
                        } else if (this.props.backUrl == webBackUrl.PAY) {
                            this.props.showModal(false);
                            this.props.callBack();
                            this.backPage();
                        } else {
                            this.props.callBack();
                            if (this.props.backUrl == webBackUrl.OPENINDIVIDUALACCOUNT ||
                                this.props.backUrl == webBackUrl.OPENENTERPRISEACCOUNT ||
                                this.props.backUrl == webBackUrl.BINDCARD ||
                                this.props.backUrl == webBackUrl.UNBINDCARD) {
                                const navigator = this.props.navigator;
                                if (navigator) {
                                    for (let i = 0; i < navigator.getCurrentRoutes().length; i++) {
                                        if (navigator.getCurrentRoutes()[i].name == 'MyAccountScene') {
                                            navigator.popToRoute(navigator.getCurrentRoutes()[i]);
                                            break;
                                        }
                                    }
                                }
                            } else if (this.props.backUrl == webBackUrl.TRANSFER ||
                                this.props.backUrl == webBackUrl.WITHDRAWALS) {
                                const navigator = this.props.navigator;
                                if (navigator) {
                                    for (let i = 0; i < navigator.getCurrentRoutes().length; i++) {
                                        if (navigator.getCurrentRoutes()[i].name == 'AccountScene') {
                                            navigator.popToRoute(navigator.getCurrentRoutes()[i]);
                                            break;
                                        }
                                    }
                                }
                            } else {
                                this.backPage();
                            }
                        }
                    }}
                />
            </View>
        )
            ;
    }

    onNavigationStateChange = (navState) => {
        console.log('123---------' + navState.url);
        oldUrl = navState.url;
        if (oldUrl == 'http://' + this.props.backUrl + '/') {
            this.props.showModal(false);
            this.props.callBack();
            if (oldUrl == 'http://' + webBackUrl.OPENINDIVIDUALACCOUNT + '/' ||
                oldUrl == 'http://' + webBackUrl.OPENENTERPRISEACCOUNT + '/' || oldUrl == 'http://' + webBackUrl.BINDCARD + '/' ||
                oldUrl == 'http://' + webBackUrl.UNBINDCARD + '/') {
                const navigator = this.props.navigator;
                if (navigator) {
                    for (let i = 0; i < navigator.getCurrentRoutes().length; i++) {
                        if (navigator.getCurrentRoutes()[i].name == 'MyAccountScene') {
                            navigator.popToRoute(navigator.getCurrentRoutes()[i]);
                            break;
                        }
                    }
                }
            } else if (oldUrl == 'http://' + webBackUrl.TRANSFER + '/' ||
                oldUrl == 'http://' + webBackUrl.WITHDRAWALS + '/') {
                const navigator = this.props.navigator;
                if (navigator) {
                    for (let i = 0; i < navigator.getCurrentRoutes().length; i++) {
                        if (navigator.getCurrentRoutes()[i].name == 'AccountScene') {
                            navigator.popToRoute(navigator.getCurrentRoutes()[i]);
                            break;
                        }
                    }
                }
            } else if (oldUrl == 'http://' + webBackUrl.PAY + '/') {
                //this.props.callBack();
                this.backPage();
            } else if(oldUrl=='http://' + webBackUrl.SUPERVICEPAY + '/'){
                const navigator = this.props.navigator;
                if (navigator) {
                    for (let i = 0; i < navigator.getCurrentRoutes().length; i++) {
                        if (navigator.getCurrentRoutes()[i].name == 'SupervisionFeeScene') {
                            navigator.popToRoute(navigator.getCurrentRoutes()[i]);
                            break;
                        }
                    }
                }
            }else{
                this.backPage();
            }
        }
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height, backgroundColor: fontAndColor.COLORA3}}>
                {this.loadView()}
                <NavigationView
                    title={this.props.title}
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
        height: Pixel.getPixel(10),

    },
    margin: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)

    },
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'}
})