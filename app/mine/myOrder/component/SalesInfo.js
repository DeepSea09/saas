/**
 * Created by hanmeng on 2017/12/14.
 */
import React, {Component, PropTypes} from 'react'

import {
    StyleSheet,
    View,
    Text,
    Dimensions,
} from  'react-native'

const {width, height} = Dimensions.get('window');
import * as fontAndColor from '../../../constant/fontAndColor';
import PixelUtil from '../../../utils/PixelUtil';
import BaseComponent from "../../../component/BaseComponent";
const Pixel = new PixelUtil();

export default class SalesInfo extends BaseComponent {

    /**
     *  初始化
     * @param props
     **/
    constructor(props) {
        super(props);
        this.state = {
            orderDetail: this.props.orderDetail,
            orderState: this.props.orderState
        }
    }

    /**
     *  页面 Receive
     * @param nextProps new Props
     **/
    componentWillReceiveProps(nextProps) {
        this.setState({
            orderDetail: nextProps.orderDetail,
            orderState: nextProps.orderState
        });
    }

    /**
     *
     **/
    pushLayout = (items, layouts) => {
        let itemStyle = styles.infoItem;
        for (let i = 0; i < items.length; i++) {
            itemStyle = styles.infoItem;
            if (i === 0) {
                itemStyle = [itemStyle, {marginTop: Pixel.getPixel(20)}]
            }
            if (i === items.length - 1) {
                itemStyle = [itemStyle, {marginBottom: Pixel.getPixel(20)}]
            }
            layouts.push(<View key={i} style={itemStyle}>
                <Text allowFontScaling={false} style={styles.orderInfo}>{items[i].name}</Text>
                <View style={{flex: 1}}/>
                <Text allowFontScaling={false}
                      style={styles.infoContent}>{items[i].value}元</Text>
            </View>);
        }
    };

    /**
     *  信息数据
     **/
    addItemData = () => {
        let items = [];
        let layouts = [];
        if (this.state.orderDetail.totalpay_amount > 0) {
            items = [{name: '到账金额', value: this.state.orderDetail.done_to_seller_amount}];
        } else {
            items = [{name: '到账订金', value: this.state.orderDetail.done_deposit_amount},
                {name: '到账尾款', value: this.state.orderDetail.done_balance_amount},
                {name: '到账总计', value: this.state.orderDetail.done_total_amount}];
        }
        this.pushLayout(items, layouts);
        return layouts;
    };

    /**
     *  render
     **/
    render() {
        return (
            <View style={styles.itemType4}>
                <View style={{height: Pixel.getPixel(40), alignItems: 'center', flexDirection: 'row'}}>
                    <Text allowFontScaling={false} style={{
                        fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                        marginLeft: Pixel.getPixel(15)
                    }}>销售信息</Text>
                </View>
                <View style={styles.separatedLine}/>
                {this.addItemData()}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    separatedLine: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15),
        height: 1,
        backgroundColor: fontAndColor.COLORA4
    },
    itemType4: {
        backgroundColor: '#ffffff'
    },
    orderInfo: {
        color: fontAndColor.COLORA1,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28)
    },
    infoContent: {
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28)
    },
    infoItem: {
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: Pixel.getPixel(15),
        marginTop: Pixel.getPixel(10),
        marginRight: Pixel.getPixel(15)
    }
});