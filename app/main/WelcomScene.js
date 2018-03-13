/**
 * Created by lhc on 2017/2/15.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    InteractionManager,
    NativeModules,
    BackAndroid
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import ScrollableTabView from 'react-native-scrollable-tab-view';
import BaseComponent from '../component/BaseComponent';
import PixelUtil from '../utils/PixelUtil';
import LoginAndRegister from '../login/LoginAndRegister';
let Pixel = new PixelUtil();
import StorageUtil from '../utils/StorageUtil';
import * as KeyNames from '../constant/storageKeyNames';

export  default class WelcomScene extends BaseComponent {

    handleBack = () => {
        NativeModules.VinScan.goBack();
        return true;
    }

    componentDidMount() {
        try {
            BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
        } catch (e) {

        } finally {
            //InteractionManager.runAfterInteractions(() => {
                this.setState({renderPlaceholderOnly: 'loading'});
                this.initFinish();
            //});
        }
    }

    constructor(props, context) {
        super(props, context);
    }


    initFinish = () => {

    }

    render() {
        return (
            <View style={{flex:1,backgroundColor:'#fff'}}>
                <ScrollableTabView
                    style={{ flex: 1}}
                    initialPage={0}
                    prerenderingSiblingsNumber={Infinity}
                    renderTabBar={() => <View />}
                >

                    <Image style={{resizeMode:'stretch',width:width,flex:1}}
                           source={require('../../images/welcomFirst.png')}
                           tabLabel="ios-paper1"/>

                    <Image style={{resizeMode:'stretch',width:width,flex:1}}
                           source={require('../../images/welcomSecond.png')}
                           tabLabel="ios-paper2"/>

                    <Image style={{resizeMode:'stretch',width:width,flex:1}}
                           source={require('../../images/welcomThird.png')}
                           tabLabel="ios-paper3"/>
                    <View style={{flex:1}}>
                        <Image style={{resizeMode:'stretch',width:width,flex:1}}
                               source={require('../../images/welcomFourth.png')}
                               tabLabel="ios-paper4"/>
                        <TouchableOpacity onPress={()=>{
                             StorageUtil.mSetItem(KeyNames.FIRST_INTO,'false');
                             this.loginPage({name:'LoginAndRegister',component:LoginAndRegister,params:{}});
                        }} activeOpacity={0.8} style={{width:Pixel.getPixel(121),
                        height:Pixel.getPixel(37),position:'absolute',
                        bottom: Pixel.getPixel(22),
                            left:width/2-Pixel.getPixel(60)}}>
                            <Image style={{width:Pixel.getPixel(121),height:Pixel.getPixel(37),resizeMode:'contain',
                           }} source={require('../../images/welcomButton.png')}/>
                        </TouchableOpacity>

                    </View>
                </ScrollableTabView>
            </View>
        );

    }

    loginPage = (mProps) => {
        const navigator = this.props.navigator;
        if (navigator) {
            navigator.immediatelyResetRouteStack([{
                ...mProps
            }])
        }
    }

}


const styles = StyleSheet.create({

    image: {

        width: 43,
        height: 43,
    },
    tabView: {
        flex: 1,
        padding: 10,
        backgroundColor: 'red',
    },

})