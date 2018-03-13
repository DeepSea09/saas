import React, {Component} from 'react';
import {
    View,
    Modal,
    Text,
    TouchableOpacity,
    ListView,
} from 'react-native';
import PixelUtil from '../../../utils/PixelUtil'

let Pixel = new PixelUtil();
let Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');
import * as fontAndColor from '../../../constant/fontAndColor';
import BaseComponent from "../../../component/BaseComponent";

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
export default class SelectProvinceCityModal extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        this.repoId='';
        this.datas=this.props.datas;
        this.state = {
            dataSource:ds.cloneWithRows(this.datas) ,
        }

    }

    setSelect=(data,index)=>{
        this.repoId=data.repoId;
        this.index=index;
        this.datas.map((data)=>{
            data.check=false;
        });
        this.datas[index].check=true;
        this.setState({
            dataSource:ds.cloneWithRows(this.datas) ,
        });
    }
    _renderRow=(data,s,index)=>{
        return(<TouchableOpacity activeOpacity={0.8} onPress={() => {
            this.setSelect(data,index)
        }}>

            <View style={[{
                flexDirection: 'row',
                height: Pixel.getPixel(40),
                width:width,
                alignItems: 'center',
                backgroundColor:'white',
                borderBottomWidth:1,
                paddingHorizontal:Pixel.getPixel(35),
                justifyContent: 'space-between',
                borderColor:fontAndColor.COLORA4
            },data.check&&{backgroundColor:fontAndColor.COLORA3,}]}>
                <Text
                    style={[{color: fontAndColor.COLORA1,fontSize:14}, data.check && {color: 'black',fontSize:16}]}>{data.province}</Text>
                <Text
                    style={[{color: fontAndColor.COLORA1,fontSize:14}, data.check && {color: 'black',fontSize:16}]}>{data.city}</Text>
                <Text
                    style={[{color: fontAndColor.COLORA1,fontSize:14}, data.check && {color: 'black',fontSize:16}]}>{data.country}</Text>
            </View>
        </TouchableOpacity>)

    }

    render() {
        return (
            <View
                style={{
                    width: width,
                    height: height,
                    backgroundColor:'rgba(0,0,0,0.3)',
                    position:'absolute',
                    top:0,
                }}>
                <View style={{
                    height: Pixel.getPixel(280),
                    backgroundColor: 'white',
                    width:Pixel.getPixel(width),
                    position:'absolute',
                    bottom:Pixel.getPixel(5),
                }}>
                    <View style={{height:Pixel.getPixel(280)}}>
                        <View style={{
                            width:width,
                            height: Pixel.getPixel(40),
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal:Pixel.getPixel(18),
                            alignItems: 'center',
                            borderBottomWidth:1,
                            borderColor:fontAndColor.COLORA4
                        }}>
                            <TouchableOpacity activeOpacity={0.8} onPress={()=>{
                                this.props.closeModal();
                            }}>
                                <Text style={{color:fontAndColor.COLORB0,textAlign:'center',
                                    fontSize:16
                                }}>取消</Text>
                            </TouchableOpacity>
                            <Text>选择城市</Text>
                            <TouchableOpacity activeOpacity={0.8} onPress={()=>{
                                    this.props.confirm(this.repoId,this.index);
                            }}>
                                <Text style={{color:fontAndColor.COLORB0,textAlign:'center',fontSize:16}}>确定</Text>
                            </TouchableOpacity>

                        </View>

                        <ListView
                            dataSource={this.state.dataSource}
                            renderRow={this._renderRow}
                        />
                    </View>

                </View>

            </View>
        );
    }
}