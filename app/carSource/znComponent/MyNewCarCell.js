/**
 * Created by zhengnan on 2017/11/7.
 */


import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

var screenWidth = Dimensions.get('window').width;

import * as fontAndColor from '../../constant/fontAndColor';
import  PixelUtil from '../../utils/PixelUtil';
let     Pixel = new PixelUtil();

import  StringTransformUtil from  "../../utils/StringTransformUtil";
let stringTransform = new StringTransformUtil();

export default class MyCarCell extends Component {

    cellClick=(carData)=>{

        this.props.cellClick(carData);

    };

    footButtonClick=(typeStr,groupStr,carID)=>{

        this.props.footButtonClick(typeStr,this.props.type,carID);
    };


    getImage=(type,review_status)=>{

        switch(type) {
            case 1:
                if(review_status==2){
                    return(require('../../../images/carSourceImages/auditDefeat.png')); // 审核不过
                    break;

                }else {
                    return(require('../../../images/carSourceImages/audit.png')); // 审核中
                    break;
                }
            // case 3:
            //     return(require('../../../images/carSourceImages/soldOut.png')); // 已下架
            //     break;
            // case 4:
            //     return(require('../../../images/carSourceImages/accomplish.png')); //已成交
            //     break;
            default:
                break;
        }
    };

    render(){

        const {carCellData} = this.props;
        const carType = carCellData.status; // 1:审核中 2:已上架 3：已下架 4：已成交
        const review_status = carCellData.review_status;
        return(
            <TouchableOpacity onPress={()=>{this.cellClick(carCellData)}}>
                <View style={[styles.container,styles.lineBottom]} >
                    <View style={styles.cellHeadView}>
                        <Text allowFontScaling={false} style={styles.mainText}>{carCellData.serial_num}</Text>
                        <Text allowFontScaling={false} style={{color:fontAndColor.COLORA1,
                            fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT)}}>{stringTransform.dateReversal(carCellData.public_time+'000',true)}上架</Text>
                    </View>
                    <View style={styles.cellContentView}>
                        <View style={styles.imageView} >
                            <Image style={styles.image}
                                   source={carCellData.img?{uri:carCellData.img+'?x-oss-process=image/resize,w_'+320+',h_'+240}:require('../../../images/carSourceImages/car_null_img.png')}>
                                {
                                    (carCellData.long_aging==1 && this.props.type ==1) &&<Image style={{left:0, right:0, top:0, bottom:0,position: 'absolute'}} source={require('../../../images/carSourceImages/carLong.png')}/>
                                }
                            </Image>
                        </View>
                        <View style={[styles.textContainer]}>
                            <View style={{backgroundColor:'white',marginVertical:Pixel.getPixel(10), flex:1,justifyContent:'space-between'}}>
                                <View>
                                    <Text allowFontScaling={false}  style={styles.mainText}>{(carCellData.city_name!=""?('['+carCellData.city_name+']'):"")+(carCellData.model_name)}</Text>
                                    <TouchableOpacity style={[styles.cellSubContentView,this.props.carPriceEditClick && {backgroundColor:fontAndColor.COLORA3,paddingHorizontal:Pixel.getPixel(10)}]} activeOpacity={1}
                                                      onPress={()=>{this.props.carPriceEditClick ? this.props.carPriceEditClick(carCellData) : this.cellClick(carCellData)}}>
                                        <View>
                                            <Text allowFontScaling={false} numberOfLines={1}  style={[styles.subTitleText]}>{(carCellData.car_color?(carCellData.car_color.split("|")[0]+' | '):'')+  String(carCellData.stock?carCellData.stock:'0')+'辆'}</Text>
                                            {
                                                (carCellData.dealer_price>0) &&
                                                (<Text allowFontScaling={false}  style={[styles.carPriceText, {marginTop:Pixel.getPixel(5)}]}>{(stringTransform.carMoneyChange(carCellData.dealer_price))}万</Text>)
                                            }
                                        </View>
                                        {
                                            this.props.carPriceEditClick && (<Image style={{width:Pixel.getPixel(19),height:Pixel.getPixel(19)}} source={require('../../../images/carSourceImages/carPriceEdit.png')}/>)
                                        }
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <Image style={styles.tailImage} source={this.getImage(carType,review_status)}/>
                    </View>
                    <View style={styles.cellFootView}>
                        <View style={{justifyContent:'center'}}>
                            {
                                carType==2 && (
                                    <View style={{flexDirection:'row', alignItems:'center'}}>
                                        <Image style={{marginRight:Pixel.getPixel(8)}} source={require('../../../images/carSourceImages/carViewIcon.png')}/>
                                        <Text style={{color:fontAndColor.COLORA1, fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24),marginRight:Pixel.getFontPixel(15)}}>{carCellData.views}次</Text>
                                        <Image style={{marginRight:Pixel.getPixel(8)}} source={require('../../../images/carSourceImages/carDealIcon.png')}/>
                                        <Text style={{color:fontAndColor.COLORA1, fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24),marginRight:Pixel.getFontPixel(15)}}>{carCellData.sale_day}天</Text>
                                    </View>
                                )
                            }
                            {
                                carType ==4 && (
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        {
                                            carCellData.sale_time &&(
                                                <Text style={{color:fontAndColor.COLORA1, fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24),marginRight:Pixel.getFontPixel(15)}}>售出:{stringTransform.dateReversal(carCellData.sale_time+'000',true)}</Text>)
                                        }
                                        {
                                            carCellData.current_rate &&(
                                                <Text style={{color:fontAndColor.COLORA1, fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24),marginRight:Pixel.getFontPixel(15)}}>售价:{stringTransform.carMoneyChange(carCellData.current_rate)}万元</Text>
                                            )
                                        }
                                    </View>
                                )
                            }
                        </View>
                        {
                            <View style={{flexDirection:'row'}}>
                                {
                                    (carType==1&&carCellData.review_status==2) &&
                                    <TouchableOpacity onPress={()=>{this.footButtonClick('查看退回原因',this.props.type,carCellData)}}>
                                        <View style={[styles.cellFoot,{borderColor:fontAndColor.COLORB0}]}>
                                            <Text allowFontScaling={false}  style={[styles.cellFootText,{color:fontAndColor.COLORB0}]}> 查看退回原因 </Text>
                                        </View>
                                    </TouchableOpacity>
                                }
                                {/*<TouchableOpacity onPress={()=>{this.footButtonClick('编辑',this.props.type,carCellData)}}>*/}
                                {/*<View style={styles.cellFoot}>*/}
                                {/*<Text allowFontScaling={false}  style={styles.cellFootText}>  编辑  </Text>*/}
                                {/*</View>*/}
                                {/*</TouchableOpacity>*/}

                                {/*{*/}
                                {/*carType==2 &&*/}
                                {/*<TouchableOpacity onPress={()=>{this.footButtonClick('下架',this.props.type,carCellData)}}>*/}
                                {/*<View style={styles.cellFoot}>*/}
                                {/*<Text allowFontScaling={false}  style={styles.cellFootText}>  下架  </Text>*/}
                                {/*</View>*/}
                                {/*</TouchableOpacity>*/}
                                {/*}*/}
                                {/*{*/}
                                {/*((carType==1&&carCellData.review_status==1)||carType==3 ) &&*/}
                                {/*<TouchableOpacity onPress={()=>{this.footButtonClick('上架',this.props.type,carCellData)}}>*/}
                                {/*<View style={styles.cellFoot}>*/}
                                {/*<Text allowFontScaling={false}  style={styles.cellFootText}> 申请上架 </Text>*/}
                                {/*</View>*/}
                                {/*</TouchableOpacity>*/}
                                {/*}*/}

                                <TouchableOpacity onPress={()=>{this.footButtonClick('管理',this.props.type,carCellData)}}>
                                    <View style={styles.cellFoot}>
                                        <Text allowFontScaling={false}  style={styles.cellFootText}>  管理  </Text>
                                    </View>
                                </TouchableOpacity>
                                {/*{*/}
                                    {/*(carType == 4 || carType == 3 ||  (carType==1&&carCellData.review_status==2))&&*/}
                                    {/*<TouchableOpacity onPress={()=>{this.footButtonClick('删除',this.props.type,carCellData)}}>*/}
                                        {/*<View style={styles.cellFoot}>*/}
                                            {/*<Text allowFontScaling={false}  style={styles.cellFootText}>  删除  </Text>*/}
                                        {/*</View>*/}
                                    {/*</TouchableOpacity>*/}

                                {/*}*/}
                                {/*{*/}
                                    {/*(carType == 1) &&*/}
                                    {/*<TouchableOpacity onPress={()=>{this.footButtonClick('编辑',this.props.type,carCellData)}}>*/}
                                        {/*<View style={styles.cellFoot}>*/}
                                            {/*<Text allowFontScaling={false}  style={styles.cellFootText}>  编辑  </Text>*/}
                                        {/*</View>*/}
                                    {/*</TouchableOpacity>*/}

                                {/*}*/}
                            </View>
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    }



}
const styles = StyleSheet.create({

    container:{
        flex:1,
        backgroundColor:'white',
        paddingHorizontal:Pixel.getPixel(15),

    },

    cellContentView:{
        height:Pixel.getPixel(110),
        flexDirection:'row',
        borderBottomWidth:Pixel.getPixel(1),
        borderColor:fontAndColor.COLORA3,
        overflow:'hidden',
        backgroundColor:'white',
    },
    cellSubContentView:{
        backgroundColor:'white',
        marginTop:Pixel.getPixel(5),
        paddingVertical:Pixel.getPixel(3),
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    cellHeadView:{
        height:Pixel.getPixel(44),
        flexDirection:'row',
        borderBottomWidth:Pixel.getPixel(1),
        borderColor:fontAndColor.COLORA3,
        alignItems:'center',
        justifyContent:'space-between',
    },
    cellFootView:{

        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'white',
        paddingVertical:Pixel.getPixel(10)

    },
    cellFoot:{
        paddingHorizontal:Pixel.getPixel(10),
        paddingVertical:Pixel.getPixel(5),
        borderColor:fontAndColor.COLORB0,
        borderWidth:StyleSheet.hairlineWidth,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:2,
        overflow:'hidden',
        marginLeft:Pixel.getPixel(15)
    },
    cellFootText:{

        color: fontAndColor.COLORB0,
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT) ,
    },
    lineBottom:{

        borderBottomWidth:Pixel.getPixel(10),
        borderColor:fontAndColor.COLORA3,

    },
    imageView:{

        width:Pixel.getPixel(134),
        justifyContent:'center',
        backgroundColor:'white'

    },
    image:{

        width:Pixel.getPixel(120),
        height:Pixel.getPixel(80),
        resizeMode: 'stretch',

    },
    tailImage:{

        bottom:Pixel.getPixel(5),
        right:0,
        position:'absolute',
    },
    textContainer:{
        flex:1,
        // backgroundColor:'#FF0067',

    },

    mainText:{

        color:fontAndColor.COLORA0,
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT),
        // backgroundColor:'red',

    },

    subTitleText:{

        color:fontAndColor.COLORA1,
        fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT) ,
        marginTop:Pixel.getPixel(5),
        // backgroundColor:'red',

    },
    carPriceText:{
        color:fontAndColor.COLORB2,
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
    }

});