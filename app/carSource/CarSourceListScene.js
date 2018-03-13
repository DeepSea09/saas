/**
 * Created by zhengnan on 17/2/9.
 */

import React, {Component} from 'react';

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    BackAndroid,
    NativeModules,
    DeviceEventEmitter,
    ScrollView,

} from 'react-native';


import * as fontAndColor    from '../constant/fontAndColor';
import BaseComponent        from '../component/BaseComponent';
import CarInfoScene         from './CarInfoScene';
import PixelUtil            from '../utils/PixelUtil';
import ZNSwitchoverButton from './znComponent/ZNSwitchoverButton';
import CarUserListScene from './CarUserListScene';
import CarNewListScene from './CarNewListScene';
import * as storageKeyNames from '../constant/storageKeyNames';
import StorageUtil from '../utils/StorageUtil';
import CarSeekScene from "./CarSeekScene";




let Pixel = new PixelUtil();
let carFilterData = require('./carData/carFilterData.json');

let carData = [];




export  default  class carSourceListScene extends BaseComponent {

    handleBack = () => {
        NativeModules.VinScan.goBack();
        return true;
    }

    componentWillReceiveProps(nextProps) {

        StorageUtil.mGetItem(storageKeyNames.NEED_OPENBRAND,(data)=>{
            if(data.code==1){
                if(data.result=='true'){

                    this.presCarTypeScene();
                }
            }
        });

        StorageUtil.mGetItem(storageKeyNames.NEED_CHECK_NEW_CAR,(data)=>{

            if(data.code == 1){
                if(data.result == 'true'){

                    this.scrollView.scrollTo({x:ScreenWidth, y:0, animated: true});
                    this.refs.CarListNavigatorView && this.refs.CarListNavigatorView.setBtnType(1);
                }
            }
        });
        StorageUtil.mGetItem(storageKeyNames.NEED_CHECK_USER_CAR,(data)=>{

            if(data.code == 1){
                if(data.result == 'true'){
                    this.scrollView.scrollTo({x:0, y:0, animated: false});
                    this.refs.CarListNavigatorView && this.refs.CarListNavigatorView.setBtnType(0);
                }
            }
        });

        StorageUtil.mSetItem(storageKeyNames.NEED_CHECK_NEW_CAR,'false');
        StorageUtil.mSetItem(storageKeyNames.NEED_CHECK_USER_CAR,'false');
        StorageUtil.mSetItem(storageKeyNames.NEED_OPENBRAND,'false');


    }

    componentWillMount() {

        StorageUtil.mGetItem(storageKeyNames.NEED_OPENBRAND,(data)=>{
            if(data.code==1){
                if(data.result=='true'){

                    this.presCarTypeScene();
                }
            }
        });

        StorageUtil.mGetItem(storageKeyNames.NEED_CHECK_NEW_CAR,(data)=>{

            if(data.code == 1){
                if(data.result == 'true'){

                    this.scrollView.scrollTo({x:ScreenWidth, y:0, animated: true});
                    this.refs.CarListNavigatorView && this.refs.CarListNavigatorView.setBtnType(1);
                }
            }
        });
        StorageUtil.mGetItem(storageKeyNames.NEED_CHECK_USER_CAR,(data)=>{

            if(data.code == 1){
                if(data.result == 'true'){
                    this.scrollView.scrollTo({x:0, y:0, animated: false});
                    this.refs.CarListNavigatorView && this.refs.CarListNavigatorView.setBtnType(0);
                }
            }
        });

        StorageUtil.mSetItem(storageKeyNames.NEED_CHECK_NEW_CAR,'false');
        StorageUtil.mSetItem(storageKeyNames.NEED_CHECK_USER_CAR,'false');
        StorageUtil.mSetItem(storageKeyNames.NEED_OPENBRAND,'false');

    }

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
    }

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            switchoverType:0
        }

    }


    carCellOnPres = (carID, modelID,sectionID, rowID) => {


        let navigatorParams = {

            name: "CarInfoScene",
            component: CarInfoScene,
            params: {
                carID: carID,
            }
        };
        this.props.callBack(navigatorParams);
    };

    switchoverAction=(title,index)=>{

        this.scrollView.scrollTo({x:index *ScreenWidth, y:0, animated: true});
    }


    renderPlaceholderView = () => {
        return (
            <View style={{flex:1,backgroundColor:fontAndColor.COLORA3,alignItems: 'center'}}>
                {this.loadView()}
            </View>
        );
    }

    presCarTypeScene = () => {

        let navigatorParams = {
            name: "CarSeekScene",
            component: CarSeekScene,
            params: {
                checkedCarClick: this.checkedCarClick,
            }

        };
        this.props.callBack(navigatorParams);

    }

    checkedCarClick=(carObject)=>{
        this.carUserListScene && this.carUserListScene.checkedCarClick(carObject);
        this.carNewListScene && this.carNewListScene.checkedCarClick(carObject);
    }

    render() {

        return (
            <View style={styles.contaier}>
                <CarListNavigatorView ref="CarListNavigatorView"  loactionClick={this.loactionClick} switchoverType={this.state.switchoverType} switchoverAction={this.switchoverAction}/>
                <ScrollView
                            ref={(ref)=>{this.scrollView = ref}}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            horizontal={true}
                            overScrollMode="never"
                            scrollEnabled={false}>
                    <CarUserListScene ref={(ref)=>{this.carUserListScene = ref}} showModal={this.props.showModal} callBack={this.props.callBack}/>
                    <CarNewListScene ref={(ref)=>{this.carNewListScene = ref}} showModal={this.props.showModal} callBack={this.props.callBack}/>
                </ScrollView>


            </View>

        )

    }
}


class CarListNavigatorView extends Component {


    setBtnType =(type)=>{
        this.refs.ZNSwitchoverButton && this.refs.ZNSwitchoverButton.setBtnType(type);
    }

    render() {
        return (

            <View style={styles.navigatorView}>
                <View style={styles.navitgatorContentView}>
                    <ZNSwitchoverButton ref="ZNSwitchoverButton" switchoverAction={this.props.switchoverAction} titleArray={['二手车','新车  ']} defaultIndex={this.props.switchoverType}/>
                </View>
            </View>

        )
    }
}

var ScreenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({

    contaier: {
        flex: 1,
        backgroundColor: fontAndColor.COLORA3
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
});