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

export default class LogisticsMode1 extends BaseComponent {

    /**
     *  初始化
     * @param props
     **/
    constructor(props) {
        super(props);
        //console.log('ordersTrans====',this.props.ordersTrans);
        this.ordersTrans = this.props.ordersTrans;
        //this.transState = this.transStateMapping(this.ordersTrans.status ? this.ordersTrans.status : 0);
        this.tagSelect = [{
            name: '物流',
            check: true,
            id: 1
        }, {
            name: '自提',
            check: false,
            id: 0
        }];
        /*        this.state = {
         fillWaybill: true,
         alreadyChoose: this.transState !== 0 && this.transState !== 1,
         waybillState: ''
         }*/
        this.state = {
            fillWaybill: true,
            ordersTrans: this.props.ordersTrans
        }
    }

    /**
     *    运单状态映射
     **/
    transStateMapping = (status) => {
        switch (status) {
            case 0:
                return 0;
                break;
            case 1:
            case 100:
            case 101:
                return 1;
                break;
            case 2:
            case 200:
            case 3:
                return 2;
                break;
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 11:
            case 10:
            case 12:
            case 13:
            case 14:
            case 15:
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
        //let alreadyChoose = this.transStateMapping(this.state.ordersTrans.status);
        //let waybillState = '运费' + this.state.ordersTrans.total_amount + '元';
        //console.log('alreadyChoose===', alreadyChoose);
        return (
            <View style={{backgroundColor: '#ffffff'}}>
                {(0 === 0 || 0 === 1) && (<View style={{
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
                {this.state.fillWaybill && (<View style={styles.separatedLine}/>)}
                {this.state.fillWaybill && (
                    <TouchableOpacity
                        onPress={() => {
                            if (2 > 1) {
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
                                        transId: this.props.orderDetail.orders_trans[0].id,
                                    }

                                });
                            }
                        }}>
                        <View style={{
                            height: Pixel.getPixel(44), flexDirection: 'row', alignItems: 'center',
                            paddingLeft: Pixel.getPixel(15), paddingRight: Pixel.getPixel(15)
                        }}>
                            <Text >{1 !== 0 ? '运单信息' : '填写运单'}</Text>
                            <View style={{flex: 1}}/>
                            <Text style={{color: fontAndColor.COLORB0}}>{11}</Text>
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