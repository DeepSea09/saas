/**
 * Created by Administrator on 2017/2/10.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    InteractionManager
} from 'react-native';

import * as fontAndColor from '../../constant/fontAndColor';
import Grid from '../component/Grid';
import AllNavigationView from '../../component/AllNavigationView';
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();

const {width, height} = Dimensions.get('window');
const background = require('../../../images/publish/background.png');
const grayColor = require('../../../images/publish/gray-color.png');
const multiColor = require('../../../images/publish/multi-color.png');
const doubleColor = require('../../../images/publish/double-color.png');
const colorSelect = require('../../../images/publish/color-select.png');

export default class AutoColor extends Component {

    constructor(props) {
        super(props);
        this.vinNum = this.props.carData.vin;
        let car_color = this.props.carData.car_color;
        let trim_color = this.props.carData.trim_color;
        // if(this.isEmpty(car_color) === true) {
        //     car_color = '黑色';
        //     this.props.sqlUtil.changeData(
        //         'UPDATE publishCar SET car_color = ? WHERE vin = ?',
        //         [car_color, this.vinNum]);
        // }
        // if(this.isEmpty(trim_color) === true) {
        //     trim_color = '黑色';
        //     this.props.sqlUtil.changeData(
        //         'UPDATE publishCar SET trim_color = ? WHERE vin = ?',
        //         [trim_color, this.vinNum]);
        // }
        //车身 fill为true填充颜色，false填充图片
        this.viewShell = [
            {
                title: '黑色',
                selected: false,
                fill: true,
                color: '#000000',
                img: '',
                index: 0
            },
            {
                title: '白色',
                selected: false,
                fill: true,
                color: '#FFFFFF',
                img: '',
                index: 1
            },
            {
                title: '银灰色',
                selected: false,
                fill: false,
                color: '',
                img: grayColor,
                index: 2
            },
            {
                title: '深灰色',
                selected: false,
                fill: true,
                color: '#a8a8a8',
                img: '',
                index: 3
            },
            {
                title: '绿色',
                selected: false,
                fill: true,
                color: '#79c65e',
                img: '',
                index: 4
            },
            {
                title: '红色',
                selected: false,
                fill: true,
                color: '#d22c23',
                img: '',
                index: 5
            },
            {
                title: '橙色',
                selected: false,
                fill: true,
                color: '#ffaa25',
                img: '',
                index: 6
            },
            {
                title: '黄色',
                selected: false,
                fill: true,
                color: '#ffcf12',
                img: '',
                index: 7
            },
            {
                title: '蓝色',
                selected: false,
                fill: true,
                color: '#0c99f9',
                img: '',
                index: 8
            },
            {
                title: '咖啡色',
                selected: false,
                fill: true,
                color: '#814505',
                img: '',
                index: 9
            },
            {
                title: '紫色',
                selected: false,
                fill: true,
                color: '#6c1d90',
                img: '',
                index: 10
            },
            {
                title: '香槟色',
                selected: false,
                fill: true,
                color: '#e1c8b4',
                img: '',
                index: 11
            },
            {
                title: '多彩色',
                selected: false,
                fill: false,
                color: '',
                img: multiColor,
                index: 12
            },
            {
                title: '其他',
                selected: false,
                fill: false,
                color: '',
                img: doubleColor,
                index: 13
            },
            {
                title: '',
                selected: '',
                fill: false,
                color: '',
                img: '',
                index: 14
            },
            {
                title: '',
                selected: '',
                fill: false,
                color: '',
                img: '',
                index: 15
            }
        ];
        //内饰
        this.viewInterior = [
            {
                title: '黑色',
                selected: false,
                fill: true,
                color: '#000000',
                img: '',
                index: 0
            },
            {
                title: '白色',
                selected: false,
                fill: true,
                color: '#FFFFFF',
                img: '',
                index: 1
            },
            {
                title: '灰色',
                selected: false,
                fill: true,
                color: '#a8a8a8',
                img: '',
                index: 2
            },
            {
                title: '红色',
                selected: false,
                fill: true,
                color: '#d22c23',
                img: '',
                index: 3
            },
            {
                title: '蓝色',
                selected: false,
                fill: true,
                color: '#0c99f9',
                img: '',
                index: 4
            },
            {
                title: '黄色',
                selected: false,
                fill: true,
                color: '#ffcf12',
                img: '',
                index: 5
            },
            {
                title: '银色',
                selected: false,
                fill: false,
                color: '',
                img: grayColor,
                index: 6
            },
            {
                title: '其他',
                selected: false,
                fill: false,
                color: '',
                img: doubleColor,
                index: 7
            },
        ];

        this.viewShell.map((shell)=>{
            if(shell.title != ''){
                shell.selected = (shell.title === car_color);
            }
        });

        this.viewInterior.map((interior)=>{
            interior.selected = (interior.title === trim_color);
        });
        this.state = {
            carShell: this.viewShell,
            carInterior: this.viewInterior,
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

    _renderPlaceholderView = ()=>{
        return(<Image style={[styles.img,{height:height-this.props.barHeight}]} source={background} />);
    };


    componentWillUnmount() {

    }

    _shellPress = (i) => {
        let shell ='';
        this.viewShell.map((data,index)=>{
            if(data.title !== ''){
                if(i === index){
                    data.selected = true;
                    shell = data.title;
                }else{
                    data.selected = false;
                }
            }
        });

        this.shellGrid.refresh(this.viewShell);
        this.props.sqlUtil.changeData(
            'UPDATE publishCar SET car_color = ? WHERE vin = ?',
            [shell, this.vinNum]);
    };

    _interiorPress = (i) => {
        let interior='';
        this.viewInterior.map((data,index)=>{
            if(data.title != ''){
                if(i === index){
                    data.selected = true;
                    interior = data.title;
                }else{
                    data.selected = false;
                }
            }
        });
        this.interiorGrid.refresh(this.viewInterior);
        this.props.sqlUtil.changeData(
            'UPDATE publishCar SET trim_color = ? WHERE vin = ?',
            [interior, this.vinNum]);
    };

    _renderShell = (data, i) => {
        if (data.selected === false) {
            if (data.fill === true) {
                //颜色
                return (
                    <TouchableOpacity
                        key={data.index}
                        style={styles.shellContainer}
                        activeOpacity={0.6}
                        onPress={()=>{this._shellPress(data.index)}}
                    >
                        <View style={styles.center}>
                            <View style={[styles.colorContainer,{backgroundColor:data.color}]}/>
                            <Text allowFontScaling={false}  style={styles.textLabel}>{data.title}</Text>
                        </View>
                    </TouchableOpacity>

                );
            } else {
                //图片
                return (
                    <TouchableOpacity
                        key={data.index}
                        style={styles.shellContainer}
                        activeOpacity={0.6}
                        onPress={()=>{this._shellPress(data.index)}}
                    >
                        <View style={styles.center}>
                            <Image style={styles.colorContainer} source={data.img}/>
                            <Text allowFontScaling={false}  style={styles.textLabel}>{data.title}</Text>
                        </View>
                    </TouchableOpacity>

                );
            }
        } else if (data.selected === true) {
            return (
                <TouchableOpacity
                    key={data.index}
                    style={styles.shellContainer}
                    activeOpacity={0.6}
                    onPress={()=>{this._shellPress(data.index)}}
                >
                    <View style={styles.center}>
                        <View style={[styles.colorContainer,styles.selectColor]}>
                            <Image style={styles.selectImg} source={colorSelect}/>
                        </View>
                        <Text allowFontScaling={false}  style={styles.textLabel}>{data.title}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else {
            return (
                <View key={data.index} style={styles.shellContainer}>
                    <View style={[styles.emptyContainer]}>

                    </View>
                </View>
            );
        }
    };

    _renderInterior = (data, i) => {
        if (data.selected === false) {
            if (data.fill === true) {
                //颜色
                return (
                    <TouchableOpacity
                        key={data.index}
                        style={styles.shellContainer}
                        activeOpacity={0.6}
                        onPress={()=>{this._interiorPress(data.index)}}
                    >
                        <View style={styles.center}>
                            <View style={[styles.colorContainer,{backgroundColor:data.color}]}/>
                            <Text allowFontScaling={false}  style={styles.textLabel}>{data.title}</Text>
                        </View>
                    </TouchableOpacity>

                );
            } else {
                //图片
                return (
                    <TouchableOpacity
                        key={data.index}
                        style={styles.shellContainer}
                        activeOpacity={0.6}
                        onPress={()=>{this._interiorPress(data.index)}}
                    >
                        <View style={styles.center}>
                            <Image style={styles.colorContainer} source={data.img}/>
                            <Text allowFontScaling={false}  style={styles.textLabel}>{data.title}</Text>
                        </View>
                    </TouchableOpacity>
                );
            }
        } else {
            return (
                <TouchableOpacity
                    key={data.index}
                    style={styles.shellContainer}
                    activeOpacity={0.6}
                    onPress={()=>{this._interiorPress(data.index)}}
                >
                    <View style={styles.center}>
                        <View style={[styles.colorContainer,styles.selectColor]}>
                            <Image style={styles.selectImg} source={colorSelect}/>
                        </View>
                        <Text allowFontScaling={false}  style={styles.textLabel}>{data.title}</Text>
                    </View>
                </TouchableOpacity>
            );
        }
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
                        title='选择颜色'
                        wrapStyle={styles.wrapStyle}
                        renderRihtFootView={this._renderRihtFootView} />
                    <ScrollView showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                style={styles.contentContainer}>
                        <View>
                            <Text allowFontScaling={false}  style={styles.titleText}>车身颜色</Text>
                            <View style={styles.splitLine}/>
                            <Grid
                                ref = {(grid)=>{this.shellGrid = grid}}
                                style={styles.girdContainer}
                                renderItem={this._renderShell}
                                data={this.state.carShell}
                                itemsPerRow={4}
                            />
                        </View>
                        <View style={styles.itemTop}>
                            <Text allowFontScaling={false}  style={styles.titleText}>内饰颜色</Text>
                            <View style={styles.splitLine}/>
                            <Grid
                                ref = {(grid)=>{this.interiorGrid = grid}}
                                style={styles.girdContainer}
                                renderItem={this._renderInterior}
                                data={this.state.carInterior}
                                itemsPerRow={4}
                            />
                        </View>
                    </ScrollView>
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
    imgContainer:{
        width: width,
        backgroundColor: 'transparent'
    },
    contentContainer: {
        marginTop: Pixel.getPixel(66),
        marginHorizontal: Pixel.getPixel(42),
        marginBottom:Pixel.getPixel(80)
    },
    titleText: {
        fontSize: Pixel.getFontPixel(15),
        color: '#FFFFFF'
    },
    splitLine: {
        marginTop: Pixel.getPixel(6),
        borderColor: '#FFFFFF',
        borderWidth: 0.5,
        flexDirection: 'row'
    },
    girdContainer: {
        flex: 1,
        marginTop: Pixel.getPixel(12)
    },
    shellContainer: {
        marginTop: Pixel.getPixel(14)
    },
    colorContainer: {
        width: Pixel.getPixel(40),
        height: Pixel.getPixel(40),
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: Pixel.getPixel(20)
    },
    emptyContainer: {
        width: Pixel.getPixel(40),
        height: Pixel.getPixel(40)
    },
    textLabel: {
        marginTop: Pixel.getPixel(4),
        fontSize: Pixel.getFontPixel(12),
        color: '#FFFFFF'
    },
    selectColor: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectImg: {
        width: Pixel.getPixel(16),
        height: Pixel.getPixel(11)
    },
    center: {
        alignItems: 'center'
    },
    itemTop:{
        marginTop:Pixel.getPixel(25)
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

