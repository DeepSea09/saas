/**
 * Created by zhengnan on 2017/5/20.
 */
/**
 * Created by zhengnan on 2017/4/21.
 */

import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    Image,
    ScrollView,
} from 'react-native';

import BaseComponent from '../component/BaseComponent';
import NavigationView from '../component/AllNavigationView';
import *as fontAndColor from '../constant/fontAndColor';
import *as appUrls from '../constant/appUrls';
import *as RequestUtil from '../utils/RequestUtil';
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
var ScreenWidth = Dimensions.get('window').width;


const data = [
    [{'title':'商家收购价',value:'10'},{'title':'个人交易价',value:'11'},{'title':'商家零售价',value:'13'}],
    [{'title':'商家收购价',value:'10'},{'title':'拍卖价',value:'11'},{'title':'商家零售价',value:'13.5'}],
]

export  default class CarReferencePriceScene extends  BaseComponent{

    // 构造
    constructor(props) {
        super(props);
        // 初始状态

        this.state = {
            data:data,
            renderPlaceholderOnly: 'blank',
        }
    }
    initFinish = () => {

        this.loadData();
    }

    /**
     * from @zhaojian
     *
     * 回退到车辆详情页面
     **/
    backPage = () => {
        if(this.props.from=='CarUpkeepScene'){
            const navigator = this.props.navigator;
            if (navigator){
                for(let i = 0;i<navigator.getCurrentRoutes().length;i++){
                    if(navigator.getCurrentRoutes()[i].name=='CarInfoScene'){
                        navigator.popToRoute(navigator.getCurrentRoutes()[i]);
                        break;
                    }
                }
            }
        }else{
            const navigator = this.props.navigator;
            if (navigator) {
                navigator.pop();
            }
        }
    }
    render(){
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (
                <View style={{flex:1,backgroundColor:'white'}}>
                    {this.loadView()}
                    <NavigationView title="参考价格" backIconClick={()=>{this.backPage();}}/>
                </View>);
        }
        return(
            <View style={styles.rootContainer}>
                <ScrollView>
                    <View style={styles.cellView}>
                        <View style={{paddingVertical:Pixel.getPixel(10),borderBottomColor:fontAndColor.COLORA4,borderBottomWidth:StyleSheet.hairlineWidth}}>
                            <Image source={require('../../images/carSourceImages/logo1.png')}/>
                        </View>
                        <PriceCell data={this.state.data[0].data} myKey="logo1"/>
                    </View>
                    <View style={styles.cellView}>
                        <View style={{width:ScreenWidth,paddingVertical:Pixel.getPixel(10),borderBottomColor:fontAndColor.COLORA4,borderBottomWidth:StyleSheet.hairlineWidth}}>
                            <Image source={require('../../images/carSourceImages/logo2.png')}/>
                        </View>
                        <PriceCell data={this.state.data[1].data} myKey="logo2"/>
                    </View>
                </ScrollView>
                <NavigationView title="参考价格" backIconClick={()=>{this.backPage();}}/>
            </View>
        )
    }

    loadData=()=>{
        RequestUtil.request(appUrls.CAR_GET_REFERENCEPRICE,'post',{
                'city_id':this.props.city_id,
                'mile':this.props.mileage,
                'model_id':this.props.model_id,
                'reg_date':this.props.init_reg
        }).then((response)=>{

            console.log(response);
            if(response.mjson.data.length>0){

                this.setState({
                    data:response.mjson.data,
                    renderPlaceholderOnly: 'success',

                });

            }else {
                this.setState({
                    renderPlaceholderOnly: 'null',
                });
            }

        },(error)=>{
            this.setState({
                renderPlaceholderOnly: 'error',
            });
        });
    }

    dateReversal=(time)=>{

        const date = new Date();
        date.setTime(time);
        return(date.getFullYear()+"-"+(this.PrefixInteger(date.getMonth()+1,2))+'-'+(this.PrefixInteger(date.getDay()+1,2)));

    };
    PrefixInteger =(num,length)=>{

        return (Array(length).join('0') + num).slice(-length);

    }

}

class PriceCell extends Component{
    render(){
        return(
            <View style={{marginTop:Pixel.getPixel(12),marginBottom:Pixel.getPixel(28)}}>
                {
                  this.props.data.map((data,index)=>{
                      return(
                          <View style={styles.cellContentView} key={this.props.myKey+index}>
                              <Text allowFontScaling={false}  style={styles.cellTitle}>{data.title}</Text>
                              <Text allowFontScaling={false}  style={styles.cellValue}>{data.value} 万元</Text>
                          </View>
                      )
                  })
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    rootContainer:{
        flex:1,
        paddingTop:Pixel.getTitlePixel(64),
        backgroundColor:fontAndColor.COLORA3,
    },

    cellView:{
        paddingHorizontal:Pixel.getPixel(15),
        marginTop:Pixel.getPixel(15),
        backgroundColor:'white',
    },
    cellTitleView:{
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderBottomColor:fontAndColor.COLORA4,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingVertical:Pixel.getPixel(10),

    },
    cellTitle:{
        color:fontAndColor.COLORA1,
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
    },
    cellValue:{
        color:fontAndColor.COLORA0,
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
    },
    cellContentView:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'white',
        marginTop:Pixel.getPixel(16),
    },


});