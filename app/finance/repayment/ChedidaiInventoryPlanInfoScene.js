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
    InteractionManager
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import BaseComponent from '../../component/BaseComponent';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import RepaymenyTabBar from './component/RepaymenyTabBar';
import NavigationView from '../../component/AllNavigationView';
import * as fontAndColor from '../../constant/fontAndColor';
import PlanListScene from './PlanListScene';
import ChedidaiRepaymentInfoPage from '../page/ChedidaiRepaymentInfoPage';
import PlanInfoScene from '../page/PlanInfoPage';
export  default class ChedidaiInventoryPlanInfoScene extends BaseComponent {

    constructor(props, context) {
        super(props, context);
        this.state = {renderPlaceholderOnly: 'blank'};
    }


    initFinish = () => {
        this.setState({renderPlaceholderOnly: 'success'});
    }



    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        }
        return (
            <View style={{flex:1}}>
                <ScrollableTabView
                    style={{marginTop: Pixel.getTitlePixel(64), flex: 1}}
                    initialPage={0}
                    locked={true}
                    renderTabBar={() => <RepaymenyTabBar tabName={["还款详情", "还款计划"]}/>}
                >
                    <ChedidaiRepaymentInfoPage planid={this.props.planid} ref="ChedidaiRepaymentInfoPage" callBack={(params)=>{
                        params.params.refresh = ()=>{this.refresh();}
                        this.toNextPage(params)
                    }} loan_id={this.props.loan_id} loan_number={this.props.loan_number}  tabLabel="ios-paper"/>

                    <PlanInfoScene planid={this.props.planid} ref="planinfoscene" callBack={(params)=>{
                        params.params.refresh = ()=>{this.refresh();}
                        this.toNextPage(params)
                    }} showToast={(content)=>{
                        this.props.showToast(content)
                    }} showModal={(value)=>{
                        this.props.showModal(value);
                    }}  loan_id={this.props.loan_id}
                                    loan_number={this.props.loan_number}
                                    tabLabel="ios-paper1"></PlanInfoScene>
                </ScrollableTabView>
                <NavigationView
                    title="还款详情"
                    backIconClick={this.backPage}
                />
            </View>
        );

    }

    refresh =()=>{
        this.refs.ChedidaiRepaymentInfoPage.allRefresh();
        this.refs.planinfoscene.allRefresh();
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor: fontAndColor.COLORA3}}>
                <NavigationView
                    title="还款详情"
                    backIconClick={this.backPage}
                />
            </View>
        );
    }

    navigatorParams = {
        name: "PlanListScene",
        component: PlanListScene,
        params: {}
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