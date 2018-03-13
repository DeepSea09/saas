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
export default class HomeJobButton extends PureComponent {

    constructor(props) {
        super(props);

    }

    componentWillMount() {

    }

    render() {
        return (
            <TouchableOpacity onPress={()=>{
                this.props.click();
            }} activeOpacity={0.8}
                              style={{width:Pixel.getPixel(67),
                                                 marginRight:(width-Pixel.getPixel(67)*4)/8
                                                 ,marginLeft:(width-Pixel.getPixel(67)*4)/8,
                                                 alignItems:'center'}}>
                <Image style={{resizeMode: 'stretch',height:Pixel.getPixel(48),
                    width:Pixel.getPixel(48),
                    }} source={this.props.image}/>
                <Text style={{fontSize: Pixel.getFontPixel(13),color:'#000',
                    marginTop:Pixel.getPixel(7)}}>{
                    this.props.name
                }</Text>
            </TouchableOpacity>
        );
    }
}
