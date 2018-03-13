/**
 * Created by hanmeng on 2017/5/11.
 */

import React, {Component, PropTypes} from 'react'

import {
    StyleSheet,
    View,
    Text,
    ListView,
    TouchableOpacity,
    Image,
    Dimensions,
    TextInput,
    RefreshControl,
    Keyboard
} from  'react-native'
import BaseComponent from "../../component/BaseComponent";
import * as fontAndColor from '../../constant/fontAndColor';
import PixelUtil from '../../utils/PixelUtil';
import * as AppUrls from "../../constant/appUrls";
import {request} from "../../utils/RequestUtil";
import LoadMoreFooter from "../../carSource/znComponent/LoadMoreFooter";
import ProcurementOrderDetailScene from "./ProcurementOrderDetailScene";
import SalesOrderDetailScene from "./SalesOrderDetailScene";
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";
const Pixel = new PixelUtil();
const {width, height} = Dimensions.get('window');

export default class OrderSearchScene extends BaseComponent {

    // 构造
    constructor(props) {
        super(props);
        this.pageNum = 1;
        this.allPage = 1;
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            renderPlaceholderOnly: 'blank',
            isRefreshing: false,
            value: '',
            startSearch: 0
        };
    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow() {
        //alert('Keyboard Shown');
    }

    _keyboardDidHide() {
        //alert('Keyboard Hidden');
    }

    initFinish = () => {
        //this.loadData();
        this.setState({
            renderPlaceholderOnly: 'success'
        });
    }

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

    startSearch = () => {
        Keyboard.dismiss();
        if (this.state.value === '') {
            this.props.showToast('车辆名称不能为空');
        } else {
            this.setState({
                startSearch: 1,
                renderPlaceholderOnly: 'loading'
            });
            this.loadData();
        }
    };

    renderListFooter = () => {
        if (this.state.isRefreshing) {
            return null;
        } else {
            return (<LoadMoreFooter isLoadAll={this.pageNum >= this.allPage} isCarFoot={false}/>)
        }
    };

    loadData = () => {
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                this.pageNum = 1;
                let maps = {
                    company_id: datas.company_base_id,
                    business: this.props.business,
                    page: this.pageNum,
                    rows: 10,
                    car_name: this.state.value,
                    status: this.props.status
                };
                let url = AppUrls.ORDER_SEARCH;
                request(url, 'post', maps).then((response) => {
                    this.orderListData = response.mjson.data.items;
                    this.allPage = response.mjson.data.total / response.mjson.data.rows;
                    if (this.orderListData) {
                        this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(this.orderListData),
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
                this.setState({
                    isRefreshing: false,
                    renderPlaceholderOnly: 'error'
                });
            }
        });
    };

    _renderPlaceholderView() {
        return (
            <View style={styles.container}>
                <View style={styles.navigatorView}>
                    <View style={styles.navitgatorContentView}>
                        <TouchableOpacity
                            style={{justifyContent: 'center'}}
                            onPress={this.backPage}>
                            <Image style={styles.backIcon}
                                   source={require('../../../images/mainImage/navigatorBack.png')}/>
                        </TouchableOpacity>
                        <View style={styles.navigatorSousuoView}>
                            <Image style={{marginLeft: Pixel.getPixel(15), marginRight: Pixel.getPixel(10)}}
                                   source={require('../../../images/carSourceImages/sousuoicon.png')}/>
                            <TextInput
                                onChangeText={(text) => this.setState({value: text})}
                                placeholder={"请输入车辆名称"}
                                style={styles.inputStyle}
                                underlineColorAndroid="transparent"

                            />
                        </View>
                        <TouchableOpacity onPress={this.startSearch}>
                            <View style={{
                                marginLeft: Pixel.getPixel(10),
                                width: Pixel.getPixel(50),
                                height: Pixel.getPixel(40),
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text allowFontScaling={false}  style={{
                                    color: 'white',
                                    fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30)
                                }}>搜索</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                {this.loadView()}
            </View>
        );
    }

    toEnd = () => {
        if (this.orderListData.length && !this.state.isRefreshing) {
            //this.loadMoreData();
        }
    };

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        } else {
            return (
                <View style={styles.container}>
                    <View style={styles.navigatorView}>
                        <View style={styles.navitgatorContentView}>
                            <TouchableOpacity
                                style={{justifyContent: 'center'}}
                                onPress={this.backPage}>
                                <Image style={styles.backIcon}
                                       source={require('../../../images/mainImage/navigatorBack.png')}/>
                            </TouchableOpacity>
                            <View style={styles.navigatorSousuoView}>
                                <Image style={{marginLeft: Pixel.getPixel(15), marginRight: Pixel.getPixel(10)}}
                                       source={require('../../../images/carSourceImages/sousuoicon.png')}/>
                                <TextInput
                                    onChangeText={(text) => this.setState({value: text})}
                                    placeholder={"请输入车辆名称"}
                                    style={styles.inputStyle}
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                            <TouchableOpacity onPress={this.startSearch}>
                                <View style={{
                                    marginLeft: Pixel.getPixel(10),
                                    width: Pixel.getPixel(50),
                                    height: Pixel.getPixel(40),
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Text allowFontScaling={false}  style={{
                                        color: 'white',
                                        fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30)
                                    }}>搜索</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ListView style={{backgroundColor: fontAndColor.COLORA3, marginTop: Pixel.getPixel(14)}}
                              dataSource={this.state.dataSource}
                              renderRow={this._renderRow}
                              removeClippedSubviews={false}
                              enableEmptySections={true}
                              renderSeparator={this._renderSeperator}
                              renderFooter={this.state.startSearch === 0 ? null : this.renderListFooter}
                              onEndReached={this.state.startSearch === 0 ? null : this.toEnd}
                              refreshControl={this.state.startSearch === 0 ? null :
                                  <RefreshControl
                                      refreshing={this.state.isRefreshing}
                                      onRefresh={this.refreshingData}
                                      tintColor={[fontAndColor.COLORB0]}
                                      colors={[fontAndColor.COLORB0]}
                                  />
                              }/>
                </View>
            )
        }
    }

    _renderSeperator = (sectionID: number, rowID: number, adjacentRowHighlighted: bool) => {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{backgroundColor: fontAndColor.COLORA3, height: Pixel.getPixel(10)}}/>
        )
    }

    _renderRow = (rowData, selectionID, rowID) => {
        let initReg = rowData.car[0].init_reg;
        let mileage = rowData.car[0].mileage;
        let initRegDate = initReg === 0 ? '暂无' : this.dateReversal(initReg + '000');
        let imageUrl = rowData.car.length ? rowData.car[0].thumbs : [];

        let transactionPrice = rowData.order.transaction_amount;
        let depositAmount = rowData.order.deposit_amount;
        //item 布局
        return (
            <TouchableOpacity
                onPress={() => {
                    if (this.props.business === 1) {
                        if (rowData.order.power === 1) {
                            this.toNextPage({
                                name: 'ProcurementOrderDetailScene',
                                component: ProcurementOrderDetailScene,
                                params: {
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
                        <View style={{marginLeft: Pixel.getPixel(10)}}>
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
                            {/*                            <View style={{flexDirection: 'row', marginTop: Pixel.dgetPixel(5), alignItems: 'center'}}>
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
        backgroundColor: fontAndColor.COLORA3
    },
    backIcon: {

        marginLeft: Pixel.getPixel(12),
        height: Pixel.getPixel(20),
        width: Pixel.getPixel(20),
    },
    checkedContentView: {

        backgroundColor: fontAndColor.COLORA3,
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent:'space-between',
        flexWrap: 'wrap',
    },

    checkedContentItem: {

        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: Pixel.getPixel(20),
        paddingHorizontal: Pixel.getPixel(5),
        marginLeft: Pixel.getPixel(15),
        marginTop: Pixel.getPixel(5),
        marginBottom: Pixel.getPixel(5),
        borderRadius: 4,
    },
    checkedItemText: {
        color: fontAndColor.COLORA0,
        fontSize: fontAndColor.CONTENTFONT,
    },
    checkedDeleteImg: {
        width: Pixel.getPixel(10),
        height: Pixel.getPixel(10),
        marginLeft: Pixel.getPixel(5),
    },
    checkedDelectView: {
        height: Pixel.getPixel(20),
        width: Pixel.getPixel(50),
        borderRadius: 4,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: fontAndColor.COLORA2,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Pixel.getPixel(10),
        marginLeft: Pixel.getPixel(15),
        marginTop: Pixel.getPixel(10),
    },
    checkedDelectText: {
        color: fontAndColor.COLORA2,
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT),
    },
    carCell: {
        height: Pixel.getPixel(110),
    },
    navigatorView: {
        top: 0,
        height: Pixel.getTitlePixel(64),
        backgroundColor: fontAndColor.COLORB0,
        flexDirection: 'row'
    },
    navitgatorContentView: {
        flex: 1,
        flexDirection: 'row',
        marginTop: Pixel.getTitlePixel(20),
        height: Pixel.getPixel(44),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: fontAndColor.COLORB0
    },
    navigatorLoactionView: {
        flexDirection: 'row',
        width: Pixel.getPixel(85),
        alignItems: 'center'
    },
    navigatorSousuoView: {
        height: Pixel.getPixel(27),
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        width: width - Pixel.getPixel(100),
        flexDirection: 'row'
    },
    navigatorText: {
        marginLeft: Pixel.getPixel(6),
        color: 'white',
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),

    },
    navigatorSousuoText: {

        color: fontAndColor.COLORA1,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),

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
    },
    rowTitleLine: {
        alignItems: 'center',
        height: Pixel.getPixel(40),
        justifyContent: 'flex-start',
        flexDirection: 'row',
        //marginTop: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)
    },
    rowView: {
        height: Pixel.getPixel(186),
        backgroundColor: 'white'
    },
    rowTitleText: {
        fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
        color: fontAndColor.COLORA0,
    },
    rowTitleState: {
        alignItems: 'flex-end',
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        color: fontAndColor.COLORB2,
        marginRight: Pixel.getPixel(15)
    },
    inputStyle: {
        flex: 1,
        //backgroundColor: 'transparent',
        marginLeft: Pixel.getPixel(5),
        textAlign: 'left',
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        color: fontAndColor.COLORA2,
        padding: 0
    }
});
