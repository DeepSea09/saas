/**
 * Created by lhc on 2017/2/15.
 */
import React, {Component, PureComponent} from 'react';
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
    Clipboard,
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../../../constant/fontAndColor';
import NavigationView from '../../../../component/AllNavigationView';
let list = [];
export class listValue {
    constructor(key, imageFile, click) {

        this.key = key;
        this.imageFile = imageFile;
        this.click = click;
    }
}
export  default class ZheShangAccountTitle extends PureComponent {

    constructor(props) {
        super(props);
        list = [];
        list.push(new listValue('账户流水', require('../../../../../images/mainImage/flow.png'), this.props.flow));
        list.push(new listValue('更换银行卡', require('../../../../../images/mainImage/bankCard.png'), this.props.bankCard));
        list.push(new listValue('修改银行预留手机号码', require('../../../../../images/mainImage/changePhone.png'), this.props.changePhone));
    }

    /**
     * from @zhaojian
     *
     * 去掉js存储数字的后缀
     **/
    toDecimal = (x) => {
        let val = Number(x)
        if (!isNaN(parseFloat(val))) {
            val = val.toFixed(2);
        }
        return val;
    }


    render() {
        let itemList = [];
        itemList.push(<View key={'top'} style={{width:width,height:Pixel.getPixel(30),backgroundColor:fontAndColor.COLORA3,
        justifyContent:'center'}}>
            <Text allowFontScaling={false} style={{color:fontAndColor.COLORA1,fontSize: Pixel.getPixel(fontAndColor.CONTENTFONT24),
            marginLeft:Pixel.getPixel(15)}}>账户功能</Text>
        </View>);
        for (let i = 0; i < list.length; i++) {

            if(i === list.length-1){
                if(this.props.info.bind_bank_card_type === 1){  //本行对公对私、不显示解绑及修改手机号功能；（属后期优化）
                    break;
                }
            }

            itemList.push(<TouchableOpacity onPress={()=>{
                list[i].click();
            }} activeOpacity={0.8} key={i+'11'} style={{width:width,height:Pixel.getPixel(44),backgroundColor:'#fff',
            marginTop:Pixel.getPixel(1),flexDirection: 'row'}}>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Image style={{width:Pixel.getPixel(24),height:Pixel.getPixel(24)}}
                           source={list[i].imageFile}/>
                </View>
                <View style={{flex:4,justifyContent:'center'}}>
                    <Text allowFontScaling={false}
                          style={{fontSize: Pixel.getFontPixel(14),color: '#000'}}>{list[i].key}</Text>
                </View>
                <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                    <Image style={{width:Pixel.getPixel(14),height:Pixel.getPixel(14),marginRight:Pixel.getPixel(15)}}
                           source={require('../../../../../images/mainImage/celljiantou.png')}/>
                </View>
            </TouchableOpacity>);
        }
/*        itemList.push(
            <View key={'end'} style={{width:width,height:Pixel.getPixel(30),backgroundColor:fontAndColor.COLORA3,
        flexDirection: 'row'}}>
                <View style={{flex:1,justifyContent:'center'}}>
                    <Text allowFontScaling={false} style={{color:fontAndColor.COLORA1,fontSize: Pixel.getPixel(fontAndColor.CONTENTFONT24),
            marginLeft:Pixel.getPixel(15)}}>最近流水</Text>
                </View>
                <TouchableOpacity onPress={()=>{
                    this.props.moreFlow();
            }} activeOpacity={0.9} style={{flex:1,flexDirection: 'row',justifyContent:'flex-end',alignItems:'center'}}>

                    <Text allowFontScaling={false}
                          style={{color:fontAndColor.COLORA2,fontSize: Pixel.getPixel(fontAndColor.CONTENTFONT24)}}>更多 </Text>
                    <Image style={{width:Pixel.getPixel(14),height:Pixel.getPixel(14),marginRight:Pixel.getPixel(15)}}
                           source={require('../../../../images/mainImage/celljiantou.png')}/>
                </TouchableOpacity>
            </View>
        );*/
        return (
            <View style={{width:width,height:Pixel.getPixel(584),backgroundColor:fontAndColor.COLORA3}}>
                <View style={{width:width,height:Pixel.getPixel(211),backgroundColor:fontAndColor.COLORB0}}>
                    <View style={{width:width,height:Pixel.getPixel(35),backgroundColor:'rgba(105,105,105,0.1)',
                    flexDirection: 'row',alignItems:'center'}}>
                        <Text allowFontScaling={false} style={{marginLeft:Pixel.getPixel(20),color: '#fff',
                     fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}}>
                            账户号码：{( this.props.info.bind_bank_card_type === 1&& this.props.info.account_open_type ===1)? this.props.info.bank_card_no: this.props.info.cz_elec_account}
                        </Text>
                        <View style={{flex:1}}></View>
                        <TouchableOpacity
                            onPress={()=>{  Clipboard.setString(this.props.info.cz_elec_account);this.props.copy('复制成功');}}
                            activeOpacity={0.9}
                            style={{borderColor:'white',borderWidth:1,
                                          marginRight:Pixel.getPixel(10),alignItems:'center',justifyContent:'center',
                                          padding:Pixel.getPixel(5)}}>

                            <Text allowFontScaling={false}
                                  style={{color:fontAndColor.COLORA3,fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28)}}>复制</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={{width:width,height:Pixel.getPixel(175)}}>
                        <View
                            style={{width:width,height:Pixel.getPixel(115),justifyContent:'center',alignItems:'center'}}>
                            <Text allowFontScaling={false} style={{fontSize: Pixel.getFontPixel(14),color:'#fff'}}>账户总额(元)</Text>
                            <Text allowFontScaling={false} style={{fontSize: Pixel.getFontPixel(18),color:'#fff',
                            fontWeight: 'bold',marginTop:Pixel.getPixel(5)}}>
                                {/*{(parseFloat(this.props.info.balance) +*/}
                                {/*parseFloat(this.props.info.frozen_balance)).toString().match(/^\d+(?:\.\d{0,2})?/)}*/}
                                {this.toDecimal(parseFloat(this.props.info.balance) + parseFloat(this.props.info.frozen_balance))}

                            </Text>
                        </View>
                        <View style={{width:width,height:Pixel.getPixel(60),
                        backgroundColor:'rgba(1,54,188,0.1)',flexDirection: 'row'}}>
                            <View style={{flex:1,justifyContent:'center',paddingLeft:Pixel.getPixel(15)}}>
                                <Text allowFontScaling={false} style={{fontSize: Pixel.getFontPixel(14),color:'#fff'}}>
                                    可用余额(元)</Text>
                                <Text allowFontScaling={false} style={{fontSize: Pixel.getFontPixel(18),color:'#fff',
                                marginTop:Pixel.getPixel(2)}}>
                                    {this.toDecimal(parseFloat(this.props.info.balance))}</Text>
                            </View>
                            <View style={{flex:1,justifyContent:'center',paddingLeft:Pixel.getPixel(30)}}>
                                <Text allowFontScaling={false} style={{fontSize: Pixel.getFontPixel(14),color:'#fff'}}>
                                    冻结金额(元)</Text>
                                <Text allowFontScaling={false} style={{fontSize: Pixel.getFontPixel(18),
                                color:'#fff',marginTop:Pixel.getPixel(2)}}>
                                    {this.toDecimal(parseFloat(this.props.info.frozen_balance) +
                                        parseFloat(this.props.info.pending_balance))}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{width:width,height:Pixel.getPixel(374),backgroundColor:fontAndColor.COLORA3}}>
                    {itemList}
                </View>
            </View>

        );
    }


    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor: fontAndColor.COLORA3}}>
                {this.loadView()}
                <NavigationView
                    title="账户管理"
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