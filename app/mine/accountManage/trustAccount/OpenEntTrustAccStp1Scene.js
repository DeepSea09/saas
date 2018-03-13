/**
 * Created by hanmeng on 2017/11/13.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Platform,
    Image,
    ScrollView
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
import NavigationView from '../../../component/AllNavigationView';
import * as fontAndColor from '../../../constant/fontAndColor';
import BaseComponent from '../../../component/BaseComponent';
import * as AppUrls from "../../../constant/appUrls";
import {request} from "../../../utils/RequestUtil";
import * as StorageKeyNames from "../../../constant/storageKeyNames";
import StorageUtil from "../../../utils/StorageUtil";
import AccountInfoSelected from "./component/AccountInfoSelected";
import SelectScene from "../../../crm/StoresReception/SelectScene";

export default class OpenEntTrustAccStp1Scene extends BaseComponent {

    /**
     *  constructor
     * @param props
     **/
    constructor(props) {
        super(props);
        this.childItems = [];
        this.childItems.push({name: '企业名称', value: '', parameter: 'nickName'});
        this.childItems.push({name: '所在省市', value: '', parameter: 'mobilePhone'});
        this.childItems.push({name: '是否三证合一', value: '', parameter: 'mobilePhone'});
        this.childItems.push({name: '营业执照号', value: '', parameter: 'mobilePhone'});
        this.childItems.push({name: '组织机构代码', value: '', parameter: 'mobilePhone'});
        this.childItems.push({name: '税务登记证', value: '', parameter: 'mobilePhone'});
        this.state = {
            renderPlaceholderOnly: 'blank'
        };
    }

    /**
     *
     **/
    initFinish = () => {
        this.setState({
            renderPlaceholderOnly: 'success'
        });
    };

    /**
     *  render
     * @returns {XML}
     **/
    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (
                <View style={styles.container}>
                    {this.loadView()}
                    <NavigationView
                        backIconClick={this.backPage}
                        title="开通企业账户"
                    />
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <NavigationView
                        backIconClick={this.backPage}
                        title="开通企业账户"/>
                    <ScrollView
                        style={{backgroundColor: fontAndColor.COLORA3, marginTop: Pixel.getTitlePixel(65)}}
                        ref={(ref) => {
                            this.scrollView = ref
                        }} keyboardDismissMode={Platform.OS === 'android' ? 'none' : 'on-drag'}>
                        {this._renderRow()}
                    </ScrollView>
                </View>
            );
        }
    }

    /**
     *
     **/
    _renderRow = () => {
        let items = [];
        for (let i = 0; i < this.childItems.length; i++) {
            if (this.childItems[i].name == '所在城市') {
                items.push(<AccountInfoSelected ref="company" key={i + 'bo'} items={this.childItems[i]}
                                    toSelect={() => {
                                        this.toNextPage({
                                            name: 'SelectScene',
                                            component: SelectScene,
                                            params: {
                                                regShowData: ['朋友介绍', '朋友圈', '58同城', '二手车之家', 'FM调频广播', '室外广告牌', '同行引荐', '文章引导', '自到店', '转介绍', '其他'],
                                                title: '信息来源',
                                                callBack: (name) => {
                                                    this.childItems[i].value = name;
                                                    this.refs.company.setValue(name);
                                                }
                                            }
                                        })
                                    }}/>)
            } else if (this.childItems[i].name == '是否三证合一') {
                items.push(<AccountInfoSelected ref="company" key={i + 'bo'} items={this.childItems[i]}
                                                toSelect={() => {
                                                    this.toNextPage({
                                                        name: 'SelectScene',
                                                        component: SelectScene,
                                                        params: {
                                                            regShowData: ['是', '否'],
                                                            title: '是否三证合一',
                                                            callBack: (name) => {
                                                                this.childItems[i].value = name;
                                                                this.refs.company.setValue(name);
                                                            }
                                                        }
                                                    })
                                                }}/>)
            } else {

            }
        }
        return (
            <View style={styles.container}>
                <View style={{
                    backgroundColor: '#ffffff',
                    height: Pixel.getPixel(80),
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Image
                        source={require('../../../../images/account/openAccountStep1.png')}/>
                </View>
                <View style={{backgroundColor: fontAndColor.COLORA3, height: Pixel.getPixel(10)}}/>
                {items}
            </View>
        )
    };

    /**
     *
     **/
    submitClientInfo = () => {
        this.props.showModal(true);
        if (this.checkInfo()) {
            StorageUtil.mGetItem(StorageKeyNames.PHONE, (data) => {
                if (data.code == 1 && data.result != null) {
                    //console.log('this.clientInfo=====', this.clientInfo);
                    let maps = [];
                    for (let i = 0; i < this.clientInfo.length; i++) {
                        maps[this.clientInfo[i].parameter] = this.clientInfo[i].value;
                    }
                    maps['mobiles'] = data.result + this.companyId;
                    let url = AppUrls.CUSTOMER_ADD_URL;
                    request(url, 'post', maps).then((response) => {
                        this.props.showModal(false);
                        this.props.callBack();
                        this.backPage();
                    }, (error) => {
                        this.props.showModal(false);
                        //console.log('请求错误 = ', error);
                        this.setState({
                            isRefreshing: false,
                            renderPlaceholderOnly: 'error'
                        });
                    });
                } else {
                    this.props.showToast('查询账户信息失败');
                }
            });
        }
    };

    /**
     *
     **/
    checkInfo = () => {
        this.clientInfo = [];
        let startTime = '';
        let endTime = '';
        let baseInfoItems = this.baseInfoItem.getItemData();
        for (let key in baseInfoItems) {
            this.clientInfo.push(baseInfoItems[key]);
        }

        let buyerDemandItems = this.buyerDemandItem.getItemData();
        for (let key in buyerDemandItems) {
            this.clientInfo.push(buyerDemandItems[key]);
        }

        let communicationRecordItems = this.communicationRecordItem.getItemData();
        for (let key in communicationRecordItems) {
            this.clientInfo.push(communicationRecordItems[key]);
        }
        //console.log('this.clientInfo=====', this.clientInfo);
        for (let key in this.clientInfo) {
            //console.log('this.clientInfo=====', key + this.clientInfo[key]);
            if (this.clientInfo[key].name == '客户到店') {
                continue;
            }
            /*            if (this.clientInfo[key].name == '电话' && this.clientInfo[key].value.length !== 11) {
             this.props.showToast(this.clientInfo[key].name + '输入不正确');
             return false;
             }*/
            if (this.clientInfo[key].value == '') {
                this.props.showToast(this.clientInfo[key].name + '不能为空');
                return false;
            }
            if (this.clientInfo[key].name == '进店时间') {
                startTime = this.clientInfo[key].value;
            }
            if (this.clientInfo[key].name == '离店时间') {
                endTime = this.clientInfo[key].value;
            }
        }
        if (endTime < startTime) {
            this.props.showToast('离店时间不能早于进店时间');
            return false;
        }
        return true;
    };
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: fontAndColor.COLORA3
    }
});