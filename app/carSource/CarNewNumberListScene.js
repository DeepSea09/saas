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
    RefreshControl,
    Modal,

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
import  AllLoading from '../component/AllLoading';
import NewCarPublishFirstScene from "./carPublish/NewCarPublishFirstScene";
import SelectCarSourceView from './znComponent/SelectCarSourceView';


const Pixel = new PixelUtil();
const ScreenWidth = Dimensions.get('window').width;

let carUpperFrameData = [];
let carDropFrameData = [];

let carUpperFramePage = 1;
let carUpperFrameStatus = 1;

let carDropFramePage = 1;
let carDropFrameStatus = 1;

let carSeekStr = '';

export default class CarNewNumberListScene extends BaseComponent {
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
                                               tabLabel="ios-paper1"
                                               carData={this.props.carData}
                                               cellClick={this.cellClick}
                                               setHeadView={this.setHeadView}
                                               showToast={this.props.showToast}/>

                    <MyCarSourceDropFrameView  ref="dropFrameView"
                                               tabLabel="ios-paper2"
                                               carData={this.props.carData}
                                               setHeadView={this.setHeadView}
                                               showToast={this.props.showToast}/>
                </ScrollableTabView>
                <TouchableOpacity style={styles.footBtn} onPress={this.pushNewCarScene}>
                    <Text style={styles.footBtnText}>车辆入库</Text>
                </TouchableOpacity>
                <AllLoading callEsc={()=>{this.carSoldOut(2);}}
                            ref={(modal) => {this.allloading = modal}}
                            callBack={()=>{this.carSoldOut(1);}}
                            canColse="false"
                            showDelete={true}
                            callEscText="否"
                            callBackText="是"/>
                <SelectCarSourceView ref={(ref)=>{this.SelectCarSourceView = ref}} selectCarAction={this.selectAction} pushNewCarAction = {this.pushNewCarAction}/>
            </View>
        )
    }



    // 构造
    constructor(props) {
        super(props);
        // 初始状态

        carSeekStr  = '';
        this.state = {
            total_on_sale:0,
            total_sold:0,
        };
    }

    renderTabBarView=()=>{
        return(
            <RepaymenyTabBar ref={(ref)=>{this.tabBarView = ref}}
                             style={{backgroundColor:'white'}}
                             tabName={["在售 ("+this.state.total_on_sale+")", "已售 ("+this.state.total_sold+')']}/>
        )
    }

    setHeadView=(total_on_sale,total_sold)=>{

       this.state.total_on_sale = total_on_sale;
       this.state.total_sold = total_sold;
        this.tabBarView.setTabName(["在售 ("+this.state.total_on_sale+")", "已售 ("+this.state.total_sold+')']);
    }

    carSeekAction=(seekStr)=>{
        carSeekStr=seekStr;
        this.refs.upperFrameView && this.refs.upperFrameView.initFinish();
        this.refs.dropFrameView && this.refs.dropFrameView.initFinish();
    }

    pushNewCarScene=()=>{

        if(this.props.carData){
            let navigatorParams = {
                name: "StockManagementScene",
                component: StockManagementScene,
                params: {
                    carData:this.props.carData,
                    refreshingData:this.loadHeadData,
                }
            };
            this.props.toNextPage(navigatorParams);
        }else {
            this.SelectCarSourceView.setVisible(true);
        }

    }

    selectAction=(carData)=>{
        let navigatorParams = {
            name: "StockManagementScene",
            component: StockManagementScene,
            params: {
                carData:carData,
                refreshingData:this.loadHeadData,

            }
        };
        this.props.toNextPage(navigatorParams);
    }

    pushNewCarAction=()=>{
        let navigatorParams = {
            name: "NewCarPublishFirstScene",
            component: NewCarPublishFirstScene,
            params: {

            }
        };
        this.props.toNextPage(navigatorParams);
    }

    carSoldOut=(type)=>{

        this.props.showModal(true);
        request(AppUrls.CAR_STOCK_SOLD_OUT, 'post', {
            id:this.cellData.id,
            flag:type
        }).then((response) => {

            this.props.showModal(false);
            this.props.showToast('成功出库');
            this.loadHeadData();

        }, (error) => {
           this.props.showToast(error.mjson.msg);
        });
    }

    cellClick=(btnTitle,cellData)=>{

        this.cellData = cellData;
        if(btnTitle=='编辑'){
            let navigatorParams = {

                name: "StockManagementScene",
                component: StockManagementScene,
                params: {
                    carData:cellData,
                    refreshingData:this.loadHeadData,
                    dataID:cellData.id
                }
            };
            this.props.toNextPage(navigatorParams);

        }else {

            let carNumber = parseFloat(cellData.stock)-parseFloat(cellData.reserve_num);
            if(carNumber <=0)
            {
                this.carSoldOut(1);

            }else if(carNumber>=1 || !cellData.reserve_num)
            {
                this.allloading.changeShowType(true,'确定是否将该车源可售车辆数-1');
            }
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
        const carData = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});
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

        let url = AppUrls.CAR_STOCK_LIST;
        carUpperFramePage = 1;
        request(url, 'post', {
            status: '1',
            page: carUpperFramePage,
            pageCount: 10,
            auto_id: this.props.carData ? this.props.carData.id :'',
            search_text:carSeekStr,
        }).then((response) => {

            carUpperFrameData=response.mjson.data.list;

            if(carUpperFrameData.length>=response.mjson.data.total_on_sale)
            {
                carUpperFrameStatus = 2;
            }
            this.props.setHeadView(response.mjson.data.total_on_sale,response.mjson.data.total_sold);

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
            this.props.showToast(error.mjson.msg);
            this.setState({
                isRefreshing: false,
                renderPlaceholderOnly: 'error',
            });

        });

    }

    loadMoreData = () => {

        let url = AppUrls.CAR_STOCK_LIST;
        carUpperFramePage += 1;
        request(url, 'post', {
            status: '1',
            page: carUpperFramePage,
            pageCount: 10,
            auto_id: this.props.carData ? this.props.carData.id :'',
            search_text:carSeekStr,

        }).then((response) => {
            let carData = response.mjson.data.list;
            if (carData.length) {
                for (let i = 0; i < carData.length; i++) {
                    carUpperFrameData.push(carData[i]);
                }

                if(carUpperFrameData.length>=response.mjson.data.total_on_sale)
                {
                    carUpperFrameStatus = 2;
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
                <View style={[styles.loadView,{justifyContent:'space-between'}]}>
                    {this.loadView()}
                </View>);
        }
        return (

            <View style={styles.viewContainer}>
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
            </View>
        )
    }

    cellFootBtnClick=(btnTitle,carData)=>{

        this.props.cellClick(btnTitle,carData);

    }

    renderRow =(rowData)=>{

        return(
            <CarNewNumberCell carData={rowData} type={1} carType={1}  footBtnClick={this.cellFootBtnClick}/>
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

        const carData = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});
        this.state = {

            carData: carData,
            isRefreshing: true,
            carDropFrameStatus: carDropFrameStatus,
            renderPlaceholderOnly: 'blank',
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

        let url = AppUrls.CAR_STOCK_LIST;
        carDropFramePage = 1;
        request(url, 'post', {
            status: '2',
            page: carDropFramePage,
            pageCount: 10,
            auto_id: this.props.carData ? this.props.carData.id :'',
            search_text:carSeekStr,

        }).then((response) => {

            carDropFrameData = response.mjson.data.list;
            if(carDropFrameData.length>=response.mjson.data.total_sold)
            {
                carDropFrameStatus = 2;
            }

            this.props.setHeadView(response.mjson.data.total_on_sale,response.mjson.data.total_sold);

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
            this.props.showToast(error.mjson.msg);

        });

    }

    loadMoreData = () => {

        let url = AppUrls.CAR_STOCK_LIST;
        carDropFramePage += 1;
        request(url, 'post', {
            status: '2',
            page: carDropFramePage,
            pageCount: 10,
            auto_id: this.props.carData ? this.props.carData.id :'',
            search_text:carSeekStr,

        }).then((response) => {

            let carData = response.mjson.data.list;
            if (carData.length) {
                for (let i = 0; i < carData.length; i++) {
                    carDropFrameData.push(carData[i]);
                }
                if(carDropFrameData.length>=response.mjson.data.total_sold)
                {
                    carDropFrameStatus = 2;
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
                              renderRow={(rowData) => <CarNewNumberCell carData={rowData} type={2} carType={1}/>}
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
                        <Image source={require('../../images/carSourceImages/sousuoicon.png')}/>
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
    footBtn:{
        left:0,
        right:0,
        position: 'absolute',
        bottom:0,
        backgroundColor:fontAndColor.COLORB0,
        justifyContent:'center',
        alignItems:'center',
        height:Pixel.getPixel(44),
    },
    footBtnText:{
        textAlign:'center',
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT),
        color:'white',
    },
    listView:{
        backgroundColor: fontAndColor.COLORA3,

    },
    viewContainer: {
        flex: 1,
        backgroundColor: fontAndColor.COLORA3,
        marginBottom:Pixel.getPixel(44)
    },
    loadView:{
        flex:1,
        backgroundColor:'white'
    }
});