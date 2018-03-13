/**
 * Created by lhc on 2017/2/21.
 */
//车辆展期


import React, {Component, PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    InteractionManager,
} from 'react-native';
import {CommenButton} from './component/ComponentBlob';
import {adapeSize, fontadapeSize, width} from './component/MethodComponent';
import NavigationBar from '../../component/NavigationBar';
import * as FontAndColor from '../../constant/fontAndColor';
import BaseComponent from '../../component/BaseComponent';
import PixelUtil from '../../utils/PixelUtil';
import *as AppUrls from '../../constant/appUrls';
import {request} from '../../utils/RequestUtil'

var Pixel = new PixelUtil();

export  default class CarOverdue extends BaseComponent {

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: [],
            renderPlaceholderOnly: 'blank',
        }
        this.data = [];
        this.map = new Map();
    }

    initFinish = () => {
        this.getData();
    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (
                <View style={{flex: 1, backgroundColor: FontAndColor.COLORA3}}>
                    <NavigationBar
                        leftImageShow={true}
                        leftTextShow={false}
                        centerText={"申请展期"}
                        rightText={""}
                        leftImageCallBack={this.backPage}/>
                    {this.loadView()}
                </View>
            )
        }

        return (
            <View style={{backgroundColor: FontAndColor.COLORA3, flex: 1}}>
                <NavigationBar
                    leftImageShow={true}
                    leftTextShow={false}
                    centerText={"申请展期"}
                    rightText={""}
                    leftImageCallBack={this.backPage}/>

                <ListView
                    removeClippedSubviews={false}
                    style={{flex: 1}}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderHeader={this.renderHeader}
                    renderSeparator={this.renderSeparator}/>

                <View style={styles.handelWarper}>
                    <CommenButton
                        textStyle={{color: 'white'}}
                        buttonStyle={styles.buttonStyleLeft}
                        onPress={() => {
                            this.doExtension();
                        }} title="申请展期"/>
                    <CommenButton
                        textStyle={{color: 'white'}}
                        buttonStyle={styles.buttonStyleRight}
                        onPress={() => {
                            this.backPage();
                        }} title="取消"/>
                </View>
            </View>
        )
    }

    allRefresh = () => {
        this.setState({renderPlaceholderOnly: 'loading'});
        this.getData();
    }

    renderRow = (rowData, sindex, rowID) => {
        return (
            <TouchableOpacity onPress={() => {
                if (typeof(this.map.get(rowData.auto_id)) == 'undefined') {
                    if ((rowData.status_str + "").indexOf('已申请') > -1) {
                        this.props.showToast("已申请展期");
                    } else {
                        this.map.set(rowData.auto_id, rowData);
                        this.doExtensionPc(rowData.loan_number);
                    }
                } else {
                    this.map.delete(rowData.auto_id);
                }
                this.setState({
                    dataSource: this.ds.cloneWithRows(this.data),
                });
            }}>
                <View style={styles.container}>
                    <View style={styles.containerTop}>
                        <View style={styles.carInfoWarp}>
                            <Text allowFontScaling={false}  numberOfLines={2} style={styles.carType}>{rowData.model_name} </Text>
                            <Text allowFontScaling={false}  style={styles.carFramNum}>{"车牌号:" + rowData.model_name}</Text>
                        </View>
                        {typeof(this.map.get(rowData.auto_id)) == 'undefined' ?
                            <Image style={styles.orderState}
                                   source={require('../../../images/financeImages/unselected.png')}/>
                            :
                            <Image style={styles.orderState}
                                   source={require('../../../images/financeImages/selected.png')}/>

                        }
                    </View>
                    <View style={styles.containerBottom}>
                        <Text allowFontScaling={false} 
                            style={[styles.carFramNum, {flex: 1}]}>{rowData.loan_time + "|" + rowData.status_str}
                        </Text>
                        <Text allowFontScaling={false}  style={styles.price}> {"放款额：" + rowData.loan_mny_fk_str}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    renderHeader = () => {
        return (
            <View style={{
                backgroundColor: 'rgba(255,198,47,0.1)',
                marginBottom: Pixel.getPixel(10),
                height: Pixel.getPixel(34),
                flexDirection: 'row',
                alignItems: 'center',
                width: width,
            }}>

                <Text allowFontScaling={false}  style={{
                    marginLeft: Pixel.getPixel(15),
                    fontSize: Pixel.getFontPixel(12),
                    color: '#fa5741',
                }}>*请选择需要展期的还款</Text>
            </View>
        )
    }

    renderSeparator = (sectionID, rowId, adjacentRowHighlighted) => {
        return (
            <View key={`${sectionID}-${rowId}`} style={{
                height: Pixel.getPixel(10),
                backgroundColor: FontAndColor.COLORA3,
            }}>
            </View>
        )
    }

    getData = () => {
        let maps = {
            api: AppUrls.APPLY_EXTENSION_CARLIST,
            loan_code: "" + this.props.loan_code,
        };
        request(AppUrls.FINANCE, 'Post', maps)
            .then((response) => {
                    if (response.mjson.data == null || response.mjson.data.length <= 0) {
                        this.setState({renderPlaceholderOnly: 'null'});
                    } else {
                        this.setState({
                            renderPlaceholderOnly: 'success',
                            dataSource: this.ds.cloneWithRows(response.mjson.data),
                        });
                        this.data = response.mjson.data;
                    }
                },
                (error) => {
                    if (error.mycode == -300 || error.mycode == -500) {
                        this.props.showToast("网络请求失败");
                        this.setState({
                            renderPlaceholderOnly: 'error',
                        })
                    } else {
                        if (error.mycode == -1) {
                            this.setState({
                                renderPlaceholderOnly: 'null',
                            })
                        } else {
                            this.props.showToast(error.mjson.msg + "");
                            this.setState({
                                renderPlaceholderOnly: 'error',
                            })
                        }
                    }
                }
            )
    }

    doExtension = () => {
        let auto_ids = "";
        if (this.map.size < 1) {
            this.props.showToast("请选择车辆");
        } else {
            for (let key of this.map.keys()) {
                if (auto_ids == '') {
                    auto_ids = key;
                } else {
                    auto_ids = auto_ids + "," + key;
                }
            }
            let maps = {
                api: AppUrls.DO_EXTENSION,
                auto_ids: auto_ids,
                loan_code: "" + this.props.loan_code,
            };
            request(AppUrls.FINANCE, 'Post', maps)
                .then((response) => {
                        this.props.showToast("展期申请成功");
                        this.backPage();
                    }, (error) => {
                        if (error.mjson.code == -300 || error.mjson.code == -500) {
                            this.props.showToast("网络请求失败");
                        } else {
                            this.props.showToast(error.mjson.msg + "");
                        }
                    }
                )
        }
    }

    doExtensionPc = (loan_number) => {
        let maps = {
            api: AppUrls.DO_EXTENSIONPC,
            loan_number: loan_number,
            loan_code: "" + this.props.loan_code,
        };
        request(AppUrls.FINANCE, 'Post', maps)
            .then((response) => {
                }, (error) => {
                }
            )
    }
}


const styles = StyleSheet.create({
    handelWarper: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width - Pixel.getPixel(30),
        flexDirection: 'row',
        backgroundColor: FontAndColor.COLORA3,
        marginBottom: Pixel.getPixel(15),
        marginTop: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15),
        marginRight: Pixel.getPixel(15),
    },
    container: {
        backgroundColor: '#ffffff'
    },
    containerTop: {
        flexDirection: 'row',
        height: adapeSize(76),
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomColor: '#f0eff5',
        borderBottomWidth: 0.5,
        marginLeft: adapeSize(15),
        marginRight: adapeSize(15)
    },
    containerBottom: {
        flexDirection: 'row',
        height: adapeSize(44),
        alignItems: 'center',
        marginLeft: Pixel.getPixel(15),
        marginRight: Pixel.getPixel(15),
    },
    carInfoWarp: {
        flex: 0.8,
    },
    orderState: {
        width: adapeSize(25),
        height: adapeSize(25),
    },
    carType: {
        alignItems: 'flex-start',
        fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT),
        color: FontAndColor.COLORA0,
    },
    carFramNum: {
        fontSize: Pixel.getFontPixel(12),
        color: FontAndColor.COLORA1,
        marginTop: Pixel.getPixel(10),
    },
    orderNum: {
        marginLeft: adapeSize(15),
    },
    price: {
        color: FontAndColor.COLORB2,
    },
    buttonStyleRight: {
        height: adapeSize(44),
        marginLeft: adapeSize(15),
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginRight: 5,
        borderRadius: 5,
        backgroundColor: '#90a1b5'
    },
    buttonStyleLeft: {
        height: adapeSize(44),
        backgroundColor: '#05c5c2',
        marginRight: adapeSize(15),
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginLeft: 5,
        borderRadius: 3,
    },
})
