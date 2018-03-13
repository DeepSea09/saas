import  React, {Component, PropTypes} from  'react'
import  {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    ListView,
    RefreshControl,
    Image
} from  'react-native'

import * as fontAndColor from '../../constant/fontAndColor';
import  PixelUtil from '../../utils/PixelUtil'
import SignContractScene from '../contractManage/SignContractScene'
var Pixel = new PixelUtil();
const cellJianTou = require('../../../images/mainImage/celljiantou.png');
import  LoadMoreFooter from '../../component/LoadMoreFooter';
import {request} from '../../utils/RequestUtil';
import * as Urls from '../../constant/appUrls';
import BaseComponent from "../../component/BaseComponent";
import NavigatorView from '../../component/AllNavigationView';
import AdjustManageListScene from './AdjustManageListScene';
/*
 * 获取屏幕的宽和高
 **/
const {width, height} = Dimensions.get('window');
let page = 1;
let allPage = 1;
let allSouce = [];
export default class AdjustManageScene extends BaseComponent {
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
            api: Urls.LOAN_SUBJECT,
        };
        request(Urls.FINANCE, 'Post', maps)
            .then((response) => {
                    if (page == 1 && response.mjson.data.length <= 0) {
                        this.setState({renderPlaceholderOnly: 'null'});
                    } else {
                        allSouce.push(...response.mjson.data);
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
            return ( <View style={styles.container}>

                {this.loadView()}
                <NavigatorView title='优惠券' backIconClick={this.backPage}/>
            </View>);
        } else {
            return (<View style={styles.container}>
                <NavigatorView title='优惠券' backIconClick={this.backPage}/>


                <ListView style={{backgroundColor:fontAndColor.COLORA3,marginTop:Pixel.getTitlePixel(74)}}
                          dataSource={this.state.dataSource}
                          renderRow={this._renderRow}
                          enableEmptySections={true}
                          removeClippedSubviews={false}
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

            </View>);
        }
    }

    // 每一行中的数据
    _renderRow = (rowData, rowID, selectionID) => {
        let name = rowData.companyname == '' ? rowData.name : rowData.companyname;
        return (
            <TouchableOpacity
                onPress={()=>{
                    this.toNextPage({
                        callBack: () => {
                            this.setState({renderPlaceholderOnly: 'loading'});
                            this.getData();
                        },
                name: 'AdjustManageListScene',
                component: AdjustManageListScene,
                params: {
                    base_id: rowData.user_id,
                },
            })}}>
                <View style={styles.rowView} >
                    <Text allowFontScaling={false}  style={styles.rowLeftTitle}>{name}</Text>
                    <Text allowFontScaling={false}  style={styles.rowRightTitle} ></Text>
                    <Image source={cellJianTou} style={styles.image}></Image>
                </View>
            </TouchableOpacity>
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
        marginTop: Pixel.getPixel(15)
    },
    sectionView: {
        height: Pixel.getPixel(10),
        backgroundColor: fontAndColor.COLORA3,
    },
    rowView: {
        height: 44,
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomColor: fontAndColor.COLORA4,
        borderBottomWidth: 1,
        flexDirection: 'row'
    },
    rowLeftTitle: {
        marginLeft: Pixel.getPixel(15),
        flex: 1,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        color: fontAndColor.COLORA0,

    },
    rowRightTitle: {
        marginRight: Pixel.getPixel(10),
        color: fontAndColor.COLORA2,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),

    },
    image: {
        marginRight: Pixel.getPixel(15),
    }


});