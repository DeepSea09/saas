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
import SupervisionTabBar from './SupervisionTabBar';
import SupervisionTotalScene from './SupervisionTotalScene';
import SupervisionPayScene from './SupervisionPayScene';
import SupervisionNoPayScene from './SupervisionNoPayScene';
import NavigationView from '../../component/AllNavigationView';
import {request} from '../../utils/RequestUtil';
import * as Urls from '../../constant/appUrls';

export default class SupervisionFeeScene extends BaseComponent {

    constructor(props) {
        super(props);
        this.payNum = '';
        this.noPays = '',
            this.state = {
                renderPlaceholderOnly: 'blank',
                noPays: 0,
            };
    }


    initFinish = () => {
        // this.getData();
    }


    getData = () => {
        let maps = {
            api: Urls.GET_CONTRACT_REMIND,
            opt_user_id: this.props.opt_user_id,
            opt_merge_id: this.props.opt_merge_id
        };
        request(Urls.FINANCE, 'Post', maps)
            .then((response) => {
                    if (response.mjson.data != null) {
                    }
                    this.setState({renderPlaceholderOnly: 'success'});
                },
                (error) => {
                    this.setState({renderPlaceholderOnly: 'success'});
                });
    }
    _showLoadingModal = () => {
        this.props.showModal(true);
    }
    _closeLoadingModal = () => {
        this.props.showModal(false);
    }

    showToast = (msg) => {
        this.props.showToast(msg);
    }

    freshNopayData = (noPayNum) => {
        this.noPayLength.freshPagNum(noPayNum);
    }
    freshPayData = (payNum) => {
        this.noPayLength.freshPayNum(payNum);
    }
    firstFreshPayData = (nums) => {
        console.log('+++++',nums)
        this.noPayLength.firstFreshNum(nums);
    }

    render() {

        return (
            <View style={{width: width, height: height, backgroundColor: fontAndColor.COLORA3}}>
                <ScrollableTabView
                    style={{marginTop: Pixel.getTitlePixel(64)}}
                    initialPage={0}
                    locked={true}
                    scrollWithoutAnimation={true}
                    renderTabBar={() =>
                        <SupervisionTabBar
                            ref={(ref) => {
                                this.noPayLength = ref
                            }}
                            noPayNum={this.noPays}
                            payNum={this.payNum}
                            tabName={["全部", "未支付", "已支付"]}/>}>
                    <SupervisionTotalScene
                        tabLabel="total"
                        freshData={this.firstFreshPayData}
                        navigator={this.props.navigator} tabNum={'0'}
                        closeLoading={this._closeLoadingModal}
                        callBack={this.props.callBack}
                        showToast={this.showToast}
                        showLoading={this._showLoadingModal}/>
                    <SupervisionNoPayScene
                        freshData={this.freshNopayData}
                        tabLabel="no-pay"
                        callBack={this.props.callBack}
                        navigator={this.props.navigator} tabNum={'1'}
                        closeLoading={this._closeLoadingModal}
                        showToast={this.showToast}
                        showLoading={this._showLoadingModal}/>
                    <SupervisionPayScene
                        freshData={this.freshPayData}
                        tabLabel="pay"
                        navigator={this.props.navigator} tabNum={'2'}/>


                </ScrollableTabView>
                <NavigationView
                    title="监管费"
                    backIconClick={this.backPage}
                />
            </View>
        );
    }

    /**
     * from @zhaojian
     *
     * 页面加载完成前的loading
     **/
    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height, backgroundColor: fontAndColor.COLORA3}}>
                {this.loadView()}
                <NavigationView
                    title="监管费"
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