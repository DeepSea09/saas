/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */


import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View, TouchableOpacity, Dimensions, ScrollView, Image, RefreshControl
} from 'react-native';
import TagSelectView from '../component/TagSelectView';
import BaseComponent from '../../../component/BaseComponent';
import NavigatorView from '../../../component/AllNavigationView';
import InvoiceInfo from './InvoiceInfo';
import AccountModal from './AccountModal';
import AddressManage from './AddressManage';
import CheckWaybill from './CheckWaybill';
import WarehouseListScene from './WarehouseListScene';
import SelectProvinceCityModal from './SelectProvinceCityModal';

const agree_icon = require('../../../../images/agree_icon.png');
const disagree = require('../../../../images/disagree.png');
const collect_icon = require('../../../../images/collect_icon.png');
const depart_icon = require('../../../../images/depart_icon.png');
const imaginary_icon = require('../../../../images/imaginary_icon.png');
const {width} = Dimensions.get('window');
import * as FontAndColor from '../../../constant/fontAndColor';
import PixelUtil from '../../../utils/PixelUtil';
import MyButton from "../../../component/MyButton";

const cellJianTou = require('../../../../images/mainImage/celljiantou@2x.png');
const white_jiantou = require('../../../../images/white_jiantou.png');
import {request} from '../../../utils/RequestUtil';
import * as Urls from '../../../constant/appUrls';
import LogisticsCheckStand from "../../../finance/LogisticsCheckStand";
const Pixel = new PixelUtil();
let tagViews = [];
let feeDatas = [{title: '物流费', value: '元'}, {title: '提验车费', value: '元'}]
let accoutInfo = [{title: '联系人', value: ''}, {title: '联系方式', value: ''}, {title: '收车地址', value: ''}]
const dismissKeyboard = require('dismissKeyboard');
export default class FillWaybill extends BaseComponent {
    constructor(props) {
        super(props);
        this.collectAddress = '';
        this.startAdress = '';
        this.transType = 1;
        this.distance = '';
        this.companyName = '';
        this.invoiceId = '';
        this.endId = '';
        this.startId = '';
        this.warehouse_id = '';//仓库id
        this.addressDatas = [];
        this.vType = this.props.vType;//1:二手车 2:新车
        this.toStore = this.props.logisticsType;//0自提,1全款到店,2融资到店,3融资到库,4库到店
        this.fromSingle = false;//来自地址管理
        this.totalMoney = 0;
        this.store_amount=0;
        if (this.toStore == '2') {
            this.title = '填写运单（到店）';
        } else if (this.toStore == '3') {//到库
            this.title = '填写运单（到库）';
        } else if (this.props.fromSingle) {
            this.fromSingle = this.props.fromSingle
        } else {
            this.title = '填写运单'
        }
        this.state = {
            isAgree: true,
            renderPlaceholderOnly: 'blank',
            collectAddress: '',
            feeDatas: feeDatas,
            tagViews: tagViews,
            invoiceTitle: '',
            distance: this.distance,
            accoutInfo: accoutInfo,
            isShow: false,//底部选择框
            addressDatas: this.addressDatas,
            isRefreshing: false,
            cityStatus:false
        }
    }

    initFinish() {
        this.getData();
    }

    freshTotalData=(data)=>{
        let end_address = data.end_address;
        this.startAdress = data.start_address.city + data.start_address.district;
        this.startId = data.start_address.id;
        if(end_address==null){
            this.collectAddress = '请选择'
            return;
        }
        accoutInfo = [];
        feeDatas = [];
        tagViews = [];
        this.collectAddress = end_address.city + end_address.district;
        this.endId = end_address.id;
        this.distance = data.distance;
        if(!this.isEmpty(data.store_amount)){
            this.store_amount=parseFloat(data.store_amount).toFixed(2);
        }
        if (this.toStore == '3') {
            if (this.isEmpty(data.warehouse_id) && this.toStore == '3') {
                this.collectAddress = '请选择'
            } else {
                this.warehouse_id = data.warehouse_id;
                this.endId=this.warehouse_id;
            }
        }
        if(this.collectAddress=='请选择'){
            accoutInfo.push({title: '联系人', value: ''});
            accoutInfo.push({title: '联系方式', value: ''});
            accoutInfo.push({title: '收车地址', value: ''});
        }else{
            accoutInfo.push({title: '联系人', value: end_address.contact_name});
            accoutInfo.push({title: '联系方式', value: end_address.contact_phone});
            accoutInfo.push({title: '收车地址', value: end_address.full_address});
        }

        if (!this.isEmpty(data.all_amount) && data.all_amount.length > 0 &&this.collectAddress !== '请选择'&&this.distance!=='0') {
            data.all_amount.map((data) => {
                if (this.fromSingle && data.amount_name == '总金额') {
                    this.totalMoney = data.amount;
                }
                if (parseFloat(data.amount) > 0) {
                    if(data.amount_name!=='总金额'){
                        feeDatas.push({title: data.amount_name, value: parseFloat(data.amount).toFixed(2) + '元'});
                    }
                }
            })
            if(this.fromSingle){
                feeDatas.push({title: '仓储费', value:  parseFloat(this.store_amount).toFixed(2) + '元'})
            }
        }
        if (!this.isEmpty(data.trans_type) && data.trans_type.length > 0 &&this.collectAddress !== '请选择'&&this.distance!=='0') {
            data.trans_type.map((data, index) => {
                if(index=='0'){
                    this.transType=data.transportTypeCode;
                }
                tagViews.push({
                    name: data.transportType,
                    check: index == 0 ? true : false,
                    transportTypeCode: data.transportTypeCode
                })

            });
        }
        if (data.trans_invoice !== null) {

        }
    }

    getData = () => {
        let maps = {
            company_id: global.companyBaseID,
            logistics_type: this.props.logisticsType,//物流类型
            order_id: this.props.orderId
        };
        request(Urls.WAYBILL, 'Post', maps)
            .then((response) => {
                    if (response.mjson.data != null) {
                        let data = response.mjson.data;
                        this.freshTotalData(data);

                    }
                    this.setState({
                        renderPlaceholderOnly: 'success',
                        collectAddress: this.collectAddress,
                        feeDatas: feeDatas,
                        tagViews: tagViews,
                        accoutInfo: accoutInfo,
                        distance: this.distance,
                        isRefreshing: false

                    });
                },
                (error) => {
                    this.setState({renderPlaceholderOnly: 'error',});
                });
    }

    refreshingData = () => {
        this.setState({isRefreshing: true});
        this.getTransType();
    };
    //获取运单费
    getTransFee = () => {
        this.props.showModal(true);
        let maps = {
            company_id: global.companyBaseID,
            end_id: this.endId,
            order_id: this.props.orderId,
            start_id: this.startId,
            logistics_type: this.props.logisticsType,//物流类型
            trans_type: this.transType,
            warehouse_id: this.props.logisticsType==3?this.endId:this.warehouse_id

        };
        request(Urls.CHECKTRANSTYPE, 'Post', maps)
            .then((response) => {
                    this.props.showModal(false);
                    if (response.mjson.data != null) {
                        let data = response.mjson.data;
                        feeDatas = [];
                        if (!this.isEmpty(data.all_amount) && data.all_amount.length > 0) {
                            data.all_amount.map((data) => {
                                if (this.fromSingle && data.amount_name == '总金额') {
                                    this.totalMoney = data.amount;
                                }
                                if (parseFloat(data.amount) > 0) {
                                    if(data.amount_name!=='总金额'){
                                        feeDatas.push({title: data.amount_name, value: parseFloat(data.amount).toFixed(2) + '元'});
                                    }
                                }
                            })
                        }
                        this.setState({
                                feeDatas: feeDatas,
                                distance: this.distance
                            }, () => {
                                this.tagRef.refreshData(tagViews);
                            }
                        );


                    }
                    this.setState({renderPlaceholderOnly: 'success'});
                },
                (error) => {
                    // this.setState({renderPlaceholderOnly: 'error',});
                    this.props.showModal(false);
                    if (error.mjson.msg == '') {
                        this.props.showToast('网络请求错误');
                    } else {
                        this.props.showToast(error.mjson.msg);
                    }
                });
    }
    //提交运单费
    submitTransFee = () => {

        let maps = {
            company_id: global.companyBaseID,
            end_id: this.endId,
            order_id: this.props.orderId,
            logistics_type: this.props.logisticsType,//物流类型
            trans_type: this.transType,
            invoice_id: this.invoiceId,
            warehouse_id: this.props.logisticsType==3?this.endId:this.warehouse_id
        };
        if(!this.fromSingle){
            maps['start_id']= this.startId;
        }
        this.props.showModal(true);
        request(Urls.SUBMITTRANFERINFO, 'Post', maps)
            .then((response) => {
                    this.props.showModal(false);
                    if (response.mjson.data != null) {
                        let data = response.mjson.data;
                        if(this.fromSingle){
                            this.toNextPage({
                                    name: 'LogisticsCheckStand',
                                    component: LogisticsCheckStand,
                                    params: {
                                        garageAmount: this.store_amount,//仓储费
                                        transAmount: this.totalMoney,//物流费
                                        orderId:this.props.orderId,
                                        callBack:this.props.callBack

                                    }
                                }
                            );
                        }else{
                            this.props.callBack(data);
                            const navigator = this.props.navigator;
                            if (navigator) {
                                for (let i = 0; i < navigator.getCurrentRoutes().length; i++) {
                                    if (navigator.getCurrentRoutes()[i].name == 'ProcurementOrderDetailScene') {
                                        navigator.popToRoute(navigator.getCurrentRoutes()[i]);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    this.setState({renderPlaceholderOnly: 'success'});
                },
                (error) => {
                    this.props.showModal(false);
                    // this.setState({renderPlaceholderOnly: 'error',});
                    if (error.mjson.msg == '') {
                        this.props.showToast('网络请求错误');
                    } else {
                        this.props.showToast(error.mjson.msg);
                    }
                });
    }


    //获取运输类型
    getTransType = () => {
        let maps = {
            company_id: global.companyBaseID,
            order_id: this.props.orderId,
            end_id: this.endId,
            logistics_type: this.props.logisticsType,//物流类型
        };
        request(Urls.GETTRANSTYPE, 'Post', maps)
            .then((response) => {
                    this.props.showModal(false);
                    if (response.mjson.data != null) {
                        accoutInfo = [];
                        feeDatas = [];
                        tagViews = [];
                        let data = response.mjson.data;
                        let end_address = data.end_address;
                        this.startAdress = data.start_address.city + data.start_address.district;
                        this.startId = data.start_address.id;
                        if(end_address==null){
                            this.collectAddress = '请选择'
                            return;
                        }
                        accoutInfo = [];
                        feeDatas = [];
                        tagViews = [];
                        this.collectAddress = this.props.logisticsType=='3'?end_address.cityName+end_address.countyName:
                            end_address.city + end_address.district;
                        this.endId = this.props.logisticsType=='3'?end_address.repoId:end_address.id;
                        this.distance = data.distance;
                        if(!this.isEmpty(data.store_amount)){
                            this.store_amount=parseFloat(data.store_amount).toFixed(2);
                        }
                        if (this.toStore == '3') {
                            if (this.isEmpty(data.warehouse_id) && this.toStore == '3') {
                                this.collectAddress = '请选择'
                            } else {
                                this.warehouse_id = data.warehouse_id;
                            }
                        }
                        if(this.collectAddress=='请选择'){
                            accoutInfo.push({title: '联系人', value: ''});
                            accoutInfo.push({title: '联系方式', value: ''});
                            accoutInfo.push({title: '收车地址', value: ''});
                        }else{
                            accoutInfo.push({title: '联系人', value: end_address.contact_name});
                            accoutInfo.push({title: '联系方式', value: end_address.contact_phone});
                            accoutInfo.push({title: '收车地址', value: this.props.logisticsType=='3'?end_address.address:end_address.full_address});
                        }

                        if (!this.isEmpty(data.all_amount) && data.all_amount.length > 0 &&this.collectAddress !== '请选择'&&this.distance!=='0') {
                            data.all_amount.map((data) => {
                                if (this.fromSingle && data.amount_name == '总金额') {
                                    this.totalMoney = data.amount;
                                }
                                if (parseFloat(data.amount) > 0) {
                                    if(data.amount_name!=='总金额'){
                                        feeDatas.push({title: data.amount_name, value: parseFloat(data.amount).toFixed(2) + '元'});
                                    }
                                }
                            })
                            if(this.fromSingle){
                                feeDatas.push({title: '仓储费', value:  parseFloat(this.store_amount).toFixed(2) + '元'})
                            }
                        }
                        if (!this.isEmpty(data.trans_type) && data.trans_type.length > 0 &&this.collectAddress !== '请选择'&&this.distance!=='0') {
                            data.trans_type.map((data, index) => {
                                if(index=='0'){
                                    this.transType=data.transportTypeCode;
                                }
                                tagViews.push({
                                    name: data.transportType,
                                    check: index == 0 ? true : false,
                                    transportTypeCode: data.transportTypeCode
                                })

                            });
                        }
                    }
                    this.tagRef.refreshData(tagViews);
                    this.setState({
                        renderPlaceholderOnly: 'success',
                        collectAddress: this.collectAddress,
                        feeDatas: feeDatas,
                        accoutInfo: accoutInfo,
                        distance: this.distance,
                        isRefreshing: false,

                    });
                },
                (error) => {
                    this.props.showModal(false);
                    this.setState({
                        isRefreshing: false,
                    })
                    if (error.mjson.msg == '') {
                        this.props.showToast('网络请求错误');
                    } else {
                        this.props.showToast(error.mjson.msg);
                    }
                });
    }

    /**
     *   地址回传
     **/
    updateAddress = (newAddress) => {
        console.log('newAddress', newAddress);
        this.endId = newAddress.id;
        this.props.showModal(true);
        this.getTransType();

    };


    allRefresh = () => {
        this.setState({
            renderPlaceholderOnly: 'loading',
        });
        this.getData();
    }

    checkAreaClick = (cityRegion)=>{
        console.log('-------',cityRegion);
        this.endId=cityRegion.repoId;
        this.props.showModal(true);
        this.getTransType();
    };
    closeModal = () => {
        this.setState({
            isShow: false
        });
    }

    onTagClick = (dt, index) => {
        //单选
        tagViews.map((data) => {
            data.check = false;
        });
        tagViews[index].check = !tagViews[index].check;
        this.transType = tagViews[index].transportTypeCode;
        this.getTransFee();
    }

    _renderItem = () => {
        return (
            <ScrollView style={{flex: 1, marginBottom: Pixel.getPixel(60)}} refreshControl={
                <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={this.refreshingData}
                    tintColor={[FontAndColor.COLORB0]}
                    colors={[FontAndColor.COLORB0]}
                />
            }>
                <View style={{flex: 1}}>

                    <View style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        height: Pixel.getPixel(120),
                        backgroundColor: FontAndColor.COLORB0,
                        paddingTop: Pixel.getPixel(30),
                        marginBottom: Pixel.getPixel(10)
                    }}>
                        <View style={{marginLeft: Pixel.getPixel(15)}}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: Pixel.getPixel(7)
                            }}>
                                <Image source={collect_icon} style={{marginRight: Pixel.getPixel(3),}}></Image>
                                <Text style={{color: 'white', fontSize: Pixel.getPixel(15)}}>发车地</Text>
                            </View>
                            <Text style={{color: 'white', fontSize: Pixel.getPixel(15)}}> {this.startAdress}</Text>
                        </View>
                        <View style={{alignItems: 'center', marginBottom: Pixel.getPixel(5)}}>
                            <Text style={{
                                color: 'white',
                                fontSize: Pixel.getPixel(15)
                            }}>{this.state.distance + "公里"}</Text>
                            <Image source={imaginary_icon} style={{
                                width: Pixel.getPixel(120),
                                marginTop: Pixel.getPixel(5)
                            }}></Image>
                        </View>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => {
                            if (this.props.logisticsType == '3') {
                                this._toProvince();
                            } else {
                                this.toNextPage({
                                        name: 'AddressManage',
                                        component: AddressManage,
                                        params: {
                                            addressId: this.endId,
                                            callBack: this.updateAddress
                                        }
                                    }
                                );
                            }
                        }}>
                            <View style={{marginRight: Pixel.getPixel(15)}}>
                                <View style={{
                                    flexDirection: 'row',
                                    marginBottom: Pixel.getPixel(7),
                                    justifyContent: 'flex-end',
                                    alignItems: 'center'
                                }}>
                                    <Image source={depart_icon} style={{marginRight: Pixel.getPixel(3)}}></Image>

                                    <Text style={{color: 'white', fontSize: Pixel.getPixel(15)}}>收车地</Text>
                                    <Image source={white_jiantou} style={{marginLeft: Pixel.getPixel(5)}}></Image>
                                </View>
                                <Text style={{
                                    color: 'white',
                                    fontSize: Pixel.getPixel(15)
                                }}> {this.state.collectAddress}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{backgroundColor: 'white', marginBottom: Pixel.getPixel(10)}}>
                        <View style={styles.content_tag_wrap}>
                            <Text style={{color: 'black'}}> 运输类型</Text>

                            <View style={{
                                height: Pixel.getPixel(49),
                                justifyContent: 'center',
                                marginRight: Pixel.getPixel(5),
                            }}>
                                <TagSelectView ref={(ref) => {
                                    this.tagRef = ref;
                                }} onTagClick={this.onTagClick} cellData={this.state.tagViews}
                                               buttonWidth={Pixel.getPixel(80)}/>
                            </View>
                        </View>

                        {
                            this.state.feeDatas.map((data, index) => {
                                return (
                                    <View key={index + 'fee'} style={styles.content_title_text_wrap}>
                                        <Text style={styles.content_title_text}>{data.title}</Text>
                                        <Text style={styles.content_base_Right}>{data.value}</Text>
                                    </View>
                                )
                            })
                        }

                    </View>

                    <View style={{
                        backgroundColor: 'white',
                        marginBottom: Pixel.getPixel(10),
                        paddingVertical: Pixel.getPixel(10)
                    }}>
                        {
                            this.state.accoutInfo.map((data, index) => {
                                return (
                                    <View key={index + 'accoutInfo'} style={styles.content_title_text_wrap}>
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

                    {this.fromSingle && <TouchableOpacity activeOpacity={0.8} onPress={() => {
                        this.toNextPage({
                            name: 'CheckWaybill',
                            component: CheckWaybill,
                            params: {
                                orderId: this.props.orderId,
                                transId: this.props.transId,
                                waybillState: this.props.waybillState,
                            }
                        });
                    }}>
                        <View style={[styles.content_base_wrap, {marginBottom: Pixel.getPixel(10)}]}>
                            <View style={styles.content_base_text_wrap}>
                                <Text style={[styles.content_base_left, {color: 'black'}]}>运单信息（到库）</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text
                                        style={[styles.content_base_Right, {color: FontAndColor.COLORA1}]}>{'查看'}</Text>
                                    <Image source={cellJianTou} style={styles.image}></Image>
                                </View>

                            </View>
                        </View>
                    </TouchableOpacity>}


                    {this.vType == 2 && <TouchableOpacity activeOpacity={0.8} onPress={() => {

                        this.toNextPage({
                                name: 'InvoiceInfo',
                                component: InvoiceInfo,
                                params: {
                                    orderId: this.props.orderId,
                                    endId: this.endId,
                                    accoutInfo: this.state.accoutInfo,
                                    callBack: (data) => {
                                        this.invoiceId = data.id;
                                        this.setState({
                                            invoiceTitle: data.invoice_title,
                                        });
                                    }
                                }
                            }
                        );
                    }}>
                        <View style={styles.content_base_wrap}>
                            <View style={styles.content_base_text_wrap}>
                                <Text style={[styles.content_base_left, {color: 'black'}]}>发票</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text
                                        style={[styles.content_base_Right, {color: FontAndColor.COLORA1}]}>{this.state.invoiceTitle}</Text>
                                    <Image source={cellJianTou} style={styles.image}></Image>
                                </View>

                            </View>
                        </View>
                    </TouchableOpacity>}

                    {/*<View style={{alignItems: 'center', flexDirection: 'row',marginTop: Pixel.getPixel(10),}}>*/}
                    {/*<TouchableOpacity activeOpacity={0.8} onPress={() => {*/}
                    {/*this.setState({*/}
                    {/*isAgree: !this.state.isAgree*/}
                    {/*});*/}
                    {/*}}>*/}
                    {/*<View style={{*/}
                    {/*flexDirection: 'row',*/}
                    {/*alignItems: 'center',*/}
                    {/*marginLeft: Pixel.getPixel(15)*/}
                    {/*}}>*/}
                    {/*<Image source={this.state.isAgree ? agree_icon : disagree}*/}
                    {/*style={{marginRight: Pixel.getPixel(3)}}></Image>*/}
                    {/*<Text style={{color: FontAndColor.COLORA1, fontSize: Pixel.getPixel(14)}}>我已同意签署物流协议</Text>*/}
                    {/*</View>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<TouchableOpacity activeOpacity={0.8} onPress={() => {*/}
                    {/*alert('1111')*/}
                    {/*}}>*/}
                    {/*<Text style={{color: FontAndColor.COLORA1, fontSize: Pixel.getPixel(14),}}>《物流协议》</Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*</View>*/}
                </View>
            </ScrollView>
        );

    }

    confirmBt = () => {
        if(this.state.collectAddress=='请选择'){
            this.props.showToast('请选择收车地');
            return;
        }
        this.submitTransFee();
    }

    backPg = () => {
        this.refs.accountModal.changeShowType(true,
            '您确认选择放弃？', '确认', '取消', () => {
                this.backPage();
            });
    }

    _showModal = (show)=>{
        this.props.showModal(show);
    };
    _toProvince = ()=>{
        dismissKeyboard();
        this.setState({cityStatus:true});
    };

    _closeProvince = ()=>{
        this.setState({cityStatus:false});
    };

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return ( <View style={styles.container}>
                {this.loadView()}
                <NavigatorView title={this.title} backIconClick={this.backPage}/>
            </View>);
        } else {
            return (
                <View style={styles.container}>
                    <View style={{flex: 1, marginTop: Pixel.getTitlePixel(64),}}>
                        {
                            this._renderItem()
                        }
                    </View>
                    {this.fromSingle && <View
                        style={styles.footerStyle}>
                        <Text
                            style={{
                                color: '#666666',
                                fontSize: 13,
                                marginHorizontal: Pixel.getPixel(10)
                            }}>共计:</Text>
                        <Text
                            style={{color: FontAndColor.COLORB2, fontSize: 18, flex: 1}}>{(parseFloat(this.store_amount) + parseFloat(this.totalMoney)).toFixed(2)}元</Text>
                        <TouchableOpacity activeOpacity={0.8} style={{
                            width: Pixel.getPixel(80),
                            height: Pixel.getPixel(38),
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: FontAndColor.COLORB0,
                            borderRadius: 4,
                            marginRight: Pixel.getPixel(10)
                        }} onPress={() => {
                            if(this.state.collectAddress=='请选择'){
                                this.props.showToast('请选择收车地');
                                return;
                            }
                            this.submitTransFee()
                        }}
                        >
                            <Text style={{color: 'white', fontSize: 18}}>支付</Text>
                        </TouchableOpacity>
                    </View>}
                    {!this.fromSingle && <MyButton buttonType={MyButton.TEXTBUTTON}
                                                   content={'确定'}
                                                   parentStyle={styles.loginBtnStyle}
                                                   childStyle={styles.loginButtonTextStyle}
                                                   mOnPress={() => {
                                                       this.confirmBt();
                                                   }}/>}
                    <AccountModal ref="accountModal"/>
                    {/*{this.state.isShow &&*/}
                    {/*< SelectProvinceCityModal ref='selectProvinceCityModal' datas={this.state.addressDatas}*/}
                                              {/*confirm={this.confirm} closeModal={this.closeModal}/>}*/}
                    <NavigatorView title={this.title} backIconClick={this.backPg}/>
                    {
                        this.state.cityStatus && <WarehouseListScene orderId={this.props.orderId} checkAreaClick={this.checkAreaClick} showModal={this._showModal} closePress={this._closeProvince}/>
                    }
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
        marginHorizontal: Pixel.getPixel(15),
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
        height: Pixel.getPixel(32),
        alignItems: 'center',
        flexDirection: 'row'
    },
    content_title_text: {
        flex: 1,
        marginLeft: Pixel.getPixel(15),
        fontSize: Pixel.getFontPixel(14),
        color: FontAndColor.COLORA1,
    },
    content_base_wrap: {
        height: Pixel.getPixel(46),
        minHeight: Pixel.getPixel(46),
        backgroundColor: 'white'
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
        marginRight: Pixel.getPixel(15),
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
    loginBtnStyle: {
        height: Pixel.getPixel(44),
        width: width - Pixel.getPixel(30),
        backgroundColor: FontAndColor.COLORB0,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Pixel.getPixel(4),
        marginLeft: Pixel.getPixel(15),
        position: 'absolute',
        bottom: Pixel.getPixel(5),
    },
    loginButtonTextStyle: {
        color: FontAndColor.COLORA3,
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT)
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
