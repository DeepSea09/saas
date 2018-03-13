import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View, TouchableOpacity, Dimensions, Image, ListView, RefreshControl
} from 'react-native';
import BaseComponent from '../../../component/BaseComponent';
import NavigatorView from '../../../component/AllNavigationView';

const {width} = Dimensions.get('window');
import * as FontAndColor from '../../../constant/fontAndColor';
import PixelUtil from '../../../utils/PixelUtil';
import MyButton from "../../../component/MyButton";
import GetCarerManageEditScene from '../../getCarerManage/GetCarerManageEditScene';
import {request} from '../../../utils/RequestUtil';
import * as Urls from '../../../constant/appUrls';
import StorageUtil from "../../../utils/StorageUtil";
import * as StorageKeyNames from "../../../constant/storageKeyNames";

const selected_icon = require('../../../../images/selected_icon.png');
const no_select_icon = require('../../../../images/no_select_icon.png');
const Pixel = new PixelUtil();
let accountInfo = [{name: '张大大', tel: '13000000001', isSelect: true}, {
    name: '李小小',
    tel: '13000000001',
    isSelect: false
}]
let allSouce = [];
export default class SelectPickUp extends BaseComponent {
    constructor(props) {
        super(props);
        this.pickups = [];
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            renderPlaceholderOnly: false,
            accountInfo: accountInfo,
            dataSource: this.ds.cloneWithRows(accountInfo),
            isRefreshing: false,
        }
    }

    initFinish() {
        //allSouce=[];
        this.getData();
    }

    getData = () => {
        allSouce = [];
        this.pickups=[];
        let maps = {
            company_id: global.companyBaseID,
        };

        request(Urls.GET_GETER_LIST, 'Post', maps)
            .then((response) => {
                    this.props.showModal(false);
                    if (response.mycode === 1) {
                        accountInfo = [];
                        allSouce.push(...response.mjson.data);
                        allSouce.map((data) => {
                            accountInfo.push({
                                name: data.name,
                                phone: data.phone,
                                id: data.id,
                                isSelect: false
                            });
                        });
                        if(this.props.isSelect){
                            this.getStoreGeter()
                        }else{
                            this.setState({
                                dataSource: this.ds.cloneWithRows(accountInfo),
                                isRefreshing: false,
                                renderPlaceholderOnly: 'success'
                            });
                        }
                    } else {
                        this.setState({renderPlaceholderOnly: 'error'});
                    }
                },
                (error) => {
                    this.props.showModal(false);
                    this.setState({renderPlaceholderOnly: 'error', isRefreshing: false});
                });
    };

    getStoreGeter = () => {
        let maps = {
            company_id: global.companyBaseID,
            order_id:this.props.orderId,
        };
        request(Urls.GETSTOREGETER, 'Post', maps)
            .then((response) => {
                    this.props.showModal(false);
                    if (response.mycode === 1) {
                        let data=response.mjson.data;
                        accountInfo.map((value,index)=>{
                            data.map((value1)=>{
                                if(value.name==value1.name&& value.phone==value1.phone){
                                    accountInfo[index].isSelect=true;
                                    this.pickups.push(value.id);
                                }
                            });
                        })
                        this.setState({
                            dataSource: this.ds.cloneWithRows(accountInfo),
                            isRefreshing: false,
                            renderPlaceholderOnly: 'success'
                        });
                    } else {
                        this.setState({renderPlaceholderOnly: 'error'});
                    }
                },
                (error) => {
                    this.props.showModal(false);
                    this.setState({renderPlaceholderOnly: 'error', isRefreshing: false});
                });
    };

    refreshingData = () => {
        allSouce = [];
        this.setState({isRefreshing: true});
        this.getData();
    };

    allRefresh = () => {
        this.setState({
            renderPlaceholderOnly: 'loading',
        });
        this.getData();
    }

    itemClick = (data, index) => {
        /*        accountInfo.push({
                    name:accountInfo[index].name,
                    phone:accountInfo[index].phone
                });*/
        accountInfo[index].isSelect = !accountInfo[index].isSelect;
        if (accountInfo[index].isSelect == true) {
            this.pickups.push(data.id);
        } else {
            this.pickups.map((value, i) => {
                if (value==data.id) {
                    this.pickups.splice(i, 1);
                }
            })

        }

        console.log('------', this.pickups.toString());
        this.setState({
            dataSource: this.ds.cloneWithRows(accountInfo),
        });

    }
    _renderRow = (data, s, index) => {
        return (
            <TouchableOpacity key={index + 'accountInfo'} activeOpacity={0.8} onPress={() => {
                this.itemClick(data, index);
            }}>
                <View style={styles.content_title_text_wrap}>
                    <Image source={data.isSelect ? selected_icon : no_select_icon}
                           style={{marginRight: Pixel.getPixel(15)}}/>
                    <Text style={styles.content_title_text}>{data.name}</Text>
                    <Text style={styles.content_base_Right}>{data.phone}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    _renderItem = () => {
        return (
            <View style={{flex: 1}}>

                <View style={{
                    backgroundColor: 'white',
                    paddingHorizontal: Pixel.getPixel(15)
                }}>
                    <ListView
                        dataSource={this.state.dataSource}
                        removeClippedSubviews={false}
                        renderRow={this._renderRow}
                        enableEmptySections={true}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this.refreshingData}
                                tintColor={[FontAndColor.COLORB0]}
                                colors={[FontAndColor.COLORB0]}
                            />
                        }
                    />

                </View>

                <MyButton buttonType={MyButton.TEXTBUTTON}
                          content={'确定'}
                          parentStyle={styles.loginBtnStyle}
                          childStyle={styles.loginButtonTextStyle}
                          mOnPress={() => {
                              if (this.pickups.length > 0) {
                                  this.storeGeterRequest();
                              }else{
                                  this.props.showToast('请选择提车人');
                              }

                          }}/>
            </View>
        );

    }

    /**
     *   添加运单提车人
     **/
    storeGeterRequest = () => {
        this.props.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data) => {
            if (data.code == 1 && data.result != null) {
                let datas = JSON.parse(data.result);
                let maps = {
                    company_id: datas.company_base_id,
                    order_id: this.props.orderId,
                    geter: this.pickups.toString()
                };
                let url = Urls.STORE_GETER_REQUEST;
                request(url, 'post', maps).then((response) => {
                    if (response.mjson.msg === 'ok' && response.mjson.code === 1) {
                        this.props.showModal(false);
                        this.backPage();
                        this.props.callBack(response.mjson.data);
                    } else {
                        this.props.showToast(response.mjson.msg);
                    }
                }, (error) => {
                    this.props.showToast(error.mjson.msg);
                });
            } else {
                this.props.showToast('查看合同失败');
            }
        });
    };

    /**
     *
     */
    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return ( <View style={styles.container}>
                {this.loadView()}
                <NavigatorView title='选择提车人' backIconClick={this.backPage}/>
            </View>);
        } else {
            return (<View style={styles.container}>
                <View style={{flex: 1, marginTop: Pixel.getTitlePixel(65),}}>
                    {
                        this._renderItem()
                    }
                </View>
                <NavigatorView title='选择提车人' backIconClick={this.backPage}/>
            </View>)
        }

    }

    renderRightView = () => {
        return (
            <TouchableOpacity onPress={
                () => {
                    this.backPage();
                    this.props.callBack(callBackInfo);
                }
            }>
                <View style={{
                    marginLeft: Pixel.getPixel(20),
                    width: Pixel.getPixel(80),
                    height: Pixel.getPixel(40),
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text allowFontScaling={false}
                          style={{color: 'white', fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT30)}}>完成</Text>
                </View>
            </TouchableOpacity>
        )


    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: FontAndColor.COLORA3,
        flex: 1,
    },
    content_title_wrap: {
        height: Pixel.getPixel(51),
        backgroundColor: FontAndColor.COLORA3,
    },
    content_title_text_wrap: {
        height: Pixel.getPixel(45),
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: Pixel.getPixel(1),
        borderColor: FontAndColor.COLORA4,
        backgroundColor: 'white'
    },
    content_title_text: {
        flex: 1,
        fontSize: Pixel.getFontPixel(14),
        color: 'black',
    },
    content_base_wrap: {
        height: Pixel.getPixel(46),
        minHeight: Pixel.getPixel(46),
        backgroundColor: 'white'
    },
    content_base_text_wrap: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: Pixel.getPixel(1),
        borderColor: FontAndColor.COLORA4,
        marginHorizontal: Pixel.getPixel(15)
    },
    content_base_Right: {
        fontSize: Pixel.getFontPixel(14),
        color: 'black',
        textAlign: 'right'
    },
    image: {
        marginLeft: Pixel.getPixel(10),
    },
    loginBtnStyle: {
        height: Pixel.getPixel(44),
        width: width - Pixel.getPixel(30),
        backgroundColor: FontAndColor.COLORB0,
        marginTop: Pixel.getPixel(10),
        position: 'absolute',
        bottom: Pixel.getPixel(10),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Pixel.getPixel(4),
        marginLeft: Pixel.getPixel(15)
    },
    loginButtonTextStyle: {
        color: FontAndColor.COLORA3,
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT)
    },
});
