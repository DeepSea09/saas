/**
 * Created by hanmeng on 2017/11/9.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Image,
    Text
} from "react-native";
const {width, height} = Dimensions.get('window');
import BaseComponent from "../../../component/BaseComponent";
import * as fontAndColor from "../../../constant/fontAndColor";
import AccountInfoInput from "./component/AccountInfoInput";
import NavigationView from '../../../component/AllNavigationView';
import PixelUtil from '../../../utils/PixelUtil';
import MyButton from "../../../component/MyButton";
const Pixel = new PixelUtil();


export default class OpenIndividualTrustAccountScene extends BaseComponent {

    /**
     *  constructor
     * @param props
     **/
    constructor(props) {
        super(props);
        this.childItems = [];
        this.childItems.push({name: '别名', value: '', parameter: 'nickName'});
        this.childItems.push({name: '手机号', value: '', parameter: 'mobilePhone'});
        this.state = {
            renderPlaceholderOnly: 'blank'
        };
    }

    /**
     *  initFinish
     **/
    initFinish = () => {
        this.setState({
            renderPlaceholderOnly: 'success'
        });
    };

    /**
     *  render
     **/
    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (
                <View style={styles.contaier}>
                    <NavigationView
                        backIconClick={this.backPage}
                        title="开通个人信托账户"/>
                </View>
            )
        } else {
            return (
                <View style={styles.contaier}>
                    <View style={{backgroundColor: fontAndColor.COLORA3, marginTop: Pixel.getTitlePixel(75)}}>
                        <AccountInfoInput items={this.childItems[0]}/>
                        <AccountInfoInput items={this.childItems[1]}/>
                        <MyButton buttonType={MyButton.TEXTBUTTON}
                                  content={'确认开通'}
                                  parentStyle={{height: Pixel.getPixel(44),
                                      width: width - Pixel.getPixel(30),
                                      backgroundColor: fontAndColor.COLORB0,
                                      marginTop: Pixel.getPixel(30),
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      alignSelf: 'center',
                                      borderRadius: Pixel.getPixel(4)}}
                                  childStyle={{color: fontAndColor.COLORA3,
                                      fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT)}}
                                  mOnPress={this.submitOpenAccount}/>
                    </View>
                    <View style={{marginTop: Pixel.getPixel(16), flexDirection: 'row', alignSelf: 'center',
                    marginLeft: Pixel.getPixel(30), marginRight: Pixel.getPixel(30),}}>
                        <Image style={{}}
                               source={require('../../../../images/mainImage/agreed_sign.png')}/>
                        <Text
                            allowFontScaling={false}
                            style={{fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                                color: fontAndColor.COLORA1,
                                marginLeft: Pixel.getPixel(7),
                                lineHeight: Pixel.getPixel(15)}}>
                            我已经阅读并同意《用户注册协议》,《服务信托项目信托合同》,《信托风险申请书》,《委托支付协议》,《平台与商户的民事信托合同》
                        </Text>
                    </View>
                    <NavigationView
                        backIconClick={this.backPage}
                        title="开通个人信托账户"/>
                </View>
            )
        }
    }

    /**
     *   开通个人账户提交
     **/
    submitOpenAccount = () => {
        //console.log('submitOpenAccount', this.childItems);
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: fontAndColor.COLORA3
    }
});