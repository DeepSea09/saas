/**
 * Created by zhengnan on 2017/5/12.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    TextInput,

} from 'react-native';

import *as fontAndColor from '../../constant/fontAndColor';
import PixelUtil from '../../utils/PixelUtil';

const Pixel = new PixelUtil();
const sceneWidth = Dimensions.get('window').width;

export class CellView extends Component {

    render() {
        const {cellData} =this.props;
        if(cellData.tailView){
            this.contentView = (<View style={[styles.cellType1]}>
                <View style={{flexDirection:'row'}}>
                    {
                        cellData.isShowTag ? <Text allowFontScaling={false}
                                                   style={{color:fontAndColor.COLORB2, fontSize:fontAndColor.LITTLEFONT28}}>*</Text>
                            : <Text allowFontScaling={false}
                                    style={{color:fontAndColor.COLORB2, fontSize:fontAndColor.LITTLEFONT28}}></Text>
                    }
                    <View >
                        <Text allowFontScaling={false} style={styles.cellTitle}>{cellData.title}</Text>
                        {
                            cellData.subTitle ? (<Text allowFontScaling={false}
                                                       style={[styles.cellSubTitle,this.props.subTitleSytle]}>{cellData.subTitle}</Text>) : (null)
                        }
                    </View>
                </View>
                {
                    cellData.tailView()
                }
            </View>)
        }else if(cellData.value.length>25){
            this.contentView = (<View style={[styles.cellType1]}>
                {
                    cellData.isShowTag &&<Text allowFontScaling={false}
                                               style={{color:fontAndColor.COLORB2, fontSize:fontAndColor.LITTLEFONT28}}>*</Text>

                }
                <View >
                    <Text allowFontScaling={false} style={styles.cellTitle}>{cellData.title}</Text>
                    {
                        cellData.subTitle ? (<Text allowFontScaling={false}
                                                   style={[styles.cellSubTitle,this.props.subTitleSytle,{marginTop:Pixel.getPixel(5)}]}>{cellData.subTitle}</Text>) : (null)
                    }
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text allowFontScaling={false} style={[styles.cellValue,{marginTop:Pixel.getPixel(5)}]}>{cellData.value}</Text>
                    </View>
                </View>
                {
                    cellData.isShowTail?( <Image style={{marginLeft:Pixel.getPixel(5)}}
                                                 source={require('../../../images/mainImage/celljiantou.png')}/>):(<View/>)

                }
            </View>)
        }else {
            this.contentView = (<View style={[styles.cellType1]}>
                <View style={{flexDirection:'row'}}>
                    {
                        cellData.isShowTag ? <Text allowFontScaling={false}
                                                   style={{color:fontAndColor.COLORB2, fontSize:fontAndColor.LITTLEFONT28}}>*</Text>
                            : <Text allowFontScaling={false}
                                    style={{color:fontAndColor.COLORB2, fontSize:fontAndColor.LITTLEFONT28}}></Text>
                    }
                    <View >
                        <Text allowFontScaling={false} style={styles.cellTitle}>{cellData.title}</Text>
                        {
                            cellData.subTitle ? (<Text allowFontScaling={false}
                                                       style={[styles.cellSubTitle,this.props.subTitleSytle]}>{cellData.subTitle}</Text>) : (null)
                        }
                    </View>
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Text allowFontScaling={false} style={styles.cellValue}>{cellData.value}</Text>
                    {
                        cellData.isShowTail &&
                        <Image style={{marginLeft:Pixel.getPixel(5)}}
                               source={require('../../../images/mainImage/celljiantou.png')}/>
                    }
                </View>
            </View>)
        }
        return (
            <View>
            {
                this.contentView
            }
            </View>
            )
    }
}

export class CellSelectView extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            currentChecked: this.props.currentTitle,

        };
    }

    setCurrentChecked = (text) => {

        this.setState({
            currentChecked: text,
        });
    }

    render() {
        const {cellData} =this.props;

        return (
            <View style={[styles.cellType2,this.props.itemStyle]}>
                <View style={{flexDirection:'row'}}>
                    {
                        cellData.isShowTag && <Text allowFontScaling={false}
                                                    style={{color:fontAndColor.COLORB2, fontSize:fontAndColor.LITTLEFONT28}}>*</Text>
                    }
                    <Text allowFontScaling={false} style={styles.cellTitle}>{cellData.title}</Text>
                </View>
                <View style={[{width:Pixel.getPixel(10),height:Pixel.getPixel(10)},this.props.middleStyle]}></View>
                <View
                    style={{flexDirection:'row',height:Pixel.getPixel(40),alignItems:'center',backgroundColor:'white'}}>
                    {
                        cellData.selectDict.data.map((data, index) => {
                            return (
                                <TouchableOpacity onPress={()=>
                                {
                                    if(this.state.currentChecked!=data.title){

                                        this.setCurrentChecked(data.title);
                                        this.props.cellSelectAction({title:data.title,value:data.value})
                                    }
                                }} activeOpacity={1} key={index}>
                                    <View
                                        style={[styles.checkedItemView,(this.state.currentChecked==data.title?{borderColor:fontAndColor.COLORB0}:{borderColor:fontAndColor.COLORA2})]}>
                                        <Text allowFontScaling={false}
                                              style={[styles.checkedItemText,(this.state.currentChecked==data.title?{color:fontAndColor.COLORB0}:{color:fontAndColor.COLORA2})] }>{data.title}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cellType1: {
        flexDirection: 'row',
        paddingHorizontal: Pixel.getPixel(15),
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: fontAndColor.COLORA4,
        paddingVertical: Pixel.getPixel(15),
        width: sceneWidth,

    },
    cellType2: {
        paddingHorizontal: Pixel.getPixel(15),
        backgroundColor: 'white',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: fontAndColor.COLORA4,
        paddingVertical: Pixel.getPixel(20),
        justifyContent: 'center',
        width: sceneWidth,
        flexDirection: 'column',
        height: Pixel.getPixel(90)

    },
    cellTitle: {
        color: fontAndColor.COLORA0,
        fontSize: fontAndColor.LITTLEFONT28,
    },
    cellSubTitle: {
        fontSize: Pixel.getFontPixel(fontAndColor.MARKFONT22),
        color: fontAndColor.COLORA1,
        marginTop: Pixel.getPixel(5),
        // backgroundColor:'red',
    },
    cellValue: {
        color: fontAndColor.COLORA2,
        fontSize: fontAndColor.LITTLEFONT28,
    },
    checkedItemView: {
        borderColor: fontAndColor.COLORA2,
        borderWidth: StyleSheet.hairlineWidth,
        marginRight: Pixel.getPixel(15),
        backgroundColor: 'white',
        height: Pixel.getPixel(20),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        width: Pixel.getPixel(85),
        height: Pixel.getPixel(32),
    },
    checkedItemText: {
        color: fontAndColor.COLORA2,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
    },
});