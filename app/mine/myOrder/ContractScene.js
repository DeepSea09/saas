/**
 * Created by hanmeng on 2017/6/22.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    InteractionManager,
    ListView,
    BackAndroid,
    Image
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import NavigatorView from '../../component/AllNavigationView';
import * as fontAndColor from '../../constant/fontAndColor';
import BaseComponent from '../../component/BaseComponent';
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";

export  default class ContractScene extends BaseComponent {

    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(this.props.contractList),
            renderPlaceholderOnly: 'blank',
            isRefreshing: false
        };
    }

    componentDidMount() {
        try {
            BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
        } catch (e) {

        } finally {
            //InteractionManager.runAfterInteractions(() => {
                this.setState({renderPlaceholderOnly: 'success'});
                //this.initFinish();
            //});
        }
    }

    initFinish = () => {
        this.loadData();
    };

    handleBack = () => {
        this.backPage();
        return true;
    };

    loadData = () => {
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    company_id: datas.company_base_id,
                    business: this.props.business,
                    page: 1,
                    rows: 10,
                    //list_state: this.props.listState,
                    status: this.status,
                    start_time: this.startDate === '选择开始时间' ? '' : this.startDate,
                    end_time: this.endDate === '选择结束时间' ? '' : this.endDate
                };
                let url = AppUrls.ORDER_INDEX;
                this.pageNum = 1;
                request(url, 'post', maps).then((response) => {
                    this.props.showModal(false);
                    this.orderListData = response.mjson.data.items;
                    this.allPage = response.mjson.data.total / response.mjson.data.rows;
                    //console.log('订单列表数据 = ', this.orderListData[0].car);
                    if (this.orderListData) {
                        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        this.setState({
                            dataSource: ds.cloneWithRows(this.orderListData),
                            isRefreshing: false,
                            renderPlaceholderOnly: 'success'
                        });
                    } else {
                        this.setState({
                            isRefreshing: false,
                            renderPlaceholderOnly: 'null'
                        });
                    }
                }, (error) => {
                    this.props.showModal(false);
                    //console.log('请求错误 = ', error);
                    this.setState({
                        isRefreshing: false,
                        renderPlaceholderOnly: 'error'
                    });
                });
            } else {
                this.props.showModal(false);
                //console.log('请求错误 = ', error);
                this.setState({
                    isRefreshing: false,
                    renderPlaceholderOnly: 'error'
                });
            }
        });
    };

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            // 加载中....
            return ( <View style={styles.container}>
                {this.loadView()}
                <NavigatorView title='合同' backIconClick={this.backPage}/>
            </View>);
        } else {
            return (<View style={styles.container}>
                <NavigatorView title='合同' backIconClick={this.backPage}/>
                <ListView style={{backgroundColor: fontAndColor.COLORA3, marginTop: Pixel.getTitlePixel(65)}}
                          dataSource={this.state.dataSource}
                          removeClippedSubviews={false}
                          renderRow={this._renderRow}
                          enableEmptySections={true}/>
            </View>);
        }
    }

    _renderRow = (rowData, selectionID, rowID) => {
        return (
            <View
                style={{
                    width: width,
                    height: height,
                    paddingBottom: Pixel.getPixel(20)
                }}>
                <Image
                    style={{flex: 1}}
                    source={{uri: rowData}}/>
            </View>
        )
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height, backgroundColor: fontAndColor.COLORA3}}>
                <NavigatorView
                    title="合同"
                    backIconClick={() => {
                        this.props.showModal(false);
                        this.backPage();
                    }}
                />
            </View>
        );
    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: fontAndColor.COLORA3
    },
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
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'}
})