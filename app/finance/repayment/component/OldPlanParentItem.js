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
    ListView
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../../constant/fontAndColor';
import  PlanChildItem from './OldPlanChildItem';
export  default class PlanParentItem extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            show: 'row'
        };
    }

    render() {
        let movie = this.props.items;
        let movieItems = [];
        if (this.state.show !== 'row') {
            for (let i = 0; i < movie.list.length; i++) {
                movieItems.push(<PlanChildItem key={i} items={movie.list[i]} lastIndex={movie.list.length-1} index={i} money_str={movie.money_str}
                                               interest_str={movie.interest_str}/>)
            }
        }
        let dateStrs = movie.date.split('/');
        let dateStr = dateStrs[0] + '月' + dateStrs[1] + '日';
        return (
            <View style={{width: width, backgroundColor: '#ffffff'}}>
                <TouchableOpacity activeOpacity={0.8} style={[{
                    flex: 1,
                    height: Pixel.getPixel(44),
                    backgroundColor: '#ffffff',
                    flexDirection: 'row',
                    alignItems: 'center'
                }, styles.margin]} onPress={() => {
                    if (movie.list.length > 0) {
                        if (this.state.show === 'row') {
                            this.setState({
                                show: 'column'
                            });
                        } else {
                            this.setState({
                                show: 'row'
                            });
                        }
                    }
                }}>
                    <View style={[styles.topViewStyle, {alignItems: 'flex-start'}]}>
                        <Text allowFontScaling={false}  style={{
                            fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                            color: fontAndColor.COLORA0
                        }}>{dateStr}</Text>
                    </View>
                    <View style={[styles.topViewStyle, {
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center'
                    }]}>
                        <Text allowFontScaling={false}  style={{
                            fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                            color: fontAndColor.COLORA2
                        }}>{this.state.show === 'row' ? movie.list.length + '笔' : '总额' + movie.sum_str}</Text>
                        <Image style={{
                            width: Pixel.getPixel(14),
                            height: Pixel.getPixel(7),
                            marginLeft: Pixel.getPixel(12)
                        }}
                               source={this.state.show === 'row' ?
                                   require('../../../../images/financeImages/bottomPlan.png')
                                   : require('../../../../images/financeImages/topPlan.png')}/>
                    </View>
                </TouchableOpacity>
                <View style={{flex: 1, height: Pixel.getPixel(1), backgroundColor: fontAndColor.COLORA4}}></View>
                {
                    movieItems
                }
            </View>
        );
    }

}
const styles = StyleSheet.create({
    margin: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)

    },
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'}
})