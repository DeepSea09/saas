import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Easing,
    Dimensions,
    Image,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native';


import ViewPager from 'react-native-viewpager';
const {width, height} = Dimensions.get('window');
import  PixelUtil from '../../../utils/PixelUtil'
var Pixel = new PixelUtil();
let alldata = {};
export default class ViewPagers extends Component {
    // 初始化模拟数据
    constructor(props) {
        super(props);
        let dataSource = new ViewPager.DataSource({pageHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: dataSource.cloneWithPages([{id: 1, url: require('../../../../images/banner1.png')},
                {id: 2, url: require('../../../../images/banner2.png')}]),
        };
    }

    render() {
        return (
            <ViewPager
                dataSource={this.state.dataSource}    //数据源（必须）
                renderPage={this._renderPage}         //page页面渲染方法（必须）
                isLoop={true}                        //是否可以循环
                autoPlay={true}                      //是否自动
                initialPage={0}       //指定初始页面的index
                locked={false}                        //为true时禁止滑动翻页
            />
        )
    }

    _renderPage = (data) => {
        return (
            <TouchableOpacity onPress={()=>{
                    if(data.id==2){
                        this.props.clickBanner();
                    }
                }} activeOpacity={1} style={{width: width,
                    height: Pixel.getPixel(225),}}>
                <Image style={styles.postPosition}
                       source={data.url}
                />
            </TouchableOpacity>

        );
    }
}
const styles = StyleSheet.create({
    postPosition: {
        width: width,
        height: Pixel.getPixel(225),
        resizeMode: 'stretch'
    },
});