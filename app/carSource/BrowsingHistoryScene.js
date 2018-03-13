/**
 * Created by ZN on 17/2/25.
 */

import  React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    ListView,
    RefreshControl
} from 'react-native';

import BaceComponent from '../component/BaseComponent';
import NavigatorView from '../component/AllNavigationView';
import CarCell     from './znComponent/CarCollectionItems';
import * as fontAndColor from '../constant/fontAndColor';
import PixelUtil from '../utils/PixelUtil';
let Pixel = new PixelUtil();
let page = 1;
let allPage = 1;
import {request} from '../utils/RequestUtil';
import * as Urls from '../constant/appUrls';
import CarInfoScene from './CarInfoScene';
var screenWidth = Dimensions.get('window').width;
import  AllLoading from '../component/AllLoading';
import  LoadMoreFooter from './znComponent/LoadMoreFooter';
let allSouce = [];
export default class BrowsingHistoryScene extends BaceComponent {

    initFinish = () => {
        this.getData();
    };

    componentWillUnmount() {
        allSouce = [];
    }

    getData = () => {
        let maps = {};
        request(Urls.USER_HISTORY, 'Post', maps)
            .then((response) => {
                    allPage=response.mjson.data.pageCount;
                    if (page == 1 && response.mjson.data.list.length <= 0) {
                        this.setState({renderPlaceholderOnly: 'null', isRefreshing: false});
                    } else {
                        allSouce.push(...response.mjson.data.list);
                        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        this.setState({
                            carData: ds.cloneWithRows(allSouce),
                            renderPlaceholderOnly: 'success',
                            isRefreshing: false
                        });
                    }
                },
                (error) => {
                    this.setState({renderPlaceholderOnly: 'error', isRefreshing: false});
                });
    }

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            carData: {},
            renderPlaceholderOnly: 'blank',
            isRefreshing: false
        };
    }

    toEnd =() => {

        if(!this.state.isRefreshing && allSouce.length>0 && allPage!=page){

            page++;
            this.getApplyData();
        }

    };

    getApplyData=()=>{

        let maps = {
            page: page,
            rows: 10
        };
        request(Urls.USER_HISTORY, 'Post', maps)
            .then((response) => {
                    if (response.mjson.data.list.length>0)
                    {
                        allSouce.push(...response.mjson.data.list);
                        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        this.setState({
                            carData: ds.cloneWithRows(allSouce),
                        });
                    }
                },
                (error) => {
                    this.props.showToast(error.msg);
                });
    }

    renderListFooter = () => {

        if (this.state.isRefreshing) {
            return null;
        } else {
            return (<LoadMoreFooter isLoadAll={page==allPage?true:false}/>)
        }

    }

    refreshingData = () => {
        allSouce = [];
        this.setState({isRefreshing: true});
        page = 1;
        this.getData();
    };

    allRefresh = () => {
        allSouce = [];
        this.setState({renderPlaceholderOnly: 'loading'});
        page = 1;
        this.getData();
    }

    deleteCliiection = (id) => {
        this.props.showModal(true);
        let maps = {
            id: id
        };
        request(Urls.USER_HISTORY_DELETE, 'Post', maps)
            .then((response) => {
                    allSouce = [];
                    this.props.showToast('删除成功');
                    this.getData();
                },
                (error) => {
                    this.props.showToast('删除失败');
                });
    }

    deleteAllCliiection = () => {
        this.props.showModal(true);
        let maps = {};
        request(Urls.USER_HISTORY_DELETE, 'Post', maps)
            .then((response) => {
                    allSouce = [];
                    this.props.showToast('删除成功');
                    page = 1;
                    this.getData();
                },
                (error) => {
                    this.props.showToast('删除失败');
                });
    }


    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return ( <View style={styles.rootContainer}>
                {this.loadView()}
                <NavigatorView title='浏览历史' backIconClick={this.backPage}/>
            </View>);
        }
        return (
            <View style={styles.rootContainer}>
                <ListView style={{backgroundColor:fontAndColor.COLORA3,marginTop:Pixel.getTitlePixel(64)}}
                          dataSource={this.state.carData}
                          showsVerticalScrollIndicator={false}
                          removeClippedSubviews={false}
                          renderRow={(rowData) =>
                          <CarCell from="BrowsingHistoryScene" items={rowData} mOnPress={(id)=>{
                               if(rowData.status==3){
                                    this.props.showToast('该车辆已下架，不可查看');
                              }else if(rowData.status==4){
                                    this.props.showToast('该车辆已成交，不可查看');
                              }else{
                                  this.toNextPage({name:'CarInfoScene',component:CarInfoScene,params:{carID:id}});
                              }
                          }}
                          callBack={(id)=>{
                            this.deleteCliiection(id)
                          }
                          }
                          />
                       }
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
                <AllLoading callEsc={()=>{}} ref="allloading" callBack={()=>{
                        this.deleteAllCliiection();
                }}/>
                <NavigatorView title='浏览历史' backIconClick={this.backPage}
                               renderRihtFootView={this._navigatorRightView}/>
            </View>)

    }

    _navigatorRightView = () => {
        return (
            <TouchableOpacity  activeOpacity={0.8} onPress={()=>{
            this.refs.allloading.changeShowType(true,'确认清空吗？');
        }}>
                <View style={{paddingVertical:3, paddingHorizontal:5,backgroundColor:'transparent',borderWidth:StyleSheet.hairlineWidth,borderColor:'white',borderRadius:3}}>
                <Text allowFontScaling={false} 
                    style={{
                    color: 'white',
                    fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                    textAlign: 'center',
                    backgroundColor: 'transparent',
                }}>清空历史</Text>
                </View>
            </TouchableOpacity>
        );
    }

}


const styles = StyleSheet.create({

    rootContainer: {
        flex: 1,
        backgroundColor: 'white',

    },

})