/**
 * Created by Administrator on 2017/5/19.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import * as FontAndColor from '../../../constant/fontAndColor';
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
const {width} = Dimensions.get('window');

export default class TagSelectView extends Component {

    constructor(props) {
        super(props);

        this.viewItems = this.props.cellData;

        this.state = {
            cellData: this.viewItems
        }

    }

    refreshData = (viewItems)=>{

        this.setState({
            cellData:viewItems
        });
    };

    render() {

        return (
            <View style={styles.container}>
                {this.props.onTagClick ? this.state.cellData.map((dt, index) => {
                    return (
                        <TouchableOpacity key={index}  style={[styles.tagStyle, dt.check ? styles.tag_select_wrap : styles.tag_default_wrap, this.props.buttonWidth && {width: this.props.buttonWidth},
                            this.props.paddingHorizontal && {paddingHorizontal: this.props.paddingHorizontal}]} activeOpacity={1} onPress={() => {
                        this.props.onTagClick(dt, index);
                    }}>
                            <View key={index}
                                  style={{flex:1, justifyContent:'center',alignItems:'center'}}>
                                <Text
                                    style={[dt.check ? styles.tag_select_text : styles.tag_default_text, this.props.textSize && {fontSize: this.props.textSize}]}>{dt.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }):
                    this.state.cellData.map((dt, index) => {
                        return (
                            <View key={index} style={[styles.tagStyle,dt.check ? styles.tag_select_wrap : styles.tag_default_wrap, this.props.buttonWidth && {width: this.props.buttonWidth},
                                this.props.paddingHorizontal && {paddingHorizontal: this.props.paddingHorizontal}]}>
                                <Text
                                    style={[dt.check ? styles.tag_select_text : styles.tag_default_text, this.props.textSize && {fontSize: this.props.textSize}]}>{dt.name}</Text>
                            </View>
                        )
                    })
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    tagStyle:{
        height: Pixel.getPixel(32),
        backgroundColor: 'transparent',
        marginLeft: Pixel.getPixel(10),
        borderRadius: Pixel.getPixel(2),
        borderWidth: Pixel.getPixel(1),
        borderColor: FontAndColor.COLORA4,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tag_default_wrap: {
        borderColor: FontAndColor.COLORA4,
    },
    tag_select_wrap: {
        borderColor: FontAndColor.COLORB0,
    },
    tag_default_text: {
        fontSize: Pixel.getFontPixel(16),
        color: FontAndColor.COLORA1
    },
    tag_select_text: {
        fontSize: Pixel.getFontPixel(16),
        color: FontAndColor.COLORB0
    }
});