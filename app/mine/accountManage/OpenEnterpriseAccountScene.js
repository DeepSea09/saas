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
import * as Urls from '../../constant/appUrls';
import SelectNumberType from './component/SelectNumberType';
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";
import * as webBackUrl from "../../constant/webBackUrl";
import SelectTypeScene from './SelectTypeScene';
import AccountWebScene from './AccountWebScene';

export default class OpenEnterpriseAccountScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            renderPlaceholderOnly: 'blank',
            topSize: -179,
        };
    }

    initFinish = () => {

        StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data) => {
            if (data.code == 1) {
                let userData = JSON.parse(data.result);
                StorageUtil.mGetItem(String(userData['base_user_id'] + StorageKeyNames.HF_INDICATIVE_LAYER), (subData) => {
                    if (subData.code == 1) {
                        let obj = JSON.parse(subData.result);
                        if (obj == null) {
                            obj = {};
                        }
                        if (obj[StorageKeyNames.HF_OPEN_ENTERPRISE] == null) {
                            obj[StorageKeyNames.HF_OPEN_ENTERPRISE] = false;
                            StorageUtil.mSetItem(String(userData['base_user_id'] + StorageKeyNames.HF_INDICATIVE_LAYER), JSON.stringify(obj), () => {})
                        }
                        this.setState({
                            renderPlaceholderOnly: 'success',
                            mbXzKtqyzh: obj[StorageKeyNames.HF_OPEN_ENTERPRISE],
                        })
                    }

                })

            }
        })


        //
        // StorageUtil.mGetItem(StorageKeyNames.MB_KTQYZH, (data) => {
        //     if (data.result != 'false') {
        //         this.setState({mbXzKtqyzh: true,})
        //     }
        // })
        // this.setState({
        //     renderPlaceholderOnly: 'success',
        // });
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

    render() {

        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        }
        return (
            <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1}}>
                <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={this.state.topSize}>
                    <View style={styles.inputTextsStyle}>
                        <LoginInputText
                            ref="cust_name"
                            textPlaceholder={'请输入公司名称'}
                            viewStytle={styles.itemStyel}
                            inputTextStyle={styles.inputTextStyle}
                            leftIcon={false}
                            foucsChange={() => {
                                if (this.state.topSize == 5) {
                                    this.setState({
                                        topSize: -179
                                    });
                                }
                            }}
                            import={false}
                            clearValue={true}
                            rightIcon={false}/>
                        <SelectNumberType ref="cert_type" callBack={() => {
                            this.toNextPage({
                                name: 'SelectTypeScene', component: SelectTypeScene,
                                params: {
                                    regShowData: ['营业执照号'
                                        , '社会信用代码'], callBack: (name, value) => {
                                        this.refs.cert_type.setValue(name, value);
                                    }, title: '选择证件类型'
                                }
                            });
                        }}/>
                        <LoginInputText
                            ref="cert_no"
                            textPlaceholder={'请输入企业证件号'}
                            viewStytle={[styles.itemStyel, {borderBottomWidth: 0}]}
                            inputTextStyle={styles.inputTextStyle}
                            leftIcon={false}
                            foucsChange={() => {
                                if (this.state.topSize == 5) {
                                    this.setState({
                                        topSize: -179
                                    });
                                }
                            }}
                            import={false}
                            clearValue={true}
                            rightIcon={false}/>
                    </View>

                    <View style={styles.inputTextLine}/>
                    <View style={styles.inputStyle}>
                        <LoginInputText
                            ref="legal_real_name"
                            textPlaceholder={'请输入法人姓名'}
                            viewStytle={styles.itemStyel}
                            inputTextStyle={styles.inputTextStyle}
                            leftIcon={false}
                            import={false}
                            foucsChange={() => {
                                if (this.state.topSize == 5) {
                                    this.setState({
                                        topSize: -179
                                    });
                                }
                            }}
                            clearValue={true}
                            rightIcon={false}/>
                        <LoginInputText
                            ref="legal_cert_no"
                            textPlaceholder={'请输入法人身份证号'}
                            viewStytle={[styles.itemStyel, {borderBottomWidth: 0}]}
                            inputTextStyle={styles.inputTextStyle}
                            leftIcon={false}
                            import={false}
                            foucsChange={() => {
                                if (this.state.topSize == -179) {
                                    this.setState({
                                        topSize: 5
                                    });
                                }
                            }}
                            clearValue={true}
                            rightIcon={false}/>
                    </View>

                    <View style={styles.inputTextLine}/>

                    <View style={styles.inputStyle}>
                        <LoginInputText
                            ref="org_agent_name"
                            textPlaceholder={'请输入经办人姓名'}
                            viewStytle={styles.itemStyel}
                            inputTextStyle={styles.inputTextStyle}
                            leftIcon={false}
                            import={false}
                            foucsChange={() => {
                                if (this.state.topSize == -179) {
                                    this.setState({
                                        topSize: 5
                                    });
                                }
                            }}
                            clearValue={true}
                            rightIcon={false}/>
                        <LoginInputText
                            ref="org_agent_cert_no"
                            textPlaceholder={'请输入经办人身份证号'}
                            viewStytle={styles.itemStyel}
                            inputTextStyle={styles.inputTextStyle}
                            leftIcon={false}
                            import={false}
                            foucsChange={() => {
                                if (this.state.topSize == -179) {
                                    this.setState({
                                        topSize: 5
                                    });
                                }
                            }}
                            clearValue={true}
                            rightIcon={false}/>
                        <LoginInputText
                            ref="org_agent_mobile"
                            textPlaceholder={'请输入经办人手机号'}
                            viewStytle={[styles.itemStyel, {borderBottomWidth: 0}]}
                            inputTextStyle={styles.inputTextStyle}
                            leftIcon={false}
                            import={false}
                            foucsChange={() => {
                                if (this.state.topSize == -179) {
                                    this.setState({
                                        topSize: 5
                                    });
                                }
                            }}
                            clearValue={true}
                            rightIcon={false}/>

                    </View>
                    <Text allowFontScaling={false} style={{
                        color: fontAndColor.COLORA1, fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                        marginTop: Pixel.getPixel(20), marginLeft: Pixel.getPixel(15)
                    }}>
                        请确认您的企业信息填写准确
                    </Text>

                    <TouchableOpacity onPress={() => {
                        this.checkEmpty();
                    }} activeOpacity={0.8} style={{
                        backgroundColor: fontAndColor.COLORB0,
                        marginTop: Pixel.getPixel(15),
                        width: width - Pixel.getPixel(30),
                        marginLeft: Pixel.getPixel(15),
                        marginRight: Pixel.getPixel(15),
                        height: Pixel.getPixel(44),
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text allowFontScaling={false}
                              style={{
                                  color: '#fff',
                                  fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28)
                              }}>{this.props.buttonText}</Text>
                    </TouchableOpacity>
                    <Text allowFontScaling={false} style={{
                        color: fontAndColor.COLORA1,
                        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                        marginTop: Pixel.getPixel(20),
                        marginLeft: Pixel.getPixel(15),
                        marginRight: Pixel.getPixel(15),
                        lineHeight: 18
                    }}>
                        每天
                        <Text style={{
                            color: fontAndColor.COLORB2, fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24)
                        }}>
                            9:00～17:00
                        </Text>
                        为实时注册时间，其他时间银行会先记录下信息，在工作时间处理后返回给您处理结果。

                    </Text>
                </KeyboardAvoidingView>

                <NavigationView
                    title={this.props.title}
                    backIconClick={this.backPage}
                />

                {
                    this.state.mbXzKtqyzh == false ?
                        <View style={{position: 'absolute', bottom: 0, top: 0, width: width}}>
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data) => {
                                        if (data.code == 1) {
                                            let userData = JSON.parse(data.result);
                                            StorageUtil.mGetItem(String(userData['base_user_id'] + StorageKeyNames.HF_INDICATIVE_LAYER), (subData) => {
                                                if (subData.code == 1) {
                                                    let obj = JSON.parse(subData.result);
                                                    obj[StorageKeyNames.HF_OPEN_ENTERPRISE] = true;
                                                    StorageUtil.mSetItem(String(userData['base_user_id'] + StorageKeyNames.HF_INDICATIVE_LAYER), JSON.stringify(obj), () => {
                                                    })
                                                    this.setState({
                                                        mbXzKtqyzh: obj[StorageKeyNames.HF_OPEN_ENTERPRISE],
                                                    })
                                                }
                                            })
                                        }
                                    })

                                }}

                            >
                                <Image style={{width: width, height:Pixel.getPixel(660) , resizeMode: 'stretch'}}
                                       source={require('../../../images/tishimengban/mb_ktqyzh.png')}/>
                            </TouchableWithoutFeedback>
                            <View style = {{flex:1, backgroundColor:'rgba(0,0,0,.7)'}}/>
                        </View> : null
                }
            </View>
        );
    }

    checkEmpty = () => {
        let cert_no = this.refs.cert_no.getInputTextValue();
        let cert_type = this.refs.cert_type.getNumber();
        let cust_name = this.refs.cust_name.getInputTextValue();
        let legal_cert_no = this.refs.legal_cert_no.getInputTextValue();
        let legal_real_name = this.refs.legal_real_name.getInputTextValue();
        let org_agent_name = this.refs.org_agent_name.getInputTextValue();
        let org_agent_cert_no = this.refs.org_agent_cert_no.getInputTextValue();
        let org_agent_mobile = this.refs.org_agent_mobile.getInputTextValue();
        if (cert_no == '') {
            this.props.showToast('请输入企业证件号');
            return;
        } else if (cert_type == '') {
            this.props.showToast('请选择企业证件类型');
            return;
        } else if (cust_name == '') {
            this.props.showToast('请输入企业名称');
            return;
        } else if (legal_cert_no == '') {
            this.props.showToast('请输入法人证件号');
            return;
        } else if (legal_real_name == '') {
            this.props.showToast('请输入法人姓名');
            return;
        } else if (org_agent_name == '') {
            this.props.showToast('请输入经办人姓名');
            return;
        } else if (org_agent_cert_no == '') {
            this.props.showToast('请输入经办人证件号');
            return;
        } else if (org_agent_mobile == '') {
            this.props.showToast('请输入经办人手机号');
            return;
        } else if (legal_cert_no.length > 18) {
            this.props.showToast('请输入正确证件号码');
            return;
        } else {
            StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
                if (data.code == 1 && data.result != null) {
                    let datas = JSON.parse(data.result);
                    if (this.props.isChange == 'true') {
                        this.getAccountData(cert_no, cert_type, cust_name, legal_cert_no, legal_real_name,
                            org_agent_name, org_agent_cert_no, org_agent_mobile, datas.company_base_id);
                    } else {
                        this.sendData(cert_no, cert_type, cust_name, legal_cert_no, legal_real_name,
                            org_agent_name, org_agent_cert_no, org_agent_mobile, datas.company_base_id);
                    }
                } else {
                    this.props.showToast('用户信息查询失败');
                }
            })
        }
    }

    sendData = (cert_no, cert_type, cust_name, legal_cert_no, legal_real_name, org_agent_name, org_agent_cert_no, org_agent_mobile,
                enter_base_id) => {
        this.props.showModal(true);
        let maps = {
            cert_no: cert_no,
            cert_type: cert_type,
            cust_name: cust_name,
            legal_cert_no: legal_cert_no,
            org_agent_name: org_agent_name,
            legal_real_name: legal_real_name,
            org_agent_cert_no: org_agent_cert_no,
            org_agent_mobile: org_agent_mobile,
            enter_base_id: enter_base_id,
            reback_url: webBackUrl.OPENENTERPRISEACCOUNT,
            legal_cert_type: '1'

        };
        request(Urls.USER_OPEN_ACCOUNT_COMPANY, 'Post', maps)
            .then((response) => {
                    this.props.showModal(false);
                    this.toNextPage({
                        name: 'AccountWebScene', component: AccountWebScene, params: {
                            title: '企业开户', webUrl: response.mjson.data.auth_url +
                            '?authTokenId=' + response.mjson.data.auth_token, callBack: () => {
                                this.props.callBack();
                            }, backUrl: webBackUrl.OPENENTERPRISEACCOUNT
                        }
                    });
                },
                (error) => {
                    if (error.mycode == -300 || error.mycode == -500) {
                        this.props.showToast('开户失败');
                    } else {
                        this.props.showToast(error.mjson.msg);
                    }
                });
    }

    getAccountData = (cert_no, cert_type, cust_name, legal_cert_no, legal_real_name, org_agent_name, org_agent_cert_no, org_agent_mobile,
                      enter_base_id) => {
        this.props.showModal(true);
        let maps = {
            enter_base_ids: enter_base_id,
            child_type: '1'
        };
        request(Urls.USER_ACCOUNT_INFO, 'Post', maps)
            .then((response) => {
                    this.changeData(cert_no, cert_type, cust_name, legal_cert_no, legal_real_name,
                        org_agent_name, org_agent_cert_no, org_agent_mobile, enter_base_id,
                        response.mjson.data.account.bank_card_no);
                },
                (error) => {
                    this.props.showToast('用户信息查询失败');
                });
    }

    changeData = (cert_no, cert_type, cust_name, legal_cert_no, legal_real_name, org_agent_name, org_agent_cert_no, org_agent_mobile,
                  enter_base_id, bank_card_no) => {
        let maps = {
            cert_no: cert_no,
            cert_type: cert_type,
            cust_name: cust_name,
            legal_cert_no: legal_cert_no,
            agent_name: org_agent_name,
            legal_real_name: legal_real_name,
            agent_cert_no: org_agent_cert_no,
            agent_mobile_no: org_agent_mobile,
            enter_base_id: enter_base_id,
            reback_url: webBackUrl.OPENENTERPRISEACCOUNT,
            legal_cert_type: '1',
            agent_cert_type: '1',
            sub_acct_no: bank_card_no
        };
        request(Urls.USER_ACCOUNT_SAVECOMPANY, 'Post', maps)
            .then((response) => {
                    this.props.showToast('修改成功');
                    this.props.callBack();
                    this.backPage();
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
            <View style={{width: width, height: height, backgroundColor: fontAndColor.COLORA3}}>
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
    },
    inputStyle: {
        backgroundColor: '#ffffff',
        paddingLeft: Pixel.getPixel(15),
        paddingRight: Pixel.getPixel(15),
    }
});