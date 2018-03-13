import  React, {Component, PropTypes} from  'react'
import  {

    View,
    Text,
    ListView,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    RefreshControl,
} from  'react-native'

import * as fontAndColor from '../../constant/fontAndColor';
import  PixelUtil from '../../utils/PixelUtil'
var Pixel = new PixelUtil();
const cellJianTou = require('../../../images/mainImage/celljiantou@2x.png');
import ContractSignScene from '../contractManage/ContractSignScene';
import BaseComponent from "../../component/BaseComponent";
import {request} from '../../utils/RequestUtil';
import * as Urls from '../../constant/appUrls';
import  LoadMoreFooter from '../../component/LoadMoreFooter';
import  RecognizedGains from '../../login/RecognizedGains';
/*
 * 获取屏幕的宽和高
 **/
let page = 1;
let allPage = 1;
let allSouce = [];
const {width, height} = Dimensions.get('window');

export default class CompleteSignScene extends BaseComponent {
    initFinish = () => {
        this.getData();
    }

    componentWillUnmount() {
        allSouce = [];
        page = 1;
        allPage = 1;
    }

    getData = () => {
        let maps = {
            page: page,
            rows: 10,
            api: Urls.GET_CTC_CONTRACT_LIST_FOR_APP,
            opt_user_id: this.props.opt_user_id,
            sign_status: '3,4',
            opt_merge_id:this.props.opt_merge_id
        };
        request(Urls.FINANCE, 'Post', maps)

            .then((response) => {
                    if (page == 1 && response.mjson.data.list.length <= 0) {
                        this.setState({renderPlaceholderOnly: 'null'});
                    } else {
                        allPage = response.mjson.data.total / 10;
                        allSouce.push(...response.mjson.data.list);
                        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        this.setState({
                            dataSource: ds.cloneWithRows(allSouce),
                            isRefreshing: false,
                            renderPlaceholderOnly: 'success'
                        });
                    }
                },
                (error) => {
                    if(error.mycode=='-2100045'){
                        this.setState({
                            isRefreshing: false,
                            renderPlaceholderOnly: 'null'
                        });
                    }else{
                        this.setState({
                            isRefreshing: false,
                            renderPlaceholderOnly: 'error'
                        });
                    }
                    // this.setState({renderPlaceholderOnly: 'error', isRefreshing: false});
                });
    }
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            dataSource: {},
            renderPlaceholderOnly: 'blank',
            isRefreshing: false
        };

    }

    refreshingData = () => {
        allSouce = [];
        this.setState({isRefreshing: true});
        page = 1;
        this.getData();
    };

    toEnd = () => {
        if (this.state.isRefreshing) {

        } else {
            if (page < allPage) {
                page++;
                this.getData();
            }
        }

    };

    renderListFooter = () => {
        if (this.state.isRefreshing) {
            return null;
        } else {
            return (<LoadMoreFooter isLoadAll={page>=allPage?true:false}/>)
        }
    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (<View style={{backgroundColor: fontAndColor.COLORA3, flex: 1, paddingTop: Pixel.getPixel(15)}}>
                {this.loadView()}
            </View>);
        } else {

            return (
                <View style={styles.container}>
                    <ListView
                        style={styles.listStyle}
                        dataSource={this.state.dataSource}
                        removeClippedSubviews={false}
                        renderRow={this._renderRow}
                        renderFooter={
                            this.renderListFooter
                        }
                        renderSeparator={this._renderSeparator}
                        onEndReached={this.toEnd}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this.refreshingData}
                                tintColor={[fontAndColor.COLORB0]}
                                colors={[fontAndColor.COLORB0]}
                            />
                        }
                    />

                </View>
            );
        }
    }

    // 每一行中的数据
    _renderRow = (rowData, rowID, selectionID) => {
        return (
            <TouchableOpacity onPress={()=>{
                        this.toNextPage({
                            name: 'RecognizedGains',
                            component: RecognizedGains,
                            params: {
                                loan_code:rowData.loan_code,
                                loan_number:rowData.loan_number,
                                isShow:false
                            },
                        })
            }} activeOpacity={1} style={{backgroundColor: '#fff',width:width,height:Pixel.getPixel(111),paddingLeft:Pixel.getPixel(15),
            paddingRight:Pixel.getPixel(15)}}>
                <View style={{width:width-Pixel.getPixel(30),height:Pixel.getPixel(65),flexDirection:'row'}}>
                    <View style={{flex:1,justifyContent:'center',}}>
                        <Text allowFontScaling={false}  style={{fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                        color:fontAndColor.COLORA1}}>{rowData.loan_number}</Text>
                        <Text allowFontScaling={false}  style={{fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                        color:fontAndColor.COLORA0,marginTop:Pixel.getPixel(6)}}>{this.props.companyname}</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                        <Text allowFontScaling={false}  style={{fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                        color:fontAndColor.COLORA1}}>借款金额</Text>
                        <Text allowFontScaling={false}  style={{fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                        color:fontAndColor.COLORB2,marginTop:Pixel.getPixel(6)}}>{rowData.money_str}</Text>
                    </View>
                </View>
                <View
                    style={{width:width-Pixel.getPixel(30),height:Pixel.getPixel(1),backgroundColor: fontAndColor.COLORA3}}></View>
                <View style={{width:width-Pixel.getPixel(30),height:Pixel.getPixel(45),flexDirection:'row'}}>
                    <View style={{flex:1,justifyContent:'center'}}>
                        <Text allowFontScaling={false}  style={{fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                        color:fontAndColor.COLORA1}}>{rowData.contract_name}</Text>
                    </View>
                    <View  style={{flex:1,justifyContent:'center',alignItems: 'flex-end'}}>
                        <View style={{
                            backgroundColor: fontAndColor.COLORA4,
                            width:Pixel.getPixel(80),height:Pixel.getPixel(30),justifyContent:'center',alignItems: 'center'
                        }}>
                            <Text allowFontScaling={false}  style={{ color: fontAndColor.COLORA3,
                                fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}}>
                                已签署
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    _renderSeparator(sectionId, rowId) {

        return (
            <View style={styles.Separator} key={sectionId + rowId}>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    Separator: {
        backgroundColor: fontAndColor.COLORA3,
        height: Pixel.getPixel(10),

    },
    container: {

        flex: 1,
        marginTop: Pixel.getPixel(0),   //设置listView 顶在最上面
        backgroundColor: fontAndColor.COLORA3,
    },
    listStyle: {
        marginTop: Pixel.getPixel(10)
    },
    sectionView: {
        height: Pixel.getPixel(10),
        backgroundColor: fontAndColor.COLORA3,
    },
    rowView: {
        height: Pixel.getPixel(77),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopColor: fontAndColor.COLORA4,
        borderTopWidth: 1,
    },
    rowLeftTitle: {
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        color: fontAndColor.COLORA0,

    },
    rowLeftTitle1: {
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        color: fontAndColor.COLORA2,

    },
    rowLeft: {
        marginLeft: Pixel.getPixel(15),
        flex: 1,
        flexDirection: 'column',
    },
    rowRightTitle: {
        color: fontAndColor.COLORA3,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),

    },
    image: {
        marginRight: Pixel.getPixel(15),
    },
    buttonStyle: {
        height: Pixel.getPixel(27),
        width: Pixel.getPixel(80),
        borderRadius: 3,
        marginRight: Pixel.getPixel(15),
        backgroundColor: fontAndColor.COLORB0,
        justifyContent: 'center',
        alignItems: 'center'

    }


});