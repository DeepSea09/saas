/**
 * Created by hanmeng on 2018/1/8.
 */
import React, {PureComponent} from 'react'

import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    Image,
    TouchableOpacity
} from  'react-native'

const {width, height} = Dimensions.get('window');
import * as fontAndColor from '../../../constant/fontAndColor';
import PixelUtil from '../../../utils/PixelUtil';
import TagSelectView from "./TagSelectView";
import FillWaybill from "../orderwuliu/FillWaybill";
import BaseComponent from "../../../component/BaseComponent";
import CheckWaybill from "../orderwuliu/CheckWaybill";
const Pixel = new PixelUtil();

export default class LogisticsMode extends BaseComponent {

    /**
     *  初始化
     * @param props
     **/
    constructor(props) {
        super(props);
        //console.log('ordersTrans====',this.props.ordersTrans);
        this.tagSelect = [{
            name: '物流',
            check: true,
            id: 1
        }, {
            name: '自提',
            check: false,
            id: 0
        }];
        this.state = {
            fillWaybill: true,
            ordersTrans: this.props.ordersTrans
        }
    }

    /**
     *    运单状态映射
     **/
    transStateMapping = (ordersTrans) => {
        switch (ordersTrans.status) {
            case 0:    // 0 是前端自己定义的状态 说明未生成运单
                return {'state': 0, 'waybillState': ''};
            case 1: //1 =>'填写完',
            case 2: //2 =>'支付运单成功',
            case 100: // 100 =>'支付运单中',
            case 101: // 101 =>'支付运单失败',
                return {'state': 1, 'waybillState': '运费' + ordersTrans.total_amount + '元'};
            case 200: // 200 =>'支付运单成功生成运单失败',
            case 201:   // 201 =>'支付运单成功生成运单成功',
            case 31:  //  31 =>'审核失败待发',
                return {'state': 2, 'waybillState': '已支付'};
            case 30:  //  30 =>'审核成功待发',
                return {'state': 3, 'waybillState': '已支付'};
            case 3:  //  3 =>'发运',
                return {'state': 4, 'waybillState': '已支付'};
            case 4:  // 4 =>'到店',
                return {'state': 5, 'waybillState': '已到店'};
            case 5:  // 5 =>'到库',
            case 6:  // 6 =>'申请提车函',
            case 8:  // 8 =>'申请提车函支付失败',
            case 10:  // 10 =>'申请转单车',
            case 13:  // 13 =>'申请转单车支付失败',
                return {'state': 6, 'waybillState': '已入库'};
            case 7: // 7 =>'申请提车函支付中',
                return {'state': 7, 'waybillState': '已入库'};
            case 9:    // 9 =>'申请提车函支付完成',
                return {'state': 8, 'waybillState': '仓储费已支付'};
            case 12:  // 12 =>'申请转单车支付中',
            case 14:  // 14 =>'申请转单车支付成功',
            case 15: //  15 =>'申请转单车支付成功生成运单失败',
            case 16: //  16 =>'申请转单车支付成功生成运单成功',
                return {'state': 9, 'waybillState': '已入库'};
            case 11: // 11 =>'终结',
                return {'state': 10, 'waybillState': '已交车'};
            default:
                return {'state': 0, 'waybillState': ''};
        }
    };

    /**
     *  页面 Receive
     * @param nextProps new Props
     **/
    componentWillReceiveProps(nextProps) {

    }

    onTagClick = (dt, index) => {
        //单选
        this.tagSelect.map((data) => {
            data.check = false;
        });
        this.tagSelect[index].check = !this.tagSelect[index].check;
        this.props.updateLogisticsType(this.tagSelect[index].id);
        this.tagRef.refreshData(this.tagSelect);
        if (index === 0) {
            this.setState({
                fillWaybill: true
            });
        } else {
            this.setState({
                fillWaybill: false
            });
        }
    };

    /**
     *  0自提1全款到店2融资到店3融资到库4库到店
     **/
    logisticsTypeRouting = (orderState) => {
        if (orderState === 2) {
            return 1;
        }
    };

    /**
     *
     **/
    updateOrdersTrans = (newOrdersTrans) => {
        newOrdersTrans.status = newOrdersTrans.trans_status;
        this.props.updateOrdersTrans(newOrdersTrans);
        //this.ordersTrans = newOrdersTrans;
        this.setState({
            ordersTrans: newOrdersTrans
        });
    };

    /**
     *  render
     **/
    render() {
        let alreadyChoose = this.transStateMapping(this.state.ordersTrans);  // 是否已经生成运单并支付完成
        //let waybillState = '运费' + this.state.ordersTrans.total_amount + '元';
        //console.log('alreadyChoose===', alreadyChoose);
        return (
            <View style={{backgroundColor: '#ffffff'}}>
                {alreadyChoose.state < 2 && (<View style={{
                    height: Pixel.getPixel(44), flexDirection: 'row', alignItems: 'center',
                    paddingLeft: Pixel.getPixel(15), paddingRight: Pixel.getPixel(15)
                }}>
                    <Text >交车方式</Text>
                    <View style={{flex: 1}}/>
                    <TagSelectView
                        buttonWidth={Pixel.getPixel(80)}
                        textSize={Pixel.getPixel(15)}
                        paddingHorizontal={Pixel.getPixel(8)}
                        ref={(ref) => {
                            this.tagRef = ref;
                        }} onTagClick={this.onTagClick} cellData={this.tagSelect}/>
                </View>)}
                {this.state.fillWaybill && alreadyChoose.state < 2 && (<View style={styles.separatedLine}/>)}
                {this.state.fillWaybill && (
                    <TouchableOpacity
                        onPress={() => {
                            if (alreadyChoose.state < 2) {
                                this.toNextPage({
                                    name: 'FillWaybill',
                                    component: FillWaybill,
                                    params: {
                                        orderId: this.props.orderDetail.id,
                                        logisticsType: this.logisticsTypeRouting(this.props.orderState),
                                        //transId: this.props.orderDetail.orders_item_data[0].trans_id,
                                        vType: this.props.orderDetail.orders_item_data[0].car_data.v_type,
                                        callBack: this.updateOrdersTrans
                                    }

                                });
                            } else {
                                this.toNextPage({
                                    name: 'CheckWaybill',
                                    component: CheckWaybill,
                                    params: {
                                        orderId: this.props.orderDetail.id,
                                        transId: this.state.ordersTrans.id,
                                        waybillState: alreadyChoose.waybillState
                                    }

                                });
                            }
                        }}>
                        <View style={{
                            height: Pixel.getPixel(44), flexDirection: 'row', alignItems: 'center',
                            paddingLeft: Pixel.getPixel(15), paddingRight: Pixel.getPixel(15)
                        }}>
                            <Text >{alreadyChoose.state > 0 ? '运单信息' : '填写运单'}</Text>
                            <View style={{flex: 1}}/>
                            <Text style={{color: fontAndColor.COLORB0}}>{alreadyChoose.waybillState}</Text>
                            <Image source={require('../../../../images/mainImage/celljiantou.png')}/>
                        </View>
                    </TouchableOpacity>
                )}
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
    }
});