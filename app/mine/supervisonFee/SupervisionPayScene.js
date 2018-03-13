import React, {Component, PropTypes} from 'react'
import {

    View,
    Text,
    ListView,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    RefreshControl,
    Platform,
} from 'react-native'

import * as fontAndColor from '../../constant/fontAndColor';
import PixelUtil from '../../utils/PixelUtil'

var Pixel = new PixelUtil();
import BaseComponent from "../../component/BaseComponent";
import {request} from '../../utils/RequestUtil';
import * as Urls from '../../constant/appUrls';
import LoadMoreFooter from '../../component/LoadMoreFooter';
import CheckStand from "./CheckStand";
import AccountManageScene from '../../mine/accountManage/AccountTypeSelectScene';
import WaitActivationAccountScene from '../../mine/accountManage/WaitActivationAccountScene';
import AccountScene from '../../mine/accountManage/AccountScene';
import BindCardScene from '../../mine/accountManage/BindCardScene';
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";
/*
 * 获取屏幕的宽和高
 **/
let page = 1;
let allSouce = [];
const {width, height} = Dimensions.get('window');
import * as fontAndClolr from '../../constant/fontAndColor';

let lastType = '-1';
let listLength=0;
export default class SupervisionPayScene extends BaseComponent {
    constructor(props) {
        super(props);
        listLength=0;
        this.payList=[];
        this.tabNum = this.props.tabNum;
        lastType = '-1';
        allSouce = [];
        this.url = '';
        this.accountStatus = '';
        this.isVisible = false;
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.accountStatus = '';
        this.state = {
            dataSource: this.ds.cloneWithRows(allSouce),
            renderPlaceholderOnly: 'blank',
            isRefreshing: false,
            accountStatus: '',
            isVisible: false,
        };
    }

    initFinish = () => {
        allSouce = [];
        this.getData();
    }

    allRefresh = () => {
        allSouce = [];
        this.setState({
            renderPlaceholderOnly: 'loading',
        });
        this.getData();
    }


    getData = () => {
        let maps = {
            api: Urls.SUPERVISE_LIST,
            status: '3',
        };
        request(Urls.FINANCE, 'Post', maps)

            .then((response) => {
                    // let data=json.data.response;
                    let data=response.mjson.data;
                    this.payList=[];
                    if (page == 1 && data.order_list.length <= 0) {
                        listLength=0;
                        this.setState({renderPlaceholderOnly: 'noData'});
                    } else {

                        allSouce.push(...data.order_list);
                        allSouce.map((data)=>{
                            if(data.pay_status=='3'){
                                this.payList.push(data);
                            }
                        })
                        listLength=this.payList.length;
                        this.setState({
                            dataSource: this.ds.cloneWithRows(allSouce),
                            isRefreshing: false
                        });
                        this.setState({renderPlaceholderOnly: 'success'});
                    }
                    this.props.freshData(listLength);
                },
                (error) => {
                    this.setState({renderPlaceholderOnly: 'error', isRefreshing: false});
                });
    }

    refreshingData = () => {
        allSouce = [];
        this.setState({isRefreshing: true});
        this.getData();
    };

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (<View style={{backgroundColor: fontAndColor.COLORA3, flex: 1, paddingTop: Pixel.getPixel(15)}}>
                {this.loadView()}
            </View>);
        } else {

            return (
                <View style={{flex: 1,}}>
                    <View style={[styles.container , Platform.OS === 'android' ? {marginBottom: Pixel.getPixel(25)} : {}]}>
                        {
                            this.state.isVisible ? this._renderHeader() : null
                        }
                        <ListView
                            contentContainerStyle={styles.listStyle}
                            dataSource={this.state.dataSource}
                            removeClippedSubviews={false}
                            renderRow={this._renderRow}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this.refreshingData}
                                    tintColor={[fontAndColor.COLORB0]}
                                    colors={[fontAndColor.COLORB0]}
                                />
                            }
                        />

                    </View>
                </View>
            );
        }
    }

    // }
    _renderHeader = () => {
        return (
            <View style={styles.headerStyle}>
                <Text style={{color: '#846546', flex: 1, fontSize: 15}}>{"还未开通" + this.state.accountStatus}</Text>
                <TouchableOpacity activeOpacity={0.8} style={{
                    width: Pixel.getPixel(66),
                    height: Pixel.getPixel(27),
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ffbd2f',
                    borderRadius: 5
                }} onPress={() => {
                    this.toPage();
                }}>
                    <Text style={{color: 'white', fontSize: 15}}>{"去" + this.state.accountStatus}</Text>
                </TouchableOpacity>
            </View>);

    }

    // 每一行中的数据
    _renderRow = (rowData, sectionID, rowID,) => {
        let payStatus={};
        let statusText='';
        if(rowData.pay_status=='3'){
            payStatus={color: fontAndColor.COLORB1}
            statusText='已支付';
        }else {
            payStatus={color: fontAndColor.COLORB3};
            statusText='处理中';
        }
        return (
            <TouchableOpacity activeOpacity={0.8}>
                <View style={[styles.rowView, rowID == '0' ? {marginTop: 0} : {marginTop: Pixel.getPixel(10)}]}>

                    <View style={styles.orderNumStyle}>
                        <Text style={{flex: 1, fontSize: 14}}>{'订单号:' + rowData.supervision_fee_order_number}</Text>
                        <Text style={[{
                            color: fontAndColor.COLORB1,
                            fontSize: 14
                        },payStatus]}>{statusText}</Text>
                    </View>
                    <Text style={{
                        color: '#333333',
                        marginVertical: Pixel.getPixel(10),
                        fontSize: 14,
                        fontWeight: 'bold'
                    }}>{rowData.order_title}</Text>
                    <Text style={{color: '#9b9b9b', fontSize: 13}}>{'置换时间：' + rowData.regulation_time}</Text>
                </View>
            </TouchableOpacity>

        );
    }
}

const styles = StyleSheet.create({
    container: {

        flex: 1,
        marginTop: Pixel.getPixel(0),   //设置listView 顶在最上面
        backgroundColor: fontAndColor.COLORA3,
    },
    listStyle: {
        marginTop: Pixel.getPixel(0),
    },
    rowView: {
        backgroundColor: 'white',
        height: Pixel.getPixel(115),
        paddingHorizontal: Pixel.getPixel(16),
        borderBottomWidth: 1,
        borderColor: fontAndClolr.COLORA4,
    },
    headerStyle: {
        height: Pixel.getPixel(41),
        flexDirection: 'row',
        backgroundColor: '#FFF8EB',
        alignItems: 'center',
        paddingHorizontal: Pixel.getPixel(16),

    },
    footerStyle: {
        height: Pixel.getPixel(50),
        width: width,
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center',
        position: 'absolute',
        bottom: Pixel.getPixel(0),

    },
    orderNumStyle: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: fontAndClolr.COLORA4,
        height: Pixel.getPixel(40),
        alignItems: 'center',

    },

    rowRightTitle: {
        color: fontAndColor.COLORA3,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),

    },


});