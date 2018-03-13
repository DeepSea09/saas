import React, {Component, PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import * as  fontAndColor from '../../../constant/fontAndColor';
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
const {width, height} = Dimensions.get('window');
export default class PlanItem extends PureComponent {

    render() {
        let movie = this.props.items;
        let movieItems = [];
        let count = 0;
        let typeName = '';
        if (movie.type == '1') {
            typeName='库融';
        } else if (movie.type == '2') {
            typeName='单车';
        } else if (movie.type == '3') {
            typeName='信贷';
        } else if (movie.type == '4') {
            typeName='库融';
        } else if (movie.type == '5') {
            typeName='采购';
        }else if(movie.type == '8'){
            typeName='车抵';
        }
        if (this.props.index === 0) {
            movieItems.push(<View key="top" style={{
                flex: 1,
                height: Pixel.getPixel(44),
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: Pixel.getPixel(15),
                marginRight: Pixel.getPixel(15)
            }}>
                <View style={{
                    flex: 1,
                    height: Pixel.getPixel(44),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                }}>
                    <Text allowFontScaling={false}  style={{
                        fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                        color: fontAndColor.COLORA0
                    }}>本金{this.props.money_str}</Text>
                </View>
                <View style={{
                    flex: 1,
                    height: Pixel.getPixel(44),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end'
                }}>
                    <Text allowFontScaling={false}  style={{
                        fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                        color: fontAndColor.COLORB2
                    }}>利息{this.props.interest_str}</Text>
                </View>
            </View>);
        }
        movieItems.push(<View key="topLine"
                              style={{
                                  flex: 1,
                                  height: Pixel.getPixel(1),
                                  backgroundColor: fontAndColor.COLORA3,
                                  marginLeft: Pixel.getPixel(15),
                                  marginRight: Pixel.getPixel(15)
                              }}></View>);
        movieItems.push(<View key="center" style={{
            flex: 1,
            height: Pixel.getPixel(44),
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: Pixel.getPixel(15),
            marginRight: Pixel.getPixel(15)
        }}>
            <View style={{
                flex: 1,
                height: Pixel.getPixel(44),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start'
            }}>
                <Text allowFontScaling={false}  style={{
                    fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                    color: fontAndColor.COLORA1
                }}>{typeName+movie.payment_number}</Text>
            </View>
            <View style={{
                flex: 1,
                height: Pixel.getPixel(44),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end'
            }}>
                <Text allowFontScaling={false}  style={{
                    fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                    color: fontAndColor.COLORA1
                }}>{movie.plan_type==1?'息':'本'}{movie.repaymentmny_str}</Text>
            </View>
        </View>);
        if (this.props.lastIndex === this.props.index) {
            movieItems.push(<View key="bottomLine"
                                  style={{
                                      flex: 1,
                                      height: Pixel.getPixel(1),
                                      backgroundColor: fontAndColor.COLORA4
                                  }}></View>);
        }


        return (
            <TouchableOpacity activeOpacity={1} style={{width: width}} >
                {movieItems}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    parentStyle: {
        borderWidth: 1,
        borderRadius: 3,
        height: Pixel.getPixel(16),
        width: Pixel.getPixel(34),
        justifyContent: 'center',
        alignItems: 'center'
    },
    childStyle: {
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
    }
});

