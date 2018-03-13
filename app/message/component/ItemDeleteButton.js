/**
 * Created by hanmeng on 2017/8/11.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Modal
} from 'react-native';

const {width, height} = Dimensions.get('window');
import * as fontAndColor from '../../constant/fontAndColor';
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();

export class ItemDeleteButton extends Component {

    /**
     *
     **/
    constructor(props) {
        super(props);
        this.state = {
            isHide: false,
            codeY: 0
        };
    }

    /**
     * <TouchableOpacity style={{position: 'absolute', width: width, height: height}} onPress={this.props.callBack}/>
     * @returns {XML}
     **/
    render() {
        if (this.state.isHide) {
            let top = Pixel.getPixel(this.state.codeY - 15);
            return (
                <TouchableOpacity style={{
                    width: width,
                    height: height,
                    position: 'absolute',
                }} onPress={() => {
                    this.setState({
                        isHide: false
                    });
                }}>
                    <View >
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                right: Pixel.getPixel(30),
                                top: top < 30 ? 30 : top,

                            }}
                            onPress={() => {
                                // TODO 删除一条数据
                                this.props.itemDelete();
                            }}>
                            <Image
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                source={require('../../../images/message/longPressButton.png')}>
                                <Text style={{
                                    marginBottom: Pixel.getPixel(8),
                                    backgroundColor: '#00000000',
                                    fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                                    color: '#ffffff'
                                }}>删除</Text>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            )
        } else {
            return (
                <View/>
            )
        }
    }

    /**
     *  显示/隐藏
     **/
    changeState = (isHide, y) => {
        this.setState({
            isHide: isHide,
            codeY: y
        });
    };
}

const styles = StyleSheet.create({
    selectView: {
        top: Pixel.getTitlePixel(75),
        backgroundColor: 'rgba(0, 0, 0,0.3)',
        left: 0,
        right: 0,
        position: 'absolute',
        bottom: 0
    },
    checkedCell: {
        backgroundColor: 'white',
        height: Pixel.getPixel(44),
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: fontAndColor.COLORA3
    },
    checkedCellText: {
        fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT),
        textAlign: 'center',
        color: fontAndColor.COLORA0
    }
});