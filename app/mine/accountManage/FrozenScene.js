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
let childItems = [];
import {request} from '../../utils/RequestUtil';
import * as Urls from '../../constant/appUrls';
export  default class FrozenScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        childItems = [];
        childItems.push({title: '信用账户', value: '20万元'});
        childItems.push({title: '交易待结算账户', value: '15万元'});
        childItems.push({title: '交易临时账户', value: '25万元'});
        childItems.push({title: '酬金账户', value: '5万元'});
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            renderPlaceholderOnly: 'blank',
            source: ds.cloneWithRows(childItems)
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
                />
                <NavigationView
                    title="冻结金额"
                    backIconClick={this.backPage}
                />
            </View>
        );
    }

    _renderRow = (movie, sectionId, rowId) => {
        return (
            <View style={{
                    flex:1, height: Pixel.getPixel(44),
                    backgroundColor: '#fff', flexDirection: 'row',alignItems:'center',paddingLeft:Pixel.getPixel(15),
                    paddingRight:Pixel.getPixel(15)
                }}>
                <View style={{flex:1,justifyContent:'center'}}>
                    <Text allowFontScaling={false}  style={{color:'#000',fontSize: Pixel.getFontPixel(14)}}>{movie.title}</Text>
                </View>
                <View style={{flex:1,justifyContent:'center',alignItems: 'flex-end'}}>
                    <Text allowFontScaling={false}  style={{color:fontAndColor.COLORA1,fontSize: Pixel.getFontPixel(14)}}>{movie.value}</Text>
                </View>
            </View>
        )

    }

    _renderSeparator(sectionId, rowId) {

        return (
            <View style={styles.Separator} key={sectionId + rowId}>
                <View style={{flex:1, backgroundColor:fontAndColor.COLORA3}}>

                </View>
            </View>
        )
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor: fontAndColor.COLORA3}}>
                {this.loadView()}
                <NavigationView
                    title="冻结金额"
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
        backgroundColor: '#fff',
        height: Pixel.getPixel(1),
        paddingLeft: Pixel.getPixel(15),
        paddingRight: Pixel.getPixel(15)


    },
    margin: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)

    },
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'}
})