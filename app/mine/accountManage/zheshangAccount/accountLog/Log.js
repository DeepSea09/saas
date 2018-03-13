/**
 * Created by dingyonggang on 2017/10/27.
 */
import React, {Component} from "react";
import {
    View,
    Text, Image,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    InteractionManager,
    TouchableWithoutFeedback,
    ScrollView,
    RefreshControl,
    ListView,
} from "react-native";
import BaseComponent from "../../../../component/BaseComponent";
import NavigationBar from "../../../../component/NavigationBar";
import * as FontAndColor from "../../../../constant/fontAndColor";
import PixelUtil from "../../../../utils/PixelUtil";
import MyButton from "../../../../component/MyButton";
import {request} from "../../../../utils/RequestUtil";
import * as AppUrls from "../../../../constant/appUrls";
import StorageUtil from "../../../../utils/StorageUtil";
import * as StorageKeyNames from "../../../../constant/storageKeyNames";
import SText from '../component/SaasText'
import DateTimePicker from 'react-native-modal-datetime-picker';

let Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');
let Pixel = new PixelUtil();
let Platform = require('Platform');

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2})
let log_data = []  //所有的流水数据
let page = 1;  // 当前加载到第几页
let total_page = 1;  //总共页数
let type = 'all'  // 交易类型
let create_time = ''  //  交易时间  为空表示所有时间
let old_date = ''  //
let rows = []   // 每个月的流水数据
export default class Log extends BaseComponent {

    componentWillUnmount() {
        log_data = []
        page = 1;
        total_page = 1;
        type = 'all'
        create_time = ''
        old_date = ''
        rows = []
    }

    constructor(props) {
        super(props)

        this.state = {
            source: ds.cloneWithRowsAndSections([]),
            isShowSheet: false,
            screeningType: 0,
            refreshing: false,
            isDateTimePickerVisible: false,
        }
    }

    initFinish() {
        this.loadLog()
    }

    //加载流水
    loadLog = () => {

        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code === 1) {
                let result = JSON.parse(data.result)

                let params = {
                    bank_id: 316,
                    enter_base_id: result.company_base_id,
                    transfer_type: type,
                    user_type: this.props.account.account_open_type,
                    page: page,
                    create_time: create_time
                }


                request(AppUrls.ZS_WORTER_FLOW, 'POST', params).then((response) => {
                    console.log(response)
                    this.setState({
                        renderPlaceholderOnly: 'success',
                        refreshing: false
                    })
                    this.props.showModal(false)
                    total_page = response.mjson.data.total_page;

                    response.mjson.data.data.map((data) => {

                        let splited_date = data.create_time.split(' ');
                        let d = splited_date[0]

                        if (d !== old_date) {
                            rows = [];
                            log_data.push(rows);
                            old_date = d
                        }
                        rows.push(data)
                    })

                    if (log_data.length === 0 &&  create_time!== '') {
                        log_data = [[{create_time: create_time}]]
                    }else if(log_data.length ===0 && create_time === '') {
                        this.setState({
                            renderPlaceholderOnly:'null'
                        })
                    }

                    this.setState({
                        source: ds.cloneWithRowsAndSections(log_data)
                    })

                }, (error) => {

                    this.setState({
                        renderPlaceholderOnly: 'error',
                        refreshing: false
                    })
                    this.props.showModal(false)
                    this.setState({
                        sms_pad: false
                    })
                    this.props.showToast(error.mjson.msg)

                })
            }
        })

    }


    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (
                <View style={{flex: 1, backgroundColor: 'white'}}>
                    <NavigationBar
                        leftImageShow={true}
                        leftImageCallBack={() => {
                            this.backPage()
                        }}
                        leftTextShow={false}
                        centerText={'账户流水'}
                        rightImageShow={true}
                        rightTextShow={false}
                        rightImage={require('../../../../../images/account/screening.png')}
                    />

                    {this.loadView()}

                </View>
            )
        }


        return (
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <NavigationBar
                    leftImageShow={true}
                    leftImageCallBack={() => {
                        this.backPage()
                    }}
                    leftTextShow={false}
                    centerText={'账户流水'}
                    rightImageShow={true}
                    rightTextShow={false}
                    rightImage={require('../../../../../images/account/screening.png')}
                    rightImageCallBack={() => {
                        this.setState({
                            isShowSheet: true,
                        })
                    }}
                />

                    <ListView
                        style={{height:height-64}}
                        //bounces={false}
                        renderSectionHeader={this._renderSectionHeader}
                        renderRow={this._renderRow}
                        renderSeparator={this._renderSeparator}
                        dataSource={this.state.source}
                        onEndReached={this._onEndReached}
                        onEndReachedThreshold={1}
                        initialListSize={10}
                        removeClippedSubviews={false}
                        renderFooter={this._renderFooter}
                        enableEmptySections={true}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => {
                                    this.setState({
                                        refreshing: true
                                    })
                                    log_data = []
                                    page = 1
                                    old_date = ''
                                    rows = []
                                    this.loadLog()
                                }}
                                colors={[FontAndColor.COLORB0]}
                                tintColor={FontAndColor.COLORB0}
                            />
                        }
                    />
                    {
                        this.state.isShowSheet ?
                            <View

                                style={{
                                    position: 'absolute',
                                    top:0,
                                    right:0,
                                    bottom:0,
                                    left:0,
                                    backgroundColor: 'rgba(0,0,0,.4)'
                                }}>

                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        this.setState({
                                            isShowSheet: false,
                                        })
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                </TouchableWithoutFeedback>

                                <View style={{
                                    alignItems: 'center',
                                    paddingHorizontal: 15,
                                    backgroundColor: 'white',
                                    height: 100
                                }}>
                                    <View
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flex: 1,
                                            flexDirection: 'row',
                                            borderBottomWidth: StyleSheet.hairlineWidth,
                                            borderBottomColor: FontAndColor.COLORA4
                                        }}
                                    >
                                        <SText
                                            onPress={() => {
                                                this.props.showModal(true)
                                                log_data = []
                                                type = 3
                                                page = 1
                                                old_date = ''
                                                rows = []
                                                this.loadLog()
                                                this.setState({
                                                    isShowSheet: false,
                                                    screenningType: 1
                                                })
                                            }}

                                            style={{
                                                fontSize: 17,
                                                flex: 1,
                                                textAlign: 'center',
                                                color: this.state.screenningType === 1 ? FontAndColor.COLORB0 : 'black'
                                            }}>充值</SText>
                                    </View>
                                    <View
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            flex: 1
                                        }}
                                    >
                                        <SText
                                            onPress={() => {
                                                this.props.showModal(true)
                                                log_data = []
                                                page = 1;
                                                type = 4;
                                                old_date = ''
                                                rows = []
                                                this.loadLog()
                                                this.setState({
                                                    isShowSheet: false,
                                                    screenningType: 2
                                                })
                                            }}
                                            style={{
                                                fontSize: 17,
                                                textAlign: 'center',
                                                flex: 1,
                                                color: this.state.screenningType === 2 ? FontAndColor.COLORB0 : 'black'
                                            }}>提现</SText>
                                    </View>
                                </View>
                            </View>
                            : null
                    }
                    <DateTimePicker
                        titleIOS="请选择日期"
                        confirmTextIOS='确定'
                        cancelTextIOS='取消'
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this._handleDatePicked}
                        onCancel={this._hideDateTimePicker}/>

                <TouchableOpacity
                    onPress={() => {
                        this.setState({
                            isDateTimePickerVisible: true
                        })
                    }}
                    style={{position: 'absolute', right: 15, top: Pixel.getTitlePixel(64)+9}}
                >
                    <Image source={require('../../../../../images/account/date.png')}/>
                </TouchableOpacity>
            </View>

        )

    }

    _handleDatePicked = (date) => {
        this.setState({
            isDateTimePickerVisible: false

        })
        this.props.showModal(true)
        create_time = this.dateFormat(date, 'yyyy-MM-dd')
        log_data = []
        old_date = ''
        rows = []
        page = 1
        this.loadLog()

    }

    dateFormat = (date, fmt) => {
        let o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }


    _hideDateTimePicker = () => {
        this.setState({
            isDateTimePickerVisible: false
        })
    }
    _renderFooter = (data) => {

        if (log_data.length === 0) {
            return;
        }

        return (
            <View style={{alignItems: 'center', justifyContent: 'center', paddingVertical: 20}}>
                <SText>{page >= total_page ? typeof(log_data[0][0].id) === 'undefined' ? '暂无记录' : '无更多记录' : '加载更多...'}</SText>
            </View>
        )
    }

    _onEndReached = () => {
        page++
        if (page > total_page) {
            page--
            return
        }
        this.loadLog()
    }

    _renderSeparator = (sectionID, rowID) => {
        return (
            <View key={sectionID + '' + rowID}
                  style={{height: 1, flex: 1, marginHorizontal: 15, backgroundColor: FontAndColor.COLORA3}}/>
        )
    }
    _renderRow = (data, sectionID, rowID) => {

        if (data.id === null || data.id === '' || typeof(data.id) === 'undefined') {  //无数据
            return (<View/>)
        }
        return (
            <LogItem
                key={sectionID + '' + rowID}
                item={data}
            />
        )

    }

    _renderSectionHeader = (data, sectionID) => {

        let splited_date = data[0].create_time.split(' ')[0].split('-')

        let y = splited_date[0]
        let m = splited_date[1]
        let day = splited_date[2]


        return (
            <View style={{
                paddingHorizontal: 15,
                paddingVertical: 10,
                backgroundColor: FontAndColor.COLORA3,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <SText style={{flex: 1, fontSize: 16}}>{y + '年' + m + '月' + day + '日'}</SText>
                <TouchableOpacity
                    onPress={() => {
                        this.setState({
                            isDateTimePickerVisible: true
                        })
                    }}
                >
                    {/*<Image source={require('../../../../../images/account/date.png')}/>*/}
                </TouchableOpacity>
            </View>
        )
    }

}

class LogItem extends Component {

    render() {
        let c, t;
        if (this.props.item.t_operate_type === 3) {  //充值
            c = FontAndColor.COLORB1
            t = '充值'
        }
        if (this.props.item.t_operate_type === 4) {  //提现
            c = FontAndColor.COLORA2
            t = '提现'
        }
        return (
            <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 15, paddingVertical: 20}}>
                <View style={{
                    width: 50,
                    height: 50,
                    backgroundColor: c,
                    borderRadius: 50 / 2,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <SText style={{color: 'white', fontSize: 15}}>{t}</SText>
                </View>
                <View style={{marginLeft: 15, flex: 1}}>
                    <SText style={{marginBottom: 15, fontSize: 16}}>{this.props.item.show}</SText>
                    <SText style={{color: FontAndColor.COLORA1}}>{this.props.item.create_time}</SText>
                </View>
                <SText style={{color: FontAndColor.COLORB2, fontSize: 18}}>{this.props.item.amount}元</SText>
            </View>
        )
    }
}