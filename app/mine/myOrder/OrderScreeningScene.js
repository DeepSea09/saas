/**
 * Created by hanmeng on 2017/5/9.
 * 采购、销售订单筛选
 */
import React, {Component} from 'react';

import {
    View,
    StyleSheet,
    Dimensions,
    ListView,
    Text,
    BackAndroid,
    InteractionManager
} from "react-native";

const {width, height} = Dimensions.get('window');
import BaseComponent from "../../component/BaseComponent";
import NavigatorView from '../../component/AllNavigationView';
import * as fontAndColor from '../../constant/fontAndColor';
import PixelUtil from '../../utils/PixelUtil';
import MyButton from "../../component/MyButton";
import {request} from "../../utils/RequestUtil";
import * as AppUrls from "../../constant/appUrls";
import LabelParentPayType from "../../component/LabelParentPayType";
const Pixel = new PixelUtil();
const arrow = require('../../../images/publish/date-select.png');
import LabelParent from '../../component/LabelParent';
import SelectDate from './component/SelectDate';

let order_state = [];
let pay_type = [];

export default class OrderScreeningScene extends BaseComponent {

    constructor(props) {
        super(props);
        this.type = '';
        order_state = [];
        pay_type = [];
        //orderState: 0 --> 全部
        this.orderState = this.props.orderState;
        this.startDate = this.props.startDate;
        this.endDate = this.props.endDate;
        this.status = this.props.status;
        this.payType = this.props.payType;
        this.payTypeKey = this.props.payTypeKey;
        this.mList = [];
        if (this.props.business === 1) {
            if (this.props.status === 'finish' || this.props.status === 'closed') {
                this.mList = ['2', '3'];
            } else {
                this.mList = ['1', '2', '3'];
            }
        } else {
            if (this.props.status === 'finish' || this.props.status === 'closed') {
                this.mList = ['3'];
            } else {
                this.mList = ['1', '3'];
            }
        }
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        pay_type.push({title: '全部', isSelected: pay_type.length === this.payType, value: '', ref: 'type_child' + 0});
        pay_type.push({title: '全款', isSelected: pay_type.length === this.payType, value: 0, ref: 'type_child' + 1});
        pay_type.push({title: '订单融资', isSelected: pay_type.length === this.payType, value: 1, ref: 'type_child' + 2});
        this.state = {
            //source: ds.cloneWithRows(mList),
            source: ds,
            isDateTimePickerVisible: false,
            isRefreshing: false,
            renderPlaceholderOnly: 'blank'
        }

    }

    componentDidMount() {
        try {
            BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
        } catch (e) {

        } finally {
            //InteractionManager.runAfterInteractions(() => {
                this.setState({renderPlaceholderOnly: 'loading'});
                this.initFinish();
            //});
        }
    }

    initFinish = () => {
        this.loadData();
    };

    loadData = () => {
        let url = AppUrls.ORDER_FIELD_DICT;
        request(url, 'post', {
            type: 'orderList'
        }).then((response) => {
            if (this.props.business === 1) {
                let dict = response.mjson.data.orderList[0];
                for (var key in dict) {
                    order_state.push({
                        title: dict[key],
                        isSelected: order_state.length === this.orderState,
                        value: key,
                        ref: 'child' + key
                    });
                }
                this.setState({
                    source: this.state.source.cloneWithRows(this.mList),
                    isRefreshing: false,
                    renderPlaceholderOnly: 'success'
                });
            } else {
                let dict = response.mjson.data.orderList[1];
                for (var key in dict) {
                    order_state.push({
                        title: dict[key],
                        isSelected: order_state.length === this.orderState,
                        value: key,
                        ref: 'child' + key
                    });
                }
                this.setState({
                    source: this.state.source.cloneWithRows(this.mList),
                    isRefreshing: false,
                    renderPlaceholderOnly: 'success'
                });
            }
        }, (error) => {
            //console.log('请求错误 = ', error);
            this.setState({
                isRefreshing: false,
                renderPlaceholderOnly: 'error'
            });
        });
    };

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            // 加载中....
            return ( <View style={styles.container}>
                {this.loadView()}
                <NavigatorView title='筛选' backIconClick={this.backPage}/>
            </View>);
        } else {
            return (
                <View style={styles.container}>
                    <NavigatorView title='筛选' backIconClick={this.backPage}/>

                    <ListView
                        style={{marginTop: Pixel.getPixel(73)}}
                        dataSource={this.state.source}
                        renderRow={this._renderRow}
                        removeClippedSubviews={false}
                        renderSeparator={this._renderSeperator}
                        showsVerticalScrollIndicator={false}/>

                    <View style={{flex: 1}}/>
                    <MyButton buttonType={MyButton.TEXTBUTTON}
                              content={'确定'}
                              parentStyle={styles.loginBtnStyle}
                              childStyle={styles.loginButtonTextStyle}
                              mOnPress={this.confirmClick}/>

                </View>
            )
        }
    }

    confirmClick = () => {
        if ((this.startDate === '选择开始时间' && this.endDate !== '选择结束时间') ||
            (this.startDate !== '选择开始时间' && this.endDate === '选择结束时间')) {
            this.props.showToast('开始时间与结束时间不能单选');
            return;
        }
        if (this.startDate <= this.endDate) {
            this.props.returnConditions(this.orderState, this.startDate, this.endDate, this.status, this.payType, this.payTypeKey);
            this.backPage();
        } else {
            this.props.showToast('开始时间要小于结束时间');
        }

    }


    _renderSeperator = (sectionID: number, rowID: number, adjacentRowHighlighted: bool) => {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{backgroundColor: fontAndColor.COLORA3, height: Pixel.getPixel(10)}}/>
        )
    }

    _renderRow = (movie, sectionId, rowId) => {
        if (movie == 1) {
            return (
                <View style={styles.containerChild}>
                    <Text allowFontScaling={false}  style={styles.carType}>订单状态</Text>
                    <LabelParent items={order_state} orderState={this.orderState} updateState={this.setOrderState}
                                 updateStatus={this.setOrderStatus}/>
                </View>
            )
        } else if (movie == 2) {
            return (
                <View style={{
                    backgroundColor: '#ffffff'
                }}>
                    <Text allowFontScaling={false}  style={styles.carType}>付款方式</Text>
                    <LabelParentPayType items={pay_type} orderState={this.payType} updateState={this.setPayType}
                                 updateStatus={this.setpayTypeKey}/>
                </View>
            )
        } else if (movie == 3) {
            return (
                <SelectDate startDate={this.startDate} endDate={this.endDate} updateStartDate={this.setStartDate}
                            updateEndDate={this.setEndDate}/>
            )
        } else {
            return (
                <View/>
            )
        }

    }

    /**
     * from @hanmeng
     *
     *
     **/
    setPayType = (newPayType) => {
        this.payType = newPayType;
    }

    /**
     * from @hanmeng
     *
     *
     **/
    setpayTypeKey = (newpayTypeKey) => {
        this.payTypeKey = newpayTypeKey;
    }

    /**
     * from @hanmeng
     *
     *
     **/
    setOrderState = (newOrderState) => {
        this.orderState = newOrderState;
        //console.log('setOrderState = ',this.orderState);
    }

    /**
     * from @hanmeng
     *
     *
     **/
    setOrderStatus = (newStatus) => {
        this.status = newStatus;
        //console.log('status = ',this.status);
    }

    /**
     * from @hanmeng
     *
     *
     **/
    setStartDate = (newStartDate) => {
        this.startDate = newStartDate;
    }

    /**
     * from @hanmeng
     *
     *
     **/
    setEndDate = (newEndDate) => {
        this.endDate = newEndDate;
    }

    /**
     * from @hanmeng
     *
     *
     **/
    _showDateTimePicker = (type) => {
        this.type = type;
        this.setState({isDateTimePickerVisible: true})
    };


}

const styles = StyleSheet.create({
    labelSelect: {
        marginTop: Pixel.getPixel(10),
    },
    text: {
        fontSize: Pixel.getPixel(16),
        color: 'rgb(13, 131, 144)'
    },
    container: {
        flex: 1,
        backgroundColor: fontAndColor.COLORA3
    },
    carType: {
        marginLeft: Pixel.getPixel(15),
        fontSize: Pixel.getPixel(fontAndColor.BUTTONFONT30),
        marginTop: Pixel.getPixel(17)
    },
    containerChild: {
        //height: Pixel.getPixel(178),
        backgroundColor: '#ffffff',
        //paddingLeft: Pixel.getPixel(12),
        //marginBottom: Pixel.getPixel(10)
    },
    dateBox: {
        marginLeft: Pixel.getPixel(16),
        marginRight: Pixel.getPixel(16),
        justifyContent: 'center',
        //width: Pixel.getPixel(140),
        flex: 1,
        height: Pixel.getPixel(32),
        backgroundColor: fontAndColor.COLORA3
    },
    loginBtnStyle: {
        height: Pixel.getPixel(44),
        width: width - Pixel.getPixel(30),
        backgroundColor: fontAndColor.COLORB0,
        marginTop: Pixel.getPixel(30),
        marginBottom: Pixel.getPixel(30),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Pixel.getPixel(4),
        marginLeft: Pixel.getPixel(15)
    },
    loginButtonTextStyle: {
        color: fontAndColor.COLORA3,
        fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT)
    }
});