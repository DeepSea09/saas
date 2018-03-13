/**
 * Created by zhengnan on 2017/4/21.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    Image,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import AutoConfig from  '../publish/AutoConfig';
let {height, width} = Dimensions.get('window');
import BaseComponent from '../component/BaseComponent';
import NavigationView from '../component/AllNavigationView';
import *as fontAndColor from '../constant/fontAndColor';
import *as appUrls from '../constant/appUrls';
import *as RequestUtil from '../utils/RequestUtil';
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
import CarReferencePriceScene from  './CarReferencePriceScene';
let carConfigurationData = [];
const data = [
    {
        title: '2016-06-20|5532公里',
        type: '正常维修',
        content: '更换左右制动总成，更换右后制动组件。车身控制模块线接头。'
    }, {
        title: '2016-06-20|5532公里',
        type: '正常维修',
        content: '更换左右制动总成，更换右后制动组件。车身控制模块线接头。'
    }, {
        title: '2016-06-20|5532公里',
        type: '正常维修',
        content: '更换左右制动总成，更换右后制动组件。车身控制模块线接头。'
    }, {
        title: '2016-06-20|5532公里',
        type: '正常维修',
        content: '更换左右制动总成，更换右后制动组件。车身控制模块线接头。'
    }, {
        title: '2016-06-20|5532公里',
        type: '正常维修',
        content: '更换左右制动总成，更换右后制动组件。车身控制模块线接头。'
    },
];

export  default class CarUpkeepScene extends BaseComponent {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态

        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {

            dataSource: ds,
            renderPlaceholderOnly: 'blank',
        }
    }

    /**
     * from @zhaojian
     *
     * 初始化页面数据
     **/
    initFinish = () => {
        carConfigurationData = [];
        this.loadData();
    }

    render() {
        if (this.state.renderPlaceholderOnly == 'null') {
            return (
                <View style={{flex:1,backgroundColor:'white'}}>
                    {this.nullDataView()}
                    <NavigationView title="维修保养记录" backIconClick={()=>{this.backPage();}}/>
                </View>
            )
        }
        else if (this.state.renderPlaceholderOnly !== 'success') {
            return (
                <View style={{flex:1,backgroundColor:'white'}}>
                    {this.loadView()}
                    <NavigationView title="维修保养记录" backIconClick={()=>{this.backPage();}}/>
                </View>);
        }
        return (
            <View style={styles.rootContainer}>
                <ListView
                    removeClippedSubviews={false}
                    dataSource={this.state.dataSource}
                    renderHeader={()=>
                        <View style={styles.headView}>
                            <Text allowFontScaling={false}  style={styles.headViewText}>特别提示：<Text allowFontScaling={false}  style={{fontWeight: 'normal'}}>若车辆在非4S店制造商授权店的维修保养信息可能被采集和收录，仅供参考，请结合实车看眼结果和试乘试驾体验，做出准确的交易决策。</Text></Text>
                    </View>
                    }
                    renderRow={this.renderRow}/>
                <NavigationView title="维修保养记录" backIconClick={()=>{this.backPage();}}/>
            </View>
        )
    }

    /**
     * from @zhaojian
     *
     * 每条item布局
     **/
    renderRow = (rowData) => {
        return (
            <View style={styles.cellView}>
                <View style={styles.cellTitleView}>
                    <Text allowFontScaling={false}  style={styles.cellTitleViewTitle}>{rowData.date + ' | ' + rowData.mile + '公里'}</Text>
                    <Text allowFontScaling={false}  style={styles.cellTitleViewValue}>{rowData.type}</Text>
                </View>
                <Text allowFontScaling={false}  style={styles.cellContent}>{rowData.detail + rowData.other}</Text>
            </View>
        )
    }

    /**
     * from @zhaojian
     *
     * 获取维修保养数据
     **/
    loadData = () => {
        RequestUtil.request(appUrls.CAR_GET_ERPORT, 'post', {'vin': this.props.vin}).then((response) => {

            if (response.mjson.data.result.length > 0) {

                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(response.mjson.data.result),
                    renderPlaceholderOnly: 'success',

                });

            } else {
                this.setState({
                    renderPlaceholderOnly: 'null',
                });
            }

        }, (error) => {
            this.setState({
                renderPlaceholderOnly: 'null',
            });
        });
    }

    /**
     * from @zhaojian
     *
     * 数据为空时展示的UI
     **/
    nullDataView = () => {
        return (
            <View style={{flex: 1, alignItems: 'center',justifyContent:'center',
            backgroundColor: fontAndColor.COLORA3}}>
                <Image
                    style={{
                                     width: Pixel.getPixel(141),
                                     height: Pixel.getPixel(183),
                                     resizeMode:'stretch'
                                 }}
                    source={require('../../images/noData.png')}/>
                <Text allowFontScaling={false} 
                    style={{
                             color: fontAndColor.COLORA0, fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                             marginTop: Pixel.getPixel(27),
                             width:Pixel.getPixel(241),
                             textAlign: 'center'
                         }}>
                    该车辆暂无维修保养记录，您可以查看车辆其他相关信息。
                </Text>

                <View style={{width:width,height: Pixel.getPixel(40),paddingLeft:Pixel.getPixel(30),
                         paddingRight:Pixel.getPixel(30),flexDirection:'row',marginTop:Pixel.getPixel(40),justifyContent:'center'}}>
                    <TouchableOpacity onPress={()=>{
                           this.pushCarConfigScene();
                     }} activeOpacity={0.8} style={{flex:1,justifyContent:'center',alignItems: 'center',
                                 backgroundColor: fontAndColor.COLORB0,marginRight:Pixel.getPixel(20)}}>
                        <Text allowFontScaling={false}  style={{color: '#fff',fontSize:
                                          Pixel.getFontPixel(fontAndColor.BUTTONFONT30)}}>查看配置信息</Text>
                    </TouchableOpacity>
                    { this.props.carData.dealer_price > 0 && (

                        (this.props.carData.city_id != '0' && this.props.carData.model_id != '0' && this.props.carData.city_id != '' && this.props.carData.model_id != '') &&
                        <TouchableOpacity onPress={()=>{
                            console.log('123123');
                            this.pushCarReferencePriceScene();
                     }} activeOpacity={0.8} style={{flex:1,justifyContent:'center',alignItems: 'center',
                         borderColor:fontAndColor.COLORB0,borderWidth: 1,marginLeft:Pixel.getPixel(20)}}>
                            <Text allowFontScaling={false}  style={{color: fontAndColor.COLORB0,fontSize:
                                          Pixel.getFontPixel(fontAndColor.BUTTONFONT30)}}>查看参考价</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        )
    }

    /**
     * from @zhaojian
     *
     * 跳转车辆配置信息页面
     **/
    pushCarConfigScene=()=>{
        let navigationParams={
            name: "AutoConfig",
            component: AutoConfig,
            params: {
                modelID:this.props.carData.model_id,
                carConfiguraInfo:this.props.carData.modification_instructions,
                carConfigurationData:carConfigurationData,
                renderCarConfigurationDataAction:this.renderCarConfigDataAction,
                from:'CarUpkeepScene'
            }
        }
        this.toNextPage(navigationParams);
    };

    /**
     * from @zhaojian
     *
     * 跳转车辆参考价页面
     **/
    pushCarReferencePriceScene=()=>{
        console.log('321321312');
        let navigationParams={
            name: "CarReferencePriceScene",
            component: CarReferencePriceScene,
            params: {
                city_id:this.props.carData.city_id,
                mileage:this.props.carData.mileage,
                model_id:this.props.carData.model_id,
                init_reg:this.dateReversal(this.props.carData.init_reg+'000'),
                from:'CarUpkeepScene'
            }
        }
        this.toNextPage(navigationParams);

    };


    /**
     * from @zhaojian
     *
     * 存储车辆配置信息数据
     **/
    renderCarConfigDataAction=(data)=>{
        carConfigurationData=data;
        console.log(data);
    }

    /**
     * from @zhaojian
     *
     * 时间戳转换
     **/
    dateReversal=(time)=>{

        const date = new Date();
        date.setTime(time);
        return(date.getFullYear()+"-"+(this.PrefixInteger(date.getMonth()+1,2)));

    };

    /**
     * from @zhaojian
     *
     * 时间戳转换
     **/
    PrefixInteger =(num,length)=>{

        return (Array(length).join('0') + num).slice(-length);

    }
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        paddingTop: Pixel.getTitlePixel(64),
        backgroundColor: fontAndColor.COLORA3,
    },
    headView: {
        paddingHorizontal: Pixel.getPixel(15),
        paddingVertical: Pixel.getPixel(10),
        backgroundColor: fontAndColor.COLORB6,
    },
    headViewText: {
        color: fontAndColor.COLORB2,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        fontWeight: 'bold'
    },
    cellView: {
        paddingHorizontal: Pixel.getPixel(15),
        borderBottomColor: fontAndColor.COLORA4,
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginTop: Pixel.getPixel(15),
        backgroundColor: 'white',
        flexWrap: 'wrap',

    },
    cellTitleView: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: fontAndColor.COLORA4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Pixel.getPixel(10),

    },
    cellTitleViewTitle: {
        color: fontAndColor.COLORA1,
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
    },
    cellTitleViewValue: {
        color: fontAndColor.COLORB0,
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
    },
    cellContent: {
        marginTop: Pixel.getPixel(10),
        marginBottom: Pixel.getPixel(10),
        color: fontAndColor.COLORA0,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        backgroundColor: 'white'
    },
});