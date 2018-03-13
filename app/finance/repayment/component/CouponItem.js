import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';

import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
const bg = require('../../../../images/financeImages/bottomyouhuijuan.png');
const duigou = require('../../../../images/financeImages/bottomduigou.png');

export default class CouponItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: false
        }
    }

    _selectCoupon = ()=>{
        this.setState((preState)=>({
            selected:!preState.selected
        }));
    };

    render() {
        return (
            <TouchableOpacity onPress={this._selectCoupon}>
                <Image style={styles.container} source={bg}>
                    <View style={styles.leftContainer}>
                        <Text allowFontScaling={false}  style={styles.leftTitle}>还息优惠券</Text>
                        <Text allowFontScaling={false}  style={styles.leftBottom}>有效期:2016.12.20-2017.02.20</Text>
                    </View>
                    <View style={styles.rightContainer}>
                        <View style={styles.rightTitleContainer}>
                            <Text allowFontScaling={false}  style={[styles.rightTitle,styles.rightTitleAlign]}>¥</Text>
                            <Text allowFontScaling={false}  style={styles.rightTitle}>25</Text>
                        </View>
                        <TouchableOpacity style={styles.rightBottom} onPress={()=>{}}>
                            <View>
                                <Text allowFontScaling={false}  style={styles.rightBottomText}>使用规则</Text>
                            </View>
                        </TouchableOpacity>
                        {this.state.selected && <Image style={styles.imgContainer} source={duigou}/>}
                    </View>
                </Image>
            </TouchableOpacity>

        );
    }
}


const styles = StyleSheet.create({
    container: {
        width: Pixel.getPixel(350),
        height: Pixel.getPixel(100),
        flexDirection: 'row'
    },
    leftContainer: {
        width: Pixel.getPixel(230),
        justifyContent: 'center',
        paddingLeft: Pixel.getPixel(20),
    },
    leftTitle: {
        fontSize: Pixel.getFontPixel(15),
        color: '#000000'
    },
    leftBottom: {
        marginTop: Pixel.getPixel(5),
        fontSize: Pixel.getFontPixel(12),
        color: '#9e9e9e'
    },
    rightContainer: {
        width: Pixel.getPixel(120),
        justifyContent: 'center',
        alignItems: 'center'
    },
    rightTitleContainer: {
        flexDirection: 'row'
    },
    rightTitle: {
        fontSize: Pixel.getFontPixel(26),
        color: '#05c5c2'
    },
    rightTitleAlign: {
        marginRight: Pixel.getPixel(3)
    },
    rightBottom: {
        width: Pixel.getPixel(80),
        height: Pixel.getPixel(30),
        borderColor: '#9e9e9e',
        borderWidth: Pixel.getPixel(1),
        borderRadius: Pixel.getPixel(15),
        justifyContent: 'center',
        alignItems: 'center'
    },
    rightBottomText: {
        fontSize: Pixel.getFontPixel(14),
        color: '#9e9e9e'
    },
    imgContainer: {
        height: Pixel.getPixel(33),
        width: Pixel.getPixel(33),
        position: 'absolute',
        bottom: Pixel.getFontPixel(2),
        right: Pixel.getFontPixel(2),
    }
});