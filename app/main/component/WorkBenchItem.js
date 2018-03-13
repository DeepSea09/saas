import React, {Component, PureComponent} from 'react';
import {
    AppRegistry,
    View,
    TouchableOpacity,
    Text,
    Image,
    StyleSheet,
    Dimensions,
} from 'react-native';

let {height, width} = Dimensions.get('window');
import  PixelUtil from '../../utils/PixelUtil'
import  * as fontAndColor from '../../constant/fontAndColor'
var Pixel = new PixelUtil();
import HomeJobButton from './HomeJobButton';
export default class HomeJobItem extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0
        }
    }

    componentWillMount() {
        this.list = [];
        this.list = this.props.items.childList;
    }

    render() {
        let firstChild = [];
        let itemList = [];
        for (let i = 0; i < this.list.length; i++) {
            firstChild.push(<HomeJobButton key={'job'+i} image={this.list[i].image}
                                           name={this.list[i].name}
                                           click={()=>{ if(this.list[i].componentName){
                                               this.props.callBack(
                                                   {    name:this.list[i].componentName,
                                                       id:this.list[i].id,
                                                       component:this.list[i].component,params:{}}
                                               )
                                           }else{
                                               this.list[i].pushAction();
                                           }
                                           }}/>);
        }
        let index = Math.ceil(firstChild.length / 4);
        for (let i = 0; i < index; i++) {
            if (i == 0) {
                let child = [];
                for (let j = 0; j < firstChild.length; j++) {
                    child.push(firstChild[j]);
                }
                if (child.length > 4) {
                    child.splice(4, child.length);
                }
                itemList.push(<View key={'view'+i} style={[{marginTop:Pixel.getPixel(15),width:width,
                flexDirection: 'row'},i==index-1?{marginBottom:Pixel.getPixel(20)}:{}]}>
                    {child}
                </View>);
            } else {
                let child = [];
                for (let j = i * 4; j < firstChild.length; j++) {
                    child.push(firstChild[j]);
                }
                if (child.length > 4) {
                    child.splice(3, child.length);
                }
                itemList.push(<View key={'view'+i} style={[{marginTop:Pixel.getPixel(22),width:width,
                flexDirection: 'row'},i==index-1?{marginBottom:Pixel.getPixel(20)}:{}]}>
                    {child}
                </View>);
            }
        }
        // itemList.push(<View key={'view1'} style={[{marginTop:Pixel.getPixel(27),width:width,
        // flexDirection: 'row'},this.list.length > 4?{}:{marginBottom:Pixel.getPixel(20)}]}>
        //     {firstChild}
        // </View>);
        // if (this.list.length > 4) {
        //     itemList.push(<View key={'view2'} style={{marginTop:Pixel.getPixel(27),marginBottom:Pixel.getPixel(20),
        //     width:width,flexDirection: 'row'}}>
        //     </View>)
        // }
        return (
            <View style={{width:width,backgroundColor:'#fff'}}>
                <View style={{width:width,flexDirection:'row',marginTop:Pixel.getPixel(17)}}>
                    <View style={{
                        width: Pixel.getPixel(3), height: Pixel.getPixel(14),
                        marginLeft: Pixel.getPixel(15), backgroundColor: fontAndColor.COLORB0
                    }}></View>
                    <Text style={{
                        fontSize: Pixel.getFontPixel(13), color: fontAndColor.COLORA1,
                        marginLeft: Pixel.getPixel(5)
                    }}>{this.props.items.name}</Text>
                </View>
                {itemList}
            </View>
        );
    }
}