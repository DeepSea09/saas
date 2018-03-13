/**
 * Created by hanmeng on 2017/8/2.
 */
import React, {Component, PropTypes} from 'react'
import {
    StyleSheet,
    View,
    Text,
    ListView,
    TouchableOpacity,
    Dimensions,
    Image
} from  'react-native'

const {width, height} = Dimensions.get('window');
import BaseComponent from "../../component/BaseComponent";
import * as fontAndColor from '../../constant/fontAndColor';
import NavigatorView from '../../component/AllNavigationView';
import PixelUtil from '../../utils/PixelUtil'

var Pixel = new PixelUtil();

export default class ShareRankingScene extends BaseComponent {

    /**
     *  初始化
     **/
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            renderPlaceholderOnly: 'blank'
        };
    }

    /**
     *   初始化数据
     **/
    initFinish = () => {
        /*        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
         this.setState({
         dataSource: ds.cloneWithRows(['0', '0', '0', '0', '0']),
         renderPlaceholderOnly: 'success'
         });*/
        this.loadData();
    };

    /**
     *   数据请求
     **/
    loadData = () => {
        let data = this.props.info;
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
            dataSource: ds.cloneWithRows(data),
            renderPlaceholderOnly: 'success'
        });
    };

    /**
     *  render
     **/
    render() {
        if (this.state.renderPlaceholderOnly != 'success') {
            // 加载中....
            return ( <View style={styles.container}>
                {this.loadView()}
                <NavigatorView title='分享排行榜' backIconClick={this.backPage}/>
            </View>);
        } else {
            return (<View style={styles.container}>
                <NavigatorView title='分享排行榜' backIconClick={this.backPage}/>
                <ListView style={{backgroundColor: fontAndColor.COLORA3, marginTop: Pixel.getTitlePixel(80)}}
                          dataSource={this.state.dataSource}
                          removeClippedSubviews={false}
                          renderRow={this._renderRow}
                          enableEmptySections={true}
                          renderSeparator={this._renderSeperator}/>
            </View>);
        }

    }

    /**
     *  listView间隔线
     **/
    _renderSeperator = (sectionID: number, rowID: number, adjacentRowHighlighted: bool) => {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{backgroundColor: fontAndColor.COLORA3, height: Pixel.getPixel(1)}}/>
        )
    }

    /**
     *   listView item 数据
     **/
    _renderRow = (rowData, selectionID, rowID) => {
        return (
            <View style={styles.listItem}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <View
                        style={{
                            alignItems: 'center', justifyContent: 'center',
                            width: Pixel.getPixel(55)
                        }}>
                        {
                            rowID == 0 && <Image source={require('../../../images/message/champion.png')}
                                                 style={{
                                                     //marginLeft: Pixel.getPixel(15),
                                                     height: Pixel.getPixel(25),
                                                     width: Pixel.getPixel(25)
                                                 }}/>
                        }
                        {
                            rowID == 1 && <Image source={require('../../../images/message/second.png')}
                                                 style={{
                                                     //marginLeft: Pixel.getPixel(15),
                                                     height: Pixel.getPixel(25),
                                                     width: Pixel.getPixel(25)
                                                 }}/>
                        }
                        {
                            rowID == 2 && <Image source={require('../../../images/message/third.png')}
                                                 style={{
                                                     //marginLeft: Pixel.getPixel(15),
                                                     height: Pixel.getPixel(25),
                                                     width: Pixel.getPixel(25)
                                                 }}/>
                        }
                        {
                            rowID >= 3 && <Text
                                allowFontScaling={false}
                                style={{
                                    textAlign: 'center',
                                    //marginLeft: Pixel.getPixel(15),
                                    fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                                    color: fontAndColor.COLORA1
                                }}>{parseInt(rowID) + 1}</Text>
                        }
                    </View>
                    <Text
                        allowFontScaling={false}
                        style={{
                            //backgroundColor: fontAndColor.COLORB2,
                            //position: 'absolute',
                            //marginLeft: Pixel.getPixel(55),
                            fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                            color: fontAndColor.COLORA0
                        }}>{rowData.name}</Text>
                    <View style={{flex: 1}}/>
                    <Text
                        allowFontScaling={false}
                        style={{
                            marginRight: Pixel.getPixel(15),
                            fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                            color: rowID == 1 || rowID == 2 || rowID == 0 ? fontAndColor.COLORB2 : fontAndColor.COLORA1
                        }}>分享{rowData.count}次</Text>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Pixel.getPixel(0),   //设置listView 顶在最上面
        backgroundColor: fontAndColor.COLORA3,
    },
    separatedLine: {
        height: 1,
        backgroundColor: fontAndColor.COLORA4
    },
    listItem: {
        alignItems: 'center',
        flexDirection: 'row',
        height: Pixel.getPixel(44),
        backgroundColor: '#ffffff',
    }
});