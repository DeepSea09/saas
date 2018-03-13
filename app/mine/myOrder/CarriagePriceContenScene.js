/**
 * Created by zhengnan on 2018/3/6.
 */

import React,{Component} from 'react'
import {
    StyleSheet,
    View,
    Image,
    Dimensions,
    ScrollView
} from 'react-native'

const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import NavigationView from '../../component/AllNavigationView';
import * as fontAndColor from '../../constant/fontAndColor';
import BaseComponent from '../../component/BaseComponent';

export default class CarriagePriceContenScene extends BaseComponent {
    render(){
        return(
            <View style={styles.root}>
            <ScrollView onScroll={this.onScroll}>
                <Image style={{width:width,height:width/0.36}} source={require('../../../images/carriagePriceImage/H5Image.png')} resizeMode={'contain'}/>
            </ScrollView>
                <NavigationView ref={(ref)=>{this.navigationView=ref}} title={'物流服务'} backIconClick={this.backPage} wrapStyle={{backgroundColor:'transparent'}}/>
            </View>
        )
    }

    onScroll =(event)=> {

        if (event.nativeEvent.contentOffset.y > 0) {

            this.navigationView.setNavigationBackgroindColor(fontAndColor.COLORB0);

        } else {
            this.navigationView.setNavigationBackgroindColor('transparent');
        }
    }
}

const styles = StyleSheet.create({
    root:{
        flex:1,
    }
})