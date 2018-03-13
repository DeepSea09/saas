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
    ListView,
    InteractionManager
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../constant/fontAndColor';
import BaseComponent from '../../component/BaseComponent';
import NavigationView from '../../component/AllNavigationView';
import RepaymentInfoTopItem from './component/PlanInfoTopItem';
import RepaymentInfoContentItem from './component/RepaymentInfoContentItem';
import RepaymentInfoBottomItem from './component/RepaymentInfoBottomItem';
import AllBottomItem from './component/AllBottomItem';
let moneyList = [];
let nameList = [];
let dateList = [];
let movies = {};
import {request} from '../../utils/RequestUtil';
import * as Urls from '../../constant/appUrls';
export  default class PlanInfoScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        let mList = ['1', '2', '3', '4', '5'];
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            source: ds.cloneWithRows(mList),
            renderPlaceholderOnly: 'blank'
        };
    }

    componentWillUnmount() {
        moneyList = [];
        nameList = [];
        dateList = [];
    }

    initFinish = () => {
        this.getData();
    }

    allRefresh = () => {
        moneyList = [];
        nameList = [];
        dateList = [];
        this.setState({renderPlaceholderOnly: 'loading'});
        this.getData();
    }

    getData = () => {
        let maps = {
            api: Urls.REPAYMENT_GET_PLAN_INFO,
            loan_code: this.props.loan_code,
            loan_number: this.props.loan_number,
            plan_id: this.props.plan_id,
            type: this.props.type,
        };
        request(Urls.FINANCE, 'Post', maps)
            .then((response) => {
                    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                     movies = response.mjson.data;
                    dateList.push({name: '付息区间', data: movies.interval});
                    dateList.push({name: '最晚还款日', data: movies.date_str});

                    moneyList.push({name: '贷款本金', data: movies.loan_mny_str});
                    moneyList.push({name: '计息天数', data: movies.loan_day});
                    moneyList.push({name: '综合费率', data: movies.loan_rebate_str});
                    moneyList.push({name: '利息总额', data: movies.interest});
                    moneyList.push({name: '优惠券抵扣金额', data: movies.used_mny_total});

                    nameList.push({name: '渠道名称', data: movies.qvdaoname});
                    nameList.push({
                        name: '还款账户', data: movies.bank_info.repaymentaccount
                        + ''
                    });
                    nameList.push({name: '开户行', data: movies.bank_info.bank + ''});
                    nameList.push({name: '开户支行', data: movies.bank_info.branch + ''});
                    nameList.push({name: '还款账号', data: movies.bank_info.repaymentnumber + ''});
                    if(movies.bondmny=='undefined'){
                        nameList.push({name: '保证金', data: '0'});
                    }else{
                        nameList.push({name: '保证金', data: movies.bondmny});
                    }
                    let mList = ['1', '2', '3', '4'];
                    if(movies.plan_type=='4'){
                        this.setState({
                            source: ds.cloneWithRows(mList),
                            renderPlaceholderOnly: 'success'
                        });
                    }else{
                        this.setState({
                            renderPlaceholderOnly: 'success'
                        });
                    }
                },
                (error) => {
                    this.setState({renderPlaceholderOnly: 'error', isRefreshing: false});
                });
    }


    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        }
        return (
            <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1}}>
                <NavigationView
                    title="计划详情"
                    backIconClick={this.backPage}
                />
                <ListView
                    removeClippedSubviews={false}
                    style={{marginTop: Pixel.getTitlePixel(64)}}
                    dataSource={this.state.source}
                    renderRow={this._renderRow}
                    renderSeparator={this._renderSeparator}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        );
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor:fontAndColor.COLORA3,alignItems: 'center'}}>
                <NavigationView
                    title="计划详情"
                    backIconClick={this.backPage}
                />
                {this.loadView()}
            </View>
        );
    }

    _renderRow = (movie, sectionId, rowId) => {
        if (rowId == 0) {
            return (
                <RepaymentInfoTopItem items={movies}/>
            )
        } else if (rowId == 1) {
            return (
                <RepaymentInfoContentItem items={dateList}/>
            )
        } else if (rowId == 2) {
            return (
                <RepaymentInfoContentItem items={moneyList}/>
            )
        } else if (rowId == 3) {
            return (
                <RepaymentInfoContentItem items={nameList}/>
            )
        } else if (rowId == 4) {
            return (
                <RepaymentInfoBottomItem
                    allMoney={movies.repaymentmny_str}
                    formula={'='+movies.loan_mny+'*'+movies.loan_rebate/100+'/360*'
                                         +movies.loan_day+'-'+movies.bondmny}
                    formulaStr={'应还总额=本金*综合费率/360*计息天数-保证金'}
                />
            )
        } else {
            return (
                <AllBottomItem

                />);
        }

    }

    _renderSeparator(sectionId, rowId) {

        return (
            <View style={styles.Separator} key={sectionId + rowId}>
            </View>
        )
    }

}
const styles = StyleSheet.create({

    image: {
        width: 43,
        height: 43,
    },
    Separator: {
        height: Pixel.getPixel(10),
        backgroundColor: fontAndColor.COLORA3

    },
    margin: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)

    },
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'},
    parentStyle: {
        height: Pixel.getPixel(44),
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        backgroundColor: fontAndColor.COLORB0,
    },
    childStyle: {
        fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
        color: '#ffffff',
    }
})