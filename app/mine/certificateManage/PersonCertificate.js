/**
 * Created by yujinzhong on 2017/10/30.
 */
import React from 'react';
import {
    View,
    Image,
    Text,
    TextInput,
    StyleSheet,
    Platform,
    NativeModules,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Dimensions,
    TouchableWithoutFeedback,
}from 'react-native';
let {width} = Dimensions.get('window');

import BaseComponent from '../../component/BaseComponent';
import AllNavigationView from '../../component/AllNavigationView';
import * as fontAndColor from '../../constant/fontAndColor';
import PixelUtil from '../../utils/PixelUtil';
import * as AppUrls from "../../constant/appUrls";
import ImagePicker from "react-native-image-picker";

import * as FontAndColor from "../../constant/fontAndColor";
import MyButton from "../../component/MyButton";
import ProvinceListScene from "../../carSource/ProvinceListScene";
import ImageSourceSample from "../../publish/component/ImageSourceSample";
import * as ImageUpload from "../../utils/ImageUpload";
import {request} from '../../utils/RequestUtil';
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";


const Pixel = new PixelUtil();
const selectImg = require('../../../images/financeImages/celljiantou.png');
const IS_ANDROID = Platform.OS === 'android';
//以下为上传需要的参数
let idHandle;
let idcardfront;
let idcardback;
let businessid;
let city_ID;
let prov_ID;
//以上为上传需要的参数

const options = {
    //弹出框选项
    title: '请选择',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '选择相册',
    allowsEditing: false,
    noData: false,
    quality: 1.0,
    maxWidth: 480,
    maxHeight: 800,
    storageOptions: {
        skipBackup: true,
        path: 'images',
    }
};
export default class EnterpriseCertificate extends BaseComponent {
    /*
     * 为了延迟调用*/
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    constructor(props) {
        super(props);
        this.enterpriseData = {
            zhuceren_name: '',//注册人姓名
            zhuceren_IDNo: '',//注册人身份证号
        };

        this.state = {

            business_home: '请选择',//商户所在地

            enterpriseHandle: null,//个人手持照片
            enterpriseFront: null,//个人正面照片
            enterpriseBack: null,//个人反面照片

            businessLicense: null,//工作证照片

            keyboardOffset: -Pixel.getPixel(64),
            renderPlaceholderOnly: 'loading'
        };

    }

    initFinish = () => {

        /*
         * 认证未通过，获取用户填写信息*/
        this._getCertificateInfo();

    };

    /*
     * 认证未通过，获取用户填写过的信息
     * */
    _getCertificateInfo = () => {

        request(AppUrls.GETAPPLYAUTHUSERINFO, 'post', {}).then((response) => {


            if (response.mycode == "1") {
                let PersonResule = response.mjson.data;

                idHandle = PersonResule.idcard_img_touch.file_id;
                idcardfront = PersonResule.idcard_img_fort.file_id;
                idcardback = PersonResule.idcard_img_back.file_id;
                businessid = PersonResule.work_img.file_id;
                city_ID = PersonResule.city_id;
                prov_ID = PersonResule.prov_id;
                this.enterpriseData.zhuceren_IDNo = PersonResule.idcard_number;
                this.enterpriseData.zhuceren_name = PersonResule.real_name;


                let shanghusuozaidi;
                let handleSource;
                let frontSource;
                let backSource;
                let licenseSource;

                //对商户所在地判空  进行界面显示处理
                if (this.isEmpty(PersonResule.prov_name) === true || this.isEmpty(PersonResule.city_name) === true) {
                    shanghusuozaidi = '请选择'
                } else {
                    shanghusuozaidi = PersonResule.prov_name + ' ' + PersonResule.city_name;
                }

                //对手持照片判空  进行界面显示处理
                if (this.isEmpty(PersonResule.idcard_img_touch.img_url) === true) {
                    handleSource = null;
                } else {
                    handleSource = {uri: PersonResule.idcard_img_touch.img_url};
                }

                //对正面照片判空  进行界面显示处理
                if (this.isEmpty(PersonResule.idcard_img_fort.img_url) === true) {
                    frontSource = null;
                } else {
                    frontSource = {uri: PersonResule.idcard_img_fort.img_url};
                }

                //对反面照片判空  进行界面显示处理
                if (this.isEmpty(PersonResule.idcard_img_back.img_url) === true) {
                    backSource = null;
                } else {
                    backSource = {uri: PersonResule.idcard_img_back.img_url};
                }

                //对营业执照 照片判空  进行界面显示处理
                if (this.isEmpty(PersonResule.work_img.img_url) === true) {
                    licenseSource = null;
                } else {
                    licenseSource = {uri: PersonResule.work_img.img_url};
                }


                this.setState({
                    business_home: shanghusuozaidi,//商户所在地
                    enterpriseHandle: handleSource,//个人手持照片
                    enterpriseFront: frontSource,//个人正面照片
                    enterpriseBack: backSource,//个人反面照片
                    businessLicense: licenseSource,//工作证照片

                    renderPlaceholderOnly: 'success'
                });

                console.log(response.mjson.data);

            } else {

            }
        }, (error) => {
            this.setState({
                renderPlaceholderOnly: 'error'
            });
        });

    };
    _showLoading = () => {
        this.props.showModal(true);
    };

    _closeLoading = () => {
        this.props.showModal(false);
    };

    //提示信息
    _showHint = (hint) => {
        this.props.showToast(hint);
    };
    _zhucerenChange = (text) => {
        this.enterpriseData.zhuceren_name = text;
    };

    _shenfenzhengChange = (text) => {
        this.enterpriseData.zhuceren_IDNo = text;
    };

    /*
     * 商户所在地点击
     * */
    _onCityPress = () => {
        let navigatorParams = {
            name: "ProvinceListScene",
            component: ProvinceListScene,
            params: {
                checkedCityClick: this._checkedCityClick,
                isSelectProvince: false,//如果为true，可以选择省,false,只能选择市
            }
        }
        this.toNextPage(navigatorParams);
    };

    _checkedCityClick = (cityType) => {
        console.log(cityType);
        city_ID = cityType.city_id;
        prov_ID = cityType.provice_id;
        this.setState(
            {
                business_home: cityType.provice_name + ' ' + cityType.city_name

            }
        );

        // this.refs.cityView.setContent(cityType.city_name);
        // this.props.screeningObject.checkedCity.title = cityType.city_name;
        // this.props.screeningObject.checkedCity.city_id = cityType.city_id;
        // this.props.screeningObject.checkedCity.provice_id = cityType.provice_id;
    }
    /*
     * 导航栏左侧按钮点击
     * */
    _onBack = () => {
        this.backPage();
    };
    /*
     * 完成点击
     * */
    _onCompletePress = () => {


        if (this.isEmpty(this.enterpriseData.zhuceren_name) === true) {
            this._showHint('请填写注册人姓名');
            return;
        }
        if (this.isEmpty(this.enterpriseData.zhuceren_IDNo) === true) {
            this._showHint('请填写注册人身份证号');
            return;
        }
        if (this.enterpriseData.zhuceren_IDNo.length != 18 && this.enterpriseData.zhuceren_IDNo.length != 15) {
            this._showHint('请填写有效的注册人身份证号');
            return;
        }

        if (this.state.business_home === '请选择') {
            this._showHint('请选择商户经营所在地');
            return;
        }
        if (this.isEmpty(idHandle) === true) {
            this._showHint('请上传手持身份证照片');
            return;
        }
        if (this.isEmpty(idcardfront) === true) {
            this._showHint('请上传身份证正面照片');
            return;
        }
        if (this.isEmpty(idcardback) === true) {
            this._showHint('请上传身份证反面照片');
            return;
        }

        if (this.isEmpty(businessid) === true) {
            this._showHint('请上传名片或工作证照片');
            return;
        }


        let maps = {
            business_card_id: businessid,
            city_id: city_ID,
            prov_id: prov_ID,
            idcard_back_id: idcardback,
            idcard_fort_id: idcardfront,
            idcard_touch_id: idHandle,


            idcard_no: this.enterpriseData.zhuceren_IDNo,
            real_name: this.enterpriseData.zhuceren_name,

        };
        this.props.showModal(true);

        request(AppUrls.PERSONCERTIFICATE, 'Post', maps)
            .then((response) => {
                if (response.mycode == "1") {

                    this.props.showToast("信息提交成功");
                    if(this.props.callBack)
                    {
                        this.props.callBack();
                    }
                    this.timer = setTimeout(
                        () => {
                            this.backPage();
                        },
                        200
                    );
                } else {
                    this.props.showToast(response.mjson.msg + "");
                }
            }, (error) => {
                if (error.mycode == -300 || error.mycode == -500) {
                    this.props.showToast('系统异常');
                } else {
                    this.props.showToast(error.mjson.msg);
                }

            });


    };

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this.loadView();
        }
        return (
            <View style={styles.container}>
                {
                    IS_ANDROID ? (this.loadScrollView()) : (
                            <KeyboardAvoidingView behavior={'position'}
                                                  keyboardVerticalOffset={this.state.keyboardOffset}>
                                {
                                    this.loadScrollView()
                                }
                            </KeyboardAvoidingView>
                        )
                }
                {/*导航栏view*/}
                <AllNavigationView
                    backIconClick={this._onBack}
                    title='个人认证'
                />
                {/*拍照选择modal  view*/}
                <ImageSourceSample

                    galleryClick={this._photoClick}
                    cameraClick={this._cameraClick}
                    ref={(modal) => {
                                     this.imageSource = modal
                                 }}/>

                {/*上传图片转圈 view*/}
            </View>
        )
    }

    /*
     * 主界面
     * */
    loadScrollView = () => {
        return (
            <ScrollView keyboardDismissMode={IS_ANDROID?'none':'on-drag'}>


                {/*提示语view*/}
                <View
                    style={{width:width,height:Pixel.getPixel(36),flexDirection:'row',alignItems:'center',marginTop:Pixel.getPixel(0),backgroundColor:'#FFF8EA'}}>
                    <Image source={require('../../../images/login/tishi.png')}
                           style={{width:Pixel.getPixel(18),height:Pixel.getPixel(18),marginLeft:Pixel.getPixel(15),}}/>
                    <Text style={{color:'#FA5741',marginLeft:Pixel.getPixel(5),fontSize:Pixel.getPixel(14)}}>
                        平台将对提交的资料进行审核，请确保内容真实有效
                    </Text>
                </View>

                {/*注册人view*/}
                <View style={styles.itemBackground}>
                    <Text allowFontScaling={false} style={styles.leftFont}>注册人</Text>
                    <TextInput
                        ref={(input) => {
                                this.zhucerenInput = input
                            }}
                        style={[styles.inputHintFont, styles.fillSpace]}
                        underlineColorAndroid='transparent'
                        onChangeText={this._zhucerenChange}
                        placeholder='请输入'
                        defaultValue={this.enterpriseData.zhuceren_name}
                        placeholderTextColor={fontAndColor.COLORA1}
                        onFocus={()=>{
                                       this.setState({
                                           keyboardOffset:-Pixel.getPixel(300)
                                       });
                                   }}
                        onBlur={()=>{
                                       this.setState({
                                           keyboardOffset:Pixel.getPixel(64)
                                       });
                                   }}
                    />
                </View>
                <View style={styles.splitItem}/>

                {/*注册人身份证号view*/}
                <View style={styles.itemBackground}>
                    <Text allowFontScaling={false} style={styles.leftFont}>注册人身份证号</Text>
                    <TextInput
                        ref={(input) => {
                                this.zhuceshenfenzhengInput = input
                            }}
                        style={[styles.inputHintFont, styles.fillSpace]}
                        underlineColorAndroid='transparent'
                        maxLength={18}
                        onChangeText={this._shenfenzhengChange}
                        placeholder='请输入'
                        placeholderTextColor={fontAndColor.COLORA1}
                        defaultValue={this.enterpriseData.zhuceren_IDNo}
                        onFocus={()=>{
                                       this.setState({
                                           keyboardOffset:-Pixel.getPixel(300)
                                       });
                                   }}
                        onBlur={()=>{
                                       this.setState({
                                           keyboardOffset:Pixel.getPixel(64)
                                       });
                                   }}
                    />
                </View>

                <View style={{width:width,height:Pixel.getPixel(10),backgroundColor:fontAndColor.COLORA3}}/>


                {/*商户经营所在地view*/}
                <View style={styles.itemBackground}>
                    <Text allowFontScaling={false} style={styles.leftFont}>商户经营所在地</Text>
                    <View style={styles.fillSpace}/>
                    <TouchableOpacity onPress={this._onCityPress}>
                        <View style={styles.rightContainer}>
                            <Text allowFontScaling={false}
                                  ref='business_home'
                                  style={styles.selectHintFont}>
                                {this.state.business_home}</Text>


                            <Image style={styles.selectImage} source={selectImg}/>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{width:width,height:Pixel.getPixel(10),backgroundColor:fontAndColor.COLORA3}}/>


                {/*个人身份证照片3张view*/}
                <TouchableWithoutFeedback onPress={() => dismissKeyboard() }>
                    <View style={{width: width,height: Pixel.getPixel(118),
							backgroundColor: '#ffffff',paddingLeft: Pixel.getPixel(15),paddingRight: Pixel.getPixel(15), }}>

                        <Text allowFontScaling={false} style={{
                                    flex: 1,
                                    color: 'black',
                                    fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT),
                                    marginTop:Pixel.getPixel(12),

                                }}>
                            本人身份证照片
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex:1}}/>
                            <View>
                                <MyButton buttonType={MyButton.IMAGEBUTTON}
                                          content={this.state.enterpriseHandle === null ?
                                                  require('../../../images/login/id_handle.png') : this.state.enterpriseHandle
                                              }
                                          parentStyle={{ marginTop: Pixel.getPixel(10),marginBottom: Pixel.getPixel(10),marginLeft: Pixel.getPixel(10),}}
                                          childStyle={{width: Pixel.getPixel(80),height: Pixel.getPixel(60),resizeMode: 'contain'}}
                                          mOnPress={()=>{this.selectPhotoTapped('enterpriseHandle')}}/>
                                {this.state.enterpriseHandle ?
                                    <MyButton buttonType={MyButton.IMAGEBUTTON}
                                              content={require('../../../images/login/clear.png')}
                                              parentStyle={{
                                                      position: 'absolute',
                                                      marginTop: Pixel.getPixel(2),
                                                      marginLeft: Pixel.getPixel(2),
                                                  }}
                                              childStyle={{width: Pixel.getPixel(17),height: Pixel.getPixel(17),}}
                                              mOnPress={() => {
									          	idHandle = '';
									          	this.setState({
									          		enterpriseHandle: null
                                                      });
                                                  }}/>
                                    : null}
                            </View>
                            <View>
                                <MyButton buttonType={MyButton.IMAGEBUTTON}
                                          content={this.state.enterpriseFront === null ?
                                                  require('../../../images/login/idcard.png') : this.state.enterpriseFront
                                              }
                                          parentStyle={{ marginTop: Pixel.getPixel(10),marginBottom: Pixel.getPixel(10),marginLeft: Pixel.getPixel(10),}}
                                          childStyle={{width: Pixel.getPixel(80),height: Pixel.getPixel(60),resizeMode: 'contain'}}
                                          mOnPress={()=>{this.selectPhotoTapped('enterpriseFront')}}/>
                                {this.state.enterpriseFront ?
                                    <MyButton buttonType={MyButton.IMAGEBUTTON}
                                              content={require('../../../images/login/clear.png')}
                                              parentStyle={{
                                                      position: 'absolute',
                                                      marginTop: Pixel.getPixel(2),
                                                      marginLeft: Pixel.getPixel(2),
                                                  }}
                                              childStyle={{width: Pixel.getPixel(17),height: Pixel.getPixel(17),}}
                                              mOnPress={() => {
									          	idcardfront = '';
                                                 this.setState({
                                                          enterpriseFront: null
                                                      });
                                                  }}/>
                                    : null}
                            </View>
                            <View>
                                <MyButton buttonType={MyButton.IMAGEBUTTON}
                                          content={this.state.enterpriseBack === null ?
                                                  require('../../../images/login/idcard_back.png') : this.state.enterpriseBack
                                              }
                                          parentStyle={{ marginTop: Pixel.getPixel(10),marginBottom: Pixel.getPixel(10),marginLeft: Pixel.getPixel(10),}}
                                          childStyle={{width: Pixel.getPixel(80),height: Pixel.getPixel(60),resizeMode: 'contain'}}
                                          mOnPress={()=>{this.selectPhotoTapped('enterpriseBack')}}/>
                                {this.state.enterpriseBack ?
                                    <MyButton buttonType={MyButton.IMAGEBUTTON}
                                              content={require('../../../images/login/clear.png')}
                                              parentStyle={{
                                                      position: 'absolute',
                                                      marginTop: Pixel.getPixel(2),
                                                      marginLeft: Pixel.getPixel(2),
                                                  }}
                                              childStyle={{width: Pixel.getPixel(17),height: Pixel.getPixel(17),}}
                                              mOnPress={() => {
									          	idcardback =  '';
                                                 this.setState({
                                                 	enterpriseBack: null
                                                 });
                                                  }}/>
                                    : null}
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>


                <View style={{width:width,height:Pixel.getPixel(10),backgroundColor:fontAndColor.COLORA3}}/>
                {/*名片或工作证照片view*/}
                <TouchableWithoutFeedback onPress={() => dismissKeyboard() }>
                    <View style={{width: width,height: Pixel.getPixel(88),flexDirection: 'row',alignItems: 'center',
							backgroundColor: '#ffffff',paddingLeft: Pixel.getPixel(15),paddingRight: Pixel.getPixel(15), }}>

                        <Text allowFontScaling={false} style={{
                                    flex: 1,
                                    color: 'black',
                                    fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT)
                                }}>
                            名片或工作证
                        </Text>
                        <View>
                            <MyButton buttonType={MyButton.IMAGEBUTTON}
                                      content={this.state.businessLicense === null ?
                                                  require('../../../images/login/idcard.png') : this.state.businessLicense
                                              }
                                      parentStyle={{ marginTop: Pixel.getPixel(10),marginBottom: Pixel.getPixel(10),marginLeft: Pixel.getPixel(10),}}
                                      childStyle={{width: Pixel.getPixel(80),height: Pixel.getPixel(60),resizeMode: 'contain'}}
                                      mOnPress={()=>{this.selectPhotoTapped('businessLicense')}}/>
                            {this.state.businessLicense ?
                                <MyButton buttonType={MyButton.IMAGEBUTTON}
                                          content={require('../../../images/login/clear.png')}
                                          parentStyle={{
                                                      position: 'absolute',
                                                      marginTop: Pixel.getPixel(2),
                                                      marginLeft: Pixel.getPixel(2),
                                                  }}
                                          childStyle={{width: Pixel.getPixel(17),height: Pixel.getPixel(17),}}
                                          mOnPress={() => {
								          	businessid = '';
								          	this.setState({
								          		businessLicense: null
								          	});
                                                  }}/>
                                : null}

                        </View>
                    </View>
                </TouchableWithoutFeedback>

                <View style={{width:width,height:Pixel.getPixel(30),backgroundColor:fontAndColor.COLORA3}}/>

                {/*更换银行卡view*/}
                <View style={styles.fillSpace}>
                    <TouchableOpacity style={styles.btnOk} activeOpacity={0.6} onPress={this._onCompletePress}>
                        <Text allowFontScaling={false} style={styles.btnFont}>完成</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
    isEmpty = (str) => {
        if (typeof(str) != 'undefined' && str !== '' && str !== null) {
            return false;
        } else {
            return true;
        }
    };
    /*
     * 弹出蒙版
     * */
    selectPhotoTapped = (id) => {
        this.id = id;
        this._rePhoto(id);
    }
    _rePhoto = (ID) => {
        if (ID === 'businessLicense') {
            this.imageSource.openModal('', '', null);

        }
        if (ID === 'enterpriseHandle') {
            this.imageSource.openModal(ID, '手持身份证件示例', require('./../../../images/login/holdSample.png'));

        }
        if (ID === 'enterpriseFront') {
            this.imageSource.openModal(ID, '身份证正面示例', require('./../../../images/login/frontSample.png'));

        }
        if (ID === 'enterpriseBack') {
            this.imageSource.openModal(ID, '身份证反面示例', require('./../../../images/login/backSample.png'));

        }

    };

    /*
     * 相机点击
     * */
    _cameraClick = () => {
        this.timer = setTimeout(
            () => {
                ImagePicker.launchCamera(options, (response) => {
                    if (response.didCancel) {
                    } else if (response.error) {
                    } else if (response.customButton) {
                    } else {
                        this.uploadImage(response, this.id);
                    }
                });
            },
            200
        );


    }

    /*
     * 相册点击
     * */
    _photoClick = () => {
        this.timer = setTimeout(
            () => {
                ImagePicker.launchImageLibrary(options, (response) => {
                    if (response.didCancel) {
                    } else if (response.error) {
                    } else if (response.customButton) {
                    } else {
                        this.uploadImage(response, this.id);
                    }
                });
            },
            200
        );

    }
    /*
     * 图片上传
     * */
    uploadImage = (response, id) => {

        let params = {
            file: 'data:image/jpeg;base64,' + encodeURI(response.data).replace(/\+/g, '%2B')
        };
        this.props.showModal(true);

        ImageUpload.request(AppUrls.INDEX_UPLOAD, 'Post', params)
            .then((response) => {
                this.props.showModal(false);

                if (response.mycode == 1) {
                    let source = {uri: response.mjson.data.url};
                    if (id === 'enterpriseFront') {
                        idcardfront = response.mjson.data.file_id;
                        if (idcardfront != "") {
                            this.setState({
                                enterpriseFront: source
                            });
                        } else {
                            this.props.showToast("id 为空 图片上传失败");
                        }
                    } else if (id === 'enterpriseBack') {
                        idcardback = response.mjson.data.file_id;
                        if (idcardback != "") {
                            this.setState({
                                enterpriseBack: source
                            });
                        } else {
                            this.props.showToast("id 为空 图片上传失败");
                        }
                    } else if (id === 'enterpriseHandle') {
                        idHandle = response.mjson.data.file_id;
                        if (idHandle != "") {
                            this.setState({
                                enterpriseHandle: source
                            });
                        } else {
                            this.props.showToast("id 为空 图片上传失败");
                        }
                    } else if (id === 'businessLicense') {
                        businessid = response.mjson.data.file_id;
                        if (businessid != "") {
                            this.setState({
                                businessLicense: source
                            });
                        } else {
                            this.props.showToast("id 为空 图片上传失败");
                        }
                    }
                } else {
                    this.props.showToast(response.mjson.msg + "!");
                }
            }, (error) => {
                console.log(error);
                this.props.showToast("图片上传失败");
            });
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: Pixel.getPixel(64),
    },
    alignTop: {
        marginTop: Pixel.getPixel(59)
    },
    alignItem: {
        marginTop: Pixel.getPixel(10)
    },
    itemBackground: {
        flexDirection: 'row',
        height: Pixel.getPixel(44),
        backgroundColor: 'white',
        paddingHorizontal: Pixel.getPixel(15),
        alignItems: 'center'
    },
    splitItem: {
        height: Pixel.getPixel(0.5),
        backgroundColor: fontAndColor.COLORA4,
        marginLeft: Pixel.getPixel(15),
        marginRight: Pixel.getPixel(15),
    },
    leftFont: {
        fontSize: Pixel.getFontPixel(14),
        color: 'black'
    },
    fillSpace: {
        flex: 1
    },
    selectHintFont: {
        fontSize: Pixel.getFontPixel(14),
        color: fontAndColor.COLORA2,
        textAlign: 'right'
    },
    inputHintFont: {
        fontSize: Pixel.getFontPixel(14),
        color: 'black',
        textAlign: 'right'
    },
    selectImage: {
        height: Pixel.getPixel(16),
        width: Pixel.getPixel(9),
        marginLeft: Pixel.getPixel(13)
    },
    scanImage: {
        height: Pixel.getPixel(18),
        width: Pixel.getPixel(18),
        marginLeft: Pixel.getPixel(8)
    },
    rightContainer: {
        height: Pixel.getPixel(44),
        flexDirection: 'row',
        alignItems: 'center'
    },
    rightHintFont: {
        fontSize: Pixel.getFontPixel(14),
        color: 'black',
        marginLeft: Pixel.getPixel(8)
    },
    btnOk: {
        height: Pixel.getPixel(44),
        marginHorizontal: Pixel.getPixel(15),
        backgroundColor: fontAndColor.COLORB0,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Pixel.getPixel(15),
        borderRadius: Pixel.getFontPixel(2),
    },
    btnFont: {
        fontSize: Pixel.getFontPixel(15),
        color: 'white'
    },

});
