/**
 * Created by hanmeng on 2017/5/9.
 */

import React, {Component, PureComponent} from 'react';

import {
    StyleSheet,
    Text,
    View,
    Dimensions
} from 'react-native';

const {width, height} = Dimensions.get('window');
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
import StepNode from "./StepNode";

export default class StepView extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            items: this.props.items
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            items: nextProps.items
        });
    }

    render() {
        //let items = this.props.items;
        let item = [];
        for (let i = 0; i < this.state.items.length; i++) {
            item.push(<StepNode item={this.state.items[i]} key={i + 'child'}/>);
        }
        return (
            <View style={styles.container}>
                {item}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        //width: width,
        justifyContent: 'center',
        flexDirection: 'row'
    },
    node: {
        marginTop: Pixel.getPixel(15)
    }
});