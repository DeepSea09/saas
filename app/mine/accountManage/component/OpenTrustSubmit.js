/**
 * Created by hanmeng on 2017/11/29.
 */
import React, {Component, PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../../constant/fontAndColor';
export default class OpenTrustSubmit extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            canSubmit: true
        }
    }

    /**
     *  更改点击状态
     * @returns {XML}
     **/
    changeState = (state) => {
        this.setState({
            canSubmit: state
        });
    };

    render() {
        return (
            <TouchableOpacity style={{alignSelf: 'center', marginTop: Pixel.getPixel(25),}}
                              onPress={() => {
                                  if (this.state.canSubmit) {
                                    this.props.submit();
                                  }
                              }}>
                <View style={{
                    width: Pixel.getPixel(100),
                    height: Pixel.getPixel(32),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 3,
                    borderWidth: 1,
                    borderColor: this.state.canSubmit ? fontAndColor.COLORB0 : fontAndColor.COLORA2
                }}>
                    <Text allowFontScaling={false} style={{
                        fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),
                        color: this.state.canSubmit ? fontAndColor.COLORB0 : fontAndColor.COLORA2
                    }}>立刻升级</Text>
                </View>
            </TouchableOpacity>
        );
    }

}
const styles = StyleSheet.create({});