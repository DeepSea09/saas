import React, {Component,PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Image
} from 'react-native';
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import ChildTabView from './ConstractChildTabView';
export default class RepaymenyTabBar extends PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            tabName: this.props.tabName
        }
    }

    goToPages = (i) => {
        this.props.goToPage(i);
    }

    render() {
        let tabChild = [];
        this.props.tabs.map((tab, i) => {
            tabChild.push(<ChildTabView key={tab} goToPages={(i) => {
                this.goToPages(i);
            }} tab={tab} i={i} tabName={this.props.tabName} activeTab={this.props.activeTab}/>);
        })
        return <View style={{height:Pixel.getPixel(40)}}>
            <ScrollView  showsHorizontalScrollIndicator={false} horizontal={true} contentContainerStyle={[styles.tabs]}>
                {tabChild}
            </ScrollView>
            <Image source={require('../../../images/mainImage/transRight.png')} style={{
           height: Pixel.getPixel(40),width:41,position: 'absolute',right:0}}/>
            </View>;
    }
}

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    tabs: {
        height: Pixel.getPixel(40),
        borderBottomColor: '#fff',
    },
});

