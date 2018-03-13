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
    ListView,
    InteractionManager
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../constant/fontAndColor';
import BaseComponent from '../../component/BaseComponent';
import NavigationView from '../../component/AllNavigationView';
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";
import {request} from '../../utils/RequestUtil';
import * as Urls from '../../constant/appUrls';
export  default class RechargeScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            renderPlaceholderOnly: 'blank',
            name:'',
            cardNumber:''
        };
    }

    initFinish = () => {
        this.getData()
    }
    allRefresh = () => {
        this.setState({
            renderPlaceholderOnly:'loading'
        });
        this.getData()
    }

    getData=()=>{
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas=JSON.parse(data.result);
                let maps = {
                    enter_base_ids:datas.company_base_id,
                    child_type:'1'
                };

                request(Urls.USER_ACCOUNT_INFO, 'Post', maps)
                    .then((response) => {
                            this.setState({
                                renderPlaceholderOnly: 'success',
                                name:response.mjson.data.account.bank_card_name	,
                                cardNumber:response.mjson.data.account.bank_card_no
                            });
                        },
                        (error) => {
                            this.props.showToast('用户信息查询失败');
                            this.setState({
                                renderPlaceholderOnly: 'error'
                            });

                        });
            } else {
                this.props.showToast('用户信息查询失败');
                this.setState({
                    renderPlaceholderOnly: 'error'
                });
            }
        })
    }


    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        }
        return (
            <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1}}>
                <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1}}>

                    <View style={{width:width,backgroundColor: '#fff',
                paddingLeft: Pixel.getPixel(15),paddingRight: Pixel.getPixel(15),marginTop:Pixel.getTitlePixel(79)}}>
                        <View style={{width:width-Pixel.getPixel(30),height:Pixel.getPixel(15),flexDirection: 'row',
                      }}>
                            {/*<View style={{flex:1,paddingTop: Pixel.getPixel(35),alignItems: 'center'}}>*/}
                                {/*<Image style={{width:Pixel.getPixel(61),height:Pixel.getPixel(61)}}*/}
                                       {/*source={require('../../../images/mainImage/guitai.png')}></Image>*/}
                                {/*<Text allowFontScaling={false}  style={{color: '#000',fontSize: Pixel.getPixel(14),marginTop:Pixel.getPixel(5)}}>柜台办理</Text>*/}
                            {/*</View>*/}
                            {/*<View style={{flex:1,paddingTop: Pixel.getPixel(35),alignItems: 'center'}}>*/}
                                {/*<Image style={{width:Pixel.getPixel(61),height:Pixel.getPixel(61)}}*/}
                                       {/*source={require('../../../images/mainImage/wangyinzhuanzhang.png')}></Image>*/}
                                {/*<Text allowFontScaling={false}  style={{color: '#000',fontSize: Pixel.getPixel(14),marginTop:Pixel.getPixel(5)}}>网银转账</Text>*/}
                            {/*</View>*/}
                            {/*<View style={{flex:1,paddingTop: Pixel.getPixel(35),alignItems: 'center'}}>*/}
                                {/*<Image style={{width:Pixel.getPixel(61),height:Pixel.getPixel(61)}}*/}
                                       {/*source={require('../../../images/mainImage/shoujiyinhang.png')}></Image>*/}
                                {/*<Text allowFontScaling={false}  style={{color: '#000',fontSize: Pixel.getPixel(14),marginTop:Pixel.getPixel(5)}}>手机银行</Text>*/}
                            {/*</View>*/}
                        </View>
                        <Text allowFontScaling={false}  style={{color: fontAndColor.COLORA1,fontSize: Pixel.getPixel(14),lineHeight:21}}>
                            您可以使用您的银行卡，通过线下转账（柜台、网银、手机银行）的方式将资金充值到您的恒丰银行账户下。
                        </Text>
                        <View style={{width:width-Pixel.getPixel(30),height:Pixel.getPixel(120),marginTop:Pixel.getPixel(15),marginBottom:Pixel.getPixel(15),
                    borderRadius: Pixel.getPixel(4),backgroundColor:fontAndColor.COLORA3,justifyContent:'center',paddingLeft:
                    Pixel.getPixel(15)}}>
                            <Text allowFontScaling={false}  style={{color: '#000',fontSize: Pixel.getPixel(14)}}>转账时填写的信息如下：</Text>
                            <Text allowFontScaling={false}  style={{fontWeight: 'bold',color: '#000',fontSize: Pixel.getPixel(14),marginTop:Pixel.getPixel(7)}}>
                                收款人姓名：{this.state.name}</Text>
                            <Text allowFontScaling={false}  style={{fontWeight: 'bold',color: '#000',fontSize: Pixel.getPixel(14),marginTop:Pixel.getPixel(5)}}>
                                收款账号：{this.state.cardNumber}</Text>
                            <Text allowFontScaling={false}  style={{fontWeight: 'bold',color: '#000',fontSize: Pixel.getPixel(14),marginTop:Pixel.getPixel(5)}}>
                                收款银行：恒丰银行</Text>
                        </View>


                    </View>
                    <Text allowFontScaling={false}  style={{color: fontAndColor.COLORA1,fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                              marginTop:Pixel.getPixel(20),marginLeft:Pixel.getPixel(15),marginRight:Pixel.getPixel(15),lineHeight:18}}>
                        5万元以上金额充值由于需要审核无法做到实时到账，如急需账户用款请选择5万元以下的小额实时到账充值。
                    </Text>

                </View>
                <NavigationView
                    title="充值"
                    backIconClick={this.backPage}
                />
            </View>
        );
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor: fontAndColor.COLORA3}}>
                {this.loadView()}
                <NavigationView
                    title="充值"
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
    Separator: {
        backgroundColor: fontAndColor.COLORA3,
        height: 1,

    },
    margin: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)

    },
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'}
})