/**
 * Created by hanmeng on 2018/1/8.
 */
import React, {PureComponent} from 'react'

import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    Image
} from  'react-native'

const {width, height} = Dimensions.get('window');
import * as fontAndColor from '../../../constant/fontAndColor';
import PixelUtil from '../../../utils/PixelUtil';
import TagSelectView from "./TagSelectView";
import ChooseModal from "./ChooseModal";
import BaseComponent from "../../../component/BaseComponent";
import SelectDestination from "../orderwuliu/SelectDestination";
import StorageUtil from "../../../utils/StorageUtil";
import {request} from "../../../utils/RequestUtil";
import * as StorageKeyNames from "../../../constant/storageKeyNames";
import * as AppUrls from "../../../constant/appUrls";
import AddressManage from "../orderwuliu/AddressManage";
import CheckWaybill from "../orderwuliu/CheckWaybill";
import FillWaybill from "../orderwuliu/FillWaybill";
const Pixel = new PixelUtil();

export default class LogisticsModeForFinancing extends BaseComponent {

    /**
     *  初始化
     * @param props
     **/
    constructor(props) {
        super(props);
        this.addressId = '';
        this.tagSelect = [{
            name: '使用物流',
            check: false,
            id: 0
        }, {
            name: '同城同市场',
            check: false,
            id: 1
        }];
        this.state = {
            //useLogistics: 'al'
            isStore: this.props.orderDetail.orders_item_data[0].is_store,  // 是否在店 0没有申请 1申请中 2驳回 3同意
            ordersTrans: this.props.ordersTrans
        }
    }

    /**
     *  页面 Receive
     * @param nextProps new Props
     **/
    componentWillReceiveProps(nextProps) {
        this.setState({
            isStore: nextProps.orderDetail.orders_item_data[0].is_store,
            ordersTrans: nextProps.ordersTrans
        });
    }

    onTagClick = (dt, index) => {
        //单选
        /*        this.tagSelect.map((data) => {
         data.check = false;
         });
         this.tagSelect[index].check = !this.tagSelect[index].check;
         this.tagRef.refreshData(this.tagSelect);*/
        if (index === 0) {
            // 使用物流  跳转到选择目的地页
            this.toNextPage({
                name: 'SelectDestination',
                component: SelectDestination,
                params: {
                    orderId: this.props.orderDetail.id,
                    vType: this.props.orderDetail.orders_item_data[0].car_data.v_type,
                    callBack: this.updateOrdersTrans,
                    maxLoanmny: this.props.financeInfo.max_loanmny  // 订单融资最大可贷额度
                }

            });
        } else {
            // 同城同市场
            this.refs.chooseModal.changeShowType(true, '取消', '确定', '选择同城同市场需要风控人员后台审核确认，是否继续？',
                () => {
                    this.toNextPage({
                            name: 'AddressManage',
                            component: AddressManage,
                            params: {
                                callBack: this.isCarStoreCheck
                            }
                        }
                    );
                });
        }
    };

    /**
     * 同城同市场
     **/
    isCarStoreCheck = (callBackInfo) => {
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    company_id: datas.company_base_id,
                    order_id: this.props.orderDetail.id,
                    address_id: callBackInfo.id
                };
                let url = AppUrls.IS_CAR_STORE_CHECK;
                request(url, 'post', maps).then((response) => {
                    this.props.showModal(false);
                    if (response.mjson.msg === 'ok' && response.mjson.code === 1) {
                        //this.props.showToast(response.mjson.msg);
                        this.props.refresh();
                    }
                }, (error) => {
                    this.props.showModal(false);
                    this.props.showToast(error.mjson.msg);
                });
            } else {
                this.props.showModal(false);
                this.props.showToast('同城同市场审核发起失败');
            }
        });
    };

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
     *
     **/
    updateOrdersTrans = (newOrdersTrans) => {
        //console.log('newOrdersTrans======', newOrdersTrans);
        newOrdersTrans.status = newOrdersTrans.trans_status;
        this.props.updateOrdersTrans(newOrdersTrans);
        if (newOrdersTrans.status >= 1) {
            this.props.updateLogisticsType(1);
        }
        //this.ordersTrans = newOrdersTrans;
        this.setState({
            ordersTrans: newOrdersTrans
        });
    };

    /**
     *  render
     **/
    render() {
        let views = '';
        let alreadyChoose = this.transStateMapping(this.state.ordersTrans);  // 是否已经生成运单并支付完成
        if (this.state.isStore == 1) {  // 选择 同城同市场
            views =
                <View>
                    <View style={{
                        height: Pixel.getPixel(44), flexDirection: 'row', alignItems: 'center',
                        paddingLeft: Pixel.getPixel(15), paddingRight: Pixel.getPixel(15)
                    }}>
                        <Text >同城同市场</Text>
                        <View style={{flex: 1}}/>
                        <Text style={{color: fontAndColor.COLORB2}}>审核中</Text>
                    </View>
                    <View style={styles.separatedLine}/>
                    <View style={{
                        flexDirection: 'row', alignItems: 'center',
                    }}>
                        <View style={{flexDirection: 'row', alignItems: 'flex-start', margin: Pixel.getPixel(15)}}>
                            <Text style={{
                                color: fontAndColor.COLORA1,
                                fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28)
                            }}>审核地址</Text>
                            <View style={{flex: 1}}/>
                            <Text style={{
                                fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                                textAlign: 'right', width: Pixel.getPixel(250)
                            }}>
                                {this.props.orderDetail.orders_item_data[0].store_address.full_address}
                            </Text>
                        </View>
                    </View>
                </View>
        } else if (this.state.isStore == 3) {  // 选择 同城同市场
            views =
                <View>
                    <View style={{
                        height: Pixel.getPixel(44), flexDirection: 'row', alignItems: 'center',
                        paddingLeft: Pixel.getPixel(15), paddingRight: Pixel.getPixel(15)
                    }}>
                        <Text >同城同市场</Text>
                        <View style={{flex: 1}}/>
                        <Text style={{color: fontAndColor.COLORB2}}>已同意</Text>
                    </View>
                </View>
        } else if (alreadyChoose.state > 0 && (this.state.isStore == 0 || this.state.isStore == 2) &&
            (this.state.ordersTrans.logistics_type == 2 || this.state.ordersTrans.logistics_type == 3)) {  // 选择物流
            views =
                <TouchableOpacity
                    onPress={() => {
                        if (alreadyChoose.state < 2) {
                            this.toNextPage({
                                name: 'FillWaybill',
                                component: FillWaybill,
                                params: {
                                    orderId: this.props.orderDetail.id,
                                    logisticsType: this.state.ordersTrans.logistics_type,
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
                        <Text >运单信息</Text>
                        <View style={{flex: 1}}/>
                        <Text style={{color: fontAndColor.COLORB0}}>{alreadyChoose.waybillState}</Text>
                        <Image source={require('../../../../images/mainImage/celljiantou.png')}/>
                    </View>
                </TouchableOpacity>
        } else if ((alreadyChoose.state < 1 && (this.state.isStore == 0 || this.state.isStore == 2)) ||
            (this.state.ordersTrans.logistics_type != 2 && this.state.ordersTrans.logistics_type != 3)) {  // 未选择
            views =
                <View style={{
                    height: Pixel.getPixel(44), flexDirection: 'row', alignItems: 'center',
                    paddingLeft: Pixel.getPixel(15), paddingRight: Pixel.getPixel(15)
                }}>
                    <Text >交车方式</Text>
                    <View style={{flex: 1}}/>
                    <TagSelectView
                        buttonWidth={Pixel.getPixel(120)}
                        textSize={Pixel.getPixel(15)}
                        paddingHorizontal={Pixel.getPixel(8)}
                        ref={(ref) => {
                            this.tagRef = ref;
                        }} onTagClick={this.onTagClick} cellData={this.tagSelect}/>
                </View>
        } else {
            views =
                <View>
                </View>
        }
        return (
            <View style={{backgroundColor: '#ffffff'}}>
                {views}
                <ChooseModal ref='chooseModal' title='提示'
                             negativeButtonStyle={styles.negativeButtonStyle}
                             negativeTextStyle={styles.negativeTextStyle} negativeText='取消'
                             positiveButtonStyle={styles.positiveButtonStyle}
                             positiveTextStyle={styles.positiveTextStyle} positiveText='确定'
                             buttonsMargin={Pixel.getPixel(20)}
                             positiveOperation={() => {
                             }}
                             content=''/>
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
    positiveTextStyle: {
        fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),
        color: '#ffffff'
    },
    positiveButtonStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: Pixel.getPixel(15),
        backgroundColor: fontAndColor.COLORB0,
        width: Pixel.getPixel(100),
        height: Pixel.getPixel(32),
        borderRadius: 3,
        borderWidth: 1,
        borderColor: fontAndColor.COLORB0
    },
    negativeTextStyle: {
        fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),
        color: fontAndColor.COLORB0
    },
    negativeButtonStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Pixel.getPixel(100),
        height: Pixel.getPixel(32),
        borderRadius: 3,
        borderWidth: 1,
        borderColor: fontAndColor.COLORB0
    }
});