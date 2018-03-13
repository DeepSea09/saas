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
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../../constant/fontAndColor';
import BaseComponent from '../../../component/BaseComponent';
import NavigationView from '../../../component/AllNavigationView';
import NameAndIdScene from "./openAccount/NameAndIdScene";

export  default class ZSAccountTypeSelectScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            renderPlaceholderOnly: 'blank',
            source: ds.cloneWithRows(['1', '2'])
        };
    }

    initFinish = () => {
        this.setState({
            renderPlaceholderOnly: 'success',
        });
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
                    backIconClick={()=>{
                        this.props.callBack()
                        this.backPage()
                    }}
                />
            </View>
        );
    }

    _renderRow = (movie, sectionId, rowId) => {
        if (movie == '1') {
            return (
                <TouchableOpacity
                    onPress={() => {
                        this.toNextPage({ // TODO 替换成浙商页面
                            name: 'NameAndIdScene', component: NameAndIdScene, params: {
                                type :2,
                                callBack:this.props.callBack
                            }
                        })
                    }}
                    activeOpacity={0.8}
                    style={{
                        flex: 1, height: Pixel.getPixel(95),
                        backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center'
                    }}>
                    <View style={{flex: 1, height: Pixel.getPixel(95), justifyContent: 'center', alignItems: 'center'}}>
                        <Image style={{width: Pixel.getPixel(39), height: Pixel.getPixel(39)}}
                               source={require('../../../../images/mainImage/individualaccount.png')}/>
                    </View>
                    <View style={{flex: 3, height: Pixel.getPixel(95), justifyContent: 'center'}}>
                        <Text allowFontScaling={false} style={{
                            color: fontAndColor.COLORA0,
                            fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30)
                        }}>
                            开通个人账户</Text>
                        <Text allowFontScaling={false} style={{
                            color: fontAndColor.COLORA1, fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                            marginTop: Pixel.getPixel(8)
                        }}>
                            开通个人账户将绑定个人银行卡，每个自然人只能开通一个个人账户</Text>
                    </View>
                    <View style={{flex: 1, height: Pixel.getPixel(95), justifyContent: 'center', alignItems: 'center'}}>
                        <Image style={{width: Pixel.getPixel(14), height: Pixel.getPixel(14)}}
                               source={require('../../../../images/mainImage/celljiantou.png')}/>
                    </View>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity
                    onPress={() => {
                        this.toNextPage({  // TODO 替换成浙商页面
                            name: 'NameAndIdScene', component: NameAndIdScene, params: {
                                type :1,
                                callBack: this.props.callBack
                            }
                        })
                    }}
                    activeOpacity={0.8}
                    style={{
                        flex: 1, height: Pixel.getPixel(95),
                        backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center'
                    }}>
                    <View style={{flex: 1, height: Pixel.getPixel(95), justifyContent: 'center', alignItems: 'center'}}>
                        <Image style={{width: Pixel.getPixel(39), height: Pixel.getPixel(39)}}
                               source={require('../../../../images/mainImage/Enterpriseaccount.png')}/>
                    </View>
                    <View style={{flex: 3, height: Pixel.getPixel(95), justifyContent: 'center'}}>
                        <Text allowFontScaling={false} style={{
                            color: fontAndColor.COLORA0,
                            fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30)
                        }}>
                            开通企业账户</Text>
                        <Text allowFontScaling={false} style={{
                            color: fontAndColor.COLORA1, fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                            marginTop: Pixel.getPixel(8)
                        }}>
                            开通企业账户将绑定企业账户，每个自然人可以开通多个企业账户</Text>
                    </View>
                    <View style={{flex: 1, height: Pixel.getPixel(95), justifyContent: 'center', alignItems: 'center'}}>
                        <Image style={{width: Pixel.getPixel(14), height: Pixel.getPixel(14)}}
                               source={require('../../../../images/mainImage/celljiantou.png')}/>
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
            <View style={{
                backgroundColor: fontAndColor.COLORA3, width: width, height: Pixel.getPixel(45),
                flexDirection: 'row', paddingRight: Pixel.getPixel(15), paddingLeft: Pixel.getPixel(23)
            }}>
                <Text allowFontScaling={false}
                      style={{color: fontAndColor.COLORA0, fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24)}}>注意：</Text>
                <Text allowFontScaling={false} style={{
                    color: fontAndColor.COLORA1, fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24)
                }}>请根据您的借款情况选择开户类型，开通以后不能修改</Text>
            </View>
        )
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height, backgroundColor: fontAndColor.COLORA3}}>
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