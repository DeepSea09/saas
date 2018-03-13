/**
 * Created by lhc on 2017/2/15.
 */
import React, {Component, PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    ListView,
    NativeModules,
    Animated
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../../constant/fontAndColor';
import ViewPager from './ViewPager';
export  default class PurchasePickerItem extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(1),
            lineInfo:'用户张**已下运单，路线河北省石家庄市——山西省大同市'
        };
    }

    componentDidMount() {
        this._startLineAnimate();
    }

    componentWillUnmount(){
        this.timer && clearInterval(this.timer);
    }

    render() {
        return (
            <View style={{width:width,height:Pixel.getPixel(256)}}>
                <ViewPager clickBanner={()=>{
                    this.props.clickBanner();
                }}/>
                <View
                    style={{width:width,height:Pixel.getPixel(31),backgroundColor:'#FFF8EA',
                        paddingLeft:Pixel.getPixel(15), paddingRight:Pixel.getPixel(15), overflow: 'hidden'
                    }}
                >
                    <Animated.View
                        style={{width:width,height:Pixel.getPixel(31),
                            alignItems:'center',flexDirection: 'row',
                            transform:[{
                                translateY: this.state.fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [31, 0]
                                }),
                            }]}}
                    >
                        <Image style={{width:Pixel.getPixel(12),height:Pixel.getPixel(11),
                            marginRight:Pixel.getPixel(6)}}
                               source={require('../../../../images/laba.png')}></Image>
                        <Text numberOfLines={1} style={{fontSize: Pixel.getFontPixel(12),color: '#D0874D',
                            marginRight:Pixel.getPixel(12),}}>
                            {this.state.lineInfo}
                        </Text>
                    </Animated.View>

                </View>
            </View>
        );
    }

    _startLineAnimate = ()=>{
        let lines = [
            {
                name:'赵**',
                start:'佛山',
                end:'中山'
            },
            {
                name:'李**',
                start:'南昌',
                end:'海宁'
            },
            {
                name:'周**',
                start:'天津',
                end:'临沂'
            },
            {
                name:'周**',
                start:'天津',
                end:'临沂'
            },
            {
                name:'许**',
                start:'天津',
                end:'烟台'
            },
            {
                name:'江**',
                start:'武汉',
                end:'长春'
            },
            {
                name:'郑**',
                start:'北京',
                end:'西安'
            },
            {
                name:'王**',
                start:'杭州',
                end:'扬州'
            },
            {
                name:'颜**',
                start:'广州',
                end:'虎门'
            },
            {
                name:'郭**',
                start:'增城',
                end:'中山'
            },
            {
                name:'梅**',
                start:'深圳',
                end:'增城'
            },
            {
                name:'陈**',
                start:'深圳',
                end:'中山'
            },
            {
                name:'褚**',
                start:'上海',
                end:'贵阳'
            },
            {
                name:'卫**',
                start:'天津',
                end:'南宁'
            },
            {
                name:'蒋**',
                start:'重庆',
                end:'昆明'
            },
            {
                name:'沈**',
                start:'北京',
                end:'南宁'
            },
            {
                name:'韩**',
                start:'东营',
                end:'南宁'
            },
            {
                name:'杨**',
                start:'卧龙',
                end:'柳州'
            },
            {
                name:'朱**',
                start:'天津',
                end:'昆明'
            },
            {
                name:'秦**',
                start:'钦州港',
                end:'天津'
            },
            {
                name:'尤**',
                start:'朔州',
                end:'昆明'
            },
            {
                name:'冯**',
                start:'鲅鱼圈',
                end:'天津'
            },
            {
                name:'吴**',
                start:'北京',
                end:'武汉'
            },
            {
                name:'童**',
                start:'北京',
                end:'公主岭'
            },
            {
                name:'盛**',
                start:'北京',
                end:'惠州'
            },
            {
                name:'林**',
                start:'武汉',
                end:'广州'
            },
            {
                name:'刁**',
                start:'上海',
                end:'广州'
            },
            {
                name:'钟**',
                start:'上海',
                end:'深圳'
            },
            {
                name:'徐**',
                start:'天津',
                end:'长沙'
            },
            {
                name:'孙**',
                start:'上海',
                end:'大连'
            },
            {
                name:'钱**',
                start:'无锡',
                end:'广州'
            },

        ];
        let i = 0;
        this.timer = setInterval(
            () => {
                Animated.timing(
                    this.state.fadeAnim,
                    {toValue: 2}
                ).start(()=>{
                    this.setState({
                        fadeAnim: new Animated.Value(0),
                        lineInfo:'用户'+lines[i].name+'已下运单，路线'+lines[i].start+'——'+lines[i].end
                    },()=>{
                        Animated.timing(
                            this.state.fadeAnim,
                            {toValue: 1}
                        ).start();
                        if(++i >= lines.length){
                            i = 0
                        }
                    });
                    }
                );

            },
            3000
        );
    };
}
