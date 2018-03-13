import React, {Component} from "react";
import {
    AppRegistry,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    InteractionManager,
    ScrollView,
    Image,
    NativeModules
} from "react-native";
import BaseComponent from "../component/BaseComponent";
import NavigationBar from "../component/NavigationBar";
import * as FontAndColor from "../constant/fontAndColor";
import PixelUtil from "../utils/PixelUtil";
import LoginInputText from './component/LoginInputText';
import {request} from "../utils/RequestUtil";
import * as AppUrls from "../constant/appUrls";
import MyButton from "../component/MyButton";
import RecognizedGains from './RecognizedGains';
import NavigationView from '../component/AllNavigationView';
import ContractInfoScene from './ContractInfoScene';
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Pixel = new PixelUtil();
var Platform = require('Platform');

var imgSrc: '';
var imgSid: '';

var itemWidth = width;
let imeis = '';

export default class QuotaApplication extends BaseComponent {

    constructor(props) {
        super(props);
        imeis = '';
        if (Platform.OS === 'android') {
            NativeModules.VinScan.getIMEI((imei) => {
                imeis = imei;
            });
        }
        this.state = {
            renderPlaceholderOnly: 'blank',
            agree: false,
            name: "",
            idcard: "",
            phone: "",
            agreement: [],
            bankCard: '',
            bank_reserve_phone: ''
        };
    }

    initFinish = () => {
        this.getWZInfo();
    }

    render() {
        if (this.state.renderPlaceholderOnly != 'success') {
            return this._renderPlaceholderView();
        }
        let childitems = [];
        for (let i = 0; i < this.state.agreement.length; i++) {
            childitems.push(<Text allowFontScaling={false}  onPress={()=>{
                this.toNextPage({name:'ContractInfoScene',component:ContractInfoScene,params:{title:this.state.agreement[i].name,
                webUrl:this.state.agreement[i].url}});
            }} key={i+'a'} style={{color:FontAndColor.COLORA2,fontSize: Pixel.getFontPixel(12)}}>
                《{this.state.agreement[i].name}》 </Text>);
        }
        return (
            <View style={styles.containerStyle}>
                <ScrollView style={{marginTop:Pixel.getTitlePixel(79)}}>
                    <View style={styles.inputTextLine}/>
                    <View style={styles.inputTextsStyle}>
                        <View style={{
                            height: Pixel.getPixel(45),
                            borderBottomWidth: Pixel.getPixel(0.6),
                            borderColor: FontAndColor.COLORA4,
                            justifyContent: "center",
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <Text allowFontScaling={false} 
                                style={{color: FontAndColor.COLORA0, fontSize: Pixel.getPixel(14), flex: 1}}>借款人</Text>
                            <Text allowFontScaling={false} >{this.state.name}</Text>
                        </View>
                        <View style={{
                            height: Pixel.getPixel(45),
                            borderBottomWidth: Pixel.getPixel(0.6),
                            borderColor: FontAndColor.COLORA4,
                            justifyContent: "center",
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <Text allowFontScaling={false} 
                                style={{color: FontAndColor.COLORA0, fontSize: Pixel.getPixel(14), flex: 1}}>身份证号</Text>
                            <Text allowFontScaling={false} >{this.state.idcard}</Text>
                        </View>
                        <View style={{
                            height: Pixel.getPixel(45),
                            justifyContent: "center",
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <Text allowFontScaling={false} 
                                style={{color: FontAndColor.COLORA0, fontSize: Pixel.getPixel(14), flex: 1}}>联系电话</Text>
                            <Text allowFontScaling={false} >{this.state.phone}</Text>
                        </View>
                    </View>
                    <View style={styles.inputTextLine}/>
                    <View style={styles.inputTextsStyle}>
                        <LoginInputText
                            ref="bank_id"
                            textPlaceholder={'请输入银行卡号'}
                            leftText={'银行卡号'}
                            viewStytle={styles.itemStyel}
                            inputTextStyle={[styles.inputTextStyle, {textAlign: 'right'}]}
                            leftIcon={false}
                            rightIcon={false}/>
                        <LoginInputText
                            ref="bank_phone"
                            textPlaceholder={'请输入银行预留手机号'}
                            leftText={'银行预留手机号'}
                            viewStytle={[styles.itemStyel, {borderBottomWidth: 0}]}
                            inputTextStyle={[styles.inputTextStyle, {textAlign: 'right'}]}
                            leftIcon={false}
                            rightIcon={false}/>
                    </View>
                    <Text allowFontScaling={false}  style={{
                        color: FontAndColor.COLORA0,
                        paddingLeft: Pixel.getPixel(15),
                        paddingRight: Pixel.getPixel(15),
                        fontSize: Pixel.getPixel(FontAndColor.CONTENTFONT24),
                        paddingTop: Pixel.getPixel(10),
                        paddingBottom: Pixel.getPixel(10),
                    }}>注意：<Text allowFontScaling={false}  style={{color: FontAndColor.COLORA1}}>请确保银行预留手机号码准确,短信验证码将发送给您银行预留手机号码。</Text></Text>
                    <View style={styles.inputTextsStyle}>
                        <LoginInputText
                            ref="verifycode"
                            textPlaceholder={'请输入验证码'}
                            viewStytle={styles.itemStyel}
                            inputTextStyle={styles.inputTextStyle}
                            leftIcon={false}
                            keyboardType={'phone-pad'}
                            rightIconClick={this.Verifycode}
                            rightIconStyle={{width: Pixel.getPixel(100)}}
                            rightIconSource={this.state.verifyCode ? this.state.verifyCode : null}/>
                        <LoginInputText
                            ref="smsCode"
                            textPlaceholder={'请输入短信验证码'}
                            viewStytle={[styles.itemStyel, {borderBottomWidth: 0}]}
                            inputTextStyle={styles.inputTextStyle}
                            rightButton={true}
                            rightIcon={false}
                            callBackSms={this.sendSms}
                            keyboardType={'phone-pad'}
                            leftIcon={false}/>
                    </View>
                    <View style={{width:width,height:Pixel.getPixel(60)}}>

                        <Text allowFontScaling={false} 
                            style={{lineHeight: 25,paddingRight:Pixel.getPixel(15),paddingLeft:Pixel.getPixel(15),paddingTop:Pixel.getPixel(7)}}>
                            <Text allowFontScaling={false}  style={{color:FontAndColor.COLORA1,fontSize: Pixel.getFontPixel(12)}}>
                                {'         我已详细阅读并同意'}</Text>
                            {childitems}
                        </Text>
                        <TouchableOpacity style={{width:Pixel.getPixel(23),height:Pixel.getPixel(23),position: 'absolute',top: Pixel.getPixel(12),
                                    left:Pixel.getPixel(15),justifyContent:'center'}} onPress={()=>{
                            this.setState({
                                agree:!this.state.agree
                            });
                        }} activeOpacity={0.8}>
                            <Image style={{width:Pixel.getPixel(16),height:Pixel.getPixel(16)}}
                                   source={this.state.agree?require('../../images/login/amou_choose.png'):require('../../images/login/amou_unchoose.png')}/>
                        </TouchableOpacity>
                    </View>
                    <MyButton buttonType={MyButton.TEXTBUTTON}
                              content={'确认申请'}
                              parentStyle={styles.loginBtnStyle}
                              childStyle={styles.loginButtonTextStyle}
                              mOnPress={this.getWZMoney}/>
                </ScrollView>
                <NavigationView
                    title="微单额度申请"
                    backIconClick={this.backPage}
                />
            </View>
        );
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor:FontAndColor.COLORA3,alignItems: 'center'}}>
                {this.loadView()}
                <NavigationView
                    title="微单额度申请"
                    backIconClick={this.backPage}
                />
            </View>
        );
    }


    //获取图形验证码
    Verifycode = () => {
        this.refs.verifycode.lodingStatus(true);
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
                this.refs.verifycode.lodingStatus(false);
                imgSrc = response.mjson.data.img_src;
                imgSid = response.mjson.data.img_sid;

                this.setState({
                    verifyCode: {uri: imgSrc},
                });
            }, (error) => {
                this.refs.verifycode.lodingStatus(false);
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

    //获取短信验证码
    sendSms = () => {
        let userName = this.refs.bank_phone.getInputTextValue();
        let verifyCode = this.refs.verifycode.getInputTextValue();
        if (typeof(verifyCode) == "undefined" || verifyCode == "") {
            this.props.showToast("验证码不能为空");
        } else if (typeof(userName) == "undefined" || userName == "") {
            this.props.showToast("请输入手机号");
        } else {
            let maps = {
                api: AppUrls.GET_SMS_VERIFY_CODE,
                img_code: verifyCode,
                img_sid: imgSid,
                phone: userName,
                sms_type: "microchinese_mny_apply"
            };
            this.props.showModal(true);
            request(AppUrls.FINANCE, 'Post', maps)
                .then((response) => {
                    this.props.showModal(false);
                    if (response.mjson.code == "1") {
                        this.refs.smsCode.StartCountDown();
                        // this.refs.smsCode.setInputTextValue(response.mjson.data.code + "");
                    } else {
                        this.props.showToast(response.mjson.msg);
                    }
                }, (error) => {
                    this.props.showModal(false);
                    this.Verifycode();
                    if (error.mycode == -300 || error.mycode == -500) {
                        this.props.showToast("短信验证码获取失败");
                    } else if (error.mycode == 7040012) {
                        this.Verifycode();
                        this.props.showToast(error.mjson.msg + "");
                    } else {
                        this.props.showToast(error.mjson.msg + "");
                    }
                });
        }
    }


    componentDidUpdate() {
        if (this.state.renderPlaceholderOnly == 'success') {
            if (this.refs.bank_phone.getInputTextValue() == '') {
                this.refs.bank_phone.setInputTextValue(this.state.bank_reserve_phone);
            }
            if (this.refs.bank_id.getInputTextValue() == '') {
                this.refs.bank_id.setInputTextValue(this.state.bankCard);
            }
        }
    }

    //获取微众申请页面数据
    getWZInfo = () => {
        let maps = {
            api: AppUrls.GETAPPLYDATA,
        };
        request(AppUrls.FINANCE, 'Post', maps)
            .then((response) => {
                this.setState({
                    name: response.mjson.data.username,
                    idcard: response.mjson.data.idcard_number,
                    phone: response.mjson.data.phone,
                    agreement: response.mjson.data.agreement,
                    renderPlaceholderOnly: 'success',
                    bankCard: response.mjson.data.bank_card,
                    bank_reserve_phone: response.mjson.data.bank_reserve_phone
                });
                this.Verifycode();
            }, (error) => {
                this.setState({
                    renderPlaceholderOnly: 'error'
                });
                if (error.mycode == -300 || error.mycode == -500) {
                    this.props.showToast("获取失败");
                } else {
                    this.props.showToast(error.mjson.msg + "");
                }
            });
    }

    //微众额度申请
    getWZMoney = () => {
        let bank_phone = this.refs.bank_phone.getInputTextValue();
        let bank_id = this.refs.bank_id.getInputTextValue();
        let smsCode = this.refs.smsCode.getInputTextValue();
        if (typeof(bank_phone) == "undefined" || bank_phone == "" || bank_phone.length != 11) {
            this.props.showToast("请输入正确的手机号码");
        } else if (typeof(bank_id) == "undefined" || bank_id == "") {
            this.props.showToast("银行卡号不能为空");
        } else if (typeof(smsCode) == "undefined" || smsCode == "") {
            this.props.showToast("短信验证码不能为空");
        } else if (!this.state.agree) {
            this.props.showToast("请选择相关协议");
        } else {
            let maps = {};
            if (Platform.OS === 'android') {
                maps = {
                    api: AppUrls.APPLY_MNY,
                    bank_reserve_phone: bank_phone,
                    bank_card: bank_id,
                    phone_code: smsCode,
                    contract_base: JSON.stringify(this.state.agreement),
                    android_imei: imeis,
                    useragent: 'android'
                };
            } else {
                maps = {
                    api: AppUrls.APPLY_MNY,
                    bank_reserve_phone: bank_phone,
                    bank_card: bank_id,
                    phone_code: smsCode,
                    contract_base: JSON.stringify(this.state.agreement),
                    ios_idfa: iosIDFA,
                    useragent: 'ios'
                };
            }
            this.props.showModal(true);
            request(AppUrls.FINANCE, 'Post', maps)
                .then((response) => {
                    this.props.showModal(false);
                    this.props.showToast("申请成功");
                    this.props.callBack();
                    this.backPage();
                }, (error) => {
                    if (error.mycode == -300 || error.mycode == -500) {
                        this.props.showToast("申请失败");
                    } else {
                        this.props.showToast(error.mjson.msg + "");
                        // this.backPage()
                        // this.toNextPage({
                        //     name: 'RecognizedGains',
                        //     component: RecognizedGains,
                        //     params: {loan_code: '1234566'},
                        // })
                    }
                });
        }
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        backgroundColor: FontAndColor.COLORA3
    },
    container: {
        flex: 1,
        marginTop: Pixel.getPixel(0),   //设置listView 顶在最上面
        backgroundColor: FontAndColor.COLORA4,
    },
    itemStyel: {},
    inputTextStyle: {
        backgroundColor: '#ffffff',
        paddingLeft: 0,
        paddingRight: 0,
        margin: 0,
    },
    inputTextLine: {
        backgroundColor: FontAndColor.COLORA3,
        height: Pixel.getPixel(10),
        width: width,
    },
    inputTextsStyle: {
        backgroundColor: '#ffffff',
        paddingLeft: Pixel.getPixel(15),
        paddingRight: Pixel.getPixel(15),
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
        alignSelf: 'center'
    },
    loginButtonTextStyle: {
        color: FontAndColor.COLORA3,
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT)
    },
});