/**
 * Created by hanmeng on 2017/7/31.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ListView,
    Modal
} from 'react-native';

import NavigatorView from '../../component/AllNavigationView';
import BaseComponent from '../../component/BaseComponent';
import * as fontAndColor from '../../constant/fontAndColor';
import PixelUtil from '../../utils/PixelUtil';
import * as AppUrls from "../../constant/appUrls";
import {request} from "../../utils/RequestUtil";
import DailyReminderScene from "../dailyReminder/DailyReminderScene";
const Pixel = new PixelUtil();
const dashed = require('../../../images/mainImage/dashed.png');

export class StatisticalListView extends BaseComponent {

    /**
     *
     **/
    constructor(props) {
        super(props);
        this.statisticalListData = [];
        this.timeType = 1;
        this.state = {
            dataSource: [],
            isRefreshing: false,
            renderPlaceholderOnly: 'blank'
        };
    }

    /**
     *
     **/
    initFinish = () => {
        /*        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
         this.setState({
         dataSource: ds.cloneWithRows(['0', '0', '0']),
         renderPlaceholderOnly: 'success'
         });*/
        this.loadData(1);
    };

    /**
     *  按筛选条件刷新数据
     **/
    refreshData = (type) => {
        this.props.showModal(true);
        this.timeType = type;
        this.statisticalListData = [];
        this.loadData(type);
    };

    /**
     *
     **/
    loadData = (type) => {
        let url = AppUrls.DAILY_REMINDER_STATISTICS;
        request(url, 'post', {
            type: type,
            //token: '5afa531b-4295-4c64-8d6c-ac436c619078'
        }).then((response) => {
            this.props.showModal(false);
            this.statisticalListData = response.mjson.data;
            if (this.statisticalListData && this.statisticalListData.length > 0) {
                let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                this.setState({
                    dataSource: ds.cloneWithRows(this.statisticalListData),
                    isRefreshing: false,
                    renderPlaceholderOnly: 'success'
                });
            } else {
                this.setState({
                    isRefreshing: false,
                    renderPlaceholderOnly: 'null'
                });
            }
        }, (error) => {
            this.props.showModal(false);
            this.setState({
                isRefreshing: false,
                renderPlaceholderOnly: 'error'
            });
        });
    };

    /**
     *
     **/
    render() {
        if (this.state.renderPlaceholderOnly != 'success') {
            // 加载中....
            return ( <View style={styles.container}>
                {this.loadView()}
            </View>);
        } else {
            return (<View style={styles.container}>
                <ListView style={{backgroundColor: fontAndColor.COLORA3, marginTop: Pixel.getPixel(15)}}
                          dataSource={this.state.dataSource}
                          removeClippedSubviews={false}
                          renderRow={this._renderRow}
                          enableEmptySections={true}
                          renderSeparator={this._renderSeperator}/>
            </View>);
        }

    }

    /**
     *
     **/
    _renderSeperator = (sectionID: number, rowID: number, adjacentRowHighlighted: bool) => {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{backgroundColor: fontAndColor.COLORA3, height: Pixel.getPixel(10)}}/>
        )
    }

    /**
     *
     **/
    _renderRow = (rowData, selectionID, rowID) => {
        let title = '';
        let date = '';
        //let name = '';
        //let times = '';
        if (this.timeType == 1) {   // 每日
            title = rowID == 0 ? '今日统计' : '每日统计';
            date = rowData.date;
        } else if (this.timeType == 2) {  //每周
            title = rowID == 0 ? '本周统计' : '每周统计';
            let week = rowData.date.split('-');
            date = week[0] + '年 第' + week[1] + '周';
        } else if (this.timeType == 3) {  //每月
            title = rowID == 0 ? '本月统计' : '每月统计';
            date = rowData.date;
        }
        return (
            <View style={styles.listItem}>
                <View style={{flexDirection: 'row'}}>
                    <Text allowFontScaling={false} style={styles.title}>{title}</Text>
                    <View style={{flex: 1}}/>
                    <Text allowFontScaling={false} style={styles.date}>{date}</Text>
                </View>
                <View style={styles.subItem}>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text allowFontScaling={false} style={styles.contentTitle}>上架车辆</Text>
                        <Text allowFontScaling={false} style={styles.contentvalue}>{rowData.putAway}</Text>
                    </View>
                    <Image source={dashed}/>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text allowFontScaling={false} style={styles.contentTitle}>库存车辆</Text>
                        <Text allowFontScaling={false} style={styles.contentvalue}>{rowData.repertory}</Text>
                    </View>
{/*                    <Image source={dashed}/>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text allowFontScaling={false} style={styles.contentTitle}>采购车辆</Text>
                        <Text allowFontScaling={false} style={styles.contentvalue}>{rowData.sold}</Text>
                    </View>*/}
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Pixel.getPixel(0),
        backgroundColor: fontAndColor.COLORA3,
    },
    listItem: {
        height: Pixel.getPixel(115),
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15),
        backgroundColor: '#ffffff',
        borderRadius: Pixel.getPixel(4),
        borderWidth: 1,
        borderColor: '#ffffff'
    },
    date: {
        marginRight: Pixel.getPixel(15),
        marginTop: Pixel.getPixel(20),
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
        color: fontAndColor.COLORA1
    },
    title: {
        marginLeft: Pixel.getPixel(15),
        marginTop: Pixel.getPixel(20),
        fontSize: Pixel.getFontPixel(fontAndColor.NAVIGATORFONT),
        color: fontAndColor.COLORA0
    },
    describe: {
        marginLeft: Pixel.getPixel(15),
        marginTop: Pixel.getPixel(10),
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),
        color: fontAndColor.COLORA1
    },
    separatedLine: {
        marginTop: Pixel.getPixel(10),
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15),
        height: 1,
        backgroundColor: fontAndColor.COLORA4
    },
    subItem: {
        marginTop: Pixel.getPixel(15),
        alignItems: 'center',
        flexDirection: 'row',
        height: Pixel.getPixel(45),
        backgroundColor: '#ffffff'
    },
    subTitle: {
        marginLeft: Pixel.getPixel(15),
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),
        color: fontAndColor.COLORA2
    },
    contentTitle: {
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
        color: fontAndColor.COLORA1
    },
    contentvalue: {
        marginTop: Pixel.getPixel(4),
        fontSize: Pixel.getFontPixel(19),
        color: fontAndColor.COLORB2
    }
});