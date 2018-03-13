import React, {Component} from "react";
import {
    AppRegistry,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    InteractionManager,
    ListView,
    PixelRatio,
    TextInput,
    Image,
    NativeModules,
    TouchableHighlight
} from "react-native";
import BaseComponent from "../../component/BaseComponent";
import * as FontAndColor from "../../constant/fontAndColor";
import PixelUtil from "../../utils/PixelUtil";
import {request} from "../../utils/RequestUtil";
import * as apis from "../../constant/appUrls";
import NavigationView from "../../component/AllNavigationView"
let results = [];
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Pixel = new PixelUtil();
var Platform = require('Platform');
let childItems = [];
let DengJiRen = [];
export default class DDCarInfoCheckScene extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            renderPlaceholderOnly: 'blank',
            chexing: "奥迪",
            chejia_number: "1234567890",
            dengjiren: "张三",
            sign_type: "图片上传",
            source: {},
        };
        this.xb = [];
    }

    componentWillUnmount() {
        results = [];
        childItems = [];
        DengJiRen = [];
    }

    /**
     * from @zhaojian
     *
     * 页面初始化
     **/
    initFinish = () => {
        this.getCarInfo();
    }

    /**
     * 获取车辆信息(车型，车架号
     * getCarInfo
     **/
    getCarInfo = () => {
        console.log(this.props.carData.info_id);
        let maps = {
            api: apis.AUTODETAIL,
            info_id: this.props.carData.info_id,
            platform_order_number: this.props.platform_order_number,
        }
        request(apis.FINANCE, 'Post', maps)
            .then((response) => {
                let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                this.state.chejia_number = response.mjson.data.detail.frame_number;
                this.state.chexing = response.mjson.data.detail.model_name;
                this.info_id = response.mjson.data.detail.info_id;
                this.base_id = response.mjson.data.detail.base_id;
                this.dengjiren = response.mjson.data.detail.register_user_name;
                this.register_user_id = response.mjson.data.detail.register_user_id;
                this.props.carData.file_list = response.mjson.data.detail.file_list.vehicle_ownership_description;

                this.setState({
                    source: ds.cloneWithRows(this.props.carData.file_list),
                    renderPlaceholderOnly: 'success'
                });
            }, (error) => {
                this.setState({
                    renderPlaceholderOnly: 'error'
                });
            });
    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        }
        return (
            <View style={styles.container}>
                <View style={{
                    width: width,
                    flexDirection: 'column',
                    flex: 1,
                    marginTop: Pixel.getTitlePixel(69)
                }}>
                    {this._renderSectionHeader()}
                    {
                        this.state.renderPlaceholderOnly == "success" ?
                            <ListView
                                dataSource={this.state.source}
                                renderRow={this._renderRow}
                                renderSeparator={this._renderSeparator}/>
                            : null
                    }

                </View>

                <NavigationView
                    title="车辆信息"
                    backIconClick={this.backPage}/>

            </View>
        )
    }

    /**
     * from @zhaojian
     *
     * 绘制列表每行
     **/
    _renderRow = (movie, sectionId, rowId) => {
        return (
            <Image source={{uri: movie.url}} style={styles.thumb}/>
        )
    }

    _renderSeparator(sectionId, rowId) {
        return (
            <View style={styles.Separator} key={sectionId + rowId}/>
        )
    }

    _renderSectionHeader = (sectionData, sectionID) => {

        return (
            <View style={styles.headerALL}>
                <View style={styles.itemBackground}>
                    <Text allowFontScaling={false}  style={styles.leftFont}>车型</Text>
                    <View style={styles.fillSpace}/>
                    <Text allowFontScaling={false}  style={styles.headerCellRight}>{this.state.chexing}</Text>
                </View>

                <View style={{backgroundColor: FontAndColor.COLORA4, width: width, height: Pixel.getPixel(1)}}/>

                <View style={styles.itemBackground}>
                    <Text allowFontScaling={false}  style={styles.leftFont}>车架号</Text>
                    <View style={styles.fillSpace}/>
                    <Text allowFontScaling={false}  style={styles.headerCellRight}>{this.state.chejia_number}</Text>
                </View>

                <View style={{backgroundColor: FontAndColor.COLORA4, width: width, height: Pixel.getPixel(1)}}/>

                <View style={styles.itemBackground}>
                    <Text style={styles.leftFont}>
                        <Text style={{color: FontAndColor.COLORB2}}>*</Text>登记人</Text>
                    <View style={styles.fillSpace}/>
                    <Text style={styles.headerCellRight}>{this.dengjiren}</Text>
                </View>

                <View style={{backgroundColor: FontAndColor.COLORA4, width: width, height: Pixel.getPixel(1)}}/>

                <View style={styles.itemBackground}>
                    <Text allowFontScaling={false}  style={styles.leftFont}>
                        <Text allowFontScaling={false}  style={{color: FontAndColor.COLORB2}}>*</Text>权属声明签署方式</Text>
                    <View style={styles.fillSpace}/>
                    <Text allowFontScaling={false}  style={styles.headerCellRight}>{this.state.sign_type}</Text>
                </View>

                <View style={{backgroundColor: FontAndColor.COLORA3, width: width, height: Pixel.getPixel(10)}}/>

            </View>
        )
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height, backgroundColor: FontAndColor.COLORA3}}>
                {this.loadView()}
                <NavigationView
                    title="车辆信息"
                    backIconClick={this.backPage}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerALL: {
        width: width,
    },
    headerCell: {},
    headerCellLeft: {},
    headerCellRight: {},
    fillSpace: {
        flex: 1
    },
    itemBackground: {
        flexDirection: 'row',
        height: Pixel.getPixel(44),
        backgroundColor: 'white',
        paddingHorizontal: Pixel.getPixel(15),
        alignItems: 'center'
    },
    leftFont: {
        fontSize: Pixel.getFontPixel(14),
        color: 'black'
    },
    container: {
        flex: 1,
        marginTop: Pixel.getPixel(0),   //设置listView 顶在最上面
        backgroundColor: FontAndColor.COLORA3,
        alignItems: 'center'
    },
    buttonTextStyle: {
        color: FontAndColor.COLORA3,
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT)
    },

    buttonStyle: {
        borderColor: FontAndColor.COLORB0,
        borderWidth: 1,
        width: Pixel.getPixel(100),
        height: Pixel.getPixel(32),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Pixel.getPixel(12),
        marginBottom: Pixel.getPixel(12),
    },

    buttonSelectStyle: {
        borderColor: FontAndColor.COLORA2,
        borderWidth: 1,
        width: Pixel.getPixel(100),
        height: Pixel.getPixel(32),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Pixel.getPixel(12),
        marginBottom: Pixel.getPixel(12),
    },
    buttonTextSelectStyle: {
        fontSize: Pixel.getFontPixel(18),
        color: FontAndColor.COLORA2,
    },

    loginBtnEnStyle: {
        height: Pixel.getPixel(44),
        width: width - Pixel.getPixel(30),
        backgroundColor: "#69DCDA",
        marginTop: Pixel.getPixel(20),
        marginBottom: Pixel.getPixel(15),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Pixel.getPixel(4),
    },

    boundStateStyle: {
        flex: 1,
        color: FontAndColor.COLORB2,
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT),
        textAlign: 'right'
    },
    boundSuccessStyle: {
        flex: 1,
        color: FontAndColor.COLORB0,
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT),
        textAlign: 'right'
    },
    Separator: {
        backgroundColor: FontAndColor.COLORA3,
        height: Pixel.getPixel(1),
    },
    buttonStyleFill: {
        height: Pixel.getPixel(40),
        backgroundColor: FontAndColor.COLORB0,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        width: Pixel.getPixel(width) - Pixel.getPixel(20),
    },
    buttonsFlex: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    loginBtnStyle: {
        height: Pixel.getPixel(44),
        width: Pixel.getPixel(width) - Pixel.getPixel(30),
        backgroundColor: FontAndColor.COLORB0,
        marginTop: Pixel.getPixel(30),
        marginBottom: Pixel.getPixel(15),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Pixel.getPixel(4),
    },
    loginButtonTextStyle: {
        color: FontAndColor.COLORA3,
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT)
    },
    thumb: {
        backgroundColor: 'white',
        height: Pixel.getPixel(250),
        width: width - Pixel.getPixel(10),
        marginLeft: Pixel.getPixel(5),
        marginRight: Pixel.getPixel(5),
        resizeMode: 'stretch',
        paddingTop: Pixel.getPixel(2)
    },
})