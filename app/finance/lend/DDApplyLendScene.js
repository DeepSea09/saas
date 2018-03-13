import React, {Component} from "react";
import {StyleSheet, View, ListView, Image, Text} from "react-native";
import AllNavigatior from "../../component/AllNavigationView";
import AllNavigationView from "../../component/AllNavigationView";
import {CommnetListItem, CommentHandItem, commnetStyle, CommenButton, CGDCarItems} from "./component/ComponentBlob";
import WebScene from "../../main/WebScene";
import StorageUtil from "../../utils/StorageUtil";
import {
    width,
    fontadapeSize,
    adapeSize,
    STATECODE,
    PAGECOLOR,
    getRowData,
    getSectionData
} from "./component/MethodComponent";
import BaseComponent from "../../component/BaseComponent";
import {request} from "../../utils/RequestUtil";
import *as apis from "../../constant/appUrls";
import DDCarInfoScene from "./DDCarInfoLendAndEditScene";
import OBDDevice from "./OBDDevice";
import * as StorageKeyNames from "../../constant/storageKeyNames";
let ControlState = [];
// let obdEdit = true;
let qsEdit = true;
export default class DDApplyLendScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        const ds = new ListView.DataSource({
            getRowData: getRowData,
            getSectionHeaderData: getSectionData,
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        })
        this.PostData = {
            dateLimit: '',
            rate: '',
            loan_life_type: '',
        }
        this.showData = {
            rateAndLifeAndType: [],
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

        this.state = {
            dataSource: ds.cloneWithRowsAndSections(this.titleNameBlob({}, [])),
            renderPlaceholderOnly: STATECODE.loading,
        }
    }

    initFinish() {
        this.getLendInfo();
    }

    /**
     * from @yujinzhong
     *
     *
     * 获取订单融资申请前置数据,费率，借款额度
     **/
    getLendInfo = () => {
        let maps;
        if (this.props.sceneName == "FinanceScene") {
            maps = {
                api: apis.GET_APPLY_INFO,
                apply_type: '6',
                loan_code: this.props.loan_code,
            };
        } else {
            maps = {
                api: apis.GET_APPLY_LOAN_DATA,
                apply_type: '6',
            };
        }


        request(apis.FINANCE, 'Post', maps)
            .then((response) => {
                ControlState = ["申请借款"];
                this.getCarListInfo(response.mjson.data);

            }, (error) => {
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
     * from @yujinzhong
     * @param lendInfo
     *
     *
     * 获取到借款费率      申请获取车辆列表
     **/
    getCarListInfo = (lendInfo) => {

        this.showData.rateAndLifeAndType = lendInfo.product_period;
        this.PostData.dateLimit = this.showData.rateAndLifeAndType[0].loan_life;
        this.PostData.rate = this.showData.rateAndLifeAndType[0].rate;
        this.PostData.loan_life_type = this.showData.rateAndLifeAndType[0].loan_life_type;
        let maps;
        if (this.props.sceneName == "FinanceScene") {
            maps = {
                api: apis.DDAUTOLIST,
                platform_order_number: this.props.orderNo,//平台订单号
                payment_number: this.props.loan_code,
            };
        } else {
            maps = {
                api: apis.DDAUTOLIST,
                platform_order_number: this.props.orderNo//平台订单号
            };
        }
        request(apis.FINANCE, 'Post', maps)
            .then((response) => {
                this.props.showModal(false);
                let tempjson = response.mjson.data;
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

                this.setState({
                    dataSource: this.state.dataSource.cloneWithRowsAndSections(this.titleNameBlob(lendInfo, tempjson.list)),
                    renderPlaceholderOnly: STATECODE.loadSuccess
                })
            }, (error) => {
                this.props.showModal(false);
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
     * from @huangning
     *
     *
     **/
    titleNameBlob = (jsonData, carData) => {
        if(jsonData.product_period){
            this.period = jsonData.product_period[0].loan_life + jsonData.product_period[0].loan_life_type;
        }else {
            this.period = jsonData.loan_life;
        }


        this.payment_audit_reason = jsonData.payment_audit_reason;
        let dataSource = {};
        let section1;

        if (this.props.sceneName == "FinanceScene") {
            section1 = [
                {title: '借贷类型', key: jsonData.product_type},
                {title: '借款费率', key: jsonData.payment_rate_str},
                {title: '保证金余额', key: jsonData.deposit_amount + "元"},
                {title: '保证金比例', key: jsonData.deposit_rate + '%'},
                {title: '借款期限', key: this.period},
                {title: '借款额度', key: "30000" + "~" + jsonData.max_loanmny + "元"},
            ]
        } else {
            section1 = [
                {title: '借贷类型', key: jsonData.product_type},
                {title: '借款费率', key: jsonData.rate},
                {title: '保证金余额', key: jsonData.deposit_amount + "元"},
                {title: '保证金比例', key: jsonData.deposit_rate + '%'},
                {title: '借款期限', key: this.period},
                {title: '借款额度', key: "30000" + "~" + jsonData.paymnet_maxloanmny + "元"},
            ]
        }


        dataSource['section1'] = section1
        if (carData.length > 0) {
            let section2 = [{title: '订单号', key: this.props.orderNo}]
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
            //             key: this.OwnershiptransferToString(carData[0].auto_ownership_status, carData[0].order_ownership_status)
            //         },
            //
            //     ]
            // } else {
            //     section4 = [
            //         {
            //             title: 'OBD设备',
            //             key: this.OBDtransferToString(carData[0].obd_audit_status, carData[0].obd_bind_status)
            //         },
            //     ]
            // }
	        //=================================================关闭OBD入口========================================================================


	        if (carData[0].is_new == 1) {
	            section4 = [
	                {
	                    title: '车辆权属',
	                    key: this.OwnershiptransferToString(carData[0].auto_ownership_status, carData[0].order_ownership_status)
	                },

	            ]
	        } else {
	            section4 = [

	            ]
	        }

            dataSource['section4'] = section4;
            dataSource['section5'] = ['如您提交资料和信息，预计1个工作日内告知您可融资金额'];
        }
        return dataSource;
    }

    /**
     * 根据后台返回，将数据进行转换
     * OBDtransferToString
     **/
    // OBDtransferToString = (audit, bind) => {
    //     let status;
    //     if (this.props.sceneName == 'FinanceScene' && obdEdit) {
    //         if (audit == 0) {
    //             status = '未审核';
    //         } else if (audit == 1) {
    //             status = '已通过';
    //         } else if (audit == 2) {
    //             status = '未通过';
    //         }
    //     } else {
    //         if (audit == 1) {
    //             status = '已通过';
    //         } else {
    //             if (bind == 0) {
    //                 status = '未绑定';
    //             } else if (bind == 1) {
    //                 status = '已绑定';
    //             } else if (bind == 2) {
    //                 status = '解除绑定';
    //             }
    //         }
    //     }
    //     return status;
    // }

    /**
     * 根据后台返回，将数据进行转换
     * OBDtransferToString
     **/
    OwnershiptransferToString = (audit, bind) => {
        let status;
        if (this.props.sceneName == 'FinanceScene' && qsEdit) {
            if (this.carData.is_mortgagor == 1) {
                status = '已通过';
            } else {
                if (audit == 0) {
                    status = '未审核';
                } else if (audit == 1) {
                    status = '已通过';
                } else if (audit == 2) {
                    status = '未通过';
                }
            }
        } else {
            if (audit == 1) {
                status = '已通过';
            } else {
                if (this.carData.is_mortgagor == 1) {
                    status = '已上传';
                } else {
                    if (bind == 0) {
                        status = '未上传';
                    } else if (bind == 1) {
                        status = '已上传';
                    }
                }
            }
        }
        return status;

    }

    /**
     * 根据封装的数据，显示row
     * renderRow
     **/
    renderRow = (rowData, sectionID, rowId, highlightRow) => {

        if (sectionID === 'section1') {
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
            //     return (
            //         <CommentHandItem warpstyle={{height: adapeSize(44)}} leftTitle={rowData.title}
            //                          showValue={rowData.key} textStyle={{color: PAGECOLOR.COLORA1}} handel={() => {
            //             if (this.carData.obd_audit_status != 1) {
            //                 this.toNextPage({
            //                     name: 'OBDDevice',
            //                     component: OBDDevice,
            //                     params: {
            //                         carData: this.carData,
            //                         fromScene: 'DDApplyLendScene',
            //                         backRefresh: () => {
            //                             //刷新界面
            //                             obdEdit = false;
            //                             this.props.showModal(true);
            //                             this.getLendInfo();
            //                         }
            //                     }
            //                 });
            //             } else {
            //                 this.toNextPage({
            //                     name: 'WebScene',
            //                     component: WebScene,
            //                     params: {webUrl: this.carData.obd_track_url}
            //                 })
            //             }
            //         }}/>
            //     )
            // }
            if (rowData.title === '车辆权属') {
                return (
                    <CommentHandItem warpstyle={{height: adapeSize(44)}} leftTitle={rowData.title}
                                     showValue={rowData.key} textStyle={{color: PAGECOLOR.COLORA1}} handel={() => {
                        if (this.carData.auto_ownership_status != 1) {
                            this.toNextPage({
                                name: 'DDCarInfoScene',//DDCarInfoCheckScene
                                component: DDCarInfoScene,
                                params: {
                                    carData: this.carData,
                                    platform_order_number: this.props.orderNo,//平台订单号
                                    info_id: this.carData.info_id,
                                    backRefresh: () => {
                                        //刷新界面
                                        qsEdit = false;
                                        this.props.showModal(true);
                                        this.getLendInfo();
                                    }
                                }
                            });
                        }
                    }}/>
                )
            }
        }
        if (sectionID === 'section5') {
            return (
            <View style={{width:width,padding:adapeSize(15),paddingTop:adapeSize(10),paddingBottom:adapeSize(10)}}>
                <Text style={{color:'red',fontSize:adapeSize(12)}}>{rowData}</Text>
            </View>)
        }
    }

    /**
     * 根据封装的数据，显示section
     * renderSectionHeader
     **/
    renderSectionHeader = (sectionData, sectionID) => {
        if (sectionID == 'section1') {
            if (this.props.sceneName == "FinanceScene") {
                return (
                    <View style={{
                        backgroundColor: PAGECOLOR.COLORA3,
                        alignItems: 'flex-start',
                        justifyContent: 'center'
                    }}>
                        <Text
                            numberOfLines={2}
                            style={{
                                color: '#ff0000',
                                fontSize: fontadapeSize(14)
                            }}> {'审核未通过：' + this.payment_audit_reason}
                        </Text>
                    </View>
                )
            }
        }
        if (sectionID === 'section2') {
            return (
                <View style={styles.section2Style}>
                    <Text allowFontScaling={false} style={styles.sectionText}>订单信息</Text>
                </View>
            )
        }
        return (
            <View style={styles.sectionStyle}/>
        )
    }

    /**
     * 根据封装的数据，显示分割线
     * renderSeparator
     **/
    renderSeparator = (sectionID, rowId, adjacentRowHighlighted) => {

        return (
            <View key={`${sectionID}-${rowId}`} style={{
                height: 1,
                backgroundColor: PAGECOLOR.COLORA3
            }}>
            </View>
        )
    }

    /**
     * 底部按钮的点击事件
     * buttonClick
     **/
    buttonClick = (title) => {
        // if (title == '申请借款') {
            if (this.props.sceneName == 'FinanceScene') {
                // if (obdEdit) {
                    // if (this.carData.obd_audit_status == 1 || this.carData.obd_audit_status == 0) {// obd 未审核 、审核通过
                    //     if (this.carData.is_new == 1) {
                    //         if (qsEdit) {
                    //             if (this.carData.auto_ownership_status == 1 || this.carData.auto_ownership_status == 0) {
                    //                 this.lendMoneyClick();
                    //             } else if (this.carData.auto_ownership_status == 2) {
                    //                 this.props.showToast("车辆权属审核未通过");
                    //             }
                    //         } else {
                    //             if (this.carData.order_ownership_status == 1) {
                    //                 this.lendMoneyClick();
                    //             } else {
                    //                 if (this.carData.is_mortgagor == 1) {
                    //                     this.lendMoneyClick();
                    //                 } else {
                    //                     this.props.showToast("车辆权属未上传");
                    //                 }
                    //             }
                    //         }
                    //     } else {
                    //         this.lendMoneyClick();
                    //     }
                    // }
                    // else if (this.carData.obd_audit_status == 2) {
                    //     this.props.showToast("0BD审核未通过");
                    // }
	                if (this.carData.is_new == 1) {
		                if (qsEdit) {
			                if (this.carData.auto_ownership_status == 1 || this.carData.auto_ownership_status == 0) {
				                this.lendMoneyClick();
			                } else if (this.carData.auto_ownership_status == 2) {
				                this.props.showToast("车辆权属审核未通过");
			                }
		                } else {
			                if (this.carData.order_ownership_status == 1) {
				                this.lendMoneyClick();
			                } else {
				                if (this.carData.is_mortgagor == 1) {
					                this.lendMoneyClick();
				                } else {
					                this.props.showToast("车辆权属未上传");
				                }
			                }
		                }
	                } else {
		                this.lendMoneyClick();
	                }
                // }
                // else {
                //     if (this.carData.obd_bind_status == 0) {
                //         this.props.showToast("0BD未绑定");
                //     } else if (this.carData.obd_bind_status == 1) {
                //         if (this.carData.is_new == 1) {
                //             if (this.carData.order_ownership_status == 1) {
                //                 this.lendMoneyClick();
                //             } else {
                //                 if (this.carData.is_mortgagor == 1) {
                //                     this.lendMoneyClick();
                //                 } else {
                //                     this.props.showToast("车辆权属未上传");
                //                 }
                //             }
                //         } else {
                //             this.lendMoneyClick();
                //         }
                //     } else if (this.carData.obd_bind_status == 2) {
                //         this.props.showToast("0BD需重新绑定");
                //     }
                // }
            }
            else {
                // if (this.carData.obd_bind_status == 0) {
                //     this.props.showToast("0BD未绑定");
                // } else
                //     if (this.carData.obd_bind_status == 1) {
                    if (this.carData.is_new == 1) {
                        if (this.carData.order_ownership_status == 1) {
                            this.lendMoneyClick();
                        } else {
                            if (this.carData.is_mortgagor == 1) {
                                this.lendMoneyClick();
                            } else {
                                this.props.showToast("车辆权属未上传");
                            }
                        }
                    } else {
                        this.lendMoneyClick();
                    }
                // }
                // else if (this.carData.obd_bind_status == 2) {
                //     this.props.showToast("0BD需重新绑定");
                // }
            }

        // }
    }

    render() {
        if (this.state.renderPlaceholderOnly !== STATECODE.loadSuccess) {
            return ( <View style={styles.container}>
                {this.loadView()}
                <AllNavigatior title='申请借款' backIconClick={() => {
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
                <AllNavigationView title='申请借款' backIconClick={() => {
                    this.backPage();
                }}/>
            </View>
        )
    }

    /**
     * 申请借款
     * lendMoneyClick
     **/
    lendMoneyClick = () => {
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                this.companyId = JSON.parse(data.result).company_base_id;
                let maps;
                if (this.props.sceneName == "FinanceScene") {
                    maps = {
                        api: apis.APPLY_LOAN,
                        apply_type: "6",
                        platform_order_number: this.props.orderNo,
                        company_base_id: this.companyId,
                        car_lists: this.carData.info_id,
                        order_id: this.props.orderId,
                        loan_code: this.props.loan_code,
                        loan_life_type: this.PostData.loan_life_type,
                        rate: this.PostData.rate,
                        loan_life: this.PostData.dateLimit,
                    }
                } else {
                    maps = {
                        api: apis.APPLY_LOAN,
                        apply_type: "6",
                        platform_order_number: this.props.orderNo,
                        company_base_id: this.companyId,
                        car_lists: this.carData.info_id,
                        order_id: this.props.orderId,
                        loan_life_type: this.PostData.loan_life_type,
                        rate: this.PostData.rate,
                        loan_life: this.PostData.dateLimit,
                    }
                }
                this.props.showModal(true);
                request(apis.FINANCE, 'Post', maps)
                    .then((response) => {
                        this.props.showModal(false);
                        // this.apSuccess.setModelVisible(true);
                        this.props.showToast(response.mjson.msg);
                        this.props.callBack();
                        const navigator = this.props.navigator;
                        if (navigator) {
                            for (let i = 0; i < navigator.getCurrentRoutes().length; i++) {
                                if (this.props.sceneName == "FinanceScene") {
                                    if (navigator.getCurrentRoutes()[i].name == 'FinanceScene') {
                                        navigator.popToRoute(navigator.getCurrentRoutes()[i]);
                                        break;
                                    }
                                } else {
                                    if (navigator.getCurrentRoutes()[i].name == 'ProcurementOrderDetailScene') {
                                        navigator.popToRoute(navigator.getCurrentRoutes()[i]);
                                        break;
                                    }
                                }
                            }
                        }
                    }, (error) => {
                        this.props.showModal(false);
                        if (error.mycode != -300 || error.mycode != -500) {
                            this.props.showToast(error.mjson.msg);
                        } else {
                            this.props.showToast('服务器连接有问题')
                        }
                    });
            } else {
                this.props.showToast('申请借款失败');
            }
        });

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
        justifyContent: 'center',
        flexDirection: 'row',
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
        height: adapeSize(40),
        backgroundColor: PAGECOLOR.COLORB0,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        width: adapeSize(width) - adapeSize(20),
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