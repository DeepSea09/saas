/**
 * Created by Administrator on 2017/2/10.
 */
import React, {Component} from 'react';
import {
    Image,
    View,
    Text,
    Button,
    Platform,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    InteractionManager
}from 'react-native';

import Picker from 'react-native-wheel-picker';
let PickerItem = Picker.Item;

import SuccessModal from '../component/SuccessModal';
import * as fontAndColor from '../../constant/fontAndColor';
import AllNavigationView from '../../component/AllNavigationView';
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import SQLiteUtil from '../../utils/SQLiteUtil';
const SQLite = new SQLiteUtil();
import * as Net from '../../utils/RequestUtil';
import * as AppUrls from "../../constant/appUrls";

const {width, height} = Dimensions.get('window');
const background = require('../../../images/publish/background.png');
const preBg = require('../../../images/publish/car-mileage-pre.png');
const proBg = require('../../../images/publish/car-mileage-pro.png');
const IS_ANDROID = Platform.OS === 'android';

export default class AutoMileage extends Component {

    constructor(props) {
        super(props);
        this.shop_id = this.props.shopID;
        this.carData = this.props.carData;
        this.initValue = [0, 0, 0, 0, 0];
        let mileage = this.props.carData.mileage;
        if (this.isEmpty(mileage) === false) {
            mileage = mileage.split("").reverse().join("");
            for (let i = 0; i < mileage.length; i++) {
                if (i < 2) {
                    this.initValue[i] = parseInt(mileage.charAt(i));
                } else if (i > 2) {
                    this.initValue[i - 1] = parseInt(mileage.charAt(i));
                }
            }
        }
        this.initValue.reverse();
        this.state = {
            selected0: this.initValue[0],
            selected1: this.initValue[1],
            selected2: this.initValue[2],
            selected3: this.initValue[3],
            selected4: this.initValue[4],
            itemList: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            renderPlaceholderOnly: true
        };
    }

    isEmpty = (str)=>{
        if(typeof(str) != 'undefined' && str !== ''){
            return false;
        }else {
            return true;
        }
    };

    componentWillMount() {

    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: false});
        });
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    onPickerSelect = (key, value) => {
        const newState = {};
        newState['selected' + key] = value;
        this.initValue[key] = value;
        this.setState(newState);

        let concat = this._concatMileage();
        SQLite.changeData(
            'UPDATE publishCar SET mileage = ? WHERE vin = ?',
            [concat, this.props.carData.vin]);
    };

    _concatMileage = () => {
        let concat = '';
        concat += this.initValue[4];
        concat += this.initValue[3];
        concat += '.';
        concat += this.initValue[2];
        if (this.initValue[1] === 0) {
            if (this.initValue[0] !== 0) {
                concat += this.initValue[1];
            }
        } else {
            concat += this.initValue[1];
        }
        if (this.initValue[0] !== 0)
            concat += this.initValue[0];
        concat = concat.split("").reverse().join("");
        return concat;
    };

    componentWillReceiveProps(nextProps) {
        this.shop_id = nextProps.shopID;
        this.carData = nextProps.carData;
    }

    _renderPlaceholderView = () => {
        return (<Image style={[styles.img,{height:height-this.props.barHeight}]} source={background}/>);
    };

    _onBack = () => {
        this.props.onBack();
    };

    //发布
    _publish = () => {
        try{
            SQLite.selectData('SELECT * FROM publishCar WHERE vin = ?',
                [this.carData.vin],
                (data) => {
                    if (data.code === 1) {
                        let rd = data.result.rows.item(0);
                        if(this.isEmpty(rd.model) === true){
                            this.props.showHint('请选择车型信息');
                            return;
                        }

                        if(this.isEmpty(rd.pictures) === true){
                            this.props.showHint('请拍摄车辆照片');
                            return;
                        }
                        if(rd.v_type === '1' && this.isEmpty(rd.mileage) === false && rd.mileage === '0.00'){
                            this.props.showHint('请填写车辆里程');
                            return;
                        }
                        if(this.isEmpty(rd.manufacture) === true){
                            this.props.showHint('请选择车辆出厂日期');
                            return;
                        }
                        if(rd.v_type === '1' && this.isEmpty(rd.init_reg) === true){
                            this.props.showHint('请选择车辆初登日期');
                            return;
                        }
                        this.props.showLoading();
                        let modelInfo = JSON.parse(rd.model);
                        let params = {
                            vin: rd.vin,
                            brand_id: modelInfo.brand_id,
                            model_id: modelInfo.model_id,
                            series_id: modelInfo.series_id,
                            pictures: rd.pictures,
                            v_type: rd.v_type,
                            manufacture: rd.manufacture,
                            init_reg: rd.init_reg,
                            mileage: rd.mileage,
                            show_shop_id: this.shop_id,
                        };

                        Net.request(AppUrls.CAR_SAVE, 'post', params)
                            .then((response) => {
                                    if (response.mycode === 1) {
                                        SQLite.changeData(
                                            'DELETE From publishCar WHERE vin = ?',
                                            [this.props.carData.vin]);
                                        this.props.closeLoading();
                                        if(IS_ANDROID === true){
                                            this.successModal.openModal();
                                        }else{
                                            this.timer = setTimeout(
                                                () => { this.successModal.openModal(); },
                                                500
                                            );
                                        }
                                    }
                                },
                                (error) => {
                                    this.props.closeLoading();
                                    if(error.mycode === -300 || error.mycode === -500){
                                        if(IS_ANDROID === true){
                                            this.props.showHint('网络请求失败');
                                        }else {
                                            this.timer = setTimeout(
                                                () => { this.props.showHint('网络请求失败'); },
                                                500
                                            );
                                        }
                                    }else{
                                        if(IS_ANDROID === true){
                                            this.props.showHint(error.mjson.msg);
                                        }else {
                                            this.timer = setTimeout(
                                                () => { this.props.showHint(error.mjson.msg); },
                                                500
                                            );
                                        }
                                    }
                                });
                    } else {
                        this.props.closeLoading();
                        if(IS_ANDROID){
                            this.props.showHint(JSON.stringify(data.error));
                        }else {
                            this.timer = setTimeout(
                                () => { this.props.showHint(JSON.stringify(data.error)); },
                                500
                            );
                        }
                    }
                });
        }catch (error){
            this.props.closeLoading();
            if(IS_ANDROID === true){
                this.props.showHint(JSON.stringify(error));
            }else {
                this.timer = setTimeout(
                    () => { this.props.showHint(JSON.stringify(error));},
                    500
                );
            }
        }

    };

    _renderRihtFootView = () => {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={this._publish}>
                <Text allowFontScaling={false}  style={styles.rightTitleText}>发布</Text>
            </TouchableOpacity>
        );
    };

    render() {
        if (this.state.renderPlaceholderOnly) {
            return this._renderPlaceholderView();
        }
        return (
            <View style={styles.container}>
                <Image style={[styles.imgContainer,{height:height-this.props.barHeight}]} source={background}>
                    <SuccessModal okClick={this.props.goToSource} ref={(modal) => {this.successModal = modal}}/>
                    <AllNavigationView
                        backIconClick={this._onBack}
                        title='填写行驶里程'
                        wrapStyle={styles.wrapStyle}
                        renderRihtFootView={this._renderRihtFootView}
                    />
                    <View style={styles.mileContainer}>
                        <Image style={styles.preContainer} source={preBg}>
                            <View style={styles.fillSpace}>
                                <Picker style={[IS_ANDROID && styles.fillSpace]}
                                        selectedValue={this.state.selected0}
                                        itemStyle={{color:"#FFFFFF", fontSize:26,fontWeight:'bold'}}
                                        onValueChange={(index) => this.onPickerSelect(0,index)}>
                                    {this.state.itemList.map((value, i) => (
                                        <PickerItem label={value} value={i} key={"first"+value}/>
                                    ))}
                                </Picker>
                            </View>
                            <View style={styles.fillSpace}>
                                <Picker style={[IS_ANDROID && styles.fillSpace]}
                                        selectedValue={this.state.selected1}
                                        itemStyle={{color:"#FFFFFF", fontSize:26,fontWeight:'bold'}}
                                        onValueChange={(index) => this.onPickerSelect(1,index)}>
                                    {this.state.itemList.map((value, i) => (
                                        <PickerItem label={value} value={i} key={"second"+value}/>
                                    ))}
                                </Picker>
                            </View>
                            <View style={styles.fillSpace}>
                                <Picker style={[IS_ANDROID && styles.fillSpace]}
                                        selectedValue={this.state.selected2}
                                        itemStyle={{color:"#FFFFFF", fontSize:26,fontWeight:'bold'}}
                                        onValueChange={(index) => this.onPickerSelect(2,index)}>
                                    {this.state.itemList.map((value, i) => (
                                        <PickerItem label={value} value={i} key={"three"+value}/>
                                    ))}
                                </Picker>
                            </View>
                        </Image>
                        <Text allowFontScaling={false}  style={[styles.fontBold,styles.dotSpace]}>.</Text>
                        <Image style={styles.proContainer} source={proBg}>
                            <View style={styles.fillSpace}>
                                <Picker style={[IS_ANDROID && styles.fillSpace]}
                                        selectedValue={this.state.selected3}
                                        itemStyle={{color:"#FFFFFF", fontSize:26,fontWeight:'bold'}}
                                        onValueChange={(index) => this.onPickerSelect(3,index)}>
                                    {this.state.itemList.map((value, i) => (
                                        <PickerItem label={value} value={i} key={"four"+value}/>
                                    ))}
                                </Picker>
                            </View>
                            <View style={styles.fillSpace}>
                                <Picker style={[IS_ANDROID && styles.fillSpace]}
                                        selectedValue={this.state.selected4}
                                        itemStyle={{color:"#FFFFFF", fontSize:26,fontWeight:'bold'}}
                                        onValueChange={(index) => this.onPickerSelect(4,index)}>
                                    {this.state.itemList.map((value, i) => (
                                        <PickerItem label={value} value={i} key={"five"+value}/>
                                    ))}
                                </Picker>
                            </View>
                        </Image>
                        <View style={styles.endContainer}>
                            <Text allowFontScaling={false}  style={[styles.fontBold]}>万公里</Text>
                        </View>
                    </View>
                </Image>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: width,
        backgroundColor: 'transparent'
    },
    imgContainer: {
        width: width,
        backgroundColor: 'transparent',
        alignItems: 'center'
    },
    mileContainer: {
        flexDirection: 'row',
        marginTop: Pixel.getPixel(207)
    },
    fillSpace: {
        flex: 1,
        overflow:'hidden',
    },
    preContainer: {
        height: Pixel.getPixel(44),
        width: Pixel.getPixel(132),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    proContainer: {
        height: Pixel.getPixel(44),
        width: Pixel.getPixel(88),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)'
    },
    fontBold: {
        fontSize: Pixel.getFontPixel(23),
        fontWeight: 'bold',
        color: '#FFFFFF'
    },
    dotSpace: {
        width: Pixel.getPixel(24),
        textAlign: 'center',
        marginTop: Pixel.getPixel(6)
    },
    endContainer: {
        marginLeft: Pixel.getPixel(9),
        justifyContent: 'center'
    },
    wrapStyle: {
        backgroundColor: 'transparent'
    },
    rightTitleText: {
        color: 'white',
        fontSize: Pixel.getFontPixel(fontAndColor.NAVIGATORFONT34),
        textAlign: 'right',
        backgroundColor: 'transparent'
    }
});
