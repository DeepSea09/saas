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
    Platform,
    InteractionManager,
    TouchableWithoutFeedback
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
import AccountInfoScene from './AccountInfoScene';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import RepaymenyTabBar from '../../finance/repayment/component/RepaymenyTabBar';
import FlowAllPage from './pager/FlowAllPage';
import FlowRechargePage from './pager/FlowRechargePage';
import FlowWithdrawalsPage from './pager/FlowWithdrawalsPage';
import FlowTransactionPage from './pager/FlowTransactionPage';
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";
import SelectDate from './component/SelectDate';
let index = 0;
export  default class AccountFlowScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        this.hight = Platform.OS === 'android' ? height + Pixel.getPixel(25) : height;
        this.state = {
            renderPlaceholderOnly: 'blank',
            mbTimeShow: false,
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
                        if (obj[StorageKeyNames.HF_TRANSACTION_LOG] == null) {
                            obj[StorageKeyNames.HF_TRANSACTION_LOG] = false;
                            StorageUtil.mSetItem(String(userData['base_user_id'] + StorageKeyNames.HF_INDICATIVE_LAYER), JSON.stringify(obj), () => {
                            })
                        }
                        this.setState({
                            renderPlaceholderOnly: 'success',
                            mbTimeShow: obj[StorageKeyNames.HF_TRANSACTION_LOG],
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
                <ScrollableTabView
                    style={{marginTop: Pixel.getTitlePixel(64), flex: 1}}
                    initialPage={0}
                    locked={true}
                    onChangeTab={(obj) => {
                            index = obj.i;
                        }
                    }
                    renderTabBar={() => <RepaymenyTabBar tabName={['全部','充值', "转账",'提现','放/还款','交易']}/>}
                >
                    {/*/!*全部*!/*/}
                    {/*<FlowAllPage ref="flowallpage" tabLabel="ios-paper0" transfer_type="all"/>*/}
                    {/*/!*充值*!/*/}
                    {/*<FlowRechargePage ref="flowrechargepage" tabLabel="ios-paper1"/>*/}
                    {/*/!*转账*!/*/}
                    {/*<FlowTransactionPage ref="flowtransactionpage" tabLabel="ios-paper2"/>*/}
                    {/*/!*提现*!/*/}
                    {/*<FlowWithdrawalsPage ref="flowwithdrawalspage" tabLabel="ios-paper3"/>*/}
                    {/*/!*还款*!/*/}
                    {/*<FlowWithdrawalsPage ref="flowrepaymentpage" tabLabel="ios-paper4"/>*/}
                    {/*/!*交易*!/*/}
                    {/*<FlowAllPage ref="flowtransactionpage" tabLabel="ios-paper5" transfer_type="0,3,4,104,105"/>*/}
                    {/*全部*/}
                    <FlowAllPage ref="flowallpage" tabLabel="ios-paper0" transfer_type="all"/>
                    {/*充值*/}
                    <FlowAllPage ref="flowrechargepage" tabLabel="ios-paper1" transfer_type="3"/>
                    {/*转账*/}
                    <FlowAllPage ref="flowtransactionpage" tabLabel="ios-paper2" transfer_type="0"/>
                    {/*提现*/}
                    <FlowAllPage ref="flowwithdrawalspage" tabLabel="ios-paper3" transfer_type="4"/>
                    {/*还款*/}
                    <FlowAllPage ref="flowrepaymentpage" tabLabel="ios-paper4" transfer_type="100,101"/>
                    {/*交易*/}
                    <FlowAllPage ref="flowtransactionpage" tabLabel="ios-paper5" transfer_type="104"/>

                </ScrollableTabView>
                <SelectDate ref="selectdate" callBack={(time)=>{
                    console.log(time+'----------'+index);
                       if(index==1){
                            this.refs.flowrechargepage.changeTime(time);
                       }else if(index==2){
                            this.refs.flowtransactionpage.changeTime(time);
                       }else if(index==3){
                            this.refs.flowwithdrawalspage.changeTime(time);
                       } else if(index==4){
                            this.refs.flowrepaymentpage.changeTime(time);
                       } else if(index==5){
                            this.refs.flowtransactionpage.changeTime(time);
                       }else if (index==0){
                             this.refs.flowallpage.changeTime(time);
                       }

                }}/>
                <NavigationView
                    title="账户流水"
                    backIconClick={this.backPage}
                    renderRihtFootView={this._navigatorRightView}
                />
                {
                    this.state.mbTimeShow == false ?
                        <View style={{position: 'absolute',bottom:0,top:0,width:width}}>
                            <TouchableWithoutFeedback

                                onPress={() => {
                                    StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data) => {
                                        if (data.code == 1) {
                                            let userData = JSON.parse(data.result);
                                            StorageUtil.mGetItem(String(userData['base_user_id'] + StorageKeyNames.HF_INDICATIVE_LAYER), (subData) => {
                                                if (subData.code == 1) {
                                                    let obj = JSON.parse(subData.result);
                                                    obj[StorageKeyNames.HF_TRANSACTION_LOG] = true;
                                                    StorageUtil.mSetItem(String(userData['base_user_id'] + StorageKeyNames.HF_INDICATIVE_LAYER), JSON.stringify(obj), () => {
                                                    })
                                                    this.setState({
                                                        mbTimeShow: obj[StorageKeyNames.HF_TRANSACTION_LOG],
                                                    })
                                                }

                                            })
                                        }
                                    })

                                }}

                            >
                                <Image style={{width:width,resizeMode:'stretch',flex:1}}
                                       source={Platform.OS === 'android'?require('../../../images/tishimengban/lssj_android.png'):require('../../../images/tishimengban/lssj.png')}/>
                            </TouchableWithoutFeedback>
                        </View> : null
                }
            </View>
        );
    }

    _navigatorRightView = () => {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => {
                    this.refs.selectdate.changeVisible(true);
            }}>
                <Image style={{width:Pixel.getPixel(20),height:Pixel.getPixel(20)}}
                       source={require('../../../images/mainImage/selecttime.png')}/>
            </TouchableOpacity>
        );
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor: fontAndColor.COLORA3}}>
                {this.loadView()}
                <NavigationView
                    title="账户流水"
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
        height: Pixel.getPixel(10),

    },
    margin: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)

    },
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'}
})