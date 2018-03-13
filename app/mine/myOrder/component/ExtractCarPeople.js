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
import SelectPickUp from "../orderwuliu/SelectPickUp";
import BaseComponent from "../../../component/BaseComponent";
const Pixel = new PixelUtil();

export default class ExtractCarPeople extends BaseComponent {

    /**
     *  初始化
     * @param props
     **/
    constructor(props) {
        super(props);
        //console.log('ordersTrans.geter_data====', this.props.ordersTrans.geter_data);
        this.state = {
            geterName: this.existGeterData(this.props.ordersTrans.geter_data) ? '查看' : '选择'
        }
    }

    /**
     *  页面 Receive
     * @param nextProps new Props
     **/
    componentWillReceiveProps(nextProps) {
        //console.log('nextProps====', nextProps);
        this.setState({
            geterName: this.existGeterData(nextProps.ordersTrans.geter_data) ? '查看' : '选择'
        });
    }

    /**
     *   判断订单是否选择了提车人
     **/
    existGeterData = (geterData) => {
        //console.log('geterData=====', geterData);
        if (geterData == '' || geterData.length == 0) {
            return false;
        } else {
            return true;
        }
    };

    /**
     *
     **/
    updateGeterData = (newOrdersTrans) => {
        this.props.updateGeterData(newOrdersTrans);
        this.setState({
            geterName: this.existGeterData(newOrdersTrans) ? '查看' : '选择'
        });
    };

    /**
     *  render
     **/
    render() {
        return (
            <TouchableOpacity style={{backgroundColor: '#ffffff'}}
                              onPress={() => {
                                  this.toNextPage({
                                      name: 'SelectPickUp',
                                      component: SelectPickUp,
                                      params: {
                                          callBack: this.updateGeterData,
                                          orderId: this.props.orderDetail.id,
                                          isSelect: this.state.geterName === '查看'
                                      }
                                  });
                              }}>
                <View style={{
                    height: Pixel.getPixel(44), flexDirection: 'row', alignItems: 'center',
                    paddingLeft: Pixel.getPixel(15), paddingRight: Pixel.getPixel(15)
                }}>
                    <Text >提车人</Text>
                    <View style={{flex: 1}}/>
                    <Text >{this.state.geterName}</Text>
                    <Image source={require('../../../../images/mainImage/celljiantou.png')}/>
                </View>
            </TouchableOpacity>
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