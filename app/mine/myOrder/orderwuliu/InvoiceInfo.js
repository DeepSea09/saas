import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View, TouchableOpacity, Dimensions, TextInput, Image,
} from 'react-native';
import BaseComponent from '../../../component/BaseComponent';
import NavigatorView from '../../../component/AllNavigationView';

const {width} = Dimensions.get('window');
import * as FontAndColor from '../../../constant/fontAndColor';
import PixelUtil from '../../../utils/PixelUtil';
import MyButton from "../../../component/MyButton";
import CheckWaybill from './CheckWaybill';
import AddressManage from './AddressManage';

const cellJianTou = require('../../../../images/mainImage/celljiantou@2x.png');
import {request} from '../../../utils/RequestUtil';
import * as Urls from '../../../constant/appUrls';

const Pixel = new PixelUtil();
let feeDatas = [{title: '发票类型', value: '增值税普通发票'}, {title: '发票抬头', value: ''}, {title: '纳税人识别号', value: ''}]
let accoutInfo = [{title: '联系电话', value: ''}, {title: '收车地址', value: ''}]
export default class InvoiceInfo extends BaseComponent {
    constructor(props) {
        super(props);
        this.accoutInfo = this.props.accoutInfo;
        this.num = '';//识别号
        this.riseText = '';//抬头
        this.flag = false;
        this.contractName = this.accoutInfo[0].value;
        accoutInfo[0].value = this.accoutInfo[1].value;
        accoutInfo[1].value = this.accoutInfo[2].value;
        this.invoice_title = '';
        this.invoice_code = '';
        this.addressId = this.props.endId;
        this.state = {
            renderPlaceholderOnly: false,
            accoutInfo: accoutInfo,
            contractName: this.contractName,
            feeDatas: feeDatas,
        }
    }

    initFinish() {
        this.getData();
    }

    //获取发票
    getData = () => {
        let maps = {
            company_id: global.companyBaseID,
            order_id: this.props.orderId,
        };
        request(Urls.GETINVOICEINFO, 'Post', maps)
            .then((response) => {
                    if (response.mjson.data !== null && response.mjson.data !== []) {
                        let data = response.mjson.data;
                        if (!this.isEmpty(data.contact_phone)) {
                            accoutInfo = [];
                            feeDatas = [];
                            this.riseText = data.invoice_title;//抬头
                            this.num = data.invoice_code;
                            this.addressId = data.address_id;
                            feeDatas.push({title: '发票类型', value: '增值税普通发票'})
                            feeDatas.push({title: '发票抬头', value: data.invoice_title})
                            feeDatas.push({title: '纳税人识别号', value: data.invoice_code})
                            accoutInfo.push({title: '联系电话', value: data.contact_phone})
                            accoutInfo.push({title: '收车地址', value: data.address})
                            this.contractName = data.contact_name;
                        }

                    }
                    this.setState({
                        renderPlaceholderOnly: 'success',
                        contractName: this.contractName,
                        accoutInfo: accoutInfo,
                        feeDatas: feeDatas
                    });
                },
                (error) => {
                    this.setState({renderPlaceholderOnly: 'error',});
                });
    }

    //获取运单费
    saveData = () => {
        this.props.showModal(true)
        let maps = {
            company_id: global.companyBaseID,
            order_id: this.props.orderId,
            address: accoutInfo[1].value,
            address_id: this.addressId,
            contact_name: this.contractName,
            contact_phone: accoutInfo[0].value,
            invoice_title: this.riseText,
            invoice_code: this.num,
            invoice_type: 0

        };
        request(Urls.SAVEINVOICE, 'Post', maps)
            .then((response) => {
                    this.props.showModal(false);
                    if (response.mjson.data != null) {
                        let data = response.mjson.data;
                        this.props.callBack({
                            invoice_title: this.riseText,
                            id: data.id,
                        });
                        this.backPage()

                    }
                },
                (error) => {
                    this.props.showModal(false);
                    this.setState({renderPlaceholderOnly: 'error',});
                });
    }


    /**
     *   地址回传
     **/
    updateAddress = (newAddress) => {
        console.log('newAddress', newAddress);
        accoutInfo = [];
        accoutInfo.push({title: '联系电话', value: newAddress.contact_phone})
        accoutInfo.push({title: '收车地址', value: newAddress.full_address})
        this.contractName = newAddress.contact_name;
        this.addressId = newAddress.id;
        this.setState({
            accoutInfo: accoutInfo,
            contractName: this.contractName
        })
    };


    _renderItem = () => {
        return (
            <View style={{flex: 1}}>

                <Text style={{
                    marginLeft: Pixel.getPixel(15),
                    marginVertical: Pixel.getPixel(10),
                    fontSize: Pixel.getPixel(12),
                    color: FontAndColor.COLORA1

                }}>发票信息</Text>
                <View style={{
                    backgroundColor: 'white',
                    paddingHorizontal: Pixel.getPixel(15)
                }}>
                    {
                        this.state.feeDatas.map((data, index) => {
                            console.log('-------', data);
                            return (
                                <View key={index + 'fee'} style={styles.content_title_text_wrap}>
                                    <Text style={styles.content_title_text}>{data.title}</Text>
                                    {index !== 0 ?
                                        <TextInput
                                            style={{
                                                height: Pixel.getPixel(55),
                                                flex: 1,
                                                flexWrap: 'wrap',
                                                textAlign: 'right',
                                                fontSize: Pixel.getPixel(14),
                                            }}
                                            ref={(ref) => {

                                                index == 1 ? this.riseInput = ref : this.numInput = ref
                                            }
                                            }
                                            underlineColorAndroid={"#00000000"}
                                            defaultValue={data.value}
                                            placeholder={'请输入' + data.title}
                                            onChangeText={(text) => {
                                                if (index == 1) {
                                                    this.riseText = text;
                                                } else {
                                                    this.num = text
                                                }
                                                this.flag = true;
                                            }}
                                        /> :
                                        <Text style={styles.content_base_Right}>{data.value}</Text>}
                                </View>
                            )
                        })
                    }
                </View>

                <Text style={{
                    marginLeft: Pixel.getPixel(15),
                    marginVertical: Pixel.getPixel(10),
                    fontSize: Pixel.getPixel(12),
                    color: FontAndColor.COLORA1
                }}>邮件信息</Text>
                <TouchableOpacity activeOpacity={0.8} onPress={() => {
                    this.toNextPage({
                            name: 'AddressManage',
                            component: AddressManage,
                            params: {
                                addressId: this.addressId,
                                callBack: this.updateAddress
                            }
                        }
                    );
                }}>
                    <View style={styles.content_base_wrap}>
                        <View style={styles.content_base_text_wrap}>
                            <Text style={{
                                flex: 1,
                                fontSize: Pixel.getFontPixel(14),
                                color: FontAndColor.COLORA1
                            }}>收件人</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text
                                    style={[styles.content_base_Right, {color: FontAndColor.COLORA1}]}>{this.state.contractName}</Text>
                                <Image source={cellJianTou} style={styles.image}></Image>
                            </View>

                        </View>
                    </View>
                </TouchableOpacity>

                <View style={{
                    backgroundColor: 'white',
                    paddingHorizontal: Pixel.getPixel(15)
                }}>
                    {
                        this.state.accoutInfo.map((data, index) => {
                            console.log('da', data)
                            return (

                                <View key={index + 'accoutInfo'} style={styles.content_title_text_wrap}>
                                    <Text style={styles.content_title_text}>{data.title}</Text>
                                    <View style={{
                                        flexWrap: 'wrap',
                                        height: Pixel.getPixel(51),
                                        width: width * 3 / 4,
                                        justifyContent: 'center',
                                    }}>
                                        <Text
                                            style={[styles.content_base_Right, {marginRight: Pixel.getPixel(15)}]}>{data.value}</Text>
                                    </View>
                                </View>
                            )
                        })
                    }

                </View>

                <MyButton buttonType={MyButton.TEXTBUTTON}
                          content={'确定'}
                          parentStyle={styles.loginBtnStyle}
                          childStyle={styles.loginButtonTextStyle}
                          mOnPress={() => {
                              this.confirmBt();
                          }}/>
            </View>
        );

    }
    confirmBt = () => {
        if (this.isEmpty(this.riseText)) {
            this.props.showToast('请填写发票抬头');
            return;
        }
        if (this.isEmpty(this.num)) {
            this.props.showToast('请填写纳税人识别号');
            return;
        }
        this.saveData();
    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return ( <View style={styles.container}>
                {this.loadView()}
                <NavigatorView title='发票信息' backIconClick={this.backPage} renderRihtFootView={this.renderRightView}/>
            </View>);
        } else {
            return (<View style={styles.container}>
                <View style={{flex: 1, marginTop: Pixel.getTitlePixel(65),}}>
                    {
                        this._renderItem()
                    }
                </View>
                <NavigatorView title='发票信息' backIconClick={this.backPage} renderRihtFootView={this.renderRightView}/>
            </View>)
        }

    }

    renderRightView = () => {
        return (
            <TouchableOpacity onPress={
                () => {
                    this.backPage();
                    this.props.callBack({
                        invoice_title: '',
                        id: '',
                    });
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
                          style={{color: 'white', fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT30)}}>不开发票</Text>
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
    content_tag_wrap: {
        height: Pixel.getPixel(49),
        marginLeft: Pixel.getPixel(15),
        borderBottomWidth: Pixel.getPixel(1),
        borderColor: FontAndColor.COLORA4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    content_title_wrap: {
        height: Pixel.getPixel(51),
        backgroundColor: FontAndColor.COLORA3,
    },
    content_title_text_wrap: {
        height: Pixel.getPixel(55),
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: Pixel.getPixel(1),
        borderColor: FontAndColor.COLORA4,
        backgroundColor: 'white',
        justifyContent: 'space-between',
    },
    content_title_text: {
        fontSize: Pixel.getFontPixel(14),
        color: FontAndColor.COLORA1,
        marginRight: Pixel.getPixel(20),
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
    content_base_left: {
        flex: 1,
        marginLeft: Pixel.getPixel(15),
        fontSize: Pixel.getFontPixel(14),
        color: FontAndColor.COLORA1
    },
    content_base_Right: {
        fontSize: Pixel.getFontPixel(14),
        color: 'black',
        textAlign: 'right',
        flexWrap: 'wrap',
    },
    image: {
        marginLeft: Pixel.getPixel(10),
    },
    topText: {
        color: 'white',
        fontSize: Pixel.getPixel(14)
    },
    loginBtnStyle: {
        height: Pixel.getPixel(44),
        width: width - Pixel.getPixel(30),
        backgroundColor: FontAndColor.COLORB0,
        marginTop: Pixel.getPixel(30),
        marginBottom: Pixel.getPixel(30),
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
