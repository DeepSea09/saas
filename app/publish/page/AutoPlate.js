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
    TextInput,
    Platform,
    TouchableOpacity,
    InteractionManager
} from 'react-native';

import * as fontAndColor from '../../constant/fontAndColor';
import AllNavigationView from '../../component/AllNavigationView';
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();

const { width,height } = Dimensions.get('window');
import PlateModal from '../component/PlateModal';
const background = require('../../../images/publish/background.png');
const preBg = require('../../../images/publish/car-plate-pre.png');
const proBg = require('../../../images/publish/car-plate.png');
const IS_ANDROID = Platform.OS === 'android';

export default class AutoPlate extends Component {

    constructor(props) {
        super(props);
        this.initValue =['','','','','','',''];
        this.vinNum = this.props.carData.vin;
        let plate = this.props.carData.plate_number;
        if(this.isEmpty(plate) === false){
            for(let i=0;i<plate.length;i++){
                this.initValue[i] = plate.charAt(i);
            }
        }
        if(this.initValue[0] === '') this.initValue[0] = '京';
        this.state = {
            city:this.initValue[0],
            renderPlaceholderOnly: true
        }
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

    _openModal = ()=>{
        this.plateModal.openModal();
    };

    _onClose =(city)=>{
        this.setState({
            city:city
        });
        this.initValue[0] = city;
        this._insertPlate();
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

    _onPlateChange= (text,type) =>{

        this.initValue[type] = text;
        this._insertPlate();
        if(text.length !== 0){
            switch (type){
                case 1:
                    this.firstInput.setNativeProps({
                        text:text
                    });
                    this.secondInput.focus();
                    break;
                case 2:
                    this.secondInput.setNativeProps({
                        text:text
                    });
                    this.threeInput.focus();
                    break;
                case 3:
                    this.threeInput.setNativeProps({
                        text:text
                    });
                    this.fourInput.focus();
                    break;
                case 4:
                    this.fourInput.setNativeProps({
                        text:text
                    });
                    this.fiveInput.focus();
                    break;
                case 5:
                    this.fiveInput.setNativeProps({
                        text:text
                    });
                    this.sixInput.focus();
                    break;
                case 6:
                    this.sixInput.setNativeProps({
                        text:text
                    });
                    break;
            }
        }
    };

    _insertPlate(){
        let plate='';
        for(let i=0;i < this.initValue.length;i++){
            plate += this.initValue[i];
        }

        this.props.sqlUtil.changeData(
            'UPDATE publishCar SET plate_number = ? WHERE vin = ?',
            [plate, this.vinNum]);
    }


    render() {
        if (this.state.renderPlaceholderOnly) {
            return this._renderPlaceholderView();
        }
        return (
            <View style={styles.container}>
                <Image style={[styles.imgContainer,{height:height-this.props.barHeight}]} source={background}>
                    <PlateModal onClose={this._onClose} ref={(modal) => {this.plateModal = modal}}/>
                    <AllNavigationView
                        backIconClick={this._onBack}
                        title='填写车牌号'
                        wrapStyle={styles.wrapStyle}
                        renderRihtFootView={this._renderRihtFootView} />
                    <View style={styles.plateContainer}>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={()=>{this._openModal()}}
                            style={styles.preContainer}>
                            <Image style={styles.preContainer} source={preBg}>
                                <Text allowFontScaling={false}  style={styles.fontPre}>{this.state.city}</Text>
                            </Image>
                        </TouchableOpacity>

                        <Image style={styles.proContainer} source={proBg}>
                            <TextInput ref={(input)=>{this.firstInput = input}}
                                style={IS_ANDROID ? styles.fontAndroidBold: styles.fontIOSBold} underlineColorAndroid='transparent'
                                       defaultValue={this.initValue[1]} maxLength={1} onChangeText={(text)=>this._onPlateChange(text,1)}/>
                            <TextInput ref={(input)=>{this.secondInput = input}}
                                       style={IS_ANDROID ? styles.fontAndroidBold: styles.fontIOSBold} underlineColorAndroid='transparent'
                                       defaultValue={this.initValue[2]} maxLength={1} onChangeText={(text)=>this._onPlateChange(text,2)}/>
                            <TextInput ref={(input)=>{this.threeInput = input}}
                                       style={IS_ANDROID ? styles.fontAndroidBold: styles.fontIOSBold} underlineColorAndroid='transparent'
                                       defaultValue={this.initValue[3]} maxLength={1} onChangeText={(text)=>this._onPlateChange(text,3)}/>
                            <TextInput ref={(input)=>{this.fourInput = input}}
                                       style={IS_ANDROID ? styles.fontAndroidBold: styles.fontIOSBold} underlineColorAndroid='transparent'
                                       defaultValue={this.initValue[4]} maxLength={1} onChangeText={(text)=>this._onPlateChange(text,4)}/>
                            <TextInput ref={(input)=>{this.fiveInput = input}}
                                       style={IS_ANDROID ? styles.fontAndroidBold: styles.fontIOSBold} underlineColorAndroid='transparent'
                                       defaultValue={this.initValue[5]} maxLength={1} onChangeText={(text)=>this._onPlateChange(text,5)}/>
                            <TextInput ref={(input)=>{this.sixInput = input}}
                                       style={IS_ANDROID ? styles.fontAndroidBold: styles.fontIOSBold} underlineColorAndroid='transparent'
                                       defaultValue={this.initValue[6]} maxLength={1} onChangeText={(text)=>this._onPlateChange(text,6)}/>
                        </Image>
                    </View>
                </Image>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        width:width,
        backgroundColor: 'transparent',
    },
    imgContainer: {
        width:width,
        backgroundColor: 'transparent',
        alignItems: 'center'
    },
    plateContainer: {
        flexDirection: 'row',
        marginTop: Pixel.getPixel(207),
        alignItems:'center',
        width:Pixel.getPixel(320)
    },
    preContainer: {
        height: Pixel.getPixel(44),
        width: Pixel.getPixel(44),
        justifyContent:'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)'
    },
    proContainer: {
        flex:1,
        height: Pixel.getPixel(44),
        width: Pixel.getPixel(264),
        marginLeft: Pixel.getPixel(12),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)'
    },
    fontPre: {
        fontSize: Pixel.getFontPixel(20),
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign:'center'
    },
    fontAndroidBold: {
        height: Pixel.getPixel(44),
        width: Pixel.getPixel(44),
        fontSize: Pixel.getFontPixel(20),
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign:'left'
    },
    fontIOSBold: {
        height: Pixel.getPixel(44),
        width: Pixel.getPixel(44),
        fontSize: Pixel.getFontPixel(20),
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign:'center'
    },
    wrapStyle:{
        backgroundColor:'transparent'
    },
    rightTitleText: {
        color: 'white',
        fontSize: Pixel.getFontPixel(fontAndColor.NAVIGATORFONT34),
        textAlign: 'right',
        backgroundColor: 'transparent'
    }
});
