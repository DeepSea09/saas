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
const Pixel = new PixelUtil();
import * as StorageKeyNames from "../../constant/storageKeyNames";
import StorageUtil from "../../utils/StorageUtil";
import GetPermissionUtil from '../../utils/GetRoleUtil';
import ClientInfoScene from "../../crm/StoresReception/ClientInfoScene";
import CarTrimScene from "../../carSource/carBuy/CarTrimScene";
import StoreReceptionManageNewScene from "../../crm/StoresReception/StoreReceptionManageNewScene";
import KeepCustomerManageScene from "../../crm/KeepCustomer/KeepCustomerManageScene";
const GetRoleUtil = new GetPermissionUtil();
const cellJianTou = require('../../../images/mainImage/celljiantou.png');
import * as AppUrls from "../../constant/appUrls";
import {request} from "../../utils/RequestUtil";

export default class BacklogListScene extends BaseComponent {

    /**
     *
     **/
    constructor(props) {
        super(props);
        this.backlogListData = [];
        this.contentTypes = [];
        this.companyId = '';
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
            dataSource: ds.cloneWithRows(['0', '1']),
            isRefreshing: false,
            renderPlaceholderOnly: 'success'
        });*/
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                this.companyId = datas.company_base_id;
                GetRoleUtil.getRoleList((list) => {
                    //console.log('listlistlist==-=-=-=-', list);
                    for (let i = 0; i < list.length; i++) {
                        if (list[i].id == 32) {
                            this.contentTypes.push('taskPGS');
                        } else if (list[i].id == 33) {
                            this.contentTypes.push('taskZBY');
                        } else if (list[i].id == 34) {
                            this.contentTypes.push('taskManager');
                        } else if (list[i].id == 35) {
                            this.contentTypes.push('taskYYZY');
                        }
                    }
                    this.contentTypes.push('taskRemind');
                    this.contentTypes.push('taskTenure');
                    this.contentTypes.push('taskDC');
                    //this.contentTypes = list;
                    this.loadData();
                });
            }
        });

    };

    /**
     *
     **/
    loadData = () => {
        StorageUtil.mGetItem(StorageKeyNames.PHONE, (data) => {
            if (data.code == 1 && data.result != null) {
                this.custPhone = data.result;
                let maps = {
                    //pushTo: '15102373842',
                    pushTo: this.custPhone + this.companyId,
                    //token: '5afa531b-4295-4c64-8d6c-ac436c619078'
                    //createTime: '2017-08-09 15:18:47'
                    contentTypes: JSON.stringify(this.contentTypes)
                };
                let url = AppUrls.SELECT_MSG_BY_CONTENT_TYPE;
                request(url, 'post', maps).then((response) => {
                    this.backlogListData = response.mjson.data;
                    if (this.backlogListData && this.backlogListData.length > 0) {
                        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        this.setState({
                            dataSource: ds.cloneWithRows(this.backlogListData),
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
                //this.props.showToast('确认验收失败');
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
                <NavigatorView title='待办事项' backIconClick={this.backPage}/>
            </View>);
        } else {
            return (<View style={styles.container}>
                <NavigatorView title='待办事项' backIconClick={this.backPage}/>
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
     *
     **/
    _renderRow = (rowData, selectionID, rowID) => {
        if (rowData.contentType == 'taskPGS' || rowData.contentType == 'taskZBY' || rowData.contentType == 'taskManager' ||
            rowData.contentType == 'taskYYZY') {
            let index = 0;
            if (rowData.contentType == 'taskPGS') {
                index = 1;
            } else if (rowData.contentType == 'taskZBY') {
                index = 2;
            } else if (rowData.contentType == 'taskManager') {
                index = 3;
            } else if (rowData.contentType == 'taskYYZY') {
                index = 4;
            }
            return (
                <TouchableOpacity
                    onPress={() => {
                        this.toNextPage({
                            name: 'CarTrimScene',
                            component: CarTrimScene,
                            params: {
                                defaultIndex: index
                            }
                        });
                    }}>
                    <View style={styles.listItem}>
                        <Text allowFontScaling={false} style={styles.title}>车辆整备</Text>
                        <Text allowFontScaling={false} style={styles.describe}>{rowData.content}</Text>
                        <View style={styles.separatedLine}/>
                        <View style={styles.subItem}>
                            <Text allowFontScaling={false} style={styles.subTitle}>查看详情</Text>
                            <View style={{flex: 1}}/>
                            <Image source={cellJianTou} style={styles.image}/>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        } else if (rowData.contentType == 'taskTenure') {
            return (
                <TouchableOpacity
                    onPress={() => {
                        this.toNextPage({
                            name: 'KeepCustomerManageScene',
                            component: KeepCustomerManageScene,
                            params: {
                                //defaultIndex: index
                            }
                        });
                    }}>
                    <View style={styles.listItem}>
                        <Text allowFontScaling={false} style={styles.title}>保有客户跟进</Text>
                        <Text allowFontScaling={false} style={styles.describe}>{rowData.content}</Text>
                        <View style={styles.separatedLine}/>
                        <View style={styles.subItem}>
                            <Text allowFontScaling={false} style={styles.subTitle}>查看详情</Text>
                            <View style={{flex: 1}}/>
                            <Image source={cellJianTou} style={styles.image}/>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        } else if (rowData.contentType == 'taskRemind') {
            return (
                <TouchableOpacity
                    onPress={() => {
                        this.toNextPage({
                            name: 'StoreReceptionManageNewScene',
                            component: StoreReceptionManageNewScene,
                            params: {
                                timeSelect: '本月'
                            }
                        });
                    }}>
                    <View style={styles.listItem}>
                        <Text allowFontScaling={false} style={styles.title}>门店客户跟进</Text>
                        <Text allowFontScaling={false} style={styles.describe}>{rowData.content}</Text>
                        <View style={styles.separatedLine}/>
                        <View style={styles.subItem}>
                            <Text allowFontScaling={false} style={styles.subTitle}>查看详情</Text>
                            <View style={{flex: 1}}/>
                            <Image source={cellJianTou} style={styles.image}/>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity
                    onPress={() => {

                    }}>
                    <View style={styles.listItem}>

                    </View>
                </TouchableOpacity>
            )
        }
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