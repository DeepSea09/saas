import React, {Component} from "react";
import {
    AppRegistry,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    InteractionManager,
    ScrollView,
    Image,
    ListView,
    NativeModules
} from "react-native";
import BaseComponent from "../component/BaseComponent";
import NavigationBar from "../component/NavigationBar";
import * as FontAndColor from "../constant/fontAndColor";
import PixelUtil from "../utils/PixelUtil";
import {request} from "../utils/RequestUtil";
import * as AppUrls from "../constant/appUrls";
import MyButton from "../component/MyButton";

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Pixel = new PixelUtil();
var Platform = require('Platform');
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var imgSrc: '';
var imgSid: '';

var itemWidth = width;
import ContractInfoScene from './ContractInfoScene';
import ReceiptInfoScene  from '../finance/page/ReceiptInfoScene';
let imeis = '';
export default class RecognizedGains extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            renderPlaceholderOnly: 'blank',
            source: [],
            agreement:[]
        };
        imeis = '';
        if (Platform.OS === 'android') {
            NativeModules.VinScan.getIMEI((imei) => {
                imeis = imei;
            });
        }
    }

    initFinish = () => {
        this.getWZInfo();
    }

    render() {
        if (this.state.renderPlaceholderOnly!='success') {
            return (
                <View style={{flex: 1, backgroundColor: FontAndColor.COLORA3}}>

                    <NavigationBar
                        leftImageShow={false}
                        leftTextShow={true}
                        leftText={""}
                        centerText={"确认收据"}
                        rightText={""}
                    />
                    {this.loadView()}
                </View>
            );
        }
        return (
            <View style={styles.containerStyle}>
                <NavigationBar
                    leftImageShow={true}
                    leftTextShow={false}
                    centerText={"确认收据"}
                    rightText={"  "}
                    leftImageCallBack={this.backPage}
                />
                <ListView
                    style={{marginTop:Pixel.getPixel(15)}}
                    dataSource={this.state.source}
                    renderRow={this._renderRow}
                    removeClippedSubviews={false}
                    renderSeparator={this._renderSeparator}
                    renderFooter={this.props.isShow?this._renderFooter:()=>{return <View/>}}
                />
            </View>
        );
    }

    /**
     * from @zhaojian
     *
     * 列表底部组件
     **/
    _renderFooter = () => {
        let childitems = [];
        for (let i = 0; i < this.state.agreement.length; i++) {
            childitems.push(<Text allowFontScaling={false}  onPress={()=>{
                this.toNextPage({name:'ContractInfoScene',component:ContractInfoScene,params:
                {title:this.state.agreement[i].name,
                webUrl:this.state.agreement[i].url}});
            }} key={i+'a'} style={{color:FontAndColor.COLORA2,fontSize: Pixel.getFontPixel(12)}}>
                《{this.state.agreement[i].name}》 </Text>);
        }
        return (
            <View>
                <Text allowFontScaling={false}  style={{
                    color: FontAndColor.COLORA0,
                    paddingLeft: Pixel.getPixel(15),
                    paddingRight: Pixel.getPixel(15),
                    fontSize: Pixel.getPixel(FontAndColor.CONTENTFONT24),
                    paddingTop: Pixel.getPixel(10),
                    paddingBottom: Pixel.getPixel(10),
                }}><Text allowFontScaling={false}  style={{color: FontAndColor.COLORA1}}>
                    如上借据内车辆使用车贷微单额度，需要点击确认后完成最终放款</Text></Text>
                <View style={{width:width,height:Pixel.getPixel(60)}}>

                    <Text allowFontScaling={false} 
                        style={{lineHeight: 25,paddingRight:Pixel.getPixel(15),paddingLeft:Pixel.getPixel(15),paddingTop:Pixel.getPixel(7)}}>
                        <Text allowFontScaling={false}  style={{color:FontAndColor.COLORA1,fontSize: Pixel.getFontPixel(12)}}>
                            {'         我已详细阅读并同意'}</Text>
                        {childitems}
                    </Text>
                    <TouchableOpacity style={{width:Pixel.getPixel(23),height:Pixel.getPixel(23),position: 'absolute',top: Pixel.getPixel(12),
                                    left:Pixel.getPixel(15),justifyContent:'center'}} onPress={()=>{
                            this.setState({
                                agree:!this.state.agree
                            });
                        }} activeOpacity={0.8}>
                        <Image style={{width:Pixel.getPixel(16),height:Pixel.getPixel(16)}}
                               source={this.state.agree?require('../../images/login/amou_choose.png'):require('../../images/login/amou_unchoose.png')}/>
                    </TouchableOpacity>
                </View>
                <MyButton buttonType={MyButton.TEXTBUTTON}
                          content={'确认申请'}
                          parentStyle={styles.loginBtnStyle}
                          childStyle={styles.loginButtonTextStyle}
                          mOnPress={() => {
                              if (this.state.agree) {
                                  this.submitWZInfo();
                              } else {
                                  this.props.showToast("请确认服务协议");
                              }
                          }}/>
            </View>
        );
    }

    /**
     * from @zhaojian
     *
     * 绘制列表每一行
     **/
    _renderRow = (data, sindex, rowID) => {
        return (
            <TouchableOpacity style={styles.itemStyle} onPress={() => this.finshPage(data)}>
                <Text allowFontScaling={false}  style={[styles.itemIconStyle, {flex: 1}]}>{data.loan_number}</Text>
                <Text allowFontScaling={false}  style={styles.itemTextStyle}>{data.money_str}</Text>
            </TouchableOpacity>

        )
    }

    finshPage = (data) => {
        this.toNextPage({name:'ReceiptInfoScene',component:ReceiptInfoScene,params:{data:data}});
    }

    _renderSeparator(sectionId, rowId) {
        return (
            <View style={styles.Separator} key={sectionId + rowId}/>
        )
    }

    //获取借据数据列表
    getWZInfo = () => {
        let loan_number = '';
        if(this.props.loan_number){
            loan_number = this.props.loan_number;
        }
        let maps = {
            api: AppUrls.GET_IOU_LIST,
            loan_code: this.props.loan_code,
            loan_number:loan_number


        };
        request(AppUrls.FINANCE, 'Post', maps)
            .then((response) => {
                this.setState({
                    source: ds.cloneWithRows(response.mjson.data.iou_list),
                    renderPlaceholderOnly: 'success',
                    agreement:response.mjson.data.contract,
                    iou_list:response.mjson.data.iou_list
                });
            }, (error) => {
                this.setState({
                    renderPlaceholderOnly: 'error'
                });
            });
    }

    //确认借据操作
    submitWZInfo = () => {
        let loan_number = '';
        for(let i = 0;i<this.state.iou_list.length;i++){
            loan_number = loan_number+this.state.iou_list[i].loan_number+','
        }
        let newloan = loan_number.substring(0,loan_number.length-1);
        let maps = {};
        if (Platform.OS === 'android') {
            maps = {
                api: AppUrls.CONFIRM_APPLY,
                contract_base: JSON.stringify(this.state.agreement),
                android_imei: imeis,
                useragent: 'android',
                loan_code:this.props.loan_code,
                loan_number:newloan
            };
        } else {
            maps = {
                api: AppUrls.CONFIRM_APPLY,
                contract_base: JSON.stringify(this.state.agreement),
                ios_idfa: iosIDFA,
                useragent: 'ios',
                loan_code:this.props.loan_code,
                loan_number:newloan
            };
        }
        this.props.showModal(true);
        request(AppUrls.FINANCE, 'Post', maps)
            .then((response) => {
                this.props.showModal(false);
                this.props.callBack();
                this.backPage();
            }, (error) => {
                if (error.mycode == -300 || error.mycode == -500) {
                    this.props.showToast("获取失败");
                } else {
                    this.props.showToast(error.mjson.msg + "");
                }
            });
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        backgroundColor: FontAndColor.COLORA3
    },
    container: {
        flex: 1,
        marginTop: Pixel.getPixel(0),   //设置listView 顶在最上面
        backgroundColor: FontAndColor.COLORA4,
    },
    itemStyel: {},
    inputTextStyle: {
        backgroundColor: '#ffffff',
        paddingLeft: 0,
        paddingRight: 0,
        margin: 0,
    },
    inputTextLine: {
        backgroundColor: FontAndColor.COLORA3,
        height: Pixel.getPixel(10),
        width: width,
    },
    inputTextsStyle: {
        backgroundColor: '#ffffff',
        paddingLeft: Pixel.getPixel(15),
        paddingRight: Pixel.getPixel(15),
    },
    loginBtnStyle: {
        height: Pixel.getPixel(44),
        width: itemWidth - Pixel.getPixel(30),
        backgroundColor: FontAndColor.COLORB0,
        marginTop: Pixel.getPixel(15),
        marginBottom: Pixel.getPixel(15),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Pixel.getPixel(4),
        alignSelf: 'center'
    },
    loginButtonTextStyle: {
        color: FontAndColor.COLORA3,
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT)
    },
    listStyle: {
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    itemStyle: {
        width: width,
        height: 40,
        alignItems: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingLeft: Pixel.getPixel(15),
        paddingRight: Pixel.getPixel(15)
    },
    itemIconStyle: {
        width: 30,
        height: 30,
        paddingTop: 5,
        paddingBottom: 5,
    },
    itemTextStyle: {
        // flex: 1,
        textAlign: 'center',
        marginRight: 5,
    },
    Separator: {
        height: Pixel.getPixel(1),
        backgroundColor: FontAndColor.COLORA3

    },
});