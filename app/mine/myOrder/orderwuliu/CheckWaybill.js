import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View, TouchableOpacity, Dimensions, ScrollView, Image, Platform, NativeModules, Linking, RefreshControl
} from 'react-native';
import BaseComponent from '../../../component/BaseComponent';
import NavigatorView from '../../../component/AllNavigationView';

const {width} = Dimensions.get('window');
import * as FontAndColor from '../../../constant/fontAndColor';
import PixelUtil from '../../../utils/PixelUtil';

const cellJianTou = require('../../../../images/mainImage/celljiantou@2x.png');
const service_icon = require('../../../../images/service_icon.png');
import TransitInformation from './TransitInformation';
import SelectPickUp from './SelectPickUp';
import {request} from '../../../utils/RequestUtil';
import * as Urls from '../../../constant/appUrls';
import StorageCheckStand from "../../../finance/StorageCheckStand";

const Pixel = new PixelUtil();
let feeDatas = [{title: '发车地', value: ''}, {title: '收车地', value: ''}, {
    title: '下单时间',
    value: ''
}, {title: '物流费', value: ''}, {title: '运输类型', value: ''}]
let accoutInfo = [{title: '联系人', value: ''}, {title: '联系方式', value: ''}, {
    title: '收车地址',
    value: ''
}]

export default class CheckWaybill extends BaseComponent {
    constructor(props) {
        super(props);
        this.number = '(010)59230023';
        this.isShowPay = false;
        this.trans_code = '';
        this.title = '查看运单';
        this.warehouse_amount = 0;
        this.modelName='';
        this.logistics_data=[];
        if (this.props.isShowPay) {//运单信息
            this.isShowPay = true
            accoutInfo = [{title: '仓库名称', value: '刘威'}, {title: '仓库地址', value: ''}]
            this.title = '运单信息';
        }
        if (this.props.fromDetail) {
            this.title = '运单信息（到店）';
        }
        this.state = {
            renderPlaceholderOnly: false,
            payStatus: true,
            feeDatas: feeDatas,
            accoutInfo: accoutInfo,
            isRefreshing: false

        }
    }

    initFinish() {
        this.getData();
    }

    getData = () => {
        let maps = {
            company_id: global.companyBaseID,
            trans_id: this.props.transId,//物流类型
            order_id: this.props.orderId
        };
        request(Urls.WAYBILL_DETAIL, 'Post', maps)
            .then((response) => {
                    if (response.mjson.data != null) {
                        let data = response.mjson.data;
                        feeDatas = [];
                        accoutInfo = [];
                        carInfo = []
                        let trans_type = '大板';
                        if (data.trans_type == 1) {
                            trans_type = '大板';
                        } else if (data.trans_type == '2') {
                            trans_type = '救援'
                        } else if (data.trans_type == '3') {
                            trans_type = '代驾'
                        }
                        let end_address = data.end_address_data;
                        let start_address = data.start_address_data;
                        if (end_address !== null) {
                            this.modelName=data.orders_item_data.model_name;
                            if (!this.isEmpty(data.logistics_data)) {
                                this.logistics_data=data.logistics_data;
                            }
                            this.trans_code = data.trans_code;
                            if (!this.isEmpty(data.warehouse_amount)) {
                                this.warehouse_amount = parseFloat(data.warehouse_amount).toFixed(2);
                            }
                            feeDatas.push({
                                title: '发车地',
                                value: start_address.province + start_address.city + start_address.district
                            });
                            feeDatas.push({
                                title: '收车地',
                                value: end_address.province + end_address.city + end_address.district
                            });
                            feeDatas.push({title: '下单时间', value: data.created_trans_time});
                            feeDatas.push({title: '物流费', value: data.logistics_amount + '元'});
                            feeDatas.push({title: '运输类型', value: trans_type});


                            if (this.isShowPay) {
                                accoutInfo.push({title: '仓库名称', value: data.end_warehouse_address});
                                accoutInfo.push({title: '仓库地址', value: data.end_address});
                            } else {
                                accoutInfo.push({title: '联系人', value: end_address.contact_name});
                                accoutInfo.push({title: '联系方式', value: end_address.contact_phone});
                                accoutInfo.push({title: '收车地址', value: end_address.full_address});
                            }

                        }

                    }
                    this.setState({
                        renderPlaceholderOnly: 'success',
                        feeDatas: feeDatas,
                        accoutInfo: accoutInfo,
                        isRefreshing: false
                    });
                },
                (error) => {
                    this.setState({renderPlaceholderOnly: 'error',});
                });
    }


    rowView = () => {
        return (
            <View style={styles.content_title_text_wrap}>
                <Text style={styles.content_title_text}>车辆信息</Text>
                <Text style={styles.content_base_Right}>{'在途'}</Text>
            </View>
        )
    }

    _renderItem = () => {
        return (
            <View style={[{
                flex: 1,
                paddingBottom: Pixel.getPixel(10)
            }, this.isShowPay ? {paddingBottom: Pixel.getPixel(50)} : {}]}>

                <View style={{
                    backgroundColor: 'white',
                    marginBottom: Pixel.getPixel(10)
                }}>
                    <View style={[styles.content_title_text_wrap, {
                        borderBottomWidth: 1, borderColor: FontAndColor.COLORA4,
                        height: Pixel.getPixel(40)
                    }]}>
                        <Text style={[styles.content_title_text, {color: 'black'}]}>{'运单编号' + this.trans_code}</Text>
                        <Text
                            style={[styles.content_base_Right, this.state.payStatus ? {color: FontAndColor.COLORB2} : {}]}>{this.props.waybillState}</Text>
                    </View>
                    {
                        feeDatas.map((data, index) => {
                            return (
                                <View key={index + 'fee'} style={styles.content_title_text_wrap}>
                                    <Text style={styles.content_title_text}>{data.title}</Text>
                                    <View style={{
                                        flexWrap: 'wrap',
                                        height: Pixel.getPixel(51),
                                        width: width * 3 / 4,
                                        justifyContent: 'center'
                                    }}>
                                        <Text style={[styles.content_base_Right]}>{data.value}</Text>
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>


                <View style={{
                    backgroundColor: 'white',
                    marginBottom: Pixel.getPixel(10),
                }}>
                    {
                        accoutInfo.map((data, index) => {
                            return (
                                <View key={index + 'fee'} style={styles.content_title_text_wrap}>
                                    <Text style={styles.content_title_text}>{data.title}</Text>
                                    <View style={{
                                        flexWrap: 'wrap',
                                        height: Pixel.getPixel(51),
                                        width: width * 3 / 4,
                                        justifyContent: 'center'
                                    }}>
                                        <Text style={[styles.content_base_Right]}>{data.value}</Text>
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
                <TouchableOpacity activeOpacity={0.8} onPress={() => {
                    this.callUp();
                }}>
                    <View style={styles.content_base_wrap}>
                        <View style={styles.content_base_text_wrap}>
                            <Text style={[styles.content_base_left, {color: 'black'}]}>{'物流电话'}</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image source={service_icon} style={{marginRight: Pixel.getPixel(10)}}></Image>
                                <Text style={[styles.content_base_Right, {
                                    marginRight: Pixel.getPixel(15),
                                    color: FontAndColor.COLORA1
                                }]}>{this.number}</Text>

                            </View>

                        </View>
                    </View>
                </TouchableOpacity>

                {this.props.fromDetail && <TouchableOpacity activeOpacity={0.8} onPress={() => {
                    // this.toNextPage({
                    //         name: 'WaybillToStore',
                    //         component: WaybillToStore,
                    //         params: {}
                    //     }
                    // );
                }}>
                    <View style={[styles.content_base_wrap, {marginBottom: Pixel.getPixel(10)}]}>
                        <View style={styles.content_base_text_wrap}>
                            <Text style={[styles.content_base_left, {color: 'black'}]}>运单信息（到库）</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={[styles.content_base_Right, {color: FontAndColor.COLORA1}]}>{'查看'}</Text>
                                <Image source={cellJianTou} style={styles.image}></Image>
                            </View>

                        </View>
                    </View>
                </TouchableOpacity>}


                <View style={{
                    backgroundColor: 'white',
                    marginTop: Pixel.getPixel(10)
                }}>
                    <View style={styles.content_title_text_wrap}>
                        <Text style={[styles.content_title_text, {color: 'black'}]}>车辆信息</Text>
                    </View>

                    <TouchableOpacity activeOpacity={0.8} onPress={() => {
                        this.toNextPage({
                                name: 'TransitInformation',
                                component: TransitInformation,
                                params: {
                                    logistics_data:this.logistics_data
                                }
                            }
                        );
                    }}>
                        <View style={styles.content_base_wrap}>
                            <View style={styles.content_base_text_wrap}>
                                <Text style={styles.content_base_left}>{this.modelName}</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={[styles.content_Right]}>{'查看'}</Text>
                                    <Image source={cellJianTou}
                                           style={[styles.image, {marginLeft: Pixel.getPixel(5)}]}></Image>
                                </View>

                            </View>
                        </View>
                    </TouchableOpacity>

                </View>
            </View>
        );

    }

    refreshingData = () => {
        this.setState({isRefreshing: true});
        this.getData();
    };

    callUp = () => {
        if (Platform.OS === 'android') {
            NativeModules.VinScan.callPhone(this.number);
        } else {
            Linking.openURL('tel:' + this.number);
        }
    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return ( <View style={styles.container}>
                {this.loadView()}
                <NavigatorView title={this.title} backIconClick={this.backPage}/>
            </View>);
        } else {
            return (<View style={styles.container}>

                <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false} refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={this.refreshingData}
                        tintColor={[FontAndColor.COLORB0]}
                        colors={[FontAndColor.COLORB0]}
                    />
                }>
                    <View style={{flex: 1, marginTop: Pixel.getTitlePixel(65),}}>
                        {
                            this._renderItem()
                        }
                    </View>
                </ScrollView>
                {this.isShowPay ? <View
                    style={styles.footerStyle}>
                    <Text
                        style={{
                            color: '#666666',
                            fontSize: 13,
                            marginHorizontal: Pixel.getPixel(10)
                        }}>仓库费:</Text>
                    <Text style={{
                        color: FontAndColor.COLORB2,
                        fontSize: 18,
                        flex: 1
                    }}>{this.warehouse_amount + '元'}</Text>
                    <TouchableOpacity activeOpacity={0.8} style={{
                        width: Pixel.getPixel(80),
                        height: Pixel.getPixel(38),
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: FontAndColor.COLORB0,
                        borderRadius: 4,
                        marginRight: Pixel.getPixel(10)
                    }} onPress={() => {
                        this.toNextPage({
                                name: 'StorageCheckStand',
                                component: StorageCheckStand,
                                params: {
                                    payAmount: this.warehouse_amount,
                                    orderId: this.props.orderId,
                                    callBack: this.props.callBack,
                                }
                            }
                        );
                    }}
                    >
                        <Text style={{color: 'white', fontSize: 18}}>支付</Text>
                    </TouchableOpacity>
                </View> : null}
                <NavigatorView title={this.title} backIconClick={this.backPage}/>
            </View>)
        }

    }


}

const styles = StyleSheet.create({
    container: {
        backgroundColor: FontAndColor.COLORA3,
        flex: 1,
    },
    content_tag_wrap: {
        height: Pixel.getPixel(49),
        marginLeft: Pixel.getPixel(15),
        borderBottomWidth: Pixel.getPixel(1),
        borderColor: FontAndColor.COLORA4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    content_title_wrap: {
        height: Pixel.getPixel(51),
        backgroundColor: FontAndColor.COLORA3,
    },
    content_title_text_wrap: {
        height: Pixel.getPixel(35),
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: Pixel.getPixel(15),
        // borderBottomWidth: Pixel.getPixel(1),
        // borderColor: FontAndColor.COLORA4,
        backgroundColor: 'white'
    },
    content_title_text: {
        flex: 1,
        fontSize: Pixel.getFontPixel(14),
        color: FontAndColor.COLORA1,
    },
    content_base_wrap: {
        height: Pixel.getPixel(46),
        minHeight: Pixel.getPixel(46),
        backgroundColor: 'white',
        borderBottomWidth: Pixel.getPixel(1),
        borderColor: FontAndColor.COLORA4
    },
    content_base_text_wrap: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row'
    },
    content_base_left: {
        flex: 1,
        marginLeft: Pixel.getPixel(15),
        fontSize: Pixel.getFontPixel(14),
        color: FontAndColor.COLORA1
    },
    content_base_Right: {
        fontSize: Pixel.getFontPixel(14),
        color: 'black',
        textAlign: 'right'
    },
    image: {
        marginRight: Pixel.getPixel(15),
    },
    topText: {
        color: 'white',
        fontSize: Pixel.getPixel(14)
    },
    content_Right: {
        fontSize: Pixel.getFontPixel(14),
        color: FontAndColor.COLORA1,
        textAlign: 'right'
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
});
