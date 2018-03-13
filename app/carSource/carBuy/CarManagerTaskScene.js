/**
 * Created by zhengnan on 2017/7/28.
 */
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
    Platform,
} from 'react-native';

import BaseComponent from '../../component/BaseComponent';
import AllNavigationView from  '../../component/AllNavigationView';
import {CellView, CellSelectView} from '../znComponent/CarPublishCell';
import *as fontAndColor from  '../../constant/fontAndColor';
import PixelUtil from  '../../utils/PixelUtil';
import * as AppUrls from "../../constant/appUrls";
import  {request}   from '../../utils/RequestUtil';

import CarInitialTaskUpImagScene from "./CarInitialTaskUpImagScene";
let Pixel = new  PixelUtil();
const sceneWidth = Dimensions.get('window').width;
const IS_ANDROID = Platform.OS === 'android';


export default class CarManagerTaskScene extends BaseComponent{

    render(){
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (
                <View style={{flex: 1, backgroundColor: 'white'}}>
                    {this.loadView()}
                    <AllNavigationView title={this.props.type==1?"录入车辆信息":'查看价格信息'} backIconClick={this.backPage}/>
                </View>);
        }
        return(
            <View style={styles.rootContaier}>
                {
                    IS_ANDROID?(this.loadScrollView()):(
                            <KeyboardAvoidingView behavior={'position'}>
                                {
                                    this.loadScrollView()
                                }
                            </KeyboardAvoidingView>
                        )
                }
                <AllNavigationView title={this.props.type==1?"录入车辆信息":'查看价格信息'} backIconClick={this.backPage}/>
            </View>
        )
    }
    loadScrollView=()=>{
       return(
           <ScrollView keyboardDismissMode={IS_ANDROID?'none':'on-drag'}>
               {
                   this.state.titleData.map((data, index) => {
                       return (
                           <View style={{marginTop:10,backgroundColor:'white',marginBottom:10}} key={index}>
                               {
                                   data.map((rowData, subIndex) => {
                                       return ( rowData.selectDict ?
                                               (
                                                   <TouchableOpacity
                                                       key={subIndex}
                                                       activeOpacity={1}
                                                       onPress={()=>this.cellCilck(rowData.title)}>
                                                       <CellSelectView
                                                           currentTitle={rowData.selectDict.current}
                                                           cellData={rowData}
                                                           cellSelectAction={this.cellSelectAction}/>
                                                   </TouchableOpacity>) :
                                               (
                                                   <TouchableOpacity key={subIndex}
                                                                     activeOpacity={1}
                                                                     onPress={()=>this.cellCilck(rowData.title)}>
                                                       <CellView cellData={rowData}/>
                                                   </TouchableOpacity>)
                                       )
                                   })
                               }
                           </View>
                       )
                   })
               }
               {
                   this.props.type == 1 && (
                       <View style={styles.footContainer}>
                           <TouchableOpacity onPress={this.footBtnClick}>
                               <View style={styles.footView}>
                                   <Text allowFontScaling={false} style={styles.footText}>提交</Text>
                               </View>
                           </TouchableOpacity>
                       </View>
                   )
               }
           </ScrollView>
       )
    }

    initFinish=()=>{
        this.loadData();
    }

    /**
     * 加载数据
     */
    loadData=()=>{

        this.setState({
            renderPlaceholderOnly:'loading'
        });
        request(AppUrls.CAR_CHESHANG_TASKINFO,'post',{
            type:this.props.type,
            roleName:this.props.roleName,
            taskid:this.props.taskid,
        }).then((response) => {

            console.log(response.mjson);
            this.setData(response.mjson.data);
        }, (error) => {

        });
    }

    setData=(data)=>{

        this.carData = data;
        this.titleData1[0][0].value = data.vin;
        this.titleData1[0][1].value = data.carName;

        if(this.props.type ==1){
            this.titleData1[1][1].tailView=()=> {
                return (
                    <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <Text style={{color:fontAndColor.COLORA0, fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),textAlign:'right'}}>{String(data.taskInfo.zbMoney)}</Text>
                        <Text allowFontScaling={false} style={styles.textInputTitle}>元</Text>
                    </View>)
            };

        }

        if(this.props.type==2){
            this.titleData1[1][0].tailView=()=> {
                return (
                    <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <Text style={{color:fontAndColor.COLORA0, fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),textAlign:'right'}}>{String(data.taskInfo.managerInfo.buyprice.toFixed(2))}</Text>
                        <Text allowFontScaling={false} style={styles.textInputTitle}>万元</Text>
                    </View>)
            };

            let price =0;
            if(data.taskInfo.mlist){
                if(data.taskInfo.mlist.length>0){
                    for(let item of data.taskInfo.mlist){
                        price+=item.amount;
                    }
                }
            }

            this.titleData1[1][1].tailView=()=> {
                return (
                    <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <Text style={{color:fontAndColor.COLORA0, fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),textAlign:'right'}}>{String(price.toFixed(2))}</Text>
                        <Text allowFontScaling={false} style={styles.textInputTitle}>元</Text>
                    </View>)
            }; this.titleData1[1][2].tailView=()=> {
                return (
                    <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <Text style={{color:fontAndColor.COLORA0, fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),textAlign:'right'}}>{String(data.taskInfo.managerInfo.selfprice.toFixed(2))}</Text>
                        <Text allowFontScaling={false} style={styles.textInputTitle}>万元</Text>
                    </View>)
            };
            this.titleData1[1][3].tailView=()=> {
                return (
                    <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <Text style={{color:fontAndColor.COLORA0, fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),textAlign:'right'}}>{String(data.taskInfo.managerInfo.overprice.toFixed(2))}</Text>
                        <Text allowFontScaling={false} style={styles.textInputTitle}>万元</Text>
                    </View>)
            };
            this.titleData1[2][0].tailView=()=>{
                return(
                    <TextInput
                        style={[styles.textInput,{width:sceneWidth-Pixel.getPixel(130),height:Pixel.getPixel(60),color:fontAndColor.COLORA2}]}
                        defaultValue={data.remark?data.remark:'无'}
                        editable={false}
                        underlineColorAndroid='transparent'
                        placeholderTextColor={fontAndColor.COLORA4}
                        placheolderFontSize={Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}
                    />
                )
            };

            // this.titleData1[1].splice(1,1);
        }

        this.setState({
            renderPlaceholderOnly:'success',
            titleData:this.titleData1,
        });

    }



    cellSelectAction=(selectDict)=>{
        alert(selectDict.title,selectDict.value);
    }


    footBtnClick=()=>{

        if(parseFloat(this.overprice)>parseFloat(this.selfprice))
        {
            this.props.showToast('卖车底价不能大于标价');
            return;

        }

        if(parseFloat(this.buyprice)<=0 || !this.buyprice)
        {
            this.props.showToast('请输入正确的收车价');
            return;
        }
        if(parseFloat(this.selfprice)<=0 ||!this.selfprice)
        {
            this.props.showToast('请输入正确的卖车标价');
            return;
        }
        if(parseFloat(this.overprice)<=0 || !this.overprice)
        {
            this.props.showToast('请输入正确的卖车底价');
            return;
        }

        this.props.showModal(true);
        request(AppUrls.CAR_CHESHANG_MANAGER_EDIT_TASK,'post',{
            buyprice:this.buyprice,
            overprice:this.overprice,
            selfprice:this.selfprice,
            remark:this.remark,
            tid:this.props.taskid,
        }).then((response) => {

            this.props.showModal(false);
            this.backPage();
            this.props.reloadTaskData && this.props.reloadTaskData();

        }, (error) => {
            this.props.showToast(error.mjson.msg);
        });
    }

    // 构造
    constructor(props) {
        super(props);

        this.remark='';
        this.titleData1=[
            [
                {
                    title:'车架号',
                    isShowTag:false,
                    value:"",
                    isShowTail:false,


                },
                {
                    title:'车型',
                    isShowTag:false,
                    value:' ',
                    isShowTail:false,
                },

            ],
            [
                {
                    title: '收车价格',
                    isShowTag:this.props.type==1?true:false,
                    tailView: () => {
                        return (
                            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <TextInput style={styles.textInput}
                                           ref={(ref) => {
                                               this.buyPrice = ref
                                           }}
                                           placeholder='请输入'
                                           keyboardType={'numeric'}
                                           maxLength={7}
                                           underlineColorAndroid='transparent'
                                           onChangeText={(text) => {

                                               if (text.length > 4 && text.indexOf('.') == -1) {
                                                   text = text.substring(0, text.length - 1);
                                               }
                                               let moneyStr = this.chkPrice(text);
                                               this.buyprice = moneyStr;
                                               this.buyPrice.setNativeProps({
                                                   text: moneyStr,
                                               });
                                               if(this.normPrice){
                                                   let normNumber = String((parseFloat(moneyStr) * 1.1).toFixed(2));
                                                   this.selfprice = normNumber;
                                                   this.normPrice.setNativeProps({
                                                       text: text ? normNumber:'',
                                                   });
                                               }
                                               if(this.dealPrice){
                                                   let dealNumber = String((parseFloat(moneyStr) * 1.06).toFixed(2)) ;
                                                   this.overprice = dealNumber;
                                                   this.dealPrice.setNativeProps({
                                                       text: text? dealNumber:'',
                                                   });
                                               }


                                           }}/>
                                <Text allowFontScaling={false} style={styles.textInputTitle}>万元</Text>
                            </View>)
                    }
                },{
                    title: '整备价格',
                    isShowTag: false,
                    isShowTail: true,
                },{
                    title: '卖车标价',
                    isShowTag:this.props.type==1?true:false,
                    tailView: () => {
                        return (
                            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <TextInput style={styles.textInput}
                                           ref={(ref) => {
                                               this.normPrice = ref
                                           }}
                                           placeholder='请输入'
                                           keyboardType={'numeric'}
                                           maxLength={7}
                                           underlineColorAndroid='transparent'
                                           onChangeText={(text) => {

                                               if (text.length > 4 && text.indexOf('.') == -1) {
                                                   text = text.substring(0, text.length - 1);
                                               }
                                               let moneyStr = this.chkPrice(text);
                                               this.selfprice = moneyStr;
                                               this.normPrice.setNativeProps({
                                                   text: moneyStr,
                                               });
                                           }}/>
                                <Text allowFontScaling={false} style={styles.textInputTitle}>万元</Text>
                            </View>)
                    }
                },{
                    title: '卖车低价',
                    isShowTag:this.props.type==1?true:false,
                    tailView: () => {
                        return (
                            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <TextInput style={styles.textInput}
                                           ref={(ref) => {
                                               this.dealPrice = ref
                                           }}
                                           placeholder='请输入'
                                           keyboardType={'numeric'}
                                           maxLength={7}
                                           underlineColorAndroid='transparent'
                                           onChangeText={(text) => {

                                               if (text.length > 4 && text.indexOf('.') == -1) {
                                                   text = text.substring(0, text.length - 1);
                                               }
                                               let moneyStr = this.chkPrice(text);
                                               this.overprice = moneyStr;
                                               this.dealPrice.setNativeProps({
                                                   text: moneyStr,
                                               });
                                           }}/>
                                <Text allowFontScaling={false} style={styles.textInputTitle}>万元</Text>
                            </View>)
                    }
                }
            ],
            [
                {
                    title:'备注',
                    isShowTag:false,
                    tailView:()=>{
                        return(
                            <TextInput
                                style={[styles.textInput,{width:sceneWidth-Pixel.getPixel(130),height:Pixel.getPixel(60)}]}
                                placeholder='请填写'
                                maxLength={200}
                                onChangeText={(text)=>{this.remark = text}}
                                underlineColorAndroid='transparent'
                                placeholderTextColor={fontAndColor.COLORA4}
                                placheolderFontSize={Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}
                            />
                        )
                    }
                },
            ]

        ];
        this.state = {
            titleData:this.titleData1,
            renderPlaceholderOnly:'loading'
        };
    }


    /**
     *  form @ZN
     * @param title
     * 点击对应标题
     */
    cellCilck=(title)=>{

    }


    /**
     * 开始加载
     * @private
     */
    _showLoading = () => {
        this.props.showModal(true);
    };

    /**
     * 关闭加载
     * @private
     */
    _closeLoading = () => {
        this.props.showModal(false);
    };

    /**
     * from @zhaojian
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
