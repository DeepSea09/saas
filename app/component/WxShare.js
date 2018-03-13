import React, {
    Component,
    PropTypes
} from 'react';

import {
    StyleSheet,
    View,
    Dimensions,
    Text,
    Animated,
    TouchableHighlight,
    Image,
    Modal,
} from 'react-native';
const shareIconWechat = require('./../../images/share_icon_wechat.png');
const shareIconMoments = require('./../../images/share_icon_moments.png');
import toast from '././toast/Toast';
import * as WeChat from 'react-native-wechat';
export  default class ShareSpanner extends Component {
    constructor(props) {
        super(props);
        //应用注册
        this.state = {
            show: false,
        };
    }

    // 显示/隐藏 modal
    setModalVisible() {
        let isShow = this.state.show;
        this.setState({
            show: !isShow,
        });
    }

    render() {
        return (
            <Modal
                animationType='fade'
                transparent={true}
                visible={this.state.show}
                onShow={() => {
                }}
                onRequestClose={() => {
                }}>

                <View style={styles.modalStyle}>
                    <View style={styles.subView}>
                        <TouchableHighlight onPress={() => {
                            this.setModalVisible()
                            WeChat.isWXAppInstalled()
                                .then((isInstalled) => {
                                    if (isInstalled) {
                                        WeChat.shareToSession({
                                            title: '微信好友测试链接',
                                            description: '分享自:江清清的技术专栏(www.lcode.org)',
                                            thumbImage: 'http://mta.zttit.com:8080/images/ZTT_1404756641470_image.jpg',
                                            type: 'news',
                                            webpageUrl: 'http://www.lcode.org'
                                        })
                                            .catch((error) => {
                                                {/*toast(error.message);*/}
                                            });
                                    } else {
                                        {/*toast('没有安装微信软件，请您安装微信之后再试');*/}
                                    }
                                });
                        }}>
                            <View style={styles.shareContent}>
                                <Image
                                    style={styles.shareIcon}
                                    source={shareIconWechat}
                                />
                                <Text allowFontScaling={false}  style={styles.spinnerTitle}>
                                    分享给微信好友
                                </Text>
                            </View>
                        </TouchableHighlight>
                        <View style={styles.horizontalLine}/>

                        <TouchableHighlight onPress={() => {
                            this.setModalVisible()
                            {
                                WeChat.isWXAppInstalled()
                                    .then((isInstalled) => {
                                        if (isInstalled) {
                                            WeChat.shareToTimeline({
                                                title: '微信朋友圈测试链接',
                                                description: '分享自:江清清的技术专栏(www.lcode.org)',
                                                thumbImage: 'http://mta.zttit.com:8080/images/ZTT_1404756641470_image.jpg',
                                                type: 'news',
                                                webpageUrl: 'http://www.lcode.org'
                                            })
                                                .catch((error) => {
                                                    {/*Toast(error.message);*/}
                                                });
                                        } else {
                                            {/*toastShort('没有安装微信软件，请您安装微信之后再试');*/}
                                        }
                                    });
                            }
                        }}>
                            <View style={styles.shareContent}>
                                <Image
                                    style={styles.shareIcon}
                                    source={shareIconMoments}
                                />
                                <Text allowFontScaling={false}  style={styles.spinnerTitle}>
                                    分享到朋友圈
                                </Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>

        );
    }
}

const styles = StyleSheet.create({
    // modal的样式
    modalStyle: {
        // backgroundColor:'#ccc',
        flex: 1,
    },
    // modal上子View的样式
    subView: {
        width: 130,
        height: 140,
        backgroundColor: '#fff',
        alignSelf: 'stretch',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 0.5,
        paddingTop: 5,
        borderColor: '#ccc',
    },
    // 水平的分割线
    horizontalLine: {
        marginTop: 5,
        marginBottom: 5,
        height: 0.5,
        backgroundColor: '#ccc',
    },
    spinnerTitle: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 2
    },
    shareContent: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    shareIcon: {
        width: 35,
        height: 35
    }
});