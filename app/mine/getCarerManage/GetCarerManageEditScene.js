import  React from  'react'
import  {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    TextInput
} from  'react-native'

import * as fontAndColor from '../../constant/fontAndColor';
import  PixelUtil from '../../utils/PixelUtil'
let Pixel = new PixelUtil();
import BaseComponent from "../../component/BaseComponent";
import NavigatorView from '../../component/AllNavigationView';
import {request} from '../../utils/RequestUtil';
import * as Urls from '../../constant/appUrls';

export default class GetCarerManageEditScene extends BaseComponent {

    constructor(props) {
        super(props);
        this.item = this.props.item;
    }

    _onTextChange = (type,text)=>{
        if(type === '1'){
            this.item.name = text;
        }else if(type === '2'){
            this.item.phone = text;
        }else if(type === '3'){
            this.item.id_card = text;
        }
    };

    _onSave = ()=>{
        if(this._isEmpty(this.item.name)){
            this.props.showToast('请填写提车人');
            return;
        }
        if(this._isEmpty(this.item.phone)){
            this.props.showToast('请填写手机号');
            return;
        }
        if(this._isEmpty(this.item.id_card)){
            this.props.showToast('请填写身份证号');
            return;
        }

        this.props.showModal(true);
        let maps = {
            company_id:global.companyBaseID,
            name:this.item.name,
            phone:this.item.phone,
            id_card:this.item.id_card,
            is_default:'0'
        };
        let url = Urls.ADD_GETER;
        if(this.props.isEdit){
            url = Urls.PUT_GETER;
            maps.geter_id = this.item.id;
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

    render() {
        return (
            <View style={styles.container}>
                <NavigatorView title={'新增提车人'} backIconClick={this.backPage}/>
                <View style={styles.hintStyle}>
                    <Text style={styles.hintText}>{'以下为提车人信息，请确保填写正确'}</Text>
                </View>
                <View style={styles.itemView}>
                    <Text style={styles.itemLeftText}>{'提车人'}</Text>
                    <TextInput
                        style={styles.itemRightText}
                        underlineColorAndroid='transparent'
                        placeholder={'请输入'}
                        defaultValue={this.item.name}
                        onChangeText={(text)=>{this._onTextChange('1',text)}}
                    />
                </View>
                <View style={styles.itemSeparator}/>
                <View style={styles.itemView}>
                    <Text style={styles.itemLeftText}>{'联系方式'}</Text>
                    <TextInput
                        style={styles.itemRightText}
                        underlineColorAndroid='transparent'
                        placeholder={'请输入'}
                        defaultValue={this.item.phone}
                        onChangeText={(text)=>{this._onTextChange('2',text)}}
                        keyboardType={'numeric'}
                    />
                </View>
                <View style={styles.itemSeparator}/>
                <View style={styles.itemView}>
                    <Text style={styles.itemLeftText}>{'身份证号'}</Text>
                    <TextInput
                        style={styles.itemRightText}
                        underlineColorAndroid='transparent'
                        placeholder={'请输入'}
                        defaultValue={this.item.id_card}
                        onChangeText={(text)=>{this._onTextChange('3',text)}}
                        keyboardType={'numeric'}
                    />
                </View>
                <TouchableOpacity style={styles.btnStyle}
                                  activeOpacity={0.6}
                                  onPress={this._onSave}
                >
                    <Text style={styles.btnText}>保存</Text>
                </TouchableOpacity>
            </View>
        );
    }

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
        flex: 1,
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
    itemRightText:{
        color:'black',
        fontSize:Pixel.getFontPixel(15),
        flex:2,
        textAlign:'right'
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
    }
});