/**
 * Created by Administrator on 2017/2/10.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    InteractionManager
}from 'react-native';

import * as fontAndColor from '../../constant/fontAndColor';
import AllNavigationView from '../../component/AllNavigationView';
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();

const {width,height} = Dimensions.get('window');
const background = require('../../../images/publish/background.png');

export default class DetailAutoType extends Component {

    constructor(props) {
        super(props);
        this.viewData = [
            {
                title: '新车',
                selected: false,
                index:'2',
            },
            {
                title: '二手车',
                selected: true,
                index:'1',
            },
            {
                title: '平行进口车',
                selected: false,
                index:'3',
            },
        ];

        this.state = {
            dataSource: this.viewData,
            renderPlaceholderOnly: true
        };
    }

    componentWillMount() {
        let v_type = this.props.carData.v_type;
        if(this.isEmpty(v_type) === false){
            this.viewData.map((data)=>{
                data.selected = (data.index == v_type);
            });
            this.setState((prevState, props) => ({
                dataSource: this.viewData
            }));
        }else{
            this.viewData.map((data)=>{
                if(data.selected) {
                    v_type = data.index;
                }
            });
            this.props.sqlUtil.changeData(
                'UPDATE publishCar SET v_type =? WHERE vin = ?',
                [ v_type, this.props.carData.vin]);
        }
    }

    isEmpty = (str)=>{
        if(typeof(str) != 'undefined' && str !== ''){
            return false;
        }else {
            return true;
        }
    };

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: false});
        });
    }

    componentWillUnmount() {

    }

    _labelPress = (i) => {
        this.viewData.map((data,index)=>{
            data.selected = (i === index);
        });
        this.setState((prevState, props) => ({
            dataSource: this.viewData
        }));
        this.props.sqlUtil.changeData(
            'UPDATE publishCar SET v_type = ? WHERE vin = ?',
            [ this.viewData[i].index, this.props.carData.vin]);
        this.props.refreshType(this.viewData[i].index);

    };

    _renderPlaceholderView = ()=>{
        return(<Image style={[styles.img,{height:height-this.props.barHeight}]} source={background} />);
    };

    _renderItem = () => {
        return (
            this.state.dataSource.map((data, i) => {
                if (data.selected) {
                    return (
                        <TouchableOpacity
                            key={i}
                            activeOpacity={0.6}
                            style={[styles.selectContainer,styles.contentAlign]}
                            onPress={()=>{this._labelPress(i)}}>
                            <View >
                                <Text allowFontScaling={false}  style={styles.selectText}>{data.title}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                } else {
                    return (
                        <TouchableOpacity
                            key={i}
                            activeOpacity={0.6}
                            style={[styles.circleContainer,styles.contentAlign]}
                            onPress={()=>{this._labelPress(i)}}>
                            <View >
                                <Text allowFontScaling={false}  style={styles.unselectText}>{data.title}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }
            })
        );
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
                <Image style={[styles.imgContainer,{height:height-this.props.barHeight}]} source={background}>
                    <AllNavigationView
                        backIconClick={this._onBack}
                        title='选择车辆类型'
                        wrapStyle={styles.wrapStyle}
                        renderRihtFootView={this._renderRihtFootView}
                    />
                    {this._renderItem()}
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
        alignItems: 'center',
        paddingTop: Pixel.getPixel(169)
    },
    contentAlign: {
        marginTop: Pixel.getPixel(40)
    },
    circleContainer: {
        width: Pixel.getPixel(210),
        height: Pixel.getPixel(44),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius: Pixel.getPixel(22),
        backgroundColor: 'rgba(255,255,255,0.2)'
    },
    unselectText: {
        fontSize: Pixel.getFontPixel(15),
        color: '#FFFFFF'
    },
    selectText: {
        fontSize: Pixel.getFontPixel(15),
        color: fontAndColor.COLORB0
    },
    selectContainer: {
        width: Pixel.getPixel(210),
        height: Pixel.getPixel(44),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius: Pixel.getPixel(22),
        backgroundColor: '#FFFFFF'
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