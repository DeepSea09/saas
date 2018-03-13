/**
 * Created by ZN on 17/2/25.
 */

import  React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    ListView,
    ScrollView,
    RefreshControl,
    InteractionManager,
    Image,
    NativeModules,
} from 'react-native';

import BaceComponent from '../component/BaseComponent';
import ZNSwitchoverButton from './znComponent/ZNSwitchoverButton';
import CarNewMySourceScene from './CarNewMySourceScene';
import CarUserMySourceScene from './CarUserMySourceScene';
import * as fontAndColor from '../constant/fontAndColor';
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
let Platform = require('Platform');

export default class CarMySourceScene extends BaceComponent {

    render() {
        return (
            <View style={styles.rootContainer}>
                <NavigatorView switchoverType={this.state.switchoverType} switchoverAction={this.switchoverAction} backPage={this.backToTop}/>
                {
                    this.state.switchoverType==0?(<CarNewMySourceScene showToast={this.props.showToast} showModal={this.props.showModal} toNextPage={this.toNextPage}/>):
                        (<CarUserMySourceScene showToast={this.props.showToast} showModal={this.props.showModal} toNextPage={this.toNextPage}/>)
                }
            </View>)
    }

    switchoverAction=(title,index)=>{
        this.setState({
            switchoverType:index
        });
    }

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            switchoverType:0
        };
    }
}
class NavigatorView extends Component {

    render() {
        return (
            <View style={styles.navigatorView}>

                <View style={styles.navitgatorContentView}>
                    <TouchableOpacity onPress={this.props.backPage}>
                        <Image style={styles.backIcon} source={require('../../images/mainImage/navigatorBack.png')}/>
                    </TouchableOpacity>
                    <ZNSwitchoverButton ref="ZNSwitchoverButton" switchoverAction={this.props.switchoverAction} titleArray={['新车车源管理','二手车源管理']} defaultIndex={this.props.switchoverType}/>
                    <View/>
                </View>
            </View>

        )
    }
}

const styles = StyleSheet.create({

    rootContainer: {

        flex: 1,
        backgroundColor: fontAndColor.COLORA3,

    },
    navigatorView: {
        top: 0,
        height: Pixel.getTitlePixel(64),
        backgroundColor: fontAndColor.COLORB0,
        flexDirection: 'row',
    },
    navitgatorContentView: {

        flex: 1,
        flexDirection: 'row',
        marginTop: Pixel.getTitlePixel(20),
        height: Pixel.getPixel(44),
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    backIcon: {
        marginLeft: Pixel.getPixel(12),
        height: Pixel.getPixel(20),
        width: Pixel.getPixel(20),
    },

})