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
    InteractionManagerm,
    RefreshControl,
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../../constant/fontAndColor';
import {request} from '../../../utils/RequestUtil';
import * as Urls from '../../../constant/appUrls';
import StorageUtil from "../../../utils/StorageUtil";
import * as StorageKeyNames from "../../../constant/storageKeyNames";
import BaseComponent from '../../../component/BaseComponent';
import ListFooter from './../../../component/LoadMoreFooter';

export  default class FlowAllPage extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态

        this.state = {
            renderPlaceholderOnly: 'blank',
            source: [],
            time: '',
            isRefreshing: false,
            haveMoreData: true,
        };
        this.page = 1;
        this.allPage = 1;
        this.dataList = [];
        this.enter_base_id = '';
        this.user_type = '';
    }

    componentDidMount() {
        //InteractionManager.runAfterInteractions(() => {
        this.setState({renderPlaceholderOnly: 'loading'});
        this.initFinish();
        // });
    }

    initFinish = () => {
        this.getData();
    }

    getData = () => {
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    enter_base_ids: datas.company_base_id,
                    child_type: '1',

                };
                request(Urls.USER_ACCOUNT_INFO, 'Post', maps)
                    .then((response) => {
                            this.enter_base_id = datas.company_base_id;
                            this.user_type = response.mjson.data.account.account_open_type;
                            this.getFlowData(datas.company_base_id, response.mjson.data.account.account_open_type);
                        },
                        (error) => {
                            this.setState({
                                renderPlaceholderOnly: 'error',
                            });
                        });
            } else {
                this.setState({
                    renderPlaceholderOnly: 'error',
                });
            }
        })
    }

    getFlowData = (id, type) => {
        let maps = {
            create_time: this.state.time,
            enter_base_id: id,
            transfer_type: this.props.transfer_type,
            user_type: type,
            page: this.page,
            row: 10,
        };
        request(Urls.ACCOUNT_PAYLOG, 'Post', maps)
            .then((response) => {
                    if (response.mjson.data.data == null || response.mjson.data.data.length <= 0) {
                        this.setState({
                            isRefreshing: false,
                            renderPlaceholderOnly: 'null',
                        });
                    } else {
                        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        for (let i = 0; i < response.mjson.data.data.length; i++) {
                            this.dataList.push(response.mjson.data.data[i]);
                        }
                        this.allPage = response.mjson.data.total_page;
                        this.setState({
                            isRefreshing: false,
                            renderPlaceholderOnly: 'success',
                            source: ds.cloneWithRows(this.dataList)
                        });
                        if (this.page == this.allPage) {
                            this.setState({
                                haveMoreData: false
                            });
                        }

                    }
                },
                (error) => {
                    if (error.mycode == '-2100045') {
                        this.setState({
                            isRefreshing: false,
                            renderPlaceholderOnly: 'null',
                        });
                    } else {
                        this.setState({
                            isRefreshing: false,
                            renderPlaceholderOnly: 'error',
                        });
                    }
                });
    }

    changeTime = (time) => {
        this.setState({
            time: time,
            renderPlaceholderOnly: 'loading'
        });
        this.dataList = [];
        this.getData();
    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        }
        return (
            <ListView
                removeClippedSubviews={false}
                style={{marginTop:Pixel.getPixel(0),backgroundColor: fontAndColor.COLORA3, flex: 1}}
                dataSource={this.state.source}
                renderRow={this._renderRow}
                renderSeparator={this._renderSeparator}

                initialListSize={10}
                onEndReachedThreshold={2}
                stickyHeaderIndices={[]}//仅ios
                enableEmptySections={true}
                scrollRenderAheadDistance={10}
                pageSize={10}
                renderFooter={this.renderListFooter}
                onEndReached={this.toEnd}
                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isRefreshing}
                                        onRefresh={this.refreshingData}
                                        tintColor={[fontAndColor.COLORB0]}
                                        colors={[fontAndColor.COLORB0]}
                                    />}
            />
        );
    }

    _renderRow = (movie, sectionId, rowId) => {
        let viewColor = '#ffbd2f';
        if ('0' == movie.t_operate_type) {
            //转账
            viewColor = '#05c5c2';
        } else if ('3' == movie.t_operate_type) {
            //充值
            viewColor = '#3ac87e';
        } else if ('4' == movie.t_operate_type) {
            //提现
            viewColor = '#90a1b5';
        } else if ('100' == movie.t_operate_type) {
            //还款
            viewColor = '#ffbd2f';
        } else if ('101' == movie.t_operate_type) {
            //放款
            viewColor = '#2f9bfa';
        } else if ('104' == movie.t_operate_type) {
            //交易
            viewColor = '#fa5741';
        }
        return (
            <View style={{
                    flex:1,
                    flexDirection:'row',
                    backgroundColor:'#ffffff',
                    paddingLeft:Pixel.getPixel(15),
                    paddingRight:Pixel.getPixel(15),
                    height:Pixel.getPixel(74),
                    justifyContent:'center',
                    alignItems:'center'

                }}>

                <View
                    style={{borderRadius:Pixel.getPixel(20),backgroundColor:viewColor,
                    width:Pixel.getPixel(40),height:Pixel.getPixel(40),justifyContent:'center',alignItems:'center'}}>
                    <Text allowFontScaling={false} style={styles.text}>{movie.operate_type_name}</Text>
                </View>

                <View style={{
                    flex:1,
                    flexDirection:'row',
                    backgroundColor:'#ffffff',
                    paddingLeft:Pixel.getPixel(15)
                }}>
                    <View
                        style={{flex:1,flexDirection:'column',height:Pixel.getPixel(37),justifyContent:'center'}}>
                        <Text numberOfLines={1} allowFontScaling={false}
                              style={[styles.leftText,{  fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),}]}>{movie.show}</Text>
                        <Text allowFontScaling={false}
                              style={[styles.leftText,{color:'#9e9e9e'}]}>{movie.create_time}</Text>
                    </View>
                    <View
                        style={{flex:1,flexDirection:'column',height:Pixel.getPixel(37),justifyContent:'center'}}>
                        {('3' == movie.t_operate_type || '4' == movie.t_operate_type || '0' == movie.t_operate_type ) ?
                            <View style={{height:Pixel.getPixel(10)}}></View>
                            : <Text allowFontScaling={false}
                                    style={[styles.rightText,{color:'#9e9e9e'}]}>{movie.fee_type_name}</Text>}
                        <Text allowFontScaling={false}
                              style={[styles.rightText,{color:'#fa5741',fontSize:Pixel.getFontPixel(17)}]}>{movie.amount}</Text>
                    </View>
                </View>
            </View>
        )
    }


    _renderSeparator(sectionId, rowId) {

        return (
            <View style={{width:width,height:Pixel.getPixel(1),backgroundColor:fontAndColor.COLORA3}}
                  key={sectionId + rowId}>
            </View>
        )
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor: fontAndColor.COLORA3}}>
                {this.loadView()}
            </View>
        );
    }

    renderListFooter = () => {

        if (this.state.isRefreshing) {
            return null;
        } else {
            return (<ListFooter isLoadAll={this.state.haveMoreData? false : true}/>)
        }
    }

    toEnd = () => {
        if (!this.state.isRefreshing && this.page != this.allPage) {
            this.page = this.page + 1;
            this.getFlowData(this.enter_base_id, this.user_type);
        }

    };

    refreshingData = () => {

        this.setState({
            isRefreshing: true,
        });
        this.page = 1;
        this.dataList = [];
        this.setState({
            haveMoreData: true
        });
        this.getFlowData(this.enter_base_id, this.user_type);

    }

}
const styles = StyleSheet.create({
    leftText: {
        color: '#000',
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
        minWidth: Pixel.getPixel(100),
        maxWidth: Pixel.getPixel(150),
    },
    text: {
        color: '#ffffff',
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        textAlign: 'center',
    },
    rightText: {
        color: '#000',
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
        flex: 1,
        textAlign: 'right',
    },
})