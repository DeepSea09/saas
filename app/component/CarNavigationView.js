/**
 * Created by zhengnan on 17/2/14.
 */

import React, {Component, PureComponent} from 'react';

import {

    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,

} from 'react-native';

import *as fontAndColor from '../constant/fontAndColor';
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();

export default class CarInfoNavigationView extends PureComponent {


    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {

            navigationBackgroundColor:false,

        };
      }

      setNavigationBackgroindColor=(bool)=>{

          this.refs.navigationRightView.changeImgClick(bool);
          this.setState({
              navigationBackgroundColor:bool,
          });
      }

    render() {

        const {title, backIconClick,wrapStyle,isStore,addStoreAction,cancelStoreAction,showShared} = this.props;

        return (
            <View style={[styles.navigation,wrapStyle,this.state.navigationBackgroundColor && {backgroundColor:fontAndColor.COLORB0}]}>
                <View style={styles.content}>
                     <TouchableOpacity style={{width: Pixel.getPixel(100), height: Pixel.getPixel(64),justifyContent:'center'}}
                                      onPress={backIconClick}>
                    {backIconClick && <Image style={styles.backIcon}  source={ this.state.navigationBackgroundColor==false? require('../../images/carSourceImages/back.png') : require('../../images/mainImage/navigatorBack.png')}/>}
                     </TouchableOpacity>
                    <Text allowFontScaling={false}  style={styles.titleText}>{title}</Text>
                    <View style={styles.imageFoot}>
                       <NavigationRightView ref="navigationRightView" isStore={isStore} addStoreAction={addStoreAction} cancelStoreAction={cancelStoreAction} showShared={showShared}/>
                    </View>
                </View>
            </View>
        )
    }

}


class NavigationRightView extends Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {

            isStore:this.props.isStore,
            isChangeImg:false,

        };
    }

    isStoreClick=(isStore)=>{

        this.setState({
            isStore:isStore,

        })
    }

    changeImgClick=(bool)=>{
        this.setState({
            isChangeImg:bool,
        })
    }

    render(){
        return(
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={()=>{

                    if(this.state.isStore){

                        this.props.cancelStoreAction(this.isStoreClick);

                    }else {

                        this.props.addStoreAction(this.isStoreClick);
                    }

                }}>
                    <Image source={ this.state.isChangeImg==false? (this.state.isStore? require('../../images/carSourceImages/presc.png') : require('../../images/carSourceImages/newsc.png')) : (this.state.isStore? require('../../images/carSourceImages/store.png') : require('../../images/carSourceImages/storenil.png'))}></Image>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft: Pixel.getPixel(10)}} onPress={this.props.showShared}>
                    <Image source={ this.state.isChangeImg==false? require('../../images/carSourceImages/newfx.png') : require('../../images/carSourceImages/share_nil.png')}></Image>
                </TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({


    content: {
        marginTop: Pixel.getTitlePixel(20),
        height: Pixel.getPixel(44),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    backIcon: {

        marginLeft: Pixel.getPixel(12),
    },

    titleText: {
        color: 'white',
        fontSize: Pixel.getFontPixel(fontAndColor.NAVIGATORFONT34),
        textAlign: 'center',
        backgroundColor: 'transparent',

    },
    imageFoot: {

        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: Pixel.getPixel(80),
        marginRight:Pixel.getPixel(15),


    },
    navigation: {
        height: Pixel.getTitlePixel(64),
        backgroundColor: fontAndColor.COLORB0,
        left: 0,
        right: 0,
        position: 'absolute',
        flex: 1
    }

})