/**
 * Created by zhengnan on 2017/7/28.
 */

import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,

} from 'react-native';

import *as fontAndColor from  '../../../constant/fontAndColor';
import PixelUtil from  '../../../utils/PixelUtil';
let Pixel = new  PixelUtil();
const sceneWidth = Dimensions.get('window').width;

export default class CarTrimCostView extends Component{

    render(){

        let costObject = this.state.costObject;
        return(
            <View style={styles.rootView}>
                <View style={styles.titleView}>
                    <Text style={styles.titleText}>整备费用明细</Text>
                    <View style={styles.titleFootView}>
                        <Text style={[styles.titleText,{textAlign:'center'}]}>合计: {String(costObject.sumNumber.toFixed(2))} 元</Text>
                        {
                            this.props.addClick && (
                                <TouchableOpacity onPress={this.props.addClick}>
                                    <Image style={styles.icon} resizeMethod={'auto'} source={require('../../../../images/carSourceImages/costAdd.png')}/>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </View>
                {
                    costObject.array.map((data,index)=>{
                        return(
                            <TouchableOpacity activeOpacity={1} onPress={()=>{this.props.alterClilk && this.props.alterClilk(data,index)}} key={index}>
                            <View style={styles.itemView} >
                                <Text numberOfLines={2} style={styles.itemText}>【{data.typeTitle}】 {data.content}</Text>
                                <View style={styles.titleFootView}>
                                    <Text style={{color:fontAndColor.COLORA0,
                                        fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24),textAlign:'right'}}>{String(data.price.toFixed(2))}元</Text>
                                    {
                                        this.props.moverClick && (
                                            <TouchableOpacity onPress={()=>{this.props.moverClick(data,index)}}>
                                                <Image style={styles.icon} resizeMethod={'auto'} source={require('../../../../images/carSourceImages/costMover.png')}/>
                                            </TouchableOpacity>
                                        )
                                    }
                                </View>
                            </View>
                            </TouchableOpacity>
                        )
                    })

                }
            </View>
        )
    }

    // 构造
      constructor(props) {
        super(props);

        this.state = {
            costObject:this.props.costObject
        };
      }

    setCostObject=(costObject)=>{
        this.setState({
            costObject:costObject
        });
    }
}

const styles = StyleSheet.create({
   rootView:{
       flex:1,
       paddingHorizontal:Pixel.getPixel(15),
       backgroundColor:'white',
       marginVertical:Pixel.getPixel(10),
   },
    titleView:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingVertical:Pixel.getFontPixel(10),
    },
    titleText:{
        color:fontAndColor.COLORA0,
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
    },
    titleFootView:{
        flexDirection:'row',
        alignItems:'center',
    },
    icon:{
        height:Pixel.getPixel(25),
        width:Pixel.getPixel(25),
        marginLeft:Pixel.getPixel(13),
    },
    itemView:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingVertical:Pixel.getFontPixel(15),
        borderTopColor:fontAndColor.COLORA3,
        borderTopWidth:Pixel.getPixel(1),
    },
    itemText:{
        width:sceneWidth*0.6,
        color:fontAndColor.COLORA0,
        fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
    }

});