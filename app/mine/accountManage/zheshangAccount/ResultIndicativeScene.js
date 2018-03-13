/**
 * Created by dingyonggang on 2017/10/27.
 */
import React, {Component} from "react";
import {
    View,
    Text, Image,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    InteractionManager,
    TouchableWithoutFeedback
} from "react-native";
import BaseComponent from "../../../component/BaseComponent";
import NavigationBar from "../../../component/NavigationBar";
import * as FontAndColor from "../../../constant/fontAndColor";
import PixelUtil from "../../../utils/PixelUtil";
import MyButton from "../../../component/MyButton";
import {request} from "../../../utils/RequestUtil";
import * as AppUrls from "../../../constant/appUrls";
import md5 from "react-native-md5";
import StorageUtil from "../../../utils/StorageUtil";
import * as StorageKeyNames from "../../../constant/storageKeyNames";
import SaasText from "./component/SaasText";
import ZSBaseComponent from  './component/ZSBaseComponent'


let Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');
let Pixel = new PixelUtil();
let Platform = require('Platform');


//type
//    0：个人开户
//    1：企业开户
//    2：充值
//    3：提现
//    4: 更换银行卡
//    5: 更换手机号

// status;
//    0：处理中
//    1：成功
//    2：失败
//    3：提交资料 （开通企业账户ONLY）


export default class ResultIndicativeScene extends ZSBaseComponent {

    constructor(props) {
        super(props)

        this.state = {
            renderPlaceholderOnly: 'blank',
            type: this.props.type,
            status: this.props.status,
        }
    }


    backPage=()=>{
        if (this.state.status == 1){
            this.buttonAction()
        }else {
            const navigator = this.props.navigator;
            if (navigator) {
                navigator.pop();
            }
        }
    }

    initFinish() {
        this.setState({
            renderPlaceholderOnly: 'success',
            type: this.props.type,
            status: this.props.status,
        })
    }

    render() {

        let navi_title = '';
        if (this.state.type === 0) {
            navi_title = '个人开户';
        } else if (this.state.type === 1) {
            navi_title = '企业开户'
        } else if (this.state.type === 2) {
            navi_title = '充值'
        } else if (this.state.type === 3) {
            navi_title = '提现'
        } else if (this.state.type === 4) {
            navi_title = '更换银行卡'
        } else if (this.state.type === 5) {
            navi_title = '修改银行预留手机号'
        }

        if (this.state.renderPlaceholderOnly === 'blank') {
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
                        centerText={navi_title}
                        rightText={""}

                    />
                </View>
            </TouchableWithoutFeedback>);
        }

        if(this.state.renderPlaceholderOnly === 'loading'){

            return(
                <View style={{flex: 1, backgroundColor: 'white'}}>
                    <NavigationBar
                        leftImageShow={true}
                        leftTextShow={false}
                        centerText={navi_title}
                        rightText={""}
                        leftImageCallBack={() => {
                            this.backPage();
                        }}
                    />

                    {this.loadView()}
                </View>
                )

        }


        return (
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <NavigationBar
                    leftImageShow={true}
                    leftTextShow={false}
                    centerText={navi_title}
                    rightText={""}
                    leftImageCallBack={() => {
                        this.backPage();
                    }}
                />

                {this.loadMainView()}
            </View>

        )
    }

    loadMainView = ()=>{
        return(
            <View style={{flex: 1}}>

                <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                    <Image style={{
                        width: this.state.status === 0 ? 80 : 180,
                        height: this.state.status === 0 ? 80 : 120,
                        marginBottom: 35
                    }} source={this.image()}/>
                    <Text allowFontScaling={false} style={{fontSize: 20, marginBottom: 10}}>{this.tips()}</Text>
                    {this.renderAnnotation()}
                    <MyButton
                        buttonType={MyButton.TEXTBUTTON}
                        content={this.buttonTitle()}
                        parentStyle={{
                            backgroundColor: FontAndColor.COLORB0,
                            borderRadius: 3,
                            marginTop: 25,
                            height: 35,
                            width: 100,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        childStyle={{color: 'white', fontSize: 16}}
                        mOnPress={this.buttonAction}
                    />
                </View>
                {this.renderFooter()}
                {this.out_of_service()}

            </View>
        )
    }

    buttonTitle = () => {
        switch (this.state.status) {
            case 0: {
                return '刷新试试'
            }
            case 1:
            case 3: {
                return '完成'
            }
            case 2: {
                return '再试一次'
            }
        }
    }

    buttonAction = () => {

        switch (this.state.type) {
            case 0:
            case 1: {
                switch (this.state.status) {
                    case 0: {
                        this.refresh()
                    }
                        break;
                    case 1: {

                        InteractionManager.runAfterInteractions(() => {
                        this.props.callBack()

                        });
                        this.backN(4)  //开户成功跳卡片页
                    }
                        break;
                    case 2: {
                        this.backN(3)  //开户失败跳选择开户类型页
                    }
                        break;
                    case 3: {
                        this.backN(4)  //提交资料成功跳卡片页
                    }
                        break
                }
            }
                break;
            case 2:
            case 3: {
                switch (this.state.status) {
                    case 0: {
                        this.refresh()
                    }
                        break;
                    case 1: {
                        InteractionManager.runAfterInteractions(() => {
                        this.props.callBack()

                        });

                        this.backN(2)
                    }
                        break;
                    case 2: {
                        this.backPage()
                    }
                }
            }
                break;
            case 4: {
                switch (this.state.status) {
                    case 0: {
                        this.refresh()
                    }
                        break
                    case 1: {
                        this.props.callBack()
                        this.backN(2)
                    }
                        break
                    case 2: {
                        this.backN(1)
                    }
                        break

                }
            }
                break
            case 5: { //更换手机号
                switch (this.state.status) {
                    case 0: {
                        this.refresh()
                    }
                        break
                    case 1: {
                        if (this.props.dose_need_old_number_sms_code === false) {
                            this.props.callBack()
                            this.backN(2)
                        } else {
                            this.props.callBack()
                            this.backN(3)
                        }
                    }
                        break
                    case 2: {
                        if (this.props.dose_need_old_number_sms_code === false) {
                            this.backN(1)
                        } else {
                            this.backN(2)

                        }
                    }
                        break

                }
            }
        }

    }

    refresh = () => {

        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code === 1 && data.result !== null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    enter_base_id: datas.company_base_id,
                    bank_id: 316,
                    serial_no: this.props.error.data.serial_no,
                };

                this.setState({
                    renderPlaceholderOnly: 'loading'
                })
                request(AppUrls.ZS_FETCH_STATUS, 'Post', maps)
                    .then((response) => {

                        this.props.error.msg = response.mjson.data.transfer_msg;
                        this.setState({
                            status: response.mjson.data.transfer_status,
                            renderPlaceholderOnly: 'success',
                        })
                    }, (error) => {

                        this.setState({
                            renderPlaceholderOnly: 'success',
                        })
                        //this.props.showToast(error.mjson.msg)
                    });
            } else {
                this.props.showToast('刷新失败');
                this.setState({
                    renderPlaceholderOnly: 'error',
                    isRefreshing: false
                });
            }
        })

    }


    backN = (n) => {
        const navigator = this.props.navigator;
        if (navigator) {
            navigator.popN(n);
        }
    }


    tips = () => {
        switch (this.state.type) {
            case 0:
            case 1: {
                switch (this.state.status) {
                    case 0: {
                        return '开户处理中'
                    }
                    case 1: {
                        return '恭喜您开户成功'
                    }
                    case 2: {
                        return '您的开户未成功'
                    }
                    case 3: {
                        return '提交资料成功'
                    }
                }
            }
                break;
            case 2: {
                switch (this.state.status) {
                    case 0: {
                        return '充值处理中'
                    }
                    case 1: {
                        return '恭喜您充值成功'
                    }
                    case 2: {
                        return '充值失败'
                    }
                }
            }
                break;
            case 3: {
                switch (this.state.status) {
                    case 0: {
                        return '提现处理中'
                    }
                    case 1: {
                        return '提现成功'
                    }
                    case 2: {
                        return '提现失败'
                    }

                }
            }
                break;
            case 4: {
                switch (this.state.status) {
                    case 0: {
                        return '处理中...'
                    }
                    case 1: {
                        return '恭喜您更换成功'
                    }
                    case 2: {
                        return '您的银行卡更换失败'
                    }

                }
            }
                break;
            case 5: {
                switch (this.state.status) {
                    case 0: {
                        return '处理中...'
                    }
                    case 1: {
                        return '手机号码修改成功'
                    }
                    case 2: {
                        return '您的手机号修改失败'
                    }

                }
            }
        }
    }

    renderAnnotation = () => {

        if (this.state.type === 0 || this.state.type === 1) {
            if (this.state.status === 0) {
                return null;
            } else if (this.state.status === 1) {

                let bank_no = this.props.params.acct_no.substr(this.props.params.acct_no.length - 4, 4);
                let bank_name = this.props.append;
                return <View style={{alignItems: 'center'}}>
                    <Text allowFontScaling={false}
                          style={{color: FontAndColor.COLORA1, marginBottom: 5}}>您已成功开通浙商银行账户啦</Text>
                    <Text allowFontScaling={false} style={{color: FontAndColor.COLORA1}}> 并已经绑定{bank_name}（尾号{bank_no}）的银行卡</Text>
                </View>
            } else if (this.state.status === 2) {
                return <View style={{alignItems: 'center'}}>
                    <SaasText style={{
                        color: FontAndColor.COLORA1,
                        marginBottom: 5,
                        textAlign: 'center'
                    }}>{this.props.error.msg}</SaasText>
                </View>
            } else { // 提交资料成功
                return <View style={{alignItems: 'center'}}>
                    <Text allowFontScaling={false}
                          style={{color: FontAndColor.COLORA1, marginBottom: 5}}>您已提供对公开户线上资料</Text>
                    <Text allowFontScaling={false}
                          style={{color: FontAndColor.COLORA1, marginBottom: 5}}>线下资料请尽快联系客服4008365111</Text>
                </View>
            }
        } else if (this.state.type === 2 || this.state.type === 3) {
            if (this.state.status === 1) {
                return <Text allowFontScaling={false} style={{fontSize: 18}}>￥{this.props.params.amount}</Text>
            } else {
                return <View style={{alignItems: 'center', marginHorizontal: 50}}>
                    <Text allowFontScaling={false} style={{
                        color: FontAndColor.COLORA1,
                        marginBottom: 5,
                        textAlign: 'center'
                    }}>{this.props.error.msg ? this.props.error.msg : '处理失败'}</Text>
                </View>
            }
        } else if (this.state.type === 4) {
            if (this.state.status === 0) {
                return null
            } else if (this.state.status === 1) {
                return <View style={{alignItems: 'center', marginTop: 10}}>
                    <Text allowFontScaling={false} style={{color: FontAndColor.COLORA1, marginBottom: 5}}>新银行卡为</Text>
                    <Text allowFontScaling={false}
                          style={{color: FontAndColor.COLORA1}}> {this.props.params.new_acct_no}</Text>
                </View>
            } else {
                return <View style={{alignItems: 'center', marginTop: 10}}>
                    <Text allowFontScaling={false}
                          style={{color: FontAndColor.COLORA1, marginBottom: 5}}>{this.props.error.msg}</Text>
                </View>
            }
        } else {
            if (this.state.status === 0) {
                return null
            } else if (this.state.status === 1) {
                return <View style={{alignItems: 'center', marginTop: 10}}>
                    <Text allowFontScaling={false} style={{color: FontAndColor.COLORA1, marginBottom: 5}}>转账或充值时请填写新的手机号码</Text>
                </View>
            } else {
                return <View style={{alignItems: 'center', marginTop: 10}}>
                    <Text allowFontScaling={false}
                          style={{color: FontAndColor.COLORA1, marginBottom: 5}}>{this.props.error.msg}</Text>
                </View>
            }
        }
    }

    image = () => {

        if (this.state.type === 0 || this.state.type === 1 || this.state.type === 4) { // 个人开户、企业开户、更换银行卡
            switch (this.state.status) {
                case 0: {
                    return require('../../../../images/account/processing.png')
                }
                case 1: {
                    return require('../../../../images/account/open_account_success.png')
                }
                case 2: {
                    return require('../../../../images/account/open_account_failure.png')
                }
                case 3: {
                    return require('../../../../images/account/commit_success.png')
                }
            }
        } else if (this.state.type === 2 || this.state.type === 3) { // 提现、充值
            switch (this.state.status) {
                case 0: {
                    return require('../../../../images/account/processing.png')
                }
                case 1: {
                    return require('../../../../images/account/withdraw_success.png')
                }
                case 2: {
                    return require('../../../../images/account/withdraw_failure.png')
                }
            }
        } else if (this.state.type === 5) {  //修改手机号
            switch (this.state.status) {
                case 0: {
                    return require('../../../../images/account/processing.png')
                }
                case 1: {
                    return require('../../../../images/account/mobile_success.png')
                }
                case 2: {
                    return require('../../../../images/account/mobile_fail.png')
                }
            }


        }
    }

    renderFooter = () => {
        switch (this.state.type) {
            case 0: {  // 个人开户
                return <View style={{alignItems: 'center', marginBottom: 35, marginTop: 150}}>
                    <Text allowFontScaling={false} style={{color: FontAndColor.COLORA1}}>温馨提示：此账户暂时仅支持SP业务</Text>
                </View>

            }
                break;
            case 1:
            case 4:
                case 5:{
                // 企业开户、更换银行卡、更换手机号
                return <View style={{marginTop: 200}}/>
            }
                break;
            case 2 :{  //充值
                return <View style={{marginHorizontal: 30, height: 180, alignItems:'center'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
                        <View style={{height: 1, backgroundColor: FontAndColor.COLORA4, flex: 1, marginRight: 15}}/>
                        <Text allowFontScaling={false} style={{color: FontAndColor.COLORA1}}>温馨提示</Text>
                        <View style={{height: 1, backgroundColor: FontAndColor.COLORA4, flex: 1, marginLeft: 15}}/>
                    </View>
                    <Text allowFontScaling={false}
                          style={{color: FontAndColor.COLORA1, marginBottom: 5, lineHeight: 20}}>快捷入金T+1日可提现，不影响交易哦~</Text>
                </View>


            } break;
            case 3: {  //提现

                return <View style={{marginHorizontal: 30, height: 180}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
                        <View style={{height: 1, backgroundColor: FontAndColor.COLORA4, flex: 1, marginRight: 15}}/>
                        <Text allowFontScaling={false} style={{color: FontAndColor.COLORA1}}>温馨提示</Text>
                        <View style={{height: 1, backgroundColor: FontAndColor.COLORA4, flex: 1, marginLeft: 15}}/>
                    </View>
                    <Text allowFontScaling={false}
                          style={{color: FontAndColor.COLORA1, marginBottom: 5, lineHeight: 20}}>1  个人7*24小时，实时到账。</Text>

                    <Text allowFontScaling={false} style={{color: FontAndColor.COLORA1, lineHeight: 20}}>{"2  企业工作日 9:00-16:30实时到账，其他时间单笔  <=5w 实时到账"}</Text>

                </View>
            }
                break;

        }
    }
}
