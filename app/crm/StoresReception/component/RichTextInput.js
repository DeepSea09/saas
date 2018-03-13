/**
 * Created by hanmeng on 2017/8/31.
 */

import React, {PureComponent} from 'react'

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    TextInput
} from  'react-native'

const {width, height} = Dimensions.get('window');
import BaseComponent from "../../../component/BaseComponent";
import * as fontAndColor from '../../../constant/fontAndColor';
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();


export default class RichTextInput extends PureComponent {

    /**
     *  constructor
     **/
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        }
    }

    /**
     *
     **/
    render() {
        return (
            <View style={{height: Pixel.getPixel(88), backgroundColor: '#ffffff'}}>
                <Text style={{marginLeft: Pixel.getPixel(15), marginTop: Pixel.getPixel(15)}}>跟踪内容</Text>
                <TextInput
                    fontSize={fontAndColor.LITTLEFONT28}
                    style={{
                        color: fontAndColor.COLORA2,
                        marginTop: Pixel.getPixel(5),
                        paddingRight: Pixel.getPixel(15),
                        paddingLeft: Pixel.getPixel(15),
                        width: width,
                        height: Pixel.getPixel(110),}}
                    maxLength={100}
                    multiline={true}
                    onChangeText={this._onChangeText}
                    placeholder='其他原因描述，不超过100个字符'
                />
            </View>
        )
    }

    /**
     *   更新文字内容
     **/
    _onChangeText = (text) => {
        this.props.items.value = text;
        this.setState({
            value: text
        });
    }
}

const styles = StyleSheet.create({});