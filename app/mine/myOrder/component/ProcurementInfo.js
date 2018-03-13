/**
 * Created by hanmeng on 2017/8/28.
 */
import React, {Component, PropTypes} from 'react'

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
import * as fontAndColor from '../../../constant/fontAndColor';
import PixelUtil from '../../../utils/PixelUtil';
import BaseComponent from "../../../component/BaseComponent";
const Pixel = new PixelUtil();


export default class ProcurementInfo extends BaseComponent {

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
            if (this.state.orderState === 4 && this.state.orderDetail.first_amount > 0) {
                itemStyle = [styles.infoItem, {marginTop: Pixel.getPixel(20)}];
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
        let firstAmount = this.state.orderDetail.first_amount;
/*        if (this.state.orderDetail.trans_amount > 0) {
            firstAmount = firstAmount - this.state.orderDetail.trans_amount;
        }*/
        if (this.state.orderState === 1) {
            items = [{name: '待付总金额', value: this.state.orderDetail.transaction_amount},
                {name: '待付订金', value: this.state.orderDetail.deposit_amount},
                {name: '待付尾款', value: this.state.orderDetail.balance_amount}];
        } else if (this.state.orderState === 2) {
            if (this.state.orderDetail.totalpay_amount > 0) {
                items = [{name: '待付金额', value: this.state.orderDetail.transaction_amount}];
            } else {
                items = [{name: '待付总金额', value: parseFloat(this.state.orderDetail.transaction_amount - this.state.orderDetail.deposit_amount).toFixed(2)},
                    {name: '待付尾款', value: this.state.orderDetail.balance_amount},
                    {name: '已付订金', value: this.state.orderDetail.deposit_amount}];
            }
        } else if (this.state.orderState === 3) {
            items = [{name: '已付金额', value: this.state.orderDetail.transaction_amount}];
        } else if (this.state.orderState === 4) {
            items = [{name: '已付金额', value: this.state.orderDetail.transaction_amount}];
        } else if (this.state.orderState === 6) {
            items = [{name: '待付总金额', value: parseFloat(this.state.orderDetail.transaction_amount - this.state.orderDetail.deposit_amount).toFixed(2)},
                {name: '待付金额', value: this.state.orderDetail.balance_amount},
                {name: '已付订金', value: this.state.orderDetail.deposit_amount}];
        } else if (this.state.orderState === 7) {
            items = [{name: '待付总金额', value: parseFloat(this.state.orderDetail.finance_amount).toFixed(2)},
                {name: '融资待放款金额', value: parseFloat(this.state.orderDetail.finance_amount).toFixed(2)},
                //{name: '融资待放款金额', value: parseFloat(this.state.orderDetail.balance_amount - firstAmount).toFixed(2)},
                {name: '已付订金', value: parseFloat(this.state.orderDetail.deposit_amount).toFixed(2)},
                {name: '已付首付', value: parseFloat(firstAmount).toFixed(2)}];
        } else if (this.state.orderState === 8) {
            items = [{name: '已付金额', value: this.state.orderDetail.transaction_amount}];
        }
        this.pushLayout(items, layouts);
        return layouts;
    };

    /**
     *  render
     **/
    render() {
        let firstAmount = this.state.orderDetail.first_amount;
/*        if (this.state.orderDetail.trans_amount > 0) {
            firstAmount = firstAmount - this.state.orderDetail.trans_amount;
        }*/
        return (
            <View style={styles.itemType4}>
                <View style={{height: Pixel.getPixel(40), alignItems: 'center', flexDirection: 'row'}}>
                    <Text allowFontScaling={false} style={{
                        fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                        marginLeft: Pixel.getPixel(15)
                    }}>采购信息</Text>
                </View>
                <View style={styles.separatedLine}/>
                {this.addItemData()}
                {this.state.orderState === 4 && firstAmount > 0 && <Text
                    style={{
                        width: width - Pixel.getPixel(15),
                        marginTop: Pixel.getPixel(10),
                        //marginRight: Pixel.getPixel(15),
                        marginBottom: Pixel.getPixel(20),
                        textAlign: 'right',
                        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28)
                    }}
                >其中订单融资支付{this.state.orderDetail.finance_amount}元</Text>}
                {/*<View style={{
                 alignItems: 'center',
                 flexDirection: 'row',
                 marginLeft: Pixel.getPixel(15),
                 marginTop: Pixel.getPixel(20),
                 marginRight: Pixel.getPixel(15)
                 }}>
                 <Text allowFontScaling={false} style={styles.orderInfo}>支付订金</Text>
                 <View style={{flex: 1}}/>
                 <Text allowFontScaling={false}
                 style={styles.infoContent}>{this.state.orderDetail.done_deposit_amount}元</Text>
                 </View>
                 <View style={styles.infoItem}>
                 <Text allowFontScaling={false} style={styles.orderInfo}>支付尾款</Text>
                 <View style={{flex: 1}}/>
                 <Text allowFontScaling={false}
                 style={styles.infoContent}>{this.state.orderDetail.done_balance_amount}元</Text>
                 </View>
                 <View style={styles.infoItem}>
                 <Text allowFontScaling={false} style={styles.orderInfo}>支付总计</Text>
                 <View style={{flex: 1}}/>
                 <Text allowFontScaling={false}
                 style={styles.infoContent}>{this.state.orderDetail.done_total_amount}元</Text>
                 </View>*/}
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