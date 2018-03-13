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

import CarViewPage from '../../viewpager/CarViewPage';
const {width, height} = Dimensions.get('window');
import  PixelUtil from '../../utils/PixelUtil'
import  * as fontAndColor from '../../constant/fontAndColor'
import  StringTransformUtil from  '../../utils/StringTransformUtil';

let stringTransform  = new  StringTransformUtil();
var Pixel = new PixelUtil();
let alldata = {};
export default class CarsViewPager extends Component {
    // 初始化模拟数据
    constructor(props) {
        super(props);
        this.getData();
    }

    getData = () => {
        alldata = this.props.items;
        let imageItems = [];
        if (alldata.list == null || alldata.list.length <= 0) {
            imageItems.push({id: '-200', ret_img: '', ret_url: '', title: ''});
        } else {
            imageItems = alldata.list;
        }
        let dataSource = new CarViewPage.DataSource({pageHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: dataSource.cloneWithPages(imageItems),
        };
    }

    componentWillReceiveProps(nextProps) {
        alldata = nextProps.items;
        let imageItems = [];
        if (alldata.list == null || alldata.list.length <= 0) {
            imageItems.push({id: '-200', ret_img: '', ret_url: '', title: ''});
        } else {
            imageItems = alldata.list;
        }
        let dataSource = new CarViewPage.DataSource({pageHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: dataSource.cloneWithPages(imageItems),
        };
    }

    render() {
        return (
            <View
                style={{width:width,backgroundColor:'#ffffff', height:Pixel.getPixel(140),flexDirection:'column',marginBottom:Pixel.getPixel(10)}}>
                <View
                    style={{width:width-Pixel.getPixel(10),
                    backgroundColor:'#fff', flexDirection:'row',height:Pixel.getPixel(39),alignItems:'center',marginLeft:Pixel.getPixel(10)}}>
                    <Text allowFontScaling={false} style={{fontSize: Pixel.getFontPixel(15),
                        fontWeight: 'bold',flex:1}}>{this.props.title ? this.props.title : '需要title'}
                    </Text>
                    <TouchableOpacity style={{marginRight: Pixel.getPixel(20)}} onPress={()=> {
                        this.props.more? this.props.more():"";
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Text allowFontScaling={false} style={{color: 'gray', fontSize: Pixel.getFontPixel(12)}}>
                                更多
                            </Text>

                            <Image source={require('../../../images/mainImage/more.png')} style={{
                                width: Pixel.getPixel(5),
                                height: Pixel.getPixel(10),
                                marginLeft: Pixel.getPixel(2),
                            }}/>

                        </View>
                    </TouchableOpacity>
                </View>
                <View
                    style={{backgroundColor:fontAndColor.COLORA3,width:width,height:Pixel.getPixel(1),marginLeft:Pixel.getPixel(10)}}></View>
                <CarViewPage
                    dataSource={this.state.dataSource}    //数据源（必须）
                    renderPage={this._renderPage}         //page页面渲染方法（必须）
                    isLoop={false}                        //是否可以循环  {alldata.list.length <= 1?false:true}
                    autoPlay={false}                      //是否自动  alldata.list.length <= 1?false:true
                    initialPage={0}       //指定初始页面的index
                    locked={alldata.list.length <= 1?true:false}                        //为true时禁止滑动翻页
                />
            </View>
        )
    }

    _renderPage = (data) => {
        if (data.id == '-200') {
            return (
                <Image style={{width: width,height: Pixel.getPixel(225), resizeMode: 'stretch'}}
                       source={require('../../../images/mainImage/homebanner.png')}
                />
            );
        } else {
            return (
                <TouchableOpacity onPress={()=>{
                    this.props.toNext?this.props.toNext(data.id):'';
                }} activeOpacity={0.5} style={{width:width,paddingLeft:Pixel.getPixel(10)}}>
                    <View
                        style={{flexDirection:'row',alignItems:'center',height:Pixel.getPixel(100)}}>
                        <Image style={styles.postPosition}
                               source={{uri: data.img+'?x-oss-process=image/resize,w_'+450+',h_'+270}}/>
                        <View
                            style={{height:Pixel.getPixel(80),justifyContent:'space-between',marginLeft:Pixel.getPixel(10)}}>
                            <Text
                                style={{fontSize:Pixel.getFontPixel(14),color:'#000000',marginBottom:Pixel.getPixel(5),marginRight:Pixel.getPixel(130)}} >[{data.city_name}]{data.model_name}</Text>
                            {this.props.type == '6' ?
                                <View />:
                                <Text
                                    style={{fontSize:Pixel.getFontPixel(12),color:'#999999',}}>{stringTransform.dateReversal(data.manufacture + "000")}/{data.mileage}万公里</Text>
                            }
                            <Text style={{fontSize:Pixel.getFontPixel(17),color:'#fa5741'}}>{stringTransform.carMoneyChange(data.dealer_price)}万</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }
    }

}

const styles = StyleSheet.create({
    postPosition: {
        width: Pixel.getPixel(120),
        height: Pixel.getPixel(80),
        backgroundColor: '#ffffff',
        resizeMode: 'stretch'
    },
});