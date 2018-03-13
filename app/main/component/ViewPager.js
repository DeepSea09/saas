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
import  PixelUtil from '../../utils/PixelUtil'
var Pixel = new PixelUtil();
let alldata = {};
var IMGS = [
    'https://images.unsplash.com/photo-1441260038675-7329ab4cc264?h=1024',
    'https://images.unsplash.com/photo-1441126270775-739547c8680c?h=1024',
    'https://images.unsplash.com/photo-1440964829947-ca3277bd37f8?h=1024',
    'https://images.unsplash.com/photo-1441126270775-739547c8680c?h=1024',
    'https://images.unsplash.com/photo-1440964829947-ca3277bd37f8?h=1024',
    'https://images.unsplash.com/photo-1440964829947-ca3277bd37f8?h=1024'
];
export default class ViewPagers extends Component {
    // 初始化模拟数据
    constructor(props) {
        super(props);
        this.getData();

    }

    getData = () => {
        alldata = this.props.items;
        let imageItems = [];
        if (alldata.banners == null || alldata.banners.length <= 0) {
            imageItems.push({id: '-200', ret_img: '', ret_url: '', title: ''});
        } else {
            imageItems = alldata.banners;
        }
        let dataSource = new ViewPager.DataSource({pageHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: dataSource.cloneWithPages(imageItems),
        };
    }

    componentWillReceiveProps(nextProps) {
        alldata = nextProps.items;
        let imageItems = [];
        if (alldata.banners == null || alldata.banners.length <= 0) {
            imageItems.push({id: '-200', ret_img: '', ret_url: '', title: ''});
        } else {
            imageItems = alldata.banners;
        }
        let dataSource = new ViewPager.DataSource({pageHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: dataSource.cloneWithPages(imageItems),
        };
    }


    render() {
        return (
            <ViewPager
                dataSource={this.state.dataSource}    //数据源（必须）
                renderPage={this._renderPage}         //page页面渲染方法（必须）
                isLoop={alldata.banners.length <= 1?false:true}                        //是否可以循环
                autoPlay={alldata.banners.length <= 1?false:true}                      //是否自动
                initialPage={0}       //指定初始页面的index
                locked={alldata.banners.length <= 1?true:false}                        //为true时禁止滑动翻页
            />
        )
    }

    _renderPage = (data) => {
        if (data.id == '-200') {
            return (
                <Image style={styles.postPosition}
                       source={require('../../../images/mainImage/homebanner.png')}
                />
            );
        } else {
            return (
                <TouchableOpacity onPress={()=>{
                    if(data.ret_url=='finance'){
                        this.props.toNext();
                    }else if(data.ret_url){
                        this.props.callBack(data.ret_url);
                    }
                }} activeOpacity={1} style={{width: width,
        height: Pixel.getPixel(225),}}>
                    <Image style={styles.postPosition}
                           source={{uri: data.ret_img+'?x-oss-process=image/resize,w_'+900+',h_'+555}}
                    />
                </TouchableOpacity>

            );
        }
    }
}
const styles = StyleSheet.create({
    postPosition: {
        width: width,
        height: Pixel.getPixel(225),
        resizeMode: 'stretch'
    },
});