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
import  PixelUtil from '../../../utils/PixelUtil'
let Pixel = new PixelUtil();
let Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');
import * as  fontAndColor from '../../../constant/fontAndColor';
export default class WithdrawalsDialog extends Component {

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isShow: false,
            content: '',
            isSuccess: '1'
        };
    }

    changeShowType = (value, content, isSuccess) => {
        this.setState({
            isShow: value,
            content: content,
            isSuccess: isSuccess
        });
    }


    render() {
        let image = {};
        let title = '';
        if (this.state.isSuccess == '1') {
            title = '提现成功';
            image = require('../../../../images/mainImage/withdrawalssuccess.png');
        } else {
            title = '提现失败';
            image = require('../../../../images/mainImage/withdrawalserror.png');
        }
        return (
            <Modal
                ref='loadingModal'
                animationType={"none"}
                transparent={true}
                visible={this.state.isShow}
                onRequestClose={() => {}}
            >
                {this.state.isSuccess=='3'?<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Image style={{width:60,height:60}} source={require('../../../../images/setDataLoading.gif')}/>
                    </View>:<View
                        style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.3)'}}>
                        <View style={{width:Pixel.getPixel(260),height:Pixel.getPixel(310),backgroundColor:'#fff',
                     justifyContent:'center',alignItems: 'center'}}>
                            <Image style={{width:Pixel.getPixel(163),height:Pixel.getPixel(163)}}
                                   source={image}/>
                            <Text allowFontScaling={false}  style={{fontSize:Pixel.getPixel(20),
                        color: '#000'}}>{title}
                            </Text>
                            {this.state.isSuccess=='1' ? <View/> : <Text allowFontScaling={false}  style={{marginTop:Pixel.getPixel(10),fontSize:Pixel.getPixel(14),
                        color: fontAndColor.COLORA1,marginLeft:Pixel.getPixel(15),marginRight:Pixel.getPixel(15),
                        textAlign: 'center'}}>
                                    {this.state.content}
                                </Text>}
                            <TouchableOpacity
                                activeOpacity={0.8} onPress={()=>{
                                if(this.state.isSuccess=='1'){
                                    this.props.callBack();
                                }
                                this.setState({
                                    isShow:false
                                });
                            }}
                                style={{width:Pixel.getPixel(100),height:Pixel.getPixel(32),backgroundColor:fontAndColor.COLORB0,
                            justifyContent:'center',alignItems: 'center',marginTop: Pixel.getPixel(20)}}>
                                <Text allowFontScaling={false}  style={{fontSize:Pixel.getPixel(15),
                        color: '#fff'}}>确定
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>}

            </Modal>
        );
    }
}