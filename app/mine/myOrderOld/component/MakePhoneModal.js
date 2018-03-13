/**
 * Created by hanmeng on 2017/5/15.
 */
import React, {Component} from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    Modal,
    Linking,
    Text,
    TouchableOpacity,
    Platform,
    NativeModules
} from 'react-native';
import PixelUtil from "../../../utils/PixelUtil";
let Pixel = new PixelUtil();
let {width, height} = Dimensions.get('window');
import  * as fontAndColor from '../../../constant/fontAndColor';
export default class MakePhoneModal extends Component {

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isShow: false,
            callData: {}
        };
    }

    changeShowType = (value, callData) => {
        this.setState({
            isShow: value,
            callData: callData
        });
    }

    callClick = (phoneNumer) => {
        if (Platform.OS === 'android') {
            NativeModules.VinScan.callPhone(phoneNumer);
        } else {
            Linking.openURL('tel:' + phoneNumer);
        }
    };

    render() {
        return (
            <Modal
                animationType={"none"}
                transparent={true}
                visible={this.state.isShow}
                onRequestClose={() => {
                }}>
                <TouchableOpacity
                    onPress={() => {
                        this.setState({
                            isShow: false
                        });
                    }}
                    activeOpacity={1}
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.3)'
                    }}>
                    <View style={{
                        width: Pixel.getPixel(240),
                        height: Pixel.getPixel(160),
                        backgroundColor: '#fff',
                        /*                        paddingLeft: Pixel.getPixel(20),
                         paddingRight: Pixel.getPixel(20),*/
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: Pixel.getPixel(2),
                        borderWidth: Pixel.getPixel(1),
                        borderColor: '#ffffff'
                    }}>
                        {
                            this.state.callData.shopsNumber !== '' && (<TouchableOpacity
                                onPress={() => {
                                    this.callClick(this.state.callData.shopsNumber);
                                }}>
                                <View style={styles.buttonMerchant}>
                                    <Text allowFontScaling={false}  style={{color: '#ffffff'}}>联系商家</Text>
                                </View>
                            </TouchableOpacity>)
                        }
                        {
                            this.state.callData.phone !== '' && (<TouchableOpacity
                                onPress={() => {
                                    this.callClick(this.state.callData.phone);
                                }}>
                                <View style={styles.buttonCustomerService}>
                                    <Text allowFontScaling={false}  style={{color: fontAndColor.COLORB0}}>联系客服</Text>
                                </View>
                            </TouchableOpacity>)
                        }

                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }
}
const styles = StyleSheet.create({
    buttonMerchant: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: fontAndColor.COLORB0,
        height: Pixel.getPixel(44),
        width: Pixel.getPixel(200),
        borderRadius: Pixel.getPixel(2),
        borderWidth: Pixel.getPixel(1),
        borderColor: fontAndColor.COLORB0
    },
    buttonCustomerService: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Pixel.getPixel(15),
        height: Pixel.getPixel(44),
        width: Pixel.getPixel(200),
        borderRadius: Pixel.getPixel(2),
        borderWidth: Pixel.getPixel(1),
        borderColor: fontAndColor.COLORB0
    }
});