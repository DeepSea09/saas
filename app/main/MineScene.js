import React from 'react'
import {
    BackAndroid,
    Dimensions,
    Image,
    Linking,
    ListView,
    NativeModules,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    DeviceEventEmitter,
    View
} from 'react-native'

import * as fontAndClolr from '../constant/fontAndColor';
import MycarScene from '../carSource/CarMySourceScene';
import PixelUtil from '../utils/PixelUtil'
import ContractManageScene from '../mine/contractManage/ContractManageScene';

import AccountManageScene from '../mine/accountManage/AccountTypeSelectScene'
import WaitActivationAccountScene from '../mine/accountManage/WaitActivationAccountScene'
import AccountScene from '../mine/accountManage/AccountScene'
import BindCardScene from '../mine/accountManage/BindCardScene'

import AdjustManageScene from '../mine/adjustManage/AdjustManageScene'
import EmployeeManageScene from '../mine/employeeManage/EmployeeManageScene'
import Setting from './../mine/setting/Setting'
import CarCollectSourceScene from '../carSource/CarCollectsScene';
import BrowsingHistoryScene from '../carSource/BrowsingHistorysScene';
import StorageUtil from "../utils/StorageUtil";
import * as StorageKeyNames from "../constant/storageKeyNames";
import ImageSource from '../publish/component/ImageSource';
import {request} from '../utils/RequestUtil';
import * as Urls from '../constant/appUrls';
import AccountModal from '../component/AccountModal';
import AuthenticationModal from '../component/AuthenticationModal';
import OrderTypeSelectScene from  '../mine/myOrder/OrderTypeSelectScene';
import OrderTypeSelectSceneOld from  '../mine/myOrderOld/OrderTypeSelectScene';
import CustomerAddScene from "../crm/StoresReception/ClientAddScene";
import StoreReceptionManageScene from "../crm/StoresReception/StoreReceptionManageScene";
import StoreReceptionManageNewScene from "../crm/StoresReception/StoreReceptionManageNewScene";
import MyAccountScene from "../mine/accountManage/MyAccountScene";
import EnterpriseCertificate from "../mine/certificateManage/EnterpriseCertificate";
import PersonCertificate from "../mine/certificateManage/PersonCertificate";
import ImagePicker from "react-native-image-picker";
import YaoQingDeHaoLi from '../mine/setting/YaoQingDeHaoLi';
import SupervisionFeeScene from '../mine/supervisonFee/SupervisionFeeScene';
import AddressManageListScene from '../mine/addressManage/AddressManageListScene';
import GetCarerManageListScene from '../mine/getCarerManage/GetCarerManageListScene';
import GetPermissionUtil from '../utils/GetPermissionUtil';
import BaseComponent from '../component/BaseComponent';

var Pixel = new PixelUtil();

let Platform = require('Platform');
let firstType = '-1';
let lastType = '-1';
let haveOrder = 0;
let un_pay_count = 0;
const GetPermission = new GetPermissionUtil();
let componyname = '';
const cellJianTou = require('../../images/mainImage/celljiantou.png');
let Car = [];
let BASE_ID = [];
/*
 * 获取屏幕的宽和高
 **/
const {width, height} = Dimensions.get('window');
const options = {
    //弹出框选项
    title: '请选择',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '选择相册',
    allowsEditing: true,
    noData: false,
    quality: 1.0,
    maxWidth: 480,
    maxHeight: 800,
    storageOptions: {
        skipBackup: true,
        path: 'images',
    }
}

export default class MineScene extends BaseComponent {


    handleBack = () => {
        NativeModules.VinScan.goBack();
        return true;
    }


    componentDidMount() {
        try {
            BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
        } catch (e) {

        } finally {
            //InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: 'loading'});
            this.initFinish();
            //});
        }
    }

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        //    拿到所有的json数据
        this.isLogistics = 1;
        this.singleCar = 1;
        this.state = {
            renderPlaceholderOnly: 'blank',
            isRefreshing: false
        };
    }

    //联系客服
    callAciton = () => {
        request(Urls.GET_CUSTOM_SERVICE, 'Post', {})
            .then((response) => {
                    if (response.mjson.code == 1) {
                        if (Platform.OS === 'android') {
                            NativeModules.VinScan.callPhone(response.mjson.data.phone);
                        } else {
                            Linking.openURL('tel:' + response.mjson.data.phone);
                        }
                    } else {
                        this.props.showToast(response.mjson.msg);
                    }
                },
                (error) => {
                    this.props.showToast(error.msg);
                });
    };


    initFinish = () => {
        GetPermission.getCertificateVisiable((back) => {
            firstType = '-1';
            lastType = '-1';
            haveOrder = 0;
            un_pay_count = 0;
            componyname = '';

            this.renzhengData = {
                RenZhengVisiable: back,//是否显示认证条目 true 显示
                enterpriseRenZheng: '',//企业是否认证 	0-> 未审核 1->审核中 2->通过  3->未通过
                personRenZheng: '',//个人是否认证  0-> 未审核 1->审核中 2->通过  3->未通过

            };

            this.authenOptions = {
                '1': [true, '请先完成认证后再进行操作', '取消', '', '个人认证', this._gerenrenzheng],
                '2': [true, '请先完成认证后再进行操作', '取消', '', '企业认证', this._qiyerenzheng],
                '3': [true, '认证未通过请重新认证，您可以重新认证或联系客服', '取消', '联系客服', '个人认证', this._gerenrenzheng, this.callAciton],
                '4': [true, '认证未通过请重新认证，您可以重新认证或联系客服', '取消', '联系客服', '企业认证', this._qiyerenzheng, this.callAciton],
                '5': [true, '您的认证申请正在审核中，您可查看所提交信息。我们会在一个工作日内向您反馈结果，请稍候。', '确定', '', '', () => {
                }],
                '6': [true, '您的认证申请正在审核中，您可查看所提交信息。我们会在一个工作日内向您反馈结果，请稍候。', '确定', '', '', () => {
                }],
                '7': [true, '需创建此账号的主账号通过个人认证后进行操作', '确定', '', '', () => {
                }],
                '8': [true, '需创建此账号的主账号通过企业认证后进行操作', '确定', '', '', () => {
                }],
            };

            this.mColor = {
                //0-> 未审核 1->审核中 2->通过  3->未通过
                0: 'gray',
                1: 'black',
                2: 'black',
                3: 'red'
            }
            this.getData();
        });

    }

    changeData = () => {
        StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data) => {
            if (data.code == 1) {
                let user_list = [];
                let datas = JSON.parse(data.result);
                user_list.push(...Car);
                GetPermission.getMineList((minList) => {
                    for (let i = 0; i < minList.length; i++) {
                        this.initData(minList[i].id, minList[i].name);
                    }
                    let jsonData = user_list;

                    //    定义变量
                    let dataBlob = {},
                        sectionIDs = [],
                        rowIDs = [];
                    for (let i = 0; i < jsonData.length; i++) {
                        //    1.拿到所有的sectionId
                        sectionIDs.push(i);

                        //    2.把组中的内容放入dataBlob内容中
                        dataBlob[i] = jsonData[i].title;

                        //    3.设置改组中每条数据的结构
                        rowIDs[i] = [];

                        //    4.取出改组中所有的数据
                        let cars = jsonData[i].cars;

                        //    5.便利cars,设置每组的列表数据
                        for (let j = 0; j < cars.length; j++) {
                            //    改组中的每条对应的rowId
                            rowIDs[i].push(j);

                            // 把每一行中的内容放入dataBlob对象中
                            dataBlob[i + ':' + j] = cars[j];
                        }
                    }
                    let getSectionData = (dataBlob, sectionID) => {
                        return dataBlob[sectionID];
                    };

                    let getRowData = (dataBlob, sectionID, rowID) => {
                        return dataBlob[sectionID + ":" + rowID];
                    };
                    let ds = new ListView.DataSource({
                            getSectionData: getSectionData,
                            getRowData: getRowData,
                            rowHasChanged: (r1, r2) => r1 !== r2,
                            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
                        }
                    );







                    DeviceEventEmitter.emit('mb_show', '完成');




                    /*   获取用户账户状态更新蒙层状态    专用       */
                    StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (datac) => {
                        if (datac.code == 1) {
                            let datasc = JSON.parse(datac.result);
                            let maps = {
                                enter_base_ids: datasc.company_base_id,
                                child_type: '1'
                            };
                            request(Urls.USER_ACCOUNT_INFO, 'Post', maps)
                                .then((response) => {

                                        let account_status = response.mjson.data.account.status;

                                        this.setState({
                                            source: ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
                                            name: datas.real_name,
                                            phone: datas.phone,
                                            headUrl: datas.head_portrait_url,
                                            renderPlaceholderOnly: 'success',
                                            isRefreshing: false
                                        });


                                        if (account_status == '0') {
                                            DeviceEventEmitter.emit('mb_show', '未开通');

                                        } else if (account_status == '1') {
                                            DeviceEventEmitter.emit('mb_show', '未绑卡');

                                        } else if (account_status == '2') {

                                        } else if (account_status == '3') {
                                            DeviceEventEmitter.emit('mb_show', '已激活');
                                        }
                                    },
                                    (error) => {
                                        this.setState({
                                            renderPlaceholderOnly: 'error',
                                            isRefreshing: false
                                        });
                                    });
                        }
                    });

                    /*   获取用户账户状态更新蒙层状态    专用       */

                });

            } else {
                this.setState({
                    renderPlaceholderOnly: 'error',
                    isRefreshing: false
                });
            }
        });
    }

    initData = (id, name) => {

        if (id == 47) {
            Car[0].cars.push({
                "icon": require('../../images/mainImage/zhanghuguanli.png'),
                "name": name
                , "id": id
            },);
        } else if (id == 48) {
            Car[0].cars.push({
                "icon": require('../../images/mainImage/yuangongguanli.png'),
                "name": name
                , "id": id
            },);
        } else if (id == 49) {
            Car[0].cars.push({
                "icon": require('../../images/mainImage/switchcompony.png'),
                "name": name
                , "id": id
            },);
        } else if (id == 52) {
            Car[2].cars.push({
                "icon": require('../../images/mainImage/my_order.png'),
                "name": name
                , "id": id
            },);
        }else if (id == 69) {
            Car[2].cars.push({
                "icon": require('../../images/mine/adderss_manage.png'),
                "name": name
                , "id": id
            },);
        }else if (id == 71) {
            Car[2].cars.push({
                "icon": require('../../images/mine/geter_manage.png'),
                "name": name
                , "id": id
            },);
        } else if (id == 50) {
            Car[1].cars.push({
                "icon": require('../../images/mainImage/youhuiquanguanli.png'),
                "name": name
                , "id": id
            },);
        } else if (id == 51) {
            Car[1].cars.push({
                "icon": require('../../images/mainImage/hetongguanli.png'),
                "name": name
                , "id": id
            },);
        } else if (id == 53) {
            Car[2].cars.push({
                "icon": require('../../images/mainImage/shoucangjilu.png'),
                "name": name
                , "id": id
            },);
        } else if (id == 54) {
            Car[2].cars.push({
                "icon": require('../../images/mainImage/liulanlishi.png'),
                "name": name
                , "id": id
            },);
        } else if (id == 56) {
            Car[3].cars.push({
                "icon": require('../../images/mainImage/shezhi.png'),
                "name": name
                , "id": id
            },);
        } else if (id == 100) {
            Car[2].cars.push({
                "icon": require('../../images/mainImage/myCarSource.png'),
                "name": name
                , "id": id
            },);

        }
        else if (id == 58) {
            Car[2].cars.push({
                "icon": require('../../images/mainImage/my_yqdhl.png'),
                "name": name
                , "id": id
            },);
        }
        else if (id == 67) {
            Car[2].cars.push({
                "icon": require('../../images/mainImage/supervision_fee.png'),
                "name": name
                , "id": id
            },);
        }
    }
    getData = () => {
        Car = [
            {
                "cars": [
                    // {
                    //     "icon": require('../../images/mainImage/zhanghuguanli.png'),
                    //     "name": "账户管理"
                    // },
                    // {
                    //     "icon": require('../../images/mainImage/yuangongguanli.png'),
                    //     "name": "员工管理"
                    // },
                    // {
                    //     "icon": require('../../images/mainImage/switchcompony.png'),
                    //     "name": "切换公司"
                    // },
                ],
                "title": "section0"
            },
            {
                "cars": [
                    // {
                    //     "icon": require('../../images/mainImage/youhuiquanguanli.png'),
                    //     "name": "优惠券管理"
                    // },
                    // {
                    //     "icon": require('../../images/mainImage/hetongguanli.png'),
                    //     "name": "合同管理"
                    // },
                ],
                "title": "section1"
            },
            {
                "cars": [
                    // {
                    //     "icon": require('../../images/mainImage/myCarSource.png'),
                    //     "name": "我的车源"
                    // },
                    // {
                    //     "icon": require('../../images/mainImage/my_order.png'),
                    //     "name": "我的订单"
                    // },
                    // {
                    //     "icon": require('../../images/mainImage/shoucangjilu.png'),
                    //     "name": "收藏记录"
                    // },
                    // {
                    //     "icon": require('../../images/mainImage/liulanlishi.png'),
                    //     "name": "浏览历史"
                    // },

                ],
                "title": "section2"
            },
            {
                "cars": [
                    // {
                    //     "icon": require('../../images/mainImage/shezhi.png'),
                    //     "name": "设置"
                    // },
                ],
                "title": "section3"
            },
            {
                "cars": [
                    {
                        "icon": require('../../images/mainImage/shezhi.png'),
                        "name": "blank"
                    },
                ],
                "title": "section3"
            },
        ]


        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                BASE_ID = [];
                BASE_ID.push(datas.company_base_id);

                StorageUtil.mGetItem(StorageKeyNames.BASE_USER_ID, (data2) => {

                    if (data2.code == 1 && data2.result != null) {
                        BASE_ID.push(data2.result)
                        let maps = {
                            base_id: BASE_ID,
                        };
                        request(Urls.GETCHECKSTATUS, 'post', maps).then((response) => {


                            if (response.mycode == "1") {
                                let dataResult = response.mjson.data;

                                this.renzhengData.enterpriseRenZheng = dataResult[BASE_ID[0]];
                                this.renzhengData.personRenZheng = dataResult[BASE_ID[1]];

                                this.toCompany();

                            } else {
                                this.setState({
                                    renderPlaceholderOnly: 'error',
                                    isRefreshing: false
                                });
                            }
                        }, (error) => {
                            this.props.showToast(error.msg);
                            this.setState({
                                renderPlaceholderOnly: 'error',
                                isRefreshing: false
                            });
                        });

                    } else {
                        this.props.showToast('获取个人信息失败');
                        this.setState({
                            renderPlaceholderOnly: 'error',
                            isRefreshing: false
                        });
                    }
                });
            } else {
                this.props.showToast('获取企业信息失败');
                this.setState({
                    renderPlaceholderOnly: 'error',
                    isRefreshing: false
                });
            }
        });

        // StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data) => {
        //     if (data.code == 1) {
        //         let datas = JSON.parse(data.result);
        //         if(datas.user_level=='0'){
        //             this.noCompany();
        //         }else{
        // this.toCompany();


        //         }
        //     }
        // });

    }

    noCompany = () => {
        lastType = 'error';
        this.changeData();
    }

    toCompany = () => {
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1) {
                let datas = JSON.parse(data.result);
                componyname = '';
                if (datas.companyname == null || datas.companyname == '') {
                    componyname = datas.name;
                } else {
                    componyname = datas.name + '(' + datas.companyname + ')';
                }
                let maps = {
                    enter_base_ids: datas.company_base_id,
                    child_type: '1'
                };
                request(Urls.ACCOUNT_HOME, 'Post', maps)
                    .then((response) => {
                            haveOrder = response.mjson.data.order.tradeing_count;
                            un_pay_count = parseInt(response.mjson.data.supervise.un_pay_count);
                            if (response.mjson.data.account == null || response.mjson.data.account.length <= 0) {
                                lastType = 'error';
                            } else {
                                lastType = response.mjson.data.account.status;
                            }
                            // lastType = '3';、
                            this.getLogisticsKey();
                        },
                        (error) => {
                            this.getLogisticsKey();
                        });
            }
        });
    };


    /**
     *   订单物流开关接口
     **/
    getLogisticsKey = () => {
        let maps = {

        };
        let url = Urls.LOGISTICS_SWITCH;
        request(url, 'post', maps).then((response) => {
            this.isLogistics = response.mjson.data.a;
            this.singleCar = response.mjson.data.b;
            this.changeData();
        }, (error) => {
            this.changeData();
        });
    };

    allRefresh = () => {
        firstType = '-1';
        lastType = '-1';
        this.setState({
            renderPlaceholderOnly: 'loading',
        });
        this.getData();
    }

    refreshingData = () => {
        this.setState({isRefreshing: true});
        this.getData();
    };

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (

                <View style={styles.container}>

                    {this.loadView()}

                </View>
            )
        }
        return (

            <View style={styles.container}>
                <ImageSource galleryClick={this._galleryClick}
                             cameraClick={this._cameraClick}
                             ref={(modal) => {
                                 this.imageSource = modal
                             }}/>
                <ListView
                    removeClippedSubviews={false}
                    contentContainerStyle={styles.listStyle}
                    dataSource={this.state.source}
                    renderRow={this._renderRow}
                    renderSectionHeader={this._renderSectionHeader}
                    renderHeader={this._renderHeader}
                    refreshControl={
						<RefreshControl
							refreshing={this.state.isRefreshing}
							onRefresh={this.refreshingData}
							tintColor={[fontAndClolr.COLORB0]}
							colors={[fontAndClolr.COLORB0]}
						/>
                    }
                />
                <AccountModal ref="accountmodal"/>
                <AuthenticationModal ref="authenmodal"/>
            </View>
        )
    }

    navigatorParams = {

        name: 'AccountManageScene',
        component: AccountManageScene,
        params: {}
    }

     toPage = () => {
         this.navigatorParams.name = 'MyAccountScene';
         this.navigatorParams.component = MyAccountScene;
         this.navigatorParams.params = {callBack: this.updateType};
         this.refs.accountmodal.changeShowType(false);
         //firstType = lastType;
         this.props.callBack(this.navigatorParams);
     };



    /**
     *   更新 lastType;
     **/
    updateType = (newLastType) => {
        lastType = newLastType;
        //firstType = newLastType;
        //console.log('firstType=======',firstType);
    };

    _navigator(rowData) {
        this.props.showModal(true);
        //先判断认证状态
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    enterprise_id: datas.company_base_id,
                    function_id: rowData.id,
                    type: 'app'
                };
                request(Urls.USER_IDENTITY_GET_INFO, 'post', maps).then((response) => {
                    this.props.showModal(false);
                    if (response.mjson.data.auth == 0) {
                        this._navigatorPage(rowData);
                    } else {
                        this.refs.authenmodal.changeShowType(...this.authenOptions[response.mjson.data.auth + '']);
                    }
                }, (error) => {
                    this.props.showModal(false);
                    this.props.showToast(error.msg);
                });
            } else {
                this.props.showModal(false);
                this.props.showToast('获取企业信息失败');
            }
        });
    }

    _navigatorPage = (rowData) => {
        switch (rowData.id) {
            case 47:
                this.toPage();
                return;
                break;
            case 49:
                this.props.toSelect();
                return;
                break;
            case 50:
                this.navigatorParams.name = 'AdjustManageScene'
                this.navigatorParams.component = AdjustManageScene
                break;
            case '积分管理':
                break;
            case 51:
                this.navigatorParams.name = 'ContractManageScene'
                this.navigatorParams.component = ContractManageScene
                this.navigatorParams.params = {
                    from: 'xs'
                }
                break;
            case 48:
                this.navigatorParams.name = 'EmployeeManageScene'
                this.navigatorParams.component = EmployeeManageScene
                break;
            case 100:
                this.navigatorParams.name = 'MycarScene'
                this.navigatorParams.component = MycarScene
                break;
            case 52:
                if (this.isLogistics == 0) {  //this.isLogistics == 'false'
                    this.navigatorParams.name = 'OrderTypeSelectSceneOld'
                    this.navigatorParams.component = OrderTypeSelectSceneOld
                } else {
                    this.navigatorParams.name = 'OrderTypeSelectScene'
                    this.navigatorParams.component = OrderTypeSelectScene
                    this.navigatorParams.params = {
                        singleCar: this.singleCar
                    }
                }
                break;
            case 69:
                this.navigatorParams.name = 'AddressManageListScene'
                this.navigatorParams.component = AddressManageListScene
                break;
            case 71:
                this.navigatorParams.name = 'GetCarerManageListScene'
                this.navigatorParams.component = GetCarerManageListScene
                break;
            case 53:
                this.navigatorParams.name = 'CarCollectSourceScene'
                this.navigatorParams.component = CarCollectSourceScene
                break;
            case 54:
                this.navigatorParams.name = 'BrowsingHistoryScene'
                this.navigatorParams.component = BrowsingHistoryScene
                break;
            case 56:
                this.navigatorParams.name = 'Setting'
                this.navigatorParams.component = Setting
                break;
            case 58:
                this.navigatorParams.name = 'YaoQingDeHaoLi'
                this.navigatorParams.component = YaoQingDeHaoLi
                break;
            case 67:
                this.navigatorParams.name = 'SupervisionFeeScene'
                this.navigatorParams.component = SupervisionFeeScene
                this.navigatorParams.params = {callBack: this.updateType};

                break;
        }

        this.props.callBack(this.navigatorParams);
    };

    // 每一行中的数据
    _renderRow = (rowData) => {
        let showName = '';
        /*        if (lastType == '0') {
         showName = '未开户';
         } else if (lastType == '1') {
         showName = '未绑卡';
         } else if (lastType == '2') {
         showName = '未激活';
         }*/
        if (rowData.name == 'blank') {
            return (
                <View style={{width: width, height: Pixel.getPixel(2), backgroundColor: fontAndClolr.COLORA3}}></View>
            );
        } else {
            return (
                <TouchableOpacity style={styles.rowView} onPress={() => {

                    this._navigator(rowData)
                }}>

                    <Image source={rowData.icon} style={styles.rowLeftImage}/>

                    <Text allowFontScaling={false} style={styles.rowTitle}>{rowData.name}</Text>
                    {rowData.id == 15 ? <Text allowFontScaling={false} style={{
                        marginRight: Pixel.getPixel(15),
                        backgroundColor: '#00000000',
                        color: fontAndClolr.COLORB2,
                        fontSize: Pixel.getFontPixel(fontAndClolr.LITTLEFONT28)
                    }}>{showName}</Text> :
                        <View/>}
                    {rowData.name == '我的订单' && haveOrder != 0 ?
                        <View style={{
                            marginRight: Pixel.getPixel(15),
                            width: Pixel.getPixel(10),
                            height: Pixel.getPixel(10),
                            backgroundColor: fontAndClolr.COLORB2,
                            borderRadius: 10
                        }}
                        /> : <View/>}
                    {rowData.name == '监管费' && un_pay_count > 0 ?
                        <View style={{
                            marginRight: Pixel.getPixel(15),
                            width: Pixel.getPixel(65),
                            height: Pixel.getPixel(25),
                            backgroundColor: '#FDEEEB',
                            alignItems:'center',
                            justifyContent:'center',
                            borderRadius: 14}}>
                            <Text style={{color:'#FC6855', fontSize:12}}> {un_pay_count + '笔待付'}</Text>
                        </View> : <View/>}


                    <Image source={cellJianTou} style={styles.rowjiantouImage}/>


                </TouchableOpacity>
            );
        }

    }

    componentDidUpdate() {

        if (this.state.renderPlaceholderOnly == 'success') {

            if (firstType != lastType) {
                StorageUtil.mGetItem(StorageKeyNames.USER_INFO, (data) => {
                    if (data.code == 1) {
                        let datas = JSON.parse(data.result);
                        GetPermission.getMineList((mineList) => {
                            for (let i = 0; i < mineList.length; i++) {
                                if (mineList[i].id == 47) {
                                    StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (datac) => {
                                        if (datac.code == 1) {
                                            let datasc = JSON.parse(datac.result);
                                            let maps = {
                                                enter_base_ids: datasc.company_base_id,
                                                child_type: '1'
                                            };
                                            request(Urls.USER_ACCOUNT_INFO, 'Post', maps)
                                                .then((response) => {
                                                        haveOrder = response.mjson.data.order.tradeing_count;
                                                        lastType = response.mjson.data.account.status;

                                                        console.log(lastType + '-----------')
                                                        if (lastType == '0') {
                                                            DeviceEventEmitter.emit('mb_show', '未开通');
                                                            // this.refs.accountmodal.changeShowType(true,
                                                            //     '您还未开通资金账户，为方便您使用金融产品及购物车，' +
                                                            //     '请尽快开通！', '去开户', '看看再说', () => {
                                                            //         this.toPage();
                                                            //     });
                                                        } else if (lastType == '1') {
                                                            DeviceEventEmitter.emit('mb_show', '未绑卡');
                                                            // this.refs.accountmodal.changeShowType(true,
                                                            //     '您的资金账户还未绑定银行卡，为方便您使用金融产品及购物车，请尽快绑定。'
                                                            //     , '去绑卡', '看看再说', () => {
                                                            //         this.toPage();
                                                            //     });
                                                        } else if (lastType == '2') {
                                                            // this.refs.accountmodal.changeShowType(true,
                                                            //     '您的账户还未激活，为方便您使用金融产品及购物车，请尽快激活。'
                                                            //     , '去激活', '看看再说', () => {
                                                            //         this.toPage();
                                                            //     });
                                                        } else if (lastType == '3') {
                                                            DeviceEventEmitter.emit('mb_show', '已激活');
                                                        }
                                                        firstType = lastType;
                                                    },
                                                    (error) => {

                                                    });
                                        }
                                    });
                                }
                            }
                        });

                    }
                });
            }
        }
    }


    // 每一组对应的数据
    _renderSectionHeader(sectionData, sectionId) {
        return (
            <View style={styles.sectionView}>
            </View>
        );
    }

    _renderHeader = () => {
        return (
            <View style={{width:width}}>
                <View style={styles.headerViewStyle}>
                    <TouchableOpacity style={[styles.headerImageStyle]}>
                        <Image
                            source={this.state.headUrl == '' ? require('../../images/mainImage/whiteHead.png') : this.state.headUrl}
                            style={{
                                width: Pixel.getPixel(65),
                                height: Pixel.getPixel(65), resizeMode: 'stretch'
                            }}
                        />
                    </TouchableOpacity>
                    <Text allowFontScaling={false} style={styles.headerNameStyle}>
                        {this.state.name}
                    </Text>
                    <Text allowFontScaling={false} style={styles.headerPhoneStyle}>
                        {componyname}
                    </Text>

                </View>
                {this.renzhengData.RenZhengVisiable != true ? null : <View
                        style={{width:width,height :Pixel.getPixel(40),backgroundColor:'white',flexDirection:'row',alignItems:'center'}}>

                        <TouchableOpacity onPress={() => {
                        if(this.renzhengData.personRenZheng == 2 || this.renzhengData.personRenZheng == 1){
                            //0-> 未审核 1->审核中 2->通过  3->未通过

                        }else {
                            this._gerenrenzheng();
                        }
                    }} activeOpacity={0.8}
                                          style={{width:Pixel.getPixel(375/2.0-1),height :Pixel.getPixel(40),backgroundColor:'white',flexDirection:'row',alignItems:'center'}}>
                            <Image
                                source={this.renzhengData.personRenZheng == 2  ? require('../../images/login/gerenyirenzheng.png') : require('../../images/login/gerenweirenzheng.png')}
                                style={{
                                width: Pixel.getPixel(27),
                                height: Pixel.getPixel(20),
                                resizeMode: 'stretch',
                                marginLeft:Pixel.getPixel(37)
                            }}
                            />
                            <Text allowFontScaling={false} style={{marginLeft:Pixel.getPixel(7)}}>个人

                                <Text allowFontScaling={false}
                                      style={{color:this.mColor[this.renzhengData.personRenZheng]}}

                                >
                                    {this._getRenZhengResult(this.renzhengData.personRenZheng)}

                                </Text>
                            </Text>
                        </TouchableOpacity>

                        <Image source={require('../../images/login/xuxian.png')}
                               style={{width:Pixel.getPixel(1),height :Pixel.getPixel(22),}}/>

                        <TouchableOpacity onPress={() => {
                        if(this.renzhengData.enterpriseRenZheng == 2  || this.renzhengData.enterpriseRenZheng == 1){
                            //0-> 未审核 1->审核中 2->通过  3->未通过


                        }else {
                            this._qiyerenzheng();
                        }
                    }} activeOpacity={0.8}
                                          style={{width:Pixel.getPixel(375/2.0-1),height :Pixel.getPixel(40),backgroundColor:'white',flexDirection:'row',alignItems:'center'}}>
                            <Image
                                source={this.renzhengData.enterpriseRenZheng == 2  ? require('../../images/login/qiyeyirenzheng.png') : require('../../images/login/qiyeweirenzheng.png')}
                                style={{
                                width: Pixel.getPixel(27),
                                height: Pixel.getPixel(20),
                                resizeMode: 'stretch',
                                marginLeft:Pixel.getPixel(37)
                            }}
                            />
                            <Text allowFontScaling={false} style={{marginLeft:Pixel.getPixel(7)}}>企业

                                <Text allowFontScaling={false}

                                      style={{color:this.mColor[this.renzhengData.enterpriseRenZheng]}}

                                >
                                    {this._getRenZhengResult(this.renzhengData.enterpriseRenZheng)}

                                </Text>
                            </Text>

                        </TouchableOpacity>

                    </View>}


            </View>
        )
    }

    selectPhotoTapped = () => {
        if (Platform.OS == 'android') {
            this._rePhoto();
        } else {
            ImagePicker.showImagePicker(options, (response) => {
                if (response.didCancel) {
                } else if (response.error) {
                } else if (response.customButton) {
                } else {
                    let source = {uri: response.uri};
                    this.setState({
                        headUrl: source,
                    });
                }
            });
        }
    }
    _qiyerenzheng = () => {
        this.navigatorParams.name = 'EnterpriseCertificate'
        this.navigatorParams.component = EnterpriseCertificate
        this.navigatorParams.params.callBack = this.allRefresh
        this.navigatorParams.params.qiye_id = BASE_ID[0]
        console.log('1111111111111111111');

        console.log(this.navigatorParams.params.qiye_id);
        console.log('1111111111111111111');
        this.props.callBack(this.navigatorParams);
    };
    _getRenZhengResult = (result) => {
        let renzheng = '(未认证)';
        if (result == 1) {
            renzheng = '(审核中)';
        }
        if (result == 2) {
            renzheng = '(已认证)';
        }
        if (result == 3) {
            renzheng = '(未通过)';
        }
        return renzheng;

    };
    _gerenrenzheng = () => {
        this.navigatorParams.name = 'PersonCertificate'
        this.navigatorParams.component = PersonCertificate
        this.navigatorParams.params.callBack = this.allRefresh

        this.props.callBack(this.navigatorParams);
    };

    _labelPress = () => {
        this.imageSource.openModal();
    };

    _rePhoto = () => {
        this.imageSource.openModal();
    };

    _cameraClick = () => {
        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {
            } else if (response.error) {
            } else if (response.customButton) {
            } else {
                let source = {uri: response.uri};
                this.setState({
                    headUrl: source,
                });
            }
        });
    }

    _galleryClick = () => {
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
            } else if (response.error) {
            } else if (response.customButton) {
            } else {
                let source = {uri: response.uri};
                this.setState({
                    headUrl: source,
                });
            }
        });
    }

}


const styles = StyleSheet.create({


    headerViewStyle: {

        height: Pixel.getPixel(190),
        width: width,
        backgroundColor: fontAndClolr.COLORB0,
        alignItems: 'center',

    },
    headerImageStyle: {

        width: Pixel.getPixel(65),
        height: Pixel.getPixel(65),
        marginTop: Pixel.getPixel(45),
        justifyContent: 'center',
        alignItems: 'center',

    },
    headerNameStyle: {

        color: 'white',
        fontSize: Pixel.getFontPixel(15),
        marginTop: Pixel.getPixel(10),
        marginBottom: Pixel.getPixel(10),
        fontWeight: 'bold'
    },
    headerPhoneStyle: {
        color: 'white',
        fontSize: Pixel.getFontPixel(12),
    },
    container: {

        flex: 1,
        marginTop: Pixel.getPixel(0),   //设置listView 顶在最上面
        backgroundColor: fontAndClolr.COLORA3,
    },
    listStyle: {},
    sectionView: {
        height: Pixel.getPixel(10),
        backgroundColor: fontAndClolr.COLORA3,
        justifyContent: "center"
    },
    sectionTitle: {
        marginLeft: 16,
    },
    rowView: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomColor: fontAndClolr.COLORA4,
        borderBottomWidth: 1
    },
    rowLeftImage: {
        width: Pixel.getPixel(26),
        height: Pixel.getPixel(26),
        marginLeft: Pixel.getPixel(15),
        resizeMode:'contain'
    },
    rowjiantouImage: {
        width: Pixel.getPixel(15),
        height: Pixel.getPixel(15),
        marginRight: Pixel.getPixel(15),

    },
    rowTitle: {
        flex: 1,
        fontSize: Pixel.getFontPixel(fontAndClolr.LITTLEFONT28),
        marginLeft: Pixel.getPixel(20),
        color: '#000',

    }

});