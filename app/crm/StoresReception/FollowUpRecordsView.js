/**
 * Created by hanmeng on 2017/8/6.
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
import FollowUpTaskScene from "./FollowUpTaskScene";
import * as AppUrls from "../../constant/appUrls";
import  {request} from '../../utils/RequestUtil';
const Pixel = new PixelUtil();
const cellJianTou = require('../../../images/mainImage/celljiantou.png');

export class FollowUpRecordsView extends BaseComponent {

    /**
     *
     **/
    constructor(props) {
        super(props);
        this.followUpRecordsList = [];
        this.clientInfoDetail = {};
        this.state = {
            dataSource: [],
            renderPlaceholderOnly: 'blank',
            loadingMarginTop: Pixel.getPixel(70)
        };
    }

    /**
     *
     **/
    initFinish = () => {
/*        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
            dataSource: ds.cloneWithRows(this.props.rowData.reverse()),
            renderPlaceholderOnly: 'success'
        });*/
        this.loadData();
    };

    /**
     *
     **/
    loadData = () => {
        let maps = {
            //pushTo: this.custPhone,
            //token: '5afa531b-4295-4c64-8d6c-ac436c619078',
            custI: this.props.rowData.id
            //createTime: '2017-08-09 15:18:47'
        };
        let url = AppUrls.SELECT_ALL_FLOW;
        request(url, 'post', maps).then((response) => {
            this.props.showModal(false);
            this.followUpRecordsList = response.mjson.data.maps;
            //console.log('followUpRecordsList===============', this.followUpRecordsList);
            this.loadDetailData();
            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            this.setState({
                dataSource: ds.cloneWithRows(this.followUpRecordsList.reverse()),
                isRefreshing: false,
                renderPlaceholderOnly: this.followUpRecordsList && this.followUpRecordsList.length > 0 ? 'success' : 'null'
            });
        }, (error) => {
            //console.log('error===============', error);
            this.props.showModal(false);
            this.setState({
                isRefreshing: false,
                renderPlaceholderOnly: 'error'
            });
        });
    };

    /**
     *   查询客户详情
     **/
    loadDetailData = () => {
        let maps = {
            listID: this.props.rowData.id
        };
        let url = AppUrls.POTENTIAL_CUSTOMER_DETAIL;
        request(url, 'post', maps).then((response) => {
            //console.log('response===============', response);
            this.clientInfoDetail = response.mjson.data;
            this.props.callBack(this.clientInfoDetail);
        }, (error) => {
            this.props.showToast('查询客户详情失败');
            //console.log('error===============', error);
            //this.clientInfoDetail = error.mjson.data;
            //this.props.callBack(this.clientInfoDetail);
        });
    };

    /**
     *   刷新页面数据
     **/
    refreshData = () => {
        this.props.showModal(true);
        this.loadData();
    };

    /**
     *
     **/
    render() {
        if (this.state.renderPlaceholderOnly != 'success') {
            // 加载中....
            return ( <View style={styles.container}>
                {this.loadView()}
                <TouchableOpacity
                    style={{bottom: 0}}
                    onPress={() => {
                        this.toNextPage({
                            name: 'FollowUpTaskScene',
                            component: FollowUpTaskScene,
                            params: {
                                rowData: this.props.rowData,
                                callBack: this.refreshData
                            }
                        });
                    }}>
                    <View style={{
                        backgroundColor: fontAndColor.COLORB0,
                        height: Pixel.getPixel(44),
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text
                            allowFontScaling={false}
                            style={{
                                fontSize: Pixel.getFontPixel(17),
                                color: '#ffffff'
                            }}>跟进任务</Text>
                    </View>
                </TouchableOpacity>
            </View>);
        } else {
            return (<View style={styles.container}>
                <ListView style={{backgroundColor: '#ffffff'}}
                          dataSource={this.state.dataSource}
                          removeClippedSubviews={false}
                          renderRow={this._renderRow}
                          enableEmptySections={true}
                          renderSeparator={this._renderSeperator}/>
                <TouchableOpacity
                    style={{bottom: 0}}
                    onPress={() => {
                        this.toNextPage({
                            name: 'FollowUpTaskScene',
                            component: FollowUpTaskScene,
                            params: {
                                rowData: this.props.rowData,
                                callBack: this.refreshData
                            }
                        });
                    }}>
                    <View style={{
                        backgroundColor: fontAndColor.COLORB0,
                        height: Pixel.getPixel(44),
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text
                            allowFontScaling={false}
                            style={{
                                fontSize: Pixel.getFontPixel(17),
                                color: '#ffffff'
                            }}>跟进任务</Text>
                    </View>
                </TouchableOpacity>
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
                style={{
                    backgroundColor: fontAndColor.COLORA3,
                    height: Pixel.getPixel(1),
                    marginLeft: Pixel.getPixel(45)
                }}/>
        )
    }

    /**
     *
     **/
    _renderRow = (rowData, selectionID, rowID) => {
        return (
            <View style={styles.listItem}>
                <Text allowFontScaling={false} style={{
                    marginLeft: Pixel.getPixel(45),
                    fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                    color: fontAndColor.COLORA0
                }}>{rowData.customerFlowMessage}</Text>
                <Text allowFontScaling={false} style={{
                    marginTop: Pixel.getPixel(10),
                    marginLeft: Pixel.getPixel(45),
                    fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                    color: fontAndColor.COLORA1
                }}>{rowData.createTime}</Text>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Pixel.getPixel(5),
        backgroundColor: '#ffffff'
    },
    listItem: {
        justifyContent: 'center',
        height: Pixel.getPixel(68),
        backgroundColor: '#ffffff'
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