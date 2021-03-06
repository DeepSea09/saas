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

import * as fontAndColor from '../../../constant/fontAndColor';
import  PixelUtil from '../../../utils/PixelUtil'
var Pixel = new PixelUtil();
import ContractSignScene from './NewContractInfoScene';
import BaseComponent from "../../../component/BaseComponent";
import {request} from '../../../utils/RequestUtil';
import * as Urls from '../../../constant/appUrls';
import  LoadMoreFooter from '../../../component/LoadMoreFooter';
/*
 * 获取屏幕的宽和高
 **/
let page = 1;
let allPage = 1;
let allSouce = [];
const {width, height} = Dimensions.get('window');

export default class NoneSineScene extends BaseComponent {
    initFinish = () => {
        this.getData();
    }

    componentWillUnmount() {
        allSouce = [];
    }

    getData = () => {
        let maps = {
            page: page,
            rows: 10,
            api : Urls.CONTRACT_LOAN_LIST,
            opt_user_id: this.props.opt_user_id,
            sign_status: '0',
        };        request(Urls.FINANCE, 'Post', maps)

            .then((response) => {
                    if (page == 1 && response.mjson.data.payment_list.length <= 0) {
                        this.setState({renderPlaceholderOnly: 'null'});
                    } else {
                        allPage= response.mjson.data.total/10;
                        allSouce.push(...response.mjson.data.payment_list);
                        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        this.setState({
                            dataSource: ds.cloneWithRows(allSouce),
                            isRefreshing: false
                        });
                        this.setState({renderPlaceholderOnly: 'success'});
                    }
                },
                (error) => {
                    this.setState({renderPlaceholderOnly: 'error', isRefreshing: false});
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
        }else{

            return (
                <View style={styles.container}>
                    <ListView
                        removeClippedSubviews={false}
                        contentContainerStyle={styles.listStyle}
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow}
                        renderFooter={
                            this.renderListFooter
                        }
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
            <View style={styles.rowView}>
                <View style={styles.rowLeft}>
                <Text allowFontScaling={false}  style={styles.rowLeftTitle}>{rowData.product}</Text>
                <Text allowFontScaling={false}  style={styles.rowLeftTitle1}>{rowData.payment_number}</Text>
                </View>
                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => {
                        this.toNextPage({
                            name: 'ContractSignScene',
                            component: ContractSignScene,
                            params: {
                                payment_number: rowData.payment_number,
                                showButton: true,
                                callBack: () => {
                                    allSouce = [];
                                    this.setState({renderPlaceholderOnly: 'loading'});
                                    page = 1;
                                    this.getData();
                                },
                            },
                        })
                    }}>
                    <Text allowFontScaling={false}  style={styles.rowRightTitle}>签署合同</Text>

                </TouchableOpacity>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {

        flex: 1,
        marginTop: Pixel.getPixel(0),   //设置listView 顶在最上面
        backgroundColor: fontAndColor.COLORA3,
    },
    listStyle: {
        marginTop: Pixel.getPixel(0)
    },
    sectionView: {
        height: Pixel.getPixel(10),
        backgroundColor: fontAndColor.COLORA3,
    },
    rowView: {
        height:Pixel.getPixel(77),
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
    buttonStyle:{
        height: Pixel.getPixel(27),
        width: Pixel.getPixel(80),
        borderRadius: 3,
        marginRight: Pixel.getPixel(15),
        backgroundColor: fontAndColor.COLORB0,
        justifyContent:'center',
        alignItems:'center'

    }


});