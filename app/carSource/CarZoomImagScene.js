/**
 * Created by zhengnan on 2017/3/24.
 */

/**
 * Created by zhengnan on 2017/3/22.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
    Image

} from  'react-native';

import ImageViewer from 'react-native-image-zoom-viewer';
import BaseComponent from '../component/BaseComponent';
import *as fontAndColor from '../constant/fontAndColor';
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
export default class BrowseImageView extends BaseComponent{

    render(){

        return(
                <ImageViewer imageUrls={this.props.images}
                             loadingRender={this.renderLoading}
                             onCancel={this.onCancel}
                             index={this.props.index}
                             onClick={this.onCancel}
                             saveToLocalByLongPress={false}
                />
        )
    }
    renderHeadView=()=>{
        return(
            <View style={styles.headView}/>
        )
    };
    renderLoading = ()=> {
        return (
            <ActivityIndicator color='white' animating={true} size='large'/>
        )
    };
    onCancel=()=>{
        this.backPage();
    }

}

const styles = StyleSheet.create({

    contaier:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    headView:{
        width:Dimensions.get('window').width,
        height:Pixel.getPixel(64),
        backgroundColor:fontAndColor.COLORB0,
    },
    backIcon: {
        marginLeft: Pixel.getPixel(12),
        height: Pixel.getPixel(20),
        width: Pixel.getPixel(20),
        backgroundColor:'yellow'
    },

})