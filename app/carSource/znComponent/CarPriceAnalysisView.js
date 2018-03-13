/**
 * Created by zhengnan on 2017/5/22.
 */

import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    ScrollView,
} from 'react-native';

import *as fontAndColor from '../../constant/fontAndColor';
import PixelUtil from '../../utils/PixelUtil';
let Pixel = new  PixelUtil();
let sceneWidth = Dimensions.get('window').width;


export default class CarPriceAnalysisView extends Component{

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
       this.data = [];
       if(this.props.data.length>4){

           for (let i=0;i<5;i++){
               this.data.push(this.props.data[i]);
           }
       }else {
           this.data = this.props.data;
       }
       // this.columnarWidth = (sceneWidth - Pixel.getPixel(40)-(5*this.data.length)) / this.data.length;
       this.firstData = this.data[0].eval_price;
      }
    render(){
        return(
            <View style={styles.rootContainer}>
                <View style={styles.headView}>
                    <Text allowFontScaling={false}  style={styles.headTitle}>残值分析（万）</Text>
                </View>
                <View style={{backgroundColor:'white', flex:1,height:Pixel.getPixel(230)}}>
                    <View style={styles.columnarContainer}>
                        {
                           this.data.map((data,index)=>{
                                return(
                                    <ColumnarView height={200*(data.eval_price/this.firstData)}  key={index} title={data.eval_price}/>
                                )
                            })
                        }
                    </View>
                    <View style={styles.dateView}>
                        {
                            this.data.map((data,index)=>{
                                return(
                                    <Text allowFontScaling={false}  style={styles.dateText} key={index}>{data.trend_date}</Text>
                                )
                            })
                        }
                    </View>
                </View>
            </View>
        )
    }

}

class ColumnarView extends  Component{
    render(){
        return(
            <View>
                <Text allowFontScaling={false}  style={styles.priceText}>{this.props.title}</Text>
                <View style={[styles.columnarView,{height:Pixel.getPixel(this.props.height)-Pixel.getPixel(20),width:Pixel.getPixel(this.props.width)}]} />
            </View>
        )
    }
}

const styles=StyleSheet.create({
    rootContainer:{
        flex:1,
        paddingHorizontal:Pixel.getPixel(15),
        backgroundColor:'white',
        marginBottom:Pixel.getPixel(10)
    },
    headView:{
        paddingVertical:Pixel.getFontPixel(10),
        justifyContent:'center',
        borderBottomColor:fontAndColor.COLORA4,
        borderBottomWidth:Pixel.getPixel(1),
        marginBottom:Pixel.getPixel(10),
    },
    headTitle:{
        color:fontAndColor.COLORA0,
        fontSize:Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
    },
    columnarContainer:{
        backgroundColor:'white',
        width:sceneWidth-Pixel.getPixel(30),
        height:Pixel.getPixel(200),
        borderBottomWidth:Pixel.getPixel(1),
        borderColor:fontAndColor.COLORB0,
        flexDirection:'row',
        alignItems:'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal:Pixel.getPixel(10),
    },
    columnarView:{
        width:Pixel.getPixel(44),
        backgroundColor:fontAndColor.COLORB0,
        // borderLeftWidth:Pixel.getPixel(1),
        // borderLeftColor:fontAndColor.COLORB0,
        // borderRightWidth:Pixel.getPixel(1),
        // borderRightColor:fontAndColor.COLORB0,
        // borderTopWidth:Pixel.getPixel(1),
        // borderTopColor:fontAndColor.COLORB0,
    },
    priceText:{
        textAlign:'center',
        color:fontAndColor.COLORA0,
        fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
        height:Pixel.getPixel(20)
    },
    dateView:{
        flexDirection:'row',
        alignItems:'flex-end',
        justifyContent: 'space-between',
        marginTop:Pixel.getPixel(6),
        paddingHorizontal:Pixel.getPixel(5),
    },
    dateText:{
        color:fontAndColor.COLORA1,
        fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
        textAlign:'center',
        width:Pixel.getPixel(50),
        backgroundColor:'white'
    }

});