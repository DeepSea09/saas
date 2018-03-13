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
import ShareRankingScene from "./ShareRankingScene";
const Pixel = new PixelUtil();
const cellJianTou = require('../../../images/mainImage/celljiantou.png');

export class ShareListView extends BaseComponent {

    /**
     *
     **/
    constructor(props) {
        super(props);
        this.shareListData = [];
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
        this.shareListData = [];
        this.loadData(type);
    };

    /**
     *
     **/
    loadData = (type) => {
        let url = AppUrls.DAILY_REMINDER_RANK_LEVEL;
        request(url, 'post', {
            type: type,
            //token: '5afa531b-4295-4c64-8d6c-ac436c619078'
        }).then((response) => {
            this.props.showModal(false);
            this.shareListData = response.mjson.data;
            if (this.shareListData && this.shareListData.length > 0) {
                let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                this.setState({
                    dataSource: ds.cloneWithRows(this.shareListData),
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
                <ListView style={{backgroundColor: fontAndColor.COLORA3, marginTop: Pixel.getTitlePixel(80)}}
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
     *   添加排行榜前三名数据
     **/
    addRankingData = (total, rankingData, timeType) => {
        let items = [];
        let name = '';
        let count = '';
        for (let i = 0; i < rankingData.length; i++) {
            if (i > 2) {
                break;
            } else {
                if (total > 0) {
                    name = i + 1 +'.' + rankingData[i].name;
                    count = '分享' + rankingData[i].count + '次';
                    items.push(<View key={i} style={{flexDirection: 'row', marginTop: Pixel.getPixel(10)}}>
                        <Text allowFontScaling={false} style={styles.describe}>{name}</Text>
                        <View style={{flex: 1}}/>
                        <Text allowFontScaling={false}
                              style={[styles.describe, {marginRight: Pixel.getPixel(15)}]}>{count}</Text>
                    </View>);
                } else {
                    if (timeType == 1) {
                        name = '本日无人分享';
                        items.push(<View key={i} style={{flexDirection: 'row', marginTop: Pixel.getPixel(10)}}>
                            <Text allowFontScaling={false} style={styles.describe}>{name}</Text>
                            <View style={{flex: 1}}/>
                            <Text allowFontScaling={false}
                                  style={[styles.describe, {marginRight: Pixel.getPixel(15)}]}>{count}</Text>
                        </View>);
                        break;
                    } else if (timeType == 2) {
                        name = '本周无人分享';
                        items.push(<View key={i} style={{flexDirection: 'row', marginTop: Pixel.getPixel(10)}}>
                            <Text allowFontScaling={false} style={styles.describe}>{name}</Text>
                            <View style={{flex: 1}}/>
                            <Text allowFontScaling={false}
                                  style={[styles.describe, {marginRight: Pixel.getPixel(15)}]}>{count}</Text>
                        </View>);
                        break;
                    } else if (timeType == 3) {
                        name = '本月无人分享';
                        items.push(<View key={i} style={{flexDirection: 'row', marginTop: Pixel.getPixel(10)}}>
                            <Text allowFontScaling={false} style={styles.describe}>{name}</Text>
                            <View style={{flex: 1}}/>
                            <Text allowFontScaling={false}
                                  style={[styles.describe, {marginRight: Pixel.getPixel(15)}]}>{count}</Text>
                        </View>);
                        break;
                    }
                }
            }
        }
        return items;
    };

    /**
     *
     **/
    _renderRow = (rowData, selectionID, rowID) => {
        let title = '';
        let days = '';
        //let name = '';
        //let times = '';
        if (this.timeType == 1) {   // 每日
            title = rowID == 0 ? '今日分享' : '每日分享';
            days = rowData.days;
        } else if (this.timeType == 2) {  //每周
            title = rowID == 0 ? '本周分享' : '每周分享';
            let week = rowData.week.split(' ');
            days = week[0] + '年 第' + week[1] + '周';
        } else if (this.timeType == 3) {  //每月
            title = rowID == 0 ? '本月分享' : '每月分享';
            days = rowData.date;
        }
        return (
            <TouchableOpacity
                onPress={() => {
                    if (rowData.dayCounts > 0) {
                        this.toNextPage({
                            name: 'ShareRankingScene',
                            component: ShareRankingScene,
                            params: {
                                info: rowData.info
                            }
                        });
                    }
                }}>
                <View style={styles.listItem}>
                    <View style={{flexDirection: 'row'}}>
                        <Text allowFontScaling={false} style={styles.title}>{title}</Text>
                        <View style={{flex: 1}}/>
                        <Text allowFontScaling={false} style={styles.date}>{days}</Text>
                    </View>
                    {this.addRankingData(rowData.dayCounts, rowData.info, this.timeType)}
                    <View style={styles.separatedLine}/>
                    <View style={styles.subItem}>
                        <Text allowFontScaling={false} style={styles.subTitle}>查看详情</Text>
                        <View style={{flex: 1}}/>
                        <Image source={cellJianTou} style={styles.image}/>
                    </View>
                </View>
            </TouchableOpacity>
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
        alignItems: 'center',
        flexDirection: 'row',
        height: Pixel.getPixel(44),
        backgroundColor: '#ffffff'
    },
    subTitle: {
        marginLeft: Pixel.getPixel(15),
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),
        color: fontAndColor.COLORA2
    },
    image: {
        marginRight: Pixel.getPixel(15)
    }
});