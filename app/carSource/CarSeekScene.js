/**
 * Created by zhengnan on 2017/7/10.
 */

import React, {Component} from 'react'
import {

    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ListView,
    Image,
    Dimensions,

} from 'react-native'

import *as fontAndColor from '../constant/fontAndColor';
import NavigationView from '../component/AllNavigationView';
import PixelUtil from '../utils/PixelUtil';
import SQLiteUtil from '../utils/SQLiteUtil';
import StorageUtil      from '../utils/StorageUtil';
import * as StorageKeyName   from '../constant/storageKeyNames';
import * as AppUrls         from "../constant/appUrls";
import  {request}           from '../utils/RequestUtil';
import BaseComponent from "../component/BaseComponent";
const Pixel = new PixelUtil();
const SQLite = new SQLiteUtil();
var ScreenWidth = Dimensions.get('window').width;
let seekDataArray = [];

export default class CarSeekScene extends BaseComponent {

    initFinish=()=>{
        SQLite.createTable();
        this.loadSeekData();
    }

    // 构造
    constructor(props) {
        super(props);

        this.historySeekData = [];
        this.seekArray = [];
        const seekData = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
        const historySeekListData = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});

        this.state = {
            seekData:seekData,
            historySeekListData:historySeekListData,
            footprintData:[],
        };
        this.getSeekData();

    }

    render(){
        return(
            <View style={styles.rootContainer}>
                <View style={{backgroundColor :'white',height:Pixel.getPixel(50),paddingHorizontal:Pixel.getPixel(15),justifyContent:'center',
                    flexDirection:'row', alignItems:'center'
                }}>
                    <TextInput style={styles.textInput}
                               placeholder = {'    搜索车型'}
                               underlineColorAndroid='transparent'
                               onChangeText={(text)=>{
                                   this.seekStr = text;
                                   this.seekData(text);
                               }}/>
                    <TouchableOpacity onPress={()=>{
                        this.checkedCarClick(this.seekStr);
                        this.saveSeekData(this.seekStr);
                        this.backPage();
                    }}>
                        <View style={{width:Pixel.getPixel(60),marginLeft:Pixel.getPixel(10),backgroundColor:'white',height:Pixel.getPixel(30),borderColor:fontAndColor.COLORB0,borderWidth:Pixel.getPixel(0.5),borderRadius:Pixel.getPixel(4),justifyContent:'center',
                            alignItems:'center'
                        }}>
                        <Text style={{fontSize:Pixel.getFontPixel(fontAndColor.BUTTONFONT30),color:fontAndColor.COLORB0,textAlign:'center'}}>搜索</Text>
                        </View>
                    </TouchableOpacity>

                </View>
                <ListView renderHeader={this.renderHeader}
                          keyboardDismissMode={'on-drag'}
                          removeClippedSubviews={false}
                          enableEmptySections = {true}
                          key ='historySeekList'
                          dataSource={this.state.historySeekListData}
                          renderRow={(data,index) =>{
                              return(
                                  <TouchableOpacity style={styles.listCell} onPress={()=>{
                                      this.checkedCarClick(data);
                                      this.backPage();
                                  }}>
                                      <Text style={styles.cellTitle}>{data}</Text>
                                  </TouchableOpacity>
                              )
                }}/>
                {/*<View style={{left:0,right:0,bottom:0, flexDirection:'row',position:'absolute',}}>*/}
                    {/*<Text style={{backgroundColor:'yellow',marginTop:20,width:80,textAlign:'center'}} onPress={()=>{*/}

                        {/*let array = ['奥迪','奥特','奥特曼','宝马','宝骏','别克',];*/}

                        {/*for (let content of array)*/}
                        {/*{*/}
                            {/*this.saveData(content);*/}
                        {/*}*/}

                    {/*}}>实例化数据</Text>*/}
                    {/*<Text style={{backgroundColor:'yellow',marginTop:20,width:80,textAlign:'center'}} onPress={this.selectData}>查询数据</Text>*/}
                    {/*<Text style={{backgroundColor:'yellow',marginTop:20,width:80,textAlign:'center'}} onPress={this.saveData}>存储数据</Text>*/}
                    {/*<Text style={{backgroundColor:'yellow',marginTop:20,width:80,textAlign:'center'}} onPress={this.deleteData}>删除数据</Text>*/}
                {/*</View>*/}
                {
                    this.seekArray.length>0 && (
                        <ListView style={styles.listView}
                                  key = 'seekList'
                                  keyboardDismissMode={'on-drag'}
                                  dataSource={this.state.seekData}
                                  enableEmptySections = {true}
                                  removeClippedSubviews={false}
                                  renderRow={(item,sectionID,rowID) =>
                                      <TouchableOpacity style={styles.listCell} onPress={()=>{
                                          this.checkedCarClick(item);
                                          this.saveSeekData(item);
                                          this.backPage();
                                      }} activeOpacity={1}>
                                          <Text style={styles.cellTitle}>{item}</Text>
                                      </TouchableOpacity>

                                  }/>
                    )
                }

            <NavigationView title="车型搜索" backIconClick={this.backPage}/>
        </View>)

    }

    loadSeekData=()=>{

        // if(seekDataArray.length>0)
        // {
        //     this.setSeekData(seekDataArray);
        //     return;
        // }

        request(AppUrls.CAR_SEARCH_TOP,'POST',{}).then((response) => {

            if(response.mjson.code ==1){

                seekDataArray = response.mjson.data.list;
                this.setSeekData(seekDataArray);
            }

        }, (error) => {

            this.props.showToast(error.msg);
        });
    }

    setSeekData =(dataArray)=>{

            this.deleteData();
            for (let i=0;i<dataArray.length;i++){
                if(i<10){
                    this.state.footprintData.push(dataArray[i].name);
                }

                this.saveData(dataArray[i].name);
            }

            this.setState({
                footprintData:this.state.footprintData
            });
    }

    renderHeader =()=> {
        return(
            <View>
            <View style={styles.carBrandHeadView}>
                <Text allowFontScaling={false}  style={styles.carBrandHeadText}>热搜:</Text>
                {
                    this.state.footprintData.map((data, index) => {
                        return (
                            <TouchableOpacity key={index} onPress={()=>{
                                this.checkedCarClick(data);
                                this.saveSeekData(data);
                                this.backPage();
                            }}>
                                <View style={styles.footprintView}>
                                    <Text allowFontScaling={false}  style={styles.footprintText}>{data}</Text>
                                </View>
                            </TouchableOpacity>)
                    })
                }
            </View>
                {
                    this.historySeekData.length >0 && (
                        <View style={styles.historySeekView}>
                            <Text style={{fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),color:fontAndColor.COLORA0}}>搜索历史</Text>
                            <TouchableOpacity style={{width:Pixel.getPixel(100),height:Pixel.getPixel(44),justifyContent:'center'}}
                                              onPress={this.deleteSeekData}>
                                <Text style={{fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),color:fontAndColor.COLORA1,textAlign:'right'}}>清除</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }

            </View>)
    }


    checkedCarClick = (name)=>{

        this.props.checkedCarClick({
            brand_id:0,
            series_id:0,
            brand_name:name
        });
    }

    getSeekData = () => {

        StorageUtil.mGetItem(StorageKeyName.CAR_SEEK_DATA, (data) => {
            if (data.code == 1) {
                if (data.result) {

                    this.historySeekData = JSON.parse(data.result);
                    this.setState({
                        historySeekListData:this.state.historySeekListData.cloneWithRows(this.historySeekData),
                    });
                }
            }
        })
    }

    saveSeekData = (seekName) => {

        console.log(seekName);
        let isEqual = false;
        let historySeekData = this.historySeekData;
        let newArray = new Array;

        if (historySeekData.length > 0) {
            newArray.push(seekName);
            historySeekData.map((data, index) => {
                if (data == seekName)
                {
                    isEqual = true;
                }
                newArray.push(data);
            });
        } else {
            newArray.push(seekName);
        }
        if (!isEqual) {
            StorageUtil.mSetItem(StorageKeyName.CAR_SEEK_DATA, JSON.stringify(newArray));
        }

    }

    deleteSeekData =()=>{
        StorageUtil.mRemoveItem(StorageKeyName.CAR_SEEK_DATA);
        this.historySeekData = [];
        this.setState({
            historySeekListData:this.state.historySeekListData.cloneWithRows(this.historySeekData),
        });

    }

    selectData=()=>{
        SQLite.selectData('SELECT * FROM carTypeList',[],
            (data) => {

               let cont = data.result.rows.length;
               this.sumIndex = cont;
               for (let i=0;i<cont;i++){
                   console.log(data.result.rows.item(i));
               }

            });
    }

    saveData=(content)=>{
        SQLite.changeData('INSERT INTO carTypeList (car_name) VALUES (?)',
            [content]);
    }

    deleteData=()=>{
        SQLite.selectData('delete from carTypeList');
    }
    seekData=(content)=>{

        if(content==this.current) return;

        if(content==''){
            this.seekArray = [];
            this.setState({
                seekData:this.state.seekData.cloneWithRows(this.seekArray)
            });
            return;
        }
        this.current = content;
        SQLite.selectData('SELECT * FROM carTypeList where car_name LIKE ? ',['%'+content+'%'],
            (data) => {
                let cont = data.result.rows.length;

                if(cont<=0) return;

                this.seekArray = [];
                for (let i=0;i<cont;i++){
                    console.log(data.result.rows.item(i));
                   this.seekArray.push(data.result.rows.item(i).car_name);
                }

                this.setState({
                    seekData:this.state.seekData.cloneWithRows(this.seekArray)
                });

            });
    }
}

const styles = StyleSheet.create({
    rootContainer:{
        flex:1,
        paddingTop:Pixel.getTitlePixel(64),
        backgroundColor:fontAndColor.COLORA3,

    },
    textInput:{
        height:Pixel.getPixel(30),
        width:ScreenWidth - 100,
        backgroundColor:fontAndColor.COLORA3,
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT),
        marginTop:Pixel.getPixel(10),
        paddingTop:0,
        paddingBottom:0,
        paddingLeft:0,
        paddingRight:0,

    },
    listView:{
        left:0,
        right:0,
        bottom:0,
        top:Pixel.getTitlePixel(114),
        position: 'absolute',
        backgroundColor:'white'
    },

    listCell:{
        flex:1,
        backgroundColor:'white',
        height:Pixel.getPixel(44),
        justifyContent:'center',
        paddingLeft:Pixel.getPixel(15),
        borderBottomWidth:Pixel.getPixel(0.5),
        borderBottomColor:fontAndColor.COLORA3,
    },
    cellTitle:{
        color: fontAndColor.COLORA0,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),
    },
    carBrandHeadView: {

        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingVertical:Pixel.getPixel(10),
        marginTop:Pixel.getPixel(1),
        paddingHorizontal:Pixel.getPixel(15),

    },carBrandHeadText: {

        color: fontAndColor.COLORA0,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),
        backgroundColor: 'white',
        marginTop: Pixel.getPixel(5),
        marginBottom: Pixel.getPixel(5),
        marginLeft: Pixel.getPixel(15),
        marginRight:Pixel.getPixel(10)

    },

    footprintView: {

        marginRight: Pixel.getPixel(5),
        paddingHorizontal: Pixel.getPixel(10),
        height: Pixel.getPixel(20),
        borderRadius: 4,
        backgroundColor: fontAndColor.COLORA3,
        justifyContent: 'center',
        marginTop: Pixel.getPixel(5),
        marginBottom: Pixel.getPixel(5),
    },
    footprintText: {
        color: fontAndColor.COLORA0,
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT),
    },
    historySeekView:{

        backgroundColor:fontAndColor.COLORA3,
        flexDirection:'row',
        height:Pixel.getPixel(44),
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal:Pixel.getFontPixel(15),

    },

});