import React, {Component,PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import * as  fontAndColor from '../../constant/fontAndColor';
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
// var tabName = ["单车融资","库存融资","采购融资"];
export default class ChildTabView extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            tabName: this.props.tabName
        }
    }

    render() {
        let that = this;
        let list = that.state.tabName[this.props.i].split('、');
        let widths = 85;
        if(list.length>1&&list[0]=='未签署'){
            widths = 100;
        }
        if(list[0]=='微单合同未确认'){
            widths = 125;
        }
        if(list[0]=='微单合同已确认'){
            widths = 125;
        }
        if(list[0]=='资金方签署中'){
            widths = 125;
        }
        if(list.length>1&&list[0]=='微单合同未确认'){
            widths = 145;
        }
        let count = '';
        if(list.length>1){
            count = list[1];
        }
        return (<TouchableOpacity  onPress={()=>{
            this.props.goToPages(this.props.i)
        }} style={styles.tab}>
            <View
                style={[{width:Pixel.getPixel(widths), height: Pixel.getPixel(38),
                justifyContent: 'center', alignItems: 'center',flexDirection: 'row'}]}>
                <Text allowFontScaling={false}  ref="ttt"
                      style={[this.props.activeTab === this.props.i ? {color: fontAndColor.COLORB0} : {color: fontAndColor.COLORA0},
                        {fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}]}>
                    {list[0]}
                </Text>
                {count==''?<View/>:<Text allowFontScaling={false} 
                        style={[{color: fontAndColor.COLORB2},
                        {fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}]}>{count}</Text>}
            </View>
            <View style={[{height: Pixel.getPixel(2)},
                this.props.activeTab === this.props.i ? {backgroundColor: fontAndColor.COLORB0} : {backgroundColor: '#ffffff'}]}>
            </View>
        </TouchableOpacity>);
    }
}

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    tabs: {
        height: Pixel.getPixel(40),
        flexDirection: 'row',
        borderBottomColor: '#fff',
    },
});

