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
import SysMessageDetailScene from "./SysMessageDetailScene";
import StorageUtil from "../../utils/StorageUtil";
const Pixel = new PixelUtil();
import * as StorageKeyNames from "../../constant/storageKeyNames";
import SQLiteUtil from "../../utils/SQLiteUtil";
import {MessageListItem} from "../component/MessageListItem";
import {ItemDeleteButton} from "../component/ItemDeleteButton";
const SQLite = new SQLiteUtil();
const cellJianTou = require('../../../images/mainImage/celljiantou.png');

export default class SysMessageListScene extends BaseComponent {

    /**
     *
     **/
    constructor(props) {
        super(props);
        this.sysMessageListData = [];
        this.createTime = '';
        this.custPhone = '';
        this.itemRefs = [];
        this.refKey = '';
        this.dataKey = '';
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
        //let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        /*        this.setState({
         dataSource: ds.cloneWithRows(['0', '1']),
         renderPlaceholderOnly: 'success'
         });*/
        StorageUtil.mGetItem(StorageKeyNames.PHONE, (data) => {
            if (data.code == 1 && data.result != null) {
                this.custPhone = data.result;
                //this.custPhone = '15102373842';
                this.loadData();
            } else {
                this.props.showToast('查询账户信息失败');
            }
        });
    };

    /**
     *   加载数据
     **/
    loadHttpData = () => {
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let companyId = datas.company_base_id;
                let maps = {
                    //pushTo: '15102373842',
                    pushTo: this.custPhone + companyId,
                    //token: '5afa531b-4295-4c64-8d6c-ac436c619078',
                    contentType: 'systems',
                    //createTime: '2017-08-09 15:18:47'
                    createTime: this.createTime
                };
                let url = AppUrls.SELECT_MSG_BY_CONTENT_TYPE;
                request(url, 'post', maps).then((response) => {
                    let listData = response.mjson.data;
                    if (listData && listData.length > 0) {
                        let batch = {sql: '', array: []};
                        let batches = [];
                        for (let i = 0; i < listData.length; i++) {
                            //console.log('listData[i]===',listData[i]);
                            this.sysMessageListData.unshift(listData[i]);
                            listData[i].isRead = false;
                            listData[i].tel = this.custPhone;

                            batch = {
                                sql: 'INSERT INTO messageSystemModel (id,content,contentType,createTime,enable,pushFrom,pushStatus,pushTo,roleName,taskId,title,isRead,tel) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
                                array: []
                            };
                            batch.array.push(listData[i].id, listData[i].content, listData[i].contentType, listData[i].createTime, listData[i].enable, listData[i].pushFrom,
                                listData[i].pushStatus, listData[i].pushTo, listData[i].roleName, listData[i].taskId, listData[i].title, listData[i].isRead, listData[i].tel);
                            batches.push(batch)
                            /*SQLite.changeData('INSERT INTO messageHeadLineModel (id,content,contentType,createTime,enable,pushFrom,pushStatus,pushTo,roleName,taskId,title,isRead,tel) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
                             [listData[i].id, listData[i].content, listData[i].contentType, listData[i].createTime, listData[i].enable, listData[i].pushFrom,
                             listData[i].pushStatus, listData[i].pushTo, listData[i].roleName, listData[i].taskId, listData[i].title, listData[i].isRead, listData[i].tel]);*/
                        }
                        SQLite.changeDataBatch(batches);
                        StorageUtil.mSetItem(StorageKeyNames.SYSTEMS_LAST_MESSAGE_TIME, listData[0].createTime);
                    }
                    if (this.sysMessageListData && this.sysMessageListData.length > 0) {
                        //console.log('this.sysMessageListData===',this.sysMessageListData);
                        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        this.setState({
                            dataSource: ds.cloneWithRows(this.sysMessageListData),
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
                    this.setState({
                        isRefreshing: false,
                        renderPlaceholderOnly: 'error'
                    });
                });
            } else {

            }
        });
    };

    /**
     *
     **/
    loadData = () => {
        this.sysMessageListData = [];
        SQLite.selectData('SELECT * FROM messageSystemModel WHERE tel = ? order by createTime desc', [this.custPhone],
            (data) => {
                //console.log('SELECT * FROM messageHeadLineModel', data);
                //数据库中有数据
                let count = data.result.rows.length;
                if (count > 0) {
                    let dbCreateTime = data.result.rows.item(0).createTime;
                    StorageUtil.mGetItem(StorageKeyNames.SYSTEMS_LAST_MESSAGE_TIME, (timeData) => {
                        if (timeData.code == 1 && timeData.result != null) {
                            if (timeData.result > dbCreateTime) {
                                this.createTime = timeData.result;
                            } else {
                                this.createTime = dbCreateTime;
                                StorageUtil.mSetItem(StorageKeyNames.SYSTEMS_LAST_MESSAGE_TIME, dbCreateTime);
                            }
                        } else {
                            this.createTime = dbCreateTime;
                            StorageUtil.mSetItem(StorageKeyNames.SYSTEMS_LAST_MESSAGE_TIME, dbCreateTime);
                        }
                        for (let i = 0; i < count; i++) {
                            //console.log(data.result.rows.item(i));
                            this.sysMessageListData.push(data.result.rows.item(i));
                        }
                        this.loadHttpData();
                    });
                } else {
                    StorageUtil.mGetItem(StorageKeyNames.SYSTEMS_LAST_MESSAGE_TIME, (timeData) => {
                        if (timeData.code == 1 && timeData.result != null) {
                            this.createTime = timeData.result;
                            this.loadHttpData();
                        } else {
                            StorageUtil.mGetItem(StorageKeyNames.INTO_TIME, (intoTimeData) => {
                                if (intoTimeData.code == 1 && intoTimeData.result != null) {
                                    this.createTime = intoTimeData.result;
                                    this.loadHttpData();
                                } else {
                                    //this.props.showToast('确认验收失败');
                                }
                            });
                        }
                    });
                }
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
                <NavigatorView title='系统消息' backIconClick={this.backPage}/>
            </View>);
        } else {
            return (<View style={styles.container}>
                <NavigatorView title='系统消息' backIconClick={this.backPage}/>
                <ListView style={{backgroundColor: fontAndColor.COLORA3, marginTop: Pixel.getTitlePixel(80)}}
                          dataSource={this.state.dataSource}
                          removeClippedSubviews={false}
                          renderRow={this._renderRow}
                          enableEmptySections={true}
                          renderSeparator={this._renderSeperator}/>
                <ItemDeleteButton ref={(ref) => {
                    this.giv = ref
                }} itemDelete={this.deleteSystemInfo}/>
            </View>);
        }

    }

    /**
     *   删除数据库中数据
     **/
    deleteSystemInfo = () => {
        SQLite.changeData('DELETE FROM messageSystemModel WHERE id = ? AND tel = ?', [this.dataKey, this.custPhone]);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.sysMessageListData.splice(this.refKey, 1);
        this.setState({
            dataSource: ds.cloneWithRows(this.sysMessageListData),
            renderPlaceholderOnly: this.sysMessageListData.length > 0 ? 'success' : 'null'
        })
        this.giv.changeState(false);
    };

    /**
     *   开启手势拦截
     **/
    showGesturesIntercepter = (itemRef, y, dataKey) => {
        this.giv.changeState(true, y);
        this.refKey = itemRef;
        this.dataKey = dataKey;
        //console.log('this.mli=========', this.mli);
    };

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
        return (
            <MessageListItem ref={(ref) => {
                this.mli = ref;
                this.itemRefs.push(this.mli);
            }}
                             keys={rowID}
                             navigator={this.props.navigator}
                             rowData={rowData}
                             type='system'
                             rowID={rowID}
                             callBack={this.showGesturesIntercepter}/>
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