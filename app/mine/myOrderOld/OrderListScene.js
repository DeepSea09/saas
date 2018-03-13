/**
 * Created by hanmeng on 2017/5/8.
 * 采购订单
 */
import React, {Component, PropTypes} from 'react'
import {
    StyleSheet,
    View,
    Text,
    ListView,
    TouchableOpacity,
    Image,
    BackAndroid,
    InteractionManager,
    RefreshControl,
    Dimensions
} from  'react-native'

const {width, height} = Dimensions.get('window');
import BaseComponent from "../../component/BaseComponent";
import * as fontAndColor from '../../constant/fontAndColor';
import NavigatorView from '../../component/AllNavigationView';
import PixelUtil from '../../utils/PixelUtil'
import OrderScreeningScene from "./OrderScreeningScene";
import OrderSearchScene from "./OrderSearchScene";
import ProcurementOrderDetailScene from "./ProcurementOrderDetailScene";
import SalesOrderDetailScene from "./SalesOrderDetailScene";
import * as AppUrls from "../../constant/appUrls";
import {request} from "../../utils/RequestUtil";
import LoadMoreFooter from "../../carSource/znComponent/LoadMoreFooter";
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";

var Pixel = new PixelUtil();

export default class OrderListScene extends BaseComponent {

    // 构造
    constructor(props) {
        super(props);
        this.orderListData = [];
        this.pageNum = 1;
        this.allPage = 1;
        this.orderState = 0;
        this.status = this.props.status;
        this.startDate = '选择开始时间';
        this.endDate = '选择结束时间';
        this.payType = 0;
        this.payTypeKey = '';
        //let business = this.props.business;
        this.state = {
            dataSource: [],
            renderPlaceholderOnly: 'blank',
            isRefreshing: false,
        };
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
        /*        this.setState({
         dataSource: this.state.dataSource.cloneWitatahRows(['', '', '']),
         renderPlaceholderOnly: 'success'
         });*/
        this.loadData();
    };

    dateReversal = (time) => {
        const date = new Date();
        date.setTime(time);
        return (date.getFullYear() + "-" + (this.PrefixInteger(date.getMonth() + 1, 2)) + "-" +
        (this.PrefixInteger(date.getDate(), 2)));
    };

    PrefixInteger = (num, length) => {
        return (Array(length).join('0') + num).slice(-length);
    };

    // 下拉刷新数据
    refreshingData = () => {
        this.orderListData = [];
        this.setState({isRefreshing: true});
        this.loadData();
    };

    loadData = () => {
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    company_id: datas.company_base_id,
                    business: this.props.business,
                    page: 1,
                    rows: 10,
                    //list_state: this.props.listState,
                    is_finance: this.payTypeKey,
                    status: this.status,
                    start_time: this.startDate === '选择开始时间' ? '' : this.startDate,
                    end_time: this.endDate === '选择结束时间' ? '' : this.endDate
                };
                let url = AppUrls.ORDER_INDEX;
                this.pageNum = 1;
                request(url, 'post', maps).then((response) => {
                    this.props.showModal(false);
                    this.orderListData = response.mjson.data.items;
                    this.allPage = response.mjson.data.total / response.mjson.data.rows;
                    //console.log('订单列表数据 = ', this.orderListData[0].car);
                    if (this.orderListData) {
                        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        this.setState({
                            dataSource: ds.cloneWithRows(this.orderListData),
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
                    //console.log('请求错误 = ', error);
                    this.setState({
                        isRefreshing: false,
                        renderPlaceholderOnly: 'error'
                    });
                });
            } else {
                this.props.showModal(false);
                //console.log('请求错误 = ', error);
                this.setState({
                    isRefreshing: false,
                    renderPlaceholderOnly: 'error'
                });
            }
        });
    };

    renderListFooter = () => {
        if (this.state.isRefreshing) {
            return null;
        } else {
            return (<LoadMoreFooter isLoadAll={this.pageNum >= this.allPage} isCarFoot={false}/>)
        }
    };

    toEnd = () => {
        if (this.pageNum < this.allPage && !this.state.isRefreshing) {
            this.loadMoreData();
        }
    };

    loadMoreData = () => {
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                this.pageNum += 1;
                let maps = {
                    company_id: datas.company_base_id,
                    business: this.props.business,
                    page: this.pageNum,
                    rows: 10,
                    //list_state: this.props.listState,
                    is_finance: this.payTypeKey,
                    status: this.status,
                    start_time: this.startDate === '选择开始时间' ? '' : this.startDate,
                    end_time: this.endDate === '选择结束时间' ? '' : this.endDate
                };
                let url = AppUrls.ORDER_INDEX;
                request(url, 'post', maps).then((response) => {
                    let data = response.mjson.data.items;
                    for (let i = 0; i < data.length; i++) {
                        this.orderListData.push(data[i]);
                    }
                    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                    this.setState({
                        isRefreshing: false,
                        dataSource: ds.cloneWithRows(this.orderListData)
                    });
                }, (error) => {
                    this.setState({
                        isRefreshing: false,
                        renderPlaceholderOnly: 'error'
                    });
                });
            } else {
                this.setState({
                    isRefreshing: false,
                    renderPlaceholderOnly: 'error'
                });
            }
        });
    };

    render() {
        if (this.props.business === 1) {
            if (this.state.renderPlaceholderOnly !== 'success') {
                // 加载中....
                return ( <View style={styles.container}>
                    {this.loadView()}
                    <NavigatorView title='采购订单' backIconClick={this.backPage}
                                   renderRihtFootView={this.renderRihtFootView}/>
                </View>);
            } else {
                return (<View style={styles.container}>
                    <NavigatorView title='采购订单' backIconClick={this.backPage}
                                   renderRihtFootView={this.renderRihtFootView}/>
                    <ListView style={{backgroundColor: fontAndColor.COLORA3, marginTop: Pixel.getTitlePixel(80)}}
                              dataSource={this.state.dataSource}
                              removeClippedSubviews={false}
                              renderRow={this._renderRow}
                              enableEmptySections={true}
                              renderSeparator={this._renderSeperator}
                              renderFooter={this.renderListFooter}
                              onEndReached={this.toEnd}
                              refreshControl={
                                  <RefreshControl
                                      refreshing={this.state.isRefreshing}
                                      onRefresh={this.refreshingData}
                                      tintColor={[fontAndColor.COLORB0]}
                                      colors={[fontAndColor.COLORB0]}
                                  />
                              }/>
                </View>);
            }
        } else {
            if (this.state.renderPlaceholderOnly !== 'success') {
                // 加载中....
                return ( <View style={styles.container}>
                    {this.loadView()}
                    <NavigatorView title='销售订单' backIconClick={this.backPage}
                                   renderRihtFootView={this.renderRihtFootView}/>
                </View>);
            } else {
                return (<View style={styles.container}>
                    <NavigatorView title='销售订单' backIconClick={this.backPage}
                                   renderRihtFootView={this.renderRihtFootView}/>
                    <ListView style={{backgroundColor: fontAndColor.COLORA3, marginTop: Pixel.getTitlePixel(84)}}
                              dataSource={this.state.dataSource}
                              renderRow={this._renderRow}
                              removeClippedSubviews={false}
                              enableEmptySections={true}
                              renderSeparator={this._renderSeperator}
                              renderFooter={this.renderListFooter}
                              onEndReached={this.toEnd}
                              refreshControl={
                                  <RefreshControl
                                      refreshing={this.state.isRefreshing}
                                      onRefresh={this.refreshingData}
                                      tintColor={[fontAndColor.COLORB0]}
                                      colors={[fontAndColor.COLORB0]}
                                  />
                              }/>
                </View>);
            }
        }
        //console.log('enderPlaceholderOnly===' + this.state.renderPlaceholderOnly);

    }

    renderRihtFootView = () => {
        return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                    onPress={() => {
                        this.toNextPage({
                            name: 'OrderSearchScene',
                            component: OrderSearchScene,
                            params: {
                                business: this.props.business,
                                status: this.status,
                            }
                        });
                    }}
                    activeOpacity={0.9}
                >
                    <Image source={require('../../../images/mainImage/search_order.png')}/>
                </TouchableOpacity>
                {/*筛选*/}
                <TouchableOpacity
                    style={{marginLeft: Pixel.getPixel(10)}}
                    onPress={() => {
                        this.toNextPage({
                            name: 'OrderScreeningScene',
                            component: OrderScreeningScene,
                            params: {
                                business: this.props.business,
                                //orderStage: this.props.listState,
                                orderState: this.orderState,
                                startDate: this.startDate,
                                endDate: this.endDate,
                                status: this.status,
                                payType: this.payType,
                                payTypeKey: this.payTypeKey,
                                returnConditions: this.returnConditions
                            }
                        });
                    }}
                    activeOpacity={0.9}
                >
                    <Image source={require('../../../images/mainImage/screening.png')}/>
                </TouchableOpacity>
            </View>
        )
    }

    /**
     * from @hanmeng
     *
     *
     **/
    returnConditions = (newOrderState, newStartDate, newEndDate, newStatus, newPayType, newpayTypeKey) => {
        if (this.orderState === newOrderState &&
            this.startDate === newStartDate &&
            this.endDate === newEndDate &&
            this.payType === newPayType) {
            return;
        }
        this.props.showModal(true);
        this.orderState = newOrderState;
        this.startDate = newStartDate;
        this.endDate = newEndDate;
        this.status = newStatus;
        this.payType = newPayType;
        this.payTypeKey = newpayTypeKey;
        this.loadData();
    };

    _renderSeperator = (sectionID: number, rowID: number, adjacentRowHighlighted: bool) => {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{backgroundColor: fontAndColor.COLORA3, height: Pixel.getPixel(10)}}/>
        )
    }

    _renderRow = (rowData, selectionID, rowID) => {
        //let initRegDate = rowData.car.length ? this.dateReversal(rowData.car[0].init_reg + '000') : '未公开';
        //let imageUrl = rowData.car.length ? rowData.car[0].thumbs : [];
        let initReg = rowData.car[0].init_reg;
        let mileage = rowData.car[0].mileage;
        let initRegDate = initReg === 0 ? '暂无' : this.dateReversal(initReg + '000');
        let imageUrl = rowData.car.length ? rowData.car[0].thumbs : [];

        //let transactionPrice = rowData.car.length ? rowData.car[0].transaction_price : '0.00';
        let transactionPrice = rowData.order.transaction_amount;
        let depositAmount = rowData.order.deposit_amount;
/*        if (rowData.order.status_number == 0 || rowData.order.status_number == 1) {
            transactionPrice = '0.00';
            depositAmount = '0.00';
        }*/
        return (
            <TouchableOpacity
                onPress={() => {
                    if (this.props.business === 1) {
                        if (rowData.order.power === 1) {
                            this.toNextPage({
                                name: 'ProcurementOrderDetailScene',
                                component: ProcurementOrderDetailScene,
                                params: {
                                    business: this.props.business,
                                    orderId: rowData.order.id
                                }
                            });
                        } else {
                            this.props.showToast('您没有权限操作此订单');
                        }
                    } else {
                        if (rowData.order.power === 1) {
                            this.toNextPage({
                                name: 'SalesOrderDetailScene',
                                component: SalesOrderDetailScene,
                                params: {
                                    business: this.props.business,
                                    orderId: rowData.order.id
                                }
                            });
                        } else {
                            this.props.showToast('您没有权限操作此订单');
                        }
                    }
                }}
                activeOpacity={0.8}>
                <View style={styles.rowView}>
                    <View style={styles.rowTitleLine}>
                        <View>
                            <Text allowFontScaling={false} 
                                includeFontPadding={false}
                                style={{
                                fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                                color: fontAndColor.COLORA0
                            }}>{rowData.order.company}</Text>
                            <Text allowFontScaling={false} 
                                includeFontPadding={false}
                                style={{
                                marginTop: Pixel.getPixel(3),
                                fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                                color: fontAndColor.COLORA1
                            }}>订单号:({rowData.order.order_no})</Text>
                        </View>
                        <View style={{flex: 1}}/>
                        <Text allowFontScaling={false}  style={styles.rowTitleState}>{rowData.order.status}</Text>
                    </View>
                    <View style={styles.separatedLine}/>
                    <View style={{flexDirection: 'row', height: Pixel.getPixel(104), alignItems: 'center'}}>
                        <Image style={styles.image}
                               source={imageUrl.length ? {uri: imageUrl[0].icon_url} : require('../../../images/carSourceImages/car_null_img.png')}/>
                        <View style={{marginLeft: Pixel.getPixel(10), marginRight: Pixel.getPixel(15)}}>
                            <Text allowFontScaling={false} 
                                style={{width: width - Pixel.getPixel(15 + 120 + 10 + 15)}}
                                numberOfLines={1}
                            >{rowData.car.length ? rowData.car[0].title : '未公开'}</Text>
                            <View style={{flexDirection: 'row', marginTop: Pixel.getPixel(10), alignItems: 'center'}}>
                                <Text allowFontScaling={false}  style={styles.carDescribeTitle}>里程：</Text>
                                <Text allowFontScaling={false} 
                                    style={styles.carDescribe}>{rowData.car.length ? mileage + '万' : '未公开'}</Text>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: Pixel.getPixel(5), alignItems: 'center'}}>
                                <Text allowFontScaling={false}  style={styles.carDescribeTitle}>上牌：</Text>
                                <Text allowFontScaling={false}  style={styles.carDescribe}>{initRegDate}</Text>
                            </View>
                            {/*                            <View style={{flexDirection: 'row', marginTop: Pixel.getPixel(5), alignItems: 'center'}}>
                             <Text allowFontScaling={false}  style={styles.carDescribeTitle}>标价：</Text>
                             <Text allowFontScaling={false}  style={styles.carDescribe}>20.59万</Text>
                             </View>*/}
                        </View>
                    </View>
                    <View style={styles.separatedLine}/>
                    <View style={{
                        height: Pixel.getPixel(40),
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}>
                        <Text allowFontScaling={false}  style={{
                            fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                            color: fontAndColor.COLORA1
                        }}>成交价：</Text>
                        <Text allowFontScaling={false}  style={{
                            fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                            color: fontAndColor.COLORA0,
                            fontWeight: 'bold'
                        }}>{transactionPrice}</Text>
                        <Text allowFontScaling={false}  style={{
                            fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                            color: fontAndColor.COLORA1,
                            marginLeft: Pixel.getPixel(25)
                        }}>订金：</Text>
                        <Text allowFontScaling={false}  style={{
                            fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                            color: fontAndColor.COLORA0,
                            fontWeight: 'bold',
                            marginRight: Pixel.getPixel(15)
                        }}>{depositAmount}</Text>
                    </View>
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
    rowView: {
        height: Pixel.getPixel(186),
        backgroundColor: 'white'
    },
    rowTitleLine: {
        alignItems: 'center',
        height: Pixel.getPixel(40),
        justifyContent: 'flex-start',
        flexDirection: 'row',
        //marginTop: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)
    },
    rowTitleState: {
        alignItems: 'flex-end',
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        color: fontAndColor.COLORB2,
        marginRight: Pixel.getPixel(15)
    },
    separatedLine: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15),
        height: 1,
        backgroundColor: fontAndColor.COLORA4
    },
    image: {
        marginLeft: Pixel.getPixel(15),
        width: Pixel.getPixel(120),
        height: Pixel.getPixel(80),
        resizeMode: 'stretch'
    },
    carDescribeTitle: {
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
        color: fontAndColor.COLORA1
    },
    carDescribe: {
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
        color: fontAndColor.COLORA0
    }
});