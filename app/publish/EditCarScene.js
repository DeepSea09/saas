/**
 * Created by Administrator on 2017/2/16.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Dimensions,
    Image,
    Platform
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';

import DetailModelSelect from './page/DetailModelSelect';
import DetailAutoPhoto from './page/DetailAutoPhoto';
import DetailAutoType from './page/DetailAutoType';
import DetailAutoDate from './page/DetailAutoDate';
import DetailAutoMileage from './page/DetailAutoMileage';
import AutoPlate from './page/AutoPlate';
import AutoEmission from './page/AutoEmission';
import AutoLabel from './page/AutoLabel';
import AutoOperation from './page/AutoOperation';
import AutoColor from './page/AutoColor';
import AutoTransfer from './page/AutoTransfer';
import AutoOther from './page/AutoOther';
import EditIndicator from './component/EditIndicator';
import BaseComponent from '../component/BaseComponent';
import CarMySourceScene from '../carSource/CarMySourceScene';
import SuccessModal from './component/SuccessModal';

import * as Net from '../utils/RequestUtil';
import * as AppUrls from '../constant/appUrls';
import SQLiteUtil from '../utils/SQLiteUtil';
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
const SQLite = new SQLiteUtil();
const {width} = Dimensions.get('window');
const background = require('../../images/publish/background.png');
const barHeight = Pixel.getPixel(94);
const IS_ANDROID = Platform.OS === 'android';

export default class EditCarScene extends BaseComponent {

    initFinish = () => {
        SQLite.createTable();
        if (this.fromNew === true) {
            //从新车页跳过来(根据车架号查询数据)
            SQLite.selectData('SELECT * FROM publishCar WHERE vin = ?',
                [this.carVin],
                (data) => {
                    if (data.code === 1) {
                        let carType = data.result.rows.item(0).v_type;

                        if(carType === '') carType = '1';
                        this.setState({
                            carData: data.result.rows.item(0),
                            carType:carType
                        });
                    } else {
                    }
                });
        }
        else {
            //请求网络数据(根据车源id查询数据)
            let params = {
                id: this.carId,
            };
            Net.request(AppUrls.CAR_DETAIL, 'post', params).then(
                (response) => {
                    if (response.mycode === 1) {
                        let rdb = response.mjson.data;
                        this.shop_id = rdb.show_shop_id;
                        this.carVin = rdb.vin;
                        SQLite.selectData('SELECT * FROM publishCar WHERE vin = ?',
                            [this.carVin],
                            (data) => {
                                if (data.code === 1) {
                                    if (data.result.rows.length === 0) {
                                        let modelInfo = {};
                                        modelInfo['brand_id'] = rdb.brand_id;
                                        modelInfo['model_id'] = rdb.model_id;
                                        modelInfo['series_id'] = rdb.series_id;
                                        modelInfo['model_year'] = '';
                                        modelInfo['model_name'] = rdb.model_name;
                                        let mf = '2010-06-01';
                                        let rg = '2010-06-01';
                                        if(this.isEmpty(rdb.manufacture) === false) mf = this.dateReversal(rdb.manufacture);
                                        if(this.isEmpty(rdb.init_reg) === false) rg = this.dateReversal(rdb.manufacture);
                                        let pictures = '';
                                        if(rdb.imgs != 'undefined' && rdb.imgs != null){
                                            let ps = [];
                                            rdb.imgs.map((p)=>{
                                                ps.push({
                                                    name:p.name,
                                                    file_id:p.file_id,
                                                    url:p.url
                                                });
                                            });
                                            pictures = JSON.stringify(ps);
                                        }
                                        let dprice = rdb.dealer_price == '0.0000' ? '':rdb.dealer_price;
                                        SQLite.changeData('INSERT INTO publishCar (vin,model,pictures,v_type,manufacture,init_reg,' +
                                            'mileage,plate_number,emission,label,nature_use,car_color,trim_color,' +
                                            'transfer_number,dealer_price,describe,modify) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                                            [this.carVin, JSON.stringify(modelInfo), pictures,rdb.v_type+'', mf, rg, rdb.mileage,
                                                rdb.plate_number, rdb.emission_standards, JSON.stringify(rdb.label), rdb.nature_use, rdb.car_color, rdb.trim_color,
                                                rdb.transfer_times, dprice, rdb.describe,rdb.modification_instructions]);
                                        SQLite.selectData('SELECT * FROM publishCar WHERE vin = ?',
                                            [this.carVin],
                                            (data) => {
                                                if (data.code === 1) {
                                                    let carType = data.result.rows.item(0).v_type;
                                                    if(carType === '') carType = '1';
                                                    this.setState({
                                                        carData: data.result.rows.item(0),
                                                        carType:carType
                                                    });
                                                } else {
                                                }
                                            });
                                    } else {
                                        let carType = data.result.rows.item(0).v_type;
                                        if(carType === '') carType = '1';
                                        this.setState({
                                            carData: data.result.rows.item(0),
                                            carType:carType
                                        });
                                    }
                                } else {
                                }
                            });
                    }
                },
                (error) => {
                }
            );
        }
    };

    componentWillUnmount(){
        this.timer && clearTimeout(this.timer);
    }

    constructor(props) {
        super(props);
        this.fromNew = this.props.fromNew;
        this.carVin = this.props.carVin;
        this.carId = this.props.carId;
        this.shop_id = this.props.shopID;
        this.state = {
            carData: {},
            carType:'1'
        };
    }

    _showLoading = ()=>{
        this.props.showModal(true);
    };

    _closeLoading = ()=>{
        this.props.showModal(false);
    };

    dateReversal=(time)=>{
        const date = new Date();
        date.setTime(time+'000');
        let year = date.getFullYear();
        let month = (date.getMonth()+1) + '';
        let day = date.getDay() + '';
        if(month.length == 1)month = '0'+month;
        if(day.length == 1) day = '0'+day;
        return(year+"-"+month+"-"+day);
    };

    isEmpty = (str)=>{
        if(typeof(str) != 'undefined' && str !== ''){
            return false;
        }else {
            return true;
        }
    };

    _onBack = (page) => {
        if (page === 0) {
            this.backPage();
        } else {
            this.tabView.goToPage(page - 1);
        }
    };

    //提示信息
    _showHint = (hint)=>{
        this.props.showToast(hint);
    };

    //发布
    _publish = () => {

        try{
            SQLite.selectData('SELECT * FROM publishCar WHERE vin = ?',
                [this.carVin],
                (data) => {
                    if (data.code === 1) {
                        let rd = data.result.rows.item(0);

                        if(this.isEmpty(rd.model) === true){
                            this._showHint('请选择车型信息');
                            return;
                        }

                        if(this.isEmpty(rd.pictures) === true){
                            this._showHint('请拍摄车辆照片');
                            return;
                        }
                        if(rd.v_type === '1' && this.isEmpty(rd.mileage) === false && rd.mileage === '0.00'){
                            this._showHint('请填写车辆里程');
                            return;
                        }
                        if(this.isEmpty(rd.manufacture) === true){
                            this._showHint('请选择车辆出厂日期');
                            return;
                        }
                        if(rd.v_type === '1' && this.isEmpty(rd.init_reg) === true){
                            this.props.showHint('请选择车辆初登日期');
                            return;
                        }
                        let modelInfo = JSON.parse(rd.model);
                        let params = {
                            show_shop_id: this.shop_id,
                            vin: rd.vin,
                            brand_id: modelInfo.brand_id,
                            model_id: modelInfo.model_id,
                            series_id: modelInfo.series_id,
                            pictures: rd.pictures,
                            v_type: rd.v_type,
                            manufacture: rd.manufacture,
                            init_reg: rd.init_reg,
                            mileage: rd.mileage,
                            car_color: rd.car_color,
                            trim_color: rd.trim_color,
                            dealer_price: rd.dealer_price,
                            describe: rd.describe,
                            emission_standards: rd.emission,
                            label: rd.label,
                            nature_use: rd.nature_use,
                            plate_number: rd.plate_number,
                            transfer_times: rd.transfer_number,
                            modification_instructions:rd.modify
                        };
                        if (!this.fromNew) {
                            params['id'] = this.carId;
                        }
                        this._showLoading();
                        Net.request(AppUrls.CAR_SAVE, 'post', params)
                            .then((response) => {
                                    if (response.mycode === 1) {
                                        SQLite.changeData(
                                            'DELETE From publishCar WHERE vin = ?',
                                            [this.carVin]);
                                        this._closeLoading();
                                        if(IS_ANDROID === true){
                                            this.successModal.openModal();
                                        }else {
                                            this.timer = setTimeout(
                                                () => { this.successModal.openModal(); },
                                                500
                                            );
                                        }
                                    }else {
                                        this._closeLoading();
                                        if(IS_ANDROID === true){
                                            this._showHint('网络请求失败');
                                        }else {
                                            this.timer = setTimeout(
                                                () => { this.successModal.openModal(); },
                                                500
                                            );
                                        }
                                    }
                                },
                                (error) => {
                                    this._closeLoading();
                                    if(error.mycode === -300 || error.mycode === -500){
                                        if(IS_ANDROID === true){
                                            this._showHint('网络请求失败');
                                        }else {
                                            this.timer = setTimeout(
                                                () => { this._showHint('网络请求失败'); },
                                                500
                                            );
                                        }
                                    }else{
                                        if(IS_ANDROID === true){
                                            this._showHint(error.mjson.msg);
                                        }else {
                                            this.timer = setTimeout(
                                                () => { this._showHint(error.mjson.msg); },
                                                500
                                            );
                                        }
                                    }
                                });
                    } else {
                        this._closeLoading();
                        if(IS_ANDROID === true){
                            this._showHint(JSON.stringify(data.error));
                        }else{
                            this.timer = setTimeout(
                                () => { this._showHint(JSON.stringify(data.error)); },
                                500
                            );
                        }
                    }
                });
        }catch(error) {
            this._closeLoading();
            if(IS_ANDROID === true){
                this._showHint(JSON.stringify(error));
            }else {
                this.timer = setTimeout(
                    () => { this._showHint(JSON.stringify(error)); },
                    500
                );
            }
        }

    };

    //上传成功后
    sourceParams = {
        name: 'CarMySourceScene',
        component: CarMySourceScene,
        params: {}
    };

    mtoNextPage = (mProps) => {
        const navigator = this.props.navigator;
        if (navigator) {
            navigator.replace({
                ...mProps
            })
        }
    };

    _goToSource = () => {
        this.mtoNextPage(this.sourceParams);
    };

    _goToPage = (parms)=>{
        this.toNextPage(parms);
    };

    _refreshType = (data)=>{
        this.setState({
            carType:data
        })
    };

    render() {
        return (
            <Image style={styles.container} source={background}>
                <SuccessModal okClick={this._goToSource} ref={(modal) => {this.successModal = modal}}/>
                <ScrollableTabView
                    ref={(tab)=>{this.tabView = tab}}
                    tabBarPosition='bottom'
                    renderTabBar={()=>{return(<EditIndicator />)}}>
                    <DetailModelSelect sqlUtil={SQLite}
                                       goToPage={this._goToPage}
                                       carData={this.state.carData}
                                       publishData={this._publish}
                                       onBack={()=>this._onBack(0)}
                                       barHeight={barHeight} tabLabel="ModelSelect"/>
                    <DetailAutoPhoto sqlUtil={SQLite}
                                     showHint={this._showHint}
                                     showLoading={this._showLoading}
                                     closeLoading={this._closeLoading}
                                     carData={this.state.carData}
                                     publishData={this._publish}
                                     onBack={()=>this._onBack(1)}
                                     barHeight={barHeight} tabLabel="DetailAutoPhoto"/>
                    <DetailAutoType refreshType={this._refreshType}
                                    sqlUtil={SQLite}
                                    carData={this.state.carData}
                                    publishData={this._publish}
                                    onBack={()=>this._onBack(2)}
                                    barHeight={barHeight} tabLabel="DetailAutoType"/>
                    <DetailAutoDate sqlUtil={SQLite}
                                    carType={this.state.carType}
                                    carData={this.state.carData}
                                    publishData={this._publish}
                                    onBack={()=>this._onBack(3)}
                                    barHeight={barHeight} tabLabel="DetailAutoDate"/>
                    <AutoPlate sqlUtil={SQLite}
                               carData={this.state.carData}
                               publishData={this._publish}
                               onBack={()=>this._onBack(4)}
                               barHeight={barHeight} tabLabel="AutoPlate"/>
                    <DetailAutoMileage sqlUtil={SQLite}
                                       carData={this.state.carData}
                                       publishData={this._publish}
                                       onBack={()=>this._onBack(5)}
                                       barHeight={barHeight} tabLabel="DetailAutoMileage"/>
                    <AutoEmission sqlUtil={SQLite}
                                  carData={this.state.carData}
                                  publishData={this._publish}
                                  onBack={()=>this._onBack(6)}
                                  barHeight={barHeight} tabLabel="AutoEmission"/>
                    <AutoLabel sqlUtil={SQLite}
                               showHint={this._showHint}
                               showLoading={this._showLoading}
                               closeLoading={this._closeLoading}
                               carData={this.state.carData}
                               publishData={this._publish}
                               onBack={()=>this._onBack(7)}
                               barHeight={barHeight} tabLabel="AutoLabel"/>
                    <AutoOperation sqlUtil={SQLite}
                                   carData={this.state.carData}
                                   publishData={this._publish}
                                   onBack={()=>this._onBack(8)}
                                   barHeight={barHeight} tabLabel="AutoOperation"/>
                    <AutoColor sqlUtil={SQLite}
                               carData={this.state.carData}
                               publishData={this._publish}
                               onBack={()=>this._onBack(9)}
                               barHeight={barHeight} tabLabel="AutoColor"/>
                    <AutoTransfer sqlUtil={SQLite}
                                  carData={this.state.carData}
                                  publishData={this._publish}
                                  onBack={()=>this._onBack(10)}
                                  barHeight={barHeight} tabLabel="AutoTransfer"/>
                    <AutoOther sqlUtil={SQLite}
                               carData={this.state.carData}
                               publishData={this._publish}
                               onBack={()=>this._onBack(11)}
                               goToPage={this._goToPage}
                               barHeight={barHeight} tabLabel="AutoOther"/>
                </ScrollableTabView>
            </Image>
        );
    };
}
const styles = StyleSheet.create({
    container: {
        width: width,
        flex: 1,
        backgroundColor: 'transparent'
    },
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
