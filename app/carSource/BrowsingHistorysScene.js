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
    InteractionManager
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../constant/fontAndColor';
import BaseComponent from '../component/BaseComponent';
import NavigationView from '../component/AllNavigationView';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import RepaymenyTabBar from '../finance/repayment/component/RepaymenyTabBar';
import NewBrowsingHistoryScene from './NewBrowsingHistoryScene';
import OldBrowsingHistoryScene from './OldBrowsingHistoryScene';
import CarInfoScene from './CarInfoScene';
import CarNewInfoScene from './CarNewInfoScene'
import  AllLoading from '../component/AllLoading';
import {request} from '../utils/RequestUtil';
import * as Urls from '../constant/appUrls';
let index = 0;
export  default class BrowsingHistorysScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            renderPlaceholderOnly: 'blank',
        };
    }


    initFinish = () => {
        this.setState({
            renderPlaceholderOnly: 'success',
        });
    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        }
        return (
            <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1}}>
                <ScrollableTabView
                    style={{marginTop: Pixel.getTitlePixel(64), flex: 1}}
                    initialPage={0}
                    locked={true}
                    onChangeTab={(obj) => {
                            index = obj.i;
                        }
                    }
                    renderTabBar={() => <RepaymenyTabBar tabName={['新车','二手车']}/>}
                >
                    {/*新车*/}
                    <NewBrowsingHistoryScene ref="new" tabLabel="ios-paper0"
                                             showToast={(str)=>{this.props.showToast(str)}}
                                             showModal={(obj)=>this.props.showModal(obj)}
                                             toNextPage={(id)=>{this.toNextPage({name:'CarNewInfoScene',component:CarNewInfoScene,params:{carID:id}})}}/>
                    {/*二手车*/}
                    <OldBrowsingHistoryScene ref="old" tabLabel="ios-paper1"
                                             showToast={(str)=>{this.props.showToast(str)}}
                                             showModal={(obj)=>this.props.showModal(obj)}
                                             toNextPage={(id)=>{this.toNextPage({name:'CarInfoScene',component:CarInfoScene,params:{carID:id}})}}/>

                </ScrollableTabView>
                <View style={{position: 'absolute',marginTop:Pixel.getPixel(54),flexDirection:'row'}}>
                    <View style={{flex:1}}></View>
                    <View
                        style={{backgroundColor:fontAndColor.COLORA3,height:Pixel.getPixel(20),width:Pixel.getPixel(1)}}/>
                    <View style={{flex:1}}></View>
                </View>
                <AllLoading callEsc={()=>{}} ref="allloading" callBack={()=>{
                        this.deleteAllCliiection();
                }}/>
                <NavigationView title='浏览历史' backIconClick={this.backPage}
                                renderRihtFootView={this._navigatorRightView}/>
            </View>
        );
    }

    deleteAllCliiection = () => {
        if (index == 0) {
            this.refs.new.deleteAllCliiection();
        } else if (index == 1) {
            this.refs.old.deleteAllCliiection();
        }
    }

    _navigatorRightView = () => {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={()=>{
            this.refs.allloading.changeShowType(true,'确认清空吗？');
        }}>
                <View style={{paddingVertical:3, paddingHorizontal:5,backgroundColor:'transparent'}}>
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

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor: fontAndColor.COLORA3}}>
                {this.loadView()}
                <NavigationView
                    title="浏览历史"
                    backIconClick={this.backPage}
                />
            </View>
        );
    }


}
const styles = StyleSheet.create({

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