/**
 * Created by lhc on 2017/2/15.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Platform,
    Text,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    ListView,
    InteractionManager,
    TouchableWithoutFeedback,
    RefreshControl
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../constant/fontAndColor';
import BaseComponent from '../../component/BaseComponent';
import NavigationView from '../../component/AllNavigationView';
import {request} from '../../utils/RequestUtil';
import * as Urls from '../../constant/appUrls';
import AccountTitle from './component/AccountTitle';
import RechargeScene from './RechargeScene';
import WithdrawalsScene from './WithdrawalsScene';
import BankCardScene from './BankCardScene';
import AccountFlowScene from './AccountFlowScene';
import AccountSettingScene from './AccountSettingScene';
import FrozenScene from './FrozenScene';
import TransferScene from './TransferScene';
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";
import * as webBackUrl from "../../constant/webBackUrl";
import AccountWebScene from './AccountWebScene';
import OpenTrustAccountView from "./component/OpenTrustAccountView";
export  default class AccountScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        this.hight = Platform.OS === 'android' ? height + Pixel.getPixel(25) : height;
        this.state = {
            renderPlaceholderOnly: 'blank',
            source: [],
            info: {},
            enter_id: '',
            isRefreshing: false,
            mbCzShow: false,
            mbTxShow: false,
            mbZhShow: false,
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
                        if (obj[StorageKeyNames.HF_ACCOUNT_TRANSFER] == null) {
                            obj[StorageKeyNames.HF_ACCOUNT_TRANSFER] = false;
                            obj[StorageKeyNames.HF_ACCOUNT_DEPOSIT] = false;
                            obj[StorageKeyNames.HF_ACCOUNT_WITHDRAW] = false;
                            StorageUtil.mSetItem(String(userData['base_user_id'] + StorageKeyNames.HF_INDICATIVE_LAYER), JSON.stringify(obj), () => {})
                        }
                        this.setState({

                            mbCzShow: obj[StorageKeyNames.HF_ACCOUNT_DEPOSIT] ,
                            mbTxShow: obj[StorageKeyNames.HF_ACCOUNT_WITHDRAW],
                            mbZhShow: obj[StorageKeyNames.HF_ACCOUNT_TRANSFER],

                        })
                    }
                })
            }
        })

        this.getData()
        // let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        // this.setState({
        //     renderPlaceholderOnly:'success',
        //     source:ds.cloneWithRows([1,2,3,4,5,6,7])
        // });
    }

    allRefresh = () => {
        this.setState({
            renderPlaceholderOnly: 'loading'
        });
        this.getData()
    }

    getData = () => {
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                this.isOpenContract = datas.is_open_electron_repayment_contract;
                let maps = {
                    enter_base_ids: datas.company_base_id,
                    child_type: '1'
                };
                request(Urls.USER_ACCOUNT_INFO, 'Post', maps)
                    .then((response) => {
                            //this.getAccountData(datas.company_base_id, response.mjson.data.account.account_open_type)
                            /*                            let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                             this.setState({
                             renderPlaceholderOnly: 'success',
                             source: ds.cloneWithRows([1]),
                             info: response.mjson.data.account,
                             enter_id: datas.company_base_id,
                             isRefreshing:false

                             });*/
                            this.getTrustAccountState(datas.company_base_id, response.mjson.data.account);
                        },
                        (error) => {
                            this.props.showToast('用户信息查询失败');
                            this.setState({
                                renderPlaceholderOnly: 'error',
                                isRefreshing: false
                            });
                        });
            } else {
                this.props.showToast('用户信息查询失败');
                this.setState({
                    renderPlaceholderOnly: 'error',
                    isRefreshing: false
                });
            }
        })
    }

    /**
     *   获取信托账户状态
     **/
    getTrustAccountState = (enterBaseIds, info) => {
        let maps = {
            enter_base_ids: enterBaseIds,
            child_type: '1',
            bank_id: 'zsyxt'
        };
        request(Urls.GET_USER_ACCOUNT_DETAIL, 'Post', maps)
            .then((response) => {
                this.props.showModal(false);
                //console.log('USER_ACCOUNT_INFO=====', response.mjson.data['zsyxt'].status);
                this.trustAccountState = response.mjson.data['zsyxt'][0].status;
                this.accountOpenType = info.account_open_type;
                let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                this.setState({
                    renderPlaceholderOnly: 'success',
                    source: ds.cloneWithRows([1]),
                    info: info,
                    enter_id: enterBaseIds,
                    isRefreshing: false
                });
                /*                if (info.account_open_type == 2 && this.trustAccountState == 0) {
                 this.refs.openAccount.changeState(true);
                 this.getTrustContract();
                 }*/
            }, (error) => {
                this.props.showModal(false);
                this.props.showToast(error.mjson.msg);
                this.setState({
                    renderPlaceholderOnly: 'error',
                    isRefreshing: false
                });
            });
    };

    /**
     *   获取信托相关可供浏览的合同
     **/
    getTrustContract = () => {
        this.props.showModal(true);
        let maps = {
            source_type: '3',
            fund_channel: '信托'
        };
        request(Urls.AGREEMENT_LISTS, 'Post', maps)
            .then((response) => {
                this.props.showModal(false);
                //console.log('USER_ACCOUNT_INFO=====', response.mjson.data['zsyxt'].status);
                /*                this.toNextPage({
                 name: 'AccountFlowScene',
                 component: AccountFlowScene, params: {}
                 })*/
                this.contractList = response.mjson.data.list;
                this.refs.openAccount.changeStateWithData(true, this.contractList);
            }, (error) => {
                this.props.showModal(false);
                this.props.showToast(error.mjson.msg);
            });
    };

    getAccountData = (id, type) => {
        let maps = {
            enter_base_id: id,
            user_type: type,
            transfer_type: '0,3,4,104'
        };
        request(Urls.USER_ACCOUNT_INDEX, 'Post', maps)
            .then((response) => {

                    if (response.mjson.data.info.status != '3') {
                        this.props.callBack();
                        this.backPage();
                    } else {
                        if (response.mjson.data.payLogs == null || response.mjson.data.payLogs.length <= 0) {
                            let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                            this.setState({
                                renderPlaceholderOnly: 'success',
                                source: ds.cloneWithRows([1]),
                                info: response.mjson.data.info,
                                enter_id: id,
                                isRefreshing: false

                            });
                        } else {
                            let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                            this.setState({
                                renderPlaceholderOnly: 'success',
                                // source: ds.cloneWithRows(response.mjson.data.payLogs),
                                source: ds.cloneWithRows([1]),
                                info: response.mjson.data.info,
                                enter_id: id,
                                isRefreshing: false
                            });
                        }
                    }
                },
                (error) => {
                    this.props.showToast('用户信息查询失败');
                    this.setState({
                        renderPlaceholderOnly: 'error',
                        isRefreshing: false
                    });
                });
    }


    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        }
        return (
            <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1}}>
                <ListView
                    removeClippedSubviews={false}
                    style={{marginTop: Pixel.getTitlePixel(64)}}
                    dataSource={this.state.source}
                    renderRow={this._renderRow}
                    renderHeader={this._renderHeader}
                    //renderSeparator={this._renderSeparator}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.refreshingData}
                            tintColor={[fontAndColor.COLORB0]}
                            colors={[fontAndColor.COLORB0]}
                        />
                    }
                />
                <View style={{height: 1}}/>
                <View style={{
                    width: width, height: Pixel.getPixel(44), backgroundColor: fontAndColor.COLORA3,
                    flexDirection: 'row',
                }}>
                    <TouchableOpacity onPress={() => {
                        this.toNextPage({
                            name: 'WithdrawalsScene',
                            component: WithdrawalsScene, params: {
                                callBack: () => {
                                    this.allRefresh()
                                }, money: this.state.info.balance
                            }
                        })
                    }} activeOpacity={0.8}
                                      style={{
                                          flex: 1,
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          backgroundColor: '#fff'
                                      }}>
                        <Text allowFontScaling={false}
                              style={{color: fontAndColor.COLORB0, fontSize: Pixel.getFontPixel(15)}}>提现</Text>
                    </TouchableOpacity>
                    <View style={{
                        width: 1, justifyContent: 'center',
                        alignItems: 'center', height: Pixel.getPixel(44)
                    }}></View>
                    <TouchableOpacity onPress={() => {
                        this.toNextPage({name: 'RechargeScene', component: RechargeScene, params: {}})
                    }} activeOpacity={0.8}
                                      style={{
                                          flex: 1,
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          backgroundColor: '#fff'
                                      }}>
                        <Text allowFontScaling={false}
                              style={{color: fontAndColor.COLORB0, fontSize: Pixel.getFontPixel(15)}}>充值</Text>
                    </TouchableOpacity>
                </View>
                <NavigationView
                    title="账户管理"
                    backIconClick={this.backPage}
                />
                {/*                <OpenTrustAccountView ref="openAccount" callBack={this.openTrustAccount}
                 showModal={this.props.showModal}
                 navigator={this.props.navigator}/>*/}
                {
                    this.state.mbZhShow == false ?
                        <View style={{position: 'absolute',bottom:0,top:0,width:width}}>
                            <TouchableWithoutFeedback

                                onPress={()=>{

                                    StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data)=>{
                                        if (data.code ==1){
                                            let userData = JSON.parse(data.result);
                                            StorageUtil.mGetItem( String(userData['base_user_id']+StorageKeyNames.HF_INDICATIVE_LAYER) ,(subData)=>{
                                                if (subData.code == 1){
                                                    let obj = JSON.parse(subData.result);
                                                    obj[StorageKeyNames.HF_ACCOUNT_TRANSFER] = true;
                                                    StorageUtil.mSetItem(String(userData['base_user_id']+StorageKeyNames.HF_INDICATIVE_LAYER), JSON.stringify(obj), ()=>{
                                                        this.setState({
                                                            mbCzShow: obj[StorageKeyNames.HF_ACCOUNT_DEPOSIT] ,
                                                            mbTxShow: obj[StorageKeyNames.HF_ACCOUNT_WITHDRAW],
                                                            mbZhShow: obj[StorageKeyNames.HF_ACCOUNT_TRANSFER],
                                                        })

                                                    })

                                                }
                                            })
                                        }
                                    })

                                }}

                            >
                                <Image
                                    style={{width:width, height:Pixel.getPixel(660),resizeMode:'stretch'}}
                                    source={Platform.OS === 'android'?require('../../../images/tishimengban/zhgl_zz_android.png'):require('../../../images/tishimengban/zhgl_zhuanzhang.png')}/>
                            </TouchableWithoutFeedback>
                            <View style = {{flex:1, backgroundColor:'rgba(0,0,0,.7)'}}/>
                        </View> : null
                }
                {
                    this.state.mbTxShow == false && this.state.mbZhShow == true ?
                        <View style={{position: 'absolute',top:0,bottom:0,left:0,right:0}}>
                            <TouchableWithoutFeedback
                                onPress={()=>{

                                    StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data)=>{
                                        if (data.code ==1){
                                            let userData = JSON.parse(data.result);
                                            StorageUtil.mGetItem( String(userData['base_user_id']+StorageKeyNames.HF_INDICATIVE_LAYER) ,(subData)=>{
                                                if (subData.code == 1){
                                                    let obj = JSON.parse(subData.result);
                                                    obj[StorageKeyNames.HF_ACCOUNT_WITHDRAW] = true;
                                                    StorageUtil.mSetItem(String(userData['base_user_id']+StorageKeyNames.HF_INDICATIVE_LAYER), JSON.stringify(obj), ()=>{
                                                        this.setState({
                                                            mbCzShow: obj[StorageKeyNames.HF_ACCOUNT_DEPOSIT] ,
                                                            mbTxShow: obj[StorageKeyNames.HF_ACCOUNT_WITHDRAW],
                                                            mbZhShow: obj[StorageKeyNames.HF_ACCOUNT_TRANSFER],
                                                        })

                                                    })

                                                }
                                            })
                                        }
                                    })

                                }}
                            >
                                <Image style={{flex:1,width:width,resizeMode:'stretch'}}
                                       source={require('../../../images/tishimengban/zhgl_tx.png')}/>
                            </TouchableWithoutFeedback>
                        </View> : null
                }
                {
                    this.state.mbCzShow == false && this.state.mbZhShow == true && this.state.mbTxShow == true ?
                        <View style={{position: 'absolute',top:0,bottom:0,left:0,right:0}}>
                            <TouchableWithoutFeedback

                                onPress={()=>{

                                    StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data)=>{
                                        if (data.code ==1){
                                            let userData = JSON.parse(data.result);
                                            StorageUtil.mGetItem( String(userData['base_user_id']+StorageKeyNames.HF_INDICATIVE_LAYER) ,(subData)=>{
                                                if (subData.code == 1){
                                                    let obj = JSON.parse(subData.result);
                                                    obj[StorageKeyNames.HF_ACCOUNT_DEPOSIT] = true;
                                                    StorageUtil.mSetItem(String(userData['base_user_id']+StorageKeyNames.HF_INDICATIVE_LAYER), JSON.stringify(obj), ()=>{
                                                        this.setState({
                                                            mbCzShow: obj[StorageKeyNames.HF_ACCOUNT_DEPOSIT] ,
                                                            mbTxShow: obj[StorageKeyNames.HF_ACCOUNT_WITHDRAW],
                                                            mbZhShow: obj[StorageKeyNames.HF_ACCOUNT_TRANSFER],
                                                        })

                                                    })

                                                }
                                            })
                                        }
                                    })

                                }}
                            >
                                <Image style={{flex:1,width:width,resizeMode:'stretch'}}
                                       source={require('../../../images/tishimengban/zhgl_cz.png')}/>
                            </TouchableWithoutFeedback>
                        </View> : null
                }
            </View>
        );
    }

    /**
     *   变更信托账户开户状态
     **/
    changeTrustAccountState = (newState) => {
        this.trustAccountState = newState;
    };

    /**
     *   开通信托账户
     **/
    openTrustAccount = () => {
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1) {
                let datas = JSON.parse(data.result);
                let maps = {
                    enter_base_id: datas.company_base_id
                    //enter_base_id: 8018
                };
                request(Urls.OPEN_PERSON_TRUST_ACCOUNT, 'Post', maps)
                    .then((response) => {
                        this.props.showModal(false);
                        this.props.showToast('升级成功');
                        this.trustAccountState = 3;
                        // 此接口未返回开户成功后的账户状态，手动置为3，
                        // 配合setState用以触发AccountTitle中componentWillReceiveProps生命周期方法
                        this.setState({
                            enter_id: datas.company_base_id
                        });
                    }, (error) => {
                        this.props.showModal(false);
                        this.props.showToast(error.mjson.msg);
                    });
            } else {
                this.props.showModal(false);
                this.props.showToast('升级失败');
            }
        });
    };

    refreshingData = () => {
        this.setState({isRefreshing: true});
        this.getData();
    };

    _renderRow = (movie, sectionId, rowId) => {
        if (movie == '1') {
            return (<View></View>);
        } else {
            return (
                <View style={{
                    width: width, height: Pixel.getPixel(72), backgroundColor: '#fff', flexDirection: 'row',
                    paddingRight: Pixel.getPixel(15), paddingLeft: Pixel.getPixel(15)
                }}>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <Text allowFontScaling={false} style={{color: '#000', fontSize: Pixel.getPixel(14)}}>
                            {movie.operate_name}
                        </Text>
                        <Text allowFontScaling={false}
                              style={{color: fontAndColor.COLORA1, fontSize: Pixel.getPixel(12)}}>
                            {movie.create_time}
                        </Text>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
                        <Text allowFontScaling={false} style={{color: '#000', fontSize: Pixel.getPixel(20)}}>
                            {movie.amount}
                        </Text>
                    </View>
                </View>
            )
        }
    }
    _renderHeader = () => {
        return (
            <AccountTitle trustAccountState={this.trustAccountState}
                          info={this.state.info}
                          bankCard={() => {
                              this.toNextPage({
                                  name: 'BankCardScene',
                                  component: BankCardScene, params: {
                                      callBack: () => {
                                          this.props.callBack()
                                      }
                                  }
                              })
                          }}
                          flow={() => {
                              this.toNextPage({
                                  name: 'AccountFlowScene',
                                  component: AccountFlowScene, params: {}
                              })
                          }}
                          changePwd={() => {
                              let maps = {
                                  user_type: this.state.info.account_open_type,
                                  reback_url: webBackUrl.CHANGEPWD,
                                  enter_base_id: this.state.enter_id
                              }
                              this.getWebUrl(Urls.USER_ACCOUNT_EDITPAYPWD, maps, '修改交易密码',
                                  webBackUrl.CHANGEPWD);
                          }}
                          resetPwd={() => {
                              let maps = {
                                  user_type: this.state.info.account_open_type,
                                  reback_url: webBackUrl.RESETPWD,
                                  enter_base_id: this.state.enter_id
                              }
                              this.getWebUrl(Urls.USER_ACCOUNT_RESETPAYPWD, maps, '重置交易密码',
                                  webBackUrl.RESETPWD);
                          }}
                          changePhone={() => {
                              let maps = {
                                  user_type: this.state.info.account_open_type,
                                  reback_url: webBackUrl.CHANGEPHONE,
                                  enter_base_id: this.state.enter_id
                              }
                              this.getWebUrl(Urls.USER_BANK_EDITPHONE, maps, '修改手机号',
                                  webBackUrl.CHANGEPHONE);
                          }}
                          accountSetting={() => {

                              StorageUtil.mGetItem(StorageKeyNames.USER_INFO, ((data) => {
                                  console.log(data);
                                  if (data.code == 1 && data.result) {
                                      let userInfo = JSON.parse(data.result);
                                          this.toNextPage({
                                              name: 'AccountSettingScene',
                                              component: AccountSettingScene, params: {
                                                  protocolType: this.isOpenContract,
                                                  accountOpenType: this.accountOpenType,
                                                  trustAccountState: this.trustAccountState,
                                                  changeState: this.changeTrustAccountState,
                                                  userLevel: userInfo.user_level
                                              }
                                          })
                                  }
                              }));


                          }
                          }
                          moreFlow={() => {
                              this.toNextPage({
                                  name: 'AccountFlowScene',
                                  component: AccountFlowScene, params: {}
                              })
                          }}
                          frozen={() => {
                              {/*this.toNextPage({name:'FrozenScene',component:FrozenScene,params:{}})*/
                              }
                          }}
                          copy={(number) => {
                              this.props.showToast(number);
                          }}
                          transfer={() => {
                              this.toNextPage({
                                  name: 'TransferScene',
                                  component: TransferScene, params: {
                                      money: this.state.info.balance, callBack: () => {
                                          this.allRefresh()
                                      }
                                  }
                              })
                          }}
                /*                          openTrustAccount={() => {
                 this.refs.openAccount.changeState(true);
                 this.getTrustContract();
                 }}*/
            />
        )
    }

    getWebUrl = (url, maps, title, backUrl) => {
        this.props.showModal(true);
        request(url, 'Post', maps)
            .then((response) => {
                    this.props.showModal(false);
                    this.toNextPage({
                        name: 'AccountWebScene', component: AccountWebScene, params: {
                            title: title,
                            webUrl: response.mjson.data.auth_url +
                            '?authTokenId=' + response.mjson.data.auth_token,
                            callBack: () => {
                                this.allRefresh()
                            }, backUrl: backUrl
                        }
                    });
                },
                (error) => {
                    this.props.showModal(false);
                    if (error.mycode == -300 || error.mycode == -500) {
                        this.props.showToast('网络连接失败');
                    } else {
                        this.props.showToast(error.mjson.msg);
                    }
                });
    }

    _renderSeparator(sectionId, rowId) {
        return (
            <View style={styles.Separator} key={sectionId + rowId}>
            </View>
        )
    }


    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height, backgroundColor: fontAndColor.COLORA3}}>
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
})