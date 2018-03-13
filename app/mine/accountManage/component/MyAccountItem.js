/**
 * Created by hanmeng on 2017/10/30.
 */
import React, {Component, PropTypes} from 'react'

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    TextInput
} from  'react-native'

const {width, height} = Dimensions.get('window');
import * as fontAndColor from '../../../constant/fontAndColor';
import PixelUtil from '../../../utils/PixelUtil';
import BaseComponent from "../../../component/BaseComponent";
import AccountManageScene from "../AccountTypeSelectScene";
import BindCardScene from "../BindCardScene";
import WaitActivationAccountScene from "../WaitActivationAccountScene";
import AccountScene from "../AccountScene";
import StorageUtil from "../../../utils/StorageUtil";
import * as StorageKeyNames from "../../../constant/storageKeyNames";
import {request} from "../../../utils/RequestUtil";
import * as Urls from '../../../constant/appUrls';
import ZheShangAccountScene from "../zheshangAccount/ZheShangAccountScene";
import ZSAccountTypeSelectScene from "../zheshangAccount/ZSAccountTypeSelectScene";
import WebScene from '../../../main/WebScene';
import {BASEURL}  from '../../../constant/appUrls';

const Pixel = new PixelUtil();

const cellJianTou = require('../../../../images/mainImage/celljiantou.png');

export default class MyAccountItem extends BaseComponent {

    /**
     *  constructor
     **/
    constructor(props) {
        super(props);
        this.navigatorParams = {
            name: '',
            component: '',
            params: {}
        };
        this.state = {
            data: this.props.data
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.data
        });
    }

    /**
     *   跳转页面分发
     *   type 315恒丰 316浙商
     *   state 开户状态
     **/
    pageDispense = (type, state) => {
        if (type == '315') {
            switch (state) {
                case 0:
                    this.navigatorParams.name = 'AccountManageScene';
                    this.navigatorParams.component = AccountManageScene;
                    this.navigatorParams.params = {
                        callBack: () => {
                            this.props.callBack();
                        }
                    };
                    break;
                case 1:
                    this.navigatorParams.name = 'BindCardScene';
                    this.navigatorParams.component = BindCardScene;
                    this.navigatorParams.params = {
                        callBack: () => {
                            this.props.callBack();
                        }
                    };
                    break;
                case 2:
                    this.navigatorParams.name = 'WaitActivationAccountScene';
                    this.navigatorParams.component = WaitActivationAccountScene;
                    this.navigatorParams.params = {
                        callBack: () => {
                            this.props.callBack();
                        }
                    };
                    break;
                default:
                    this.navigatorParams.name = 'AccountScene';
                    this.navigatorParams.component = AccountScene;
                    this.navigatorParams.params = {
                        callBack: () => {
                            this.props.callBack();
                        }
                    };
                    break;
            }
            this.toNextPage(this.navigatorParams);
        } else {
            switch (state) {
                case 0://未开户
                    this.navigatorParams.name = 'ZSAccountTypeSelectScene';
                    this.navigatorParams.component = ZSAccountTypeSelectScene;
                    this.navigatorParams.params = {
                        callBack: () => {
                            this.props.callBack();
                        }
                    };
                    this.toNextPage(this.navigatorParams);
                    break;
                case 2: // 未激活
                    // this.navigatorParams.name = 'WaitActivationAccountScene';
                    // this.navigatorParams.component = WaitActivationAccountScene;
                    // this.navigatorParams.params = {
                    //     callBack: () => {
                    //         this.props.callBack();
                    //     }
                    // };
                    this.props.showToast('您的资料已经提交，请耐心等待');
                    break;
                default:  //已开户
                    this.navigatorParams.name = 'ZheShangAccountScene';
                    this.navigatorParams.component = ZheShangAccountScene;
                    this.navigatorParams.params = {};
                    this.toNextPage(this.navigatorParams);
                    break;
            }
        }
    };

    /**
     *   点击跳转方法
     *   type 315恒丰 316浙商
     **/
    jumpDetailPage = (type) => {
        if (type == '315') {
            this.props.showModal(true);
            StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
                if (data.code == 1) {
                    let datas = JSON.parse(data.result);
                    let maps = {
                        enter_base_ids: datas.company_base_id,
                        child_type: '1'
                    };
                    request(Urls.USER_ACCOUNT_INFO, 'Post', maps)
                        .then((response) => {
                            this.props.showModal(false);
                            this.pageDispense(type, response.mjson.data.account.status);
                        }, (error) => {
                            this.props.showModal(false);
                            this.props.showToast('用户信息查询失败');
                        });
                } else {
                    this.props.showModal(false);
                    this.props.showToast('用户信息查询失败');
                }
            });
        } else {
            this.props.showModal(true);
            StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
                if (data.code == 1) {
                    let datas = JSON.parse(data.result);
                    let maps = {
                        enter_base_ids: datas.company_base_id,
                        child_type: '1',
                        bank_id: 316
                    };
                    request(Urls.GET_USER_ACCOUNT_DETAIL, 'Post', maps)
                        .then((response) => {
                            this.props.showModal(false);
                            //this.pageDispense(type, 0);
                            this.pageDispense(type, response.mjson.data['316'][0].status);

                        }, (error) => {
                            this.props.showModal(false);
                            this.props.showToast('用户信息查询失败');
                        });
                } else {
                    this.props.showModal(false);
                    this.props.showToast('用户信息查询失败');
                }
            });
        }
    };

    /**
     *  render
     **/
    render() {
        let back = ''; //背景图
        let bank = ''; //银行图标
        let bankName = ''; //账户类型名称
        let accountState = ''; //账户状态
        let bankNo = ''; // 资金账号
        let bindBankName = '**********'; // 绑定银行卡开户行
        if (this.props.type == '315') {
            back = require('../../../../images/account/hengfengback.png');
            bank = require('../../../../images/account/hengfengbank.png');
            bankName = '恒丰银行';
            bankNo = this.state.data.bank_card_no && this.state.data.status != 0 ? this.state.data.bank_card_no :
                '***** ***** ***** ***** *****';
        } else {
            back = require('../../../../images/account/zheshangback.png');
            bank = require('../../../../images/account/zheshangbank.png');
            bankName = '浙商银行';

            let b =  (this.state.data.bind_bank_card_type === 1&&this.state.data.account_open_type ===1)?this.state.data.bank_card_no:this.state.data.cz_elec_account

            bankNo = b && this.state.data.status != 0 ? b :
                '***** ***** ***** ***** *****';
        }
        if (this.state.data.status === 0 || !this.state.data.status) {
            accountState = '未开户';
        } else if (this.state.data.status === 1) {
            accountState = '未绑卡';
            bindBankName = this.state.data.bind_bank_name ? this.state.data.bind_bank_name : '**********';
        } else if (this.state.data.status === 2) {
            accountState = '未激活';
            bindBankName = this.state.data.bind_bank_name ? this.state.data.bind_bank_name : '**********';
        } else {
            bindBankName = this.state.data.bind_bank_name ? this.state.data.bind_bank_name : '**********';
        }
        return (
            <View style={{alignItems: 'center'}}>
                <Image
                    style={{width: Pixel.getPixel(345), height: Pixel.getPixel(238)}}
                    source={back}>
                    <TouchableOpacity
                        style={{
                            //backgroundColor: '#ffdaff',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: Pixel.getPixel(30),
                            height: Pixel.getPixel(72),
                        }}
                        onPress={() => {
                            this.jumpDetailPage(this.props.type);
                        }}
                        activeOpacity={0.9}>
                        <View style={{
                            marginLeft: Pixel.getPixel(20),
                            marginRight: Pixel.getPixel(20),
                            //backgroundColor: '#ffdaff',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Image source={bank}/>
                            <View style={{
                                width: Pixel.getPixel(120),
                                //alignItems: 'center',
                                marginLeft: Pixel.getPixel(12),
                                //justifyContent: 'center',
                                backgroundColor: '#ffffff'
                            }}>
                                <Text
                                    allowFontScaling={false}
                                    style={{
                                        includeFontPadding: false,
                                        textAlign: 'left',
                                        fontSize: Pixel.getPixel(15),
                                        color: fontAndColor.COLORA0
                                    }}>{bankName}</Text>
                                <Text allowFontScaling={false}
                                      numberOfLines={2}
                                      style={{
                                          includeFontPadding: false,
                                          marginTop: Pixel.getPixel(3),
                                          textAlign: 'left',
                                          fontSize: Pixel.getPixel(12),
                                          color: fontAndColor.COLORA1
                                      }}>{bindBankName}</Text>
                            </View>
                            {!this.state.data.status || this.state.data.status === 0 || this.state.data.status === 1 || this.state.data.status === 2 ?
                                <Text
                                    allowFontScaling={false}
                                    style={{
                                        flex: 1,
                                        backgroundColor: '#ffffff',
                                        marginRight: Pixel.getPixel(10),
                                        textAlign: 'right',
                                        fontSize: Pixel.getPixel(15),
                                        color: fontAndColor.COLORB2
                                    }}>{accountState}</Text> :
                                <View
                                    allowFontScaling={false}
                                    style={{
                                        flex: 1,
                                        alignItems: 'flex-end',
                                        marginRight: Pixel.getPixel(10),
                                        justifyContent: 'center',
                                        backgroundColor: '#ffffff'
                                    }}>
                                    <Text
                                        allowFontScaling={false}
                                        style={{
                                        textAlign: 'right',
                                        fontSize: Pixel.getPixel(15),
                                        color: fontAndColor.COLORA0
                                    }}>{this.state.data.balance}</Text>
                                    <Text
                                        allowFontScaling={false}
                                        style={{
                                        marginTop: Pixel.getPixel(3),
                                        textAlign: 'right',
                                        fontSize: Pixel.getPixel(12),
                                        color: fontAndColor.COLORA1
                                    }}>账户总额</Text>
                                </View>
                            }
                            <Image source={cellJianTou}/>
                        </View>
                    </TouchableOpacity>
                    <View style={{
                        backgroundColor: fontAndColor.COLORA4,
                        height: Pixel.getPixel(1),
                        marginLeft: Pixel.getPixel(20),
                        marginRight: Pixel.getPixel(20),
                        //marginTop: Pixel.getPixel(12)
                    }}/>
                    <View style={{
                        height: Pixel.getPixel(46),
                        marginTop: Pixel.getPixel(18),
                        alignItems: 'flex-start',
                        marginLeft: Pixel.getPixel(20),
                        marginRight: Pixel.getPixel(20),
                        justifyContent: 'center',
                        backgroundColor: 'transparent'
                    }}>
                        <Text
                            allowFontScaling={false}
                            style={{
                            includeFontPadding: false,
                            textAlign: 'left',
                            fontSize: Pixel.getPixel(12),
                            color: fontAndColor.COLORA1
                        }}>资金账号</Text>
                        <Text
                            allowFontScaling={false}
                            style={{
                            includeFontPadding: false,
                            marginTop: Pixel.getPixel(3),
                            textAlign: 'left',
                            fontSize: Pixel.getPixel(20),
                            color: fontAndColor.COLORA0
                        }}>{bankNo}</Text>

                    </View>
                    <View style={{
                        height: Pixel.getPixel(38),
                        marginTop: Pixel.getPixel(18),
                        alignItems: 'center',
                        marginLeft: Pixel.getPixel(20),
                        marginRight: Pixel.getPixel(20),
                        justifyContent: 'center',
                        backgroundColor: 'transparent',
                        flexDirection:'row'
                    }}>
                        <View
                            style={{flex:1}}
                        >
                            <Text
                                allowFontScaling={false}
                                style={{
                                    includeFontPadding: false,
                                    textAlign: 'left',
                                    fontSize: Pixel.getPixel(12),
                                    color: fontAndColor.COLORA1
                                }}>开通时间</Text>
                            <Text
                                allowFontScaling={false}
                                style={{
                                    includeFontPadding: false,
                                    marginTop: Pixel.getPixel(3),
                                    textAlign: 'left',
                                    fontSize: Pixel.getPixel(15),
                                    color: fontAndColor.COLORA0
                                }}>{!this.state.data.account_open_date || this.state.data.account_open_date.substr(0, 10) === '0000-00-00' ?
                                '****-**-**' : this.state.data.account_open_date.substr(0, 10)}</Text>

                        </View>

                        {
                            this.props.showQuestion == true?
                                <TouchableOpacity
                                    onPress={()=>{
                                        let url = BASEURL== 'https://gatewayapi.dycd.com/'? 'http://bms.dycd.com/platform/activity_newhand.html':'http://test.bms.dycd.com/platform/activity_newhand.html';
                                        this.toNextPage({
                                            component: WebScene,
                                            name: 'WebScene',
                                            params: {webUrl:url, title: '新手指引'}
                                        })
                                    }}
                                >
                                    <Image style={{width:Pixel.getPixel(15), height:Pixel.getPixel(15), padding:10}} source={require('../../../../images/account/question.png')}/>

                                </TouchableOpacity>
                                :null

                        }

                    </View>
                </Image>
            </View>
        )
    }

}

const styles = StyleSheet.create({});