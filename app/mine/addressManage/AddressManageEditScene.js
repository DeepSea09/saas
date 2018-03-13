import  React from  'react'
import  {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    TextInput,
    Image,
    NativeModules,
    Platform
} from  'react-native'

import * as fontAndColor from '../../constant/fontAndColor';
import  PixelUtil from '../../utils/PixelUtil'
let Pixel = new PixelUtil();
import BaseComponent from "../../component/BaseComponent";
import NavigatorView from '../../component/AllNavigationView';
const arrow_img = require('../../../images/mine/celljiantou.png');
import {request} from '../../utils/RequestUtil';
import * as Urls from '../../constant/appUrls';
import CityRegionScene from './CityRegionScene';
const IS_ANDROID = Platform.OS === 'android';
const dismissKeyboard = require('dismissKeyboard');


export default class AddressManageEditScene extends BaseComponent {

    constructor(props) {
        super(props);
        this.item = this.props.item;
        this.pro_city = '';
        if(!this._isEmpty(this.item.province)){
            this.pro_city = this.item.province + this.item.city + this.item.district;
        }
        this.state ={
            cityStatus:false,
            region_city:this.pro_city,
            region_address:this.item.address
        };


    }


    _onTextChange = (type,text)=>{
        if(type === '1'){
            this.item.contact_name = text;
        }else if(type === '2'){
            this.item.contact_phone = text;
        }
    };

    _onSave = ()=>{
        if(this._isEmpty(this.item.contact_name)){
            this.props.showToast('请填写提车人');
            return;
        }
        if(this._isEmpty(this.item.contact_phone)){
            this.props.showToast('请填写手机号');
            return;
        }
        if(this._isEmpty(this.item.province)){
            this.props.showToast('请选择区域');
            return;
        }
        if(this._isEmpty(this.item.address)){
            this.props.showToast('请选择详细地址');
            return;
        }
        this.props.showModal(true);
        let maps = {
            company_id:global.companyBaseID,
            contact_name:this.item.contact_name,
            contact_phone:this.item.contact_phone,
            province:this.item.province,
            province_code:this.item.province_code,
            city:this.item.city,
            city_code:this.item.city_code,
            district:this.item.district,
            district_code:this.item.district_code,
            address:this.item.address,
            latitude:this.item.latitude,
            longitude:this.item.longitude,
            is_default:'0'
        };
        let url = Urls.ADD_ADDRESS;
        if(this.props.isEdit){
            url = Urls.PUT_ADDRESS;
            maps.address_id = this.item.id;
            maps.is_default=this.item.is_default;
        }
        request(url, 'Post', maps)
            .then(
                (response) => {
                    this.props.showModal(false);
                    if(response.mycode === 1){
                        this.backPage();
                        this.props.refreshData();
                    }
                },
                (error) => {
                    this.props.showToast(error.mjson.msg);
                });
    };

    _toAddress = ()=>{
        if(this._isEmpty(this.item.province)){
            this.props.showToast('请先选择区域');
            return;
        }

        if(IS_ANDROID){
            let cRegion ={
                provinceName:this.item.province,
                cityName:this.item.city,
                districtName:this.item.district,
                addressName:this._isEmpty(this.item.address)?'':this.item.address,
                longitude:this._isEmpty(this.item.longitude)?'':this.item.longitude,
                latitude:this._isEmpty(this.item.latitude)?'':this.item.latitude,
            };
            NativeModules.QrScan.bdAddress(cRegion).then(
                (suc)=>{
                    console.log('11111',suc);
                    this.item.address = suc.address;
                    this.item.latitude = suc.latitude;
                    this.item.longitude = suc.longitude;
                    this.setState({
                        region_address:this.item.address
                    });

                },
                (error)=>{}
            );
        }else{
            let adr = this.item.district;
            let ll = {
                longitude:this._isEmpty(this.item.longitude)?'':this.item.longitude,
                latitude:this._isEmpty(this.item.latitude)?'':this.item.latitude,
            };

            NativeModules.ZNMapManger.cityName(this.item.city,adr,ll,(error,data)=>{
                this.item.address = data.address;
                this.item.latitude = data.location.latitude;
                this.item.longitude = data.location.longitude;
                this.setState({
                    region_address:this.item.address
                });
            });
        }


    };

    _toProvince = ()=>{
        dismissKeyboard();
        this.setState({cityStatus:true});
    };

    _closeProvince = ()=>{
        this.setState({cityStatus:false});
    };

    _showModal = (show)=>{
        this.props.showModal(show);
    };

    checkAreaClick = (cityRegion)=>{
        this.item.province = cityRegion.provice_name;
        this.item.province_code = cityRegion.provice_code;
        this.item.city = cityRegion.city_name;
        this.item.city_code = cityRegion.city_code;
        this.item.district = cityRegion.district_name;
        this.item.district_code = cityRegion.district_code;
        this.aRegion.setNativeProps({
            text:cityRegion.provice_name + ' ' + cityRegion.city_name + ' ' + cityRegion.district_name
        })
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.hintStyle}>
                    <Text style={styles.hintText}>{'以下为物流服务的发车地址，请确保地址无误'}</Text>
                </View>
                <View style={styles.itemView}>
                    <Text style={styles.itemLeftText}>{'联系人'}</Text>
                    <TextInput
                        style={styles.itemRightText}
                        underlineColorAndroid='transparent'
                        placeholder={'请输入'}
                        defaultValue={this.item.contact_name}
                        onChangeText={(text)=>{this._onTextChange('1',text)}}
                    />
                </View>
                <View style={styles.itemSeparator}/>
                <View style={styles.itemView}>
                    <Text style={styles.itemLeftText}>{'手机号'}</Text>
                    <TextInput
                        style={styles.itemRightText}
                        underlineColorAndroid='transparent'
                        placeholder={'请输入'}
                        defaultValue={this.item.contact_phone}
                        keyboardType={'numeric'}
                        onChangeText={(text)=>{this._onTextChange('2',text)}}
                    />
                </View>
                <View style={styles.itemSeparator}/>
                <View style={styles.itemView}>
                    <Text style={styles.itemLeftText}>{'区域'}</Text>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        style={styles.itemRightSelect}
                        onPress={this._toProvince}
                    >
                        <TextInput
                            ref={(ref)=>{this.aRegion = ref;}}
                            style={styles.itemRightText}
                            underlineColorAndroid='transparent'
                            placeholder={'请选择'}
                            defaultValue={this.pro_city}
                            editable = {false}
                            placeholderTextColor={fontAndColor.COLORA1}
                        />
                        <Image style={styles.arrowStyle} source={arrow_img}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.itemSeparator}/>
                <View style={styles.itemView}>
                    <Text style={styles.itemLeftText2}>{'详细地址'}</Text>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        style={styles.itemRightSelect2}
                        onPress={this._toAddress}
                    >
                        <Text ref = {(ref)=>{this.mAddress = ref}}
                              onContentSizeChange={this._onContentSizeChange}
                              style={this.state.region_address ? styles.itemRightText : styles.itemRightText2}>{this.state.region_address ? this.state.region_address : '请选择'}</Text>
                        <Image style={styles.arrowStyle} source={arrow_img}/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.btnStyle}
                                  activeOpacity={0.6}
                                  onPress={this._onSave}>
                    <Text style={styles.btnText}>保存</Text>
                </TouchableOpacity>

                <NavigatorView title={'新增地址'} backIconClick={this.backPage}/>
                {
                    this.state.cityStatus && <CityRegionScene checkAreaClick={this.checkAreaClick} showModal={this._showModal} closePress={this._closeProvince}/>
                }

            </View>
        );
    }

    _onContentSizeChange = (event)=>{
        console.log('111111111343');
        let {width, height} = event.nativeEvent.contentSize;
        if(height > Pixel.getPixel(23)){
            this.mAddress.setNativeProps({
                textAlign:'left',
            })
        }

    };

    _isEmpty = (str)=>{
        if(typeof(str) != 'undefined' && str !== ''){
            return false;
        }else {
            return true;
        }
    };
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        marginTop: Pixel.getPixel(0),
        backgroundColor: fontAndColor.COLORA3,
    },
    hintStyle:{
        backgroundColor:fontAndColor.COLORB8,
        height:Pixel.getPixel(44),
        marginTop:Pixel.getTitlePixel(64),
        justifyContent:'center',
        paddingLeft:Pixel.getPixel(15)
    },
    hintText:{
        color:fontAndColor.COLORB7,
        fontSize:Pixel.getFontPixel(15)
    },
    itemView:{
        height:Pixel.getPixel(46),
        backgroundColor:'white',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal:Pixel.getPixel(15),
    },
    itemLeftText:{
        fontSize:Pixel.getFontPixel(15),
        color:fontAndColor.COLORA1,
        flex:1
    },
    itemRightSelect:{
        flex:2,
        flexDirection:'row',
        alignItems:'center'
    },
    itemLeftText2:{
        fontSize:Pixel.getFontPixel(15),
        color:fontAndColor.COLORA1,
        width:Pixel.getPixel(70)
    },
    itemRightSelect2:{
        flex:1,
        flexDirection:'row',
        alignItems:'center'
    },
    itemRightText2:{
        color:fontAndColor.COLORA1,
        fontSize:Pixel.getFontPixel(15),
        textAlign:'right',
        flex:1
    },
    itemRightText:{
        color:'black',
        fontSize:Pixel.getFontPixel(15),
        flex:1,
        textAlign:'right',
        paddingHorizontal:0
    },
    itemSeparator:{
        borderColor:fontAndColor.COLORA3,
        borderTopWidth:1
    },
    btnStyle:{
        borderRadius:Pixel.getPixel(5),
        height:Pixel.getPixel(46),
        backgroundColor:fontAndColor.COLORB0,
        marginTop:Pixel.getPixel(30),
        marginHorizontal:Pixel.getPixel(15),
        justifyContent:'center',
        alignItems:'center'
    },
    btnText:{
        fontSize:Pixel.getFontPixel(15),
        color:'#ffffff'
    },
    arrowStyle:{
        height:Pixel.getPixel(16),
        width:Pixel.getPixel(10),
        marginLeft:Pixel.getPixel(5)
    }
});