/**
 * Created by Administrator on 2017/4/20.
 */
/**
 * Created by Administrator on 2017/3/22.
 */
import React from 'react';
import {
    View,
    Image,
    Text,
    TextInput,
    StyleSheet,
    Platform,
    NativeModules,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
}from 'react-native';

import BaseComponent from '../component/BaseComponent';
import AllNavigationView from '../component/AllNavigationView';
import * as fontAndColor from '../constant/fontAndColor';
import PixelUtil from '../utils/PixelUtil';
import {CarConfigurationView}   from './../carSource/znComponent/CarInfoAllComponent';

const Pixel = new PixelUtil();


const config_no_data = require('../../images/noData.png');

export default class AutoConfig extends BaseComponent {

    constructor(props) {
        super(props);

    }

    initFinish = () => {
        console.log(this.props.modelID);
    };

    _showLoading = () => {
        this.props.showModal(true);
    };

    _closeLoading = () => {
        this.props.showModal(false);
    };

    //提示信息
    _showHint = (hint) => {
        this.props.showToast(hint);
    };

    _onBack = () => {
        this.backPage();
    };

    /**
     * from @zhaojian
     *
     * 回退到车辆详情页面
     **/
    backPage = () => {
        if(this.props.from=='CarUpkeepScene'){
            const navigator = this.props.navigator;
            if (navigator){
                for(let i = 0;i<navigator.getCurrentRoutes().length;i++){
                    if(navigator.getCurrentRoutes()[i].name=='CarInfoScene'){
                        navigator.popToRoute(navigator.getCurrentRoutes()[i]);
                        break;
                    }
                }
            }
        }else{
            const navigator = this.props.navigator;
            if (navigator) {
                navigator.pop();
            }
        }

    }

    render() {
        return (
            <View style={styles.container}>
                <AllNavigationView
                    backIconClick={this._onBack}
                    title='车辆配置'
                />
                <CarConfigurationView carConfigurationData={this.props.carConfigurationData}
                                      modelID ={this.props.modelID}
                                      renderCarConfigurationDataAction={this.props.renderCarConfigurationDataAction}
                                      carConfiguraInfo={this.props.carConfiguraInfo}/>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: fontAndColor.COLORA3,
        paddingTop:Pixel.getTitlePixel(64),
    },
    noDataContainer:{
        flex:1,
        alignItems:'center'
    },
    imgContainer:{
        marginTop:Pixel.getPixel(120),
        width:Pixel.getPixel(130),
        height:Pixel.getPixel(160)
    },
    noDataFont:{
        fontSize:Pixel.getFontPixel(16),
        color:'black',
        marginTop:Pixel.getPixel(20)
    }
});
