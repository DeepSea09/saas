import React, {Component} from 'react';
import {
    AppRegistry,
    View,
    StatusBar,
    Modal,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
import  PixelUtil from '../utils/PixelUtil'
let Pixel = new PixelUtil();
let Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');
import  * as fontAndColor from '../constant/fontAndColor';
export default class AdjustModal extends Component {

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isShow: false,
            content: ''
        };
    }

    changeShowType = (value, content) => {
        this.setState({
            isShow: value,
            content: content
        });
    }


    render() {
        return (
            <Modal
                ref='loadingModal'
                animationType={"none"}
                transparent={true}
                visible={this.state.isShow}
                onRequestClose={() => {}}
            >
                <TouchableOpacity
                    onPress={()=>{
                       this.setState({
                            isShow: false
                        });
                    }}
                    activeOpacity={1}
                    style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.3)'}}>
                    <View style={{width:width-width/4,height:Pixel.getPixel(155),backgroundColor:'#fff',
                     paddingLeft:Pixel.getPixel(20),paddingRight:Pixel.getPixel(20),justifyContent:'center',alignItems: 'center'}}>
                        <Text allowFontScaling={false}  style={{fontSize:Pixel.getPixel(17),fontWeight: 'bold',color:'#000'}}>使用规则</Text>
                        <Text allowFontScaling={false}  style={{textAlign: 'center',fontSize:Pixel.getPixel(14),
                         marginTop: Pixel.getPixel(11),color:'#000'}}>
                            {this.state.content}
                        </Text>
                        <TouchableOpacity onPress={()=>{
                             this.setState({
                            isShow: false
                        });
                        }} activeOpacity={0.9} style={{width:width-width/4-Pixel.getPixel(40),height:Pixel.getPixel(35),
                         marginTop:Pixel.getPixel(16),flexDirection:'row',
                         justifyContent:'center',alignItems:'center',borderRadius:3,borderWidth:1,borderColor:fontAndColor.COLORB0}}>
                             <Text allowFontScaling={false}  style={{fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),color: fontAndColor.COLORB0}}>我知道了</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }
}