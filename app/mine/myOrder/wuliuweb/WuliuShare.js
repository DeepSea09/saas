import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    Image,
    TouchableOpacity,
    Dimensions,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    ScrollView,
    NativeModules,
    Platform
} from 'react-native';

import BaseComponent from '../../../component/BaseComponent';
import *as fontAndColor from '../../../constant/fontAndColor';
import PixelUtil from '../../../utils/PixelUtil';
import *as AppUrls from '../../../constant/appUrls';
import *as weChat from 'react-native-wechat';
import * as Net from '../../../utils/RequestUtil';
import StorageUtil from "../../../utils/StorageUtil";
let resolveAssetSource = require('resolveAssetSource');
import * as StorageKeyNames from "../../../constant/storageKeyNames";

const Pixel = new PixelUtil();
const ScreenWidth = Dimensions.get('window').width;
const IS_ANDROID = Platform.OS === 'android';
const title ='安和御鑫物流服务平台';
const content ='您身边的整车散车物流专家';
export default class SharedView extends BaseComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.webpageUrl=this.props.webpageUrl;
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
    sharedWechatSession = (shareData) => {
        weChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {

                    let imageResource = require('../../../../images/wuliu_share_content_icon.png');
                    let fenxiangUrl = '';
                    if (AppUrls.BASEURL == 'http://api-gateway.test.dycd.com/') {
                        fenxiangUrl = AppUrls.FENXIANGTEST;
                    } else {
                        fenxiangUrl = AppUrls.FENXIANGOPEN;
                    }
                    let carImage = resolveAssetSource(imageResource).uri;
                    weChat.shareToSession({
                        type: 'news',
                        title: title,
                        description: content,
                        webpageUrl: this.webpageUrl,
                        thumbImage: carImage,

                    }).then((resp) => {

                        // this.sharedSucceedAction();
                        console.log('分享成功');

                    }, (error) => {
                        console.log('分享失败');

                    })
                } else {
                    this.isVisible(false);
                }
            });


    }

    // 分享朋友圈
    sharedWechatTimeline = (shareData) => {
        weChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    let imageResource = require('../../../../images/wuliu_share_content_icon.png');
                    let fenxiangUrl = '';
                    if (AppUrls.BASEURL == 'http://api-gateway.test.dycd.com/') {
                        fenxiangUrl = AppUrls.FENXIANGTEST;
                    } else {
                        fenxiangUrl = AppUrls.FENXIANGOPEN;
                    }
                    let carImage = resolveAssetSource(imageResource).uri;
                    weChat.shareToTimeline({
                        type: 'news',
                        title: title,
                        description: content,
                        webpageUrl: this.webpageUrl,
                        thumbImage: carImage,

                    }).then((resp) => {

                        // this.sharedSucceedAction();
                        console.log('分享成功');

                    }, (error) => {
                        console.log('分享失败');

                    })

                } else {
                    this.isVisible(false);
                }
            });

    }

    sharedSucceedAction = () => {

        StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data) => {
            if (data.code == 1) {
                if (data.result != null && data.result != "") {
                    let userData = JSON.parse(data.result);
                    let userPhone = userData.phone + global.companyBaseID;
                    request(AppUrls.CAR_CHESHANG_SHARE_MOMENT_COUNT, 'POST', {
                        mobile: userPhone
                    }).then((response) => {
                    }, (error) => {
                    });

                } else {
                    this.setState({
                        renderPlaceholderOnly: 'error'
                    });
                }

            } else {
                this.setState({
                    renderPlaceholderOnly: 'error'
                });
            }
        })
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
                        <View style={{flexDirection: 'row', paddingVertical: Pixel.getPixel(15)}}>
                            <TouchableOpacity style={styles.sharedItemView} onPress={() => {
                                this.sharedWechatSession(this.props.shareData);
                                this.isVisible(false);
                            }}>
                                <View style={styles.sharedImageBack}>
                                    <Image source={require('../../../../images/carSourceImages/shared_wx.png')}/>
                                </View>
                                <Text allowFontScaling={false} style={styles.sharedText}>微信好友</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.sharedItemView} onPress={() => {
                                this.sharedWechatTimeline(this.props.shareData);
                                this.isVisible(false);
                            }}>
                                <View style={styles.sharedImageBack}>
                                    <Image source={require('../../../../images/carSourceImages/shared_friend.png')}/>
                                </View>
                                <Text allowFontScaling={false} style={styles.sharedText}>朋友圈</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderTopWidth: Pixel.getPixel(1),
                            borderTopColor: fontAndColor.COLORA3,
                            height: Pixel.getPixel(44),
                            width: ScreenWidth
                        }}>
                            <Text style={styles.sharedViewHeadText}>取消</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>

        )
    }

}

const styles = StyleSheet.create({

    sharedContaier: {

        flex: 1,
        backgroundColor: 'rgba(1,1,1,0.5)',
    },
    sharedView: {
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
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
    sharedViewHeadText: {

        color: fontAndColor.COLORA1,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
    },
    sharedImageBack: {
        backgroundColor: fontAndColor.COLORB9,
        borderRadius: Pixel.getPixel(10),
        width: Pixel.getPixel(50),
        height: Pixel.getPixel(50),
        justifyContent: 'center',
        alignItems: 'center'
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
        color: fontAndColor.COLORA1,
        textAlign: 'center',
        marginTop: Pixel.getPixel(10),
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
    },
})