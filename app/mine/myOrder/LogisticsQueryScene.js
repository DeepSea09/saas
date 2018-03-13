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
    Dimensions,
    Platform,
    KeyboardAvoidingView
} from  'react-native'

const {width, height} = Dimensions.get('window');
import BaseComponent from "../../component/BaseComponent";
import * as fontAndColor from '../../constant/fontAndColor';
import NavigatorView from '../../component/AllNavigationView';
import PixelUtil from '../../utils/PixelUtil'
import LQBannerItem from './component/LQBannerItem';
import LQAdressItem from './component/LQAdressItem';
import LQTransportItem from './component/LQTransportItem';
import LQCarItem from './component/LQCarItem';
var Pixel = new PixelUtil();
import CityRegionScene from '../addressManage/CityRegionScene';
import LQSelectCarTypeItem from './component/LQSelectCarTypeItem';
import LQSelectTransItem from './component/LQSelectTransItem';
import LQBottomItem from './component/LQBottomItem';
import CarBrandSelectScene from "../../carSource/CarBrandSelectScene";
const IS_ANDROID = Platform.OS === 'android';
import {request} from '../../utils/RequestUtil';
import * as Urls from '../../constant/appUrls';
import CarriagePriceContenScene from "./CarriagePriceContenScene";
import CarriagePriceInfoScene from "./CarriagePriceInfoScene";
export default class LogisticsQueryScene extends BaseComponent {

    // 构造
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.selectIndex = 0;
        this.firstItem = {
            province: '',
            province_code: '',
            city: '',
            city_code: '',
            district: '',
            district_code: ''
        }
        this.lastItem = {
            province: '',
            province_code: '',
            city: '',
            city_code: '',
            district: '',
            district_code: ''
        }
        this.car = {
            typeId: 0,
            typeName: '',
            modelId: 0,
            modelName: '',
            money: 'n',
            number: 1,
            transType: 0
        }
        this.transType = [];
        this.transError = false;
        this.transSelect = {
            transportTypeCode: 0,
            transportType: ''
        }
        this.state = {
            renderPlaceholderOnly: 'blank',
            dataSource: ds.cloneWithRows([1, 2, 3, 4, 5]),
            cityStatus: false,
            openType: false,
            canClick: false
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
        this.loadData();
    };

    loadData = () => {
        this.setState({renderPlaceholderOnly: 'success'});
    }

    _showModal = (show) => {
        this.props.showModal(show);
    };

    _closeProvince = () => {
        this.setState({cityStatus: false});
    };

    checkAreaClick = (cityRegion) => {
        if (this.selectIndex == 1) {
            this.firstItem.province = cityRegion.provice_name;
            this.firstItem.province_code = cityRegion.provice_code;
            this.firstItem.city = cityRegion.city_name;
            this.firstItem.city_code = cityRegion.city_code;
            this.firstItem.district = cityRegion.district_name;
            this.firstItem.district_code = cityRegion.district_code;
        } else {
            this.lastItem.province = cityRegion.provice_name;
            this.lastItem.province_code = cityRegion.provice_code;
            this.lastItem.city = cityRegion.city_name;
            this.lastItem.city_code = cityRegion.city_code;
            this.lastItem.district = cityRegion.district_name;
            this.lastItem.district_code = cityRegion.district_code;
        }
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
            dataSource: ds.cloneWithRows([1, 2, 3, 4, 5]),
        }, () => {
            this.getTrans()
        });
    };

    toNext = () => {
        if (this.isNull(this.firstItem.province + this.firstItem.city +
                this.firstItem.district)) {
            this.props.showToast('请选择始发地');
            return;
        }
        if (this.isNull(this.lastItem.province + this.lastItem.city +
                this.lastItem.district)) {
            this.props.showToast('请选择目的地');
            return;
        }
        if (this.isNull(this.car.typeName)) {
            this.props.showToast('请选择车辆新旧');
            return;
        }
        if (this.isNull(this.car.modelName)) {
            this.props.showToast('请选择车型');
            return;
        }
        if (this.isNull(this.car.money) || this.car.money <= 0) {
            this.props.showToast('请填写单车指导价');
            return;
        }
        if (this.isNull(this.transSelect.transportType)) {
            this.props.showToast('请选择运输类型');
            return;
        }
        let brandParams = {
            name: 'CarriagePriceInfoScene',
            component: CarriagePriceInfoScene,
            params: {
                carCount: this.car.number,
                carPrice: this.car.money,
                carType: this.car.typeId,
                endAddr: this.lastItem.province + this.lastItem.city,
                endAddrRegionId: this.lastItem.city_code,
                model_id: this.car.modelId,
                startAddr: this.firstItem.province + this.firstItem.city +
                this.firstItem.district,
                startAddrRegionId: this.firstItem.district_code,
                transportType: this.transSelect.transportTypeCode,
                model_name: this.car.modelName
            }
        };
        this.toNextPage(brandParams);
    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return ( <View style={{flex:1,backgroundColor: fontAndColor.COLORA3}}>
                {this.loadView()}
                <NavigatorView title='物流服务' backIconClick={this.backPage} wrapStyle={{backgroundColor:'transparent'}}/>
            </View>);
        } else {
            return (<View style={{flex:1,backgroundColor: fontAndColor.COLORA3}}>
                {IS_ANDROID ? (<ListView
                        removeClippedSubviews={false}
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow}
                        showsVerticalScrollIndicator={false}
                        onScroll={this.onScroll}
                    />) : (
                        <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={-Pixel.getPixel(100)}>
                            <ListView
                                removeClippedSubviews={false}
                                dataSource={this.state.dataSource}
                                renderRow={this._renderRow}
                                showsVerticalScrollIndicator={false}
                                onScroll={this.onScroll}

                            />
                        </KeyboardAvoidingView>
                    )}
                <TouchableOpacity onPress={()=>{
                    if(this.state.canClick){
                        this.toNext();
                    }
                }} activeOpacity={0.9}
                                  style={{width:width,height:Pixel.getPixel(45),backgroundColor:
                                  this.state.canClick?fontAndColor.COLORB0:'#69DCDA',
                position: 'absolute',left:0,bottom:0 ,justifyContent:'center',alignItems: 'center'}}>
                    <Text style={{fontSize: Pixel.getPixel(15),color:'#fff',
                    backgroundColor: '#00000000'}}>询价</Text>
                </TouchableOpacity>
                {
                    this.state.cityStatus && <CityRegionScene noneDistrict={this.state.openType}
                                                              checkAreaClick={this.checkAreaClick}
                                                              showModal={this._showModal}
                                                              closePress={this._closeProvince}/>
                }
                <LQSelectCarTypeItem selectType={(id,name)=>{
                    this.car.typeId=id;
                    this.car.typeName = name;
                    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                    this.setState({
                        dataSource: ds.cloneWithRows([1, 2, 3, 4, 5]),
                    },()=>{this.getTrans()});
                }} ref="lqselectcartypeitem"/>
                <LQSelectTransItem selectType={(code,name)=>{
                    this.transSelect={
                         transportTypeCode:code,
                         transportType:name
                    }
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
         if(this.isNull(this.car.money)||this.car.money<=0){
              this.setState({
                    dataSource: ds.cloneWithRows([1, 2, 3, 4, 5]),
                    canClick:false
              });
         }else{
            this.setState({
                dataSource: ds.cloneWithRows([1, 2, 3, 4, 5]),
                canClick:true
            });
         }

                }} ref="lqselecttransitem"/>
                <NavigatorView ref={(ref)=>this.navigationView=ref} title='物流服务' backIconClick={this.backPage} wrapStyle={{backgroundColor:'transparent'}}/>
            </View>);
        }
    }

    onScroll =(event)=> {

        if (event.nativeEvent.contentOffset.y > 0) {

            this.navigationView.setNavigationBackgroindColor(fontAndColor.COLORB0);

        } else {
            this.navigationView.setNavigationBackgroindColor('transparent');
        }
    }

    _renderRow = (rowData, selectionID, rowID) => {
        if (rowData == '1') {
            return <LQBannerItem clickBanner={()=>{
                 let brandParams = {
            name: 'CarriagePriceContenScene',
            component: CarriagePriceContenScene,
            params: {

            }
        };
        this.toNextPage(brandParams);
            }}/>
        } else if (rowData == '2') {
            return <LQAdressItem firstName={this.firstItem.province+this.firstItem.city+
            this.firstItem.district}
                                 lastName={this.lastItem.province+this.lastItem.city+
            this.lastItem.district} selectCity={(index)=>{
                this.selectIndex=index;
                if(index==1){
                    this.setState({
                    cityStatus:true,
                    openType:false
                });
                }else{
                    this.setState({
                    cityStatus:true,
                    openType:true
                });
                }

            }}/>
        } else if (rowData == '3') {
            return <LQCarItem inputMoney={(text)=>{
                    this.car.money = text;
                    console.log(this.car.money<=0);
                     console.log(this.state.canClick);
                    if(this.isNull(this.car.money)||this.car.money<=0){
                        this.setState({
                            canClick:false
                        });
                    }else if(!this.isNull(this.transSelect.transportTypeCode)&&!this.state.canClick){
                         this.setState({
                            canClick:true
                        });
                    }
                }} type={this.car.typeId} firstName={this.car.typeName} lastName={this.car.modelName}
                              money={this.car.money} selectType={()=>{
                this.refs.lqselectcartypeitem.changeShow();
            }} selectModel={()=>{
                let brandParams = {
                    name: 'CarBrandSelectScene',
                    component: CarBrandSelectScene,
                    params: {
                    checkedCarClick: this._checkedCarClick,
                    status: 0,
            }
        };
        this.toNextPage(brandParams);
            }}/>
        } else if (rowData == '4') {
            return <LQTransportItem transName={this.transSelect.transportType} selectTransport={()=>{
                if(this.transType.length<=0&&this.transError==false){
                    this.props.showToast('请确认车辆类型与地址');
                    return;
                }
                if(this.transError){
                    this.getTrans(1);
                    return;
                }
                this.refs.lqselecttransitem.changeShow(this.transType);
            }} changeNumber={(number)=>{
                this.car.number = number;
            }}/>
        } else if (rowData == '5') {
            return <LQBottomItem />
        }
    }

    _checkedCarClick = (content) => {
        this.car.modelName = content.model_name;
        this.car.modelId = content.model_id;
        this.car.money = content.model_price;
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
            dataSource: ds.cloneWithRows([1, 2, 3, 4, 5]),
        }, () => {
            this.getTrans()
        });
    }

    getTrans = (from) => {
        if (this.isNull(this.car.modelName)) {
            return;
        }
        if (this.isNull(this.car.typeName)) {
            return;
        }
        if (this.isNull(this.firstItem.province + this.firstItem.city +
                this.firstItem.district)) {
            return;
        }
        if (this.isNull(this.lastItem.province + this.lastItem.city +
                this.lastItem.district)) {
            return;
        }
        this._showModal(true);
        this.transSelect = {};
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
            dataSource: ds.cloneWithRows([1, 2, 3, 4, 5]),
        }, () => {
            let maps = {
                carType: this.car.typeId,
                company_id: global.companyBaseID,
                endAddr: this.lastItem.province + this.lastItem.city,
                endAddrRegionId: this.lastItem.city_code,
                model_id: this.car.modelId,
                startAddr: this.firstItem.province + this.firstItem.city +
                this.firstItem.district,
                startAddrRegionId: this.firstItem.district_code,
            };
            request(Urls.GETTRANSPORTTYPE, 'Post', maps)
                .then((response) => {
                        this.transType = [];
                        if (from == 1) {
                            if (this.isNull(response.mjson.data) || response.mjson.data.length <= 0) {
                                this.transError = true;
                                this.props.showToast('运输类型为空');
                                return;
                            }
                            this._showModal(false);
                            this.transError = false;
                            for (let i = 0; i < response.mjson.data.length; i++) {
                                this.transType.push({
                                    transportType: response.mjson.data[i].transportType,
                                    transportTypeCode: response.mjson.data[i].transportTypeCode
                                })
                            }
                            this.refs.lqselecttransitem.changeShow(this.transType);
                        } else {
                            this._showModal(false);
                            if (this.isNull(response.mjson.data) || response.mjson.data.length <= 0) {
                                this.transError = true;
                                return;
                            }
                            for (let i = 0; i < response.mjson.data.length; i++) {
                                this.transType.push({
                                    transportType: response.mjson.data[i].transportType,
                                    transportTypeCode: response.mjson.data[i].transportTypeCode
                                })
                            }
                            if (this.transType.length == 1) {
                                this.transSelect = {
                                    transportType: this.transType[0].transportType,
                                    transportTypeCode: this.transType[0].transportTypeCode
                                }
                                let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                                if (this.isNull(this.car.money) || this.car.money <= 0) {
                                    this.setState({
                                        dataSource: ds.cloneWithRows([1, 2, 3, 4, 5]),
                                        canClick: false
                                    });
                                } else {
                                    this.setState({
                                        dataSource: ds.cloneWithRows([1, 2, 3, 4, 5]),
                                        canClick: true
                                    });
                                }
                            }
                        }
                    },
                    (error) => {
                        this.transError = true;
                        if (from == 1) {
                            if (error.mycode == -300 || error.mycode == -500) {
                                this.props.showToast('系统异常');
                            } else {
                                this.props.showToast(error.mjson.msg);
                            }
                        } else {
                            this._showModal(false);
                        }
                    });
        });

    }

}