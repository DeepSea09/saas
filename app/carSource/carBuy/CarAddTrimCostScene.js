/**
 * Created by zhengnan on 2017/7/28.
 */

import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Text,
    TextInput,
    Dimensions,
    Image,
    KeyboardAvoidingView,
} from 'react-native';

import BaseComponent from '../../component/BaseComponent';
import AllNavigationView from  '../../component/AllNavigationView';
import {CellView, CellSelectView} from '../znComponent/CarPublishCell';
import *as fontAndColor from  '../../constant/fontAndColor';
import PixelUtil from  '../../utils/PixelUtil';
let Pixel = new  PixelUtil();
const sceneWidth = Dimensions.get('window').width;



export default class CarAddTrimCostScene extends BaseComponent{

    render(){
        return(
            <View style={styles.rootContaier}>
                <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={-Pixel.getPixel(200)}>
                    <ScrollView keyboardDismissMode={'on-drag'}>
                        {
                            this.state.titleData.map((data, index) => {
                                return (
                                    <View style={{marginTop:10,backgroundColor:'white',marginBottom:10}} key={index}>
                                        {
                                            data.map((rowData, subIndex) => {
                                                return ( rowData.selectDict ?
                                                        (
                                                                <CellSelectView
                                                                    currentTitle={rowData.selectDict.current}
                                                                    cellData={rowData}
                                                                    cellSelectAction={this.cellSelectAction}
                                                                    key={subIndex}
                                                                />
                                                            ) :
                                                        (
                                                                <CellView cellData={rowData} key={subIndex}/>
                                                        )
                                                )
                                            })
                                        }
                                    </View>
                                )
                            })
                        }
                        <View style={styles.footContainer}>
                            <TouchableOpacity onPress={this.footBtnClick}>
                                <View style={styles.footView}>
                                    <Text allowFontScaling={false}  style={styles.footText}>保存</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <AllNavigationView title="填写整备费明细" backIconClick={this.backPage}/>
            </View>
        )
    }

    cellSelectAction=(selectDict)=>{
        this.costObject['typeTitle'] = selectDict.title;
    }

    footBtnClick=()=>{

        if(!this.costObject.typeTitle){
            this.props.showToast('请选择整备费类型');
            return;
        }

        if(!this.costObject.content){
            this.props.showToast('输入整备项目内容');
            return;
        }

        if(parseFloat(this.costObject.price)<=0 || !this.costObject.price){
            this.props.showToast('整备费金额必须大于0');
            return;
        }

        if(this.props.alterCostAction){
            this.props.alterCostAction(this.costObject,this.props.index);
        }else {
            this.props.setCostAction(this.costObject);

        }
        this.backPage();
    }

    // 构造
    constructor(props) {
        super(props);
        this.costObject={};

        if(this.props.costObject)
        {
            this.costObject = this.props.costObject;
        }

        this.titleData1=[
            [
                {
                    title:'整备费类型',
                    isShowTag:true,
                    isShowTail:false,
                    selectDict:{current:this.costObject.typeTitle,data:[{title:'机械维修',value:1},{title:'钣金喷漆',value:2},{title:'美容清洗',value:3}]},
                },

            ],
            [
                {
                    title:'整备项目名称',
                    isShowTag:true,
                    tailView:()=>{
                        return(
                            <TextInput
                                style={[styles.textInput,{width:sceneWidth-Pixel.getPixel(130),height:Pixel.getPixel(60)}]}
                                placeholder='请输入'
                                maxLength={200}
                                onChangeText={(text)=>{
                                    this.costObject['content'] = text;
                                }}
                                defaultValue={this.costObject.content}
                                underlineColorAndroid='transparent'
                                placeholderTextColor={fontAndColor.COLORA4}
                                placheolderFontSize={Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}
                            />
                        )
                    }

                },
                {
                    title:'整备费金额',
                    isShowTag:true,
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <TextInput style={styles.textInput}
                                           ref={(ref)=>{this.priceInput = ref}}
                                           placeholder='请输入'
                                           keyboardType={'numeric'}
                                           defaultValue={ this.costObject.price ? String(this.costObject.price):''}
                                           underlineColorAndroid='transparent'
                                           onChangeText={(text)=>{

                                               {/*if(text.indexOf('.')==-1){*/}
                                                   {/*text = text.substring(0,text.length-1);*/}
                                               {/*}*/}
                                               let moneyStr = this.chkPrice(text);
                                               this.costObject['price'] = parseFloat(moneyStr);
                                               this.priceInput.setNativeProps({
                                                   text: moneyStr,
                                               });
                                           }}/>
                                <Text allowFontScaling={false}  style={styles.textInputTitle}>元</Text>
                            </View>)
                    }
                },


            ],

        ];

        this.state = {
            titleData:this.titleData1,
        };
    }


    /**
     * from @ZN
     *
     * 正则校验，保证小数点后只能有两位
     **/
    chkPrice = (obj) => {
        obj = obj.replace(/[^\d.]/g, "");
        //必须保证第一位为数字而不是.
        obj = obj.replace(/^\./g, "");
        //保证只有出现一个.而没有多个.
        obj = obj.replace(/\.{2,}/g, ".");
        //保证.只出现一次，而不能出现两次以上
        obj = obj.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        if ((/\.\d{3}/).test(obj)) {
            obj = obj.substring(0, obj.length - 1);
        }

        return obj;
    }


}

const styles = StyleSheet.create({
    rootContaier:{
        backgroundColor:fontAndColor.COLORA3,
        flex:1,
        paddingTop:Pixel.getTitlePixel(64),
    },
    scanImage: {
        height: Pixel.getPixel(18),
        width: Pixel.getPixel(18),
        marginLeft: Pixel.getPixel(8)
    },
    textInput: {
        height: Pixel.getPixel(30),
        borderColor: fontAndColor.COLORA0,
        width: Pixel.getPixel(160),
        textAlign: 'right',
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,

    },
    textInputTitle: {
        color: fontAndColor.COLORA0,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        marginLeft: Pixel.getPixel(5),
        textAlign: 'right',
    },
    footContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Pixel.getPixel(20),
    },
    footView: {
        backgroundColor: fontAndColor.COLORB0,
        height: Pixel.getPixel(44),
        justifyContent: 'center',
        alignItems: 'center',
        width: sceneWidth - Pixel.getPixel(30),
        borderRadius: Pixel.getPixel(3),
        marginBottom: Pixel.getPixel(20),

    },
    footText: {
        textAlign: 'center',
        color: 'white',
        fontSize: fontAndColor.BUTTONFONT30
    },
});
