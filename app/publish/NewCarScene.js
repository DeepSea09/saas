/**
 * Created by Administrator on 2017/2/16.
 */
import React,{ Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    Image
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';

import ModelSelect from './page/ModelSelect';
import AutoPhoto from './page/AutoPhoto';
import AutoType from './page/AutoType';
import AutoDate from './page/AutoDate';
import AutoMileage from './page/AutoMileage';
import NewIndicator from './component/NewIndicator';
import EditCarScene from './EditCarScene';
import CarMySourceScene from '../carSource/CarMySourceScene';
import BaseComponent from '../component/BaseComponent';
import EnterpriseInfo from './component/EnterpriseInfo';
import StorageUtil from "../utils/StorageUtil";
import * as StorageKeyNames from "../constant/storageKeyNames";
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
const { width } = Dimensions.get('window');
const background = require('../../images/publish/background.png');

const barHeight = Pixel.getPixel(57);

export default class NewCarScene extends BaseComponent{

    initFinish=()=>{
        StorageUtil.mGetItem(StorageKeyNames.ENTERPRISE_LIST,(data)=>{
            if(data.code == 1 && data.result != ''){
                let enters = JSON.parse(data.result);
                if(enters.length === 1){
                    this.setState({
                        shop_id:enters[0].enterprise_uid
                    });
                }else if(enters.length > 1){
                    this.enterpriseList = enters;
                    this.enterpriseModal.refresh(this.enterpriseList);
                    this.enterpriseModal.openModal();
                }else{
                    this._showHint('无法找到所属商户');
                }
            }else{
                this._showHint('无法找到所属商户');
            }
        });
    };

    constructor(props){
        super(props);
        this.enterpriseList = [];
        this.state = {
            canChange:true,
            carData:{},
            shop_id:'',
            brand:{}
        };
    }

    _showLoading = ()=>{
        this.props.showModal(true);
    };

    _closeLoading = ()=>{
        this.props.showModal(false);
    };

    //更多跳到编辑页
    _goToMore = ()=>{
        let moreParams = {
            name: 'EditCarScene',
            component: EditCarScene,
            params: {fromNew:true,carVin:this.state.carData.vin,shopID:this.state.shop_id}
        };

        this.mtoNextPage(moreParams);
    };

    mtoNextPage = (mProps) => {
        const navigator = this.props.navigator;
        if (navigator) {
            navigator.replace({
                ...mProps
            })
        }
    };

    //上传成功后
    sourceParams ={
        name: 'CarMySourceScene',
        component: CarMySourceScene,
        params: {}
    };

    _goToSource = ()=>{
        this.mtoNextPage(this.sourceParams);
    };

    _onBack = (page) =>{
        if(page === 0){
            this.backPage();
        }else{
            this.tabView.goToPage(page-1);
        }
    };

    _canChange = (change)=>{
        this.setState({
            canChange:change
        });
    };

    _carData = (data)=>{
        this.setState({
            carData:data
        })
    };

    _showHint = (hint)=>{
        this.props.showToast(hint);
    };

    _enterprisePress = (rowID)=>{
        this.setState({
            shop_id:this.enterpriseList[rowID].enterprise_uid
        });
    };

    _goToPage = (parms)=>{
        this.toNextPage(parms);
    };

    render(){
        return(
            <Image style={styles.container}  source={background}>
                <EnterpriseInfo viewData ={this.enterpriseList}
                                enterpricePress={this._enterprisePress}
                         ref={(modal) => {this.enterpriseModal = modal}}/>
                <ScrollableTabView
                    ref={(tab)=>{this.tabView = tab}}
                    tabBarPosition='bottom'
                    locked={this.state.canChange}
                    renderTabBar={()=>{return(<NewIndicator canChange={this.state.canChange} showHint={this._showHint}
                    goToMore={()=>{this._goToMore()}} />)}}>
                    <ModelSelect
                        goToPage={this._goToPage}
                        carNumberBack = {this._canChange}
                        onBack={()=>this._onBack(0)} refreshCar={this._carData}
                        barHeight={barHeight} tabLabel="ModelSelect" />
                    <AutoPhoto
                        showHint={this._showHint}
                        showLoading={this._showLoading}
                        closeLoading={this._closeLoading}
                        carData={this.state.carData}
                        onBack={()=>this._onBack(1)}
                        barHeight={barHeight} tabLabel="AutoPhoto" />
                    <AutoType
                        refreshCar={this._carData}
                        carData={this.state.carData}
                        onBack={()=>this._onBack(2)}
                        barHeight={barHeight} tabLabel="AutoType" />
                    <AutoDate
                        carData={this.state.carData}
                        onBack={()=>this._onBack(3)}
                        barHeight={barHeight} tabLabel="AutoDate" />
                    <AutoMileage
                        showLoading={this._showLoading}
                        closeLoading={this._closeLoading}
                        shopID = {this.state.shop_id}
                        showHint={this._showHint}
                        goToSource={this._goToSource}
                        carData={this.state.carData}
                        onBack={()=>this._onBack(4)}
                        barHeight={barHeight} tabLabel="AutoMileage"/>
                </ScrollableTabView>
            </Image>
        );
    };
}
const styles = StyleSheet.create({
    container:{
        width:width,
        flex:1,
        backgroundColor:'transparent'
    }
});
