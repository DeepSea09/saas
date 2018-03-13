/**
 * Created by Administrator on 2017/2/10.
 */
import React, {Component} from 'react';
import {
    Image,
    View,
    Text,
    Platform,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    InteractionManager
}from 'react-native';

import Picker from 'react-native-wheel-picker';
let PickerItem = Picker.Item;

import * as fontAndColor from '../../constant/fontAndColor';
import AllNavigationView from '../../component/AllNavigationView';
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();

const {width, height} = Dimensions.get('window');
const background = require('../../../images/publish/background.png');
const preBg = require('../../../images/publish/car-mileage-pre.png');
const proBg = require('../../../images/publish/car-mileage-pro.png');
const IS_ANDROID = Platform.OS === 'android';

export default class DetailAutoMileage extends Component {

    constructor(props) {
        super(props);
        this.initValue = [0, 0, 0, 0, 0];
        this.vinNum = this.props.carData.vin;
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

    }

    onPickerSelect = (key, value) => {
        const newState = {};
        newState['selected' + key] = value;
        this.initValue[key] = value;
        this.setState((preState,props)=>(newState));

        let concat = this._concatMileage();
        this.props.sqlUtil.changeData(
            'UPDATE publishCar SET mileage = ? WHERE vin = ?',
            [concat, this.vinNum]);
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

    _renderPlaceholderView = () => {
        return (<Image style={[styles.img,{height:height-this.props.barHeight}]} source={background}/>);
    };

    _onBack = () => {
        this.props.onBack();
    };

    _renderRihtFootView = () => {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={this.props.publishData}>
                <Text allowFontScaling={false}  style={styles.rightTitleText}>完成</Text>
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
