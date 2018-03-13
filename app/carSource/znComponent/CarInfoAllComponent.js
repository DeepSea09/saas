/**
 * Created by zhengnan on 2017/4/19.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    ListView,

} from 'react-native';

var ScreenWidth = Dimensions.get('window').width;

import *as fontAndColor from '../../constant/fontAndColor';
import PixelUtil from '../../utils/PixelUtil';
import BaseComponent from '../../component/BaseComponent';
const Pixel = new PixelUtil();

import {request} from "../../utils/RequestUtil";
import * as AppUrls from "../../constant/appUrls";

// 切换头部按钮
export class CarDeploySwitchoverButton extends Component{

// 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {

        currentSwitchoverType:0,
    };
  }

    render(){
        return(
            <View style={styles.carDeploySwitchoverButton}>
                <TouchableOpacity style={[styles.carDeploySwitchoverItemView,this.state.currentSwitchoverType==0&&{borderBottomWidth:1,borderBottomColor:fontAndColor.COLORB0}]}
                                  onPress={()=>{this.switchoverAction(0)}} activeOpacity={1}>
                    <Text allowFontScaling={false}  style={[styles.carDeploySwitchoverItemText,this.state.currentSwitchoverType==0 && {color:fontAndColor.COLORB0}]}>基本信息</Text>
                </TouchableOpacity>
                <View style={{backgroundColor:fontAndColor.COLORA4,width:StyleSheet.hairlineWidth,height:20}}/>
                <TouchableOpacity  style={[styles.carDeploySwitchoverItemView ,this.state.currentSwitchoverType==1&&{borderBottomWidth:1,borderBottomColor:fontAndColor.COLORB0}]}
                                   onPress={()=>{this.switchoverAction(1)}} activeOpacity={1}>
                    <Text allowFontScaling={false}   style={[styles.carDeploySwitchoverItemText,this.state.currentSwitchoverType==1 && {color:fontAndColor.COLORB0}]}>车辆配置</Text>
                </TouchableOpacity>
            </View>
        )
    }

    switchoverAction=(type)=>{

        if(this.state.currentSwitchoverType!=type){
            this.setState({
                currentSwitchoverType:type,
            });

            this.props.switchoverAction(type);
        }
    }
}

// 车辆配置view
export class CarConfigurationView extends BaseComponent{

    // 构造
      constructor(props) {
        super(props);

        const dataSource = new  ListView.DataSource({
            getSectionData:(dataBlob,sectionID)=>{ return dataBlob[sectionID]},
            getRowData:(dataBlob,sectionID,rowID)=>{return dataBlob[sectionID+':'+rowID]},
            rowHasChanged:(r1,r2) => r1!==r2,
            sectionHeaderHasChanged:(s1,s2) => s1!==s2,
        });

        // 初始状态
        this.state = {
            renderPlaceholderOnly: this.props.carConfigurationData.length>0?'success':'blank',
            dataSource:dataSource,
        };
      }

    componentDidMount() {
        //InteractionManager.runAfterInteractions(() => {
        this.setState({renderPlaceholderOnly: 'loading'});
        this.initFinish();
        // });
    }

      initFinish=()=>{

          if(this.props.carConfigurationData.length){
              this.setData(this.props.carConfigurationData);
          }else {
              this.loadData();
          }

      }


      loadData=()=>{

             if(this.props.modelID==''||this.props.modelID=='0')
             {
                 this.setState({
                     renderPlaceholderOnly:'null',
                 });
                 return;
             }

              request(AppUrls.CAR_CONFIGURATION,'post',{
                  model_id:this.props.modelID,
              }).then((response) => {

                  if(response.mycode==1){
                      this.setData(response.mjson.data);
                      this.props.renderCarConfigurationDataAction && this.props.renderCarConfigurationDataAction(response.mjson.data);
                  }else {
                      this.setState({
                          renderPlaceholderOnly:'null',
                      });
                  }
              }, (error) => {

                  this.setState({
                      renderPlaceholderOnly:'error',
                  });
              });
      }

      setData=(array)=>{

          var dataBlob = {}, sectionIDs = [], rowIDs = [], rows = [];

          for (var i = 0; i < array.length; i++) {
              sectionIDs.push(i);
              dataBlob[i] = array[i].title;
              rows = array[i].data;
              rowIDs[i] = [];
              for (var j = 0; j < rows.length; j++) {

                  if(rows[j].value!==''){
                      rowIDs[i].push(j);
                      //把每一行中的内容放入dataBlob对象中
                      dataBlob[i + ':' + j] = rows[j];
                  }
              }
          }

          this.setState({
              dataSource:this.state.dataSource.cloneWithRowsAndSections(dataBlob,sectionIDs,rowIDs),
              renderPlaceholderOnly:'success',
          });
      }

    render(){

        if (this.state.renderPlaceholderOnly!=='success') {
            return (
                <View style={{flex: 1, backgroundColor:fontAndColor.COLORA3}}>
                    {this.loadView()}
                </View>);
        }

        return(
        <View style={{flex:1}}>
            <ListView
                removeClippedSubviews={false}
                dataSource={this.state.dataSource}
                renderHeader={()=>{return(
                    this.props.carConfiguraInfo?(<View style={{paddingHorizontal:Pixel.getPixel(15),paddingVertical:Pixel.getPixel(10),backgroundColor:'white'}}>
                            <Text allowFontScaling={false}  style={{color:fontAndColor.COLORA0, fontSize:Pixel.getPixel(fontAndColor.LITTLEFONT28)}}>{this.props.carConfiguraInfo}</Text>
                        </View>):(null)
                )}}
                renderRow={(rowData, sectionID, rowID)=>{
                return(<View  style={styles.carConfigurationViewItem}>
                    <Text allowFontScaling={false}  style={styles.carConfigurationViewItemtTitleText}>{rowData.title}</Text>
                    <Text allowFontScaling={false}  style={styles.carConfigurationViewItemtValueText}>{rowData.value==1?'标配':(rowData.value==0?'选配':rowData.value)}</Text>
                </View>) }}
                renderSectionHeader={(sectionData, sectionId)=>{
                    return(<View style={styles.carConfigurationViewItemHead}>
                        <Text allowFontScaling={false}  style={styles.carConfigurationViewItemHeadText}>{sectionData}</Text>
                    </View>)}}
                enableEmptySections={true}/>
        </View>
        )
    }

}

const styles= StyleSheet.create({

    carDeploySwitchoverButton:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'white',
        height:Pixel.getPixel(44),
        flex:1,
        borderBottomColor:fontAndColor.COLORA4,
        borderBottomWidth:StyleSheet.hairlineWidth,

    },
    carDeploySwitchoverItemView:{

        width:ScreenWidth/2-(StyleSheet.hairlineWidth/2),
        height:Pixel.getPixel(44),
        backgroundColor:'white',
        justifyContent:'center',
        alignItems:'center'


    },
    carDeploySwitchoverItemText:{
        color:fontAndColor.COLORA0,
        fontSize:Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
        textAlign:'center',
    },
    carConfigurationViewHead:{
        height:Pixel.getPixel(44),
        backgroundColor:'white',
        paddingLeft:15,
        justifyContent:'center',
    },
    carConfigurationViewHeadText:{
        color:fontAndColor.COLORA0,
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
    },
    carConfigurationViewItemHead:{
        backgroundColor:fontAndColor.COLORA3,
        paddingLeft:Pixel.getPixel(15),
        justifyContent:'center',
        height:Pixel.getPixel(30),
    },
    carConfigurationViewItemHeadText:{
       color:fontAndColor.COLORA1,
        fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
    },
    carConfigurationViewItem:{
        backgroundColor:'white',
        borderBottomColor:fontAndColor.COLORA4,
        borderBottomWidth:StyleSheet.hairlineWidth,
        paddingRight:Pixel.getPixel(15),
        paddingLeft:Pixel.getPixel(15),
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        width:ScreenWidth,
        flexWrap: 'wrap',
        paddingTop:Pixel.getPixel(10)
    },

    carConfigurationViewItemtTitleText:{
       color:fontAndColor.COLORA1,
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        marginBottom:Pixel.getPixel(10),
    },
    carConfigurationViewItemtValueText:{
       color:fontAndColor.COLORA0,
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        marginBottom:Pixel.getPixel(10),

    },



});