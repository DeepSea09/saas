/**
 * Created by ZN on 17/2/25.
 */

import  React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Platform,
    NativeModules,
    Linking,
    RefreshControl,
    InteractionManager,
    Image,
} from 'react-native';

import BaseComponent from '../../component/BaseComponent';
import NavigatorView from '../../component/AllNavigationView';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import RepaymenyTabBar from '../../finance/repayment/component/RepaymenyTabBar';
import * as fontAndColor from '../../constant/fontAndColor';
import * as AppUrls from "../../constant/appUrls";
import {request} from '../../utils/RequestUtil';
import PixelUtil from '../../utils/PixelUtil';
import {FollowUpRecordsView} from "./FollowUpRecordsView";
import {ClientInfoDetailView} from "./ClientInfoDetailView";
const Pixel = new PixelUtil();


export default class ClientInfoScene extends BaseComponent {

    /**
     *
     **/
    constructor(props) {
        super(props);
        this.followUpRecordsList = [];
        this.clientInfoDetail = {};
        this.state = {
            //renderPlaceholderOnly: 'blank',
            rowData: this.props.rowData
        };
    }

    /**
     *
     **/
    initFinish = () => {
        //this.loadData();
    };

    /**
     *   刷新页面数据
     **/
    refreshData = (data) => {
        //console.log('this.cidv-=-========-=-=', this.refs.cidv);
        //this.refs.clientInfoDetailView.refreshData(data);
        this.setState({
            rowData: data
        });
    };

    /**
     *
     **/
    allRefresh = (i, ref) => {
        if (i.i == 1) {
            //console.log('1111111111111', i);
            this.refs.clientInfoDetailView.refreshData(this.state.rowData);
        }
    };

    /**
     *   查询客户详情
     **/
    loadData = () => {
        let maps = {
            listID: this.props.rowData.id
        };
        let url = AppUrls.POTENTIAL_CUSTOMER_DETAIL;
        request(url, 'post', maps).then((response) => {
            this.clientInfoDetail = response.mjson.data;
            this.loadFlowData();
        }, (error) => {
            this.props.showToast('查询客户详情失败');
        });
    };

    /**
     *  查询客户跟进记录
     **/
    loadFlowData = () => {
        let maps = {
            custI: this.props.rowData.id
        };
        let url = AppUrls.SELECT_ALL_FLOW;
        request(url, 'post', maps).then((response) => {
            this.props.showModal(false);
            this.followUpRecordsList = response.mjson.data.maps;
            this.setState({
                //dataSource: ds.cloneWithRows(this.followUpRecordsList.reverse()),
                renderPlaceholderOnly: 'success'
            });
        }, (error) => {
            this.props.showToast('查询跟进记录失败');
        });
    };

    /**
     *   客户状态映射
     **/
    customerStatusMapping = (status, come) => {
        if (status == 2 && come == 1) {
            return '电话邀约-到店';
        } else if (status == 2) {
            return '电话邀约-未到店';
        } else if (status == 1) {
            return '初次到店';
        } else if (status == 3) {
            return '已购买';
        } else if (status == 4) {
            return '置换';
        } else if (status == 5) {
            return '复购';
        } else {
            return '暂无记录';
        }
    };

    /**
     *  拨打客户电话
     * @param phoneNumer
     **/
    callClick = (phoneNumer) => {
        if (Platform.OS === 'android') {
            NativeModules.VinScan.callPhone(phoneNumer);
        } else {
            Linking.openURL('tel:' + phoneNumer);
        }
    };

    /**
     *
     **/
    render() {
/*        if (this.state.renderPlaceholderOnly != 'success') {
            return (
                <View style={styles.loadView}>
                    <NavigatorView title='客户信息' backIconClick={this.backPage}/>
                    {this.loadView()}
                </View>
            );
        } else {*/
            return (
                <View style={styles.rootContainer}>
                    <NavigatorView title='客户信息' backIconClick={this.backPage}/>
                    <View style={{
                        height: Pixel.getPixel(90),
                        backgroundColor: fontAndColor.COLORB0,
                        marginTop: Pixel.getTitlePixel(64),
                        alignItems: 'center',
                        flexDirection: 'row'
                    }}>
                        <Text
                            allowFontScaling={false}
                            style={{
                                marginLeft: Pixel.getPixel(32),
                                color: '#ffffff',
                                fontSize: Pixel.getFontPixel(fontAndColor.NAVIGATORFONT34)
                            }}>{this.state.rowData.customerName}</Text>
                        <View style={{
                            marginLeft: Pixel.getPixel(32),
                            backgroundColor: '#ffffff',
                            height: Pixel.getPixel(35),
                            width: 1
                        }}/>
                        <View style={{alignItems: 'flex-start', marginLeft: Pixel.getPixel(12)}}>
                            <Text
                                allowFontScaling={false}
                                style={{
                                    color: '#ffffff',
                                    fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28)
                                }}>销售顾问:{this.state.rowData.salesAdviser}</Text>
                            <Text
                                allowFontScaling={false}
                                style={{
                                    marginTop: Pixel.getPixel(8),
                                    color: '#ffffff',
                                    fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28)
                                }}>客户状态:{this.customerStatusMapping(this.state.rowData.customerStatus, this.state.rowData.customerCome)}</Text>
                        </View>
                        <View style={{flex: 1}}/>
                        <TouchableOpacity
                            onPress={() => {
                                this.callClick(this.state.rowData.customerPhone);
                            }}>
                            <Image
                                style={{marginRight: Pixel.getPixel(20)}}
                                source={require('../../../images/mainImage/make_call.png')}/>
                        </TouchableOpacity>
                    </View>
                    <ScrollableTabView
                        //style={styles.ScrollableTabView}
                        initialPage={this.props.page ? this.props.page : 0}
                        locked={true}
                        onChangeTab={this.allRefresh}
                        renderTabBar={() => <RepaymenyTabBar style={{backgroundColor: 'white'}}
                                                             tabName={["跟进记录", "详细资料"]}/>}>
                        <FollowUpRecordsView
                            ref="followUpRecordsView"
                            rowData={this.state.rowData}
                            navigator={this.props.navigator}
                            showModal={this.props.showModal}
                            showToast={this.props.showToast}
                            callBack={this.refreshData}
                            tabLabel="ios-paper1"/>
                        <ClientInfoDetailView
                            ref="clientInfoDetailView"
                            rowData={this.state.rowData}
                            navigator={this.props.navigator}
                            showModal={this.props.showModal}
                            showToast={this.props.showToast}
                            tabLabel="ios-paper2"/>
                    </ScrollableTabView>
                </View>
            )
        //}
    }

}


const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: fontAndColor.COLORA3,
    },
    ScrollableTabView: {
        marginTop: Pixel.getTitlePixel(64),
    },
    loadView: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: Pixel.getPixel(5),
    },
    viewContainer: {
        flex: 1,
        backgroundColor: fontAndColor.COLORA3
    },
    listView: {
        backgroundColor: fontAndColor.COLORA3,
        marginTop: Pixel.getPixel(5),
        marginBottom:Pixel.getPixel(44)
    }
});