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
    KeyboardAvoidingView
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../constant/fontAndColor';
import BaseComponent from '../../component/BaseComponent';
import NavigationView from '../../component/AllNavigationView';
import LoginInputText from "../../login/component/LoginInputText";
const childItems = [];
import {request} from '../../utils/RequestUtil';
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";
import * as Urls from '../../constant/appUrls';
export  default class WaitActivationAccountScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            renderPlaceholderOnly: 'blank',
            cardNumber:'',
            type:''
        };
    }

    initFinish = () => {
        this.getData();
    }

    getData = () => {
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1) {
                let datas = JSON.parse(data.result);
                let maps = {
                    enter_base_ids: datas.company_base_id,
                    child_type: '1'
                };
                request(Urls.USER_ACCOUNT_INFO, 'Post', maps)
                    .then((response) => {
                        this.setState({
                            renderPlaceholderOnly:'success',
                            cardNumber:response.mjson.data.account.bank_card_no,
                            type:response.mjson.data.account.account_open_type,//1 企业   2 个人
                        });
                        },
                        (error) => {
                            this.setState({
                                renderPlaceholderOnly: 'error'
                            });
                        });
            }
        });
    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        }
        return (
            <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1}}>
                <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1}}>
                    <View style={{width:width,backgroundColor: '#fff',paddingLeft:Pixel.getPixel(15),
                paddingRight:Pixel.getPixel(15),marginTop:Pixel.getTitlePixel(79)}}>
                        <View style={{width:width-Pixel.getPixel(30),height:Pixel.getPixel(44),justifyContent:'center',
                    }}>
                            <Text allowFontScaling={false}  style={{color: '#000',fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28)}}>
                                账户号码：{this.state.cardNumber}
                            </Text>
                        </View>
                        <View style={{width:width-Pixel.getPixel(30),height:Pixel.getPixel(1),justifyContent:'center',
                    alignItems: 'center',backgroundColor: fontAndColor.COLORA3}}></View>
                        <View style={{width:width-Pixel.getPixel(30),justifyContent:'center',marginBottom:Pixel.getPixel(7)
                    }}>
                            <Text allowFontScaling={false} 
                                style={{color: '#000',fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),marginTop:Pixel.getPixel(7),lineHeight:21}}>

                                {this.state.type === 1 ?'您以企业名义开通的企业账户已经绑定，请进行激活，激活方式如下：':'您以个人名义开通的企业账户已经绑定，请进行激活，激活方式如下：'}

                            </Text>
                            <Text allowFontScaling={false}
                                style={{color: '#000',fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),marginTop:Pixel.getPixel(3),lineHeight:21}}>
                                1.请以恒丰银行发送短信告知的具体转账验证信息和金额（0.1-3元）为准；
                            </Text>
                            <Text allowFontScaling={false}
                                  style={{color: '#000',fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),marginTop:Pixel.getPixel(3),lineHeight:21}}>
                                2.开户行的名称：恒丰银行股份有限公司北京分行长安街支行；
                            </Text>
                            <Text allowFontScaling={false}
                                style={{color: '#000',fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),marginTop:Pixel.getPixel(3),lineHeight:21}}>
                                3.恒丰银行对转账金额进行确认，确认无误账户激活。
                            </Text>
                        </View>
                    </View>


                    <Text allowFontScaling={false}  style={{color: fontAndColor.COLORA1,fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                              marginTop:Pixel.getPixel(20),marginLeft:Pixel.getPixel(15),marginRight:Pixel.getPixel(15),lineHeight:18}}>
                        1.请用您名下绑定第一车贷账户的银行卡去做小额认证，并且按照短信金额进行打款。{'\n'}
                        2.银行反馈认证结果可能会有延迟，请耐心等待。{'\n'}
                        3.工商银行不支持快捷支付方式小额打款认证给恒，请绑定工商银行卡的商户选择其他方式进行认证。
                    </Text>
                </View>

                <NavigationView
                    title="账户管理"
                    backIconClick={this.backPage}
                />
            </View>
        );
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor: fontAndColor.COLORA3}}>
                {this.loadView()}
                <NavigationView
                    title="账户管理"
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