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
import WithdrawalsInput from './component/TransferInput';
import WithdrawalsDialog from './component/WithdrawalsDialog';
import LoginInputText from "../../login/component/LoginInputText";
import AccountInput from './component/AccountInput';
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";
import * as webBackUrl from "../../constant/webBackUrl";
import {request} from '../../utils/RequestUtil';
import * as Urls from '../../constant/appUrls';
import AccountWebScene from './AccountWebScene';

export  default class TransferScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            renderPlaceholderOnly: 'blank',
        };
    }

    initFinish = () => {
        this.setState({
            renderPlaceholderOnly: 'success'
        });
    }


    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        }
        return (
            <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1}}>
                <AccountInput ref="accountinput" callBack={()=>{
                    this.getCardData();
                }}/>
                <View style={{backgroundColor: '#fff',width:width,height:Pixel.getPixel(146),justifyContent:'center',
                marginTop:Pixel.getPixel(10),paddingLeft: Pixel.getPixel(15),paddingRight:Pixel.getPixel(15)}}>
                    <View style={{flex:1,justifyContent:'center'}}>
                        <Text allowFontScaling={false}  style={{fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),color: '#000'}}>
                            转账金额(元)</Text>
                    </View>
                    <WithdrawalsInput ref="withdrawalsinput"/>
                    <View
                        style={{backgroundColor: fontAndColor.COLORA3,width:width-Pixel.getPixel(30),height:Pixel.getPixel(1)}}></View>
                    <View style={{flex:1,flexDirection: 'row',alignItems: 'center'}}>
                        <Text allowFontScaling={false}  style={{fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),color: fontAndColor.COLORA1}}>
                            可转账金额：</Text>
                        <Text allowFontScaling={false}  style={{fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),color: '#000'}}>
                            {this.props.money}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={()=>{
                    this.checkEmpty();
                }} activeOpacity={0.8} style={{marginTop:Pixel.getPixel(28),marginLeft:Pixel.getPixel(15),marginRight:Pixel.getPixel(15),
                borderRadius: Pixel.getPixel(4),backgroundColor: fontAndColor.COLORB0,width:width-Pixel.getPixel(30),
                height:Pixel.getPixel(44),justifyContent:'center',alignItems: 'center'}}>
                    <Text allowFontScaling={false}  style={{fontSize: Pixel.getPixel(15),color: '#fff'}}>
                        转账</Text>
                </TouchableOpacity>

                <WithdrawalsDialog ref="withdrawalsdialog" callBack={()=>{
                        this.props.callBack();
                        this.backPage();
                }}/>

                <Text allowFontScaling={false}  style={{color: fontAndColor.COLORA1,fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                              marginTop:Pixel.getPixel(20),marginLeft:Pixel.getPixel(15),marginRight:Pixel.getPixel(15),lineHeight:18}}>
                    转账可能由于某些不可抗拒因素造成无法实时到账或账户余额对应不上等问题，原因如下:{'\n'}
                    1.转账过程中异常操作，如中途取消，网络异常等，当出现异常操作时为保证您的资金安全我们将对转账金额进行短暂冻结{'\n'}
                    2.转账成功后银行返回的转账成功结果延迟
                </Text>
                <NavigationView
                    title="转账"
                    backIconClick={this.backPage}
                />
            </View>
        );
    }



    checkEmpty = () => {
        let allValue = this.refs.accountinput.getAllValue();
        if (allValue.value.length < 26 || allValue.id == '') {
            this.props.showToast('请输入正确账号')
            return;
        }
        if(allValue.name==''){
            this.props.showToast('请输入正确账号')
            return;
        }
        let money = this.refs.withdrawalsinput.getTextValue();
        if (money == '') {
            this.props.showToast('请输入转账金额')
            return;
        }
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    amount:money,
                    enter_base_id:datas.company_base_id,
                    rcv_base_id:allValue.id,
                    reback_url:webBackUrl.TRANSFER
                };

                request(Urls.USER_ACCOUNT_TRANSFER, 'Post', maps)
                    .then((response) => {
                            this.props.showModal(false);
                            this.toNextPage({name:'AccountWebScene',component:AccountWebScene,params:{
                                title:'转账',webUrl:response.mjson.data.auth_url+
                                '?authTokenId='+response.mjson.data.auth_token,callBack:()=>{
                                    this.props.callBack();
                                },backUrl:webBackUrl.TRANSFER
                            }});
                        },
                        (error) => {
                            if (error.mycode == -300 || error.mycode == -500) {
                                this.props.showToast('转账失败');
                            } else {
                                this.props.showToast(error.mjson.msg);
                            }
                        });
            }else{
                this.props.showToast('用户信息查询失败');
            }
        });

    }

    getCardData = () => {
        this.props.showModal(true);
        let cardNumber = this.refs.accountinput.getTextValue();
        let maps = {
            bank_card_no: cardNumber
        };

        request(Urls.USER_ACCOUNT_COMPANYINFO, 'Post', maps)
            .then((response) => {
                    this.props.showModal(false);
                    this.refs.accountinput.setTextValue(response.mjson.data.bank_card_name,
                        response.mjson.data.enter_base_id);
                },
                (error) => {
                    this.refs.accountinput.clearValue();
                    if (error.mycode == -300 || error.mycode == -500) {
                        this.props.showToast('获取账户信息失败');
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
                    title="转账"
                    backIconClick={this.backPage}
                />
            </View>
        );
    }


}
const styles = StyleSheet.create({

    image: {
        width: 43,
        height: 43,
    },
    Separator: {
        backgroundColor: fontAndColor.COLORA3,
        height: 1,

    },
    margin: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)

    },
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'}
    ,
    inputStyle: {
        backgroundColor: '#ffffff',
        paddingLeft: Pixel.getPixel(15),
        paddingRight: Pixel.getPixel(15),
    }, itemStyel: {},
})