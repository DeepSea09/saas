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
let movies = {};
import BaseComponent from '../../component/BaseComponent';
import NavigationView from '../../component/AllNavigationView';
import RepaymentInfoTopItem from './component/RepaymentInfoTopItem';
import RepaymentInfoDateItem from './component/RepaymentInfoDateItem';
import RepaymentInfoContentItem from './component/RepaymentInfoContentItem';
import RepaymentInfoBottomItem from './component/RepaymentInfoBottomItem';
import AllBottomItem from './component/AllBottomItem';
import MyButton from '../../component/MyButton';
import ServerMoneyListModal from '../../component/ServerMoneyListModal';
let moneyList = [];
let nameList = [];
let adjustLsit = [];
import {request} from '../../utils/RequestUtil';
import * as Urls from '../../constant/appUrls';
import RepaymentModal from '../../component/RepaymentModal';
export  default class PurchaseLoanStatusScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        let mList = ['1', '2', '3', '4', '5', '6','7'];
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let date = new Date();
        let seperator1 = "/";
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        this.state = {
            source: ds.cloneWithRows(mList),
            renderPlaceholderOnly: 'blank',
            loan_day: '',
            loan_dayStr: currentdate
        };
    }

    componentWillUnmount() {
        moneyList = [];
        nameList = [];
        adjustLsit = [];
    }

    initFinish = () => {
        this.getData();
    }

    allRefresh = () => {
        moneyList = [];
        nameList = [];
        adjustLsit = [];
        this.setState({renderPlaceholderOnly: 'loading'});
        this.getData();
    }

    getData = () => {
        let maps = {
            api: Urls.NEWREPAYMENT_CREDIT_APPLY_REPAYMENT,
            loan_number: this.props.loan_number,
        };
        request(Urls.FINANCE, 'Post', maps)
            .then((response) => {
                    movies = response.mjson.data;
                    moneyList.push({name: '贷款本金', data: movies.loan_mny_str});
                    moneyList.push({name: '计息天数', data: movies.loan_day+'天'});
                    moneyList.push({name: '综合费率', data: movies.loan_rebate+'%'});
                    moneyList.push({name: '利息总额', data: movies.interest_total});
                    moneyList.push({name: '已还利息', data: movies.interest});
                    moneyList.push({name: '贷款利息', data: movies.interest_other})
                    moneyList.push({name: '服务费', data: movies.all_fee});

                    nameList.push({name: '渠道名称', data: movies.qvdaoname});
                    nameList.push({name: '还款账户', data: movies.bank_info.repaymentaccount});
                    nameList.push({name: '开户行', data: movies.bank_info.bank});
                    nameList.push({name: '开户支行', data: movies.bank_info.branch});
                    nameList.push({name: '还款账号', data: movies.bank_info.repaymentnumber});
                    nameList.push({name: '保证金', data: movies.bondmny});

                    adjustLsit.push({name: '使用优惠券数量', data: movies.coupon_info.coupon_number});
                    adjustLsit.push({name: '使用优惠券金额', data: movies.coupon_info.coupon_usable});
                    adjustLsit.push({name: '优惠券还息金额', data: movies.coupon_info.coupon_repayment});
                    this.setState({renderPlaceholderOnly: 'success', loan_day: movies.loan_day});
                },
                (error) => {
                    this.setState({renderPlaceholderOnly: 'error'});
                });
    }

    buttonParams = {
        buttonType: MyButton.TEXTBUTTON,
        parentStyle: styles.parentStyle,
        childStyle: styles.childStyle,
        opacity: 0.7,
        content: '申请还款',
        mOnPress: () => {
            this.props.showModal(true);
            let maps = {
                api: Urls.NEWREPAYMENT_APPLY_REPAYMENT,
                loan_number: this.props.loan_number,
                use_time: this.state.loan_dayStr
            };
            request(Urls.FINANCE, 'Post', maps)
                .then((response) => {
                        if(response.mjson.data.is_open_cash_account=='1'){
                            this.props.showToast('申请成功');
                            this.allRefresh();
                        }else{
                            this.props.showModal(false);
                            this.refs.repaymentmodal.changeShowType(true,'申请还款成功!系统将从您的账户扣款,' +
                                '请保证账户足额,超过还款日期仍未充值,提前还款自动取消');
                        }
                    },
                    (error) => {
                        if (error.mycode == -300 || error.mycode == -500) {
                            this.props.showToast('申请失败');
                        } else {
                            this.props.showToast(error.mjson.msg);
                        }

                    });
        }
    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        }
        return (
            <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1}}>
                <NavigationView
                    title="还款详情"
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
                {movies.paymen_status == '0' ? this.props.from == 'SingleRepaymentPage' ?
                        <MyButton {...this.buttonParams}/> : <View/> : <View/>}
                <ServerMoneyListModal ref="servermoneylistmodal"/>
                <RepaymentModal ref="repaymentmodal" callBack={()=>{
                    this.allRefresh();
                }}/>
            </View>
        );
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor:fontAndColor.COLORA3,alignItems: 'center'}}>
                {this.loadView()}
                <NavigationView
                    title="还款详情"
                    backIconClick={this.backPage}
                />
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
                <RepaymentInfoDateItem loanday={movies.loan_day} status={movies.paymen_status} callBack={(time)=>{
                    let selecttime = time/1000;
                    let lasttime = parseFloat(Date.parse(movies.dead_line)/1000);
                    let firsttime = parseFloat(movies.loan_time);
                    if(selecttime>=lasttime){
                        selecttime = lasttime-(60*60*24)
                    }else{
                       if(selecttime-firsttime<(10*60*60*24)){
                            selecttime = firsttime+(10*60*60*24);
                        }
                    }
                    let date = new Date(selecttime*1000);
                    let seperator1 = "/";
                    let month = date.getMonth() + 1;
                    let strDate = date.getDate();
                    if (month >= 1 && month <= 9) {
                        month = "0" + month;
                    }
                    if (strDate >= 0 && strDate <= 9) {
                        strDate = "0" + strDate;
                    }
                    let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
                    let newList = ['1', '2', '3', '4', '5', '6','7'];
                    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                    this.setState({
                        source: ds.cloneWithRows(newList),
                        loan_day:Math.ceil((selecttime-parseFloat(movies.loan_time))/60/60/24),
                        loan_dayStr:currentdate
                    });
                }}/>
            )
        } else if (rowId == 2) {
            return (
                <RepaymentInfoContentItem items={moneyList} onPress={()=>{
                        this.refs.servermoneylistmodal.changeShowType(true,movies.list_fee);
                }}/>
            )
        }else if (rowId == 3) {
            return (
                <RepaymentInfoContentItem items={adjustLsit}/>
            )
        } else if (rowId == 4) {
            return (
                <RepaymentInfoContentItem items={nameList}/>
            )
        } else if (rowId == 5) {
            let name = '';
            let money = 0;
            let formula = '';
            if(parseFloat(movies.all_fee)>0){
                money = (parseFloat(movies.loan_mny)
                +parseFloat(movies.loan_mny)*parseFloat(movies.loan_rebate)/100/360*
                this.state.loan_day-parseFloat(movies.bondmny)-parseFloat(movies.interest)+parseFloat(movies.all_fee)).toFixed(2);
                name = '应还总额=本金+本金*综合费率/360*计息天数-保证金-已还利息'+'+服务费';
                formula = '='+movies.loan_mny+'+'
                    +movies.loan_mny+'*'+movies.loan_rebate/100+'/360*'
                    +this.state.loan_day+'-'+movies.bondmny+'-'+movies.interest+'+'+movies.all_fee
            }else{
                money = (parseFloat(movies.loan_mny)
                +parseFloat(movies.loan_mny)*parseFloat(movies.loan_rebate)/100/360*
                this.state.loan_day-parseFloat(movies.bondmny)-parseFloat(movies.interest)).toFixed(2);
                name = '应还总额=本金+本金*综合费率/360*计息天数-保证金-已还利息';
                formula = '='+movies.loan_mny+'+'
                    +movies.loan_mny+'*'+movies.loan_rebate/100+'/360*'
                    +this.state.loan_day+'-'+movies.bondmny+'-'+movies.interest;
            }
            return (
                <RepaymentInfoBottomItem ref="RepaymentInfoBottomItem"
                                         allMoney={money}
                                         formula={formula}
                                         formulaStr={name}
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