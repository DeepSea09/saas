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
    ListView
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

export class ClientInfoDetailView extends BaseComponent {

    /**
     *  constructor
     * @param props
     **/
    constructor(props) {
        super(props);
        this.clientInfo = [];
        this.state = {
            rowData: this.props.rowData,
            dataSource: [],
            renderPlaceholderOnly: 'blank'
        };
    }

    componentWillReceiveProps(nextProps) {
        //console.log('componentWillReceivePropsd==-=-componentWillReceiveProps');
        /*this.setState({
            rowData: nextProps.rowData
        });*/
    }

    /**
     *   刷新页面数据
     **/
    refreshData = (data) => {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
            rowData: data,
            dataSource: ds.cloneWithRows(['0', '1', '2']),
            renderPlaceholderOnly: 'success'
        });
        //console.log('datadata====', data);
    };

    /**
     *
     **/
    initFinish = () => {
/*        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
            dataSource: ds.cloneWithRows(['0', '1', '2']),
            renderPlaceholderOnly: 'success'
        });*/
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
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <ListView
                        removeClippedSubviews={false}
                        style={{backgroundColor: '#ffffff'}}
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow}
                        renderSeparator={this._renderSeperator}/>
                    <View style={{
                        height: Pixel.getPixel(1),
                        backgroundColor: fontAndColor.COLORA3
                    }}/>
                    {/*<TouchableOpacity
                        style={{bottom: 0}}
                        onPress={() => {

                        }}>
                        <View style={{
                            backgroundColor: '#ffffff',
                            height: Pixel.getPixel(44),
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Text
                                allowFontScaling={false}
                                style={{
                                    fontSize: Pixel.getFontPixel(17),
                                    color: fontAndColor.COLORB0
                                }}>编辑资料</Text>
                        </View>
                    </TouchableOpacity>*/}
                </View>
            );
        }
    }

    /**
     *
     **/
    _renderSeperator = (sectionID: number, rowID: number, adjacentRowHighlighted: bool) => {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{backgroundColor: fontAndColor.COLORA3, height: Pixel.getPixel(10)}}/>
        )
    }

    /**
     *
     * @param rowData
     * @param selectionID
     * @param rowID
     * @returns {XML}
     * @private
     **/
    _renderRow = (rowData, selectionID, rowID) => {
        //console.log('rowData=========dddd====', this.state.rowData);
        if (rowData === '0') {
            return (
                <BaseInfoItem
                    editState='look'
                    rowData={this.state.rowData}
                    ref={(ref) => {
                        this.baseInfoItem = ref
                    }} navigator={this.props.navigator}/>
            )
        } else if (rowData === '1') {
            return (
                <BuyerDemandItem
                    editState='look'
                    rowData={this.state.rowData}
                    ref={(ref) => {
                        this.buyerDemandItem = ref
                    }} navigator={this.props.navigator}/>
            )
        } else if (rowData === '2') {
            return (
                <CommunicationRecordItem
                    editState='look'
                    rowData={this.state.rowData}
                    ref={(ref) => {
                        this.communicationRecordItem = ref
                    }} navigator={this.props.navigator}/>
            )
        }
    };


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Pixel.getPixel(5),
        backgroundColor: fontAndColor.COLORA3
    }
})