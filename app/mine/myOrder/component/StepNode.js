/**
 * Created by hanmeng on 2017/5/15.
 */
import React, {Component, PureComponent} from 'react';

import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions
} from 'react-native';

const {width, height} = Dimensions.get('window');
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../../constant/fontAndColor';

export default class StepNode extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            item: this.props.item
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            item: nextProps.item
        });
    }

    render() {
        let nodeState = this.state.item.nodeState;
        let isLast = this.state.item.isLast;
        let isFirst = this.state.item.isFirst;
        let title = this.state.item.title;
        if (nodeState === 0) {
            return (
                <View style={styles.container}>
                    <View style={styles.container1}>
                        {isFirst ? <View style={styles.transparentLineLeft}/> : <View style={styles.greenLineLeft}/>}
                        <View style={{
                            width: Pixel.getPixel(10),
                            height: Pixel.getPixel(10),
                            backgroundColor: '#05C5C2',
                            borderRadius: 10,
                        }}/>
                        {isLast ? <View style={styles.transparentLineRight}/> : <View style={styles.greenLineRight}/>}
                    </View>
                    <Text allowFontScaling={false}  style={{
                        marginTop: Pixel.getPixel(15),
                        color: fontAndColor.COLORA1,
                        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24)
                    }}>{title}</Text>
                </View>
            )
        } else if (nodeState === 1) {
            return (
                <View style={styles.container}>
                    <View style={styles.container1}>
                        {isFirst ? <View style={styles.transparentLineLeft}/> : <View style={styles.greenLineLeft}/>}
                        <Image
                            style={{}}
                            source={require('../../../../images/mainImage/current_node.png')}/>
                        {isLast ? <View style={styles.transparentLineRight}/> : <View style={styles.grayLineRight}/>}
                    </View>
                    <Text allowFontScaling={false}  style={{
                        marginTop: Pixel.getPixel(15),
                        color: fontAndColor.COLORA1,
                        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24)
                    }}>{title}</Text>
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <View style={styles.container1}>
                        {isFirst ? <View style={styles.transparentLineLeft}/> : <View style={styles.grayLineLeft}/>}
                        <View style={{
                            width: Pixel.getPixel(10),
                            height: Pixel.getPixel(10),
                            backgroundColor: fontAndColor.COLORA4,
                            borderRadius: 10,
                        }}/>
                        {isLast ? <View style={styles.transparentLineRight}/> : <View style={styles.grayLineRight}/>}
                    </View>
                    <Text allowFontScaling={false}  style={{
                        marginTop: Pixel.getPixel(15),
                        color: fontAndColor.COLORA1,
                        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24)
                    }}>{title}</Text>
                </View>
            )
        }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
        //justifyContent: 'center',
        //flexDirection: 'row'
    },
    container1: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    greenLineRight: {
        marginLeft: Pixel.getPixel(2),
        height: Pixel.getPixel(2),
        flex: 1,
        backgroundColor: '#05C5C2'
    },
    greenLineLeft: {
        marginRight: Pixel.getPixel(2),
        height: Pixel.getPixel(2),
        flex: 1,
        backgroundColor: '#05C5C2'
    },
    grayLineRight: {
        marginLeft: Pixel.getPixel(2),
        height: Pixel.getPixel(2),
        flex: 1,
        backgroundColor: fontAndColor.COLORA4
    },
    grayLineLeft: {
        marginRight: Pixel.getPixel(2),
        height: Pixel.getPixel(2),
        flex: 1,
        backgroundColor: fontAndColor.COLORA4
    },
    transparentLineRight: {
        marginLeft: Pixel.getPixel(2),
        height: Pixel.getPixel(2),
        flex: 1,
        backgroundColor: 'transparent'
    },
    transparentLineLeft: {
        marginRight: Pixel.getPixel(2),
        height: Pixel.getPixel(2),
        flex: 1,
        backgroundColor: 'transparent'
    }
});