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
    TouchableWithoutFeedback
} from "react-native";
import BaseComponent from "../../component/BaseComponent";
import PixelUtil from "../../utils/PixelUtil";
import * as FontAndColor from "../../constant/fontAndColor";
import NavigationBar from "../../component/NavigationBar";
import SetPwd from "../../login/SetPwd";
import SetLoginPwdGesture from "../../login/SetLoginPwdGesture";
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";

var Pixel = new PixelUtil();
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
var onePT = 1 / PixelRatio.get(); //一个像素
export default class AccountSecurity extends BaseComponent {

    constructor(props) {
        super(props);
        //初始化方法
        this.state = {
            loginType: 0,
            renderPlaceholderOnly: true,
        }
    }

    initFinish = () => {
        //InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: false});
            // this.Verifycode();
        //});
        StorageUtil.mGetItem(StorageKeyNames.LOGIN_TYPE, (data) => {
            this.setState({
                loginType: data.result
            });
        });
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
                        centerText={"账户与安全"}
                        rightText={""}
                    />
                </View>
            </TouchableWithoutFeedback>);
        }
        return (
            <View style={styles.container}>
                <NavigationBar
                    leftImageShow={true}
                    leftTextShow={false}
                    centerText={"账户与安全"}
                    rightText={""}
                    leftImageCallBack={this.backPage}/>

                <TouchableOpacity onPress={() => {
                    this.toNextPage({
                        name: 'SetPwd',
                        component: SetPwd,
                        params: {},
                    })
                }}>
                    <View style={[styles.itemStyle, {marginTop: Pixel.getPixel(15)}]}>
                        <Text allowFontScaling={false}  style={styles.centerTextStyle}>修改密码</Text>
                        <Image source={require("./../../../images/mainImage/celljiantou.png")}
                               style={styles.rightImageStyle}/>
                    </View>
                </TouchableOpacity>

                <View style={{height: Pixel.getPixel(1), backgroundColor: FontAndColor.COLORA4}}/>

                <TouchableOpacity onPress={() => {
                    this.toNextPage({
                        name: 'SetLoginPwdGesture',
                        component: SetLoginPwdGesture,
                        params: {},
                    })
                }}>
                    <View style={styles.itemStyle}>
                        <Text allowFontScaling={false}  style={styles.centerTextStyle}>手势密码</Text>
                        <Image source={require("./../../../images/mainImage/celljiantou@3x.png")}
                               style={styles.rightImageStyle}/>
                    </View>
                </TouchableOpacity>

                <View style={{height: Pixel.getPixel(1), backgroundColor: FontAndColor.COLORA4}}/>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: FontAndColor.COLORA3,
    },
    itemStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: Width,
        height: Pixel.getPixel(44),
        backgroundColor: '#ffffff',
        paddingLeft: Pixel.getPixel(15),
    },
    leftImageStyle: {
        width: Pixel.getPixel(24),
        height: Pixel.getPixel(24),
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
});