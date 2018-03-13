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
    InteractionManager,
    TouchableWithoutFeedback
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtil';
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";
const Pixel = new PixelUtil();
import * as fontAndColor from '../../constant/fontAndColor';
import BaseComponent from '../../component/BaseComponent';
import NavigationView from '../../component/AllNavigationView';
import OpenIndividualAccountScene from './OpenIndividualAccountScene';
import OpenEnterpriseAccountScene from './OpenEnterpriseAccountScene';
export  default class AccountTypeSelectScene extends BaseComponent {

    constructor(props) {
        super(props);

        this.state = {
            renderPlaceholderOnly: 'blank',
        }



    }

    initFinish = () => {
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data) => {
            if (data.code == 1) {
                let userData = JSON.parse(data.result);
                StorageUtil.mGetItem(String(userData['base_user_id'] + StorageKeyNames.HF_INDICATIVE_LAYER), (subData) => {
                    if (subData.code == 1) {
                        let obj = JSON.parse(subData.result);
                        if (obj == null) {
                            obj = {};
                        }
                        if (obj[StorageKeyNames.HF_OPEN_INDIVIDUAL_OPTION] == null) {
                            obj[StorageKeyNames.HF_OPEN_INDIVIDUAL_OPTION] = false;
                            obj[StorageKeyNames.HF_OPEN_ENTERPRISE_OPTION] = false;
                            StorageUtil.mSetItem(String(userData['base_user_id'] + StorageKeyNames.HF_INDICATIVE_LAYER), JSON.stringify(obj), () => {})
                        }
                        this.setState({
                            renderPlaceholderOnly: 'success',
                            mbXzKtgrzh: obj[StorageKeyNames.HF_OPEN_INDIVIDUAL_OPTION],
                            mbXzKtqyzh: obj[StorageKeyNames.HF_OPEN_ENTERPRISE_OPTION],
                            source: ds.cloneWithRows(['1', '2']),
                        })
                    }

                })

            }
        })

    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        }
        return (
            <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1}}>
                <ListView
                    removeClippedSubviews={false}
                    style={{marginTop: Pixel.getTitlePixel(79)}}
                    dataSource={this.state.source}
                    renderRow={this._renderRow}
                    renderSeparator={this._renderSeparator}
                    renderFooter={this._renderFooter}
                />
                <NavigationView
                    title="账户类型选择"
                    backIconClick={this.backPage}
                />
                {
                    this.state.mbXzKtgrzh == false ?
                        <View style={{position: 'absolute',bottom:0,top:0,width:width}}>
                            <TouchableWithoutFeedback

                                onPress={()=>{

                                    StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data)=>{
                                        if (data.code ==1){
                                            let userData = JSON.parse(data.result);
                                            StorageUtil.mGetItem( String(userData['base_user_id']+StorageKeyNames.HF_INDICATIVE_LAYER) ,(subData)=>{
                                                if (subData.code == 1){
                                                    let obj = JSON.parse(subData.result);
                                                    obj[StorageKeyNames.HF_OPEN_INDIVIDUAL_OPTION] = true;
                                                    StorageUtil.mSetItem(String(userData['base_user_id']+StorageKeyNames.HF_INDICATIVE_LAYER), JSON.stringify(obj), ()=>{
                                                        this.setState({
                                                            mbXzKtgrzh: obj[StorageKeyNames.HF_OPEN_INDIVIDUAL_OPTION],
                                                            mbXzKtqyzh: obj[StorageKeyNames.HF_OPEN_ENTERPRISE_OPTION]
                                                        })

                                                    })

                                                }
                                            })
                                        }
                                    })


                                }}
                                >
                                <Image style={{width:width,flex:1,resizeMode:'stretch'}}
                                       source={require('../../../images/tishimengban/mb_xz_ktgrzh.png')}/>
                            </TouchableWithoutFeedback>
                        </View> : null
                }
                {
                    this.state.mbXzKtqyzh == false && this.state.mbXzKtgrzh == true ?
                        <View style={{position: 'absolute',bottom:0,top:0,width:width}}>
                            <TouchableWithoutFeedback

                                onPress={()=>{

                                    StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data)=>{
                                        if (data.code ==1){
                                            let userData = JSON.parse(data.result);
                                            StorageUtil.mGetItem( String(userData['base_user_id']+StorageKeyNames.HF_INDICATIVE_LAYER) ,(subData)=>{
                                                if (subData.code == 1){
                                                    let obj = JSON.parse(subData.result);
                                                    obj[StorageKeyNames.HF_OPEN_ENTERPRISE_OPTION] = true;
                                                    StorageUtil.mSetItem(String(userData['base_user_id']+StorageKeyNames.HF_INDICATIVE_LAYER), JSON.stringify(obj), ()=>{
                                                        this.setState({
                                                            mbXzKtgrzh: obj[StorageKeyNames.HF_OPEN_INDIVIDUAL_OPTION],
                                                            mbXzKtqyzh: obj[StorageKeyNames.HF_OPEN_ENTERPRISE_OPTION]
                                                        })

                                                    })

                                                }
                                            })
                                        }
                                    })


                                }}
                            >
                                <Image style={{width:width,height:Pixel.getPixel(660),resizeMode:'stretch'}}
                                       source={require('../../../images/tishimengban/mb_xz_ktqyzh.png')}/>
                            </TouchableWithoutFeedback>
                            <View style = {{flex:1, backgroundColor:'rgba(0,0,0,.7)'}}/>
                        </View> : null
                }
            </View>
        );
    }

    _renderRow = (movie, sectionId, rowId) => {
        if (movie == '1') {
            return (
                <TouchableOpacity
                    onPress={()=> {
                    this.toNextPage({name:'OpenIndividualAccountScene',component:OpenIndividualAccountScene,params:{callBack:
                        ()=>{this.props.callBack();},title:'开通个人账户',buttonText:'确认开通'}})
                }}
                    activeOpacity={0.8}
                    style={{
                    flex:1, height: Pixel.getPixel(95),
                    backgroundColor: '#fff', flexDirection: 'row',alignItems:'center'
                }}>
                    <View style={{flex:1,height: Pixel.getPixel(95),justifyContent:'center',alignItems: 'center'}}>
                        <Image style={{width:Pixel.getPixel(39),height:Pixel.getPixel(39)}}
                               source={require('../../../images/mainImage/individualaccount.png')}/>
                    </View>
                    <View style={{flex:3,height: Pixel.getPixel(95),justifyContent:'center'}}>
                        <Text allowFontScaling={false}
                              style={{color: fontAndColor.COLORA0,fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30)}}>
                            开通个人账户</Text>
                        <Text allowFontScaling={false} style={{color: fontAndColor.COLORA1,fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                    marginTop:Pixel.getPixel(8)}}>
                            开通个人账户将绑定个人银行卡，每个自然人只能开通一个个人账户</Text>
                    </View>
                    <View style={{flex:1,height: Pixel.getPixel(95),justifyContent:'center',alignItems: 'center'}}>
                        <Image style={{width:Pixel.getPixel(14),height:Pixel.getPixel(14)}}
                               source={require('../../../images/mainImage/celljiantou.png')}/>
                    </View>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity
                    onPress={()=> {
                        this.toNextPage({name:'OpenEnterpriseAccountScene',
                        component:OpenEnterpriseAccountScene,params:{callBack:
                        ()=>{this.props.callBack();},title:'开通企业账户',buttonText:'确认开通'}})
                }}
                    activeOpacity={0.8}
                    style={{
                    flex:1, height: Pixel.getPixel(95),
                    backgroundColor: '#fff', flexDirection: 'row',alignItems:'center'
                }}>
                    <View style={{flex:1,height: Pixel.getPixel(95),justifyContent:'center',alignItems: 'center'}}>
                        <Image style={{width:Pixel.getPixel(39),height:Pixel.getPixel(39)}}
                               source={require('../../../images/mainImage/Enterpriseaccount.png')}/>
                    </View>
                    <View style={{flex:3,height: Pixel.getPixel(95),justifyContent:'center'}}>
                        <Text allowFontScaling={false}
                              style={{color: fontAndColor.COLORA0,fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30)}}>
                            开通企业账户</Text>
                        <Text allowFontScaling={false} style={{color: fontAndColor.COLORA1,fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                    marginTop:Pixel.getPixel(8)}}>
                            开通企业账户将绑定企业账户，每个自然人可以开通多个企业账户</Text>
                    </View>
                    <View style={{flex:1,height: Pixel.getPixel(95),justifyContent:'center',alignItems: 'center'}}>
                        <Image style={{width:Pixel.getPixel(14),height:Pixel.getPixel(14)}}
                               source={require('../../../images/mainImage/celljiantou.png')}/>
                    </View>
                </TouchableOpacity>
            )
        }

    }

    _renderSeparator(sectionId, rowId) {

        return (
            <View style={styles.Separator} key={sectionId + rowId}>
            </View>
        )
    }

    _renderFooter() {

        return (
            <View style={{backgroundColor: fontAndColor.COLORA3,width:width,height:Pixel.getPixel(45),
            flexDirection:'row',paddingRight:Pixel.getPixel(15),paddingLeft:Pixel.getPixel(23)}}>
                <Text allowFontScaling={false}
                      style={{color: fontAndColor.COLORA0,fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24)}}>注意：</Text>
                <Text allowFontScaling={false} style={{color: fontAndColor.COLORA1,fontSize:
                Pixel.getFontPixel(fontAndColor.CONTENTFONT24)}}>请根据您的借款情况选择开户类型，开通以后不能修改</Text>
            </View>
        )
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor: fontAndColor.COLORA3}}>
                {this.loadView()}
                <NavigationView
                    title="账户类型选择"
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
        height: Pixel.getPixel(10),

    },
    margin: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)

    },
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'}
})