/**
 * Created by Administrator on 2017/2/10.
 */
import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    Dimensions,
    StyleSheet,
    Platform,
    TouchableOpacity,
    InteractionManager
} from 'react-native';

import * as fontAndColor from '../../constant/fontAndColor';
import AllNavigationView from '../../component/AllNavigationView';
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();

const { width,height } = Dimensions.get('window');
const background = require('../../../images/publish/background.png');
const transferNum = require('../../../images/publish/transfer-num.png');

import Picker from 'react-native-wheel-picker';
let PickerItem = Picker.Item;

const IS_ANDROID = Platform.OS === 'android';

export default class AutoTransfer extends Component {

    constructor(props) {
        super(props);
        this.vinNum = this.props.carData.vin;
        let transfer = this.props.carData.transfer_number;
        let initValue = 0;
        if(this.isEmpty(transfer) === false){
            if(transfer === '10以上'){
                initValue = 11;
            }else {
                initValue = parseInt(transfer);
            }
        }
        this.state = {
            selected1: initValue,
            itemList: ['0', '1', '2', '3', '4', '5', '6', '7','8','10','10以上'],
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

    onPickerSelect = (key,value) => {
        const newState = {};
        newState[key] = value;
        this.setState(newState);
        this.props.sqlUtil.changeData(
            'UPDATE publishCar SET transfer_number = ? WHERE vin = ?',
            [this.state.itemList[value], this.vinNum]);
    };

    _renderPlaceholderView = ()=>{
        return(<Image style={[styles.img,{height:height-this.props.barHeight}]} source={background} />);
    };

    _onBack = ()=>{
        this.props.onBack();
    };

    _renderRihtFootView = ()=>{
        return(
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={()=>{this.props.publishData()}}>
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
                <Image style={[styles.img,{height:height-this.props.barHeight}]} source={background}>
                    <AllNavigationView
                        backIconClick={this._onBack}
                        title='选择过户次数'
                        wrapStyle={styles.wrapStyle}
                        renderRihtFootView={this._renderRihtFootView} />
                    <Image style={styles.imgContainer} source={transferNum}>
                        <View style={styles.inputContainer}>
                            <View style={IS_ANDROID ? styles.pickAndroidContainer: styles.pickIOSContainer}>
                                <Picker style={[IS_ANDROID && styles.fillSpace]}
                                        selectedValue={this.state.selected1}
                                        itemStyle={{color:"#FFFFFF", fontSize:16,fontWeight:'bold'}}
                                        onValueChange={(index) => this.onPickerSelect('selected1',index)}>
                                    {this.state.itemList.map((value, i) => (
                                        <PickerItem label={value} value={i} key={"first"+value}/>
                                    ))}
                                </Picker>
                            </View>
                            <View style={styles.timeContainer}>
                                <Text allowFontScaling={false}  style={styles.fontTime}>次</Text>
                            </View>
                        </View>
                    </Image>
                </Image>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width:width,
        backgroundColor: 'transparent'
    },
    img: {
        width:width,
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    imgContainer: {
        width: Pixel.getPixel(120),
        height: Pixel.getPixel(120),
        justifyContent: 'center',
        marginTop:Pixel.getPixel(225),
        alignItems:'center'
    },
    inputContainer:{
        flexDirection:'row',
        width:Pixel.getPixel(70),
        height:Pixel.getPixel(40),

    },
    pickAndroidContainer:{
        flex:1,
        height:Pixel.getPixel(40)
    },
    pickIOSContainer:{
        flex:1,
        height:Pixel.getPixel(40),
        justifyContent:'center',
        overflow:'hidden'
    },
    inputNum:{
        width:Pixel.getPixel(60),
        height:Pixel.getPixel(40),
        fontSize:Pixel.getFontPixel(38),
        padding:0,
        color:'#FFFFFF',
        textAlign:'right'
    },
    timeContainer:{
        justifyContent:'center',
    },
    fontTime:{
        fontSize:Pixel.getFontPixel(15),
        color:'#FFFFFF',
        marginLeft:Pixel.getFontPixel(3),
    },
    wrapStyle:{
        backgroundColor:'transparent'
    },
    rightTitleText: {
        color: 'white',
        fontSize: Pixel.getFontPixel(fontAndColor.NAVIGATORFONT34),
        textAlign: 'right',
        backgroundColor: 'transparent'
    },
    fillSpace:{
        flex:1,
    }
});