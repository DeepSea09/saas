import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View, TouchableOpacity, Dimensions, Image,
} from 'react-native';
import BaseComponent from '../../../component/BaseComponent';
import NavigatorView from '../../../component/AllNavigationView';

const {width} = Dimensions.get('window');
import * as FontAndColor from '../../../constant/fontAndColor';
import PixelUtil from '../../../utils/PixelUtil';

const Pixel = new PixelUtil();
const cellJianTou = require('../../../../images/mainImage/celljiantou@2x.png');
const to_factory_icon = require('../../../../images/to_factory_icon.png');
const to_store_icon = require('../../../../images/to_store_icon.png');
const destination_bg = require('../../../../images/destination_bg.png');
import FillWaybill from "./FillWaybill";

let destinationInfo = [{name: '到库', image: to_factory_icon}, {name: '到店', image: to_store_icon}];
export default class SelectDestination extends BaseComponent {
    constructor(props) {
        super(props);
        this.orderId = this.props.orderId,
            this.vType = this.props.vType,
            this.maxLoanmny = this.props.maxLoanmny
        this.state = {
            renderPlaceholderOnly: false,
        }
    }

    initFinish() {
        this.setState({
            renderPlaceholderOnly: 'success'
        });
    }

    toPage = (index) => {
        if (index == 0) {//到库
            this.logisticsType='3';
            this.toStore='1'
        }else {//到店
            this.logisticsType='2';
            this.toStore='0';
        }
        this.toNextPage({
            name: 'FillWaybill',
            component: FillWaybill,
            params: {
                toStore: this.toStore,
                orderId: this.orderId,
                vType: this.vType,
/*                callBack: (data)=>{
                    this.backPage();
                    this.props.callBack(data);
                },*/
                callBack: this.props.callBack,
                maxLoanmny: this.maxLoanmny,
                logisticsType:this.logisticsType
            }

        });

    }

    _renderItem = () => {
        return (
            <View style={{flex: 1}}>

                <View style={{
                    marginTop: Pixel.getPixel(20),
                    marginHorizontal: Pixel.getPixel(20)
                }}>
                    {
                        destinationInfo.map((data, index) => {
                            return (
                                <TouchableOpacity key={index + 'destinationInfo'} activeOpacity={0.8} onPress={() => {
                                    this.toPage(index);
                                }}>
                                    <View style={styles.content_title_text_wrap}>
                                        <Image source={data.image} style={{marginLeft: Pixel.getPixel(20)}}/>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={[styles.content_base_Right]}>{data.name}</Text>
                                            <Image source={cellJianTou} style={{
                                                marginRight: Pixel.getPixel(30),
                                                marginLeft: Pixel.getPixel(15)
                                            }}></Image>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }

                </View>
            </View>
        );

    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return ( <View style={styles.container}>
                {this.loadView()}
                <NavigatorView title='选择目的地' backIconClick={this.backPage}/>
            </View>);
        } else {
            return (<View style={styles.container}>
                <View style={{flex: 1, marginTop: Pixel.getTitlePixel(64),}}>
                    {
                        this._renderItem()
                    }
                </View>
                <Image source={destination_bg} style={{width: width, position: 'absolute', bottom: 0}}/>
                <NavigatorView title='选择目的地' backIconClick={this.backPage}/>
            </View>)
        }

    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: FontAndColor.COLORB0,
        flex: 1,
    },
    content_title_text_wrap: {
        height: Pixel.getPixel(160),
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 3,
        borderColor: 'white',
        justifyContent: 'space-between',
        marginTop: Pixel.getPixel(20),
    },
    content_base_Right: {
        fontSize: Pixel.getFontPixel(20),
        color: 'black',
    },


});
