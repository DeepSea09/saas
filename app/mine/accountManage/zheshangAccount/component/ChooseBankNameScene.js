/**
 * Created by dingyonggang on 2017/10/27.
 */
import React, {Component} from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    InteractionManager,
    TouchableWithoutFeedback,
    RefreshControl,
    ListView,
    Keyboard,
} from "react-native";
import BaseComponent from "../../../../component/BaseComponent";
import NavigationBar from "../../../../component/NavigationBar";
import * as FontAndColor from "../../../../constant/fontAndColor";
import PixelUtil from "../../../../utils/PixelUtil";
import MyButton from "../../../../component/MyButton";
import {request} from "../../../../utils/RequestUtil";
import * as AppUrls from "../../../../constant/appUrls";
import StorageUtil from "../../../../utils/StorageUtil";
import * as StorageKeyNames from "../../../../constant/storageKeyNames";
import TextInputItem from './TextInputItem'
import CardPhoneSmsScene from '../openAccount/CardPhoneSmsScene'
import ProvinceListScene from '../../../../carSource/ProvinceListScene'
import * as fontAndColor from '../../../../constant/fontAndColor';
import SText from './SaasText'

let Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');
let Pixel = new PixelUtil();
let Platform = require('Platform');


let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
let selectedBank = {}
let selectedCity = {}
let selectedHeadBank = {}
let page = 0;
let totalPage = 1
let total = 0
let banks = []
let old_t = ''  //查询过的关键字
let old_p = 1  //查询过的页数
let loadType = 0;


export default class ChooseBankNameScene extends BaseComponent {

    constructor(props) {
        super(props);

        this.state = {
            renderPlaceholderOnly: true,
            value: '',
            source: ds.cloneWithRows([]),
            isRefreshing: false,
            headValue: ''
        }
    }

    componentWillUnmount() {


         selectedBank = {}
         selectedCity = {}
         selectedHeadBank = {}
         page = 0;
         totalPage = 1
         total = 0
         banks = []
         old_t = ''  //查询过的关键字
         old_p = 1  //查询过的页数
         loadType = 0;

    }


    initFinish = () => {
        InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: false});
        });
    }


    render() {
        if (this.state.renderPlaceholderOnly) {
            return ( <TouchableWithoutFeedback onPress={() => {
                this.setState({
                    show: false,
                });
            }}>
                <View style={{flex: 1, backgroundColor: FontAndColor.COLORA3}}>
                    <NavigationBar
                        leftImageShow={false}
                        leftTextShow={true}
                        leftText={""}
                        centerText={'开户行'}
                        rightText={""}
                    />
                </View>
            </TouchableWithoutFeedback>);
        }

        return (
            <View style={{flex: 1, backgroundColor: FontAndColor.COLORA3}}>
                <NavigationBar
                    leftImageShow={true}
                    leftTextShow={false}
                    centerText={'开户行'}
                    rightText={"确定"}
                    rightTextCallBack={() => {
                        if (this.state.value.length <= 0) {
                            this.props.showToast('请选择开户行名称');
                            return;
                        }
                        this.props.callBack(selectedBank, selectedHeadBank);
                        this.backPage();
                    }}
                    leftImageCallBack={this.backPage}
                />

                {
                    this.props.bank_card_no == '' ?
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 15,
                            paddingHorizontal: 15,
                            backgroundColor: 'white'
                        }}>
                            <TextInput
                                ref='sub_bank_name'
                                style={{flex: 1, height: 45}}
                                placeholder={'请输入开户行名称'}
                                underlineColorAndroid={"#00000000"}
                                value={this.state.headValue}
                                onChangeText={(t) => {
                                    console.log(t)
                                    this.refreshing(t)
                                    this.setState({
                                        headValue: t,
                                    })

                                }}
                            />
                        </View>
                        : null

                }

                <TouchableOpacity
                    activeOpacity={.9}
                    onPress={() => {

                        console.log(selectedHeadBank)
                        if ((this.props.bank_card_no == '') && (selectedHeadBank.subbankname == '' || typeof (selectedHeadBank.subbankname) == 'undefined'||this.state.headValue == '')) {
                            this.props.showToast('请输入开户行名称');
                        } else if((this.props.bank_card_no == '') && (selectedHeadBank.subbankname !== this.state.headValue)){
                            this.props.showToast('请输入正确的开户行名称');
                        }else {
                            this.toNextPage({

                                component: ProvinceListScene,
                                name: 'ProvinceListScene',
                                params: {
                                    isZs: true,
                                    checkedCityClick: this.checkedCityClick,
                                    unlimitedAction: this.cityUnlimitedAction,
                                    isSelectProvince: true,
                                }
                            })
                        }
                    }}
                >

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: 15,
                        paddingHorizontal: 15,
                        backgroundColor: 'white'
                    }}>
                        <TextInput
                            ref='bank_name'
                            style={{flex: 1, height: 45}}
                            editable={false}
                            placeholder={'请选择城市'}
                            underlineColorAndroid={"#00000000"}
                            value={this.state.value}

                        />
                        <Image source={require('../../../../../images/mainImage/celljiantou.png')}/>
                    </View>
                </TouchableOpacity>

                <ListView
                    enableEmptySections={true}
                    style={{marginTop: 10, flex: 1}}
                    renderRow={this.renderRow}
                    renderSeparator={this.renderSeparator}
                    removeClippedSubviews={false}
                    dataSource={this.state.source}
                    onEndReachedThreshold={1}
                    onEndReached={this.loadMore}
                    renderFooter={this.renderFooter}


                />
            </View>
        )
    }

    // t:text
    // p:page
    loadHeadBank = (t, p) => {

        loadType = 0;

        if (!this.isChinese(t)) {
            this.setState({
                isRefreshing: false,
            })
            return;
        }

        if (t == old_t && p == old_p) {
            this.setState({
                isRefreshing: false,
            })
            return
        }

        if(p === 1){
            page = p
        }

        old_t = t
        old_p = p

        this.setState({
            isRefreshing: true,
        })

        request(AppUrls.ZS_HEAD_BANK, 'post', {
            page: p,
            rows: 20,
            subbankName: t
        }).then((response) => {
            if (p === 1) {
                banks = []
            }
            banks.push(...response.mjson.data.info_list)
            totalPage = response.mjson.data.totalpage;
            total = response.mjson.data.total;

            this.setState({
                isRefreshing: false,
                source: ds.cloneWithRows(banks)
            })

        }, (error) => {
            this.setState({
                isRefreshing: false,
            })

            this.props.showToast(error.mjson.msg);
        })

    }

    isChinese = (t) => {


        if (t == '' || typeof (t) == 'undefined') {
            return
        }

        let re = /[^\u4e00-\u9fa5]/;
        if (re.test(t)) {
            return false;
        }
        return true;
    }

    refreshing = (t) => {

        if (this.props.bank_card_no == '') {
            this.loadHeadBank(t, 1)
        } else {

            this.loadBanks(selectedCity.city_id, 1)
        }
    }


    renderSeparator(sectionId, rowId) {

        return (
            <View style={styles.Separator} key={sectionId + rowId}>
            </View>
        )
    }

    renderFooter = () => {

        let sub_bank_name = this.state.value

        return <View style={{height: 40, justifyContent: 'center', alignItems: 'center'}}>
            {
                banks.length > 0 ?
                    <SText>{ banks.length >= total ? '已全部加载' : '加载更多...'}</SText>
                    :

                    this.props.bank_card_no == ''?

                        !(!this.state.value && !this.state.headValue) ?
                            <SText>暂无数据</SText>
                            : null

                        : selectedCity.city_name ?
                        <SText>暂无数据</SText>
                        : null

            }

        </View>

    }

    loadMore = () => {
        page++;
        if (page > totalPage) {

            this.setState({
                source: ds.cloneWithRows(banks)
            })
            return
        }
        if (this.props.bank_card_no == ''&&loadType == 0) {
            this.loadHeadBank(this.state.headValue, page)
        } else {
            if (this.props.bank_card_no == '') {
                this.loadChildBank(page)
            } else {

                this.loadBanks(selectedCity.city_id, page)
            }
        }
    }

    renderRow = (data, sectionId, rowId) => {
        return <TouchableOpacity
            onPress={() => {
                if (this.props.bank_card_no == '') {

                    if (!data.bankname) {
                        selectedHeadBank = data;
                        this.setState({
                            headValue: data.subbankname,
                        })
                    } else {
                        selectedBank = data;
                        this.setState({
                            value: data.bankname,
                        })
                    }

                } else {
                    selectedBank = data;
                    this.setState({
                        value: data.bankname,
                    })
                }
            }}
        >
            <View style={{backgroundColor: 'white', height: 40, paddingHorizontal: 15, justifyContent: 'center'}}>
                <SText style={{}}>{data.bankname ? data.bankname : data.subbankname}</SText>
            </View>
        </TouchableOpacity>

    }

    checkedCityClick = (city) => {
        selectedCity = city;

        if (this.props.bank_card_no == '') {
            banks = []
            page = 1
            this.loadChildBank(1)
        } else {
            this.refreshing()

        }
    }


    loadChildBank = (p) => {

        loadType = 1;

        request(AppUrls.ZS_SUB_BANK, 'post', {
            page: p,
            rows: 20,
            subbankNo: selectedHeadBank.subbankno,
            cityCode: selectedCity.city_id

        }).then((response) => {

            banks.push(...response.mjson.data.info_list)
            totalPage = response.mjson.data.totalpage;
            total = response.mjson.data.total;
            this.setState({
                isRefreshing: false,
                source: ds.cloneWithRows(banks)
            })

            if(banks.length<=0){

                selectedBank = {}
                this.setState({
                    value:''
                })
            }

        }, (error) => {
            this.setState({
                isRefreshing: false,
            })
            this.props.showToast(error.mjson.msg);
        })
    }


    loadBanks = (city, p) => {

        if(p ===1){
            banks = []
            page = 1
        }

        this.setState({
            isRefreshing: true,
        })

        let params = {
            bankCardNo: this.props.bank_card_no,
            cityCode: city,
            page: page,
            rows: 20,
        }

        request(AppUrls.ZS_PARSE_BANK, 'post', params).then((response) => {

            banks.push(...response.mjson.data.info_list)
            totalPage = response.mjson.data.totalpage;
            total = response.mjson.data.total;
            console.log(response)
            this.setState({
                isRefreshing: false,
                source: ds.cloneWithRows(banks)
            })

        }, (error) => {
            this.setState({
                isRefreshing: false,
            })
            this.props.showToast(error.mjson.msg);
        })

    }
}


const styles = StyleSheet.create({

    Separator: {
        backgroundColor: fontAndColor.COLORA3,
        height: Pixel.getPixel(1),

    }

})