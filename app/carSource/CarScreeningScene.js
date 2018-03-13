import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions,
    TextInput,

} from 'react-native';

import *as fontAndColor from '../constant/fontAndColor';
import BaseComponent from '../component/BaseComponent';
import NavigationView from '../component/AllNavigationView';
import CityListScene from './CityListScene';
import CarBrandSelectScene from './CarBrandSelectScene'
import ProvinceListScene from './ProvinceListScene';
import CarDischargeScene from './carPublish/CarDischargeScene';
import CarBodyColorScene from './carPublish/CarBodyColorScene';
import PixelUtil from '../utils/PixelUtil';
import CarSpecificationScene from "./CarSpecificationScene";
const Pixel = new PixelUtil();


let carFilterData = require('./carData/carFilterData.json');

export default class CarInfoScene extends BaseComponent {


    render() {
        const screeningObject = this.props.screeningObject;
        return (
            <View style={styles.rootContainer}>
                <ScrollView>
                    <SelectView
                        ref="cityView"
                        title="地区"
                        content={screeningObject.checkedCity.title!=''?screeningObject.checkedCity.title:'请选择'}
                        selectCilck={this.pushCitySceneAction}/>
                    <SelectView
                        ref="carView"
                        title="品牌车系"
                        content={(screeningObject.checkedCarType.title!='')?screeningObject.checkedCarType.title:'请选择'}
                        selectCilck={this.pushCarBrandSceneAction}/>
                    {
                        this.props.type==1 && (
                            <SelectView
                                ref="carDischargeView"
                                title="排放标准"
                                content={screeningObject.checkedCarDischarge.title!=''?screeningObject.checkedCarDischarge.title:'请选择'}
                                selectCilck={this.pushCarDischargeSceneAction}/>
                        )
                    }
                    <SelectView
                        ref="carColorView"
                        title="车身颜色"
                        content={screeningObject.checkedCarColor.title!=''?screeningObject.checkedCarColor.title:'请选择'}
                        selectCilck={this.pushCarColorSceneAction}/>
                    {
                        this.props.type==1 && (
                            <View>
                                <CheckedView
                                    title="车龄"
                                    contentView={this.carAgeView}
                                    dataArray={screeningObject.carAgeSource}
                                    checkedClick={this.carAgeClick}
                                    currentChecked={screeningObject.checkedCarAgeType.title}/>
                                <CheckedView
                                    title="里程"
                                    dataArray={screeningObject.carKMSource}
                                    checkedClick={this.carKMClick}
                                    currentChecked={screeningObject.checkedCarKMType.title}/>
                                <CheckedView
                                    title="使用性质"
                                    dataArray={screeningObject.carNatureSource}
                                    checkedClick={this.carNatureClick}
                                    currentChecked={screeningObject.checkedCarNature.title}/>
                            </View>)
                    }
                    <CheckedView
                        title="价格"
                        contentView={this.carPriceView}
                        dataArray={screeningObject.carPriceSource}
                        checkedClick={this.carPriceClick}
                        currentChecked={screeningObject.checkedCarPrice.title}/>
                    {
                        this.props.type!=1 && (
                            <SelectView
                            ref="carSpecificationView"
                            title="车规"
                            content={screeningObject.checkedCarSpecification.title!=''?screeningObject.checkedCarSpecification.title:'请选择'}
                            selectCilck={this.pushCarSpecificationAction}/>)
                    }

                    {/*<CheckedView    title="类型" dataArray={screeningObject.carTypeSource}   checkedClick={this.carTypeClick}    currentChecked={screeningObject.checkedCarGenre.title}/>*/}
                </ScrollView>
                <NavigationView title="筛选" backIconClick={this.backPage} renderRihtFootView={this.renderRightFootView}/>
            </View>
        )
    }

    carPriceView =()=>{
        return(
        <View style={{flexDirection:'row',alignItems:'center',marginVertical:Pixel.getPixel(10)}}>
            <TextInput style={styles.textInput}
                       ref={(ref)=>{this.carStartPriceInput = ref}}
                       placeholder='起始价格'
                       keyboardType={'numeric'}
                       maxLength={7}
                       underlineColorAndroid='transparent'
                       onChangeText={(text)=>{
                           if(text.length>4&&text.indexOf('.')==-1){
                               text = text.substring(0,text.length-1);
                           }
                           let moneyStr = this.chkPrice(text);
                           this.carStartPriceInput.setNativeProps({
                               text: moneyStr,
                           });

                           this.carStartPrice = moneyStr;
                       }}/>
            <Text style={{color:fontAndColor.COLORA1, fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24),textAlign:'center',
                marginHorizontal:Pixel.getPixel(5)}}>到</Text>
            <TextInput style={styles.textInput}
                       ref={(ref)=>{this.carStopPriceInput = ref}}
                       placeholder='终止价格'
                       keyboardType={'numeric'}
                       maxLength={7}
                       underlineColorAndroid='transparent'
                       onChangeText={(text)=>{
                           if(text.length>4&&text.indexOf('.')==-1){
                               text = text.substring(0,text.length-1);
                           }
                           let moneyStr = this.chkPrice(text);
                           this.carStopPriceInput.setNativeProps({
                               text: moneyStr,
                           });

                           this.carStopPrice = moneyStr;

                       }}/>
            <Text style={{color:fontAndColor.COLORA1, fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24),textAlign:'center',
                marginHorizontal:Pixel.getPixel(5)}}>万元</Text>
            {/*<TouchableOpacity onPress={()=>{*/}

                {/*if(!this.carStartPrice||!this. carStopPrice){*/}
                    {/*this.props.showToast('请输入正确的价格区间');*/}
                    {/*return;*/}

                {/*}*/}

                {/*let  carStartPrice = parseFloat(this.carStartPrice);*/}
                {/*let  carStopPrice = parseFloat(this.carStopPrice);*/}

                {/*if(carStartPrice>carStopPrice){*/}
                    {/*this.props.showToast('终止价格不得小于起始价格');*/}
                    {/*return;*/}
                {/*}*/}
                {/*this.props.screeningObject.checkedCarPrice.title = this.carStartPrice +'到'+this.carStopPrice+'万';*/}
                {/*this.props.screeningObject.checkedCarPrice.value = this.carStartPrice +'|'+this.carStopPrice;*/}
                {/*this.completeClick();*/}


            {/*}}>*/}
                {/*<View style={{borderWidth:Pixel.getPixel(1),borderColor:fontAndColor.COLORA3,borderRadius:Pixel.getPixel(3),width:Pixel.getPixel(60),height:Pixel.getPixel(20),justifyContent:'center',alignItems:'center'}}>*/}
                    {/*<Text style={{color:fontAndColor.COLORB3, fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24),textAlign:'center',marginRight:Pixel.getPixel(5)}}>确定</Text>*/}
                {/*</View>*/}
            {/*</TouchableOpacity>*/}
        </View>
        )
    }

    carAgeView=()=>{
        return(
            <View style={{flexDirection:'row',alignItems:'center',marginVertical:Pixel.getPixel(10)}}>
                {/*<Text style={{color:fontAndColor.COLORA1, fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24),textAlign:'center',marginRight:Pixel.getPixel(5)}}>自定义</Text>*/}
                <TextInput style={styles.textInput}
                           placeholder='起始年限'
                           keyboardType={'numeric'}
                           maxLength={2}
                           underlineColorAndroid='transparent'
                           onChangeText={(text)=>{
                               this.carStartAge = text;
                           }}
                />
                <Text style={{color:fontAndColor.COLORA1, fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24),textAlign:'center',
                    marginHorizontal:Pixel.getPixel(5)}}>到</Text>
                <TextInput style={styles.textInput}
                           placeholder='终止年限'
                           keyboardType={'numeric'}
                           maxLength={2}
                           underlineColorAndroid='transparent'
                           onChangeText={(text)=>{
                               this.carStopAge = text;
                           }}
                />
                <Text style={{color:fontAndColor.COLORA1, fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24),textAlign:'center',
                    marginHorizontal:Pixel.getPixel(5)}}>年</Text>
                {/*<TouchableOpacity onPress={()=>{*/}
                    {/*if(!this.carStartAge||!this. carStopAge){*/}
                        {/*this.props.showToast('请输入正确的年份区间');*/}
                        {/*return;*/}

                    {/*}*/}

                    {/*let  carStartAge = parseFloat(this.carStartAge);*/}
                    {/*let  carStopAge = parseFloat(this.carStopAge);*/}

                    {/*if(carStartAge>carStopAge){*/}
                        {/*this.props.showToast('终止年份不得小于起始年份');*/}
                        {/*return;*/}
                    {/*}*/}

                    {/*this.carAgeClick({'title':this.carStartAge +'到'+this.carStopAge+'年','value':this.carStartAge +'|'+this.carStopAge})*/}
                    {/*this.completeClick();*/}

                {/*}}>*/}
                    {/*<View style={{borderWidth:Pixel.getPixel(1),borderColor:fontAndColor.COLORA3,borderRadius:Pixel.getPixel(3),width:Pixel.getPixel(60),height:Pixel.getPixel(20),justifyContent:'center',alignItems:'center'}}>*/}
                        {/*<Text style={{color:fontAndColor.COLORB3, fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24),textAlign:'center',marginRight:Pixel.getPixel(5)}}>确定</Text>*/}
                    {/*</View>*/}
                {/*</TouchableOpacity>*/}
            </View>
        )
    }

    renderRightFootView = () => {

        return (
            <TouchableOpacity onPress={this.completeClick}>
                <View style={{paddingVertical:3, paddingHorizontal:5,backgroundColor:'transparent',borderWidth:StyleSheet.hairlineWidth,borderColor:'white',borderRadius:3}}>
                    <Text allowFontScaling={false}  style={{
                        color: 'white',
                        fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                        textAlign: 'center',
                        backgroundColor: 'transparent',}}>完成</Text>
                </View>
            </TouchableOpacity>
        )
    }

    completeClick=()=>{
        if(this.carStartAge&&this. carStopAge){

            let  carStartAge = parseFloat(this.carStartAge);
            let  carStopAge = parseFloat(this.carStopAge);

            if(carStartAge>carStopAge){
                this.props.showToast('终止年份不得小于起始年份');
                return;
            }

            this.carAgeClick({'title':this.carStartAge +'到'+this.carStopAge+'年','value':this.carStartAge +'|'+this.carStopAge})
        }

        if(this.carStartPrice && this. carStopPrice){

            let  carStartPrice = parseFloat(this.carStartPrice);
            let  carStopPrice = parseFloat(this.carStopPrice);

            if(carStartPrice>carStopPrice){
                this.props.showToast('终止价格不得小于起始价格');
                return;
            }
            this.props.screeningObject.checkedCarPrice.title = this.carStartPrice +'到'+this.carStopPrice+'万';
            this.props.screeningObject.checkedCarPrice.value = this.carStartPrice +'|'+this.carStopPrice;
        }
        this.props.screeningCompleteClick(this.props.screeningObject);
        this.backPage();
    }

    /**
     * 选择城市
     */
    pushCitySceneAction=()=>{
        // let navigatorParams = {
        //     name: "CityListScene",
        //     component: CityListScene,
        //     params: {
        //         checkedCityClick:this.checkedCityClick,
        //         unlimitedAction:this.cityUnlimitedAction,
        //     }
        // }
        // this.toNextPage(navigatorParams);
        let navigatorParams = {
            name: "ProvinceListScene",
            component: ProvinceListScene,
            params: {
                    checkedCityClick:this.checkedCityClick,
                    unlimitedAction:this.cityUnlimitedAction,
                    isSelectProvince:true
            }
        }
        this.toNextPage(navigatorParams);
    };

    /**
     * 选择品牌
     */
    pushCarBrandSceneAction=()=>{
        let navigatorParams = {
            name: "CarBrandSelectScene",
            component: CarBrandSelectScene,
            params: {
                checkedCarClick:this.checkedCarClick,
                status: 1,
                isHeadInteraction: true,
                unlimitedAction:this.carUnlimitedAction,
            }
        }
        this.toNextPage(navigatorParams);
    };

    /**
     * 选择排放标准
     */
    pushCarDischargeSceneAction=()=>{
        let navigatorParams = {
            name: "CarDischargeScene",
            component: CarDischargeScene,
            params: {
                checkedCarDischargeClick:this.carDischargeClick,
                currentChecked:this.props.screeningObject.checkedCarDischarge.title,
                DischargeData:this.props.screeningObject.carDischargeSource,
            }
        }
        this.toNextPage(navigatorParams);
    }

    /**
     * 选择车身颜色
     */
    pushCarColorSceneAction=()=>{
        let navigatorParams = {
            name: "CarBodyColorScene",
            component: CarBodyColorScene,
            params: {
                checkedCarBodyColorClick:this.carBodyColorClick,
                currentChecked:this.props.screeningObject.checkedCarColor.title,
                carBodyColorData:this.props.screeningObject.carColorSource,
            }
        }
        this.toNextPage(navigatorParams);
    }

    /**
     * 选择车规
     */
    pushCarSpecificationAction=()=>{
        let navigatorParams = {
            name: "CarSpecificationScene",
            component: CarSpecificationScene,
            params: {
                checkedSpecification:this.checkedSpecification,
                carSpecificationData:this.props.screeningObject.carSpecificationSource,
                isAllChecked:true,
            }
        }
        this.toNextPage(navigatorParams);
    }

    cityUnlimitedAction=()=>{

        this.refs.cityView.setContent('全国');
        this.props.screeningObject.checkedCity.title = '';
        this.props.screeningObject.checkedCity.city_id='';
        this.props.screeningObject.checkedCity.provice_id =0;
    }


    carUnlimitedAction=()=>{
        this.refs.carView.setContent('不限');
        this.props.screeningObject.checkedCarType.title = '';
        this.props.screeningObject.checkedCarType.brand_id = 0;
        this.props.screeningObject.checkedCarType.series_id = 0;
    }


    carDischargeClick=(dischargeObject)=>{
        this.refs.carDischargeView.setContent(dischargeObject.title);
        this.props.screeningObject.checkedCarDischarge.title = dischargeObject.title;
        this.props.screeningObject.checkedCarDischarge.value = dischargeObject.value;

    }

    carBodyColorClick=(carBodyColorSceneObject)=>{

        console.log(carBodyColorSceneObject);
        this.refs.carColorView.setContent(carBodyColorSceneObject.title);
        this.props.screeningObject.checkedCarColor.title = carBodyColorSceneObject.title;
        this.props.screeningObject.checkedCarColor.value = carBodyColorSceneObject.title+'|'+carBodyColorSceneObject.value;

    }

    checkedSpecification=(specificationData)=>{
        this.refs.carSpecificationView.setContent(specificationData.subTitle?specificationData.subTitle:specificationData.title);
        this.props.screeningObject.checkedCarSpecification.title = specificationData.subTitle?specificationData.subTitle:specificationData.title;
        this.props.screeningObject.checkedCarSpecification.mainValue = specificationData.title;
        this.props.screeningObject.checkedCarSpecification.subValue = specificationData.subTitle;

    }


    checkedCityClick=(cityType)=>{

        this.refs.cityView.setContent(cityType.city_name);
        this.props.screeningObject.checkedCity.title = cityType.city_name;
        this.props.screeningObject.checkedCity.city_id = cityType.city_id;
        this.props.screeningObject.checkedCity.provice_id = cityType.provice_id;
    }

    checkedCarClick=(carObject)=>{

        let title = carObject.series_id == 0 ? carObject.brand_name : carObject.series_name;
        this.refs.carView.setContent(title);
        this.props.screeningObject.checkedCarType.title = title;
        this.props.screeningObject.checkedCarType.brand_id = carObject.brand_id;
        this.props.screeningObject.checkedCarType.series_id = carObject.series_id;
    }

    carPriceClick=(checkedObject)=>{
        this.props.screeningObject.checkedCarPrice.title = checkedObject.title;
        this.props.screeningObject.checkedCarPrice.value = checkedObject.value;
    }

    carAgeClick=(checkedObject)=>{
        this.props.screeningObject.checkedCarAgeType.title = checkedObject.title;
        this.props.screeningObject.checkedCarAgeType.value = checkedObject.value;
    }

    carKMClick=(checkedObject)=>{
        this.props.screeningObject.checkedCarKMType.title = checkedObject.title;
        this.props.screeningObject.checkedCarKMType.value = checkedObject.value;
    }

    /**
     * 车辆类型（选择）：新车、二手车、平行进口车
     * @param checkedObject
     */
    carTypeClick=(checkedObject)=>{
        this.props.screeningObject.checkedCarGenre.title = checkedObject.title;
        this.props.screeningObject.checkedCarGenre.value = checkedObject.value;
    }

    carNatureClick=(checkedObject)=>{
        this.props.screeningObject.checkedCarNature.title = checkedObject.title;
        this.props.screeningObject.checkedCarNature.value = checkedObject.value;
    }

    /**
     * from @zhengnan
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


class SelectView extends Component{

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            content:this.props.content
        };
      }
    render(){
        return(
            <View style={styles.selectView}>
                <View>
                    <Text allowFontScaling={false}  style={styles.titleText}>{this.props.title}</Text>
                </View>
                <TouchableOpacity style={styles.selectRightView} onPress={this.props.selectCilck}>
                    <Text allowFontScaling={false}  style={styles.contentText}>{this.state.content}</Text>
                    <Image source={require('../../images/financeImages/celljiantou.png')}/>
                </TouchableOpacity>

            </View>
        )
    }

    setContent=(content)=>{
        this.setState({
            content:content,
        });
    }
}

class CheckedView extends Component{

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            currentChecked:this.props.currentChecked,
        };
      }
    render(){
        return(
            <View style={styles.checkedView}>
                <Text allowFontScaling={false}  style={styles.titleText}>{this.props.title}</Text>
                {
                    this.props.contentView && this.props.contentView()
                }
                {
                    this.props.dataArray && (
                        <View style={styles.checkedContentView}>
                            {
                                this.props.dataArray.map((data, index) => {
                                    return (
                                        <TouchableOpacity style={{height:Pixel.getPixel(20), marginTop:Pixel.getPixel(10),marginBottom:Pixel.getPixel(5),
                                        }} onPress={()=>
                                        {
                                            if(this.state.currentChecked!=data.name){
                                                this.setState({
                                                    currentChecked:data.name,
                                                });
                                                this.props.checkedClick({title:data.name,value:data.value});

                                            }else {
                                                this.setState({
                                                    currentChecked:'',
                                                });
                                                this.props.checkedClick({title:'',value:''});
                                            }

                                        }} activeOpacity={1} key={index}>
                                            <View style={[styles.checkedItemView,(this.state.currentChecked==data.name?{borderColor:fontAndColor.COLORB0}:{borderColor:fontAndColor.COLORA2})]}>
                                                <Text allowFontScaling={false}  style={[styles.checkedItemText,(this.state.currentChecked==data.name?{color:fontAndColor.COLORB0}:{color:fontAndColor.COLORA2})] }> {data.name} </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    )
                }

            </View>
        )
    }
}

class CheckedItemView extends Component{

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isHighlight:this.props.currentChecked==this.props.data.title?true:false,
        };
      }


    closeHighlight=()=>{
        this.setState({
            isHighlight:false,
        });
    };

    render(){
        return(
            <TouchableOpacity style={{height:20, marginTop:10,marginBottom:5,
            }} onPress={()=>
            {
                if(this.state.isHighlight){
                    this.props.checkedClick({title:'',value:'0'});
                }else{
                    this.props.checkedClick({title:this.props.data.title,value:this.props.data.value});
                }
                this.setState({
                    isHighlight:!this.state.isHighlight,
                });

            }}>
                <View style={[styles.checkedItemView,(this.state.isHighlight?{borderColor:fontAndColor.COLORB0}:{borderColor:fontAndColor.COLORA2})]}>
                    <Text allowFontScaling={false}  style={[styles.checkedItemText,(this.state.isHighlight?{color:fontAndColor.COLORB0}:{color:fontAndColor.COLORA2})] }>{this.props.data.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({

    rootContainer:{
        flex: 1,
        backgroundColor:fontAndColor.COLORA3,
        paddingTop:Pixel.getTitlePixel(69),
    },
    selectView:{
        height:Pixel.getPixel(44),
        paddingLeft:Pixel.getPixel(15),
        paddingRight:Pixel.getPixel(15),
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'white',
        marginTop:Pixel.getPixel(10),
    },
    selectRightView:{
        flexDirection:'row',
    },
    checkedView:{
        paddingVertical:Pixel.getPixel(15),
        marginTop:10,
        backgroundColor:'white',
        paddingLeft:Pixel.getPixel(15),

    },
    checkedContentView:{
        flexDirection:'row',
        flexWrap: 'wrap',
    },
    checkedItemView:{

        borderColor:fontAndColor.COLORA2,
        borderWidth:StyleSheet.hairlineWidth,
        marginRight:Pixel.getPixel(15),
        backgroundColor:'white',
        height:Pixel.getPixel(20),
        alignItems:'center',
        justifyContent:'center',
        paddingHorizontal:Pixel.getPixel(5),
        borderRadius:3,


    },
    checkedItemText:{
        color:fontAndColor.COLORA2,
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
    },
    titleText:{
        color:fontAndColor.COLORA0,
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT),

    },
    contentText:{
        color:fontAndColor.COLORA2,
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        marginRight:Pixel.getPixel(5),
    },
    textInput:{
        borderColor: fontAndColor.COLORA0,
        paddingTop:0,
        paddingBottom:0,
        paddingLeft:0,
        paddingRight:0,
        backgroundColor:fontAndColor.COLORA3,
        width:Pixel.getPixel(80),
        height: Pixel.getPixel(20),
        textAlign:'center',
        fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24)
    },
    textInputTitle: {
        color: fontAndColor.COLORA0,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        marginLeft: Pixel.getPixel(5),
        textAlign: 'right',
    }

});