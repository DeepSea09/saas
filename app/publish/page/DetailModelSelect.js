/**
 * from @liusai
 *
 **/
import React, {Component, PureComponent} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    InteractionManager
}from 'react-native';
import CarBrandSelectScene from '../../carSource/CarBrandSelectScene';
import * as fontAndColor from '../../constant/fontAndColor';
import AllNavigationView from '../../component/AllNavigationView';
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();

const {width, height} = Dimensions.get('window');
const background = require('../../../images/publish/background.png');
const scan = require('../../../images/publish/scan.png');
const arrow = require('../../../images/publish/date-select.png');

export default class DetailModelSelect extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            renderPlaceholderOnly: true,
            vinNum: '',
            model_name: ''
        }
        this.modelClick = false;
    }

    componentWillMount() {

    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: false});
        });
    }

    componentWillUnmount() {

    }

    componentWillReceiveProps(nextProps: Object) {
        if(this.modelClick === false ){
            let model_name = '';
            if (this.isEmpty(nextProps.carData.model) === false ) {
                let modelInfo = JSON.parse(nextProps.carData.model);
                model_name = modelInfo.model_name;
            }

            this.setState({
                model_name:model_name,
                vinNum: nextProps.carData.vin
            });
        }else{
            this.modelClick = false;
        }
    }

    isEmpty = (str)=>{
        if(typeof(str) != 'undefined' && str !== ''){
            return false;
        }else {
            return true;
        }
    };

    //选择车型
    _modelPress = () => {
        let brandParams ={
            name: 'CarBrandSelectScene',
            component: CarBrandSelectScene,
            params: {checkedCarClick: this._checkedCarClick,
                status:0,}
        };

        this.props.goToPage(brandParams);
    };

    _checkedCarClick = (carObject)=>{
        this.setState({
            model_name:carObject.model_name
        });
        this.modelClick = true;
        let modelInfo = {};
        modelInfo['brand_id'] = carObject.brand_id;
        modelInfo['model_id'] = carObject.model_id;
        modelInfo['series_id'] = carObject.series_id;
        modelInfo['model_year'] = '';
        modelInfo['model_name'] = carObject.model_name;
        this.props.sqlUtil.changeData('UPDATE publishCar SET model = ? WHERE vin = ?', [JSON.stringify(modelInfo),this.state.vinNum]);
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
                <Image source={background} style={[styles.container,{height:height-this.props.barHeight}]}>
                    <AllNavigationView
                        backIconClick={this._onBack}
                        title='选择车辆款型'
                        wrapStyle={styles.wrapStyle}
                        renderRihtFootView={this._renderRihtFootView}
                        />
                    <View style={[styles.circleContainer,styles.vinCircle]}>
                        <Text allowFontScaling={false}  style={[styles.fontMain,styles.leftText]}>车架号</Text>
                        <Text allowFontScaling={false}  editable={false} style={[styles.fontMain,styles.fillSpace]}>{this.state.vinNum}</Text>
                    </View>
                    <Text allowFontScaling={false}  style={styles.fontHint}>建议您扫描登记证或行驶证上的车架号</Text>
                    <TouchableOpacity
                        style={[styles.circleContainer,styles.modelCircle]}
                        activeOpacity={0.6}
                        onPress={()=>{this._modelPress()}}>
                        <View style={styles.rowCenter}>
                            <Text allowFontScaling={false}  style={[styles.fontMain,styles.leftText]}>请选择车型</Text>
                            <Text allowFontScaling={false}  style={[styles.fontMain,styles.fillSpace]}>{this.state.model_name}</Text>
                            <Image style={styles.imgContainer} source={arrow}/>
                        </View>
                    </TouchableOpacity>
                </Image>
            </View>

        );
    };
}

const styles = StyleSheet.create({
    container: {
        width: width,
        backgroundColor: 'transparent'
    },
    vinCircle: {
        marginTop: Pixel.getPixel(209)
    },
    modelCircle: {
        marginTop: Pixel.getPixel(45)
    },
    circleContainer: {
        height: Pixel.getPixel(44),
        flexDirection: 'row',
        marginHorizontal: Pixel.getPixel(35),
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: Pixel.getPixel(22),
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    leftText: {
        marginLeft: Pixel.getPixel(20),
    },
    rightText: {
        marginRight: Pixel.getPixel(7)
    },
    fontMain: {
        color: '#FFFFFF',
        fontSize: Pixel.getFontPixel(14)
    },
    fontHint: {
        marginTop: Pixel.getPixel(10),
        marginLeft: Pixel.getPixel(55),
        color: '#FFFFFF',
        fontSize: Pixel.getFontPixel(12),
        opacity: 0.6,
    },
    imgContainer: {
        width: Pixel.getPixel(18),
        height: Pixel.getPixel(18),
        marginRight: Pixel.getPixel(20)
    },
    fillSpace: {
        flex: 1,
    },
    center: {
        flexDirection: 'row'
    },
    rowCenter: {
        flexDirection: 'row',
        alignItems: 'center'
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

