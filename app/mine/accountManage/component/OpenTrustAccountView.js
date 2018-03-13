/**
 * Created by hanmeng on 2017/11/13.
 */
import React, {Component} from 'react';

import {
    View,
    StyleSheet,
    Dimensions,
    Image,
    Text,
    TouchableOpacity,
    InteractionManager
} from "react-native";

const {width, height} = Dimensions.get('window');
import BaseComponent from "../../../component/BaseComponent";
import * as fontAndColor from '../../../constant/fontAndColor';
import PixelUtil from '../../../utils/PixelUtil';
import {request} from "../../../utils/RequestUtil";
import * as AppUrls from "../../../constant/appUrls";
import TrustAccountContractScene from "../trustAccount/TrustAccountContractScene";
import SelectButton from "./SelectButton";
import OpenTrustSubmit from "./OpenTrustSubmit";
const Pixel = new PixelUtil();

export default class OpenTrustAccountView extends BaseComponent {

    /**
     *
     * @param props
     **/
    constructor(props) {
        super(props);
        this.contractList = [];
        this.state = {
            isShow: false
        };
    }

    /**
     *   没卵用.......
     **/
    loadData = () => {

    };

    /**
     * 控制显示、隐藏
     * @param isShow
     **/
    changeState = (isShow) => {
        this.setState({
            isShow: isShow
        });
    };

    /**
     * 控制显示、隐藏并接收数据
     * @param isShow
     * @param data
     **/
    changeStateWithData = (isShow, data) => {
        this.contractList = data;
        this.setState({
            isShow: isShow
        });
    };

    /**
     *   跳转合同预览页
     **/
    openContractScene = (name, url) => {
            this.toNextPage({
                name: 'TrustAccountContractScene',
                component: TrustAccountContractScene,
                params: {
                    title: name,
                    webUrl: url
                }
            })
    };

    /**
     *   获取OpenTrustSubmit组件ref
     **/
    getOpenTrustSubmitRef = () => {
        return this.openTrustSubmitRef;
    };

    /**
     *   开通信托账户提交
     **/
    openTrustSubmit = () => {
        this.changeState(false);
        this.props.callBack();
    };

    /**
     *  render
     **/
    render() {
        if (this.state.isShow) {
            let contractList = [];
            for (let i = 0; i < this.contractList.length; i++) {
                contractList.push(<Text
                    key={i + 'contractList'}
                    allowFontScaling={false}
                    onPress={() => {this.openContractScene('合同', this.contractList[i].url)}}
                    style={{
                        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                        color: fontAndColor.COLORB4,
                        lineHeight: Pixel.getPixel(20)
                    }}>
                    《{this.contractList[i].name}》{i < this.contractList.length - 1 ? '、' : ''}
                </Text>);
                //contractList.push({title: this.contractList[i].name, webUrl: this.contractList[i].url});
            }
            return (<View style={styles.container}>
                <TouchableOpacity style={{flex: 1}} onPress={() => {
                    this.changeState(false)
                }}/>
                <View style={{
                    position: 'absolute',
                    backgroundColor: '#ffffff',
                    width: Pixel.getPixel(290),
                    height: Pixel.getPixel(292),
                    //marginTop: Pixel.getPixel(150),
                    //justifyContent: 'center',
                    top: Pixel.getPixel(150),
                    left: Pixel.getPixel(43),
                    alignSelf: 'center',
                    borderRadius: Pixel.getPixel(4),
                    borderWidth: 1,
                    borderColor: '#ffffff'
                }}>
                    <Text
                        allowFontScaling={false}
                        style={{
                            marginTop: Pixel.getPixel(18),
                            marginLeft: Pixel.getPixel(20),
                            marginRight: Pixel.getPixel(20),
                            color: '#000',
                            fontSize: Pixel.getFontPixel(16),
                            textAlign: 'center'
                        }}>升级开通"转呗"</Text>
                    <Text
                        allowFontScaling={false}
                        style={{
                            marginTop: Pixel.getPixel(18),
                            marginLeft: Pixel.getPixel(20),
                            marginRight: Pixel.getPixel(20),
                            color: '#000',
                            fontSize: Pixel.getFontPixel(14),
                            lineHeight: Pixel.getPixel(18),
                            textAlign: 'center'
                        }}>第1车贷同中信信托合作，为优质合作伙伴开通具备强大金融功能的信托服务账户"转呗"</Text>
                    <View style={{
                        marginTop: Pixel.getPixel(15), flexDirection: 'row', alignSelf: 'center',
                        marginLeft: Pixel.getPixel(20), marginRight: Pixel.getPixel(20),
                    }}>
                        <SelectButton link={this.getOpenTrustSubmitRef}/>
                        <View style={{marginLeft: Pixel.getPixel(5),}}>
                            <Text >
                                <Text
                                    allowFontScaling={false}
                                    style={{
                                        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                                        color: fontAndColor.COLORA1,
                                        lineHeight: Pixel.getPixel(20)
                                    }}>
                                    我已经阅读并同意
                                </Text>
                                {contractList}
                            </Text>
                        </View>
                    </View>
                    <OpenTrustSubmit ref={(ref) => {this.openTrustSubmitRef = ref}} submit={this.openTrustSubmit}/>
                </View>
            </View>);
        } else {
            return (<View />);
        }
    }

}

const styles = StyleSheet.create({
    container: {
        top: 0,
        backgroundColor: 'rgba(0, 0, 0,0.3)',
        left: 0,
        right: 0,
        position: 'absolute',
        bottom: 0,
    },
});