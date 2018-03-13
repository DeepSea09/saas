/**
 * Created by hanmeng on 2017/11/29.
 */
import React, {Component, PureComponent} from 'react';
import {
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../../constant/fontAndColor';
import DateTimePicker from 'react-native-modal-datetime-picker'
export default class SelectButton extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isSelect: true
        }
    }

    /**
     *  获取点击状态
     * @returns {XML}
     **/
    getState = () => {
        return this.state.isSelect;
    };

    /**
     *  更改点击状态
     * @returns {XML}
     **/
    changeState = (state) => {
        this.setState({
            isSelect: state
        });
    };

    render() {
        let image = this.state.isSelect ? require('../../../../images/login/okconfirm.png') :
            require('../../../../images/login/noconfirm.png');
        return (
            <TouchableOpacity style={{marginTop: Pixel.getPixel(5)}}
                              onPress={() => {
                                  this.changeState(!this.state.isSelect);
                                  this.props.link().changeState(!this.state.isSelect);
                              }}>
                <Image source={image}/>
            </TouchableOpacity>
        );
    }

}
const styles = StyleSheet.create({});