/**
 * Created by zhengnan on 2017/8/17.
 */
import  React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    ListView,
    ScrollView,
    RefreshControl,
    InteractionManager,
    Image,
    NativeModules,
} from 'react-native';

import BaceComponent from '../component/BaseComponent';
import NavigatorView from '../component/AllNavigationView';
import CarInfoScene         from './CarInfoScene';
import CarMyListView from './znComponent/CarMyListView';


import * as fontAndColor from '../constant/fontAndColor';
import * as AppUrls from "../constant/appUrls";
import * as weChat from "react-native-wechat";
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
var ScreenWidth = Dimensions.get('window').width;


export default class CarMyListScene extends BaceComponent {

    render() {
        return (
            <View style={styles.rootContainer}>
                <CarMyListView carCellClick={this.carCellClick}/>
                {
                    this.state.isShowCarSharedView && <CarSharedView offClick={()=>{this.setState({isShowCarSharedView:false})}} carSharedBtnClick={this.carSharedBtnClick} isShowMore={false}/>
                }
                <NavigatorView title='我的车源' backIconClick={this.backPage} renderRihtFootView={this.renderRightFootView}/>
            </View>)

    }

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isShowCarSharedView:false,
        };
    }

    carCellClick = (carData) => {
        let navigatorParams = {
            name: "CarInfoScene",
            component: CarInfoScene,
            params: {
                carID: carData.id,
            }
        };
        this.toNextPage(navigatorParams);

    }



    /**
     * 分享界面-按钮事件
     * @param type
     */
    carSharedBtnClick=(type)=>{
       if(type=='微信好友'){

       }else {

       }
    }


    // 分享好友
    sharedWechatSession = (storeData) => {
        weChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    weChat.shareToSession({
                        type: 'news',
                        title: storeData.name,
                        description: storeData.content,
                        webpageUrl: storeData.url,
                        thumbImage: storeData.image,

                    }).catch((error) => {
                        this.props.showToast('分享失败');

                    })
                } else {
                    this.props.showToast('请安装微信');
                }
            });


    }

    // 分享朋友圈
    sharedWechatTimeline = (storeData) => {
        weChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    weChat.shareToTimeline({
                        type: 'news',
                        title: storeData.name,
                        description: storeData.content,
                        webpageUrl: storeData.url,
                        thumbImage: storeData.image,

                    }).catch((error) => {
                        this.props.showToast('分享失败');
                    })

                } else {
                    this.props.showToast('请安装微信');
                }
            });
    }



    renderRightFootView = () => {
        return (
            <TouchableOpacity onPress={()=>{
                this.setState({
                    isShowCarSharedView:true,
                });
            }}>
                <View style={{paddingVertical:3, paddingHorizontal:5,backgroundColor:'transparent',borderWidth:StyleSheet.hairlineWidth,borderColor:'white',borderRadius:3}}>
                    <Text allowFontScaling={false}  style={{
                        color: 'white',
                        fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                        textAlign: 'center',
                        backgroundColor: 'transparent',}}>分享</Text>
                </View>
            </TouchableOpacity>
        )
    }

}

class CarSharedView extends Component {

    render(){
        return(
            <TouchableOpacity style={styles.manageView} activeOpacity={1} onPress={this.props.offClick}>
                <View style={styles.sharedView}>
                    <View style={{flexDirection: 'row',paddingVertical:Pixel.getPixel(15)}}>
                        {
                            this.state.isShowMoreImageBtn && (
                                <TouchableOpacity style={styles.sharedItemView} onPress={() => {
                                    this.btnClick('多图分享');
                                }}>
                                    <View style={styles.sharedImageBack}>
                                        <Image source={require('../../images/carSourceImages/shareImgIcon.png')}/>
                                    </View>
                                    <Text allowFontScaling={false}  style={styles.sharedText}>多图分享</Text>
                                </TouchableOpacity>
                            )
                        }
                        <TouchableOpacity style={styles.sharedItemView} onPress={() => {
                            this.btnClick('微信好友');
                        }}>
                            <View style={styles.sharedImageBack}>
                                <Image source={require('../../images/carSourceImages/shared_wx.png')}/>
                            </View>
                            <Text allowFontScaling={false}  style={styles.sharedText}>微信好友</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sharedItemView} onPress={() => {
                            this.btnClick('朋友圈');
                        }}>
                            <View style={styles.sharedImageBack}>
                                <Image source={require('../../images/carSourceImages/shared_friend.png')}/>
                            </View>
                            <Text allowFontScaling={false}  style={styles.sharedText}>朋友圈</Text>
                        </TouchableOpacity>
                    </View>
                    <View  style={{justifyContent:'center',alignItems:'center',borderTopWidth:Pixel.getPixel(1),borderTopColor:fontAndColor.COLORA3,height:Pixel.getPixel(44),
                        width:ScreenWidth
                    }}>
                        <Text style={styles.sharedViewHeadText}>取消</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isShowMoreImageBtn:this.props.isShowMore,
        };
    }

    btnClick=(type)=>{
        this.props.carSharedBtnClick(type);
        this.props.offClick();
    }
}

const styles = StyleSheet.create({

    rootContainer: {

        flex: 1,
        backgroundColor: fontAndColor.COLORA3,
        paddingTop:Pixel.getTitlePixel(64),

    },
    ScrollableTabView: {

        marginTop: Pixel.getTitlePixel(64),
        marginBottom:Pixel.getPixel(44),
    },
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
    },footBtn:{
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
    manageView:{
        left: 0,
        right: 0,
        bottom: 0,
        top:0,
        position: 'absolute',
        backgroundColor: 'rgba(1,1,1,0.5)',
    },
    sharedView: {
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',

    },
    sharedViewHead: {
        height: Pixel.getPixel(44),
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: ScreenWidth
    },
    sharedViewHeadText: {
        color: fontAndColor.COLORA1,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
    },
    sharedImageBack:{
        backgroundColor:fontAndColor.COLORB9,
        borderRadius:Pixel.getPixel(10),
        width:Pixel.getPixel(50),
        height:Pixel.getPixel(50),
        justifyContent:'center',
        alignItems:'center'
    },
    sharedItemView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: Pixel.getPixel(20),
        marginRight: Pixel.getPixel(20),
        marginTop: Pixel.getPixel(10),
        marginBottom: Pixel.getPixel(10),
    },
    sharedText: {
        color: fontAndColor.COLORA1,
        textAlign: 'center',
        marginTop: Pixel.getPixel(10),
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
    },

})
