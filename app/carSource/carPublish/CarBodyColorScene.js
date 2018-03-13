/**
 * Created by zhengnan on 2017/5/15.
 */

import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    Dimensions,
} from 'react-native';

import BaseComponent from '../../component/BaseComponent';
import AllNavigationView from  '../../component/AllNavigationView';
import *as fontAndColor from  '../../constant/fontAndColor';
import Grid from '../../publish/component/Grid';
import PixelUtil from  '../../utils/PixelUtil';
let Pixel = new  PixelUtil();
const sceneWidth = Dimensions.get('window').width;

const background = require('../../../images/publish/background.png');
const grayColor = require('../../../images/publish/gray-color.png');
const multiColor = require('../../../images/publish/multi-color.png');
const doubleColor = require('../../../images/publish/double-color.png');
const colorSelect = require('../../../images/publish/color-select.png');


export default class CarBodyColorScene extends  BaseComponent{

    initFinish=()=>{

    };

    // 构造
    constructor(props) {
        super(props);
        // this.viewShell = [
        //     {
        //         title: '黑色',
        //         selected: false,
        //         fill: true,
        //         color: '#000000',
        //         img: '',
        //         index: 0
        //     },
        //     {
        //         title: '白色',
        //         selected: false,
        //         fill: true,
        //         color: '#FFFFFF',
        //         img: '',
        //         index: 1
        //     },
        //     {
        //         title: '银灰色',
        //         selected: false,
        //         fill: false,
        //         color: '',
        //         img: grayColor,
        //         index: 2
        //     },
        //     {
        //         title: '深灰色',
        //         selected: false,
        //         fill: true,
        //         color: '#a8a8a8',
        //         img: '',
        //         index: 3
        //     },
        //     {
        //         title: '绿色',
        //         selected: false,
        //         fill: true,
        //         color: '#79c65e',
        //         img: '',
        //         index: 4
        //     },
        //     {
        //         title: '红色',
        //         selected: false,
        //         fill: true,
        //         color: '#d22c23',
        //         img: '',
        //         index: 5
        //     },
        //     {
        //         title: '橙色',
        //         selected: false,
        //         fill: true,
        //         color: '#ffaa25',
        //         img: '',
        //         index: 6
        //     },
        //     {
        //         title: '黄色',
        //         selected: false,
        //         fill: true,
        //         color: '#ffcf12',
        //         img: '',
        //         index: 7
        //     },
        //     {
        //         title: '蓝色',
        //         selected: false,
        //         fill: true,
        //         color: '#0c99f9',
        //         img: '',
        //         index: 8
        //     },
        //     {
        //         title: '咖啡色',
        //         selected: false,
        //         fill: true,
        //         color: '#814505',
        //         img: '',
        //         index: 9
        //     },
        //     {
        //         title: '紫色',
        //         selected: false,
        //         fill: true,
        //         color: '#6c1d90',
        //         img: '',
        //         index: 10
        //     },
        //     {
        //         title: '香槟色',
        //         selected: false,
        //         fill: true,
        //         color: '#e1c8b4',
        //         img: '',
        //         index: 11
        //     },
        //     {
        //         title: '多彩色',
        //         selected: false,
        //         fill: false,
        //         color: '',
        //         img: multiColor,
        //         index: 12
        //     },
        //     {
        //         title: '其他',
        //         selected: false,
        //         fill: false,
        //         color: '',
        //         img: doubleColor,
        //         index: 13
        //     },
        //     {
        //         title: '',
        //         selected: '',
        //         fill: false,
        //         color: '',
        //         img: '',
        //         index: 14
        //     },
        //     {
        //         title: '',
        //         selected: '',
        //         fill: false,
        //         color: '',
        //         img: '',
        //         index: 15
        //     }
        //
        // ];

        // this.viewShell.map((data,index)=>{
        //     if(data.title == this.props.currentChecked)
        //     {
        //         data.selected = true;
        //
        //     }
        //
        // });

        this.viewShell = this.props.carBodyColorData;
        let nodeNumber = 4; // 节点数
        if(this.viewShell){
            let length = this.viewShell.length;
            if(length % nodeNumber!==0){
                let number =(length % nodeNumber);
                console.log('number:',number,'length',length,);
                for(let i=0;i<number;i++){
                    this.viewShell.push({
                        name:'',
                        value:''
                    });
                }
            }
        }
        this.viewShell.map((data,index)=>{
            data.index = index;
            if(data.name == this.props.currentChecked)
            {
                data.selected = true;

            }else {
                data.selected = false;
            }
            if(data.name == '多彩色'){
                data.fill = false;
                data.img = multiColor;
            }else if(data.name == '其他'){
                data.fill = false;
                data.img = doubleColor;
            }else {
                data.fill = true;
                data.img = '';
            }

        });

        let array = this.chunk(this.props.carBodyColorData,3);
        this.state = {
            carShell: this.viewShell,
        }
    }

    chunk =(arr, n) =>{
        let length = arr.length;
        return Array.from(Array(Math.ceil(arr.length / n)), (_, i) => arr.slice(i * n, (i * n) + n));
    }


    render(){
        return(
            <View style={styles.rootContainer}>
                <Image  style={{width:sceneWidth,paddingHorizontal:Pixel.getPixel(43),paddingTop:Pixel.getPixel(20)}} source={background}>
                    <View style={{flex:1}}>
                        <Grid
                            ref = {(grid)=>{this.interiorGrid = grid}}
                            style={styles.girdContainer}
                            renderItem={this._renderShell}
                            data={this.state.carShell}
                            itemsPerRow={4}
                        />
                    </View>
                </Image>
                <AllNavigationView title="车身颜色" backIconClick={this.backPage} />
            </View>
        )
    }

    _renderShell = (data, i) => {

        if(!data.name){
            return (
                <View key={data.index} style={styles.shellContainer}>
                    <View style={[styles.emptyContainer]}>

                    </View>
                </View>
            );
        }else if (data.selected === false)
        {
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
                            <View style={[styles.colorContainer,{backgroundColor:data.value}]}/>
                            <Text allowFontScaling={false}  style={styles.textLabel}>{data.name}</Text>
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
                            <Text allowFontScaling={false}  style={styles.textLabel}>{data.name}</Text>
                        </View>
                    </TouchableOpacity>

                );
            }
        } else if (data.selected === true)
        {
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
                        <Text allowFontScaling={false}  style={styles.textLabel}>{data.name}</Text>
                    </View>
                </TouchableOpacity>
            );
        }

    };
    _shellPress = (i) => {
        this.props.checkedCarBodyColorClick({
            title:this.viewShell[i].name,
            value:this.viewShell[i].value,
        });
        this.backPage();
    };

}

const styles = StyleSheet.create({
    rootContainer:{
        flex:1,
        backgroundColor:fontAndColor.COLORA3,
        paddingTop:Pixel.getTitlePixel(64),
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
        color: '#FFFFFF',
        backgroundColor:"rgba(0,0,0,0)"
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
});
