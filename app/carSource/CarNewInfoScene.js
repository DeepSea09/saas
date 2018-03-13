/**
 * Created by zhengnan on 2017/11/3.
 */
import React, {Component,PropTypes} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    Linking,
    InteractionManager,
    Dimensions,
    Modal,
    NativeModules,
    DeviceEventEmitter,

} from 'react-native';

import *as fontAndColor from '../constant/fontAndColor';
import ImagePageView from 'react-native-viewpager';
import BaseComponent from '../component/BaseComponent';
import NavigationView from '../component/CarNavigationView';
import AllNavigationView from '../component/AllNavigationView';
import Gallery from 'react-native-gallery';
import CarZoomImageScene from './CarZoomImagScene';
import AutoConfig from  '../publish/AutoConfig';
import {CarConfigurationView}   from './znComponent/CarInfoAllComponent';
import *as weChat from 'react-native-wechat';
import PixelUtil from '../utils/PixelUtil';
import StorageUtil from "../utils/StorageUtil";
import * as StorageKeyNames from "../constant/storageKeyNames";
import AccountModal from '../component/AccountModal'
import AccountManageScene from '../mine/accountManage/AccountTypeSelectScene'
import BindCardScene from '../mine/accountManage/BindCardScene'
import WaitActivationAccountScene from '../mine/accountManage/WaitActivationAccountScene'
import ProcurementOrderDetailScene from "../mine/myOrder/ProcurementOrderDetailScene";
import ProcurementOrderDetailSceneOld from "../mine/myOrderOld/ProcurementOrderDetailScene";
import CarMyListScene from "./CarMyListScene";
import GetPermissionUtil from '../utils/GetRoleUtil';
import CarCell from './znComponent/CarCell';
let Platform = require('Platform');
let getRole = new GetPermissionUtil();
const Pixel = new PixelUtil();
import ExplainModal from "../mine/myOrder/component/ExplainModal";
import  StringTransformUtil from  "../utils/StringTransformUtil";
let stringTransform = new StringTransformUtil();
import {request} from "../utils/RequestUtil";
import * as AppUrls from "../constant/appUrls";

var ScreenWidth = Dimensions.get('window').width;
let resolveAssetSource = require('resolveAssetSource');
const IS_ANDROID = Platform.OS === 'android';
var shareClass = NativeModules.ZNShareClass;


let carConfigurationData = [];

export default class CarNewInfoScene extends BaseComponent {


    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            imageArray: new ImagePageView.DataSource({pageHasChanged: (r1, r2) => r1 !== r2}),
            renderPlaceholderOnly: 'blank',
            residualsData: [],
            carData: {imgs: []},
            currentImageIndex: 1,
            switchoverCarInfo: 0,
            carConfigurationBriefData:[],
            carDetailData:[],
        };
    }

    initFinish = () => {
        carConfigurationData = [];
        this.isUserBoss = false;

        StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data) => {
            if (data.code == 1 && data.result != '') {
                let enters = JSON.parse(data.result);
                for (let item of enters.enterprise_list[0].role_type){
                    if(item ==1 || item==6){
                        this.isUserBoss = true;
                        break;
                    }
                }
            }
            getRole.getRoleList((data)=>{
                this.roleList = data;
                this.loadData(this.props.carID);
            });
        });

    }

    allRefresh=()=>{
        this.loadData(this.props.carID);
    }

    loadData = (carID) => {


        /*        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
         if (data.code == 1 && data.result != '') {
         let enters = JSON.parse(data.result);
         this.loadCarData(enters.company_base_id);

         } else {
         this.loadCarData('');
         }
         });*/



        StorageUtil.mGetItem(StorageKeyNames.ENTERPRISE_LIST, (data) => {
            if (data.code == 1 && data.result != '') {
                let enters = JSON.parse(data.result);
                let company_base_ids = '';
                for (let index in enters) {
                    company_base_ids = company_base_ids + enters[index].enterprise_uid;
                    if (enters.length > index + 1) {
                        company_base_ids = company_base_ids + ',';
                    }
                }
                //console.log('enters=-=-=-=--=',company_base_ids);
                this.loadCarData(company_base_ids,carID);
            } else {
                this.loadCarData('',carID);
            }
        });


    }

    loadCarData = (show_shop_id,carID) => {

        request(AppUrls.CAR_DETAIL, 'post', {
            id: carID,
            imgType: 1,
            shop_ids: show_shop_id,
        }).then((response) => {

            let carData = response.mjson.data;
            this.loadCarResidualsData(carData);
            this.loadCarConfigurationData(carData);
            this.loadCarDetailData(carData);
            if (carData.imgs.length <= 0) {

                carData.imgs = [{require: require('../../images/carSourceImages/car_info_null.png')}];
            }

            for(let item of this.roleList)
            {
                if((item.name =='手续员'||item.name =='评估师'||item.name =='整备员'||item.name =='经理'||item.name =='运营专员'||item.name =='合同专员'||item.name =='车管专员') && !this.isUserBoss)
                {
                    carData.show_order = 2;
                    break;
                }
            }

            carData.infoData = [
                {
                title:'车规',
                value: carData.first_type &&(carData.first_type+(carData.second_type?('('+carData.second_type+')'):'')),
                },
                {
                title:'颜色(车身/内饰)',
                value:carData.car_color.split("|")[0] + '/' + carData.trim_color.split("|")[0],
                },
                {
                title:'是否现车',
                value:carData.is_cargo==1?('有现车'):('无现车'),
                },
                {
                title:'手续备注',
                value:carData.procedure_desc,
                },
                {
                title:'配置改装说明',
                value:carData.modification_instructions,
                },
            ];

            this.setState({
                carData: carData,
                imageArray: this.state.imageArray.cloneWithPages(carData.imgs),
                renderPlaceholderOnly: 'success'
            });

        }, (error) => {
            this.setState({renderPlaceholderOnly: 'error'});
        });
    }


    loadCarResidualsData = (carData) => {

        request(AppUrls.CAR_GET_RESIDUALS, 'post', {
            id: carData.id,
            mile: carData.mileage,
            modelId: carData.model_id,
            regDate: stringTransform.dateReversal(carData.init_reg + '000'),
            zone: carData.city_id,

        }).then((response) => {

            if (response.mycode == 1) {
                this.setState({
                    residualsData: response.mjson.data,
                })
            }
        }, (error) => {
        });
    }



    loadCarConfigurationData=(carData)=>{
        request(AppUrls.CAR_CONFIGURATION,'post',{
            model_id:carData.model_id,
        }).then((response) => {
            if(response.mycode==1){

                carConfigurationData = response.mjson.data;
                let array = carConfigurationData[0].data;
                let newArray = [];
                for(let i=0;i<5;i++)
                {
                    newArray.push(array[i]);
                }
                let newData = [{title:carConfigurationData[0].title,data:newArray}];
                this.setState({
                    carConfigurationBriefData:newData
                });

            }
        }, (error) => {

        });
    }

    loadCarDetailData=(carData)=>{
        request(AppUrls.CAR_DETAIL_RELATION,'post',{
            id:carData.id,
        }).then((response) => {

            if(response.mycode==1){
               this.setState({
                   carDetailData:response.mjson.data.list
               });
            }
        }, (error) => {

        });
    }




    render() {

        if (this.state.renderPlaceholderOnly !== 'success') {
            return (
                <View style={{flex: 1, backgroundColor: 'white'}}>
                    {this.loadView()}
                    <AllNavigationView
                        title="车源详情"
                        backIconClick={this.backIconClick}
                    />
                </View>);
        }

        const carData = this.state.carData;

        return (
            <View ref="carInfoScene" style={{flex: 1, backgroundColor: 'white'}}>

                <ScrollView style={{marginBottom: Pixel.getPixel(44), backgroundColor: fontAndColor.COLORA3}}
                            scrollEventThrottle={200}
                            automaticallyAdjustContentInsets={false}
                            onScroll={this.setNavitgationBackgroundColor}
                >
                    <ImagePageView
                        dataSource={this.state.imageArray}    //数据源（必须）
                        renderPage={this.renderImagePage}     //page页面渲染方法（必须）
                        isLoop={this.state.carData.imgs.length > 1 ? true : false}                        //是否可以循环
                        autoPlay={false}                      //是否自动
                        locked={false}                        //为true时禁止滑动翻页
                        renderPageIndicator={(index) => {
                            return (
                                <View style={styles.imageFootView}>
                                    {/*<View style={styles.carAgeView}>*/}
                                        {/*<Text allowFontScaling={false}*/}
                                              {/*style={styles.carAgeText}>{carData.v_type == 1 ? '车龄 ' + carData.init_coty : carData.v_type_str}</Text>*/}
                                    {/*</View>*/}
                                    <View style={styles.carAgeView}>
                                    <Text allowFontScaling={false}
                                          style={styles.imageIndexText}>{this.state.currentImageIndex + '/' + this.state.carData.imgs.length}</Text>
                                    </View>
                                </View>
                            )
                        }}
                        onChangePage={(index) => {

                            this.setState({
                                currentImageIndex: index + 1,
                            });

                        }}/>
                    <View style={styles.contentContainer}>
                        <View style={styles.contentView}>
                            <Text allowFontScaling={false}  style={styles.titleText}>{carData.model_name}</Text>
                            {
                                <View style={styles.titleFootView}>
                                    {
                                        carData.dealer_price > 0 ? (
                                            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                                                <Text allowFontScaling={false}
                                                      style={styles.priceText}>{stringTransform.carMoneyChange(carData.dealer_price) + '万'}  </Text>
                                                {
                                                    carData.model_price &&
                                                    ( <Text style={styles.browseText}>{stringTransform.carMoneyChange(carData.model_price) + '万'}</Text>)
                                                }
                                            </View>
                                        ):(<View/>)
                                    }
                                    <View style={styles.browseView}>
                                        <Text allowFontScaling={false}  style={styles.browseText}>{carData.stock + '辆在售'}</Text>
                                    </View>
                                </View>
                            }
                            <View style={{borderTopWidth:Pixel.getPixel(1),borderTopColor:fontAndColor.COLORA3,marginTop:Pixel.getPixel(10),paddingTop:Pixel.getPixel(10)}}>
                                <Text style={{color:fontAndColor.COLORA1, fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}}>{carData.enterprise_name}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.carIconsContainer}>
                        <View style={styles.carIconsView}>
                            <View style={{marginTop: Pixel.getPixel(10),paddingHorizontal:Pixel.getPixel(15),backgroundColor:'white'}}>
                                <TitleView title={'车辆信息'}/>
                            </View>
                            {
                                carData.infoData.map((data,index)=>{

                                    return(

                                            data.value?(
                                                <View style={{borderTopColor:fontAndColor.COLORA3,borderTopWidth:Pixel.getPixel(1),
                                                width:ScreenWidth,flexDirection:'row',justifyContent:'space-between',
                                                alignItems:'center',paddingVertical:Pixel.getPixel(10),paddingHorizontal:Pixel.getPixel(15)
                                            }} key={index}>
                                                <Text style={{color:fontAndColor.COLORA1,
                                                    fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),}}>{data.title}</Text>
                                                <Text style={[{color:fontAndColor.COLORA0,
                                                    fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28)},data.value.length>30 && {width:ScreenWidth-Pixel.getPixel(135)}]}>{data.value}</Text>
                                            </View>):(null)


                                    )
                                })
                            }
                        </View>
                        <View style={{marginTop: Pixel.getPixel(10),paddingHorizontal:Pixel.getPixel(15),backgroundColor:'white'}}>
                            <TitleView title={'配置信息'} footTitle={'更多'} clickAction={this.pushCarConfigScene}/>
                        </View>
                        {
                            this.state.carConfigurationBriefData.length>0 && (
                                <CarConfigurationView carConfigurationData={this.state.carConfigurationBriefData}
                                                      modelID ={carData.modelID}/>
                            )
                        }{
                        this.state.carDetailData.length>0 && (
                            <View style={{marginTop:Pixel.getPixel(10),backgroundColor:'white'}}>
                                <View style={{paddingHorizontal:Pixel.getPixel(15),backgroundColor:'white'}}>
                                    <TitleView title={'相关推荐'} footTitle={'更多'} clickAction={this.pushCarMoreScene}/>
                                </View>
                                {
                                    this.state.carDetailData.map((data,index)=>{
                                        return(
                                            <CarCell style={styles.carCell} carCellData={data} isNewCar={true} onPress={()=> this.carCellOnPres(data.id)} key={index}/>
                                        )
                                    })
                                }
                            </View>
                        )
                    }

                    </View>
                </ScrollView>
                <View style={styles.footView}>
                    {
                        (carData.status==3 || carData.del==1) ?
                            (
                                <View style={{flex:1, alignItems:'center',justifyContent:'center',backgroundColor:fontAndColor.COLORA4,height:Pixel.getPixel(44)}}>
                                    <Text style={{fontSize:Pixel.getFontPixel(fontAndColor.BUTTONFONT30),color:'white',textAlign:'center'
                                    }}>该车辆已经下架啦~</Text>
                                </View>
                            ):
                            (
                                <View style={{flex:1,justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
                                    <View style={[styles.carNumberView, carData.show_order == 2 && {width: ScreenWidth / 2}]}>
                                        <Text allowFontScaling={false}  style={styles.carNumberText}>车源编号</Text>
                                        <Text allowFontScaling={false}  style={styles.carNumberText}>{carData.serial_num}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => {
                                        this.callClick(carData.show_shop_id)
                                    }}>
                                        <View style={[styles.callView, carData.show_order == 2 && {width: ScreenWidth / 2}]}>
                                            <Image source={require('../../images/carSourceImages/phoneIcon.png')}/>
                                            <Text allowFontScaling={false}  style={styles.callText}>电话咨询</Text>
                                        </View>
                                    </TouchableOpacity>
                                    {
                                        carData.show_order !== 2 && (
                                            <TouchableOpacity style={styles.orderView} onPress={() => {
                                                this.orderClick(carData)
                                            }}>
                                                <Text allowFontScaling={false}  style={styles.orderText}>订购</Text>
                                            </TouchableOpacity>
                                        )
                                    }
                                </View>
                            )
                    }
                </View>
                <NavigationView
                    ref="navtigation"
                    wrapStyle={{backgroundColor: 'rgba(0,0,0,0)'}}
                    title="车源详情"
                    backIconClick={this.backIconClick}
                    isStore={this.state.carData.is_collection == 0 ? false : true} addStoreAction={this.addStoreAction}
                    cancelStoreAction={this.cancelStoreAction} showShared={this.showShared}
                />
                <PhotoView ref="photoView"/>
                <SharedView ref="sharedView" carData={this.state.carData}/>
                <CallView ref={(ref) => {
                    this.CallView = ref
                }}/>
                <AccountModal ref="accountmodal"/>
                <ExplainModal ref={(text) => this.expModal = text} title='说明' buttonStyle={styles.expButton}
                              textStyle={styles.expText}
                              text='知道了'
                              content='此质押车暂不可下单请您稍待时日再订购'/>
            </View>

        )
    }


    backIconClick = () => {

        this.backPage();
    };



    // 下订单
    orderClick = (carData) => {

        if (carData.show_order == 1) {
            this.props.showToast('该车辆已被订购');

        } else {
            StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
                if (data.code == 1) {
                    let datas = JSON.parse(data.result);
                    let maps = {
                        enter_base_ids: datas.company_base_id,
                        child_type: '1'
                    };
                    this.props.showModal(true);
                    request(AppUrls.USER_ACCOUNT_INFO, 'Post', maps)
                        .then((response) => {
                                this.props.showModal(false);
                                if (response.mjson.data.account.length == 0) {
                                    this.props.showToast('请您先开通平台账户');
                                } else {
                                    lastType = response.mjson.data.account.status;
                                    let navigatorParams = {
                                        name: '',
                                        component: '',
                                        params: {
                                            callBack: () => {
                                            }
                                        }
                                    };
                                    if (lastType == '0') {

                                        navigatorParams.name = 'AccountManageScene';
                                        navigatorParams.component = AccountManageScene;
                                        this.refs.accountmodal.changeShowType(true,
                                            '您还未开通资金账户，为方便您使用金融产品及购物车，' +
                                            '请尽快开通！', '去开户', '看看再说', () => {
                                                this.toNextPage(navigatorParams);
                                            });

                                    } else if (lastType == '1') {
                                        navigatorParams.name = 'BindCardScene';
                                        navigatorParams.component = BindCardScene;
                                        this.refs.accountmodal.changeShowType(true,
                                            '您的资金账户还未绑定银行卡，为方便您使用金融产品及购物车，请尽快绑定。'
                                            , '去绑卡', '看看再说', () => {
                                                this.toNextPage(navigatorParams);
                                            });

                                    } else if (lastType == '2') {
                                        navigatorParams.name = 'WaitActivationAccountScene';
                                        navigatorParams.component = WaitActivationAccountScene;
                                        this.refs.accountmodal.changeShowType(true,
                                            '您的账户还未激活，为方便您使用金融产品及购物车，请尽快激活。'
                                            , '去激活', '看看再说', () => {
                                                this.toNextPage(navigatorParams);
                                            });

                                    } else {
                                        this.carOrder(datas.company_base_id, carData);
                                    }
                                }
                            },
                            (error) => {
                                this.props.showToast('用户信息查询失败');
                            });
                } else {
                    this.props.showToast('用户信息查询失败');
                }
            });
        }
    }

    /**
     *   订单物流开关接口
     **/
    getLogisticsKey = (orderId) => {
        let url = AppUrls.LOGISTICS_SWITCH;
        request(url, 'post', {}).then((response) => {
            this.props.showModal(false);
            let isLogistics = response.mjson.data.a;
            let singleCar = response.mjson.data.b;
            if (isLogistics == 0) {  //isLogistics == 'false'
                this.toNextPage({
                    name: 'ProcurementOrderDetailScene',
                    component: ProcurementOrderDetailSceneOld,
                    params: {
                        business: 1,
                        orderId: orderId,
                        singleCar: singleCar
                    }
                });
            } else {
                this.toNextPage({
                    name: 'ProcurementOrderDetailScene',
                    component: ProcurementOrderDetailScene,
                    params: {
                        business: 1,
                        orderId: orderId,
                        singleCar: singleCar
                    }
                });
            }
        }, (error) => {
            this.props.showModal(false);
            this.props.showToast(error.mjson.msg);
        });
    };

    // 车辆订购
    carOrder = (company_base_id, carData) => {
        this.props.showModal(true);
        request(AppUrls.CAR_ORDER_SAVE, 'post', {
            'car_ids': carData.id,
            'company_id': company_base_id
        }).then((response) => {
            this.props.showModal(false);
            if (response.mjson.msg === 'ok' && response.mjson.code === 1) {  // 下单成功
                this.getLogisticsKey(response.mjson.data.order_id);
            } else {
                this.props.showModal(false);
                this.props.showToast(response.mjson.msg);
            }
        }, (error) => {
            if (error.mjson.code == '6350133') {
                this.props.showModal(false);
                this.expModal.changeShowType(true, '提示', '车辆已售出请查看其它车源', '确定');
            } else {
                this.props.showModal(false);
                this.props.showToast(error.mjson.msg);
            }
        });
    }

    // 拨打电话
    callClick = (show_shop_id) => {

        // this.props.showModal(true);
        request(AppUrls.CAR_CUSTOMER_PHONE_NUMBER, 'post', {'enterprise_uid': show_shop_id}).then((response) => {
            // this.props.showModal(false);
            if (response.mjson.code == 1) {
                // Linking.openURL('tel:'+response.mjson.data.phone);
                this.CallView.isVisible(true, response.mjson.data);


            } else {
                this.props.showToast(response.mjson.msg);
            }
        }, (error) => {
            this.props.showToast(error.msg);
        });

    };

    // 打开分享
    showShared = () => {
        this.refs.sharedView.isVisible(true);
    }

    // 浏览图片
    showPhotoView = () => {

        if (typeof this.state.carData.imgs[0].url == 'undefined') {
            this.props.showToast('没有车辆图片');
            return;
        }

        let navigatorParams = {
            name: "CarZoomImageScene",
            component: CarZoomImageScene,
            params: {
                images: this.state.carData.imgs,
                index: this.state.currentImageIndex - 1,
            }
        }
        this.toNextPage(navigatorParams);

    };

    //车辆微店
    pushStoreScene=()=>{
        let navigationParams = {
            name: "CarMyListScene",
            component: CarMyListScene,
            params: {

            }
        }
        this.toNextPage(navigationParams);
    }

    // 车辆配置信息
    pushCarConfigScene = () => {
        let navigationParams = {
            name: "AutoConfig",
            component: AutoConfig,
            params: {
                modelID: this.state.carData.model_id,
                carConfiguraInfo: this.state.carData.modification_instructions,
                carConfigurationData: carConfigurationData,
                renderCarConfigurationDataAction: this.renderCarConfigDataAction,
            }
        }
        this.toNextPage(navigationParams);
    };

    // 查看更多推荐车型
    pushCarMoreScene=()=>{
        this.backToTop();
        DeviceEventEmitter.emit('pushNewCarListScene');
    }

    carCellOnPres = (carID) => {

        let navigationParams = {
            name: "CarNewInfoScene",
            component: CarNewInfoScene,
            params: {
               carID:carID
            }
        }
        this.toNextPage(navigationParams);
    };

    renderCarConfigDataAction = (data) => {
        carConfigurationData = data;
    }

    // 添加收藏
    addStoreAction = (isStoreClick) => {

        let url = AppUrls.BASEURL + 'v1/user.favorites/create';
        request(url, 'post', {

            id: this.state.carData.id,

        }).then((response) => {

            if (response.mycode == 1) {

                isStoreClick(true);
                this.props.showToast('收藏成功');
            } else {

                this.props.showToast(response.mycode.msg);
            }

        }, (error) => {

            this.props.showToast('收藏失败');

        });

    }

    // 取消收藏
    cancelStoreAction = (isStoreClick) => {

        let url = AppUrls.BASEURL + 'v1/user.favorites/delete';
        request(url, 'post', {

            id: this.state.carData.id,

        }).then((response) => {

            if (response.mycode == 1) {

                isStoreClick(false);
                this.props.showToast('取消收藏');

            } else {

                this.props.showToast(response.mycode.msg);
            }

        }, (error) => {

            this.props.showToast('取消收藏失败');

        });

    }

    setNavitgationBackgroundColor = (event) => {

        if (event.nativeEvent.contentOffset.y > 20) {

            this.refs.navtigation.setNavigationBackgroindColor(true);

        } else {
            this.refs.navtigation.setNavigationBackgroindColor(false);
        }
    }

    renderImagePage = (data, pageID) => {

        return (

            <TouchableOpacity onPress={() => {
                this.showPhotoView()
            }} activeOpacity={1} key={'image' + pageID}>
                <Image
                    source={typeof data.url == 'undefined' ? data.require : {uri: data.url + '?x-oss-process=image/resize,w_' + Math.ceil(ScreenWidth) + ',h_' + 555}}
                    style={styles.carImage}/>
            </TouchableOpacity>

        );
    }



}

class TitleView extends Component{

    render(){
        return(
            <TouchableOpacity style={{flexDirection:'row', alignItems:'center',height:Pixel.getPixel(44),justifyContent:'space-between',backgroundColor:'white'}}
                              onPress={()=>{this.props.clickAction && this.props.clickAction()}}
                              activeOpacity={1}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <View style={{backgroundColor:fontAndColor.COLORB0,width:Pixel.getPixel(3),height:Pixel.getPixel(20)}}/>
                    <Text style={{color:fontAndColor.COLORA0, fontSize:Pixel.getFontPixel(fontAndColor.BUTTONFONT30),marginLeft:Pixel.getPixel(5)}}>{this.props.title}</Text>
                </View>
                <View>
                <Text style={{color:fontAndColor.COLORA1, fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}}>{this.props.footTitle}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

class SharedView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isVisible: false,
        };
    }

    isVisible = (visible) => {

        this.setState({
            isVisible: visible,
        });
    }

    // 多图分享
    sharedMoreImage=(carData)=>{


        if(IS_ANDROID == true){
            let shareArray = [];
            for (let i =0;i<carData.imgs.length;i++)
            {
                shareArray.push(carData.imgs[i].url);
            }
            let carContent = carData.model_name+'|';
            if (carData.car_color) {

                carContent += carData.car_color.split("|")[0];
            }

            if(carContent!=='')
            {
                carContent+=' | '
            }

            if(carData.stock){

                carContent+=carData.stock+'辆在售';
            }

            if(carContent!=='')
            {
                carContent+=' | '
            }

            if(carData.dealer_price>0){
                carContent+=stringTransform.carMoneyChange(carData.dealer_price)+'万元';
            }

            NativeModules.ShareNative.share({image:[shareArray],title:[carContent]}).then((suc)=>{
                    this.sharedSucceedAction();

                }, (fail)=>{
                    this.props.showToast('分享已取消');
                }
            )
        }else {
            let shareArray = [];
            for (let i =0;i<carData.imgs.length;i++)
            {
                shareArray.push({image:carData.imgs[i].url});
            }

            shareClass.shareAction([shareArray]).then((data) => {

                this.props.showToast('分享成功');
                this.sharedSucceedAction();


            }, (error) => {

                this.props.showToast('分享已取消');
            });
        }
    }

    // 分享好友
    sharedWechatSession = (carData) => {
        weChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {

                    let imageResource = require('../../images/carSourceImages/car_info_null.png');
                    let title = carData.city_name? ('['+carData.city_name+']'+ carData.model_name ):(carData.model_name);
                    let carContent = '';
                    if (carData.car_color) {

                        carContent += carData.car_color.split("|")[0];
                    }
                    if(carContent!=='')
                    {
                        carContent+=' | ';
                    }
                    if(carData.stock){

                        carContent+=carData.stock+'辆在售';
                    }
                    if(carContent!=='')
                    {
                        carContent+="\n";
                    }
                    if(carData.dealer_price>0){
                        carContent+=stringTransform.carMoneyChange(carData.dealer_price)+'万元';
                    }

                    let fenxiangUrl = '';
                    if (AppUrls.BASEURL == 'http://api-gateway.test.dycd.com/') {
                        fenxiangUrl = AppUrls.CAR_NEW_SHARE_TEST;
                    } else {
                        fenxiangUrl = AppUrls.CAR_NEW_SHARE_OPEN;
                    }
                    let carImage = typeof carData.imgs[0].url == 'undefined' ? resolveAssetSource(imageResource).uri : carData.imgs[0].url;
                    weChat.shareToSession({
                        type: 'news',
                        title: title,
                        description: carContent,
                        webpageUrl: fenxiangUrl + '?id=' + carData.id,
                        thumbImage: carImage,

                    }).then((resp)=>{

                        this.sharedSucceedAction();
                        console.log('分享成功');

                    },(error) => {
                        console.log('分享失败');

                    })
                } else {
                    this.isVisible(false);
                }
            });


    }

    // 分享朋友圈
    sharedWechatTimeline = (carData) => {
        weChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    let imageResource = require('../../images/carSourceImages/car_info_null.png');
                    let title = carData.city_name? ('['+carData.city_name+']'+ carData.model_name ):(carData.model_name);
                    let carContent = '';
                    if (carData.car_color) {

                        carContent += carData.car_color.split("|")[0];
                    }

                    if(carContent!=='')
                    {
                        carContent+=' | '
                    }

                    if(carData.stock){

                        carContent+=carData.stock+'辆在售';
                    }

                    if(carContent!=='')
                    {
                        carContent+=' | '
                    }

                    if(carData.dealer_price>0){
                        carContent+=stringTransform.carMoneyChange(carData.dealer_price)+'万元';
                    }


                    let fenxiangUrl = '';
                    if (AppUrls.BASEURL == 'http://api-gateway.test.dycd.com/') {
                        fenxiangUrl = AppUrls.CAR_NEW_SHARE_TEST;
                    } else {
                        fenxiangUrl = AppUrls.CAR_NEW_SHARE_OPEN;
                    }
                    let carImage = typeof carData.imgs[0].url == 'undefined' ? resolveAssetSource(imageResource).uri : carData.imgs[0].url;
                    weChat.shareToTimeline({
                        type: 'news',
                        title: title,
                        description: carContent,
                        webpageUrl: fenxiangUrl + '?id=' + carData.id,
                        thumbImage: carImage,

                    }).then((resp)=>{

                        this.sharedSucceedAction();
                        console.log('分享成功');

                    },(error) => {
                        console.log('分享失败');

                    })

                } else {
                    this.isVisible(false);
                }
            });

    }

    sharedSucceedAction=()=> {

        StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data) => {
            if (data.code == 1) {
                if (data.result != null && data.result != "") {
                    let userData = JSON.parse(data.result);
                    let userPhone = userData.phone + global.companyBaseID;
                    request(AppUrls.CAR_CHESHANG_SHARE_MOMENT_COUNT, 'POST', {
                        mobile: userPhone
                    }).then((response) => {
                    }, (error) => {
                    });

                } else {
                    this.setState({
                        renderPlaceholderOnly: 'error'
                    });
                }

            } else {
                this.setState({
                    renderPlaceholderOnly: 'error'
                });
            }
        })
    }


    render() {

        return (
            <Modal
                visible={this.state.isVisible}
                transparent={true}
                onRequestClose={() => {
                    this.isVisible(false)
                }}
                animationType={'fade'}>

                <TouchableOpacity style={styles.sharedContaier} onPress={() => {
                    this.isVisible(false)
                }}>
                    <View style={styles.sharedView}>
                        {/*<View style={styles.sharedViewHead}>*/}
                        {/*<Text allowFontScaling={false}  style={styles.sharedViewHeadText}>分享到</Text>*/}
                        {/*</View>*/}
                        <View style={{flexDirection: 'row',paddingVertical:Pixel.getPixel(15)}}>
                            <TouchableOpacity style={styles.sharedItemView} onPress={() => {
                                this.sharedMoreImage(this.props.carData);
                                this.isVisible(false);
                            }}>
                                <View style={styles.sharedImageBack}>
                                    <Image source={require('../../images/carSourceImages/shareImgIcon.png')}/>
                                </View>
                                <Text allowFontScaling={false}  style={styles.sharedText}>多图分享</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.sharedItemView} onPress={() => {
                                this.sharedWechatSession(this.props.carData);
                                this.isVisible(false);
                            }}>
                                <View style={styles.sharedImageBack}>
                                    <Image source={require('../../images/carSourceImages/shared_wx.png')}/>
                                </View>
                                <Text allowFontScaling={false}  style={styles.sharedText}>微信好友</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.sharedItemView} onPress={() => {
                                this.sharedWechatTimeline(this.props.carData);
                                this.isVisible(false);
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
            </Modal>

        )
    }

}

class PhotoView extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {

            isVisible: false,
        };
    }

    show = (imageArray, index) => {

        if (!this.state.isVisible) {
            this.setState({
                isVisible: true,
                imageArray: imageArray,
                index: index,
            });
        }
    }
    hide = () => {

        if (this.state.isVisible) {
            this.setState({
                isVisible: false,
            });
        }
    }

    render() {
        const {imageArray, index} = this.state;
        return (
            <Modal
                visible={this.state.isVisible}
                transparent={true}
                onRequestClose={() => {
                    this.hide()
                }}
                animationType={'fade'}
            >
                <Gallery
                    style={{flex: 1, backgroundColor: 'rgba(1,1,1,0.5)'}}
                    images={imageArray}
                    initialPage={index - 1}
                    onSingleTapConfirmed={() => {
                        this.hide();
                    }}
                />
            </Modal>
        )
    }
}

class CallView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isVisible: false,
            callData: {},
        };
    }

    isVisible = (visible, callData) => {
        this.setState({
            isVisible: visible,
            callData: callData,
        });
    }

    render() {
        return (
            <Modal
                visible={this.state.isVisible}
                transparent={true}
                onRequestClose={() => {
                    this.isVisible(false, this.state.callData)
                }}
                animationType={'fade'}>
                <TouchableOpacity style={[styles.sharedContaier, {alignItems: 'center', justifyContent: 'center'}]}
                                  onPress={() => {
                                      this.isVisible(false, this.state.callData)
                                  }}>
                    <View style={styles.callModelView}>
                        {
                            this.state.callData.phone !== '' && (
                                <TouchableOpacity onPress={() => {
                                    this.callAction(this.state.callData.phone)
                                }}>
                                    <View style={styles.callModelItem}>
                                        <Image source={require('../../images/carSourceImages/phoneIcon.png')}/>
                                        <Text allowFontScaling={false}  style={styles.callText}>咨询第1车贷客服</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                        {
                            this.state.callData.shopsNumber !== "" && (
                                <TouchableOpacity onPress={() => {
                                    this.callAction(this.state.callData.shopsNumber)
                                }}>
                                    <View style={[styles.callModelItem, {marginTop: Pixel.getPixel(20)}]}>
                                        <Image source={require('../../images/carSourceImages/phoneIcon.png')}/>
                                        <Text allowFontScaling={false}  style={styles.callText}>咨询商家</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }

    callAction = (number) => {
        this.isVisible(false, this.state.callData);
        if (Platform.OS === 'android') {
            NativeModules.VinScan.callPhone(number);
        } else {
            Linking.openURL('tel:' + number);
        }

    }
}

const styles = StyleSheet.create({


    carImage: {

        height: Pixel.getPixel(250),
        width: ScreenWidth,
        resizeMode: 'stretch'

    },
    contentContainer: {

        backgroundColor: 'white',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: fontAndColor.COLORA3,

    },
    contentView: {

        marginLeft: Pixel.getPixel(15),
        marginTop: Pixel.getPixel(10),
        marginRight: Pixel.getPixel(15),
        marginBottom: Pixel.getPixel(15),
        backgroundColor: 'white'

    },
    titleText: {
        color: fontAndColor.COLORA0,
        fontSize: fontAndColor.TITLEFONT,
        backgroundColor: 'transparent',

    },
    subTitleView: {

        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 3,
        borderColor: fontAndColor.COLORB0,
        justifyContent: 'center',
        alignItems: 'center',
        width: Pixel.getPixel(52),
        marginLeft: Pixel.getPixel(5),
        marginTop: Pixel.getPixel(15),
        height: Pixel.getPixel(30),


    },
    preferentialView: {
        backgroundColor: '#fff8ea',
        paddingVertical: 5,
        width: ScreenWidth - 30,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 10,
        borderColor: "#fedc93",
        borderWidth: StyleSheet.hairlineWidth,
    },
    preferentialText: {
        color: fontAndColor.COLORB2,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        marginLeft: 10
    },
    subText: {

        color: fontAndColor.COLORB0,
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT),
        textAlign: 'center',

    },
    titleFootView: {

        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: Pixel.getPixel(10),

    },
    browseView: {

        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',

    },
    browseText: {
        color: fontAndColor.COLORA1,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),
    },
    priceText: {
        color: fontAndColor.COLORB2,
        fontSize: Pixel.getFontPixel(fontAndColor.TITLEFONT),
        fontWeight: 'bold',

    },
    carParameterView: {

        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        flexWrap: 'wrap',
        marginBottom: Pixel.getPixel(12),

    },
    carParameterItem: {

        marginTop: Pixel.getPixel(5),
        marginBottom: Pixel.getPixel(5),
        marginRight: Pixel.getPixel(5),
        paddingHorizontal: Pixel.getPixel(5),
        height: Pixel.getPixel(18),
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: Pixel.getPixel(5)
    },
    carParameterText: {
        fontSize: Pixel.getFontPixel(fontAndColor.MARKFONT),
    },
    carDepictView: {

        marginBottom: Pixel.getPixel(15),
        paddingHorizontal: Pixel.getPixel(5),
        paddingVertical: Pixel.getPixel(5),
        backgroundColor: 'rgba(158,158,158,0.15)',
        borderRadius: 3,
    },
    carDepictText: {

        color: fontAndColor.COLORA2,
        fontSize: Pixel.getFontPixel(fontAndColor.MARKFONT),
    },
    carAddressView: {

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    carAddressSubView: {

        flexDirection: 'row',
    },
    carAddressTitleText: {

        color: fontAndColor.COLORA1,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),

    },
    carAddressSubTitleText: {

        color: fontAndColor.COLORA0,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),
    },
    carIconsContainer: {

        marginTop: Pixel.getPixel(10),
    },
    carIconsView: {
        backgroundColor: 'white',
        flexWrap: 'wrap',
    },
    carIconItem: {

        alignItems: 'center',
        marginTop: Pixel.getPixel(25),
        backgroundColor: 'white',
        width: Pixel.getPixel(90),
        height: Pixel.getPixel(95),
        marginRight: Pixel.getPixel(10),
        marginLeft: Pixel.getPixel(10),
    },
    carIconItemTitleText: {

        color: fontAndColor.COLORA1,
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT),

    },
    carIconItemContentText: {

        color: fontAndColor.COLORA1,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),
        marginTop: Pixel.getPixel(5),
        marginBottom: Pixel.getPixel(5),

    },
    footView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        height: Pixel.getPixel(44),
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopColor: fontAndColor.COLORA4,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    callView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderLeftColor: fontAndColor.COLORA4,
        paddingHorizontal: Pixel.getPixel(15),
        height: Pixel.getPixel(44),
        width: ScreenWidth / 3,
    },

    callText: {
        color: fontAndColor.COLORB0,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),
        marginLeft: Pixel.getPixel(5)
    },
    carNumberView: {
        alignItems: 'center',
        justifyContent: 'center',
        height: Pixel.getPixel(44),
        paddingHorizontal: Pixel.getPixel(15),
        width: ScreenWidth / 3
    },
    carNumberText: {
        color: fontAndColor.COLORA0,
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT),
    },
    orderView: {
        backgroundColor: fontAndColor.COLORB0,
        height: Pixel.getPixel(44),
        justifyContent: 'center',
        alignItems: 'center',
        width: ScreenWidth / 3
    },
    orderText: {
        color: 'white',
        fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30)
    },
    carInfoBtn: {
        flexDirection: 'row',
        paddingHorizontal: Pixel.getPixel(15),
        height: Pixel.getPixel(44),
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        marginTop: Pixel.getPixel(1),
    },
    PhotonContaier: {

        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(1,1,1,0.8)',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',

    },
    imageFootView: {

        height: Pixel.getPixel(50),
        right: Pixel.getPixel(15),
        bottom: 0,
        left: Pixel.getPixel(15),
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },

    carAgeView: {

        paddingHorizontal: Pixel.getPixel(10),
        paddingVertical: Pixel.getPixel(5),
        backgroundColor: 'rgba(1,1,1,0.3)',
        borderRadius: 3,

    },

    carAgeText: {

        color: 'white',
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT),
        backgroundColor: 'transparent'
    },

    imageIndexText: {

        color: 'white',
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),
        backgroundColor: 'transparent'


    },
    sharedContaier: {

        flex: 1,
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
    callModelView: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: Pixel.getPixel(250),
        borderRadius: 3,
        paddingVertical: Pixel.getPixel(30),
    },
    callModelItem: {
        height: Pixel.getPixel(40),
        backgroundColor: 'white',
        borderColor: fontAndColor.COLORB0,
        borderWidth: Pixel.getPixel(1),
        borderRadius: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: Pixel.getPixel(250) - Pixel.getPixel(30),
        marginLeft: Pixel.getPixel(15),
        marginRight: Pixel.getPixel(15),
    },
    expButton: {
        marginBottom: Pixel.getPixel(20),
        width: Pixel.getPixel(100),
        height: Pixel.getPixel(35),
        marginTop: Pixel.getPixel(16),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        borderWidth: 1,
        borderColor: fontAndColor.COLORB0
    },
    expText: {
        fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),
        color: fontAndColor.COLORB0
    },
    storeView:{
        backgroundColor:'white',
        paddingHorizontal:Pixel.getPixel(15),
        flexDirection:'row',
        alignItems:'center',
        height:Pixel.getPixel(44),
        marginTop:Pixel.getPixel(10),
        justifyContent:'space-between'
    },
    storeText:{
        color:fontAndColor.COLORA0,
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
    },
    storeTailText:{
        color:fontAndColor.COLORA2,
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        marginRight:Pixel.getPixel(5),
    },
    carCell: {
        height: Pixel.getPixel(110),
    },
})