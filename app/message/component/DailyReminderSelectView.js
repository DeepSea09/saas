/**
 * Created by hanmeng on 2017/7/31.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Modal
} from 'react-native';

import * as fontAndColor from '../../constant/fontAndColor';
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();

export class DailyReminderSelectView extends Component {

    /**
     *
     **/
    constructor(props) {
        super(props);
        this.checkedSource = this.props.checkedSource;
        this.checkTimeFrameClick = this.props.checkTimeFrameClick;
        this.hideClick = this.props.hideClick;
        //this.checkedTypeString = this.props.checkedTypeString;
        this.state = {
            isHide: false,
            checkedTypeString: this.props.checkedTypeString
        };
    }

/*    componentWillReceiveProps(nextProps) {
        //console.log('11111111111111111');
        this.checkedSource = nextProps.checkedSource;
        this.checkTimeFrameClick = nextProps.checkTimeFrameClick;
        this.hideClick = nextProps.hideClick;
        this.checkedTypeString = nextProps.checkedTypeString;
        this.state = {
            isHide: true,
        };
    }*/

    /**
     *
     **/
    changeClick = (isHide, name) => {
        this.setState({
            isHide: isHide,
            checkedTypeString: name
        });
    };

    /**
     *
     * @returns {XML}
     **/
    render() {
        //const {checkedSource, checkTimeFrameClick, hideClick} = this.props;
        if (this.state.isHide) {
            return (
                <View style={styles.selectView}>
                    <View style={{backgroundColor: 'white'}}>
                        <ScrollView>
                            {
                                this.checkedSource.map((data, index) => {
                                    return (
                                        <TouchableOpacity key={index} onPress={() => {
                                            this.checkTimeFrameClick(data, index);
                                        }}>
                                            <View style={styles.checkedCell}>
                                                {
                                                    <Text allowFontScaling={false}
                                                          style={[styles.checkedCellText,
                                                              data.name == this.state.checkedTypeString && {color: fontAndColor.COLORB0}]}>{data.name}
                                                    </Text>
                                                }

                                            </View>
                                        </TouchableOpacity>

                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                    <TouchableOpacity style={{flex: 1}} onPress={() => {
                        //this.hideClick();
                        this.setState({
                            isHide: false
                        });
                    }}/>
                </View>
            )
        } else {
            return null;
        }
    }
}

const styles = StyleSheet.create({
    selectView: {
        top: Pixel.getTitlePixel(65),
        backgroundColor: 'rgba(0, 0, 0,0.3)',
        left: 0,
        right: 0,
        position: 'absolute',
        bottom: 0
    },
    checkedCell: {
        backgroundColor: 'white',
        height: Pixel.getPixel(44),
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: fontAndColor.COLORA3
    },
    checkedCellText: {
        fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT),
        textAlign: 'center',
        color: fontAndColor.COLORA0
    }
});