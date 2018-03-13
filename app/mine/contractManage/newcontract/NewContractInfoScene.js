/**
 * Created by lhc on 2017/2/15.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    InteractionManager,
    Modal,
    WebView
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
let RJson = {};
import BaseComponent from '../../../component/BaseComponent';
import NavigationView from '../../../component/AllNavigationView';
import * as fontAndColor from '../../../constant/fontAndColor';
import ViewPager from 'react-native-viewpager';
import SelectLoanNumber from '../../../finance/lend/component/NewSelectLoanNumber';
let numberPage = 0;
let namePage = 0;
import {request} from '../../../utils/RequestUtil';
import * as Urls from '../../../constant/appUrls';

export  default class ContractInfoScene extends BaseComponent {

    constructor(props, context) {
        super(props, context);
        this.state = {renderPlaceholderOnly: 'blank', dataSource: ''};
    }


    initFinish = () => {
        this.getData();
    }

    getData = () => {
        let maps = {
            api: Urls.CONTRACT_LOAN_CONTRACT_LIST,
            payment_number: this.props.payment_number,
        };
        request(Urls.FINANCE, 'Post', maps)
            .then((response) => {
                    RJson = response.mjson;
                    this.setState({
                        dataSource: RJson.data.contract_list[namePage].contract_url,
                        renderPlaceholderOnly: 'success',
                    });
                },
                (error) => {
                    this.setState({renderPlaceholderOnly: 'error'});
                });
    }

    contractSign = () => {
        this.props.showModal(true);
        let maps = {
            api: Urls.SIGN_CONTRACT_BY_ONE,
            payment_number: this.props.payment_number,
        };
        request(Urls.FINANCE, 'Post', maps)
            .then((response) => {
                    this.props.showToast('签署成功');
                    this.setState({
                        renderPlaceholderOnly:'loading'
                    });
                    this.getData();
                },
                (error) => {
                    this.props.showToast('签署失败');
                });
    }


    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        }
        return (
            <View style={{flex:1,backgroundColor: fontAndColor.COLORA3}}>

                <WebView style={{marginTop:Pixel.getTitlePixel(64),flex:1}}
                         source={{uri:RJson.data.contract_list[namePage].contract_url,method: 'GET'}}
                         javaScriptEnabled={true}
                         domStorageEnabled={true}
                         scalesPageToFit={false}
                >

                </WebView>
                <View style={{width:width,height:Pixel.getPixel(44),flexDirection: 'row'}}>
                    <TouchableOpacity onPress={()=>{
                        this.refs.selectloannumber.openModalForName(RJson.data.contract_list);
                    }} activeOpacity={0.8} style={{flex:1,backgroundColor:fontAndColor.COLORA2,justifyContent:'center'
                    ,alignItems:'center',flexDirection:'row'}}>
                        <Image style={{width:Pixel.getPixel(14),height:Pixel.getPixel(15)}}
                               source={require('../../../../images/financeImages/contractInfo.png')}/>
                        <Text allowFontScaling={false}  numberOfLines={1} style={{fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                        color:'#fff',width:width/2-Pixel.getPixel(Pixel.getPixel(28)),marginLeft:Pixel.getPixel(5)}}>
                            {RJson.data.contract_list[namePage].contract_name}</Text>
                    </TouchableOpacity>
                    {this.props.showButton == true ? <TouchableOpacity onPress={()=>{
                       this.contractSign();
                    }
                    } activeOpacity={0.8} style={{flex:1,backgroundColor:fontAndColor.COLORB0,justifyContent:'center'
                    ,alignItems:'center'}}>
                            <Text allowFontScaling={false}  style={{fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                        color:'#fff'}}>签署合同</Text>
                        </TouchableOpacity> : <View/>}
                </View>
                <SelectLoanNumber ref="selectloannumber" numberBack={(rowID)=>{
                    numberPage=rowID;
                    namePage=0;
                    this.getData();
                }} nameBack={(rowID)=>{
                    namePage=rowID;
                    this.getData();
                }}
                />

                <NavigationView
                    title="合同"
                    backIconClick={this.backPage}
                />
            </View>
        );

    }

    _renderPage = (data) => {

        return (
            <Image onLoadEnd={()=>{
                this.props.showModal(false);
            }} onLoadStart={()=>{
                this.props.showModal(true);
            }} style={{flex:1}}
                   source={{uri: data}}
            />
        );

    }

    _renderPageIndicator = () => {

        return (
            <View
            />
        );

    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor: fontAndColor.COLORA3}}>
                {this.loadView()}
                <NavigationView
                    title="合同"
                    backIconClick={this.backPage}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({

    image: {

        width: 43,
        height: 43,
    },
    tabView: {
        flex: 1,
        padding: 10,
        backgroundColor: 'red',
    }
})