/**
 * Created by ZN on 17/2/25.
 */

import  React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    ListView,
    ScrollView,
    RefreshControl,
    InteractionManager,
    Image,
} from 'react-native';

import BaceComponent from '../../component/BaseComponent';
import NavigatorView from '../../component/AllNavigationView';
import CarInfoScene         from '../../carSource/CarInfoScene';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import RepaymenyTabBar from '../../finance/repayment/component/RepaymenyTabBar';
import * as fontAndColor from '../../constant/fontAndColor';
import * as AppUrls from "../../constant/appUrls";
import  {request}           from '../../utils/RequestUtil';
import PixelUtil from '../../utils/PixelUtil';
import {DailyReminderSelectView} from "../component/DailyReminderSelectView";
import {ShareListView} from "./ShareListView";
import {StatisticalListView} from "./StatisticalListView";
const Pixel = new PixelUtil();

export default class DailyReminderScene extends BaceComponent {

    /**
     *
     **/
    constructor(props) {
        super(props);
        // 初始状态
        this.timeFrame = [{name: '每日', value: '1'}, {name: '每周', value: '2'}, {name: '每月', value: '3'}];
        this.shareCurrentFrame = {name: '每日', value: '1'};
        this.statisticalCurrentFrame = {name: '每日', value: '1'};
        this.currentTab = 0;
        this.state = {
            isHide: true
        };
    }

    /**
     *
     * @param carData
     **/
    carCellClick = (carData) => {
        let navigatorParams = {
            name: "CarInfoScene",
            component: CarInfoScene,
            params: {
                carID: carData.id,
            }
        };
        this.toNextPage(navigatorParams);
    };

    /**
     *
     **/
    renderRightFootView = () => {
        return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                    style={{marginLeft: Pixel.getPixel(10)}}
                    onPress={() => {
                        if (this.currentTab == 0) {
                            this.refs.drsv.changeClick(true, this.shareCurrentFrame.name);
                        } else {
                            this.refs.drsv.changeClick(true, this.statisticalCurrentFrame.name);
                        }
                    }}
                    activeOpacity={0.9}
                >
                    <Image source={require('../../../images/mainImage/screening.png')}/>
                </TouchableOpacity>
            </View>
        )
    }

    /**
     *   暂时将统计tab屏蔽
     **/
    render() {
        return (
            <View style={styles.rootContainer}>
{/*                <ScrollableTabView
                    style={styles.ScrollableTabView}
                    initialPage={this.props.page ? this.props.page : 0}
                    locked={true}
                    onChangeTab={({i, ref}) => {
                        this.currentTab = i;
                        //console.log('this.index=====', this.currentTab);
                    }}
                    renderTabBar={() => <RepaymenyTabBar style={{backgroundColor: 'white'}} tabName={["分享", "统计"]}/>}>
                    <ShareListView navigator={this.props.navigator} ref="shareListView" tabLabel="ios-paper1" showModal={this.props.showModal}/>
                    <StatisticalListView navigator={this.props.navigator} ref="statisticalListView"
                                         tabLabel="ios-paper2" showModal={this.props.showModal}/>
                </ScrollableTabView>*/}
                <ShareListView navigator={this.props.navigator} ref="shareListView" tabLabel="ios-paper1" showModal={this.props.showModal}/>
                <DailyReminderSelectView
                    ref='drsv'
                    checkedSource={this.timeFrame}
                    checkedTypeString={this.shareCurrentFrame.name}
                    checkTimeFrameClick={this.checkTimeFrameClick}
                    hideClick={this.hideCheckedView}/>
                <NavigatorView title='每日提醒' backIconClick={this.backPage}
                               renderRihtFootView={this.renderRightFootView}/>
            </View>)

    }

    /**
     *
     **/
    checkTimeFrameClick = (data, index) => {
        if (this.currentTab == 0) {
            this.shareCurrentFrame = data;
            this.refs.drsv.changeClick(false, this.shareCurrentFrame.name);
            this.refs.shareListView.refreshData(this.shareCurrentFrame.value);
        } else {
            this.statisticalCurrentFrame = data;
            this.refs.drsv.changeClick(false, this.statisticalCurrentFrame.name);
            this.refs.statisticalListView.refreshData(this.statisticalCurrentFrame.value);
        }
    }

    /**
     *
     **/
    hideCheckedView = () => {
        this.setState({
            isHide: true,
        });
    }

}
//MyCarSourceUpperFrameView
//MyCarSourceDropFrameView
//MyCarSourceAuditView


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
    }

})