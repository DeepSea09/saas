import React from 'react';
import {
    AppRegistry,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
    BackAndroid,
    InteractionManager,
    Text,
    AppState,
} from 'react-native';

import BaseComponent from '../component/BaseComponent';
import MyButton from '../component/MyButton';
let {height, width} = Dimensions.get('window');
import MainPage from './MainPage';
import LoginAndRegister from '../login/LoginAndRegister';
import StorageUtil from '../utils/StorageUtil';
import * as KeyNames from '../constant/storageKeyNames';
import WelcomScene from './WelcomScene';

import {request} from '../utils/RequestUtil';
import * as Urls from '../constant/appUrls';
import  UpLoadScene from './UpLoadScene';
import  PixelUtil from '../utils/PixelUtil'
var Pixel = new PixelUtil();
import codePush from 'react-native-code-push'
import SQLiteUtil from "../utils/SQLiteUtil";
import PromotionScene from "./PromotionScene";
const SQLite = new SQLiteUtil();
const versionCode = 34.0;
let canNext = true;
let Platform = require('Platform');
let deploymentKey = '';
import ErrorUtils from "ErrorUtils"
import UmengPush from 'react-native-umeng-push';
import YaoQingDeHaoLi from '../mine/setting/YaoQingDeHaoLi';
import LoginGesture from '../login/LoginGesture';
const IS_ANDROID = Platform.OS === 'android';

export default class RootScene extends BaseComponent {

    constructor(props) {
        super(props);
//获取DeviceToken
        UmengPush.getDeviceToken(deviceToken => {
            console.log('deviceToken', deviceToken)
        });

//接收到推送消息回调
        UmengPush.didReceiveMessage(message => {

        });

//点击推送消息打开应用回调
        UmengPush.didOpenMessage(message => {
            const navigator = this.props.navigator;
            if (navigator) {
                let toWeb = true;
                for (let i = 0; i < navigator.getCurrentRoutes().length; i++) {
                    if (navigator.getCurrentRoutes()[i].name == 'PromotionScene') {
                        toWeb = false;
                        break;
                    }
                }
                if (toWeb) {
                    StorageUtil.mGetItem(KeyNames.ISLOGIN, (res) => {
                        if (res.result == "true") {
                            let mProps = {
                                name: 'YaoQingDeHaoLi',
                                component: YaoQingDeHaoLi, params: {
                                    from: 'RootScene'
                                }
                            };
                            this.toNextPage(mProps);
                        } else {
                            try {
                                if (IS_ANDROID) {
                                    let mProps = {
                                        name: 'PromotionScene',
                                        component: PromotionScene, params: {
                                            webUrl: JSON.parse(message.extra).url,
                                            name: JSON.parse(message.extra).name
                                        }
                                    };
                                    this.toNextPage(mProps);
                                } else {
                                    let mProps = {
                                        name: 'PromotionScene',
                                        component: PromotionScene, params: {
                                            webUrl: message.url,
                                            name: message.name
                                        }
                                    };
                                    this.toNextPage(mProps);
                                }
                            } catch (e) {

                            }

                        }
                    });
                }

            }

            console.log(message);

        });
    }

    componentDidMount() {
        // codePush.sync();
        // AppState.addEventListener("change", (newState) => {
        //     newState === "active" && codePush.sync();
        // });


        StorageUtil.mSetItem(KeyNames.NEED_TOAST_ERROR, '');
        //如果获取模拟器错误日志，需将下面代码屏蔽！！！！！！！！！！！！！！！！！！！！！！！


        ErrorUtils.setGlobalHandler((e) => {　//发生异常的处理方法,当然如果是打包好的话可能你找都找不到是哪段代码出问题了
            this.props.showToast('' + e);
            StorageUtil.mGetItem(KeyNames.PHONE, (data) => {
                let maps = {
                    phone: data.result,
                    message: '' + e
                };
                request(Urls.ADDACCOUNTMESSAGEINFO, 'Post', maps)
                    .then((response) => {

                        },
                        (error) => {
                        });
            });

        });

        //如果获取模拟器错误日志，需将上面代码屏蔽！！！！！！！！！！！！！！！！！！！！！！！


        // if (Platform.OS === 'android') {
        //     deploymentKey = 'fSQnzvsEP5qb9jD_tr4k2QC9pKlie1b7b22b-ea3f-4c77-abcc-72586c814b3c';
        // } else {
        //     deploymentKey = 'TXKA_1RB5rKvXMOuBTMqPoon2c5Pe1b7b22b-ea3f-4c77-abcc-72586c814b3c';
        // }
        // codePush.checkForUpdate(deploymentKey).then((update) => {
        //     if (!update) {
        //     } else {
        //         codePush.sync({
        //             deploymentKey: deploymentKey,
        //             updateDialog: {
        //                 optionalIgnoreButtonLabel: '稍后',
        //                 optionalInstallButtonLabel: '立即更新',
        //                 optionalUpdateMessage: '请更新到最新版本',
        //                 title: '更新提示'
        //             },
        //             installMode: codePush.InstallMode.IMMEDIATE,
        //         }, (status) => {
        //             switch (status) {
        //                 case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        //                     break;
        //                 case codePush.SyncStatus.INSTALLING_UPDATE:
        //                     break;
        //             }
        //         }, (progress) => {
        //         });
        //     }
        // });
        try {
            BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
        } catch (e) {

        } finally {
            //InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: 'loading'});
            this.initFinish();
            //});
        }


    }

    /**
     *   初始化
     **/
    initFinish = () => {
        SQLite.createTable();
        let d = this.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
        StorageUtil.mSetItem(KeyNames.INTO_TIME, d);
        let maps = {
            type: '6',
            api: 'api/v1/App/Update'
        };
        request(Urls.APP_UPDATE, 'Post', maps)
            .then((response) => {
                    if (response.mjson.data.versioncode > versionCode) {
                        this.navigatorParams.component = UpLoadScene;
                        this.navigatorParams.params = {url: response.mjson.data.downloadurl}
                        this.toNextPage(this.navigatorParams);
                    } else {
                        this.toJump();
                    }
                },
                (error) => {
                    this.toJump();

                });
    }

    /**
     *
     * 跳转
     **/
    toJump = () => {
        StorageUtil.mSetItem(KeyNames.NEED_GESTURE, 'true');
        let that = this;
        StorageUtil.mGetItem(KeyNames.FIRST_INTO, (res) => {
            if (res.result == null) {
                that.navigatorParams.component = WelcomScene;
                that.navigatorParams.name = 'WelcomScene';
                that.toNextPage(that.navigatorParams);
            } else {
                StorageUtil.mGetItem(KeyNames.ISLOGIN, (res) => {
                    if (res.result !== StorageUtil.ERRORCODE) {
                        if (res.result == null) {
                            that.navigatorParams.component = LoginAndRegister;
                            that.navigatorParams.name = 'LoginAndRegister';
                            that.toNextPage(that.navigatorParams);
                        } else {
                            if (res.result == "true") {

                                StorageUtil.mGetItem(KeyNames.USER_INFO, (data) => {
                                    let datas = JSON.parse(data.result);
                                    if (datas.user_level == 2) {
                                        if (datas.enterprise_list == null || datas.enterprise_list.length <= 0) {
                                            that.navigatorParams.component = LoginAndRegister;
                                            that.navigatorParams.name = 'LoginAndRegister';
                                            that.toNextPage(that.navigatorParams);
                                        } else {
                                            that.navigatorParams.component = LoginGesture;
                                            that.navigatorParams.name = 'LoginGesture';
                                            that.navigatorParams.params = {from: 'RootScene'}
                                            that.toNextPage(that.navigatorParams);
                                        }
                                    } else {
                                        if (datas.enterprise_list == null || datas.enterprise_list.length <= 0) {
                                            that.navigatorParams.component = LoginAndRegister;
                                            that.navigatorParams.name = 'LoginAndRegister';
                                            that.toNextPage(that.navigatorParams);
                                        } else {
                                            that.navigatorParams.component = LoginGesture;
                                            that.navigatorParams.name = 'LoginGesture';
                                            that.navigatorParams.params = {from: 'RootScene'}
                                            that.toNextPage(that.navigatorParams);
                                        }
                                    }
                                });
                            } else {
                                that.navigatorParams.component = LoginAndRegister;
                                that.navigatorParams.name = 'LoginAndRegister';
                                that.toNextPage(that.navigatorParams);
                            }
                        }
                    }
                });
            }
        });
    }


//     onPress = () => {
//         if(canNext){
//             let that = this;
//             StorageUtil.mSetItem(KeyNames.NEED_GESTURE, 'true');
//             StorageUtil.mGetItem(KeyNames.FIRST_INTO, (res) => {
//                 if (res.result == null) {
//                     that.navigatorParams.component = WelcomScene;
//                     that.toNextPage(that.navigatorParams);
//                 } else {
//
//                     StorageUtil.mGetItem(KeyNames.ISLOGIN, (res) => {
//                         if (res.result !== StorageUtil.ERRORCODE) {
//                             if (res.result == null) {
//                                 that.navigatorParams.component = LoginAndRegister;
//                                 that.toNextPage(that.navigatorParams);
//                             } else {
//                                 if (res.result == "true") {
//
//                                     StorageUtil.mGetItem(KeyNames.USER_INFO, (data) => {
//                                         let datas = JSON.parse(data.result);
//                                         if (datas.user_level == 2) {
//                                             if (datas.enterprise_list == null || datas.enterprise_list.length <= 0) {
//                                                 that.navigatorParams.component = LoginAndRegister;
//                                                 that.toNextPage(that.navigatorParams);
//                                             } else {
//                                                 if (datas.enterprise_list[0].role_type == '2') {
//                                                     that.navigatorParams.component = LoginGesture;
//                                                     that.navigatorParams.params = {from: 'RootScene'}
//                                                     that.toNextPage(that.navigatorParams);
//                                                 } else {
//                                                     that.navigatorParams.component = MainPage;
//                                                     that.navigatorParams.params = {}
//                                                     that.toNextPage(that.navigatorParams);
//                                                 }
//                                             }
//                                         } else {
//                                             that.navigatorParams.component = MainPage;
//                                             that.navigatorParams.params = {}
//                                             that.toNextPage(that.navigatorParams);
//                                         }
//                                     });
//                                 } else {
//                                     that.navigatorParams.component = LoginAndRegister;
//                                     that.toNextPage(that.navigatorParams);
//                                 }
//                             }
//                         }
//                     });
//                 }
//             });
//             canNext=false;
//         }
//
//     // this.toNextPage(this.mProps)
// }

    onPress = () => {
        let that = this;
        StorageUtil.mSetItem(KeyNames.NEED_GESTURE, 'true');
        StorageUtil.mGetItem(KeyNames.FIRST_INTO, (res) => {
            if (res.result == null) {
                that.navigatorParams.component = WelcomScene;
                that.navigatorParams.name = 'WelcomScene';
                that.toNextPage(that.navigatorParams);
            } else {
                StorageUtil.mGetItem(KeyNames.ISLOGIN, (res) => {
                    if (res.result !== StorageUtil.ERRORCODE) {
                        if (res.result == null) {
                            that.navigatorParams.component = LoginAndRegister;
                            that.navigatorParams.name = 'LoginAndRegister';
                            that.toNextPage(that.navigatorParams);
                        } else {
                            if (res.result == "true") {

                                StorageUtil.mGetItem(KeyNames.USER_INFO, (data) => {
                                    let datas = JSON.parse(data.result);
                                    if (datas.user_level == 2) {
                                        if (datas.enterprise_list == null || datas.enterprise_list.length <= 0) {
                                            that.navigatorParams.component = LoginAndRegister;
                                            that.navigatorParams.name = 'LoginAndRegister';
                                            that.toNextPage(that.navigatorParams);
                                        } else {
                                            that.navigatorParams.component = LoginGesture;
                                            that.navigatorParams.name = 'LoginGesture';
                                            that.navigatorParams.params = {from: 'RootScene'}
                                            that.toNextPage(that.navigatorParams);
                                        }
                                    } else {
                                        if (datas.enterprise_list == null || datas.enterprise_list.length <= 0) {
                                            that.navigatorParams.component = LoginAndRegister;
                                            that.navigatorParams.name = 'LoginAndRegister';
                                            that.toNextPage(that.navigatorParams);
                                        } else {
                                            that.navigatorParams.component = LoginGesture;
                                            that.navigatorParams.name = 'LoginGesture';
                                            that.navigatorParams.params = {from: 'RootScene'}
                                            that.toNextPage(that.navigatorParams);
                                        }
                                    }
                                });
                            } else {
                                that.navigatorParams.component = LoginAndRegister;
                                that.navigatorParams.name = 'LoginAndRegister';
                                that.toNextPage(that.navigatorParams);
                            }
                        }
                    }
                });
            }
        });
        // this.toNextPage(this.mProps)
    }

    toNextPage = (mProps) => {
        const navigator = this.props.navigator;
        if (navigator) {
            navigator.replace({
                ...mProps
            })
        }
    }

    navigatorParams = {
        name: 'MainPage',
        component: MainPage,
        params: {}
    }

    buttonParams = {
        buttonType: MyButton.IMAGEBUTTON,
        parentStyle: styles.parentStyle,
        childStyle: styles.childStyle,
        opacity: 1,
        content: require("../../images/splash.png")
    }

    render() {
        // return (
        //     <Image style={{backgroundColor: '#00000000',alignItems:'flex-end',resizeMode:'stretch',flex:1,width:width}}
        //            source={require('../../images/splash.png')}>
        //
        //     </Image>
        // );
        // <TouchableOpacity onPress={()=>{this.onPress()}} activeOpacity={0.8} style={{width:Pixel.getPixel(30),height:Pixel.getPixel(30),borderRadius: 1000,justifyContent:'center',
        //         alignItems: 'center',backgroundColor: 'rgba(0,0,0,0.2)',marginRight: Pixel.getPixel(15),
        //         marginTop:Pixel.getTitlePixel(35)}}>
        //     <Text allowFontScaling={false} style={{color:'#fff',fontSize:Pixel.getFontPixel(12)}}>取消</Text>
        // </TouchableOpacity>
        return (<View></View>)
    }

    /**
     *   日期格式化
     **/
    dateFormat = (date, fmt) => {
        let o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
}

const styles = StyleSheet.create({
    parentStyle: {
        flex: 1
    },
    childStyle: {
        width: width,
        height: height
    },
});

