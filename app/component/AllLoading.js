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
export default class AllLoading extends Component {

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
                        if(this.props.canColse == 'false' ){

                        }else {
                           this.setState({
                            isShow: false
                           });
                        }
                    }}
                    activeOpacity={1}
                    style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.3)'}}>
                    <View style={{width:width-width/4,height:Pixel.getPixel(155),backgroundColor:'#fff',
                        paddingLeft:Pixel.getPixel(20),paddingRight:Pixel.getPixel(20),justifyContent:'center',alignItems: 'center'}}>
                        {
                            this.props.showDelete && (
                                <TouchableOpacity style={{top:0,right:0,position:'absolute', alignItems:'center',justifyContent:'center',width:Pixel.getPixel(40),height:Pixel.getPixel(40)}} activeOpacity={1} onPress={()=>{this.setState({isShow: false})}}>
                                <Image style={{width:Pixel.getPixel(20),height:Pixel.getPixel(20)}} source={require('../../images/deleteIcon3x.png')}/>
                            </TouchableOpacity>)
                        }
                        <Text allowFontScaling={false}
                              style={{fontSize:Pixel.getPixel(17),fontWeight: 'bold',color:'#000'}}>提示</Text>
                        <Text allowFontScaling={false} style={{textAlign: 'center',fontSize:Pixel.getPixel(14),
                            marginTop: Pixel.getPixel(11),color:'#000'}}>
                            {this.state.content}
                        </Text>
                        <View style={{width:width-width/4-Pixel.getPixel(40),height:Pixel.getPixel(35),
                            marginTop:Pixel.getPixel(16),flexDirection:'row'}}>
                            <TouchableOpacity onPress={()=>{
                                this.props.callEsc();
                                this.setState({
                                    isShow: false
                                });
                            }} activeOpacity={0.9} style={{flex:1,marginRight:Pixel.getPixel(10),backgroundColor:'#90a1b5',borderRadius:3,
                                justifyContent:'center',alignItems:'center'}}>
                                <Text allowFontScaling={false}
                                      style={{fontSize:Pixel.getPixel(14),color:'#fff'}}>{this.props.callEscText?this.props.callEscText:'取消'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{
                                this.props.callBack();
                                this.setState({
                                    isShow: false
                                });
                            }} activeOpacity={0.9} style={{flex:1,marginLeft:Pixel.getPixel(10),backgroundColor:'#05c5c2',borderRadius:3,
                                justifyContent:'center',alignItems:'center'}}>
                                <Text allowFontScaling={false}
                                      style={{fontSize:Pixel.getPixel(14),color:'#fff'}}>{this.props.callBackText?this.props.callBackText:'确定'}</Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }
}