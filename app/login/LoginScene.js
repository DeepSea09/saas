import React, {Component} from "react";
import {
    AppRegistry,
    View,
    Text,
    TouchableOpacity,
    ListView,
    StyleSheet,
    Image,
    PixelRatio,
    TouchableWithoutFeedback,
    InteractionManager,
    NativeModules,
    BackAndroid
} from "react-native";
import BaseComponent from "../component/BaseComponent";
import LoginInputText from "./component/LoginInputText";
import LoginAutoSearchInputText from "./component/LoginAutoSearchInputText";
import {request} from "../utils/RequestUtil";
import * as AppUrls from "../constant/appUrls";
import MainPage from "../main/MainPage";
// import LoginFail from "./LoginFail";
import * as FontAndColor from "../constant/fontAndColor";
import Register from "./Register";
import NavigationBar from "../component/NavigationBar";
import PixelUtil from "../utils/PixelUtil";
import StorageUtil from "../utils/StorageUtil";
import * as StorageKeyNames from "../constant/storageKeyNames";
import MyButton from "../component/MyButton";
import LoginFailSmsYes from "./LoginFailSmsYes";
import SetLoginPwdGesture from "./SetLoginPwdGesture";
import md5 from "react-native-md5";
import LoginGesture from "./LoginGesture";

var Pixel = new PixelUtil();
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var onePT = 1 / PixelRatio.get(); //一个像素
var itemWidth = width;
var imgSrc: '';
var imgSid: '';
var smsCode: '';
var userNames = [];
var Platform = require('Platform');
let androidPhoneVersion = '';
import ErrorBackToast from './component/ErrorBackToast';
export default class LoginScene extends BaseComponent {

    constructor(props) {
        super(props);
        //初始化方法
        this.state = {
            show: false,
            value: "",
            verifyCode: null,
            renderPlaceholderOnly: true,
        }
        this.needToast = '';
        this.props.showModal(false);
    }

    handleBack = () => {
        NativeModules.VinScan.goBack();
        return true;
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            NativeModules.VinScan.getPhoneVersion((verison) => {
                androidPhoneVersion = verison;
            });
        }
        try {
            BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
        } catch (e) {

        } finally {
            this.initFinish();
        }
    }

    initFinish = () => {
        StorageUtil.mGetItem(StorageKeyNames.USERNAME, (data) => {
            if (data.code == 1 && data.result != null) {
                userNames = data.result.split(",");
            }
        })
        StorageUtil.mGetItem(StorageKeyNames.NEED_TOAST_ERROR, (data) => {
            if (data.code == 1 && data.result != null) {
                this.needToast = data.result;
            }
            this.setState({renderPlaceholderOnly: false},()=>{
                this.Verifycode();
            });
        })
    }

    componentDidUpdate() {
        if (this.needToast != '') {
            StorageUtil.mSetItem(StorageKeyNames.NEED_TOAST_ERROR, '');
            this.refs.errorbacktoast.show(this.needToast);
            this.needToast = '';
        }
    }

    loginSuccess = {
        name: 'MainPage',
        component: MainPage,
        params: {}
    }

    setLoginGesture = {
        name: 'SetLoginPwdGesture',
        component: SetLoginPwdGesture,
        params: {
            from: 'login'
        }
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
                        centerText={"登录"}
                        rightText={""}
                    />
                </View>
            </TouchableWithoutFeedback>);
        }
        let views = [];
        if (userNames != null && userNames.length > 0) {
            for (let x in userNames) {
                if (x > 2) {
                    break;
                }
                views.push(
                    <Text allowFontScaling={false}
                          key={x}
                          style={styles.item}
                          onPress={this.hide.bind(this, userNames[x])}
                          numberOfLines={1}>
                        {userNames[x]}
                    </Text>
                );
            }
        }
        return (

            <TouchableWithoutFeedback onPress={() => {
                this.setState({
                    show: false,
                });
            }}>
                <View style={styles.container}>
                    <NavigationBar
                        leftImageShow={false}
                        leftTextShow={true}
                        centerText={"登录"}
                        rightText={"注册"}
                        leftTextCallBack={this.backPage}
                        rightTextCallBack={() => {
                            this.toNextPage({
                                name: 'Register',
                                component: Register,
                                params: {},
                            })
                        }}
                    />

                    <View style={styles.inputTextSytle}>
                        <LoginAutoSearchInputText
                            ref="loginUsername"
                            searchBtShow={true}
                            inputPlaceholder={"请输入用户名"}
                            itemStyel={[styles.itemStyel]}
                            keyboardType={'phone-pad'}
                            clearValue={true}
                            callBackSearchResult={(isShow) => {
                                if (isShow) {
                                    this.setState({
                                        show: true
                                    });
                                } else {
                                    this.setState({
                                        show: false
                                    });
                                }
                            }}/>

                        <LoginInputText
                            ref="loginPassword"
                            textPlaceholder={'请输入密码'}
                            rightIcon={false}
                            viewStytle={styles.itemStyel}
                            secureTextEntry={true}
                            clearValue={true}
                            maxLength={16}
                            leftIconUri={require('./../../images/login/password.png')}/>

                        <LoginInputText
                            ref="loginVerifycode"
                            textPlaceholder={'请输入验证码'}
                            viewStytle={styles.itemStyel}
                            leftIconUri={ require('./../../images/login/virty.png')}
                            rightIconClick={this.Verifycode}
                            keyboardType={'phone-pad'}
                            rightIconSource={this.state.verifyCode ? this.state.verifyCode : null}
                            rightIconStyle={{width: Pixel.getPixel(100), height: Pixel.getPixel(32)}}/>

                        <LoginInputText
                            ref="loginSmscode"
                            textPlaceholder={'请输入短信验证码'}
                            viewStytle={[styles.itemStyel, {borderBottomWidth: 0}]}
                            leftIconUri={require('./../../images/login/sms.png')}
                            rightIcon={false}
                            rightButton={true}
                            keyboardType={'phone-pad'}
                            callBackSms={this.Smscode}/>
                        {
                            //结果列表
                            (this.state.show && userNames.length > 0) ?
                                <View style={[styles.result]}>
                                    {views}
                                </View>
                                : null
                        }
                    </View>

                    <MyButton buttonType={MyButton.TEXTBUTTON}
                              content={'登录'}
                              parentStyle={styles.loginBtnStyle}
                              childStyle={styles.loginButtonTextStyle}
                              mOnPress={this.login}/>

                    <View style={styles.settingStyle}>
                        <View style={{flex: 1}}></View>
                        <TouchableOpacity onPress={() => {
                            this.toNextPage({
                                name: 'LoginFailSmsYes',
                                component: LoginFailSmsYes,
                                params: {},
                            })
                        }}>
                            <Text allowFontScaling={false} style={styles.bottomTestSytle}>登录遇到问题 ></Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{flex: 1}}/>

                    <Image source={require('./../../images/login/login_bg.png')}
                           style={{width: width, height: Pixel.getPixel(175)}}/>

                    {this.loadingView()}
                    <ErrorBackToast ref="errorbacktoast"/>
                </View>
            </TouchableWithoutFeedback>
        );

    }

    //隐藏 用户名输入框的搜索结果
    hide(val) {
        this.refs.loginUsername.setValue(val);
        this.setState({
            show: false,
            value: val
        });
    }

    //获取短信验证码
    Smscode = () => {
        let userName = this.refs.loginUsername.getInputTextValue();
        let verifyCode = this.refs.loginVerifycode.getInputTextValue();
        if (userName == "") {
            this.props.showToast("请输入正确的用户名");
        } else if (typeof(verifyCode) == "undefined" || verifyCode == "") {
            this.props.showToast("验证码不能为空");
        } else {
            let device_code = '';
            if (Platform.OS === 'android') {
                device_code = 'dycd_platform_android';
            } else {
                device_code = 'dycd_platform_ios';
            }
            let maps = {
                device_code: device_code,
                img_code: verifyCode,
                img_sid: imgSid,
                phone: userName,
                type: "2",
            };
            // this.props.showModal(true);
            this.setState({
                loading: true,
            });
            request(AppUrls.SEND_SMS, 'Post', maps)
                .then((response) => {
                    // this.props.showModal(false);
                    this.setState({
                        loading: false,
                    });
                    if (response.mycode == "1") {
                        this.refs.loginSmscode.StartCountDown();
                        // this.refs.loginSmscode.setInputTextValue(response.mjson.data.code + "");
                    } else {
                        this.props.showToast(response.mjson.msg + "");
                    }
                }, (error) => {
                    // this.props.showModal(false);
                    this.setState({
                        loading: false,
                    });
                    if (error.mycode == -300 || error.mycode == -500) {
                        this.props.showToast("获取验证码失败");
                    } else if (error.mycode == 7040012) {
                        this.Verifycode();
                        this.props.showToast(error.mjson.msg + "");
                    } else {
                        this.props.showToast(error.mjson.msg + "");
                    }
                });
        }
    }

    //获取图形验证码
    Verifycode = () => {
        this.refs.loginVerifycode.lodingStatus(true);
        let device_code = '';
        if (Platform.OS === 'android') {
            device_code = 'dycd_platform_android';
        } else {
            device_code = 'dycd_platform_ios';
        }
        let maps = {
            device_code: device_code,
        };
        request(AppUrls.IDENTIFYING, 'Post', maps)
            .then((response) => {
                this.refs.loginVerifycode.lodingStatus(false);
                imgSrc = response.mjson.data.img_src;
                imgSid = response.mjson.data.img_sid;

                this.setState({
                    verifyCode: {uri: imgSrc},
                });
            }, (error) => {
                this.refs.loginVerifycode.lodingStatus(false);
                this.setState({
                    verifyCode: null,
                });
                if (error.mycode == -300 || error.mycode == -500) {
                    this.props.showToast("获取失败");
                } else {
                    this.props.showToast(error.mjson.msg + "");
                }
            });
    }

    // 登录
    login = () => {
        let userName = this.refs.loginUsername.getInputTextValue();
        let passWord = this.refs.loginPassword.getInputTextValue();
        let verifyCode = this.refs.loginVerifycode.getInputTextValue();
        let smsCode = this.refs.loginSmscode.getInputTextValue();
        if (typeof(passWord) == "undefined" || userName == "" || userName.length != 11) {
            this.props.showToast("请输入正确的用户名");
        } else if (typeof(passWord) == "undefined" || passWord == "") {
            this.props.showToast("密码不能为空");
        } else if (passWord.length < 6) {
            this.props.showToast("密码必须为6~16位");
        } else if (typeof(verifyCode) == "undefined" || verifyCode == "") {
            this.props.showToast("验证码不能为空");
        } else if (typeof(smsCode) == "undefined" || smsCode == "") {
            this.props.showToast("短信验证码不能为空");
        } else {
            let device_code = '';
            let device_type = '';
            if (Platform.OS === 'android') {
                device_code = 'dycd_platform_android';
                device_type = androidPhoneVersion;
            } else {
                device_code = 'dycd_platform_ios';
                device_type = 'phoneVersion=' + phoneVersion + ',phoneModel='
                    + phoneModel + ',appVersion=' + appVersion;
            }
            console.log(device_type);
            let maps = {
                device_code: device_code,
                code: smsCode,
                login_type: "2",
                phone: userName,
                pwd: md5.hex_md5(passWord),
                device_type: device_type
            };
            // this.props.showModal(true);
            this.setState({
                loading: true,
            });
            request(AppUrls.LOGIN, 'Post', maps)
                .then((response) => {
                    try {
                        if (Platform.OS === 'android') {
                            NativeModules.GrowingIOModule.setCS1("user_id", userName);
                        } else {
                            // NativeModules.growingSetCS1("user_id", userName);
                        }
                        // this.props.showModal(false);
                        this.setState({
                            loading: false,
                        });
                        if (response.mjson.data.user_level == 2 || response.mjson.data.user_level == 1) {
                            if (response.mjson.data.enterprise_list == [] || response.mjson.data.enterprise_list == "") {
                                this.props.showToast("您的账号未绑定企业");
                            } else {
                                // 保存用户登录状态
                                StorageUtil.mSetItem(StorageKeyNames.LOGIN_TYPE, '2');
                                // 保存登录成功后的用户信息
                                StorageUtil.mGetItem(StorageKeyNames.USERNAME, (data) => {
                                    if (data.code == 1) {
                                        if (data.result == null || data.result == "") {
                                            StorageUtil.mSetItem(StorageKeyNames.USERNAME, userName);
                                        } else if (data.result.indexOf(userName) == -1) {
                                            StorageUtil.mSetItem(StorageKeyNames.USERNAME, userName + "," + data.result);
                                        } else if (data.result == userName) {
                                        } else {
                                            let names;
                                            if (data.result.indexOf(userName + ",") == -1) {
                                                if (data.result.indexOf("," + userName) == -1) {
                                                    names = data.result.replace(userName, "")
                                                } else {
                                                    names = data.result.replace("," + userName, "")
                                                }
                                            } else {
                                                names = data.result.replace(userName + ",", "")
                                            }
                                            StorageUtil.mSetItem(StorageKeyNames.USERNAME, userName + "," + names);
                                        }
                                    }
                                })

                                StorageUtil.mSetItem(StorageKeyNames.USER_INFO, JSON.stringify(response.mjson.data));
                                // 保存用户信息
                                StorageUtil.mSetItem(StorageKeyNames.BASE_USER_ID, response.mjson.data.base_user_id + "");
                                StorageUtil.mSetItem(StorageKeyNames.ENTERPRISE_LIST, JSON.stringify(response.mjson.data.enterprise_list));
                                StorageUtil.mSetItem(StorageKeyNames.HEAD_PORTRAIT_URL, response.mjson.data.head_portrait_url + "");
                                StorageUtil.mSetItem(StorageKeyNames.IDCARD_NUMBER, response.mjson.data.idcard_number + "");
                                StorageUtil.mSetItem(StorageKeyNames.PHONE, response.mjson.data.phone + "");
                                StorageUtil.mSetItem(StorageKeyNames.REAL_NAME, response.mjson.data.real_name + "");
                                StorageUtil.mSetItem(StorageKeyNames.TOKEN, response.mjson.data.token + "");
                                StorageUtil.mSetItem(StorageKeyNames.USER_LEVEL, response.mjson.data.user_level + "");
                                StorageUtil.mGetItem(response.mjson.data.phone + "", (data) => {
                                    if (data.code == 1) {
                                        if (data.result != null) {
                                            // if (response.mjson.data.user_level == 2) {
                                            //     if (response.mjson.data.enterprise_list[0].role_type == '2') {
                                            this.loginPage({
                                                name: 'LoginGesture',
                                                component: LoginGesture,
                                                params: {from: 'RootScene'}
                                            })
                                            //     } else {
                                            //         this.loginPage(this.loginSuccess)
                                            //     }
                                            // } else {
                                            //     this.loginPage(this.loginSuccess)
                                            // }
                                            StorageUtil.mSetItem(StorageKeyNames.ISLOGIN, 'true');
                                        } else {
                                            this.loginPage(this.setLoginGesture)
                                        }
                                    }
                                })
                            }
                        } else {
                            // 保存用户登录状态
                            StorageUtil.mSetItem(StorageKeyNames.LOGIN_TYPE, '2');
                            // 保存登录成功后的用户信息
                            StorageUtil.mGetItem(StorageKeyNames.USERNAME, (data) => {
                                if (data.code == 1) {
                                    if (data.result == null || data.result == "") {
                                        StorageUtil.mSetItem(StorageKeyNames.USERNAME, userName);
                                    } else if (data.result.indexOf(userName) == -1) {
                                        StorageUtil.mSetItem(StorageKeyNames.USERNAME, userName + "," + data.result);
                                    } else if (data.result == userName) {
                                    } else {
                                        let names;
                                        if (data.result.indexOf(userName + ",") == -1) {
                                            if (data.result.indexOf("," + userName) == -1) {
                                                names = data.result.replace(userName, "")
                                            } else {
                                                names = data.result.replace("," + userName, "")
                                            }
                                        } else {
                                            names = data.result.replace(userName + ",", "")
                                        }
                                        StorageUtil.mSetItem(StorageKeyNames.USERNAME, userName + "," + names);
                                    }
                                }
                            })

                            StorageUtil.mSetItem(StorageKeyNames.USER_INFO, JSON.stringify(response.mjson.data));
                            // 保存用户信息
                            StorageUtil.mSetItem(StorageKeyNames.BASE_USER_ID, response.mjson.data.base_user_id + "");
                            StorageUtil.mSetItem(StorageKeyNames.ENTERPRISE_LIST, JSON.stringify(response.mjson.data.enterprise_list));
                            StorageUtil.mSetItem(StorageKeyNames.HEAD_PORTRAIT_URL, response.mjson.data.head_portrait_url + "");
                            StorageUtil.mSetItem(StorageKeyNames.IDCARD_NUMBER, response.mjson.data.idcard_number + "");
                            StorageUtil.mSetItem(StorageKeyNames.PHONE, response.mjson.data.phone + "");
                            StorageUtil.mSetItem(StorageKeyNames.REAL_NAME, response.mjson.data.real_name + "");
                            StorageUtil.mSetItem(StorageKeyNames.TOKEN, response.mjson.data.token + "");
                            StorageUtil.mSetItem(StorageKeyNames.USER_LEVEL, response.mjson.data.user_level + "");
                            StorageUtil.mGetItem(response.mjson.data.phone + "", (data) => {
                                if (data.code == 1) {
                                    if (data.result != null) {
                                        // if (response.mjson.data.user_level == 2) {
                                        //     if (response.mjson.data.enterprise_list[0].role_type == '2') {
                                        this.loginPage({
                                            name: 'LoginGesture',
                                            component: LoginGesture,
                                            params: {from: 'RootScene'}
                                        })
                                        //     } else {
                                        //         this.loginPage(this.loginSuccess)
                                        //     }
                                        // } else {
                                        //     this.loginPage(this.loginSuccess)
                                        // }
                                        StorageUtil.mSetItem(StorageKeyNames.ISLOGIN, 'true');
                                    } else {
                                        this.loginPage(this.setLoginGesture)
                                    }
                                }
                            })
                        }
                    } catch (error) {
                        this.props.showToast('数据错误');
                    }

                }, (error) => {
                    // this.props.showModal(false);
                    this.setState({
                        loading: false,
                    });
                    if (error.mycode == -300 || error.mycode == -500) {
                        this.props.showToast("登录失败");
                    } else if (error.mycode == 7040004) {
                        this.Verifycode();
                        this.props.showToast(error.mjson.msg + "");
                    } else {
                        this.props.showToast(error.mjson.msg + "");
                    }
                    // 保存用户登录状态
                    StorageUtil.mSetItem(StorageKeyNames.ISLOGIN, 'false');
                });
        }
    }


    loginPage = (mProps) => {
        const navigator = this.props.navigator;
        if (navigator) {
            navigator.immediatelyResetRouteStack([{
                ...mProps
            }])
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: FontAndColor.COLORA3,
    },
    loginBtnStyle: {
        height: Pixel.getPixel(44),
        width: itemWidth - Pixel.getPixel(30),
        backgroundColor: FontAndColor.COLORB0,
        marginTop: Pixel.getPixel(30),
        marginBottom: Pixel.getPixel(15),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Pixel.getPixel(4),
    },
    loginButtonTextStyle: {
        color: FontAndColor.COLORA3,
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT)
    },
    settingStyle: {
        flexDirection: 'row',
        width: itemWidth,
    },
    itemStyel: {},
    bottomTestSytle: {
        fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT),
        color: FontAndColor.COLORA2,
        marginRight: Pixel.getPixel(15),
    },
    result: {
        borderWidth: onePT,
        borderColor: FontAndColor.COLORA4,
        position: 'absolute',
        width: itemWidth - Pixel.getPixel(30),
        top: Pixel.getPixel(44),
        left: Pixel.getPixel(15),
        backgroundColor: '#ffffff',
    },
    item: {
        fontSize: Pixel.getFontPixel(16),
        padding: Pixel.getPixel(5),
        paddingTop: Pixel.getPixel(10),
        paddingBottom: Pixel.getPixel(10),
        borderWidth: 0,
        borderColor: FontAndColor.COLORA4,
        borderBottomWidth: onePT,
    },
    inputTextSytle: {
        width: itemWidth,
        backgroundColor: '#ffffff',
        paddingLeft: Pixel.getPixel(15),
        paddingRight: Pixel.getPixel(15),
        marginTop: Pixel.getPixel(15),
        paddingBottom: 0,
    },
});