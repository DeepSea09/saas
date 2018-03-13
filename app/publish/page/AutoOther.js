/**
 * Created by Administrator on 2017/2/10.
 */
import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    TextInput,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    InteractionManager,
    ScrollView,
    KeyboardAvoidingView,
} from 'react-native';



import * as fontAndColor from '../../constant/fontAndColor';
import AllNavigationView from '../../component/AllNavigationView';
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import AutoConfig from '../AutoConfig';

const {width, height} = Dimensions.get('window');
const background = require('../../../images/publish/background.png');
const arrow = require('../../../images/publish/date-select.png');

export default class AutoOther extends Component {

    constructor(props) {
        super(props);
        console.log(this.props.carData);
        this.vinNum = this.props.carData.vin;
        this.dealer_price = this.props.carData.dealer_price;
        this.describe = this.props.carData.describe;
        this.modify = this.props.carData.modify;
        if (this.isEmpty(this.describe) === true) {
            this.describe = '';
        }
        if (this.isEmpty(this.dealer_price) === true) {
            this.dealer_price = '';
        }
        if (this.isEmpty(this.modify) === true) {
            this.modify = '';
        }
        this.state = {
            renderPlaceholderOnly: true
        }
    }

    isEmpty = (str) => {
        if (typeof(str) != 'undefined' && str !== '') {
            return false;
        } else {
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

    _renderPlaceholderView = () => {
        return (<Image style={[styles.img, {height: height - this.props.barHeight}]} source={background}/>);
    };

    _onBack =() => {
        this.props.onBack();
    };

    _renderRihtFootView =() => {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                    this.props.publishData()
                }}>
                <Text allowFontScaling={false}  style={styles.rightTitleText}>完成</Text>
            </TouchableOpacity>
        );
    };

    _onPrice = (text) => {
        this.props.sqlUtil.changeData(
            'UPDATE publishCar SET dealer_price = ? WHERE vin = ?',
            [text, this.vinNum]);
    };

    _onDescribe = (text) => {
        this.props.sqlUtil.changeData(
            'UPDATE publishCar SET describe = ? WHERE vin = ?',
            [text, this.vinNum]);
    };

    _onModify = (text) => {
        this.props.sqlUtil.changeData(
            'UPDATE publishCar SET modify = ? WHERE vin = ?',
            [text, this.vinNum]);
    };

    _configPress = ()=>{

            configParams = {
                name: 'AutoConfig',
                component: AutoConfig,
                params: {
                    modelID:this.props.carData.model!==''?(JSON.parse(this.props.carData.model)).model_id:'',
                    carConfigurationData:[],
                    from:'AutoOther'
                }
            };
            this.props.goToPage(configParams);



    };

    render() {
        if (this.state.renderPlaceholderOnly) {
            return this._renderPlaceholderView();
        }
        return (
            <View style={styles.container}>

                <Image style={[styles.img, {height: height - this.props.barHeight}]} source={background}>
                    <ScrollView>
                        <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={75}>
                            <View style={styles.avoidContainer}>
                                <View style={[styles.rectangleContainer, styles.firstMargin]}>
                                    <Text allowFontScaling={false}  style={[styles.fontMain, styles.leftText]}>销售价：</Text>
                                    <TextInput style={[styles.fontMain, styles.leftInput, styles.fillSpace]}
                                               underlineColorAndroid='transparent' defaultValue={this.dealer_price}
                                               onChangeText={this._onPrice}
                                    />
                                    <Text allowFontScaling={false}  style={[styles.fontMain, styles.rightText]}>万元</Text>
                                </View>
                                <View style={[styles.rectangleContainer, styles.alignMargin]}>
                                    <Text allowFontScaling={false}  style={[styles.fontMain, styles.leftText]}>车况描述：</Text>
                                    <TextInput style={[styles.fontMain, styles.leftInput, styles.fillSpace]}
                                               underlineColorAndroid='transparent' defaultValue={this.describe}
                                               onChangeText={this._onDescribe}/>
                                </View>
                                <View style={[styles.modifyContainer, styles.alignMargin]}>
                                    <Text allowFontScaling={false}  style={[styles.fontMain, styles.leftText]}>配置改装说明：</Text>
                                    <TextInput style={[styles.fontMain, styles.modifyInput]}
                                               underlineColorAndroid='transparent' defaultValue={this.modify}
                                               multiline={true}
                                               maxLength={50}
                                               onChangeText={this._onModify}/>
                                </View>
                                <View style={styles.configureContainer}>
                                    <View style={styles.fillSpace}/>
                                    <TouchableOpacity style={styles.configPress}
                                                      activeOpacity={0.6}
                                                      onPress={()=>{this._configPress()}}>
                                        <Text allowFontScaling={false}  style={[styles.fontMain, styles.leftText]}>查看车辆标准配置</Text>
                                        <Image style={styles.imgContainer} source={arrow}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </ScrollView>
                </Image>
                <AllNavigationView
                    backIconClick={this._onBack}
                    title='其他信息'
                    wrapStyle={styles.wrapStyle}
                    renderRihtFootView={this._renderRihtFootView}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: width,
        backgroundColor: 'transparent',
    },
    img: {
        width: width,
        backgroundColor: 'transparent',
        alignItems: 'center'
    },
    rectangleContainer: {
        width: Pixel.getPixel(317),
        height: Pixel.getPixel(44),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: Pixel.getPixel(2)
    },
    fontMain: {
        fontSize: Pixel.getFontPixel(15),
        color: '#FFFFFF'
    },
    firstMargin: {
        marginTop: Pixel.getPixel(120)
    },
    alignMargin: {
        marginTop: Pixel.getPixel(25)
    },
    leftText: {
        marginLeft: Pixel.getPixel(10)
    },
    rightText: {
        marginRight: Pixel.getPixel(10)
    },
    leftInput: {
        marginLeft: Pixel.getPixel(5)
    },
    fillSpace: {
        flex: 1,
    },
    imgContainer: {
        width: Pixel.getPixel(9),
        height: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(5),
    },
    wrapStyle: {
        backgroundColor: 'transparent'
    },
    rightTitleText: {
        color: 'white',
        fontSize: Pixel.getFontPixel(fontAndColor.NAVIGATORFONT34),
        textAlign: 'right',
        backgroundColor: 'transparent'
    },
    modifyInput: {
        marginLeft: Pixel.getPixel(5),
        height: Pixel.getPixel(107),
        flexDirection: 'row',
        flex: 1
    },
    modifyContainer: {
        width: Pixel.getPixel(317),
        height: Pixel.getPixel(107),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: Pixel.getPixel(2)
    },
    configureContainer: {
        width: Pixel.getPixel(317),
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Pixel.getPixel(12),
        justifyContent:'center'
    },
    avoidContainer:{
        width:width,
        alignItems:'center'
    },
    configPress:{
        flexDirection:'row',
        alignItems:'center'
    }
});
