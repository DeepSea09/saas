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
    TouchableWithoutFeedback,
    ScrollView,

} from "react-native";
import BaseComponent from "../../../../component/BaseComponent";
import NavigationBar from "../../../../component/NavigationBar";
import * as FontAndColor from "../../../../constant/fontAndColor";
import PixelUtil from "../../../../utils/PixelUtil";
import MyButton from "../../../../component/MyButton";
import {request} from "../../../../utils/RequestUtil";
import * as AppUrls from "../../../../constant/appUrls";
import StorageUtil from "../../../../utils/StorageUtil";
import * as StorageKeyNames from "../../../../constant/storageKeyNames";
import SendMmsCountDown from "../../../../login/component/SendMmsCountDown";
import SText from '../component/SaasText'
import SmsFillScene from './SmsFillScene'
import ResultIndicativeScene from '../ResultIndicativeScene'
import ZSBaseComponent from  '../component/ZSBaseComponent'


let Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');
let Pixel = new PixelUtil();
let Platform = require('Platform');
const IS_ANDROID = Platform.OS === 'android';


let support_quick_deposit
let deposit_data = [
    {
        image: require('../../../../../images/account/counter.png'),
        title: '柜台转账'
    },
    {
        image: require('../../../../../images/account/e_bank.png'),
        title: '网银转账'
    },
    {
        image: require('../../../../../images/account/mobile_bank.png'),
        title: '手机银行'
    }
]


export default class DepositScene extends ZSBaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            renderPlaceholderOnly: 'loading',
            deposit_style: -1,   //0:快捷充值 1：其他充值
            sms_pad: false,
            money_input: '',
            allow_withdraw_amount: '',
            dayAmt: '',
            singleAmt: ''
        }
        this.initValue = ['', '', '', '', '', '', ''];
    }

    initFinish() {

        this.loadInstruction();

    }


    // 加载限额说明
    loadInstruction = () => {
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code === 1 && data.result !== null) {
                let datas = JSON.parse(data.result);
                //this.isOpenContract = datas.is_open_electron_repayment_contract;
                let maps = {
                    enter_base_id: datas.company_base_id,
                };

                //TODO
                request(AppUrls.ZS_QUOTA, 'Post', maps)
                    .then((response) => {

                        support_quick_deposit = response.mjson.data.support_quick_deposit

                        if (support_quick_deposit === 1) {
                            this.setState({
                                deposit_style: 0
                            })
                        }

                        if (!(this.props.account.account_open_type == 2 && this.props.account.bind_bank_card_type == 1)) {

                            if (this.state.deposit_style === -1) {
                                this.setState({
                                    deposit_style: 1
                                })

                            }
                        }

                        this.setState({
                            dayAmt: this.parse(response.mjson.data.limit_info.dayAmt),
                            singleAmt: this.parse(response.mjson.data.limit_info.singleAmt),
                            total_amount: response.mjson.data.total_amount,
                            renderPlaceholderOnly: 'success'
                        })


                    }, (error) => {
                        this.props.showToast(error.mjson.msg)

                    });
            } else {
                this.props.showToast('限额说明查询失败');
                this.setState({
                    renderPlaceholderOnly: 'error',
                    isRefreshing: false
                });
            }
        })
    }


    parse = (t) => {

        let n = parseInt(t)
        if (n > 10000) {
            return n / 10000 + '万元'
        } else {
            return n + '元'
        }

    }

    render() {

        if (this.state.renderPlaceholderOnly != 'success') {
            return (
                <View style={{flex: 1, backgroundColor: FontAndColor.COLORA3}}>
                    <NavigationBar
                        leftImageShow={false}
                        leftTextShow={true}
                        leftText={""}
                        centerText={'充值'}
                        rightText={""}

                    />
                    {this.loadView()}
                </View>
            )
        }


        return (
            <View style={{flex: 1, backgroundColor: FontAndColor.COLORA3}}>
                <NavigationBar
                    leftImageShow={true}
                    leftTextShow={false}
                    centerText={'充值'}
                    rightText={""}
                    leftImageCallBack={() => {
                        this.props.callBack();
                        this.backPage();
                    }}
                />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        marginTop: 15,
                        paddingVertical: 20

                    }}>
                        <Image source={require('../../../../../images/account/zheshang_bank.png')}
                               style={{width: 55, height: 55, marginHorizontal: 15}}/>
                        <View>
                            <SText style={{
                                fontSize: 17,
                                marginBottom: 10
                            }}>{this.props.account.bind_sub_bank_name}账户 {this.props.account.bind_bank_card_name}</SText>
                            <SText
                                style={{color: FontAndColor.COLORA1}}>{'快捷充值限额' + this.state.singleAmt + '/笔 ' + this.state.dayAmt + '/日'}</SText>
                        </View>
                    </View>

                    <View style={{backgroundColor: 'white', marginTop: 10}}>

                        <View style={{flexDirection: 'row', alignItems: 'center', flex:1}}>

                            {

                                support_quick_deposit === 1 ?
                                    <TouchableOpacity
                                        style={this.state.deposit_style === 0 ? styles.deposit_container_selected : styles.deposit_container_deselected}
                                        onPress={() => {
                                            this.setState({
                                                deposit_style: 0
                                            })

                                        }}
                                        activeOpacity={.8}

                                    >
                                        <SText
                                            style={this.state.deposit_style === 0 ? styles.deposit_title_selected : styles.deposit_title_deselected}>快捷充值</SText>
                                    </TouchableOpacity> : null

                            }

                            {
                                !(this.props.account.account_open_type == 2 && this.props.account.bind_bank_card_type == 1) ?
                                    <View style={{flexDirection: 'row', alignItems: 'center', flex:1}}>
                                        <View style={{
                                            width: .5,
                                            height: 30,
                                            marginRight: -0.5,
                                            backgroundColor: FontAndColor.COLORA4
                                        }}/>

                                        <TouchableOpacity
                                            style={this.state.deposit_style === 1 ? styles.deposit_container_selected : styles.deposit_container_deselected}
                                            onPress={() => {
                                                this.setState({
                                                    deposit_style: 1
                                                })
                                            }}
                                            activeOpacity={.8}
                                        >
                                            <SText
                                                style={this.state.deposit_style === 1 ? styles.deposit_title_selected : styles.deposit_title_deselected}>非快捷充值</SText>
                                        </TouchableOpacity>

                                    </View> : null

                            }

                        </View>

                        {
                            this.state.deposit_style === 0 ?
                                <View style={{marginHorizontal: 15,}}>
                                    <View style={{
                                        borderBottomWidth: StyleSheet.hairlineWidth,
                                        borderBottomColor: FontAndColor.COLORA4
                                    }}>
                                        <SText style={{marginVertical: 15, fontSize: 15}}>充值金额（元）</SText>
                                        <View style={{flexDirection: 'row',}}>
                                            <SText style={{marginRight: 5, marginTop: 5, fontSize: 14}}>￥</SText>
                                            <TextInput
                                                ref='money_input'
                                                style={{
                                                    height: 40,
                                                    fontSize: Pixel.getPixel(35),
                                                    flex: 1,
                                                    marginBottom: 15,
                                                    padding: 0
                                                }}
                                                keyboardType={'numeric'}
                                                underlineColorAndroid={"#00000000"}
                                                onChangeText={(text) => {

                                                    this.setState({
                                                        money_input: text
                                                    })
                                                }}
                                                value={this.state.money_input}
                                            />
                                        </View>
                                    </View>
                                    <View style={{paddingVertical: 10}}>
                                        <View style={{flexDirection: 'row', marginBottom: 5}}>
                                            <SText
                                                style={{color: FontAndColor.COLORA1}}>{this.props.account.bank_name}现金余额:</SText>
                                            <SText>{this.state.total_amount}元</SText>
                                        </View>

                                    </View>
                                </View>
                                :
                                <View style={{marginHorizontal: 15}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 20}}>
                                        {deposit_data.map((data) => {
                                            return <DepositItem
                                                key={data.title}
                                                image={data.image}
                                                title={data.title}
                                            />
                                        })
                                        }

                                    </View>
                                    <SText style={{color: FontAndColor.COLORA1,}}>您也可以使用您的银行卡，通过线下转账（柜台、网银、手机银行）的方式将资金充值到您的浙商银行账户下。</SText>
                                    <View style={{
                                        borderBottomColor: FontAndColor.COLORA4,
                                        borderBottomWidth: StyleSheet.hairlineWidth,
                                        marginVertical: 15
                                    }}/>
                                    <SText style={{fontWeight: 'bold', marginBottom: 5}}>转账时填写的信息如下：</SText>
                                    <SText style={{
                                        fontWeight: 'bold',
                                        marginBottom: 5
                                    }}>收款人姓名：{this.props.account.bank_card_name}</SText>
                                    <SText style={{
                                        fontWeight: 'bold',
                                        marginBottom: 5
                                    }}>收款人账号：{this.props.account.cz_elec_account}</SText>
                                    <SText style={{fontWeight: 'bold', marginBottom: 25}}>收款银行：浙商银行杭州玉泉支行</SText>

                                </View>

                        }

                    </View>

                    {this.state.deposit_style === 0 ?

                        <MyButton
                            buttonType={MyButton.TEXTBUTTON}
                            content={'下一步'}
                            parentStyle={styles.next_button_parent}
                            childStyle={{fontSize: 18, color: 'white'}}
                            mOnPress={() => {

                                let money = parseFloat(this.state.money_input)
                                if (money <= 0 || this.state.money_input === null || this.state.money_input === '') {
                                    this.props.showToast('请输入金额')
                                    return;
                                }

                                this.setState({
                                    sms_pad: true
                                })
                            }}

                        />
                        : null

                    }
                    {this.state.deposit_style === 0 ?


                        <View style={{marginHorizontal: 30, marginVertical: 40, alignItems:'center'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
                                <View style={{
                                    height: 1,
                                    backgroundColor: FontAndColor.COLORA4,
                                    flex: 1,
                                    marginRight: 15
                                }}/>
                                <SText style={{color: FontAndColor.COLORA1}}>温馨提示</SText>
                                <View style={{
                                    height: 1,
                                    backgroundColor: FontAndColor.COLORA4,
                                    flex: 1,
                                    marginLeft: 15
                                }}/>
                            </View>
                            <SText style={{color: FontAndColor.COLORA1, marginBottom: 5, lineHeight: 20}}>
                                快捷入金T+1日可提现，不影响交易哦~</SText>


                        </View>
                        : null

                    }

                </ScrollView>


                {this.state.sms_pad ?
                    <SmsFillScene
                        showToast={this.props.showToast}
                        showModal={this.props.showModal}
                        money={parseFloat(this.state.money_input)}
                        account={this.props.account}
                        type={1}
                        closeCallBack={() => {
                            this.setState({
                                sms_pad: false
                            })
                        }}
                        codeCallBack={this.deposit}
                    />
                    : null
                }
                {this.out_of_service()}

            </View>

        )
    }


    //充值
    deposit = (sms_code, sms_no) => {


        this.props.showModal(true)
        this.dismissKeyboard()

        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code === 1) {
                let result = JSON.parse(data.result)
                let params = {
                    amount: parseFloat(this.state.money_input),
                    enter_base_id: result.company_base_id,
                    sub_acct_no: this.props.account.bank_card_no,
                    sms_code: sms_code,
                    sms_no: sms_no ? sms_no : "000000"

                }

                request(AppUrls.ZS_DEPOSIT, 'POST', params).then((response) => {
                    this.props.showModal(false)
                    this.setState({
                        sms_pad: false
                    })

                    this.toNextPage({
                        component: ResultIndicativeScene,
                        name: 'ResultIndicativeScene',
                        params: {
                            type: 2,
                            status: 1,
                            params: params,
                            callBack: this.props.callBack,
                        }
                    })

                }, (error) => {
                    this.props.showModal(false)
                    this.setState({
                        sms_pad: false
                    })

                    if(error.mycode === 8050324){  // 不在服务时间内
                        this.setState({
                            out_of_service_msg:error.mjson.msg,
                            alert:true
                        })
                        return
                    }

                    if (error.mycode === 8010007) {  //存疑
                        this.toNextPage({
                            component: ResultIndicativeScene,
                            name: 'ResultIndicativeScene',
                            params: {
                                type: 2,
                                status: 0,
                                account: params,
                                error: error.mjson,
                                callBack: this.props.callBack,
                            }
                        })

                    } else if (error.mycode === -300 || error.mycode === -500) {
                        this.props.showToast(error.mjson.msg)
                    } else {
                        this.toNextPage({
                            component: ResultIndicativeScene,
                            name: 'ResultIndicativeScene',
                            params: {
                                type: 2,
                                status: 2,
                                account: params,
                                error: error.mjson,
                                callBack: this.props.callBack,
                            }
                        })

                    }

                })
            }
        })
    }
}


class DepositItem extends Component {
    render() {
        return (
            <View style={{alignItems: 'center', flex: 1}}>
                <Image style={{width: 60, height: 60, marginBottom: 10}} source={this.props.image}/>
                <SText style={{fontSize: 16}}>{this.props.title}</SText>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    deposit_container_selected: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: FontAndColor.COLORB0,
        borderBottomWidth: 1,
        height: 50
    },
    deposit_container_deselected: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: FontAndColor.COLORA4,
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 50
    },

    deposit_title_selected: {
        color: FontAndColor.COLORB0,
        fontSize: 16,
    },
    deposit_title_deselected: {
        color: 'black',
        fontSize: 16,
    },
    next_button_parent: {
        backgroundColor: FontAndColor.COLORB0,
        marginTop: 30,
        height: 50,
        width: width - 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        borderRadius: 3,
    },


})