import React from 'react';
import {
    AppRegistry,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Text,
    Linking,
    NativeModules,
    BackAndroid,
    InteractionManager,
    ListView
} from 'react-native';

import BaseComponent from '../component/BaseComponent';
var {height, width} = Dimensions.get('window');
import * as fontAndColor  from '../constant/fontAndColor';
import  PixelUtil from '../utils/PixelUtil'
let Pixel = new PixelUtil();
import NavigationView from '../component/AllNavigationView';
import GetPermissionUtil from '../utils/GetPermissionUtil';
const GetPermission = new GetPermissionUtil();
import WorkBenchItem from './component/WorkBenchItem';
import StorageUtil from "../utils/StorageUtil";
import * as StorageKeyNames from "../constant/storageKeyNames";
import {request} from '../utils/RequestUtil';
import * as Urls from '../constant/appUrls';
import AuthenticationModal from '../component/AuthenticationModal';
let Platform = require('Platform');
import EnterpriseCertificate from "../mine/certificateManage/EnterpriseCertificate";
import PersonCertificate from "../mine/certificateManage/PersonCertificate";

export default class NonCreditScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            renderPlaceholderOnly: 'blank',
            source: [],
        };
        this.isWorkBenchItemLose = false;

        this.authenOptions = {
            '1':[true,'请先完成认证后再进行操作','取消','','个人认证',this._gerenrenzheng],
            '2':[true,'请先完成认证后再进行操作','取消','','企业认证',this._qiyerenzheng],
            '3':[true,'认证未通过请重新认证，您可以重新认证或联系客服','取消','联系客服','个人认证',this._gerenrenzheng,this.callAciton],
            '4':[true,'认证未通过请重新认证，您可以重新认证或联系客服','取消','联系客服','企业认证',this._qiyerenzheng,this.callAciton],
            '5':[true,'您的认证申请正在审核中，您可查看所提交信息。我们会在一个工作日内向您反馈结果，请稍候。','确定','','',()=>{}],
            '6':[true,'您的认证申请正在审核中，您可查看所提交信息。我们会在一个工作日内向您反馈结果，请稍候。','确定','','',()=>{}],
            '7':[true,'需创建此账号的主账号通过个人认证后进行操作','确定','','',()=>{}],
            '8':[true,'需创建此账号的主账号通过企业认证后进行操作','确定','','',()=>{}],
        };
    }

    //联系客服
    callAciton = ()=>{
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

    //企业认证页面
    _qiyerenzheng = () => {
        this.props.callBack({name:'EnterpriseCertificate',
            component:EnterpriseCertificate,params:{}});
    };

    //个人认证页面
    _gerenrenzheng = () => {
        this.props.callBack({name:'PersonCertificate',
            component:PersonCertificate,params:{}});
    };


    handleBack = () => {
        NativeModules.VinScan.goBack();
        return true;
    }

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
        InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: 'loading'});
            this.initFinish();
        });
    }

    initFinish = () => {
        GetPermission.getAllList((perList) => {
            let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            this.setState({
                renderPlaceholderOnly: 'success',
                source: ds.cloneWithRows(perList)
            });
        })
    }


    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        }
        return (
            <View style={{flex: 1,backgroundColor:fontAndColor.COLORA3}}>
                <ListView
                    removeClippedSubviews={false}
                    dataSource={this.state.source}
                    style={{marginTop: Pixel.getTitlePixel(64)}}
                    renderRow={this._renderRow}
                    renderSeparator={this._renderSeparator}
                    showsVerticalScrollIndicator={false}
                />
                <NavigationView
                    title="工作台"
                />
                <AuthenticationModal ref="authenmodal"/>
            </View>
        );
    }

    _renderRow = (movie, sectionId, rowId) => {
        return (
            <WorkBenchItem items={movie} callBack={(params)=>{
                if(this.isWorkBenchItemLose) {return;}
                this._checkAuthen(params)}
            }/>
        )
    }

    //认证功能验证
    _checkAuthen = (params)=>{


        this.isWorkBenchItemLose = true;
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    enterprise_id: datas.company_base_id,
                    function_id: params.id,
                    type:'app'
                };
                request(Urls.USER_IDENTITY_GET_INFO, 'post', maps).then((response) => {
                    this.isWorkBenchItemLose = false;
                    if(response.mjson.data.auth == 0){
                        this.props.callBack(params);
                    }else{
                        this.refs.authenmodal.changeShowType(...this.authenOptions[response.mjson.data.auth+'']);
                    }
                }, (error) => {
                    this.isWorkBenchItemLose = false;
                    this.props.showToast(error.msg);
                });
            } else {
                this.isWorkBenchItemLose = false;
                this.props.showToast('获取企业信息失败');
            }
        });
    }

    _renderSeparator(sectionId, rowId) {

        return (
            <View style={{width:width,height:1,backgroundColor: fontAndColor.COLORA3}} key={sectionId + rowId}>
            </View>
        )
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor: fontAndColor.COLORA3}}>
                {this.loadView()}
                <NavigationView
                    title="工作台"
                />
            </View>
        );
    }
}

