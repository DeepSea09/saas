/**
 * Created by Administrator on 2017/2/13.
 */
import React,{ Component } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Dimensions,
    StyleSheet
} from 'react-native';

import * as fontAndColor from '../../constant/fontAndColor';
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
const {width,height} = Dimensions.get('window');

export default class ImageSource extends Component{

    constructor(props){
        super(props);
        this.state = {
            modalVisible: false
        };
    }

    _cancelClick = ()=>{
        this.setState({
            modalVisible: false
        });
    };

    openModal = (name)=>{
        this.name = name;
        this.setState({
            modalVisible: true
        });
    };

    render(){
        return(
            <Modal
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {}}>
                <View style={styles.container}>
                    <View style={styles.contentContainer}>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={()=>{this.props.cameraClick(this.name);this._cancelClick()}}>
                            <View style={styles.btnContainer}>
                                <Text allowFontScaling={false}  style={styles.fontMain}>拍摄123</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.splitLine}/>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={()=>{this.props.galleryClick(this.name);this._cancelClick()}}>
                            <View style={styles.btnContainer}>
                                <Text allowFontScaling={false}  style={styles.fontMain}>从手机相册选择</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.splitView}/>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={()=>{this._cancelClick()}}>
                            <View style={styles.btnContainer}>
                                <Text allowFontScaling={false}  style={styles.fontMain}>取消</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        width:width,
        flex:1,
        backgroundColor:'rgba(0,0,0,0.3)',
        justifyContent:'flex-end'
    },
    contentContainer:{
        backgroundColor:fontAndColor.COLORA3
    },
    btnContainer:{
        width:width,
        height:Pixel.getPixel(44),
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#FFFFFF'
    },
    fontMain:{
        color:'#000000',
        fontSize:Pixel.getFontPixel(15)
    },
    splitLine:{
        borderColor:fontAndColor.COLORA4,
        borderWidth:0.5
    },
    splitView:{
        width:width,
        height:Pixel.getPixel(10),
        backgroundColor:'transparent'
    }
});


