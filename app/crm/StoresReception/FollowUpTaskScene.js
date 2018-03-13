/**
 * Created by hanmeng on 2017/8/6.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Platform,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import NavigationView from '../../component/AllNavigationView';
import * as fontAndColor from '../../constant/fontAndColor';
import BaseComponent from '../../component/BaseComponent';
import BaseInfoItem from "./component/item/BaseInfoItem";
import BuyerDemandItem from "./component/item/BuyerDemandItem";
import CommunicationRecordItem from "./component/item/CommunicationRecordItem";
import * as AppUrls from "../../constant/appUrls";
import {request} from "../../utils/RequestUtil";
import CurrentTaskInfoItem from "./component/item/CurrentTaskInfoItem";
import FollowTaskInfoItem from "./component/item/FollowTaskInfoItem";

export default class FollowUpTaskScene extends BaseComponent {

    /**
     *  constructor
     * @param props
     **/
    constructor(props) {
        super(props);
        this.taskInfo = {};
        this.state = {
            //dataSource: [],
            renderPlaceholderOnly: 'blank'
        };
    }

    /**
     *
     **/
    initFinish = () => {
        //console.log('this.taskInfo=====', this.props.rowData);
        /*        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
         this.setState({
         dataSource: ds.cloneWithRows(['0', '1']),
         renderPlaceholderOnly: 'success'
         });*/
        this.loadData();
    };


    /**
     *
     **/
    loadData = () => {
        let maps = {
            custI: this.props.rowData.id
        };
        let url = AppUrls.SELECT_FLOW;
        request(url, 'post', maps).then((response) => {
            this.taskInfo = response.mjson.data;
            //const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            this.setState({
                //dataSource: ds.cloneWithRows(['0', '1']),
                //isRefreshing: false,
                renderPlaceholderOnly: 'success'
            });
        }, (error) => {
            this.setState({
                //isRefreshing: false,
                renderPlaceholderOnly: 'error'
            });
        });
    };

    /**
     *  render
     * @returns {XML}
     **/
    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (
                <View style={styles.container}>
                    {this.loadView()}
                    <NavigationView
                        backIconClick={this.backPage}
                        title="跟进任务"
                        renderRihtFootView={this._navigatorRightView}
                    />
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <NavigationView
                        backIconClick={this.backPage}
                        title="跟进任务"
                        renderRihtFootView={this._navigatorRightView}/>
                    {/*                    <ListView
                     removeClippedSubviews={false}
                     style={{backgroundColor: fontAndColor.COLORA3, marginTop: Pixel.getTitlePixel(75)}}
                     dataSource={this.state.dataSource}
                     renderRow={this._renderRow}
                     renderSeparator={this._renderSeperator}/>*/}
                    {Platform.OS === 'android' ?
                        <ScrollView
                            style={{backgroundColor: fontAndColor.COLORA3, marginTop: Pixel.getTitlePixel(75)}}
                            ref={(ref) => {
                                this.scrollView = ref
                            }} keyboardDismissMode='none'>

                            {this._renderRow()}

                        </ScrollView> :
                        <KeyboardAvoidingView behavior={'position'} style={{marginTop: Pixel.getTitlePixel(75)}}>
                            <ScrollView
                                style={{backgroundColor: fontAndColor.COLORA3}}
                                ref={(ref) => {
                                    this.scrollView = ref
                                }} keyboardDismissMode='on-drag'>

                                {this._renderRow()}

                            </ScrollView>
                        </KeyboardAvoidingView>}
                </View>
            );
        }
    }


    /**
     *
     * @returns {XML}
     * @private
     **/
    _renderRow = () => {
        return (
            <View style={styles.container}>
                <CurrentTaskInfoItem
                    ref={(ref) => {
                        this.currentTaskInfoItem = ref
                    }}
                    navigator={this.props.navigator}
                    data={this.taskInfo} rowData={this.props.rowData}/>
                <View style={{backgroundColor: fontAndColor.COLORA3, height: Pixel.getPixel(10)}}/>
                <FollowTaskInfoItem
                    ref={(ref) => {
                        this.followTaskInfoItem = ref
                    }}
                    navigator={this.props.navigator}
                    data={this.taskInfo} rowData={this.props.rowData}/>
            </View>
        )
    };

    /**
     *
     * @returns {XML}
     * @private
     **/
    _navigatorRightView = () => {
        return (
            <TouchableOpacity
                style={{
                    width: Pixel.getPixel(53), height: Pixel.getPixel(27),
                    justifyContent: 'center', alignItems: 'flex-end',
                }}
                activeOpacity={0.8}
                onPress={() => {
                    this.submitFlowInfo();
                }}>
                <Text style={{color: fontAndColor.COLORA3}}>保存</Text>
            </TouchableOpacity>
        );
    }

    /**
     *
     **/
    submitFlowInfo = () => {
        this.props.showModal(true);
        let maps = [];
        let clientInfo = [];
        let inputData = this.followTaskInfoItem.getItemData();
        if (this.checkInfo(inputData)) {
            for (let key in inputData) {
                clientInfo.push(inputData[key]);
            }
            for (let i = 0; i < clientInfo.length; i++) {
                maps[clientInfo[i].parameter] = clientInfo[i].value;
            }
            maps['custI'] = this.props.rowData.id;
            maps['custN'] = '';
            maps['custP'] = '';
            /*        let maps = {
             custP: "",
             custN: "",
             custI: 4,
             custFlow: "跟踪内容11111",
             customerStatus: 4,
             remind: "11112222", // 日期
             comeIf: ""
             };*/
            let url = AppUrls.CUSTOMER_FLOW;
            request(url, 'post', maps).then((response) => {
                // 提交成功并刷新信息页数据
                this.props.showModal(false);
                this.props.callBack();
                this.backPage();
            }, (error) => {
                //this.props.showModal(false);
                this.props.showToast("提交跟进任务失败");
            });
        }
    };

    /**
     *  18131137998
     **/
    checkInfo = (data) => {
        for (let key in data) {
            //console.log('this.clientInfo===data===', key + data[key]);
            if (data[key].value == '') {
                this.props.showToast(data[key].name + '不能为空');
                return false;
            }
        }
        return true;
    };
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: fontAndColor.COLORA3
    }
})