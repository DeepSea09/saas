/**
 * Created by zhengnan on 2017/5/15.
 */

import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    Dimensions
} from 'react-native';

import BaseComponent from '../../component/BaseComponent';
import AllNavigationView from  '../../component/AllNavigationView';
import *as fontAndColor from  '../../constant/fontAndColor';
import Grid from '../../publish/component/Grid';
import PixelUtil from  '../../utils/PixelUtil';
let Pixel = new  PixelUtil();
const sceneWidth = Dimensions.get('window').width;

const background = require('../../../images/publish/background.png');

export default class CarDischargeScene extends  BaseComponent{

    initFinish=()=>{

    };

    // 构造
    constructor(props) {
        super(props);
        // this.viewData = [
        //     {title: '国Ⅱ', selected: false,index:0,value:'naitonal_ii'},
        //     {title: '欧Ⅳ', selected: false,index:1,value:'european_iv'},
        //     {title: '国Ⅲ', selected: false,index:2,value:'naitonal_iii'},
        //     {title: '欧Ⅴ', selected: false,index:3,value:'european_v'},
        //     {title: '国Ⅳ', selected: false,index:4,value:'naitonal_iv'},
        //     {title: '欧Ⅵ', selected: false,index:5,value:'european_vi'},
        //     {title: '国Ⅴ', selected: false,index:6,value:'naitonal_v'},
        //     {title: '欧Ⅲ', selected: false,index:7,value:'european_iii'},
        //     {title: '京Ⅴ', selected: false,index:8,value:'beijing_v'},
        //     {title: '欧Ⅱ', selected: false,index:9,value:'european_ii'},
        //     {title: 'OBD', selected: false,index:10,value:'obd'},
        //     {title: '欧Ⅰ', selected: false,index:11,value:'european_i'},
        // ];

        // this.viewData.map((data,index)=>{
        //     if(data.title == this.props.currentChecked)
        //     {
        //         data.selected = true;
        //     }
        // });

        this.viewData = this.props.DischargeData;
        let nodeNumber = 2; // 节点数
        if(this.viewData){
            let length = this.viewData.length;
            if(length % nodeNumber!==0){
                let number =(length % nodeNumber);
                console.log('number:',number,'length',length,);
                for(let i=0;i<number;i++){
                    this.viewData.push({
                        name:'',
                        value:''
                    });
                }
            }
        }
        this.viewData.map((data,index)=>{
            data.index = index;
            if(data.name == this.props.currentChecked)
            {
                data.selected = true;
            }else {
                data.selected = false;
            }
        });



        this.state = {
            dataSource: this.viewData,
        }
    }

    render(){
        return(
            <View style={styles.rootContainer}>
                <Image  style={{width:sceneWidth,paddingHorizontal:Pixel.getPixel(43),paddingTop:Pixel.getPixel(20)}} source={background}>
                    <View style={{flex:1}}>
                <Grid
                    ref = {(grid)=>{this.interiorGrid = grid}}
                    style={styles.girdContainer}
                    renderItem={this._renderItem}
                    data={this.state.dataSource}
                    itemsPerRow={2}
                />
                    </View>
                </Image>
                <AllNavigationView title="选择排放标准" backIconClick={this.backPage} />
            </View>
        )
    }

    _renderItem = (data, i) => {

        if(!data.name) {
            return (
                <View key={i}>

                </View>
            );
        }
        if (data.selected === true) {
            return (
                <TouchableOpacity
                    key={data.index}
                    style={styles.selectItem}
                    activeOpacity={0.6}
                    onPress={()=>{this._labelPress(data.index)}}
                >
                    <View >
                        <Text allowFontScaling={false}  style={styles.selectText}>
                            {data.name}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        } else if (data.selected === false) {
            return (
                <TouchableOpacity
                    key={data.index}
                    style={styles.defaultItem}
                    activeOpacity={0.6}
                    onPress={()=>{this._labelPress(data.index)}}
                >
                    <View >
                        <Text allowFontScaling={false}  style={styles.defaultText}>
                            {data.name}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        }
    };
    _labelPress = (i) => {

        this.props.checkedCarDischargeClick({
            title:this.viewData[i].name,
            value:this.viewData[i].value,
        });
        this.backPage();

        // this.viewData.map((data,index)=>{
        //     data.selected = (i === index);
        // });
        //
        // this.interiorGrid.refresh(this.viewData);
    };
}

const styles = StyleSheet.create({
    rootContainer:{
        flex:1,
        backgroundColor:fontAndColor.COLORA3,
        paddingTop:Pixel.getTitlePixel(64),
    },

    defaultItem: {
        height:  Pixel.getPixel(41),
        width:  Pixel.getPixel(132),
        marginTop: Pixel.getPixel(10),
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius:  Pixel.getPixel(20),
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    defaultText: {
        fontSize: Pixel.getFontPixel(15),
        color: '#FFFFFF'
    },
    selectItem: {
        height:  Pixel.getPixel(41),
        width:  Pixel.getPixel(132),
        marginTop: Pixel.getPixel(10),
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius:  Pixel.getPixel(20),
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectText: {
        fontSize: Pixel.getFontPixel(15),
        color: fontAndColor.COLORB1
    },
    emptyItem: {
        height:  Pixel.getPixel(41),
        width:  Pixel.getPixel(132),
        marginTop: Pixel.getPixel(10),
        backgroundColor: 'transparent'
    },
});
