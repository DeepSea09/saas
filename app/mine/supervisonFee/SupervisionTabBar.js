import React, {Component, PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions
} from 'react-native';
import PixelUtil from '../../utils/PixelUtil';

const Pixel = new PixelUtil();
import * as  fontAndColor from '../../constant/fontAndColor';

let tabName = [];
const {width} = Dimensions.get('window');
export default class SupervisionTabBar extends PureComponent {


    constructor(props) {
        super(props);
        this.tabN = '';
        tabName = this.props.tabName;
        this.tab = this.props.tab
        this.tabNum = tabName.length;
        this.state = {
            noPayNum: this.props.noPayNum,
            payNum: this.props.payNum
        };
    }

    freshPagNum = (data) => {
        this.setState({
            noPayNum: data,
        });
    }
    freshPayNum = (data) => {
        this.setState({
            payNum: data,
        });
    }



    firstFreshNum=(data)=>{
        this.setState({
            payNum: data[0],
            
            noPayNum: data[1],
        });
    }

    goToPages = (i) => {
        this.props.goToPage(i);
    }

    render() {
        let tabChild = [];
        let tabStyle={};
        this.props.tabs.map((tab, i) => {
            if(tab==='no-pay'){
                this.tabN=this.state.noPayNum;
            }else if(tab==='pay'){
                this.tabN=this.state.payNum;
            }
            tabChild.push(<TouchableOpacity key={tab} onPress={() => {
                this.goToPages(i)
            }} style={styles.tab}>
                <View
                    style={[{
                        width: width / (this.tabNum), height: Pixel.getPixel(38),
                        justifyContent: 'center', alignItems: 'center', flexDirection: 'row'
                    }]}>
                    <Text allowFontScaling={false} ref="ttt"
                          style={[this.props.activeTab === i ? {color: fontAndColor.COLORB0} : {color: fontAndColor.COLORA0},
                              {fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}]}>
                        {tabName[i]}
                    </Text>
                    {!this.isEmpty(this.tabN) && tab !== 'total' ?
                        <Text allowFontScaling={false}
                              style={[tab==='no-pay'?{color: fontAndColor.COLORB2}:{color: fontAndColor.COLORA0},
                                  {fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}]}>{" (" + this.tabN + ")"}</Text> :
                        <View/>}
                </View>
                <View style={[{height: Pixel.getPixel(2)},
                    this.props.activeTab === i ? {backgroundColor: fontAndColor.COLORB0} : {backgroundColor: '#ffffff'}]}>
                </View>
            </TouchableOpacity>)
        })
        return <View style={{height: Pixel.getPixel(40)}}>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} contentContainerStyle={[styles.tabs]}>
                {tabChild}
            </ScrollView>
            <Image source={require('../../../images/mainImage/transRight.png')} style={{
                height: Pixel.getPixel(40), width: 41, position: 'absolute', right: 0
            }}/>
        </View>;
    }

    isEmpty = (str) => {
        if (typeof(str) != 'undefined' && str !== null && str !== ''&& str!='0') {
            return false;
        } else {
            return true;
        }
    };
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

