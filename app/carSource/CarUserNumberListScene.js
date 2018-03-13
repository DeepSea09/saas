/**
 * Created by zhengnan on 2017/11/8.
 */
import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    TextInput,
    ScrollView,
    ListView,
    RefreshControl

} from 'react-native';

import BaseComponent from '../component/BaseComponent';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import RepaymenyTabBar from '../finance/repayment/component/RepaymenyTabBar';
import CarNewNumberCell from './znComponent/CarNewNumberCell';
import ListFooter           from './znComponent/LoadMoreFooter';



import * as AppUrls from "../constant/appUrls";
import  {request}           from '../utils/RequestUtil';
import * as fontAndColor from '../constant/fontAndColor';
import PixelUtil from '../utils/PixelUtil';
import StockManagementScene from "./carPublish/StockManagementScene";
import CarPublishFirstScene from "./carPublish/CarPublishFirstScene";
import CarDealInfoScene from "./CarDealInfoScene";
const Pixel = new PixelUtil();
const ScreenWidth = Dimensions.get('window').width;

let carUpperFrameData = [];
let carDropFrameData = [];

let carUpperFramePage = 1;
let carUpperFrameStatus = 1;

let carDropFramePage = 1;
let carDropFrameStatus = 1;

let carSeekStr  = '';

export default class CarUserNumberListScene extends BaseComponent {
    render(){

        return(
            <View style={styles.rootContainer}>
                <CarSeekView carSeekAction={this.carSeekAction}/>
                <ScrollableTabView
                    style={styles.ScrollableTabView}
                    initialPage={this.props.page?this.props.page:0}
                    locked={true}
                    renderTabBar={this.renderTabBarView}>
                    <MyCarSourceUpperFrameView ref="upperFrameView"
                                               cellFootBtnClick={this.cellFootBtnClick}
                                               tabLabel="ios-paper1"
                                               setHeadView={this.setHeadView}
                                               showToast={this.props.showToast}/>

                    <MyCarSourceDropFrameView  ref="dropFrameView"
                                               tabLabel="ios-paper2"
                                               setHeadView={this.setHeadView}
                                               showToast={this.props.showToast}/>
                </ScrollableTabView>
                <TouchableOpacity style={styles.footBtn} onPress={this.pushCarScene}>
                    <Text style={styles.footBtnText}>车辆入库</Text>
                </TouchableOpacity>
            </View>
        )
    }

    // 构造
    constructor(props) {
        super(props);
        // 初始状态

        carSeekStr  = '';
        this.state = {
            shelves_count:0,
            sold_count:0,
        };
    }

    renderTabBarView=()=>{
        return(
            <RepaymenyTabBar ref={(ref)=>{this.tabBarView = ref}}
                             style={{backgroundColor:'white'}}
                             tabName={["在售 ("+this.state.shelves_count+")", "已售 ("+this.state.sold_count+')']}/>
        )
    }

    setHeadView=(shelves_count,sold_count)=>{

        this.state.shelves_count = shelves_count;
        this.state.sold_count = sold_count;
        this.tabBarView.setTabName(["在售 ("+this.state.shelves_count+")", "已售 ("+this.state.sold_count+')']);
    }


    carSeekAction=(seekStr)=>{
        carSeekStr=seekStr;
        this.refs.upperFrameView && this.refs.upperFrameView.initFinish();
        this.refs.dropFrameView && this.refs.dropFrameView.initFinish();
    }

    pushCarScene=()=>{
        let navigatorParams = {
            name: "CarPublishFirstScene",
            component: CarPublishFirstScene,
            params: {
            }
        };
        this.props.toNextPage(navigatorParams);
    }

    cellFootBtnClick=(btnTitle,carData)=>{
        this.carData = carData;
        if(btnTitle=='编辑'){
            if(carData.in_valid_order==1){
                this.props.showToast('该车辆在有效订单中,不可操作编辑');
                return;
            }
            let navigatorParams = {
                name: "CarPublishFirstScene",
                component: CarPublishFirstScene,
                params: {

                    carUserNumberListLoadAction:this.loadHeadData,
                    carID: carData.id,
                }
            };
            this.props.toNextPage(navigatorParams);

        }else {

            if(carData.in_valid_order==1){
                this.props.showToast('该车辆在有效订单中,不可操作已售');
                return;
            }
            let navigatorParams = {

                name: "CarDealInfoScene",
                component: CarDealInfoScene,
                params: {
                    refreshDataAction:this.loadHeadData,
                    carID:carData.id,
                }
            };
            this.props.toNextPage(navigatorParams);
        }
    }

    loadHeadData=()=>{
        this.refs.upperFrameView && this.refs.upperFrameView.initFinish();
        this.refs.dropFrameView && this.refs.dropFrameView.initFinish();
    }
}

class MyCarSourceUpperFrameView extends BaseComponent {

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
            loadingMarginTop:Pixel.getPixel(64)

        };
    }

    componentDidMount() {
        this.setState({renderPlaceholderOnly: 'loading'});
        this.initFinish();
    }

    initFinish = () => {
        this.setState({renderPlaceholderOnly: 'loading'});
        this.loadData();
    };
    allRefresh=()=>{
        this.setState({renderPlaceholderOnly: 'loading'});
        this.loadData();
    }
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
            row: 10,
            type:1,
            search_text:carSeekStr,

        }).then((response) => {

            carUpperFrameData=response.mjson.data.list;
            carUpperFrameStatus = response.mjson.data.status;

            this.props.setHeadView(response.mjson.data.total.shelves_count,response.mjson.data.total.sold_count);

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
            type:1,
            search_text:carSeekStr,


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

        if (carUpperFrameData.length && !this.state.isRefreshing && carUpperFrameStatus != 2) {
            this.loadMoreData();
        }

    };

    renderListFooter = () => {

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
                        renderSeparator={this.renderSeperator}
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

    cellFootBtnClick=(btnTitle,carData)=>{
        this.props.cellFootBtnClick(btnTitle,carData);
    }

    renderRow =(rowData)=>{

        return(
            <CarNewNumberCell carData={rowData} type={1} carType={2}  footBtnClick={this.cellFootBtnClick} />
        )
    }
    renderSeperator=(sectionID, rowID, adjacentRowHighlighted)=>{
        return(
            <View
                key={`${sectionID}-${rowID}`}
                style={{
                    height:Pixel.getFontPixel(10),
                    backgroundColor: fontAndColor.COLORA3,
                }}
            />
        )
    }

}

class MyCarSourceDropFrameView extends BaseComponent {

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
            search_text:carSeekStr,
            loadingMarginTop:Pixel.getPixel(64)


        };
    }

    componentDidMount() {
        // InteractionManager.runAfterInteractions(() => {
        this.setState({renderPlaceholderOnly: 'loading'});
        this.initFinish();
        // });
    }


    initFinish = () => {
        this.setState({renderPlaceholderOnly: 'loading'});
        this.loadData();
    };
    allRefresh=()=>{
        this.setState({renderPlaceholderOnly: 'loading'});
        this.loadData();
    }
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
            row: 10,
            type:1,
            search_text:carSeekStr,


        }).then((response) => {

            carDropFrameData = response.mjson.data.list;
            carDropFrameStatus = response.mjson.data.status;

            this.props.setHeadView(response.mjson.data.total.shelves_count,response.mjson.data.total.sold_count);

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
            type:1,
            search_text:carSeekStr,

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

        if (carDropFrameData.length && !this.state.isRefreshing && this.state.carDropFrameStatus != 2) {
            this.loadMoreData();
        }

    };

    renderListFooter = () => {

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
                              renderRow={(rowData) => <CarNewNumberCell carData={rowData} type={2} carType={2}/>}
                              renderSeparator={this.renderSeperator}
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
    renderSeperator=(sectionID, rowID, adjacentRowHighlighted)=>{
        return(
            <View
                key={`${sectionID}-${rowID}`}
                style={{
                    height:Pixel.getFontPixel(10),
                    backgroundColor: fontAndColor.COLORA3,
                }}
            />
        )
    }

}

class CarSeekView extends Component {
    render(){
        return(
            <View style={styles.carSeekView}>
                <View>
                    <View style={styles.navigatorSousuoView}>
                        <Image
                            source={require('../../images/carSourceImages/sousuoicon.png')}/>
                        <TextInput
                            allowFontScaling={false}
                            underlineColorAndroid='transparent'
                            style={styles.navigatorSousuoText}
                            placeholder={'请输入车型关键词或车架号'}
                            defaultValue={carSeekStr}
                            placeholderTextColor={fontAndColor.COLORA1}
                            onChangeText={(text)=>{this.props.carSeekAction(text)}}/>
                    </View>
                </View>
            </View>
        )
    }
}


const  styles = StyleSheet.create({
    rootContainer: {

        flex: 1,
        backgroundColor: fontAndColor.COLORA3,
    },
    navigatorSousuoView: {
        height: Pixel.getPixel(30),
        borderRadius: 5,
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        width:ScreenWidth - Pixel.getPixel(30)
    },
    navigatorSousuoText: {

        color: fontAndColor.COLORA0,
        height: Pixel.getPixel(30),
        width:ScreenWidth - Pixel.getPixel(130),
        textAlign: 'center',
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        backgroundColor: 'white'

    },
    carSeekView:{
        backgroundColor:fontAndColor.COLORA3,
        height:Pixel.getPixel(47),
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    viewContainer:{
        marginBottom:Pixel.getBottomPixel(44),
        backgroundColor:fontAndColor.COLORA3,
        flex:1,
    },
    footBtn:{
        left:0,
        bottom:0,
        right:0,
        backgroundColor:fontAndColor.COLORB0,
        justifyContent:'center',
        alignItems:'center',
        position: 'absolute',
        height:Pixel.getPixel(44),
    },
    footBtnText:{
        textAlign:'center',
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT),
        color:'white',
    },
    loadView:{
        flex:1,
        backgroundColor:'white'
    }
});