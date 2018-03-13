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
    KeyboardAvoidingView,
    Linking,
    TouchableWithoutFeedback
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../constant/fontAndColor';
import BaseComponent from '../../component/BaseComponent';
import NavigationView from '../../component/AllNavigationView';
import LoginInputText from "../../login/component/LoginInputText";
import {request} from '../../utils/RequestUtil';
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";
import * as webBackUrl from "../../constant/webBackUrl";
import * as Urls from '../../constant/appUrls';
import AccountWebScene from './AccountWebScene';
export  default class OpenIndividualAccountScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            renderPlaceholderOnly: 'blank',
        };
    }

    initFinish = () => {

        StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data)=>{
            if (data.code ==1){

                let userData = JSON.parse(data.result);

                StorageUtil.mGetItem( String(userData['base_user_id']+StorageKeyNames.HF_INDICATIVE_LAYER) ,(subData)=>{

                    if (subData.code == 1){
                        let obj = JSON.parse(subData.result);

                        if(obj == null){
                            obj = {};
                        }
                        if(obj[StorageKeyNames.HF_OPEN_INDIVIDUAL] == null ){

                            obj[StorageKeyNames.HF_OPEN_INDIVIDUAL] = false;

                            StorageUtil.mSetItem(String(userData['base_user_id']+StorageKeyNames.HF_INDICATIVE_LAYER), JSON.stringify(obj), ()=>{

                            })
                        }
                        this.setState({
                            renderPlaceholderOnly: 'success',
                            mbXzKtgrzh: obj[StorageKeyNames.HF_OPEN_INDIVIDUAL],
                        })
                    }

                })

            }
        })

    }

    backPage = () => {
        let navigator = this.props.navigator;
        if (navigator) {
            for (let i = 0; i < navigator.getCurrentRoutes().length; i++) {
                if (navigator.getCurrentRoutes()[i].name == 'MyAccountScene') {
                    navigator.popToRoute(navigator.getCurrentRoutes()[i]);
                    break;
                }
            }
        }
    }

    onLayerPress = ()=>{

        StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data)=>{
            if (data.code ==1){

                let userData = JSON.parse(data.result);

                StorageUtil.mGetItem( String(userData['base_user_id']+StorageKeyNames.HF_INDICATIVE_LAYER) ,(subData)=>{

                    if (subData.code == 1){
                        let obj = JSON.parse(subData.result);

                        obj[StorageKeyNames.HF_OPEN_INDIVIDUAL] = true;

                        StorageUtil.mSetItem(String(userData['base_user_id']+StorageKeyNames.HF_INDICATIVE_LAYER), obj, ()=>{})

                        this.state({
                            mbXzKtgrzh: obj[StorageKeyNames.HF_OPEN_INDIVIDUAL],
                        })
                    }

                })
            }
        })
    }


    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        }
        return (
            <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1}}>
                <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={5}>
                    <View style={styles.inputTextsStyle}>
                        <LoginInputText
                            ref="name"
                            textPlaceholder={'请输入真实姓名'}
                            viewStytle={styles.itemStyel}
                            inputTextStyle={styles.inputTextStyle}
                            leftIcon={false}
                            import={false}
                            clearValue={true}
                            rightIcon={false}/>
                        <LoginInputText
                            ref="number"
                            textPlaceholder={'请输入身份证号码'}
                            viewStytle={[styles.itemStyel, {borderBottomWidth: 0}]}
                            inputTextStyle={styles.inputTextStyle}

                            leftIcon={false}
                            import={false}
                            clearValue={true}
                            rightIcon={false}/>
                    </View>
                </KeyboardAvoidingView>

                <Text allowFontScaling={false} style={{color: fontAndColor.COLORA1,fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                marginTop:Pixel.getPixel(20),marginLeft:Pixel.getPixel(15)}}>
                    请确认您的姓名与身份证信息填写准确
                </Text>

                <TouchableOpacity onPress={()=>{
                    this.checkEmpty();
                }} activeOpacity={0.8} style={{backgroundColor:fontAndColor.COLORB0,marginTop:Pixel.getPixel(15),
                width:width-Pixel.getPixel(30),marginLeft:Pixel.getPixel(15),marginRight:Pixel.getPixel(15),
                height:Pixel.getPixel(44),justifyContent:'center',alignItems: 'center'}}>
                    <Text allowFontScaling={false}
                          style={{color:'#fff',fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28)}}>{this.props.buttonText}</Text>
                </TouchableOpacity>

                <Text allowFontScaling={false} style={{color: fontAndColor.COLORA1,fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                marginTop:Pixel.getPixel(20),marginLeft:Pixel.getPixel(15),marginRight:Pixel.getPixel(15),lineHeight:18}}>
                    每天
                    <Text style={{color: fontAndColor.COLORB2,fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                }}>
                        9:00～17:00
                    </Text>
                    为实时注册时间，其他时间银行会先记录下信息，在工作时间处理后返回给您处理结果。

                </Text>
                <NavigationView
                    title={this.props.title}
                    backIconClick={this.backPage}
                />
                {
                    this.state.mbXzKtgrzh == false ?
                        <View style={{position: 'absolute',bottom:0,top:0,width:width}}>
                            <TouchableWithoutFeedback
                                onPress={()=>{

                                    StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data)=>{
                                        if (data.code ==1){
                                            let userData = JSON.parse(data.result);
                                            StorageUtil.mGetItem( String(userData['base_user_id']+StorageKeyNames.HF_INDICATIVE_LAYER) ,(subData)=>{
                                                if (subData.code == 1){
                                                    let obj = JSON.parse(subData.result);
                                                    obj[StorageKeyNames.HF_OPEN_INDIVIDUAL] = true;
                                                    StorageUtil.mSetItem(String(userData['base_user_id']+StorageKeyNames.HF_INDICATIVE_LAYER), JSON.stringify(obj), ()=>{})
                                                    this.setState({
                                                        mbXzKtgrzh: obj[StorageKeyNames.HF_OPEN_INDIVIDUAL],
                                                    })
                                                }
                                            })
                                        }
                                    })

                                }}

                            >

                                <Image style={{width:width,height:Pixel.getPixel(660),resizeMode:'stretch'}}
                                       source={require('../../../images/tishimengban/mb_ktgrzh.png')}/>
                            </TouchableWithoutFeedback>
                            <View style = {{flex:1, backgroundColor:'rgba(0,0,0,.7)'}}/>
                        </View> : null
                }
            </View>
        );
    }




    checkEmpty = () => {
        let name = this.refs.name.getInputTextValue();
        let number = this.refs.number.getInputTextValue();
        if (name == '' || name == null) {
            this.props.showToast('请输入真实姓名');
            return;
        } else if (number == '' || number == null) {
            this.props.showToast('请输入身份证号码');
            return;
        }
        StorageUtil.mGetItem(StorageKeyNames.PHONE, (data) => {
            if (data.code == 1 && data.result != null) {
                this.getBase_Id(name, number, data.result);

            } else {
                this.props.showToast('用户信息查询失败');
            }
        })
    }

    getBase_Id = (name, number, phone) => {
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                if (this.props.isChange == 'true') {
                    this.getAccountData(name, number, phone, datas.company_base_id);
                } else {
                    this.openIndividual(name, number, phone, datas.company_base_id);
                }
            } else {
                this.props.showToast('用户信息查询失败');
            }
        })
    }

    openIndividual = (name, number, phone, base_id) => {
        this.props.showModal(true);
        let maps = {
            cert_no: number,
            cert_type: '1',
            cust_name: name,
            mobile_no: phone,
            enter_base_id: base_id,
            reback_url: webBackUrl.OPENINDIVIDUALACCOUNT
        };

        request(Urls.USER_OPEN_ACCOUNT_PERSONAL, 'Post', maps)
            .then((response) => {
                    this.props.showModal(false);
                    this.toNextPage({
                        name: 'AccountWebScene', component: AccountWebScene, params: {
                            title: '个人开户', webUrl: response.mjson.data.auth_url +
                            '?authTokenId=' + response.mjson.data.auth_token, callBack: () => {
                                this.props.callBack();
                            }, backUrl: webBackUrl.OPENINDIVIDUALACCOUNT
                        }
                    });
                    //  Linking.openURL(response.mjson.data.auth_url+'?authTokenId='+response.mjson.data.auth_token);
                },
                (error) => {
                    if (error.mycode == -300 || error.mycode == -500) {
                        this.props.showToast('开户失败');
                    } else {
                        this.props.showToast(error.mjson.msg);
                    }
                });
    }

    getAccountData = (name, number, phone, base_id) => {
        this.props.showModal(true);
        let maps = {
            enter_base_ids: base_id,
            child_type: '1'
        };
        request(Urls.USER_ACCOUNT_INFO, 'Post', maps)
            .then((response) => {
                    this.changeIndividual(name, number, phone, base_id, response.mjson.data.account.bank_card_no)
                },
                (error) => {
                    this.props.showToast('用户信息查询失败');
                });
    }
    changeIndividual = (name, number, phone, base_id, sub_acct_no) => {
        this.props.showModal(true);
        let maps = {
            cert_no: number,
            cert_type: '1',
            cust_name: name,
            mobile_no: phone,
            enter_base_id: base_id,
            reback_url: webBackUrl.OPENINDIVIDUALACCOUNT,
            sub_acct_no: sub_acct_no
        };

        request(Urls.USER_ACCOUNT_SAVEPERSONAL, 'Post', maps)
            .then((response) => {
                    this.props.showToast('修改成功');
                    this.props.callBack();
                    this.backPage();
                    //  Linking.openURL(response.mjson.data.auth_url+'?authTokenId='+response.mjson.data.auth_token);
                },
                (error) => {
                    if (error.mycode == -300 || error.mycode == -500) {
                        this.props.showToast('修改失败');
                    } else {
                        this.props.showToast(error.mjson.msg);
                    }
                });
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor: fontAndColor.COLORA3}}>
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
    container: {
        flex: 1,
        backgroundColor: fontAndColor.COLORA3
    },
    buttonStyle: {
        marginTop: Pixel.getPixel(10),
        marginBottom: Pixel.getPixel(10),
        marginLeft: Pixel.getPixel(10),
    },
    itemStyel: {},
    inputTextsStyle: {
        backgroundColor: '#ffffff',
        paddingLeft: Pixel.getPixel(15),
        paddingRight: Pixel.getPixel(15),
        marginTop: Pixel.getTitlePixel(79)
    },
    inputTextStyle: {
        backgroundColor: '#ffffff',
        paddingLeft: 0,
        paddingRight: 0,
        margin: 0,
    },
    inputTextLine: {
        backgroundColor: fontAndColor.COLORA3,
        height: Pixel.getPixel(10),
        width: width,
    },
    imageButtonsStyle: {
        width: width,
        height: Pixel.getPixel(88),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingLeft: Pixel.getPixel(15),
        paddingRight: Pixel.getPixel(15),

    },
    imageButtonStyle: {
        width: Pixel.getPixel(80),
        height: Pixel.getPixel(60),
        resizeMode: 'contain'
    },
    imageClearButtonStyle: {
        width: Pixel.getPixel(17),
        height: Pixel.getPixel(17),
    },
    imagebuttonok: {
        width: width,
        backgroundColor: fontAndColor.COLORA3,
        height: Pixel.getPixel(130),
        paddingLeft: Pixel.getPixel(15),
        paddingRight: Pixel.getPixel(15),
        paddingTop: Pixel.getPixel(25)
    }
});