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
import OldPlanScene from './OldPlanListScene';
import {request} from '../../utils/RequestUtil';
import * as Urls from '../../constant/appUrls';
import StorageUtil from '../../utils/StorageUtil';
import * as StorageKeyNames from "../../constant/storageKeyNames";
import * as fontAndClolr from '../../constant/fontAndColor';
import MyButton from '../../component/MyButton';
const bg = require('../../../images/financeImages/bottomyouhuijuan.png');
const duigou = require('../../../images/financeImages/bottomduigou.png');
let viewWidth = Pixel.getPixel(0);
let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
import AdjustModal from '../../component/AdjustModal';
import  AllLoading from '../../component/AllLoading';
export  default class AdjustListScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            renderPlaceholderOnly: 'blank',
            source: [],
            isRefreshing: false,
        };
        this.selected='';
    }

    componentWillUnmount() {
        movies = ['1', '2', '3'];
    }


    initFinish = () => {
        this.getData();
    }

    allRefresh = () => {
        this.setState({renderPlaceholderOnly: 'loading'});
        this.getData();
    }

    getData = () => {
        StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (datas) => {
            if (datas.code == 1) {
                let data = JSON.parse(datas.result);
                let maps = {
                    api: Urls.REPAYMENT_GET_ADJUST_USE,
                    planid: this.props.items.planid,
                    user_id: data.base_user_id,
                };
                request(Urls.FINANCE, 'Post', maps)
                    .then((response) => {
                            movies = response.mjson.data;
                            this.setState({
                                source: ds.cloneWithRows(movies.list),
                                renderPlaceholderOnly: 'success',
                                isRefreshing: false
                            });
                        },
                        (error) => {
                            if (error.mycode == '-2100045' || error.mycode == '-1') {
                                this.setState({
                                    renderPlaceholderOnly: 'null',
                                    isRefreshing: false
                                });
                            } else {
                                this.setState({renderPlaceholderOnly: 'error', isRefreshing: false});
                            }
                        });
            }
        });
    }

    refreshingData = () => {
        this.setState({isRefreshing: true});
        this.getData();
    };

    _renderHeader = () => {
        return (
            <View style={styles.listHeader}>
                <View style={styles.textAllStyle}>
                    <Text allowFontScaling={false}  style={styles.headerTextStyle}>到期日</Text>
                    <Text allowFontScaling={false}  style={styles.headerTextStyle}>调整前</Text>
                    <Text allowFontScaling={false}  style={styles.headerTextStyle}>抵扣金额</Text>
                    <Text allowFontScaling={false}  style={styles.headerTextStyle}>调整后</Text>
                </View>
                <View style={[styles.textAllStyle, {
                    backgroundColor: '#ffffff',
                    marginTop: Pixel.getPixel(5),
                    marginBottom: Pixel.getPixel(15),
                    paddingTop: Pixel.getPixel(10),
                    paddingBottom: Pixel.getPixel(10)
                }]}>
                    <Text allowFontScaling={false}  style={styles.headerTextsStyle}>{movies.enddate}</Text>
                    <Text allowFontScaling={false}  style={styles.headerTextsStyle}>{movies.repaymentmny}</Text>
                    <Text allowFontScaling={false}  style={styles.headerTextsStyle}>{movies.adjustmoney}</Text>
                    <Text allowFontScaling={false}  style={styles.headerTextsStyle}>{movies.aftermoney}</Text>
                </View>
            </View>
        );
    }

    buttonParams = {
        buttonType: MyButton.TEXTBUTTON,
        parentStyle: styles.parentStyle,
        childStyle: styles.childStyle,
        opacity: 0.9,
        content: '确认',
        mOnPress: () => {
            if(this.selected!=''){
                this.refs.allloading.changeShowType(true,'优惠券金额超过抵扣利息的部分将不予留存！');
            }else{
                this.props.showToast("请选择优惠券");
            }
        }
    }

    sendContent=()=>{
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (datas) => {
            if (datas.code == 1) {
                let data = JSON.parse(datas.result);
                let maps = {
                    api: Urls.REPAYMENT_GET_ADJUST_SAVE,
                    planid: this.props.items.planid,
                    merge_id: data.base_user_id,
                    coupon_number:movies.list[this.selected].coupon_code,
                    coupon_id:movies.list[this.selected].coupon_id,
                    adjustmoney:movies.list[this.selected].coupon_mny,
                    coupon_type:movies.list[this.selected].coupon_rule.coupon_type
                };
                request(Urls.FINANCE, 'Post', maps)
                    .then((response) => {
                            this.props.showModal(false);
                            this.props.showToast('使用成功');
                            this.props.refresh();
                            this.backPage();
                        },
                        (error) => {
                            this.props.showModal(false);
                            if (error.mycode == '-300' || error.mycode == '-500') {
                                this.props.showToast('网络连接失败');
                            } else {
                                this.props.showToast(error.mjson.msg);
                            }
                        });
            }
        });
    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        }
        return (
            <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1, alignItems: 'center'}}>
                <NavigationView
                    title="选择优惠券"
                    backIconClick={this.backPage}/>
                <ListView
                    removeClippedSubviews={false}
                    style={{marginTop: Pixel.getTitlePixel(70), flex: 1,marginBottom: Pixel.getPixel(45)}}
                    dataSource={this.state.source}
                    renderRow={this._renderRow}
                    renderSeparator={this._renderSeparator}
                    renderHeader={this._renderHeader}
                />
                <AdjustModal ref='cgdModal'/>
                <MyButton {...this.buttonParams}/>
                <AllLoading callEsc={()=>{}} ref="allloading" callBack={()=>{
                 this.sendContent();
                }}/>
            </View>
        );
    }

    // 使用优惠劵
    submit = () => {
        StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (datas) => {
            if (datas.code == 1) {
                let data = JSON.parse(datas.result);
                let maps = {
                    api: Urls.REPAYMENT_GET_ADJUST_SAVE,
                    plan_id: this.props.items.planid,
                    merge_id: data.base_user_id,
                    adjustmoney: this.adjustmoney,
                    coupon_id: this.coupon_id,
                    coupon_number: this.coupon_number,
                    key: '',
                };
                request(Urls.FINANCE, 'Post', maps)
                    .then((response) => {

                        },
                        (error) => {
                            if (error.mycode == '-2100045' || error.mycode == '-1') {

                            } else {

                            }
                        });
            }
        });
    }
    _selectCoupon = (rowId) => {
        this.selected = rowId;
        this.adjustmoney = rowId;
        this.setState({
            source: ds.cloneWithRows(movies.list),
        });
    };

    getTimeStr = (selecttime) => {
        let date = new Date(selecttime);
        let seperator1 = ".";
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        return currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    }

    _renderRow = (movie, sectionId, rowId) => {
        let coupon_begindate = movie.coupon_begindate.split(' ')[0].replace('-','.').replace('-','.');
        let coupon_enddate = movie.coupon_enddate.split(' ')[0].replace('-','.').replace('-','.');
        return (
            <TouchableOpacity onPress={() => this._selectCoupon(rowId)}>
                <Image style={styles.container} source={bg}>
                    <View style={styles.leftContainer}>
                        <Text allowFontScaling={false}  style={styles.leftTitle}>{movie.coupon_name}</Text>
                        <Text allowFontScaling={false}  style={styles.leftBottom}>有效期:{coupon_begindate}-{coupon_enddate}</Text>
                    </View>
                    <View style={styles.rightContainer}>
                        <View style={styles.rightTitleContainer}>
                            <Text allowFontScaling={false}  style={[styles.rightTitle, styles.rightTitleAlign]}>¥</Text>
                            <Text allowFontScaling={false}  style={styles.rightTitle}>{movie.coupon_mny}</Text>
                        </View>
                        <TouchableOpacity style={styles.rightBottom} onPress={() => {
                                this.refs.cgdModal.changeShowType(true,movie.coupon_rule.coupon_remark);
                        }}>
                            <View>
                                <Text allowFontScaling={false}  style={styles.rightBottomText}>使用规则</Text>
                            </View>
                        </TouchableOpacity>
                        {this.selected == rowId ? <Image style={styles.imgContainer} source={duigou}/> : null}
                    </View>
                </Image>
            </TouchableOpacity>
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
                    title="选择优惠券"
                    backIconClick={this.backPage}
                />
            </View>
        );
    }

    navigatorParams = {
        name: 'OldPlanScene',
        component: OldPlanScene,
        params: {}
    }

    _navigatorRightView = () => {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => {
                this.toNextPage(this.navigatorParams)
            }}>
                <Text allowFontScaling={false}  style={{
                    color: 'white',
                    fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                    textAlign: 'center',
                    backgroundColor: 'transparent',
                }}>历史还款</Text>
            </TouchableOpacity>
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
        color: '#000000',
        backgroundColor:'#00000000'
    },
    leftBottom: {
        marginTop: Pixel.getPixel(5),
        fontSize: Pixel.getFontPixel(12),
        color: '#9e9e9e',
        backgroundColor:'#00000000'
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
        fontSize: Pixel.getFontPixel(25),
        color: '#05c5c2',
        backgroundColor:'#00000000'
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
        color: '#9e9e9e',
        backgroundColor:'#00000000'
    },
    imgContainer: {
        height: Pixel.getPixel(30),
        width: Pixel.getPixel(30),
        position: 'absolute',
        bottom: 0,
        right: Pixel.getPixel(7),
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