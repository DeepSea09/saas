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
import CarTrimCostView from './View/CarTrimCostView';
import *as fontAndColor from  '../../constant/fontAndColor';
import PixelUtil from  '../../utils/PixelUtil';
import CarBrandSelectScene from "../CarBrandSelectScene";
import CarlicenseTagScene from "../carPublish/CarlicenseTagScene";
import CarInitialTaskUpImagScene from "./CarInitialTaskUpImagScene";
import CarAddTrimCostScene from "./CarAddTrimCostScene";
import * as AppUrls from "../../constant/appUrls";
import  {request}   from '../../utils/RequestUtil';
import CarPublishFirstScene from "../carPublish/CarPublishFirstScene";
let Pixel = new  PixelUtil();
const sceneWidth = Dimensions.get('window').width;



export default class CarOperationScene extends BaseComponent{

    render(){
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (
                <View style={{flex: 1, backgroundColor: 'white'}}>
                    {this.loadView()}
                    <AllNavigationView title="核实信息" backIconClick={this.backPage}/>
                </View>);
        }
        return(
            <View style={styles.rootContaier}>
                <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={-Pixel.getPixel(200)}>
                    <ScrollView keyboardDismissMode={'on-drag'}>
                        {
                            this.state.titleData.map((data, index) => {
                                return (
                                    <View style={{marginTop:10,backgroundColor:'white',marginBottom:10}} key={index}>
                                        <View style={{paddingLeft:Pixel.getPixel(15),paddingVertical:Pixel.getPixel(10),
                                            flexDirection:'row',borderBottomColor:fontAndColor.COLORA3,borderBottomWidth:Pixel.getPixel(0.5),alignItems:'center'
                                        }}>
                                            <View style={{width:Pixel.getPixel(3),height:Pixel.getPixel(14),backgroundColor:fontAndColor.COLORB0,marginRight:Pixel.getPixel(5)}}/>
                                            <Text style={{color:fontAndColor.COLORA0, fontSize:Pixel.getFontPixel(fontAndColor.BUTTONFONT30),fontWeight: 'bold'}}>{index==0?'手续信息':(index==1?'整备信息':'价格信息')}</Text>
                                        </View>
                                        {
                                            data.map((rowData, subIndex) => {
                                                return (
                                                    <TouchableOpacity key={subIndex}
                                                                      activeOpacity={1}
                                                                      onPress={()=>this.cellCilck(rowData.title)}>
                                                        <CellView cellData={rowData}/>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                        {
                                            index==1&&(
                                                <View>
                                                    <CarTrimCostView ref={(ref)=>{this.CarTrimCostView = ref}}
                                                                     costObject={this.costObject}
                                                                     addClick={this.props.type!==2 && this.addClick}
                                                                     moverClick={this.props.type!==2&& this.moverCostAction}
                                                                     alterClilk={this.props.type!==2 && this.alterClilk}/>
                                                    <View style={{flexDirection:'row',backgroundColor:'white',paddingHorizontal:Pixel.getPixel(15),paddingVertical:Pixel.getPixel(10),
                                                        alignItems:'center',justifyContent:'space-between',borderTopColor:fontAndColor.COLORA3,borderTopWidth:Pixel.getPixel(0.5)
                                                    }}>
                                                        <Text style={{color:fontAndColor.COLORA0, fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}}>备注</Text>
                                                        <TextInput
                                                            style={[styles.textInput, {
                                                                width: sceneWidth - Pixel.getPixel(130),
                                                                height: Pixel.getPixel(60),
                                                                color:fontAndColor.COLORA2
                                                            }]}
                                                            defaultValue={this.carData.taskInfo.managerzby.remark?this.carData.taskInfo.managerzby.remark:'无'}
                                                            editable={false}
                                                            underlineColorAndroid='transparent'
                                                            placeholderTextColor={fontAndColor.COLORA4}
                                                            placheolderFontSize={Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}
                                                        />
                                                    </View>
                                                </View>
                                            )
                                        }
                                    </View>
                                )
                            })
                        }
                        {
                            this.props.type==1 && (
                                <View style={styles.footContainer}>
                                    <TouchableOpacity onPress={this.footBtnClick}>
                                        <View style={styles.footView}>
                                            <Text allowFontScaling={false}  style={styles.footText}>提交后发车</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        }

                    </ScrollView>
                </KeyboardAvoidingView>
                <AllNavigationView title="核实信息" backIconClick={this.backPage}/>
            </View>
        )
    }

    initFinish=()=>{

        this.loadData();
    }

    /**
     * 加载数据
     */
    loadData=()=>{

        request(AppUrls.CAR_CHESHANG_TASKINFO,'post',{
            type:this.props.type,
            roleName:this.props.roleName,
            taskid:this.props.taskid,
        }).then((response) => {

            console.log(response.mjson);
            this.setData(response.mjson.data);
            // this.setState({
            //     renderPlaceholderOnly:'success',
            // });
        }, (error) => {

        });
    }

    setData=(data)=>{

        this.carData = data;
        this.carParams={
            vin:data.vin,
            carName:data.carName,
            managerInfoList:data.taskInfo.mList,
            lastCarNum:data.lastCarNum,
            infoName:data.taskInfo.managersxy.infoName,
            infoMobile:data.taskInfo.managersxy.infoMobile,
            infoSource:data.taskInfo.managersxy.infoSource,
            selfprice:data.taskInfo.selfprice,
            selfName:data.taskInfo.managersxy.selfName,
            selfMobile:data.taskInfo.managersxy.selfMobile,
            keysNum:parseFloat(data.taskInfo.managersxy.keysNum),
            zbyid:data.taskInfo.managerzby.id,
            sxyid:data.id,
            id:data.id,
            zbMoney:data.taskInfo.managerzby.zbMoney,
            carNum:data.carNum,
            overprice:data.taskInfo.overprice,
        };

        this.titleData1[0][0].value = data.vin;
        this.titleData1[0][1].value = data.carName;
        this.titleData1[0][2].value = data.taskInfo.managersxy.infoName;
        this.titleData1[0][3].value = data.taskInfo.managersxy.infoMobile;

        let infoSourceStr = '';
        switch(data.taskInfo.managersxy.infoSource){
            case 1:{
                infoSourceStr='本平台';
                break;
            }
            case 2:{
                infoSourceStr='其他网络平台';
                break;
            }
            case 3:{
                infoSourceStr='朋友圈';
                break;
            }
            case 4:{
                infoSourceStr='信息员介绍';
                break;
            }
            case 5:{
                infoSourceStr='友商合车';
                break;
            }
            case 6:{
                infoSourceStr='拍卖';
                break;
            }
            case 7:{
                infoSourceStr='自到店';
                break;
            }
            case 8:{
                infoSourceStr='客户转介绍';
                break;
            }
            case 9:{
                infoSourceStr='置换';
                break;
            }
        }
        this.titleData1[0][4].value = infoSourceStr;
        this.titleData1[0][5].value = data.carNum;
        this.titleData1[0][6].tailView=() => {
            return (
                <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                    <TextInput style={styles.textInput}
                               placeholder='请输入'
                               keyboardType={'numeric'}
                               editable={this.props.type == 1?true:false}
                               maxLength={11}
                               defaultValue={String(data.taskInfo.managersxy.keysNum)}
                               underlineColorAndroid='transparent'
                               onChangeText={(text)=>{
                                    this.carParams.keysNum = parseFloat(text);
                               }}/>
                    <Text allowFontScaling={false} style={styles.textInputTitle}>把</Text>
                </View>)
        };
        this.titleData1[0][7].tailView=() => {
            return (
                <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                    <TextInput style={styles.textInput}
                               placeholder='请输入'
                               maxLength={11}
                               editable={this.props.type == 1?true:false}
                               defaultValue={data.taskInfo.managersxy.selfName}
                               underlineColorAndroid='transparent'
                               onChangeText={(text)=>{
                                    this.carParams.selfName = text;
                               }}/>

                </View>)
        };
        this.titleData1[0][8].tailView=() => {
            return (
                <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                    <TextInput style={styles.textInput}
                               placeholder='请输入'
                               maxLength={11}
                               editable={this.props.type == 1?true:false}
                               defaultValue={data.taskInfo.managersxy.selfMobile}
                               underlineColorAndroid='transparent'
                               onChangeText={(text)=>{
                                    this.carParams.selfMobile = text;
                               }}/>
                </View>)
        };
        this.titleData1[0][9].tailView = () => {
            return (
                <TextInput
                    style={[styles.textInput, {
                        width: sceneWidth - Pixel.getPixel(130),
                        height: Pixel.getPixel(60),
                        color:fontAndColor.COLORA2
                    }]}
                    defaultValue={data.taskInfo.managersxy.remark?data.taskInfo.managersxy.remark:'无'}
                    editable={false}
                    underlineColorAndroid='transparent'
                    placeholderTextColor={fontAndColor.COLORA4}
                    placheolderFontSize={Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}
                />
            )
        }

        this.titleData1[1][0].value = data.lastCarNum;
        this.costObject.sumNumber = parseFloat(data.taskInfo.managerzby.zbMoney);
        for(let item of data.taskInfo.mList)
        {
            this.costObject.array.push({
                price:item.amount,
                content:item.detail,
                typeTitle:item.classification,
            });
        }

        this.titleData1[2][0].value = data.taskInfo.selfprice;
        this.titleData1[2][1].value = data.taskInfo.overprice;
        this.titleData1[2][2].tailView = () => {
            return (
                <TextInput
                    style={[styles.textInput, {
                        width: sceneWidth - Pixel.getPixel(130),
                        height: Pixel.getPixel(60),
                        color:fontAndColor.COLORA2
                    }]}
                    defaultValue={data.remark?  data.remark:'无'}
                    editable={false}
                    underlineColorAndroid='transparent'
                    placeholderTextColor={fontAndColor.COLORA4}
                    placheolderFontSize={Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}
                />
            )
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

        this.props.showModal(true);
        let minfos = [];
        for(let item of this.costObject.array){
            minfos.push({id:0,zbyId:this.carParams.zbyid,amount:item.price,detail:item.content,classification:item.typeTitle});
        }
        this.carParams.zbMoney = this.costObject.sumNumber;
        this.carParams.managerInfoList = JSON.stringify(minfos);
        request(AppUrls.CAR_CHESHANG_YYZY_EDIT_TASK,'post',this.carParams).then((response) => {

            console.log(response.mjson);
            this.props.showModal(false);
            this.pushCarPublishScene();
            this.props.reloadTaskData();

        }, (error) => {
            this.props.showToast(error.mjson.msg);
        });
    }

    /**
     * 添加整备费明细
     */
    addClick=()=>{
        this.toNextPage({
            name:'CarAddTrimCostScene',
            component: CarAddTrimCostScene,
            params: {
                setCostAction:this.setCostAction,
            }
        })
    }

    /**
     * 获取添加整备费用明细
     * @param costObject
     */
    setCostAction =(costObject)=>{
        this.costObject.sumNumber+=costObject.price;
        this.costObject.array.push(costObject);
        this.CarTrimCostView.setCostObject(this.costObject);
    }

    /**
     * 移除整备费用明细
     * @param costObject
     */
    moverCostAction =(costObject,index)=>{
        this.costObject.sumNumber-=costObject.price;
        this.costObject.array.splice(index,1);
        this.CarTrimCostView.setCostObject(this.costObject);
    }

    /**
     * from zn
     * 修改整备费用明细
     * @param costObject
     * @param index
     */
    alterClilk=(costObject,index)=>{
        this.toNextPage({
            name:'CarAddTrimCostScene',
            component: CarAddTrimCostScene,
            params: {
                setCostAction:this.setCostAction,
                costObject:costObject,
                alterIndex:index,
                alterCostAction:this.alterCostAction,
            }
        })
    }

    /**
     * from zn
     * 修改整备费用明细
     * @param costObject
     * @param index
     */
    alterCostAction=(costObject,index)=>{
        this.costObject.array[index] = costObject;
        let sumNumber = 0;
        for (let item of this.costObject.array){
            sumNumber+=item.price;
        }
        this.costObject.sumNumber=sumNumber;
    }

    /**
     * 发布车辆
     */
    pushCarPublishScene =()=>{
        let navigatorParams = {

            name: "CarPublishFirstScene",
            component: CarPublishFirstScene,
            params: {
                carData: {
                    vin:this.carParams.vin,
                    tid:this.carParams.id,
                    v_type:1,
                    dealer_price:this.carParams.selfprice,
                    low_price:this.carParams.overprice,
                    plate_number:this.carParams.lastCarNum ? this.carParams.lastCarNum:this.carParams.carNum,
                },
            }
        };
        this.toNextPage(navigatorParams);
    }


    // 构造
    constructor(props) {
        super(props);
        this.carData={};
        this.carParams = {}
        this.titleData1=[
            [
                {
                    title:'车架号',
                    isShowTag:false,
                    value:'',
                    isShowTail:false,
                },
                {
                    title:'车型',
                    isShowTag:false,
                    value:'',
                    isShowTail:false,
                },
                {
                    title:'信息员姓名',
                    isShowTag:false,
                    value:'',
                    isShowTail:false,
                },
                {
                    title:'信息员电话',
                    isShowTag:false,
                    value:'',
                    isShowTail:false,
                },
                {
                    title:'信息来源',
                    isShowTag:false,
                    value:'',
                    isShowTail:false,
                },
                {
                    title:'原车牌号',
                    isShowTag:false,
                    value:'请选择',
                    isShowTail:this.props.type==1?true:false,
                },
                {
                    title:'钥匙数',
                    isShowTag:false,
                    isShowTail:true,

                },
                {
                    title:'卖车人姓名',
                    isShowTag:false,
                    isShowTail:true,
                },
                {
                    title:'卖车人电话',
                    isShowTag:false,
                    isShowTail:true,

                },
                {
                    title:'备注',
                    isShowTag:false,
                    value:'',
                    isShowTail:false,
                },
            ],
            [
                {
                    title:'过户后车牌号',
                    isShowTag:false,
                    value:'请选择',
                    isShowTail:this.props.type==1?true:false,
                },
            ],
            [
                {
                    title:'卖车标价',
                    isShowTag:false,
                    value:'',
                    isShowTail:false,
                },
                {
                    title:'卖车低价',
                    isShowTag:false,
                    value:'',
                    isShowTail:false,
                },
                {
                    title:'备注',
                    isShowTag:false,
                    value:'',
                    isShowTail:false,
                },
            ]

        ];
        this.costObject={
            sumNumber:0,
            array:[
            ]
        };
        this.state = {
            renderPlaceholderOnly:'loading',
            titleData:this.titleData1,
        };
    }


    /**
     *  form @ZN
     * @param title
     * 点击对应标题
     */
    cellCilck=(title)=>{

        if(this.props.type == 2)
        {
            return;
        }

         if(title == '原车牌号'){
            this.carTagType ='原车牌号';
            this.pushCarIicenseTagScene();

        }else if(title == '过户后车牌号')
        {
            this.carTagType ='过户后车牌号';
            this.pushCarIicenseTagScene();
        }
    }

    /**
     * from @ZN
     * 车辆系选择
     */
    pushCarBrand=()=>{
        let brandParams = {
            name: 'CarBrandSelectScene',
            component: CarBrandSelectScene,
            params: {
                checkedCarClick: this._checkedCarClick,
                status: 0,
            }
        };
        this.toNextPage(brandParams);
    }

    /**
     *
     * from @ZN
     * 车系选择结果
     * @param carObject
     * @private
     */
    _checkedCarClick=(carObject)=>{

        this.titleData1[0][1].value = carObject.model_name;
        this.carParams.carName = carObject.model_name;
        this.upTitleData();
    }

    /*
     * from @zn
     *
     * 跳转车牌号页面
     **/
    pushCarIicenseTagScene = () => {
        let navigatorParams = {
            name: "CarlicenseTagScene",
            component: CarlicenseTagScene,
            params: {
                checkedCarlicenseTagClick: this._checkedCarlicenseTagClick,
                currentChecked: this.carTagType=='原车牌号'? this.titleData1[0][5].value : this.titleData1[1][0].value,

            }
        };
        this.toNextPage(navigatorParams);
    }

    /**
     * from @zn
     *
     * 保存车牌号信息
     **/
    _checkedCarlicenseTagClick = (title) => {

        if(this.carTagType=='原车牌号'){

            this.titleData1[0][5].value = title;
            this.carParams.carNum = title;

        }else {
            this.titleData1[1][0].value = title;
            this.carParams.lastCarNum = title;

        }
        this.upTitleData();
    }


    upTitleData=()=>{

        // this.setState({
        //     titleData:this.titleData1,
        // });
    };
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
