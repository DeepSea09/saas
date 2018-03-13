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
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../constant/fontAndColor';
import BaseComponent from '../../component/BaseComponent';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import RepaymenyTabBar from './ConstractTabBar';
// import RepaymenyTabBar from '../../finance/repayment/component/RepaymenyTabBar';
import NavigationView from '../../component/AllNavigationView';
import NoneSineScene from '../contractManage/NoneSineScene';
import SingleSignManageScene from '../contractManage/SingleSignManageScene';
import CompleteSignScene from '../contractManage/CompleteSignScene';
import FundSignScene from '../contractManage/FundSignScene';
import ConvertibleBondNoSignScene from '../contractManage/ConvertibleBondNoSignScene';
import ConvertibleBondSignScene from '../contractManage/ConvertibleBondSignScene';
import {request} from '../../utils/RequestUtil';
import * as Urls from '../../constant/appUrls';
import {LendSuccessAlert} from '../../finance/lend/component/ModelComponent'
let first = '';
let last = '';
let show = true;
export  default class SignContractScene extends BaseComponent {

    constructor(props) {
        super(props);
        show = true;
        this.state = {
            renderPlaceholderOnly: 'blank',
        };
    }

    /**
     * from @zhaojian
     *
     * 初始化数据
     **/
    initFinish = () => {
        this.getData();
    }

    /**
     * from @zhaojian
     *
     * 获取网络数据
     **/
    getData = () => {
        first = '';
        last = '';
        let maps = {
            api: Urls.GET_CONTRACT_REMIND,
            opt_user_id: this.props.opt_user_id,
            opt_merge_id: this.props.opt_merge_id
        };
        request(Urls.FINANCE, 'Post', maps)
            .then((response) => {
                    if (response.mjson.data != null) {
                        if (response.mjson.data.wait_ctc_sign_num != null && response.mjson.data.wait_ctc_sign_num != '0') {
                            last = '、(' + response.mjson.data.wait_ctc_sign_num + ')';
                        }
                        if (response.mjson.data.wait_sign_num != null && response.mjson.data.wait_sign_num != '0') {
                            first = '、(' + response.mjson.data.wait_sign_num + ')';
                        }
                    }
                    this.setState({renderPlaceholderOnly: 'success'});
                },
                (error) => {
                    this.setState({renderPlaceholderOnly: 'success'});
                });
    }

    /**
     * from @zhaojian
     *
     * 加载页面
     **/
    render() {
        if (this.state.renderPlaceholderOnly != 'success') {
            return this._renderPlaceholderView();

        }
        return (
            <View style={{width:width,height:height,backgroundColor: fontAndColor.COLORA3}}>
                <ScrollableTabView
                    style={{marginTop: Pixel.getTitlePixel(64)}}
                    initialPage={0}
                    locked={true}
                    scrollWithoutAnimation={true}
                    renderTabBar={() =>
                <RepaymenyTabBar tabName={["未签署"+first, "单方签署",'资金方签署中', "已签署", "微单合同未确认"+last, "微单合同已确认"]}/>}
                >
                    <NoneSineScene tabLabel="ios-paper" opt_user_id={this.props.opt_user_id}
                                   navigator={this.props.navigator}/>

                    <SingleSignManageScene tabLabel="ios-people" opt_user_id={this.props.opt_user_id}
                                           navigator={this.props.navigator}/>

                    <FundSignScene tabLabel="ios-chatboxes11"
                                   opt_user_id={this.props.opt_user_id} navigator={this.props.navigator}/>

                    <CompleteSignScene tabLabel="ios-chatboxes"
                                       opt_user_id={this.props.opt_user_id} navigator={this.props.navigator}/>
                    <ConvertibleBondNoSignScene tabLabel="ios-chatboxes1"
                                                companyname={this.props.companyname}
                                                opt_user_id={this.props.opt_user_id}
                                                opt_merge_id={this.props.opt_merge_id}
                                                navigator={this.props.navigator}/>
                    <ConvertibleBondSignScene tabLabel="ios-chatboxes2"
                                              companyname={this.props.companyname}
                                              opt_merge_id={this.props.opt_merge_id}
                                              opt_user_id={this.props.opt_user_id}
                                              navigator={this.props.navigator}/>
                </ScrollableTabView>
                <LendSuccessAlert ref="modelcomponent" title="提示" subtitle="为保证顺利放款，请确保所有合同签署完成！"/>
                <NavigationView
                    title="合同管理"
                    backIconClick={this.backPage}
                />
            </View>
        );
    }

    /**
     * from @zhaojian
     *
     * 加载完成
     **/
    componentDidUpdate() {
        if (this.state.renderPlaceholderOnly == 'success') {
            if (show) {
                this.refs.modelcomponent.setModelVisible(true);
                show = false;
            }

        }
    }

    /**
     * from @zhaojian
     *
     * 页面加载完成前的loading
     **/
    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor: fontAndColor.COLORA3}}>
                {this.loadView()}
                <NavigationView
                    title="合同管理"
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
    tabView: {
        flex: 1,
        padding: 10,
        backgroundColor: 'red',
    }
})