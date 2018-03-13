/**
 * Created by lhc on 2017/2/15.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    ListView,
    InteractionManager,
    RefreshControl
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../constant/fontAndColor';
let movies = ['1', '2', '3'];
import BaseComponent from '../../component/BaseComponent';
import NavigationView from '../../component/AllNavigationView';
import {request} from '../../utils/RequestUtil';
import * as Urls from '../../constant/appUrls';
import * as fontAndClolr from '../../constant/fontAndColor';
const bg = require('../../../images/financeImages/bottomyouhuijuan.png');
let viewWidth = Pixel.getPixel(0);
let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
import AdjustModal from '../../component/AdjustModal';
export  default class AdjustManageListScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            renderPlaceholderOnly: 'blank',
            source: [],
            isRefreshing: false,
        };
        this.selected = '';
    }

    componentWillUnmount() {
        movies = [];
    }


    initFinish = () => {
        this.getData();
    }

    allRefresh = () => {
        movies = [];
        this.setState({renderPlaceholderOnly: 'loading'});
        this.getData();
    }

    getData = () => {
        let maps = {
            base_id: this.props.base_id
        };
        request(Urls.COUPON_LISTBYUID, 'Post', maps)
            .then((response) => {
                    movies = response.mjson.data;
                    this.setState({
                        source: ds.cloneWithRows(movies),
                        renderPlaceholderOnly: 'success',
                        isRefreshing: false
                    });
                },
                (error) => {
                    if (error.mycode == '-2100045' || error.mycode == '-1'||error.mycode == '1020022') {
                        this.setState({
                            renderPlaceholderOnly: 'null',
                            isRefreshing: false
                        });
                    } else {
                        this.setState({renderPlaceholderOnly: 'error', isRefreshing: false});
                    }
                });
    }

    refreshingData = () => {
        this.setState({isRefreshing: true});
        this.getData();
    };


    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        }
        return (
            <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1, alignItems: 'center'}}>
                <NavigationView
                    title="优惠券"
                    backIconClick={this.backPage}/>
                <ListView
                    removeClippedSubviews={false}
                    style={{marginTop: Pixel.getTitlePixel(74), flex: 1}}
                    dataSource={this.state.source}
                    renderRow={this._renderRow}
                    renderSeparator={this._renderSeparator}
                />
                <AdjustModal ref='cgdModal'
                                  />
            </View>
        );
    }
    _renderRow = (movie, sectionId, rowId) => {
        let money = '';
        if(movie.used_status=='0'){
            money = '';
        }else if(movie.used_status=='1'|| movie.used_status == '4'){
            money = '已使用';
        }else if(movie.used_status=='2'){
            money = '已过期';
        }else{
            money = '已作废';
        }
        let coupon_begindate = movie.coupon_begindate.split(' ')[0].replace('-', '.').replace('-', '.');
        let coupon_enddate = movie.coupon_enddate.split(' ')[0].replace('-', '.').replace('-', '.');
        return (
            <View>
                <Image style={styles.container} source={bg}>
                    <View style={styles.leftContainer}>
                        <Text allowFontScaling={false}  style={styles.leftTitle}>{movie.coupon_name}</Text>
                        <Text allowFontScaling={false}  style={styles.leftBottom}>有效期:{coupon_begindate}-{coupon_enddate}</Text>
                        <Text allowFontScaling={false}  style={styles.leftBottom}>{money}</Text>
                    </View>
                    <View style={styles.rightContainer}>
                        <View style={styles.rightTitleContainer}>
                            <Text allowFontScaling={false}  style={[styles.rightTitle, styles.rightTitleAlign,movie.used_status=='0'?{color: '#05c5c2'}:{color: '#9e9e9e'}]}>¥</Text>
                            <Text allowFontScaling={false}  style={[styles.rightTitle,movie.used_status=='0'?{color: '#05c5c2'}:{color: '#9e9e9e'}]}>{movie.coupon_mny}</Text>
                        </View>
                        <TouchableOpacity style={styles.rightBottom} onPress={() => {
                                this.refs.cgdModal.changeShowType(true,movie.coupon_remark);
                        }}>
                            <View>
                                <Text allowFontScaling={false}  style={styles.rightBottomText}>使用规则</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Image>
            </View>
        )
    }

    _renderSeparator(sectionId, rowId) {
        return (
            <View style={styles.Separator} key={sectionId + rowId}/>
        )
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height, backgroundColor: fontAndColor.COLORA3}}>
                {this.loadView()}
                <NavigationView
                    title="优惠券"
                    backIconClick={this.backPage}
                />
            </View>
        );
    }

}
const styles = StyleSheet.create({
    image: {
        width: 43,
        height: 43,
    },
    Separator: {
        backgroundColor: fontAndColor.COLORA3,
        height: Pixel.getPixel(10),
    },
    margin: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)
    },
    topViewStyle: {
        flex: 1,
        height: Pixel.getPixel(44),
        justifyContent: 'center'
    },
    container: {
        width: width - Pixel.getPixel(30),
        flexDirection: 'row',
        marginLeft: Pixel.getPixel(15),
        marginRight: Pixel.getPixel(15)
    },
    leftContainer: {
        width: Pixel.getPixel(230),
        justifyContent: 'center',
        paddingLeft: Pixel.getPixel(20),
    },
    leftTitle: {
        fontSize: Pixel.getFontPixel(15),
        color: '#000000'
    },
    leftBottom: {
        marginTop: Pixel.getPixel(5),
        fontSize: Pixel.getFontPixel(12),
        color: '#9e9e9e'
    },
    rightContainer: {
        width: Pixel.getPixel(120),
        justifyContent: 'center',
        alignItems: 'center'
    },
    rightTitleContainer: {
        flexDirection: 'row'
    },
    rightTitle: {
        fontSize: Pixel.getFontPixel(26),
        color: '#05c5c2'
    },
    rightTitleAlign: {
        marginRight: Pixel.getPixel(3)
    },
    rightBottom: {
        width: Pixel.getPixel(80),
        height: Pixel.getPixel(30),
        borderColor: '#9e9e9e',
        borderWidth: Pixel.getPixel(1),
        borderRadius: Pixel.getPixel(15),
        justifyContent: 'center',
        alignItems: 'center'
    },
    rightBottomText: {
        fontSize: Pixel.getFontPixel(14),
        color: '#9e9e9e'
    },
    imgContainer: {
        height: Pixel.getPixel(33),
        width: Pixel.getPixel(33),
        position: 'absolute',
        bottom: Pixel.getFontPixel(3),
        right: Pixel.getFontPixel(3),
    },
    listHeader: {
        width: width,
        backgroundColor: fontAndClolr.COLORA3,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    textAllStyle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTextStyle: {
        width: (width - viewWidth) / 4.0,
        textAlign: 'center',
        fontSize: Pixel.getFontPixel(fontAndClolr.CONTENTFONT24),
        color: fontAndClolr.COLORA1
    },
    headerTextsStyle: {
        width: (width - viewWidth) / 4.0,
        color: '#000000',
        textAlign: 'center',
        fontSize: Pixel.getFontPixel(fontAndClolr.LITTLEFONT)
    },
    parentStyle: {
        height: Pixel.getPixel(44),
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        backgroundColor: fontAndColor.COLORB0,
    },
    childStyle: {
        fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
        color: '#ffffff',
    }
})