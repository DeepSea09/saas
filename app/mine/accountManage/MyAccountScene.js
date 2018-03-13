/**
 * Created by hanmeng on 2017/10/30.
 *  恒丰银行、浙商银行统一账户管理页面
 *  页面接口调用规则:
 *  旧：恒丰数据 -> 浙商开关接口 -> 白名单 -> 浙商数据(如在白名单)
 *  新：浙商开关接口 -> 关：恒丰数据
 *                 -> 开：白名单  -> 在：所有银行数据
 *                               -> 不在：恒丰数据
 */
import React, {Component, PropTypes} from 'react'
import {
    StyleSheet,
    Platform,
    View,
    Text,
    ListView,
    TouchableOpacity,
    Image,
    BackAndroid,
    RefreshControl,
    Dimensions,
    TouchableWithoutFeedback
} from  'react-native'

const {width, height} = Dimensions.get('window');
import BaseComponent from "../../component/BaseComponent";
import * as fontAndColor from '../../constant/fontAndColor';
import NavigatorView from '../../component/AllNavigationView';
import PixelUtil from '../../utils/PixelUtil'
import {request} from "../../utils/RequestUtil";
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";
import MyAccountItem from "./component/MyAccountItem";
import AccountManageScene from "./AccountManageScene";
import * as Urls from '../../constant/appUrls';

var Pixel = new PixelUtil();

export default class MyAccountScene extends BaseComponent {

    navigatorParams = {
        name: 'AccountManageScene',
        component: AccountManageScene,
        params: {}
    };

    // 构造
    constructor(props) {
        super(props);
        this.hengFengInfo = {};
        this.zheShangInfo = {};
        this.lastType = '-1';
        this.hight = Platform.OS === 'android' ? height + Pixel.getPixel(25) : height;
        this.state = {
            dataSource: [],
            renderPlaceholderOnly: 'blank',
            isRefreshing: false,
            backColor: fontAndColor.COLORA3,

        };
    }

    componentDidMount() {
        try {
            BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
        } catch (e) {

        } finally {
            //InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: 'loading'});
            this.initFinish();
            //});
        }
    }

    initFinish = () => {
        /*        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
         this.setState({
         dataSource: ds.cloneWithRows(['0', '1']),
         renderPlaceholderOnly: 'success'
         });*/

        StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data) => {
            if (data.code == 1) {
                let userData = JSON.parse(data.result);
                StorageUtil.mGetItem(String(userData['base_user_id'] + StorageKeyNames.HF_INDICATIVE_LAYER), (subData) => {
                    if (subData.code == 1) {
                        let obj = JSON.parse(subData.result);
                        if (obj == null) {
                            obj = {};
                        }
                        if (obj[StorageKeyNames.HF_ACCOUNT_DO_NOT_OPEN_ACCOUNT] == null) {
                            obj[StorageKeyNames.HF_ACCOUNT_DO_NOT_OPEN_ACCOUNT] = 0;
                            obj[StorageKeyNames.HF_ACCOUNT_DO_NOT_BIND_BANKCARD] = 0;
                            obj[StorageKeyNames.HF_ACCOUNT_DID_BIND_BANKCARD] = 0;
                            StorageUtil.mSetItem(String(userData['base_user_id'] + StorageKeyNames.HF_INDICATIVE_LAYER), JSON.stringify(obj), () => {})
                        }
                        this.setState({
                            mbWKHShow: obj[StorageKeyNames.HF_ACCOUNT_DO_NOT_OPEN_ACCOUNT] ,
                            mbWBKShow: obj[StorageKeyNames.HF_ACCOUNT_DO_NOT_BIND_BANKCARD],
                            mbKTShow:  obj[StorageKeyNames.HF_ACCOUNT_DID_BIND_BANKCARD],
                        })
                    }
                })
            }
        })

        this.loadData();
    };

    // 下拉刷新数据
    refreshingData = () => {
        this.setState({isRefreshing: true});
        this.loadData();
    };

    /**
     *  返回刷新数据
     **/
    allRefresh = () => {
        this.props.showModal(true);
        this.loadData();
        if (this.props.callBackData) {
            this.props.callBackData();
        }
    };

    /**
     *   页面起调，浙商开关接口
     **/
    loadData = () => {
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1) {
                let datas = JSON.parse(data.result);
                request(Urls.ZS_BANK_IS_SHOW, 'Post', {})
                    .then((response) => {
                        if (response.mjson.data.status === 1) {
                            this.getIsInWhiteList(datas.company_base_id);
                        } else {
                            this.getAccountInfo(datas.company_base_id, 315);
                        }
                    }, (error) => {
                        this.props.showModal(false);
                        this.props.showToast(error.mjson.msg);
                        this.setState({
                            renderPlaceholderOnly: 'error',
                            isRefreshing: false
                        });
                    });
            } else {
                this.props.showModal(false);
                this.props.showToast('用户信息查询失败');
                this.setState({
                    renderPlaceholderOnly: 'error',
                    isRefreshing: false
                });
            }
        });
    };

    /**
     *  查询是否在(浙商)白名单
     * @returns {XML}
     **/
    getIsInWhiteList = (companyBaseId) => {
        let maps = {
            enter_base_id: companyBaseId
        };
        request(Urls.IS_IN_WHITE_LIST, 'Post', maps)
            .then((response) => {
                let isWhiteList = response.mjson.data.status;
                if (isWhiteList === 0) {  //1 在白名单中，0 不在白名单中
                    this.getAccountInfo(companyBaseId, 315);
                } else {
                    this.getAccountInfo(companyBaseId);
                }
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
     *  获取账户数据
     * @returns {XML}
     **/
    getAccountInfo = (companyBaseId, bankId) => {
        let maps = {
            enter_base_ids: companyBaseId,
            child_type: '1',
            bank_id: bankId ? bankId : ''
        };
        request(Urls.GET_USER_ACCOUNT_DETAIL, 'Post', maps)
            .then((response) => {
                this.props.showModal(false);
                //console.log('USER_ACCOUNT_INFO=====', response.mjson.data);
                //this.hengFengInfo = response.mjson.data['315'][0] ? response.mjson.data['315'][0] : {};
                if (response.mjson.data['315'][0]) {
                    this.hengFengInfo = response.mjson.data['315'][0];


                    if (this.hengFengInfo.status == '0') {

                        StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data) => {
                            if (data.code == 1) {
                                let userData = JSON.parse(data.result);
                                StorageUtil.mGetItem(String(userData['base_user_id'] + StorageKeyNames.HF_INDICATIVE_LAYER), (subData) => {
                                    if (subData.code == 1) {
                                        let obj = JSON.parse(subData.result);

                                        if (obj[StorageKeyNames.HF_ACCOUNT_DO_NOT_OPEN_ACCOUNT] == 2){return}
                                        obj[StorageKeyNames.HF_ACCOUNT_DO_NOT_OPEN_ACCOUNT] = 1;
                                        StorageUtil.mSetItem(String(userData['base_user_id'] + StorageKeyNames.HF_INDICATIVE_LAYER), JSON.stringify(obj), () => {
                                        })
                                        this.setState({
                                            mbWKHShow: obj[StorageKeyNames.HF_ACCOUNT_DO_NOT_OPEN_ACCOUNT] ,
                                            mbWBKShow: 0,
                                            mbKTShow:  0,
                                        })
                                    }
                                })
                            }
                        })

                    } else if (this.hengFengInfo.status == '1') {

                        StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data) => {
                            if (data.code == 1) {
                                let userData = JSON.parse(data.result);
                                StorageUtil.mGetItem(String(userData['base_user_id'] + StorageKeyNames.HF_INDICATIVE_LAYER), (subData) => {
                                    if (subData.code == 1) {
                                        let obj = JSON.parse(subData.result);
                                        if (obj[StorageKeyNames.HF_ACCOUNT_DO_NOT_BIND_BANKCARD] == 2){return}
                                        obj[StorageKeyNames.HF_ACCOUNT_DO_NOT_BIND_BANKCARD] = 1;
                                        StorageUtil.mSetItem(String(userData['base_user_id'] + StorageKeyNames.HF_INDICATIVE_LAYER), JSON.stringify(obj), () => {
                                        })
                                        this.setState({
                                            mbWKHShow: obj[StorageKeyNames.HF_ACCOUNT_DO_NOT_OPEN_ACCOUNT] ,
                                            mbWBKShow: obj[StorageKeyNames.HF_ACCOUNT_DO_NOT_BIND_BANKCARD],
                                            mbKTShow:  0,
                                        })
                                    }
                                })
                            }
                        })

                    } else if (this.hengFengInfo.status == '3') {

                        StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data) => {
                            if (data.code == 1) {
                                let userData = JSON.parse(data.result);
                                StorageUtil.mGetItem(String(userData['base_user_id'] + StorageKeyNames.HF_INDICATIVE_LAYER), (subData) => {
                                    if (subData.code == 1) {
                                        let obj = JSON.parse(subData.result);
                                        if (obj[StorageKeyNames.HF_ACCOUNT_DID_BIND_BANKCARD] == 2){return}
                                        obj[StorageKeyNames.HF_ACCOUNT_DID_BIND_BANKCARD] = 1;
                                        StorageUtil.mSetItem(String(userData['base_user_id'] + StorageKeyNames.HF_INDICATIVE_LAYER), JSON.stringify(obj), () => {
                                        })
                                        this.setState({
                                            mbWKHShow: obj[StorageKeyNames.HF_ACCOUNT_DO_NOT_OPEN_ACCOUNT] ,
                                            mbWBKShow: obj[StorageKeyNames.HF_ACCOUNT_DO_NOT_BIND_BANKCARD],
                                            mbKTShow:  obj[StorageKeyNames.HF_ACCOUNT_DID_BIND_BANKCARD],
                                        })
                                    }
                                })
                            }
                        })


                    }
                    this.lastType = response.mjson.data['315'][0].status;
                    if (this.props.callBack) {

                        this.props.callBack(this.lastType);
                    }
                }
                this.zheShangInfo = response.mjson.data['316'][0] ? response.mjson.data['316'][0] : {};
                let dataList = [];
                if (bankId) {
                    dataList.push(bankId);
                } else {
                    dataList = ['315', '316'];
                }
                let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                this.setState({
                    dataSource: ds.cloneWithRows(dataList),
                    renderPlaceholderOnly: 'success',
                    isRefreshing: false,
                    backColor: fontAndColor.COLORB0
                });
            }, (error) => {
                this.props.showModal(false);
                this.props.showToast(error.mjson.msg);
                this.setState({
                    renderPlaceholderOnly: 'error',
                    isRefreshing: false
                });
            });
    };

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            // 加载中....
            return ( <View style={{
                flex: 1,
                backgroundColor: this.state.backColor
            }}>
                {this.loadView()}
                <NavigatorView title='我的账户' backIconClick={this.backPage}
                               renderRihtFootView={this.renderRihtFootView}/>
            </View>);
        } else {
            return (<View style={{
                flex: 1,
                backgroundColor: this.state.backColor
            }}>
                <NavigatorView title='我的账户' backIconClick={this.backPage}
                               renderRihtFootView={this.renderRihtFootView}/>
                <ListView style={{marginTop: Pixel.getTitlePixel(80)}}
                          dataSource={this.state.dataSource}
                          removeClippedSubviews={false}
                          renderRow={this._renderRow}
                          enableEmptySections={true}
                          renderSeparator={this._renderSeperator}
                          refreshControl={
                              <RefreshControl
                                  refreshing={this.state.isRefreshing}
                                  onRefresh={this.refreshingData}
                                  tintColor={[fontAndColor.COLORA3]}
                                  colors={[fontAndColor.COLORA3]}
                              />
                          }/>
                {
                    this.state.mbWKHShow == 1 ?
                        <View style={{position: 'absolute',bottom:0,top:0,width:width}}>
                            <TouchableWithoutFeedback
                                onPress={()=>{

                                    StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data) => {
                                        if (data.code == 1) {
                                            let userData = JSON.parse(data.result);
                                            StorageUtil.mGetItem(String(userData['base_user_id'] + StorageKeyNames.HF_INDICATIVE_LAYER), (subData) => {
                                                if (subData.code == 1) {
                                                    let obj = JSON.parse(subData.result);
                                                    obj[StorageKeyNames.HF_ACCOUNT_DO_NOT_OPEN_ACCOUNT] = 2;
                                                    StorageUtil.mSetItem(String(userData['base_user_id'] + StorageKeyNames.HF_INDICATIVE_LAYER), JSON.stringify(obj), () => {
                                                    })
                                                    this.setState({
                                                        mbWKHShow: obj[StorageKeyNames.HF_ACCOUNT_DO_NOT_OPEN_ACCOUNT] ,
                                                        mbWBKShow: obj[StorageKeyNames.HF_ACCOUNT_DO_NOT_BIND_BANKCARD],
                                                        mbKTShow:  obj[StorageKeyNames.HF_ACCOUNT_DID_BIND_BANKCARD],
                                                    })
                                                }
                                            })
                                        }
                                    })



                                }}>
                                <Image style={{width:width,flex:1,resizeMode:'stretch'}}
                                       source={require('../../../images/tishimengban/zhgl_wkhwbkyhk.png')}/>
                            </TouchableWithoutFeedback>
                        </View> : null
                }
                {
                    this.state.mbWBKShow == 1 ?
                        <View style={{position: 'absolute',bottom:0,top:0,width:width}}>
                            <TouchableWithoutFeedback
                                onPress={()=>{
                                    StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data) => {
                                        if (data.code == 1) {
                                            let userData = JSON.parse(data.result);
                                            StorageUtil.mGetItem(String(userData['base_user_id'] + StorageKeyNames.HF_INDICATIVE_LAYER), (subData) => {
                                                if (subData.code == 1) {
                                                    let obj = JSON.parse(subData.result);
                                                    obj[StorageKeyNames.HF_ACCOUNT_DO_NOT_BIND_BANKCARD] = 2;
                                                    StorageUtil.mSetItem(String(userData['base_user_id'] + StorageKeyNames.HF_INDICATIVE_LAYER), JSON.stringify(obj), () => {
                                                    })
                                                    this.setState({
                                                        mbWKHShow: obj[StorageKeyNames.HF_ACCOUNT_DO_NOT_OPEN_ACCOUNT] ,
                                                        mbWBKShow: obj[StorageKeyNames.HF_ACCOUNT_DO_NOT_BIND_BANKCARD],
                                                        mbKTShow:  obj[StorageKeyNames.HF_ACCOUNT_DID_BIND_BANKCARD],
                                                    })
                                                }
                                            })
                                        }
                                    })

                                }}

                            >
                                <Image style={{width:width,flex:1,resizeMode:'stretch'}}
                                       source={require('../../../images/tishimengban/zhgl_bky.png')}/>
                            </TouchableWithoutFeedback>
                        </View> : null
                }
                {
                    this.state.mbKTShow == 1 ?
                        <View style={{position: 'absolute',bottom:0,top:0,width:width}}>
                            <TouchableWithoutFeedback
                                onPress={()=>{

                                    StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data) => {
                                        if (data.code == 1) {
                                            let userData = JSON.parse(data.result);
                                            StorageUtil.mGetItem(String(userData['base_user_id'] + StorageKeyNames.HF_INDICATIVE_LAYER), (subData) => {
                                                if (subData.code == 1) {
                                                    let obj = JSON.parse(subData.result);
                                                    obj[StorageKeyNames.HF_ACCOUNT_DID_BIND_BANKCARD] = 2;
                                                    StorageUtil.mSetItem(String(userData['base_user_id'] + StorageKeyNames.HF_INDICATIVE_LAYER), JSON.stringify(obj), () => {
                                                    })
                                                    this.setState({
                                                        mbWKHShow: obj[StorageKeyNames.HF_ACCOUNT_DO_NOT_OPEN_ACCOUNT] ,
                                                        mbWBKShow: obj[StorageKeyNames.HF_ACCOUNT_DO_NOT_BIND_BANKCARD],
                                                        mbKTShow:  obj[StorageKeyNames.HF_ACCOUNT_DID_BIND_BANKCARD],
                                                    })
                                                }
                                            })
                                        }
                                    })

                                }}>
                                <Image style={{width:width,flex:1,resizeMode:'stretch'}}
                                       source={require('../../../images/tishimengban/zhgl_ykhybk.png')}/>
                            </TouchableWithoutFeedback>
                        </View> : null
                }
            </View>);
        }
    }

    _renderSeperator = (sectionID: number, rowID: number, adjacentRowHighlighted: bool) => {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{backgroundColor: fontAndColor.COLORB0, height: Pixel.getPixel(20)}}/>
        )
    };

    _renderRow = (rowData, selectionID, rowID) => {
        let info = {};
        if (rowData == '315') {
            info = this.hengFengInfo;
        } else {
            info = this.zheShangInfo;
        }
        return (
            <MyAccountItem
                showQuestion = {rowData == 315?true:false}
                navigator={this.props.navigator}
                showToast={this.props.showToast}
                showModal={this.props.showModal}
                type={rowData}     //账户类型
                data={info}        //账户数据
                callBack={this.allRefresh}/>
        );
    }


}

const styles = StyleSheet.create({});