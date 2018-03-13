/**
 * Created by hanmeng on 2017/12/8.
 */
import React, {PureComponent} from 'react';
import {
    Text,
    View,
} from 'react-native';
//图片加文字
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../../constant/fontAndColor';
export default class DepositInputState extends PureComponent {

    /**
     *   constructor
     **/
    constructor(props) {
        super(props);
        this.state = {
            depositInputState: this.props.depositInputState
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            depositInputState: nextProps.depositInputState
        });
    }

    /**
     *   render
     **/
    render() {
        return (
            <View style={{height: Pixel.getPixel(44), flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1}}/>
                <Text allowFontScaling={false}
                      style={{
                          fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                          marginRight: Pixel.getPixel(15),
                          color: fontAndColor.COLORA2
                      }}>
                    {this.state.depositInputState}</Text>
            </View>
        );
    }
}