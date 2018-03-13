/**
 * Created by yujinzhong on 2017/5/15.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ListView,
    Image,
    Text
} from 'react-native';
import AllNavigatior from '../../component/AllNavigationView'
import {CommnetListItem, CommentHandItem, commnetStyle, CommenButton, CGDCarItems} from './component/ComponentBlob'
import {
    width,
    fontadapeSize,
    adapeSize,
    STATECODE,
    PAGECOLOR,
    getRowData,
    getSectionData,
} from './component/MethodComponent'
import  AllNavigationView from '../../component/AllNavigationView';
import WebScene from '../../main/WebScene';
import BaseComponent from '../../component/BaseComponent';
import {request} from '../../utils/RequestUtil'
import *as apis from '../../constant/appUrls'
import ImagePageView from 'react-native-viewpager'
import AmountConfirm from './AmountConfirm';
import PurchaseLoanStatusScene from './PurchaseLoanStatusScene';
import DDCarInfoCheckScene from "./DDCarInfoCheckScene";
import {LendSuccessAlert, ModalAlert, DDModalAlert} from './component/ModelComponent'
let ControlState = [];
let loan_code;
import ContractInfoScene from './ContractInfoScene';

export default class DDDetailScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        const ds = new ListView.DataSource(
            {
                getRowData: getRowData,
                getSectionHeaderData: getSectionData,
                rowHasChanged: (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
            }
        )//
        const ImageData = new ImagePageView.DataSource({pageHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRowsAndSections(this.titleNameBlob({}, [])),
            renderPlaceholderOnly: STATECODE.loading,
        }
        this.carData = {
            sell_city_id: '',
            brand_id: '',
            model_id: '',
            series_id: '',
            frame_number: '',
            car_color: '',
            mileage: '',
            init_reg: '',
            rev_user_id: '',
            register_user_id: '',
            purchas_price: '',
            bind_type: '',
            // obd_number: '',
            payment_id: '',
            base_id: '',
            info_id: '',
            isCarinvoice: '',
            // obd_bind_status: '',
            // obd_audit_status: '',
            auto_ownership_status: '',//车辆权属审核状态
            order_ownership_status: '',//车辆权属提交状态
            is_mortgagor: '',
            is_new: '',
            file_list: [],

            // obd_track_url: ''
        };
    }

    initFinish() {
        this.getLendInfo();
    }

    /**
     * 获取借款详情
     * getLendInfo
     **/
    getLendInfo = () => {

        let maps = {
            api: apis.GET_APPLY_INFO,
            loan_code: this.props.financeNo,

        };

        request(apis.FINANCE, 'Post', maps)
            .then((response) => {
                    let tempjson = response.mjson.data;
                    ControlState = this.confimOrderState(parseInt(tempjson.payment_status), parseInt(tempjson.aduitstatus), parseInt(tempjson.status))
                    this.getCarListInfo(tempjson);
                },
                (error) => {

                    this.setState({
                        renderPlaceholderOnly: STATECODE.loadError
                    })
                    if (error.mycode != -300 || error.mycode != -500) {
                        this.props.showToast(error.mjson.msg);

                    } else {

                        this.props.showToast('服务器连接有问题')
                    }
                });


    }
    /**
     * 获取车辆列表
     * getCarListInfo
     **/
    getCarListInfo = (lendInfo) => {
        let maps = {
            api: apis.DDAUTOLIST,
            payment_number: this.props.financeNo,//借款单号
            platform_order_number: this.props.orderNo,//平台订单号
        };
        request(apis.FINANCE, 'Post', maps)
            .then((response) => {
                    let tempjson = response.mjson.data;
                    if (tempjson.list.length > 0) {
                        this.carData.base_id = tempjson.list[0].base_id;
                        this.carData.frame_number = tempjson.list[0].frame_number;
                        // this.carData.obd_bind_status = tempjson.list[0].obd_bind_status;
                        // this.carData.obd_audit_status = tempjson.list[0].obd_audit_status;
                        // this.carData.obd_number = tempjson.list[0].obd_number;
                        this.carData.auto_ownership_status = tempjson.list[0].auto_ownership_status;
                        this.carData.order_ownership_status = tempjson.list[0].order_ownership_status;
                        this.carData.is_mortgagor = tempjson.list[0].is_mortgagor;
                        this.carData.is_new = tempjson.list[0].is_new;
                        this.carData.info_id = tempjson.list[0].info_id;
                        // this.carData.obd_track_url = tempjson.list[0].obd_track_url;
                    }

                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRowsAndSections(this.titleNameBlob(lendInfo, tempjson.list)),
                        renderPlaceholderOnly: STATECODE.loadSuccess
                    })
                },
                (error) => {

                    this.setState({
                        renderPlaceholderOnly: STATECODE.loadError
                    })
                    if (error.mycode != -300 || error.mycode != -500) {
                        this.props.showToast(error.mjson.msg);

                    } else {

                        this.props.showToast('服务器连接有问题')
                    }
                });

    }

    /**
     * 点击取消借款，确定，取消借款
     * canclelend
     **/
    canclelend = () => {

        let maps = {
            api: apis.CANCEL_LOAN,
            loan_code: this.props.financeNo
        };
        this.props.showModal(true);
        request(apis.FINANCE, 'Post', maps)
            .then((response) => {
                    this.props.showModal(false);
                    this.cancleSuccess.setModelVisible(true);
                },
                (error) => {
                    this.props.showModal(false)
                    if (error.mycode != -300 || error.mycode != -500) {
                        this.props.showToast(error.mjson.msg);

                    } else {

                        this.props.showToast('服务器连接有问题')
                    }
                });

    }

    /**
     * 根据取回的数据，对数据源进行封装
     * titleNameBlob
     **/
    titleNameBlob = (jsonData, carData) => {
        loan_code = jsonData.loan_code;
        let dataSource = {};
        let section1 = [
            {title: '借款单号', key: jsonData.loan_code},
            {title: '状态', key: jsonData.payment_status_str},
            {title: '产品类型', key: jsonData.product_type},
            {title: '借款金额', key: jsonData.payment_loanmny_str},
            {title: '借款费率', key: jsonData.payment_rate_str},
            {title: '借款期限', key: jsonData.loanperiodstr},
            {title: '用款时间', key: jsonData.use_time_str},
        ]
        dataSource['section1'] = section1
        if (carData.length > 0) {
            let section2 = [
                {title: '订单号', key: this.props.orderNo},
            ]
            dataSource['section2'] = section2;

            let tempCarDate = [];

            carData.map((item) => {

                tempCarDate.push(
                    {
                        brand_name: item.brand_name,
                        icon: item.cover.icon,
                        frame_number: item.frame_number,
                        price: item.first_assess_loan,//放款额
                        // obd_bind_status: item.obd_bind_status,//车牌号
                        info_id: item.info_id,
                        model_name: item.model_name,
                        init_reg: item.init_reg,
                        base_id: item.base_id,
                        mileage: item.mileage,
                        invoice_upload_status: item.invoice_upload_status,
                        // obd_audit_status: item.obd_audit_status,
                        invoice_audit_status: item.invoice_audit_status
                    }
                )
            })
            dataSource['section3'] = tempCarDate;
            let section4;
	        //=================================================关闭OBD入口========================================================================
	        // if (carData[0].is_new == 1) {
            //     section4 = [
            //         {
            //             title: 'OBD设备',
            //             key: this.OBDtransferToString(carData[0].obd_audit_status, carData[0].obd_bind_status)
            //         },
            //         {
            //             title: '车辆权属',
            //             key: this.OBDtransferToString(carData[0].auto_ownership_status, carData[0].order_ownership_status)
            //         },
            //
            //     ]
            // } else {
            //     section4 = [
            //         {
            //             title: 'OBD设备',
            //             key: this.OBDtransferToString(carData[0].obd_audit_status, carData[0].obd_bind_status)
            //         },
            //
            //
            //     ]
            // }
	        //=================================================关闭OBD入口========================================================================

	        if (carData[0].is_new == 1) {
		        section4 = [

			        {
				        title: '车辆权属',
				        key: this.OBDtransferToString(carData[0].auto_ownership_status, carData[0].order_ownership_status)
			        },

		        ]
	        } else {
		        section4 = [

		        ]
	        }
            dataSource['section4'] = section4;
        }
        return dataSource;
    }
    /**
     * 根据后台返回，将数据进行转换，也可以判断车辆权属，只能用在详情页！！！！！
     * OBDtransferToString
     **/
    OBDtransferToString = (audit, bind) => {
        let status;

        if (audit == 0) {
            status = '未审核';
        } else if (audit == 1) {
            status = '已通过';
        }

        return status;
    }
    /**
     * 根据后台返回的状态，判断下面按钮的显示。。
     * confimOrderState
     **/
    confimOrderState = (state, isComplete, hetong) => {
        let NameBlobs = [];

        if (state == 30 || state == 32 || state == 50 || state == 52) {
            NameBlobs = ['取消借款']
        } else if (state == 42) {
            if (hetong == 2) {
                NameBlobs = ['取消借款', '签署合同']
            } else if (hetong == 1) {
                NameBlobs = ['取消借款']
            } else {
                NameBlobs = ['查看合同']
            }

        }

        return NameBlobs;
    }

    /**
     * 绘制界面的row
     * renderRow
     **/
    renderRow = (rowData, sectionID, rowId, highlightRow) => {

        if (sectionID === 'section1') {

            if (rowData.title === '状态') {

                return (
                    <CommentHandItem warpstyle={{height: adapeSize(44)}} leftTitle={rowData.title}
                                     showValue={rowData.key} textStyle={{color: PAGECOLOR.COLORA1}} handel={() => {

                        navigatorParams = {
                            name: 'PurchaseLoanStatusScene',
                            component: PurchaseLoanStatusScene,
                            params: {
                                loanNumber: this.props.financeNo,
                                loanType : "6"
                            }
                        }
                        this.toNextPage(navigatorParams);

                    }}/>
                )
            }
            return (
                <CommnetListItem leftTitle={rowData.title} showValue={rowData.key}/>
            );

        }
        if (sectionID === 'section2') {
            return (
                <View style={[styles.commentHandeItem, {height: adapeSize(44)}] }>
                    <Text allowFontScaling={false} style={styles.commentListItemLeft}>{rowData.title}</Text>
                    <Text allowFontScaling={false}
                          style={[styles.commentListItemRight, {color: PAGECOLOR.COLORA1}]}>{rowData.key}</Text>
                </View>
            )
        }
        if (sectionID === 'section3') {
            return (<CGDCarItems url={rowData.icon} title={rowData.model_name}
                                 invoice_upload_status={2}
                                 obd_bind_status={2}
                                 date={""}
            />)
        }
        if (sectionID === 'section4') {
            // if (rowData.title === 'OBD设备') {
            //
            //     return (
            //         <CommentHandItem warpstyle={{height: adapeSize(44)}} leftTitle={rowData.title}
            //                          showValue={rowData.key} textStyle={{color: PAGECOLOR.COLORA1}} handel={() => {
            //
            //                              this.toNextPage({
            //                              name: 'WebScene',
            //                              component: WebScene,
            //                              params: {webUrl: this.carData.obd_track_url}
            //                 })
            //
            //         }}/>
            //     )
            // }
            if (rowData.title === '车辆权属') {
                return (
                    <CommentHandItem warpstyle={{height: adapeSize(44)}} leftTitle={rowData.title}
                                     showValue={rowData.key} textStyle={{color: PAGECOLOR.COLORA1}} handel={() => {
            this.toNextPage({
                name: 'DDCarInfoCheckScene',//DDCarInfoCheckScene
                component: DDCarInfoCheckScene,
                params: {
                    carData: this.carData,
                    platform_order_number: this.props.orderNo,//平台订单号
                    info_id: this.carData.info_id,

                }
            });

    }}/>
                )
            }
        }

    }
    /**
     * 绘制界面的SectionHeader
     * SectionHeader
     **/
    renderSectionHeader = (sectionData, sectionID) => {

        if (sectionID === 'section2') {

            return (
                <View style={styles.section2Style}>
                    <Text allowFontScaling={false} style={styles.sectionText}>订单信息</Text>
                </View>
            )
        }
        return (
            <View style={styles.sectionStyle}>
            </View>
        )
    }
    /**
     * 绘制界面的Separator分割线
     * Separator
     **/
    renderSeparator = (sectionID, rowId, adjacentRowHighlighted) => {

        let separtrorHegigth = 1;
        if (rowId === '1') {
            separtrorHegigth = 10;
        }
        return (
            <View key={`${sectionID}-${rowId}`} style={{
                height: adjacentRowHighlighted ? 2 : separtrorHegigth,
                backgroundColor: PAGECOLOR.COLORA3
            }}>
            </View>
        )
    }
    /*
     * 底部按钮点击判断
     * buttonClick
     **/
    buttonClick = (title) => {
        if (title == '确认金额') {
            this.toNextPage({
                name: 'AmountConfirm',
                component: AmountConfirm,
                params: {
                    loan_code: loan_code,
                    callback: () => {
                        this.getLendInfo();
                    }
                },
            })
        } else if (title == '签署合同') {
            this.qianshuhetong.setModelVisible(true);
        } else if (title == '查看合同') {
            this.toNextPage({
                name: 'ContractInfoScene', component: ContractInfoScene,
                params: {loan_code: loan_code, showButton: false}
            })
        } else if (title == '取消借款') {

            this.cancle.setModelVisible(true);
        }
    }

    /**
     * 绘制界面
     * render
     **/
    render() {

        if (this.state.renderPlaceholderOnly !== STATECODE.loadSuccess) {
            return ( <View style={styles.container}>
                {this.loadView()}
                <AllNavigatior title='借款详情' backIconClick={() => {
                    this.backPage();
                }}/>

            </View>);
        }

        let tempBlobs = [];
        if (ControlState.length > 0) {
            let lengegth = ControlState.length - 1
            ControlState.map((item, index) => {

                tempBlobs.push(<CommenButton key={item}
                                             textStyle={index == lengegth ? {color: 'white'} : {color: PAGECOLOR.COLORB0}}
                                             buttonStyle={index == lengegth ? styles.buttonStyleFill : styles.buttonStyleNotFill}
                                             onPress={() => {

                                                 this.buttonClick(item);
                                             }} title={item}/>)
            })

        }
        return (

            <View style={styles.container}>
                <ListView
                    style={commnetStyle.ListWarp}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderSeparator={this.renderSeparator}
                    renderSectionHeader={this.renderSectionHeader}
                />
                <View style={[commnetStyle.bottomWarp, styles.buttonsFlex]}>{tempBlobs}</View>
                <AllNavigationView title='借款详情' backIconClick={() => {
                    this.backPage();
                }}/>

                <ModalAlert ref={(deleteCar) => {
                    this.cancle = deleteCar
                }} title='取消借款' subtitle='您确定要取消借款' confimClick={(setHide) => {
                    setHide(false);
                    this.canclelend();
                }} cancleClick={(setHide) => {
                    setHide(false)
                }}/>


                <DDModalAlert ref={(deleteCar) => {
                    this.qianshuhetong = deleteCar
                }} title='提示' subtitle='确认签署后，融资申请不可撤销，已付款项不可退款' sureTitle='确认' cancelTitle='再想想' confimClick={(setHide) => {
                    setHide(false);
			        this.toNextPage({
				name: 'ContractInfoScene', component: ContractInfoScene,
				params: {loan_code: loan_code, showButton: true,callbackfresh: () => {
                    this.initFinish();
                }}
			})
                }} cancleClick={(setHide) => {
                    setHide(false)
                }}/>


                <LendSuccessAlert title="取消成功" subtitle='恭喜您取消成功' ref={(success) => {
                    this.cancleSuccess = success
                }} confimClick={() => {
                    this.props.backRefresh();
                    if(this.props.FromScene == "FinanceScene"){
                    	 this.backToTop();
                    }else {
                    	this.backPage();
                    }
                }}/>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {

        flex: 1,
        backgroundColor: PAGECOLOR.COLORA3
    },
    ImageBackView: {
        backgroundColor: 'white'

    },
    buttonsFlex: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'row'

    },

    thumbTitle: {
        marginTop: adapeSize(16),
        marginBottom: adapeSize(12),
        fontSize: fontadapeSize(15),
        marginLeft: adapeSize(14),
    },
    thumb: {
        backgroundColor: 'white',
        height: adapeSize(250),
        width: width - adapeSize(24),
        marginLeft: adapeSize(14),
        marginRight: adapeSize(14)
    },
    sectionStyle: {
        backgroundColor: PAGECOLOR.COLORA3,
        height: adapeSize(1),
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    section2Style: {

        backgroundColor: PAGECOLOR.COLORA3,
        height: adapeSize(30),
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    sectionText: {

        marginLeft: adapeSize(14),
        color: PAGECOLOR.COLORA2
    },
    buttonStyleFill: {

        height: adapeSize(32),
        backgroundColor: PAGECOLOR.COLORB0,
        marginRight: adapeSize(15),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        borderRadius: 5,
        width: adapeSize(80)
    },
    buttonStyleNotFill: {

        height: adapeSize(32),
        backgroundColor: 'white',
        marginRight: adapeSize(15),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        borderRadius: 5,
        width: adapeSize(80),
        borderColor: PAGECOLOR.COLORB0,
        borderWidth: 1


    },
    commentListItemLeft: {
        paddingLeft: adapeSize(15),
        textAlign: 'left',
        color: '#9e9e9e',
        flex: 0.3,
    },

    commentListItemRight: {
        paddingRight: adapeSize(15),
        textAlign: 'right',
        color: 'black',
        flex: 0.7,
    },
    commentHandeItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
    },


})