/**
 * Created by Administrator on 2017/6/28.
 */
import React, {Component, PureComponent, PropTypes} from 'react';
import {
    AppRegistry,
    View,
    StyleSheet,
    TouchableHighlight,
    Text,
    Image
} from 'react-native';
import * as FontAndColor from "../constant/fontAndColor";
import PixelUtil from '../utils/PixelUtil';
var Pixel = new PixelUtil();

export default class ChooseButton extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            dengjiren: this.props.rightText
        };
    }

    static propTypes = {
        // leftIconShow: PropTypes.bool,
        // clearValue: PropTypes.bool,//清除输入框内容

        leftText: PropTypes.string,
        rightText: PropTypes.string,

        itemBackground: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        leftFont: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),

        onPressButton: PropTypes.func,//
    }


    render() {
        return (
            <TouchableHighlight onPress={this.props.onPressButton}>
                <View style={[styles.itemBackground, this.props.itemBackground]}>
                    <Text allowFontScaling={false}  style={[styles.leftFont, this.props.leftFont]}>
                        <Text allowFontScaling={false}  style={{color: FontAndColor.COLORB2}}>*</Text>
                        {this.props.leftText}
                    </Text>
                    <Text allowFontScaling={false} style={styles.headerCellRight}>{this.state.dengjiren}</Text>
                    {
                        this.props.showArrow ?  <Image style={{width: Pixel.getPixel(20), height: Pixel.getPixel(16), marginRight: Pixel.getPixel(-10)}}
                                                       source = {require('../../images/mainImage/celljiantou.png')}
                            /> : null
                    }

                </View>
            </TouchableHighlight>
        );
    }

    changeRightText = (val) => {
        this.setState({
            dengjiren: val
        });
    }


}

const styles = StyleSheet.create({
    itemBackground: {
        flexDirection: 'row',
        height: Pixel.getPixel(44),
        backgroundColor: 'white',
        paddingHorizontal: Pixel.getPixel(15),
        alignItems: 'center'
    },
    leftFont: {
        fontSize: Pixel.getFontPixel(14),
        color: 'black'
    },
    headerCellRight: {
        flex: 1,
        textAlign:'right'
    },
});