/**
 * Created by lhc on 2017/2/15.
 */
import React, {Component, PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    ListView,
    NativeModules
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../../constant/fontAndColor';
export  default class PurchasePickerItem extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            dataList: []
        }
    }

    changeShow = (dataList) => {
        this.setState({
            width: width,
            height: height,
            dataList: dataList
        });
    }

    render() {
        let viewList = [];
        for (let i = 0; i < this.state.dataList.length; i++) {
            viewList.push(<TouchableOpacity key={'top'+i} onPress={()=>{
                        this.setState({
                            width: 0,
                            height: 0
                        },()=>{this.props.selectType(this.state.dataList[i].transportTypeCode,
                        this.state.dataList[i].transportType);});
                    }} activeOpacity={1}
                                            style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                <Text allowFontScaling={false}
                      style={{fontSize: Pixel.getFontPixel(15),color:'#000'}}>{this.state.dataList[i].transportType}</Text>
            </TouchableOpacity>)
            viewList.push(<View key={'bottom'+i} style={{width:width-Pixel.getPixel(30),height:Pixel.getPixel(1),
                backgroundColor:'#d8d8d8',marginLeft:Pixel.getPixel(15)}}></View>)
        }
        return (
            <TouchableOpacity onPress={()=>{
                 this.setState({
                        width: 0,
                        height: 0
                 });
            }} activeOpacity={1}
                              style={[{overflow:'hidden',
            justifyContent:'flex-end',backgroundColor:'rgba(0,0,0,0.6)',position: 'absolute',
                                  left:0,
                                  right:0,
                                  bottom:0,},
            this.state.height==0?{width:this.state.width,height:this.state.height,}:{top:0}]}>
                <View style={{width:width,height:Pixel.getPixel((this.state.dataList.length+1)*50),
                backgroundColor:'#fff'}}>
                    {viewList}
                    <TouchableOpacity onPress={()=>{
                                      this.setState({
                                            width: 0,
                                            height: 0
                                      });
                    }} activeOpacity={1}
                                      style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                        <Text allowFontScaling={false}
                              style={{fontSize: Pixel.getFontPixel(15),color:'#90A1B5'}}>取消</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    }


}
