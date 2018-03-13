/**
 * Created by zhengnan on 2017/10/31.
 */

import React, {Component} from 'react';

import {
    StyleSheet,
    ListView,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    RefreshControl,
    Dimensions,
    Modal,
    NativeModules,
    BackAndroid,
    InteractionManager,

} from 'react-native';


import * as fontAndColor    from '../constant/fontAndColor';
import BaseComponent        from '../component/BaseComponent';
import {CarSourceSelectHeadView, CarSourceSelectView}         from './znComponent/CarSourceSelectHeadView';
import ListFooter           from './znComponent/LoadMoreFooter';
import CarCell              from './znComponent/CarCell';
import CarBrandSelectScene  from './CarBrandSelectScene';
import CarScreeningScene    from  './CarScreeningScene';
import {SequencingButton, SequencingView} from './znComponent/CarSequencingView';
import CarSeekScene from './CarSeekScene';
import * as AppUrls         from "../constant/appUrls";
import  {request}           from '../utils/RequestUtil';
import PixelUtil            from '../utils/PixelUtil';
import * as storageKeyNames from '../constant/storageKeyNames';
import StorageUtil from '../utils/StorageUtil';
import * as CarDeployData from './carData/CarDeployData';
import ProvinceListScene from "./ProvinceListScene";
import {CarSpecificationView} from './CarSpecificationScene';
import CarNewInfoScene from "./CarNewInfoScene";


let Pixel = new PixelUtil();
let carFilterData = require('./carData/carFilterData.json');
let carTypeSource = [];
let carNatureSource = [];
let carColorSource = [];
let carDischargeSource = [];
let carPriceSource = [];
let carSpecificationSource = [];
let sequencingDataSource = carFilterData.newCarSequencingDataSource;
let currentCheckedIndex = 0;
let checkedSource = [];
let carData = [];
let isNewCarCheckRecommend = true;
let currentCarCheckRecommend = true;


const APIParameter = {

    brand_id: 0,
    series_id: 0,
    model_id: 0,
    provice_id: 0,
    city_id: 0,
    order_type: 0,
    mileage: 0,
    dealer_price:0,
    emission_standards:0,
    nature_use:0,
    car_color:0,
    model_name:'',
    first_type:'',
    second_type:'',
    prov_id:0,
    v_type:2,
    rows: 10,
    page: 1,
    type: 1,
    status: 1,
    no_cache:1,

};


export  default  class CarNewListScene extends BaseComponent {

    handleBack = () => {
        NativeModules.VinScan.goBack();
        return true;
    }

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
        InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: 'loading'});
            this.initFinish();
        });
    }

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        const carSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});

        this.state = {

            isRefreshing: false,
            dataSource: carSource,
            isHide: true,
            isHideCarSpecification:true,
            isFillData: 1,
            sequencingType: {
                title: '',
                value: '',
            },
            checkedCarType: {
                title: '',
                brand_id: '',
                series_id: '',
            },
            checkedCarGenre:{
                title: '',
                value: '',
            },
            checkedCity:{
                title: '',
                province_id:'',
                city_id:''
            },
            checkedCarPrice:{
                title: '',
                value: '',
            },
            checkedCarDischarge:{
                title: '',
                value: '',
            },
            checkedCarColor:{
                title: '',
                value: '',
            },
            checkedCarNature:{
                title: '',
                value: '',
            },
            checkedCarSpecification:{
                title: '',
                mainValue: '',
                subValue:''
            },

            renderPlaceholderOnly: 'blank',
        };

    }

    componentWillReceiveProps(nextProps) {

        StorageUtil.mGetItem(storageKeyNames.NEED_NEW_CHECK_RECOMMEND,(data)=>{

            if(data.code == 1){
                if(data.result == 'true'){
                    if(this.refs.HeadView){
                        if (this.refs.HeadView.state.isCheckRecommend)
                        {
                            this.refs.HeadView.setCheckRecommend(false);
                        }
                    }else {
                        isNewCarCheckRecommend = false
                        APIParameter.type = 4;
                        APIParameter.prov_id = 0;
                        currentCarCheckRecommend = isNewCarCheckRecommend;
                    }
                }
            }
        });
        StorageUtil.mSetItem(storageKeyNames.NEED_NEW_CHECK_RECOMMEND,'false');

    }

    initFinish = () => {

        StorageUtil.mGetItem(storageKeyNames.NEED_NEW_CHECK_RECOMMEND,(data)=>{

            if(data.code == 1){
                if(data.result == 'true'){
                    isNewCarCheckRecommend = false
                    APIParameter.type = 4;
                    APIParameter.prov_id = 0;
                    currentCarCheckRecommend = isNewCarCheckRecommend;

                }
            }
        });
        StorageUtil.mSetItem(storageKeyNames.NEED_NEW_CHECK_RECOMMEND,'false');

        StorageUtil.mGetItem(storageKeyNames.LOAN_SUBJECT, (data) => {
            if(data.code == 1 && data.result != '')
            {
                let enters = JSON.parse(data.result);
                this.prov_id = enters.prov_id;
                APIParameter.prov_id=enters.prov_id;
                this.loadData();

            }else{
                this.loadData();
            }
        });

    };

    // 下拉刷新数据
    refreshingData = () => {

        carData = [];
        this.setState({isRefreshing: true});
        this.loadData();

    };

    // 筛选数据刷新
    filterData = () => {
        if(!currentCarCheckRecommend){
            // if(APIParameter.order_type == 0&&
            //     APIParameter.mileage == 0 &&
            //     APIParameter.brand_id == 0 &&
            //     APIParameter.series_id == 0 &&
            //     APIParameter.provice_id == 0 &&
            //     APIParameter.city_id==0 &&
            //     APIParameter.dealer_price == 0 &&
            //     APIParameter.emission_standards == 0 &&
            //     APIParameter.first_type=='' &&
            //     APIParameter.second_type =='' &&
            //     APIParameter.car_color == 0 &&
            //     APIParameter.nature_use == 0 &&
            //     APIParameter.model_name =='')
            // {
            //     APIParameter.type = 4;
            // }else {
            //     APIParameter.type = 0;
            // }

            APIParameter.type = 0;

        }

        carData = [];
        this.setState({dataSource:this.state.dataSource.cloneWithRows(carData)});
        this.props.showModal(true);
        this.loadData();

    }
    allRefresh=()=>{
        this.setState({renderPlaceholderOnly: 'loading'});
        this.loadData();
    }

    // 获取数据
    loadData = () => {

        let url = AppUrls.CAR_INDEX;
        APIParameter.page = 1;
        request(url, 'post', APIParameter,()=>{
            this.props.backToLogin();
        })
            .then((response) => {
                this.props.showModal(false);

                carData = response.mjson.data.list;
                APIParameter.status = response.mjson.data.status;

                if (this.state.isFillData !== APIParameter.status) {
                    this.setState({
                        isFillData: APIParameter.status,
                        dataSource: this.state.dataSource.cloneWithRows(carData),
                        isRefreshing: false,
                        renderPlaceholderOnly: 'success',
                    });
                } else {
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(carData),
                        isRefreshing: false,
                        renderPlaceholderOnly: 'success',
                    });
                }

            }, (error) => {

                this.setState({
                    isRefreshing: false,
                    renderPlaceholderOnly: 'error'
                });

            });

    };

    loadMoreData = () => {

        let url = AppUrls.CAR_INDEX;
        APIParameter.page += 1;

        request(url, 'post', APIParameter,()=>{
            this.props.backToLogin();
        })
            .then((response) => {

                APIParameter.status = response.mjson.data.status;
                if (this.state.isFillData !== APIParameter.status) {
                    this.setState({
                        isFillData: APIParameter.status,
                    });
                }
                let data = new Array;
                data = response.mjson.data.list
                for (let i = 0; i < data.length; i++) {
                    carData.push(data[i]);
                }

                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(carData),
                });

            }, (error) => {


            });
    }

    toEnd = () => {

        if (carData.length && APIParameter.status == 1 && !this.state.isRefreshing) {
            this.loadMoreData();
        }

    };
    // 获取筛选数据
    loadCarConfigData=(succeedAction)=>{


        CarDeployData.getCarDeployData(this.props.showModal,this.props.showToast,(dataSource)=>{

            succeedAction(dataSource);

        });

        // this.props.showModal(true);
        // request(AppUrls.CAR_CONFIG,'post',{}).then((response) => {
        //     succeedAction(response.mjson.data);
        //     this.props.showModal(false);
        // }, (error) => {
        //     this.props.showModal(false);
        //     this.props.showToast(error.msg);
        // });

    }

    checkedCityClick=(cityType)=>{

        this.setState({
            checkedCity: {
                title: cityType.city_name,
                provice_id:cityType.provice_id,
                city_id:cityType.city_id,
            },
        });
        APIParameter.provice_id =cityType.provice_id;
        APIParameter.city_id = cityType.city_id;
        this.setHeadViewType();

    }

    cityUnlimitedAction=()=>{

        this.setState({
            checkedCity: {
                title:'全国',
                provice_id:0,
                city_id:0,
            },
        });
        APIParameter.provice_id =0;
        APIParameter.city_id = 0;
        this.setHeadViewType();

    }

    presCarTypeScene = () => {

        // let navigatorParams = {
        //     name: "CarBrandSelectScene",
        //     component: CarBrandSelectScene,
        //     params: {
        //         checkedCarType: this.state.checkedCarType,
        //         checkedCarClick: this.checkedCarClick,
        //         status: 1,
        //         isHeadInteraction: true,
        //         unlimitedAction:this.carTypeClick,
        //         // isCheckedCarModel:true,
        //
        //     }
        // };
        // this.props.callBack(navigatorParams);

        let navigatorParams = {
            name: "CarSeekScene",
            component: CarSeekScene,
            params: {
                checkedCarClick: this.checkedCarClick,
            }

        };
        this.props.callBack(navigatorParams);
    }

    ScreeningClick=()=>{

        if(!carTypeSource.length ||!carNatureSource.length|| !carColorSource.length || !carDischargeSource.length || !carPriceSource ||!carSpecificationSource){
            this.loadCarConfigData((carConfigData)=>{
                carTypeSource = carConfigData.auto_type;
                carNatureSource = carConfigData.auto_use;
                carColorSource = carConfigData.auto_body_color;
                carDischargeSource = carConfigData.auto_es;
                carPriceSource = carConfigData.auto_price;
                carSpecificationSource = carConfigData.auto_standard;

                this.pushCarScreeningScene()
            });
        }else {
            this.pushCarScreeningScene();
        }


    }
    pushCarScreeningScene=()=>{

        let {checkedCarType,checkedCarGenre,checkedCity,checkedCarPrice,checkedCarDischarge,checkedCarColor,checkedCarNature,checkedCarSpecification}= this.state;
        let screeningObject = {
            checkedCarType:{title:checkedCarType.title,brand_id:checkedCarType.brand_id,series_id:checkedCarType.series_id},
            checkedCarGenre:{title:checkedCarGenre.title,value:checkedCarGenre.value},
            checkedCity:{title:checkedCity.title,provice_id:checkedCity.province_id,city_id:checkedCity.city_id},
            checkedCarPrice:{title:checkedCarPrice.title,value:checkedCarPrice.value},
            checkedCarDischarge:{title:checkedCarDischarge.title,value:checkedCarDischarge.value},
            checkedCarColor:{title:checkedCarColor.title,value:checkedCarColor.value},
            checkedCarNature:{title:checkedCarNature.title,value:checkedCarNature.value},
            checkedCarSpecification:{title:checkedCarSpecification.title,mainValue:checkedCarSpecification.mainValue,subValue:checkedCarSpecification.subValue},
            carTypeSource:carTypeSource,
            carNatureSource:carNatureSource,
            carColorSource:carColorSource,
            carDischargeSource:carDischargeSource,
            carPriceSource:carPriceSource,
            carSpecificationSource:carSpecificationSource,
        };
        let navigatorParams = {
            name: "CarScreeningScene",
            component: CarScreeningScene,
            params: {
                type:2,             //1二手车，2新车
                screeningObject:screeningObject,
                screeningCompleteClick:this.screeningCompleteClick
            }
        };
        this.props.callBack(navigatorParams);
    }

    screeningCompleteClick=(screeningObject)=>{

        this.setState({
            checkedCarType: screeningObject.checkedCarType,
            checkedCarGenre:screeningObject.checkedCarGenre,
            checkedCity:screeningObject.checkedCity,
            checkedCarPrice:screeningObject.checkedCarPrice,
            checkedCarDischarge:screeningObject.checkedCarDischarge,
            checkedCarColor:screeningObject.checkedCarColor,
            checkedCarNature:screeningObject.checkedCarNature,
            checkedCarSpecification:screeningObject.checkedCarSpecification,
        });

        APIParameter.brand_id = screeningObject.checkedCarType.brand_id;
        APIParameter.series_id = screeningObject.checkedCarType.series_id;
        APIParameter.provice_id = screeningObject.checkedCity.provice_id;
        APIParameter.city_id = screeningObject.checkedCity.city_id;
        APIParameter.v_type = 2;
        APIParameter.car_color = screeningObject.checkedCarColor.value;
        APIParameter.emission_standards = screeningObject.checkedCarDischarge.value;
        APIParameter.nature_use = screeningObject.checkedCarNature.value;
        APIParameter.dealer_price = screeningObject.checkedCarPrice.value;
        APIParameter.first_type = screeningObject.checkedCarSpecification.mainValue;
        APIParameter.second_type = screeningObject.checkedCarSpecification.subValue;
        this.setHeadViewType();
    }

    //  筛选条件事件
    headViewOnPres = (index, isHighlighted, setImgHighlighted) => {

        this.refs.HeadView.checkSelect(currentCheckedIndex); // 取消之前选择按钮状态
        currentCheckedIndex = index;

        if (index === 0) {

            let navigatorParams = {
                name: "CarBrandSelectScene",
                component: CarBrandSelectScene,
                params: {
                    checkedCarType: this.state.checkedCarType,
                    checkedCarClick: this.checkedCarClick,
                    status: 1,
                    isHeadInteraction: true,
                    unlimitedAction:this.carTypeClick,
                    // isCheckedCarModel:true,

                }
            };
            this.props.callBack(navigatorParams);

            if (!this.state.isHide) {
                this.setState({
                    isHide: true,
                });
            }

            if (!this.state.isHideCarSpecification) {
                this.setState({
                    isHideCarSpecification: true,
                });
            }
            return;
        }

        if (index === 1) {

            let navigatorParams = {
                name: "ProvinceListScene",
                component: ProvinceListScene,
                params: {
                    checkedCityClick:this.checkedCityClick,
                    unlimitedAction:this.cityUnlimitedAction,
                    isSelectProvince:true
                }
            }
            this.props.callBack(navigatorParams);

            if (!this.state.isHide) {
                this.setState({
                    isHide: true,
                });
            }

            if (!this.state.isHideCarSpecification) {
                this.setState({
                    isHideCarSpecification: true,
                });
            }
            return;
        }

        if (!isHighlighted) {

            if(index==2){
                if(carSpecificationSource.length<=0){
                    this.loadCarConfigData((configData)=>{
                        carSpecificationSource = configData.auto_standard;
                        this.setState({
                            isHide: !isHighlighted,
                            isHideCarSpecification:isHighlighted,

                        });
                        setImgHighlighted(!isHighlighted); // 回调按钮状态

                    })
                }else {
                    this.setState({
                        isHide: !isHighlighted,
                        isHideCarSpecification:isHighlighted,

                    });
                    setImgHighlighted(!isHighlighted); // 回调按钮状态
                }

            } else if(index==3){
                if(carPriceSource.length<=0 ){
                    this.loadCarConfigData((configData)=>{
                        carPriceSource = configData.auto_price;
                        checkedSource = carPriceSource;
                        this.setState({
                            isHide: isHighlighted,
                            isHideCarSpecification:!isHighlighted,
                        });
                        setImgHighlighted(!isHighlighted); // 回调按钮状态
                    });

                }else {
                    checkedSource = carPriceSource;
                    this.setState({
                        isHide: isHighlighted,
                        isHideCarSpecification:!isHighlighted,

                    });
                    setImgHighlighted(!isHighlighted); // 回调按钮状态
                }
            }


        }else {
            this.setState({
                isHide: isHighlighted,
                isHideCarSpecification:isHighlighted
            });
            setImgHighlighted(!isHighlighted); // 回调按钮状态
        }

    };

    // 选择意向
    checkRecommendClick = (isCheck) => {

        currentCarCheckRecommend = isCheck;
        if (isCheck) {
            APIParameter.type = 1;
            APIParameter.prov_id=this.prov_id;
            this.allDelectClick();


        } else {
            APIParameter.type = 4;
            APIParameter.prov_id=0;
            this.filterData();
        }

    };

    setHeadViewType =()=>{
        if (this.refs.HeadView.state.isCheckRecommend) {
            this.refs.HeadView.setCheckRecommend(false);

        } else {

            this.filterData();
        }
    }

    //  选择车型
    checkedCarClick = (carObject) => {

        APIParameter.brand_id = carObject.brand_id;
        APIParameter.series_id = carObject.series_id;

        if(carObject.brand_id == 0 && carObject.series_id ==0)
        {
            APIParameter.model_name = carObject.brand_name;

        }else {

            APIParameter.model_name = '';

        }
        this.setState({
            checkedCarType: {
                title: carObject.series_id == 0 ? carObject.brand_name : carObject.series_name,
                brand_id: carObject.brand_id,
                series_id: carObject.series_id,
            },
        });

        if(!this.refs.HeadView){
            isNewCarCheckRecommend = false;
            currentCarCheckRecommend = isNewCarCheckRecommend;
            APIParameter.type = 4;
            APIParameter.prov_id = 0;
            this.loadData();

        }else {
            this.setHeadViewType();

        }

    };

    // 筛选价格
    checkCarAgeAnKMClick = (data, index) => {

        this.refs.HeadView.checkSelect(currentCheckedIndex);
        let {checkedCarPrice} = this.state;

        if(currentCheckedIndex==3){

            checkedCarPrice = {
                title: data.name,
                value: data.value,
            }
            APIParameter.dealer_price = checkedCarPrice.value;

        }
        this.setState({
            checkedCarPrice,
            isHide: true,
        });


        this.setHeadViewType();

    };

    hideCheckedView = () => {
        this.refs.HeadView.checkSelect(currentCheckedIndex); // 取消之前选择按钮状态
        this.setState({
            isHide: true,

        });
    }

    // 筛选排序
    sequencingCheckedClick = (title, value) => {

        this.setState({
            sequencingType: {

                title: title,
                value: value,

            },
        });
        APIParameter.order_type = value;
        this.setHeadViewType();

    };

    sequencingClick = () => {
        this.setState({
            sequencingType: {
                title: '',
                value: '',
            },
        });
        APIParameter.order_type = 0;
        this.filterData();
    };

    carTypeClick = () => {
        this.setState({
            checkedCarType: {
                title: '',
                brand_id: '',
                series_id: '',
            },
        });
        APIParameter.brand_id = 0;
        APIParameter.series_id = 0;
        APIParameter.model_name = '';
        this.filterData();
    };



    carGenreClick = () => {
        this.setState({
            checkedCarGenre: {
                title: '',
                value: '',
            },
        });
        APIParameter.v_type = 2;
        this.filterData();
    };

    carCityClick = () => {
        this.setState({
            checkedCity: {
                title: '',
                provice_id:'',
                city_id:'',
            },
        });
        APIParameter.provice_id =0;
        APIParameter.city_id = 0;
        this.filterData();
    };

    carPriceClick = () => {
        this.setState({
            checkedCarPrice:{
                title: '',
                value: '',
            },
        });
        APIParameter.dealer_price = 0;
        this.filterData();
    };

    carDischargeClick = () => {
        this.setState({
            checkedCarDischarge:{
                title: '',
                value: '',
            },
        });
        APIParameter.emission_standards = 0;
        this.filterData();
    };

    carColorClick = () => {
        this.setState({
            checkedCarColor:{
                title: '',
                value: '',
            },
        });
        APIParameter.car_color = 0;
        this.filterData();
    };

    carNatureClick = () => {
        this.setState({
            checkedCarNature:{
                title: '',
                value: '',
            },
        });
        APIParameter.nature_use = 0;
        this.filterData();
    };

    carSpecificationClick = () => {
        this.setState({
            checkedCarSpecification:{
                title: '',
                mainValue: '',
                subValue:''
            },
        });
        APIParameter.first_type = '';
        APIParameter.second_type = '';
        this.filterData();
    };

    allDelectClick = () => {

        this.setState({
            sequencingType: {
                title: '',
                value: '',
            },
            checkedCarType: {
                title: '',
                brand_id: '',
                series_id: '',
            },

            checkedCarGenre:{
                title: '',
                value: '',
            },
            checkedCity:{
                title: '',
                provice_id:'',
                city_id:'',
            },
            checkedCarPrice:{
                title: '',
                value: '',
            },
            checkedCarDischarge:{
                title: '',
                value: '',
            },
            checkedCarColor:{
                title: '',
                value: '',
            },
            checkedCarNature:{
                title: '',
                value: '',
            },
            checkedCarSpecification:{
                title: '',
                mainValue: '',
                subValue:''
            },
        });

        APIParameter.order_type = 0;
        APIParameter.mileage = 0;
        APIParameter.brand_id = 0;
        APIParameter.series_id = 0;
        APIParameter.v_type=2;
        APIParameter.provice_id = 0;
        APIParameter.city_id=0;
        APIParameter.dealer_price = 0;
        APIParameter.emission_standards = 0;
        APIParameter.first_type='';
        APIParameter.second_type = '';
        APIParameter.car_color = 0;
        APIParameter.nature_use = 0;
        APIParameter.model_name = '';
        this.setHeadViewType();


    };

    showSequencingView = () => {

        this.refs.SequencingView.visibleCilck(true);

    };


    carCellOnPres = (carID, modelID,sectionID, rowID) => {


        let navigatorParams = {

            name: "CarNewInfoScene",
            component: CarNewInfoScene,
            params: {
                carID: carID,
            }
        };
        this.props.callBack(navigatorParams);
    };

    renderListFooter = () => {

        if (this.state.isRefreshing) {
            return null;
        } else {

            let isCarFoot = true;

            if (APIParameter.brand_id == 0
                && APIParameter.series_id == 0
                && APIParameter.model_id == 0
                && APIParameter.provice_id == 0
                && APIParameter.city_id == 0
                && APIParameter.order_type == 0
                && APIParameter.mileage == 0 && APIParameter.type == 4)
            {
                isCarFoot = false;
            };

            return (<ListFooter isLoadAll={this.state.isFillData==1?false:true} isCarFoot={isCarFoot}
                                footAllClick={this.allDelectClick}/>)
        }

    }

    renderPlaceholderView = () => {
        return (
            <View style={{ width:ScreenWidth, height:ScreenHeight,backgroundColor:fontAndColor.COLORA3,alignItems: 'center'}}>
                {this.loadView()}
            </View>
        );
    }

    render() {

        if (this.state.renderPlaceholderOnly !== 'success') {
            return this.renderPlaceholderView();
        }
        return (

            <View style={styles.contaier}>
                <CarSeekView searchClick={this.presCarTypeScene}  ScreeningClick={this.ScreeningClick}/>
                <CarSourceSelectHeadView ref="HeadView"
                                         onPres={this.headViewOnPres}
                                         checkRecommendClick={this.checkRecommendClick}
                                         isCheckRecommend = {isNewCarCheckRecommend}
                                         titleArray={['车型','地区','车规','价格']}/>
                {

                    (this.state.checkedCarType.title || this.state.sequencingType.title || this.state.checkedCity.title || this.state.checkedCarGenre.title || this.state.checkedCarPrice.title || this.state.checkedCarDischarge.title || this.state.checkedCarColor.title || this.state.checkedCarNature.title || this.state.checkedCarSpecification.title) ?
                        ( <CheckedContentView
                                sequencingType={this.state.sequencingType}
                                carType={this.state.checkedCarType}
                                carGenre={this.state.checkedCarGenre}
                                carCity={this.state.checkedCity}
                                carPrice = {this.state.checkedCarPrice}
                                carDischarge = {this.state.checkedCarDischarge}
                                carColor = {this.state.checkedCarColor}
                                carNature = {this.state.checkedCarNature}
                                carSpecification={this.state.checkedCarSpecification}

                                sequencingClick={this.sequencingClick}
                                carTypeClick={this.carTypeClick}
                                carGenreClick = {this.carGenreClick}
                                carCityClick={this.carCityClick}
                                carPriceClick={this.carPriceClick}
                                carDischargeClick={this.carDischargeClick}
                                carColorClick = {this.carColorClick}
                                carNatureClick={this.carNatureClick}
                                carSpecificationClick={this.carSpecificationClick}
                                allDelectClick={this.allDelectClick}

                            />
                        ) : (null)
                }

                {
                    this.state.dataSource && (
                        <ListView
                            removeClippedSubviews={false}
                            dataSource={this.state.dataSource}
                            initialListSize={10}
                            onEndReachedThreshold={1}
                            stickyHeaderIndices={[]}//仅ios
                            scrollRenderAheadDistance={10}
                            pageSize={10}
                            enableEmptySections={true}
                            renderRow={(item,sectionID,rowID) =>
                                <CarCell style={styles.carCell} carCellData={item} isNewCar={true} onPress={()=> this.carCellOnPres(item.id,sectionID,rowID)}/>
                            }
                            renderFooter={this.renderListFooter}
                            onEndReached={this.toEnd}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this.refreshingData}
                                    tintColor={[fontAndColor.COLORB0]}
                                    colors={[fontAndColor.COLORB0]}
                                />
                            }
                        />)
                }
                <SequencingButton buttonClick={this.showSequencingView}/>
                <SequencingView
                    ref="SequencingView"
                    checkedType={this.state.sequencingType}
                    checkedClick={this.sequencingCheckedClick}
                    sequencingDataSource={sequencingDataSource}/>
                {
                    !this.state.isHide && (
                        <CarSourceSelectView
                            checkedSource={checkedSource}
                            checkCarAgeAnKMClick={this.checkCarAgeAnKMClick}
                            currentCheckedIndex={currentCheckedIndex}
                            hideClick={this.hideCheckedView}
                            checkedTypeString={this.state.checkedCarPrice.title}/>)
                }
                {
                    !this.state.isHideCarSpecification && (
                        <View style={{top: Pixel.getPixel(87), backgroundColor:'rgba(0, 0, 0,0.3)', left: 0, right: 0, position: 'absolute', bottom:0,}}>
                            <CarSpecificationView checkedSpecification={(specificationData)=>{
                                this.refs.HeadView.checkSelect(currentCheckedIndex);
                                this.setState({
                                    isHideCarSpecification:true,
                                    checkedCarSpecification:{
                                        title:specificationData.subTitle?specificationData.subTitle:specificationData.title,
                                        mainValue:specificationData.title,
                                        subValue:specificationData.subTitle,
                                    },
                                });
                                APIParameter.first_type = specificationData.title;
                                APIParameter.second_type = specificationData.subTitle;
                                this.setHeadViewType();
                            }} carSpecificationData = {carSpecificationSource} isAllChecked={true}/>
                        </View>
                    )
                }

            </View>

        )

    }
}


class CheckedContentView extends Component {

    render() {
        const {sequencingType,carType ,carGenre,carCity, carPrice,carDischarge,carColor,carNature, carSpecification, sequencingClick, carTypeClick , carGenreClick,carCityClick,allDelectClick,carPriceClick,carDischargeClick,carColorClick,carNatureClick,carSpecificationClick} = this.props;
        return (

            <View style={styles.checkedContentView}>
                {
                    carGenre.title ? (
                            <TouchableOpacity onPress={carGenreClick}>
                                <View style={styles.checkedContentItem}>
                                    <Text allowFontScaling={false}  style={styles.checkedItemText}>{carGenre.title}</Text>
                                    <Image style={styles.checkedDeleteImg}
                                           source={require('../../images/deleteIcon2x.png')}/>
                                </View>
                            </TouchableOpacity>) : (null)

                }
                {
                    carCity.title ? (
                            <TouchableOpacity onPress={carCityClick}>
                                <View style={styles.checkedContentItem}>
                                    <Text allowFontScaling={false}  style={styles.checkedItemText}>{carCity.title}</Text>
                                    <Image style={styles.checkedDeleteImg}
                                           source={require('../../images/deleteIcon2x.png')}/>
                                </View>
                            </TouchableOpacity>) : (null)

                }
                {
                    sequencingType.title ? (
                            <TouchableOpacity onPress={sequencingClick}>
                                <View style={styles.checkedContentItem}>
                                    <Text allowFontScaling={false}  style={styles.checkedItemText}>{sequencingType.title}</Text>
                                    <Image style={styles.checkedDeleteImg}
                                           source={require('../../images/deleteIcon2x.png')}/>
                                </View>
                            </TouchableOpacity>) : (null)

                }
                {
                    carType.title ? (
                            <TouchableOpacity onPress={carTypeClick}>
                                <View style={styles.checkedContentItem}>
                                    <Text allowFontScaling={false}  style={styles.checkedItemText}>{carType.title}</Text>
                                    <Image style={styles.checkedDeleteImg}
                                           source={require('../../images/deleteIcon2x.png')}/>
                                </View>
                            </TouchableOpacity>) : (null)

                }
                {
                    carPrice.title ? (
                            <TouchableOpacity onPress={carPriceClick}>
                                <View style={styles.checkedContentItem}>
                                    <Text style={styles.checkedItemText}>{carPrice.title}</Text>
                                    <Image style={styles.checkedDeleteImg}
                                           source={require('../../images/deleteIcon2x.png')}/>
                                </View>
                            </TouchableOpacity>) : (null)
                }
                {
                    carDischarge.title ? (
                            <TouchableOpacity onPress={carDischargeClick}>
                                <View style={styles.checkedContentItem}>
                                    <Text style={styles.checkedItemText}>{carDischarge.title}</Text>
                                    <Image style={styles.checkedDeleteImg}
                                           source={require('../../images/deleteIcon2x.png')}/>
                                </View>
                            </TouchableOpacity>) : (null)
                }
                {
                    carColor.title ? (
                            <TouchableOpacity onPress={carColorClick}>
                                <View style={styles.checkedContentItem}>
                                    <Text style={styles.checkedItemText}>{carColor.title}</Text>
                                    <Image style={styles.checkedDeleteImg}
                                           source={require('../../images/deleteIcon2x.png')}/>
                                </View>
                            </TouchableOpacity>) : (null)
                }
                {
                    carNature.title ? (
                            <TouchableOpacity onPress={carNatureClick}>
                                <View style={styles.checkedContentItem}>
                                    <Text style={styles.checkedItemText}>{carNature.title}</Text>
                                    <Image style={styles.checkedDeleteImg}
                                           source={require('../../images/deleteIcon2x.png')}/>
                                </View>
                            </TouchableOpacity>) : (null)
                }
                {
                    carSpecification.title ? (
                            <TouchableOpacity onPress={carSpecificationClick}>
                                <View style={styles.checkedContentItem}>
                                    <Text style={styles.checkedItemText}>{carSpecification.title}</Text>
                                    <Image style={styles.checkedDeleteImg}
                                           source={require('../../images/deleteIcon2x.png')}/>
                                </View>
                            </TouchableOpacity>) : (null)
                }
                <TouchableOpacity onPress={allDelectClick}>
                    <View style={styles.checkedDelectView}>
                        <Text allowFontScaling={false}  style={styles.checkedDelectText}>清空</Text>
                    </View>
                </TouchableOpacity>

            </View>
        )
    }

}

class CarSeekView extends Component {
    render(){
        return(
            <View style={styles.carSeekView}>
                <TouchableOpacity onPress={this.props.searchClick}>
                    <View style={styles.navigatorSousuoView}>
                        <Image style={{marginLeft:Pixel.getPixel(15),marginRight:Pixel.getPixel(10)}}
                               source={require('../../images/carSourceImages/sousuoicon.png')}/>
                        <Text allowFontScaling={false}  style={styles.navigatorSousuoText}>请输入车型关键词</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.props.ScreeningClick} style={{marginLeft:Pixel.getPixel(20)}}>
                    <Image source={require('../../images/carSourceImages/carSeekIcon.png')}/>
                </TouchableOpacity>
            </View>
        )
    }
}


var ScreenWidth = Dimensions.get('window').width;
var ScreenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({

    contaier: {

        backgroundColor: fontAndColor.COLORA3,
        width:ScreenWidth,
        height:ScreenHeight-Pixel.getTitlePixel(64)-Pixel.getPixel(49)
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
        flexDirection: 'row',
    },
    navitgatorContentView: {

        flex: 1,
        flexDirection: 'row',
        marginTop: Pixel.getTitlePixel(20),
        height: Pixel.getPixel(44),
        alignItems: 'center',
        justifyContent: 'center',

    },
    navigatorLoactionView: {

        flexDirection: 'row',
        width: Pixel.getPixel(85),
        alignItems: 'center',


    },
    navigatorSousuoView: {
        height: Pixel.getPixel(30),
        borderRadius: 5,
        backgroundColor: 'white',
        alignItems: 'center',
        width: ScreenWidth - Pixel.getPixel(100),
        flexDirection: 'row',
        justifyContent: 'center',
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
    carSeekView:{
        backgroundColor:fontAndColor.COLORA3,
        height:Pixel.getPixel(47),
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },

});