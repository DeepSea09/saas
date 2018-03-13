/**
 * Created by zhengnan on 2017/8/17.
 */


import React,{Component} from 'react';
import {
    View,
    StyleSheet,
    ListView,
    Text,
    TouchableOpacity,
    RefreshControl,
    InteractionManager,
} from 'react-native';
import BaceComponent from '../../component/BaseComponent';
import MyCarCell     from './CarCell';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import RepaymenyTabBar from '../../finance/repayment/component/RepaymenyTabBar';
import ListFooter           from './LoadMoreFooter';
import * as AppUrls from "../../constant/appUrls";
import  {request}           from '../../utils/RequestUtil';
import * as fontAndColor from '../../constant/fontAndColor';
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();

let carUpperFrameData = [];
let carDropFrameData = [];

let carUpperFramePage = 1;
let carUpperFrameStatus = 1;

let carDropFramePage = 1;
let carDropFrameStatus = 1;

export default class CarMyListView extends  BaceComponent{

    render(){
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (
                <View style={{backgroundColor:'white', flex:1}}>
                    {this.loadView()}
                </View>);
        }
        return(
            <View style={{flex:1}}>
                <ScrollableTabView
                    initialPage={0}
                    locked={true}
                    renderTabBar={() =><RepaymenyTabBar style={{backgroundColor:'white'}} tabName={["在售车源("+this.state.shelves_count+')', "已售车源("+this.state.sold_count+')']}/>}>
                    <MyCarSourceUpperFrameView ref="upperFrameView" carCellClick={this.props.carCellClick} renderFootView={this.props.renderFootView}  tabLabel="ios-paper1"/>
                    <MyCarSourceDropFrameView  ref="dropFrameView" carCellClick={this.props.carCellClick} renderFootView={this.props.renderFootView} tabLabel="ios-paper2"/>
                </ScrollableTabView>
            </View>
        )
    }

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            renderPlaceholderOnly:'blank',
            shelves_count:0,
            sold_count:0,
        };
    }

    initFinish=()=>{
        this.loadHeadData();
    }

    allRefresh=()=>{
        this.loadHeadData();
    }

    loadHeadData=(action)=>{

        this.setState({renderPlaceholderOnly:'loading'});
        request(AppUrls.CAR_USER_CAR, 'post', {
            car_status: '1',
            page: 1,
            row: 1,
        }).then((response) => {
            let data =response.mjson.data.total;
            this.setState({
                renderPlaceholderOnly: 'success',
                shelves_count:data.shelves_count,
                sold_count:data.sold_count,
            });
            action && action();

        }, (error) => {
            this.setState({
                renderPlaceholderOnly: 'error',
            });
        });
    }
}
class MyCarSourceUpperFrameView extends BaceComponent {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态

        const carData = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id != r2.id});
        this.state = {
            carData:carData,
            isRefreshing: true,
            renderPlaceholderOnly: 'blank',
            carUpperFrameStatus: carUpperFrameStatus,
        };
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: 'loading'});
            this.initFinish();
        });
    }

    initFinish = () => {
        this.setState({renderPlaceholderOnly: 'loading'});
        this.loadData();
    };

    refreshingData = () => {

        this.setState({
            isRefreshing: true,
        });
        this.loadData();

    }
    loadData = () => {

        let url = AppUrls.CAR_USER_CAR;
        carUpperFramePage = 1;
        request(url, 'post', {
            car_status: '1',
            page: carUpperFramePage,
            row: this.props.noLoadMore?5:10,

        }).then((response) => {

            carUpperFrameData=response.mjson.data.list;
            carUpperFrameStatus = response.mjson.data.status;

            if (carUpperFrameData.length) {
                this.setState({
                    carData: this.state.carData.cloneWithRows(carUpperFrameData),
                    isRefreshing: false,
                    renderPlaceholderOnly: 'success',
                    carUpperFrameStatus:carUpperFrameStatus,
                });

            } else {
                this.setState({
                    isRefreshing: false,
                    renderPlaceholderOnly: 'null',
                    carUpperFrameStatus: carUpperFrameStatus,

                });
            }

        }, (error) => {

            this.setState({
                isRefreshing: false,
                renderPlaceholderOnly: 'error',
            });

        });

    }

    loadMoreData = () => {

        let url = AppUrls.CAR_USER_CAR;
        carUpperFramePage += 1;
        request(url, 'post', {
            car_status: '1',
            page: carUpperFramePage,
            row: 10,

        }).then((response) => {
            carUpperFrameStatus = response.mjson.data.status;
            let carData = response.mjson.data.list;
            if (carData.length) {
                for (let i = 0; i < carData.length; i++) {
                    carUpperFrameData.push(carData[i]);
                }

                this.setState({
                    carData:this.state.carData.cloneWithRows(carUpperFrameData),
                    carUpperFrameStatus:carUpperFrameStatus,
                });
            } else {

                this.setState({
                    carUpperFrameStatus: carUpperFrameStatus,
                });
            }

        }, (error) => {


        });
    }


    toEnd = () => {
        if(this.props.noLoadMore)
        {
            return;
        }
        if (carUpperFrameData.length && !this.state.isRefreshing && carUpperFrameStatus != 2) {
            this.loadMoreData();
        }

    };

    renderListFooter = () => {

        if(this.props.renderFootView)
        {
            this.props.renderFootView();
            return null;
        }

        if (this.state.isRefreshing) {
            return null;
        } else {
            return (<ListFooter isLoadAll={this.state.carUpperFrameStatus==1? false : true}/>)
        }
    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (
                <View style={styles.loadView}>
                    {this.loadView()}
                </View>);
        }
        return (

            <View style={styles.viewContainer}>
                {
                    this.state.carData &&
                    <ListView
                        removeClippedSubviews={false}
                        style={styles.listView}
                        dataSource={this.state.carData}
                        ref={'carListView'}
                        initialListSize={10}
                        onEndReachedThreshold={1}
                        stickyHeaderIndices={[]}//仅ios
                        enableEmptySections={true}
                        scrollRenderAheadDistance={10}
                        pageSize={10}
                        renderFooter={this.renderListFooter}
                        onEndReached={this.toEnd}
                        renderRow={this.renderRow}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this.refreshingData}
                                tintColor={[fontAndColor.COLORB0]}
                                colors={[fontAndColor.COLORB0]}/>}
                    />
                }
            </View>
        )
    }

    renderRow =(rowData)=>{

        return(
            <MyCarCell carCellData={rowData} cellClick={this.props.carCellClick}/>
        )
    }


}

class MyCarSourceDropFrameView extends BaceComponent {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态

        const carData = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id != r2.id});
        this.state = {

            carData: carData,
            isRefreshing: true,
            carDropFrameStatus: carDropFrameStatus,
            renderPlaceholderOnly: 'blank',


        };
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: 'loading'});
            this.initFinish();
        });
    }


    initFinish = () => {
        this.setState({renderPlaceholderOnly: 'loading'});
        this.loadData();
    };

    refreshingData = () => {

        this.setState({
            isRefreshing: true,
        });
        this.loadData();

    }
    loadData = () => {

        let url = AppUrls.CAR_USER_CAR;
        carDropFramePage = 1;
        request(url, 'post', {
            car_status: '4',
            page: carDropFramePage,
            row: this.props.noLoadMore?5:10,

        }).then((response) => {

            carDropFrameData = response.mjson.data.list;
            carDropFrameStatus = response.mjson.data.status;
            if (carDropFrameData.length) {
                this.setState({
                    carData: this.state.carData.cloneWithRows(carDropFrameData),
                    isRefreshing: false,
                    renderPlaceholderOnly: 'success',
                    carDropFrameStatus: carDropFrameStatus,

                });

            } else {

                this.setState({
                    isRefreshing: false,
                    renderPlaceholderOnly: 'null',
                    carDropFrameStatus: carDropFrameStatus,

                });
            }

        }, (error) => {

            this.setState({
                isRefreshing: false,
                renderPlaceholderOnly: 'error',
            });

        });

    }

    loadMoreData = () => {

        let url = AppUrls.CAR_USER_CAR;
        carDropFramePage += 1;
        request(url, 'post', {
            car_status: '4',
            page: carDropFramePage,
            row: 10,

        }).then((response) => {

            carDropFrameStatus = response.mjson.data.status;
            let carData = response.mjson.data.list;
            if (carData.length) {
                for (let i = 0; i < carData.length; i++) {
                    carDropFrameData.push(carData[i]);
                }

                this.setState({
                    carData: this.state.carData.cloneWithRows(carDropFrameData),
                    carDropFrameStatus: carDropFrameStatus,
                });

            } else {

                this.setState({
                    carDropFrameStatus: carDropFrameStatus,
                });
            }

        }, (error) => {


        });
    }


    toEnd = () => {

        if(this.props.noLoadMore){
            return;
        }
        if (carDropFrameData.length && !this.state.isRefreshing && this.state.carDropFrameStatus != 2 )
        {
            this.loadMoreData();
        }

    };

    renderListFooter = () => {

        if(this.props.renderFootView){
            this.props.renderFootView();
            return null;
        }

        if (this.state.isRefreshing) {
            return null;
        } else {
            return (<ListFooter isLoadAll={this.state.carDropFrameStatus==1? false : true}/>)
        }
    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (
                <View style={styles.loadView}>
                    {this.loadView()}
                </View>);
        }
        return (

            <View style={styles.viewContainer}>
                {
                    this.state.carData &&
                    <ListView style={styles.listView}
                              dataSource={this.state.carData}
                              ref={'carListView'}
                              initialListSize={10}
                              removeClippedSubviews={false}
                              onEndReachedThreshold={1}
                              stickyHeaderIndices={[]}//仅ios
                              enableEmptySections={true}
                              scrollRenderAheadDistance={10}
                              pageSize={10}
                              renderFooter={this.renderListFooter}
                              onEndReached={this.toEnd}
                              renderRow={(rowData) =><MyCarCell carCellData={rowData} cellClick={this.props.carCellClick}/>}
                              refreshControl={
                                  <RefreshControl
                                      refreshing={this.state.isRefreshing}
                                      onRefresh={this.refreshingData}
                                      tintColor={[fontAndColor.COLORB0]}
                                      colors={[fontAndColor.COLORB0]}
                                  />}
                    />
                }
            </View>
        )
    }

}

const styles = StyleSheet.create({


    loadView: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: Pixel.getPixel(5),
    },
    viewContainer: {
        flex: 1,
        backgroundColor: fontAndColor.COLORA3
    },
    listView: {
        backgroundColor: fontAndColor.COLORA3,
        marginTop: Pixel.getPixel(5),
    },

})