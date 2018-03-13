import React, {Component} from "react";
import {
    AppRegistry,
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    PixelRatio,
    TouchableOpacity,
    InteractionManager,
    TouchableWithoutFeedback,
    NativeModules,
    Modal,
    TextInput,
    WebView
} from "react-native";
import BaseComponent from "../../component/BaseComponent";
import PixelUtil from "../../utils/PixelUtil";
import * as FontAndColor from "../../constant/fontAndColor";
import NavigationBar from "../../component/NavigationBar";
import *as weChat from 'react-native-wechat';
import WebViewTitle from './../../mine/accountManage/component/WebViewTitle'
import RootScene from "../../main/RootScene";

var Pixel = new PixelUtil();
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
var onePT = 1 / PixelRatio.get(); //一个像素
var Platform = require('Platform');
var ScreenWidth = Dimensions.get('window').width;
import {request} from "../../utils/RequestUtil";
import * as AppUrls from "../../constant/appUrls";
var Platform = require('Platform');

import * as storageKeyNames from '../../constant/storageKeyNames';
import StorageUtil from '../../utils/StorageUtil';


title = '';
description = '';
webpageUrl = '';
thumbImage = '';
enterprise_id = '';
user_id = '';
export default class YaoQingDeHaoLi extends BaseComponent {
    constructor(props) {
        super(props);
        this.btnFlat = 0;
        this.state = {
            renderPlaceholderOnly: 'blank',
            url: ""
        }
    }

    backPage = () => {
        if (this.props.from == 'RootScene') {
            this.toNextPage({
                name: 'RootScene',
                component: RootScene
            });
        } else {
            const navigator = this.props.navigator;
            if (navigator) {
                navigator.pop();
            }
        }
    }

    toNextPage = (mProps) => {
        const navigator = this.props.navigator;
        if (navigator) {
            navigator.replace({
                ...mProps
            })
        }
    }

    initFinish = () => {
        // InteractionManager.runAfterInteractions(() => {
        //
        // });
        StorageUtil.mGetItem(storageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1) {
                let datas = JSON.parse(data.result);
                enterprise_id = datas.company_base_id;
                StorageUtil.mGetItem(storageKeyNames.BASE_USER_ID, (data) => {
                    if (data.code == 1) {
                        user_id = data.result;
                        this.getData();
                    }
                });
            }
        });
    }


    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return ( <TouchableWithoutFeedback onPress={() => {
                this.setState({
                    show: false,
                });
            }}>
                <View style={{width: Width, height: Height,backgroundColor: FontAndColor.COLORA3}}>
                    <View style={{width: Width,height: Pixel.getPixel(45), backgroundColor: FontAndColor.COLORA3}}>
                        <View style={styles.container}>
                            <TouchableOpacity onPress={
                    this.backPage
                }>
                                <Image source={require("./../../../images/carSourceImages/back.png")}
                                       style={styles.leftImageStyle}/>
                            </TouchableOpacity>
                            <View style={{flex:1}}></View>
                            {/*<TouchableOpacity onPress={*/}
                            {/*this.showShared*/}
                            {/*}>*/}
                            <Image source={require("./../../../images/carSourceImages/newfx.png")}
                                   style={styles.leftImageStyle}/>
                            {/*</TouchableOpacity>*/}

                        </View>
                        <View style={{flex: 1}}/>
                    </View>
                    {this.loadView()}
                </View>
            </TouchableWithoutFeedback>);
        }
        return (
            <View style={{flexDirection:'column',flex:1, backgroundColor: FontAndColor.COLORA3,}}>
                <View style={{flex:1,flexDirection:'column',  position: 'absolute'}}>
                    {/*<WebViewTitle ref="webviewtitle"/>*/}
                    <WebView
                        ref="www"
                        style={{width:Width,height:Height,backgroundColor:FontAndColor.COLORA3}}
                        source={{uri:this.state.url,method: 'GET'}}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        scalesPageToFit={false}
                        onLoadStart={()=>{
                            if(this.btnFlat === 0){
                                this.setState({
                                    loading: true,
                                });
                            }

                    }}
                        onLoadEnd={
                            ()=>{
                                this.btnFlat = this.btnFlat + 1;
                            this.setState({
                                loading: false,
                            });
                         {/*this.refs.webviewtitle.lastProgress();*/}
                    }}
                        onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                        onMessage={this._onReceiveMessage}
                    />
                </View>
                <View style={styles.container}>
                    <TouchableOpacity onPress={
                    this.backPage
                }>
                        <Image source={require("./../../../images/carSourceImages/back.png")}
                               style={styles.leftImageStyle}/>
                    </TouchableOpacity>
                    <View style={{flex:1}}></View>
                    <TouchableOpacity onPress={
                    this.showShared
                }>
                        <Image source={require("./../../../images/carSourceImages/newfx.png")}
                               style={styles.leftImageStyle}/>
                    </TouchableOpacity>

                </View>
                <SharedView ref="sharedView" carData={this.state.carData}/>
                {this.loadingView()}
            </View>
        );
    }

    onNavigationStateChange = (navState) => {

    }

    _onReceiveMessage = (evt)=>{
        this.showShared();
    };
    // this.toNextPage({
    //     name: 'AbountPlatform',
    //     component: AbountPlatform,
    //     params: {},
    // })
    // 打开分享
    showShared = () => {
        this.refs.sharedView.isVisible(true);
    }

    //获取数据
    getData = () => {
        this.setState({
            renderPlaceholderOnly: 'loading'
        });
        let device_code = '';
        if (Platform.OS === 'android') {
            device_code = 'dycd_platform_android';
        } else {
            device_code = 'dycd_platform_ios';
        }
        let maps = {
            device_code: device_code,
        };
        request(AppUrls.INVITE_SHARE, 'Post', maps)
            .then((response) => {
                this.setState({
                    renderPlaceholderOnly: 'success',
                    url: response.mjson.data.activity_invite_url /*'https://www.baidu.com'*/ + '?enterprise_id=' + enterprise_id + '&user_id=' + user_id,
                });
                title = response.mjson.data.head_copy;
                description = response.mjson.data.second_copy;
                webpageUrl = response.mjson.data.activity_identify_url + '?enterprise_id=' + enterprise_id + '&user_id=' + user_id;
                thumbImage = response.mjson.data.icon_img;
            }, (error) => {
                this.setState({renderPlaceholderOnly: 'error'});
                if (error.mycode == -300 || error.mycode == -500) {
                    this.props.showToast("获取失败");
                } else {
                    this.props.showToast(error.mjson.msg + "");
                }
            });
    }
}

class SharedView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isVisible: false,
        };
    }

    isVisible = (visible) => {

        this.setState({
            isVisible: visible,
        });
    }

    // 分享好友
    sharedWechatSession = (carData) => {
        this.shareCount();
        weChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    weChat.shareToSession({
                        type: 'news',
                        title: title,
                        description: description,
                        webpageUrl: webpageUrl,
                        thumbImage: thumbImage,

                    }).catch((error) => {
                    })
                } else {
                    this.isVisible(false);
                }
            });
    }

    // 分享朋友圈
    sharedWechatTimeline = (carData) => {
        this.shareCount();
        weChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    weChat.shareToTimeline({
                        type: 'news',
                        title: title,
                        description: description,
                        webpageUrl: webpageUrl,
                        thumbImage: thumbImage,

                    }).catch((error) => {
                    })
                } else {
                    this.isVisible(false);
                }
            });
    }


    //分享次数
    shareCount = () => {
        let device_code = '';
        if (Platform.OS === 'android') {
            device_code = 'dycd_platform_android';
        } else {
            device_code = 'dycd_platform_ios';
        }
        let maps = {
            device_code: device_code,
            enterprise_id: enterprise_id,
            user_id: user_id,
        };
        request(AppUrls.INVITE_SHARECOUNT, 'Post', maps)
            .then((response) => {

            }, (error) => {

            });
    }

    render() {

        return (
            <Modal
                visible={this.state.isVisible}
                transparent={true}
                onRequestClose={() => {
                    this.isVisible(false)
                }}
                animationType={'fade'}>
                <TouchableOpacity style={styles.sharedContaier} onPress={() => {
                    this.isVisible(false)
                }}>
                    <View style={styles.sharedView}>
                        <View style={styles.sharedViewHead}>
                            <Text allowFontScaling={false} style={styles.sharedViewHeadText}>分享到</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity style={styles.sharedItemView} onPress={() => {
                                this.sharedWechatSession(this.props.carData);
                                this.isVisible(false);
                            }}>
                                <Image source={require('../../../images/carSourceImages/shared_wx.png')}/>
                                <Text allowFontScaling={false} style={styles.sharedText}>微信好友</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.sharedItemView} onPress={() => {
                                this.sharedWechatTimeline(this.props.carData);
                                this.isVisible(false);
                            }}>
                                <Image source={require('../../../images/carSourceImages/shared_friend.png')}/>
                                <Text allowFontScaling={false} style={styles.sharedText}>朋友圈</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>

        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingTop: Pixel.getPixel(15)

    },
    itemStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: Width,
        height: Pixel.getPixel(44),
        backgroundColor: '#ffffff'
    },
    leftImageStyle: {
        width: Pixel.getPixel(30),
        height: Pixel.getPixel(30),
        marginLeft: Pixel.getPixel(15),
        marginRight: Pixel.getPixel(15),
    },
    centerTextStyle: {
        flex: 1,
        color: FontAndColor.COLORA0,
        fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT),
    },
    rightImageStyle: {
        width: Pixel.getPixel(14),
        height: Pixel.getPixel(14),
        marginLeft: Pixel.getPixel(15),
        marginRight: Pixel.getPixel(15),
    },
    loginBtnStyle: {
        height: Pixel.getPixel(44),
        width: Width - Pixel.getPixel(30),
        backgroundColor: FontAndColor.COLORB0,
        marginTop: Pixel.getPixel(30),
        marginBottom: Pixel.getPixel(30),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Pixel.getPixel(4),
    },
    loginButtonTextStyle: {
        color: FontAndColor.COLORA3,
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT)
    },
    sharedItemView: {

        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: Pixel.getPixel(20),
        marginRight: Pixel.getPixel(20),
        marginTop: Pixel.getPixel(10),
        marginBottom: Pixel.getPixel(10),
    },
    sharedText: {
        color: FontAndColor.COLORA1,
        textAlign: 'center',
        marginTop: Pixel.getPixel(10),
        fontSize: Pixel.getFontPixel(FontAndColor.CONTENTFONT24),
    },
    sharedContaier: {
        flex: 1,
        backgroundColor: 'rgba(1,1,1,0.5)',
    },
    sharedView: {
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: FontAndColor.COLORA3,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    sharedViewHead: {
        height: Pixel.getPixel(44),
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: ScreenWidth
    },
});