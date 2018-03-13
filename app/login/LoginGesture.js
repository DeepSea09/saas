import React, {Component} from "react";
import {
    AppRegistry,
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
    InteractionManager,
    TouchableWithoutFeedback,
    NativeModules
} from "react-native";
import PwdGesture from "../gesture/PwdGesture";
import BaseComponent from "../component/BaseComponent";
import PixelUtil from "../utils/PixelUtil";
import * as FontAndColor from "../constant/fontAndColor";
import NavigationBar from "../component/NavigationBar";
import StorageUtil from "../utils/StorageUtil";
import * as StorageKeyNames from "../constant/storageKeyNames";
import LoginScene from "./LoginScene";
import AllSelectCompanyScene from "../main/AllSelectCompanyScene";

let Pixel = new PixelUtil();
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
var Platform = require('Platform');
let Password = '';
export default class GesturePassword extends BaseComponent {
    constructor(props) {
        super(props);
        //初始化方法
        this.state = {
            renderPlaceholderOnly: true,
            message: '请绘制手势密码',
            status: 'normal',
            phone: '',
            url: '',
        }
    }

    initFinish = () => {
        StorageUtil.mGetItem(StorageKeyNames.PHONE, (data) => {
            if (data.code == 1) {
                if (data.result != null) {
                    StorageUtil.mGetItem(data.result + "", (datass) => {
                        if (datass.code == 1) {
                            if (datass.result != null) {
                                Password = datass.result;
                            } else {
                                Password = "";
                            }
                            StorageUtil.mGetItem(StorageKeyNames.HEAD_PORTRAIT_URL, (datas) => {
                                if (datas.code == 1) {
                                    if (datas.result != null) {
                                        this.setState({
                                            url: datas.result,
                                            renderPlaceholderOnly: false,
                                            phone: data.result,
                                        });
                                    }else{
                                        this.setState({
                                            renderPlaceholderOnly: false,
                                            phone: data.result,
                                        });
                                    }
                                }
                            })
                        }
                    })
                }
            }
        })
    }

    render() {
        if (this.state.renderPlaceholderOnly) {
            return ( <TouchableWithoutFeedback onPress={() => {
                this.setState({
                    show: false,
                });
            }}>
                <View style={{flex: 1, backgroundColor: FontAndColor.COLORA3}}>
                    <NavigationBar
                        leftImageShow={false}
                        leftTextShow={true}
                        leftText={""}
                        centerText={"解锁手势密码"}
                        rightText={""}/>
                </View>
            </TouchableWithoutFeedback>);
        }
        return (
            <PwdGesture
                ref='pg'
                NavigationBar={
                    <View style={styles.topStyle}>
                        <NavigationBar
                            leftImageShow={false}
                            leftTextShow={true}
                            centerText={"解锁手势密码"}
                            rightText={""}
                            leftText={""}
                            leftImage={require('./../../images/login/left_cancle.png')}
                            leftImageCallBack={this.backPage}/>

                        {this.state.url ? <Image style={styles.avatarStyle}
                                                 source={{uri: this.state.url}}/> :
                            <Image style={styles.avatarStyle}
                                   source={require("./../../images/mainImage/zhanghuguanli.png")}/>}

                        <Text allowFontScaling={false} style={ styles.topMessageStyle }>用户名：{this.state.phone}</Text>

                        <Text allowFontScaling={false}
                              style={this.state.status !== "wrong" ? styles.topMessageStyle : styles.topMessageWStyle}>
                            {this.state.message}
                        </Text>
                    </View>
                }
                Bottom={
                    <View style={{marginTop: Height / 2 * 0.95, flexDirection: 'row'}}>
                        <TouchableOpacity onPress={() => {
                            StorageUtil.mGetItem(StorageKeyNames.PHONE, (data) => {
                                if (data.code == 1) {
                                    if (data.result != null) {
                                        StorageUtil.mRemoveItem(data.result + "");
                                    }
                                }
                            })
                            StorageUtil.mSetItem(StorageKeyNames.ISLOGIN, 'false');
                            this.loginPage({name: 'LoginScene', component: LoginScene});
                        }}>
                            <Text allowFontScaling={false} style={styles.bottomLeftSytle}>忘记手势密码？</Text>
                        </TouchableOpacity>
                        <View style={{flex: 1}}/>
                        <TouchableOpacity onPress={() => {
                            StorageUtil.mSetItem(StorageKeyNames.ISLOGIN, 'false');
                            this.loginPage({name: 'LoginScene', component: LoginScene});
                        }}>
                            <Text allowFontScaling={false} style={styles.bottomRightSytle}>切换登录</Text>
                        </TouchableOpacity>
                    </View>
                }
                status={this.state.status}
                message={this.state.message}
                style={styles.gestureStyle}
                interval={500}
                onStart={() => this.onStart()}
                onEnd={(password) => this.onEnd(password)}/>
        );
    }

    loginPage = (mProps) => {
        const navigator = this.props.navigator;
        if (navigator) {
            navigator.immediatelyResetRouteStack([{
                ...mProps
            }])
        }
    }

    onEnd = (pwd) => {
        if (pwd == Password) {
            this.setState({
                status: 'right',
                message: '验证成功',
            });
            if (Platform.OS === 'android') {
                NativeModules.GrowingIOModule.setCS1("user_id", this.state.phone);
            }else {
               // NativeModules.growingSetCS1("user_id", this.state.phone);
            }
            StorageUtil.mSetItem(StorageKeyNames.NEED_GESTURE, 'false');
            StorageUtil.mGetItem(StorageKeyNames.USER_LEVEL, (data) => {
                if (data.code == 1) {
                    this.loginPage({name: 'AllSelectCompanyScene', component: AllSelectCompanyScene});
                }
            })
        } else {
            this.setState({
                status: 'wrong',
                message: '密码输入错误'
            });
        }
    }

    onStart() {
        this.setState({
            status: 'normal',
            message: '请绘制手势密码',
        });
    }
}

const styles = StyleSheet.create({
    gestureStyle: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: FontAndColor.COLORA3,
    },
    topStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: Width,
        paddingBottom: Pixel.getPixel(60),
    },
    topMessageStyle: {
        fontSize: Pixel.getFontPixel(17),
        color: FontAndColor.COLORA0,
    },
    topMessageWStyle: {
        fontSize: Pixel.getFontPixel(17),
        color: FontAndColor.COLORB2,
    },
    avatarStyle: {
        width: Pixel.getPixel(65),
        height: Pixel.getPixel(65),
        marginTop: Pixel.getPixel(20),
        marginBottom: Pixel.getPixel(37),
    },
    bottomLeftSytle: {
        fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT),
        color: FontAndColor.COLORA2,
        marginLeft: Pixel.getPixel(15),
    },
    bottomRightSytle: {
        fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT),
        color: FontAndColor.COLORA2,
        marginRight: Pixel.getPixel(15),
    },
});