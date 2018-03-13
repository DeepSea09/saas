import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,

} from 'react-native';
import PixelUtil            from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAnColor from '../../constant/fontAndColor'

class LoadMoreFooter extends Component {
    constructor(props) {
        super(props);
    }
    render() {

        const {isLoadAll,isCarFoot,footAllClick} = this.props;
        return (
            <TouchableOpacity  onPress={()=>{

                if(isCarFoot && isLoadAll)
                {
                    footAllClick();
                }
            }} activeOpacity={1}>
            <View  style={styles.footer}>
                <Text allowFontScaling={false}  style={styles.footerTitle}>{isLoadAll ? (isCarFoot?'查看全部车源>' :'已加载全部'): '正在加载更多……'}</Text>
            </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    footer: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height:Pixel.getPixel(60) ,
    },
    footerTitle: {
        marginLeft: Pixel.getPixel(10),
        fontSize: Pixel.getFontPixel(fontAnColor.LITTLEFONT28),
        color: fontAnColor.COLORA2,
    }
})

export default LoadMoreFooter