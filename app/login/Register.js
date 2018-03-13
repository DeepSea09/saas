import React, {Component} from "react";
import {
	AppRegistry,
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableWithoutFeedback,
	InteractionManager,
	KeyboardAvoidingView,
	TouchableOpacity,
	NativeModules,
	NativeAppEventEmitter,
} from "react-native";
import BaseComponent from "../component/BaseComponent";
import * as FontAndColor from "../constant/fontAndColor";
import LoginInputText from "./component/LoginInputText";
import NavigationBar from "../component/NavigationBar";
import PixelUtil from "../utils/PixelUtil";
import ImagePicker from "react-native-image-picker";
import MyButton from "../component/MyButton";

import {request} from "../utils/RequestUtil";
import * as AppUrls from "../constant/appUrls";
import md5 from "react-native-md5";
import LoginAndRegister from "./LoginAndRegister";
import * as ImageUpload from "../utils/ImageUpload";
import ImageSourceSample from "../publish/component/ImageSourceSample";
let Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');
let Pixel = new PixelUtil();

let imgSrc: '';
let imgSid: '';
let smsCode: '';
let uid: '';
let idcardf: '';
let idcardback: '';
let businessid: '';
let confirm = false;
const dismissKeyboard = require('dismissKeyboard');

var Platform = require('Platform');
const IS_ANDROID = Platform.OS === 'android';

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

export default class Register extends BaseComponent {
	constructor(props) {
		super(props);
		this.state = {
			idcard: null,
			idcardBack: null,
			businessLicense: null,
			verifyCode: null,
			renderPlaceholderOnly: true,
			keyboardOffset: -Pixel.getPixel(100),

		}
		this.id;
		this.timer = null;
		this.locateDate = {
			address: '',
			city_id: '',
			city_name: '',
			street_name: '',
			province_name: '',
			area_name: '',
		}

	}

	initFinish = () => {
		InteractionManager.runAfterInteractions(() => {
			this.setState({renderPlaceholderOnly: false});
			//获取图形验证码
			this.Verifycode();
			//拿到当前位置的定位
			this.getCurrentLocation();
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
						rightText={""}
					/>
				</View>
			</TouchableWithoutFeedback>);
		}
		return (
			<TouchableWithoutFeedback onPress={() => {
                dismissKeyboard();
            }}>
				<View style={styles.container}>

					<NavigationBar
						leftImageCallBack={this.backPage}
						rightText={""}
					/>
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

					{this.loadingView()}
				</View>
			</TouchableWithoutFeedback>
		);
	}

	/*
	 * 主界面
	 * */
	loadScrollView = () => {
		return (
			<ScrollView keyboardShouldPersistTaps={'handled'}>

				<View style={styles.inputTextLine}/>
				<View style={styles.inputTextsStyle}>
					<LoginInputText
						ref="userName"
						textPlaceholder={'请输入手机号'}
						viewStytle={styles.itemStyel}
						inputTextStyle={styles.inputTextStyle}
						leftIcon={false}
						clearValue={true}
						maxLength={11}
						keyboardType={'phone-pad'}
						import={true}
						rightIcon={false}/>
					<LoginInputText
						ref="verifycode"
						textPlaceholder={'请输入验证码'}
						viewStytle={styles.itemStyel}
						inputTextStyle={styles.inputTextStyle}
						leftIcon={false}
						import={true}
						keyboardType={'phone-pad'}
						rightIconClick={this.Verifycode}
						rightIconStyle={{width: Pixel.getPixel(100)}}
						rightIconSource={this.state.verifyCode ? this.state.verifyCode : null}/>
					<LoginInputText
						ref="smsCode"
						textPlaceholder={'请输入短信验证码'}
						viewStytle={[styles.itemStyel, {borderBottomWidth: 0}]}
						inputTextStyle={styles.inputTextStyle}
						rightButton={true}
						rightIcon={false}
						import={true}
						callBackSms={this.sendSms}
						keyboardType={'phone-pad'}
						leftIcon={false}/>
				</View>
				<View style={styles.inputTextLine}/>
				<View style={styles.inputTextsStyle}>
					<LoginInputText
						ref="password"
						textPlaceholder={'请输入密码'}
						viewStytle={styles.itemStyel}
						inputTextStyle={styles.inputTextStyle}
						secureTextEntry={true}
						clearValue={true}
						leftIcon={false}
						import={true}
						maxLength={16}
						rightIcon={false}/>
					<LoginInputText
						ref="passwoedAgain"
						textPlaceholder={'请再次输入密码'}
						viewStytle={[styles.itemStyel, {borderBottomWidth: 0}]}
						inputTextStyle={styles.inputTextStyle}
						secureTextEntry={true}
						maxLength={16}
						leftIcon={false}
						clearValue={true}
						import={true}
						rightIcon={false}/>
				</View>
				<View style={styles.inputTextLine}/>
				<View style={styles.inputTextsStyle}>
					<LoginInputText
						ref="name"
						textPlaceholder={'请输入姓名'}
						viewStytle={styles.itemStyel}
						inputTextStyle={styles.inputTextStyle}
						leftIcon={false}
						import={true}
						clearValue={true}
						rightIcon={false}/>
					<LoginInputText
						ref="businessName"
						textPlaceholder={'请输入商家名称'}
						viewStytle={[styles.itemStyel, {borderBottomWidth: 0}]}
						inputTextStyle={styles.inputTextStyle}
						leftIcon={false}
						import={true}
						clearValue={true}
						rightIcon={false}

					/>
				</View>
				<View style={styles.inputTextLine}/>
				<View style={styles.imagebuttonok}>

					<TouchableOpacity onPress={() => {
                                this.register();
                            }} activeOpacity={0.8} style={{
                                marginTop: Pixel.getPixel(7),
                                width: width - Pixel.getPixel(30),
                                height: Pixel.getPixel(44),
                                backgroundColor: FontAndColor.COLORB0,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
						<Text allowFontScaling={false} style={{
                                    color: '#fff',
                                    fontSize: Pixel.getPixel(FontAndColor.LITTLEFONT28)
                                }}>提交</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		)
	}
	register = () => {

		let userName = this.refs.userName.getInputTextValue();
		let smsCode = this.refs.smsCode.getInputTextValue();
		let password = this.refs.password.getInputTextValue();
		let passwoedAgain = this.refs.passwoedAgain.getInputTextValue();
		let name = this.refs.name.getInputTextValue();
		let businessName = this.refs.businessName.getInputTextValue();
		if (typeof(userName) == "undefined" || userName == "") {
			this.props.showToast("手机号码不能为空");
		} else if (userName.length != 11) {
			this.props.showToast("请输入正确的手机号");
		} else if (typeof(smsCode) == "undefined" || smsCode == "") {
			this.props.showToast("验证码不能为空");
		} else if (typeof(password) == "undefined" || password == "") {
			this.props.showToast("密码不能为空");
		} else if (typeof(password) == "undefined" || password == "") {
			this.props.showToast("密码不能为空");
		} else if (passwoedAgain.length < 6) {
			this.props.showToast("密码必须为6~16位");
		} else if (typeof(name) == "undefined" || name == "") {
			this.props.showToast("用户名不能为空");
		} else if (typeof(businessName) == "undefined" || businessName == "") {
			this.props.showToast("商家名称不能为空");
		} else if (password !== passwoedAgain) {
			this.props.showToast("两次密码输入不一致");
		}
		//else if(!confirm){
		//    this.props.showToast("请详细阅读并同意《电子账户服务协议》");
		/*} else if (typeof(idcardf) == "undefined" || idcardf == "") {
		 this.props.showToast("身份证正面不能为空");
		 } else if (typeof(idcardback) == "undefined" || idcardback == "") {
		 this.props.showToast("身份证反面不能为空");
		 } else if (typeof(businessid) == "undefined" || businessid == "") {
		 this.props.showToast("营业执照不能为空");
		 } */
		else {
			let device_code = '';
			if (Platform.OS === 'android') {
				device_code = 'dycd_platform_android';
			} else {
				device_code = 'dycd_platform_ios';
			}
// 			address	详细地址
// 			area_id	地区ID
// 			area_name	地区名字
// 			city_id	市区id
// 			city_name	市区名字
// 			code	短信验证码		【必填】
// confirm_pwd	确认密码		【必填】
// device_code			【必填】
// invi_code	注册邀请码
// 			merchant_name	商户名称		【必填】
// phone	手机号		【必填】
// province_id	定位省ID
// 			province_name	省名
// 			pwd	密码		【必填】
// street_id	街道id
// 			street_name	街道名称
// 			user_name


			let maps = {
				device_code: device_code,
				user_name: name,
				phone: userName,
				pwd: md5.hex_md5(password),
				confirm_pwd: md5.hex_md5(passwoedAgain),
				merchant_name: businessName,
				code: smsCode,

				address: this.locateDate.address,
				city_id: this.locateDate.city_id,
				city_name: this.locateDate.city_name,
				street_name: this.locateDate.street_name,
				province_name: this.locateDate.province_name,
				area_name: this.locateDate.area_name,
				// idcard_img: idcardf + "," + idcardback,
				// license_img: businessid,
			};
			this.setState({
				loading: true,
			});
			request(AppUrls.ZHUCE, 'Post', maps)
				.then((response) => {
					this.setState({
						loading: false,
					});
					if (response.mycode == "1") {
						uid = response.mjson.data.uid;
						this.props.showToast("注册成功");
						this.exitPage({name: 'LoginAndRegister', component: LoginAndRegister});
					} else {
						this.props.showToast(response.mjson.msg + "");
					}
				}, (error) => {
					this.setState({
						loading: false,
					});
					if (error.mycode == -300 || error.mycode == -500) {
						this.props.showToast("注册失败");
					} else if (error.mycode == 7040004) {
						this.Verifycode();
						this.props.showToast(error.mjson.msg + "");
					} else {
						this.props.showToast(error.mjson.msg + "");
					}
				});
		}
	}


	exitPage = (mProps) => {
		const navigator = this.props.navigator;
		if (navigator) {
			navigator.immediatelyResetRouteStack([{
				...mProps
			}])
		}
	}

	//获取图形验证码
	Verifycode = () => {
		this.refs.verifycode.lodingStatus(true);
		let device_code = '';
		if (Platform.OS === 'android') {
			device_code = 'dycd_platform_android';
		} else {
			device_code = 'dycd_platform_ios';
		}
		let maps = {
			device_code: device_code,
		};
		request(AppUrls.IDENTIFYING, 'Post', maps)
			.then((response) => {
				this.refs.verifycode.lodingStatus(false);
				imgSrc = response.mjson.data.img_src;
				imgSid = response.mjson.data.img_sid;

				this.setState({
					verifyCode: {uri: imgSrc},
				});
			}, (error) => {
				this.refs.verifycode.lodingStatus(false);
				this.setState({
					verifyCode: null,
				});
				if (error.mycode == -300 || error.mycode == -500) {
					this.props.showToast("获取失败");
				} else {
					this.props.showToast(error.mjson.msg + "");
				}
			});
	}


	//拿到当前位置的定位
	getCurrentLocation = () => {
		if (Platform.OS === 'android') {
			NativeModules.QrScan.lbsStart();
			NativeAppEventEmitter
				.addListener('onReceiveBDLocation', (loc) => {
					console.log(loc);
					this.locateDate.address = loc.addr;
					this.locateDate.city_id = loc.city_code;
					this.locateDate.city_name = loc.city;
					this.locateDate.street_name = loc.street;
					this.locateDate.province_name = loc.province;
					this.locateDate.area_name = loc.district;
				});
		} else {
			NativeModules.Location.Location().then((vl) => {
				console.log(vl.address);
				this.locateDate.address = vl.address;
				this.locateDate.city_id = vl.city_id;
				this.locateDate.city_name = vl.city_name;
				this.locateDate.street_name = vl.street_name;
				this.locateDate.province_name = vl.province_name;
				this.locateDate.area_name = vl.area_name;


			}, (error) => {
				console.log("没有获取到定位");

			});
		}
	}

	componentWillUnmount = () => {

	}

	//获取短信验证码
	sendSms = () => {
		let userName = this.refs.userName.getInputTextValue();
		let verifyCode = this.refs.verifycode.getInputTextValue();
		if (typeof(verifyCode) == "undefined" || verifyCode == "") {
			this.props.showToast("验证码不能为空");
		} else if (typeof(userName) == "undefined" || userName == "") {
			this.props.showToast("请输入手机号");
		} else {
			let device_code = '';
			if (Platform.OS === 'android') {
				device_code = 'dycd_platform_android';
			} else {
				device_code = 'dycd_platform_ios';
			}
			let maps = {
				device_code: device_code,
				img_code: verifyCode,
				img_sid: imgSid,
				phone: userName,
				type: "1",
			};
			// this.props.showModal(true);
			this.setState({
				loading: true,
			});
			request(AppUrls.SEND_SMS, 'Post', maps)
				.then((response) => {
					// this.props.showModal(false);
					this.setState({
						loading: false,
					});
					if (response.mjson.code == "1") {
						this.refs.smsCode.StartCountDown();
						// this.refs.smsCode.setInputTextValue(response.mjson.data.code + "");
					} else {
						this.props.showToast(response.mjson.msg);
					}
				}, (error) => {
					// this.props.showModal(false);
					this.setState({
						loading: false,
					});
					this.Verifycode();
					if (error.mycode == -300 || error.mycode == -500) {
						this.props.showToast("短信验证码获取失败");
					} else if (error.mycode == 7040012) {
						this.Verifycode();
						this.props.showToast(error.mjson.msg + "");
					} else {
						this.props.showToast(error.mjson.msg + "");
					}
				});
		}
	}

	// 弹出modal  选择相册或者相机
	// _labelPress = () => {
	//
	// 	this.imageSource.openModal('','12345',require('./../../images/login/holdSample.png'));
	// };
	//弹出modal  选择相册或者相机
	// _rePhoto = () => {
	//
	// 	this.imageSource.openModal('','12345',require('./../../images/login/holdSample.png'));
	// };


	//点击加号框 事件
	// selectPhotoTapped(id) {
	//    this.id = id;
	//    this._rePhoto();
	//     // if (Platform.OS === 'android') {
	//     //     this.id = id;
	//     //     this._rePhoto();
	//     // } else {
	//     //     // ImagePicker.showImagePicker(options, (response) => {
	//     //     //     if (response.didCancel) {
	//     //     //     } else if (response.error) {
	//     //     //     } else if (response.customButton) {
	//     //     //     } else {
	//     //     //         this.uploadImage(response, id);
	//     //     //     }
	//     //     // });
	//     //
	//     // }
	// }

	//相机点击事件
	// _cameraClick = () => {
	//     ImagePicker.launchCamera(options, (response) => {
	//         if (response.didCancel) {
	//         } else if (response.error) {
	//         } else if (response.customButton) {
	//         } else {
	//             this.uploadImage(response, this.id);
	//         }
	//     });
	// }
	//相册点击事件
	// _galleryClick = () => {
	//     ImagePicker.launchImageLibrary(options, (response) => {
	//         if (response.didCancel) {
	//         } else if (response.error) {
	//         } else if (response.customButton) {
	//         } else {
	//             this.uploadImage(response, this.id);
	//         }
	//     });
	// }

	//上传图片
	// uploadImage = (response, id) => {
	//     let params = {
	//         base64_file: 'data:image/jpeg;base64,' + encodeURI(response.data).replace(/\+/g, '%2B')
	//     };
	//     // this.props.showModal(true);
	//     this.setState({
	//         loading: true,
	//     });
	//     ImageUpload.request(AppUrls.AUTH_UPLOAD_FILE, 'Post', params)
	//         .then((response) => {
	//             // this.props.showModal(false);
	//             this.setState({
	//                 loading: false,
	//             });
	//             if (response.mycode == 1) {
	//                 let source = {uri: response.mjson.data.url};
	//                 if (id === 'idcard') {
	//                     idcardf = response.mjson.data.file_id;
	//                     if (idcardf != "") {
	//                         this.setState({
	//                             idcard: source
	//                         });
	//                     } else {
	//                         this.props.showToast("id 为空 图片上传失败");
	//                     }
	//                 } else if (id === 'idcardBack') {
	//                     idcardback = response.mjson.data.file_id;
	//                     if (idcardback != "") {
	//                         this.setState({
	//                             idcardBack: source
	//                         });
	//                     } else {
	//                         this.props.showToast("id 为空 图片上传失败");
	//                     }
	//                 } else if (id === 'businessLicense') {
	//                     businessid = response.mjson.data.file_id;
	//                     if (businessid != "") {
	//                         this.setState({
	//                             businessLicense: source
	//                         });
	//                     } else {
	//                         this.props.showToast("id 为空 图片上传失败");
	//                     }
	//                 }
	//             } else {
	//                 this.props.showToast(response.mjson.msg + "!");
	//             }
	//         }, (error) => {
	//             // this.props.showModal(false);
	//             this.setState({
	//                 loading: false,
	//             });
	//             this.props.showToast("图片上传失败");
	//         });
	// }

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: FontAndColor.COLORA3
	},
	buttonStyle: {
		marginTop: Pixel.getPixel(10),
		marginBottom: Pixel.getPixel(10),
		marginLeft: Pixel.getPixel(10),
	},
	itemStyel: {},
	inputTextsStyle: {
		backgroundColor: '#ffffff',
		paddingLeft: Pixel.getPixel(15),
		paddingRight: Pixel.getPixel(15),
	},
	inputTextStyle: {
		backgroundColor: '#ffffff',
		paddingLeft: 0,
		paddingRight: 0,
		margin: 0,
	},
	inputTextLine: {
		backgroundColor: FontAndColor.COLORA3,
		height: Pixel.getPixel(10),
		width: width,
	},
	imageButtonsStyle: {
		width: width,
		height: Pixel.getPixel(88),
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#ffffff',
		paddingLeft: Pixel.getPixel(15),
		paddingRight: Pixel.getPixel(15),

	},
	imageButtonStyle: {
		width: Pixel.getPixel(80),
		height: Pixel.getPixel(60),
		resizeMode: 'contain'
	},
	imageClearButtonStyle: {
		width: Pixel.getPixel(17),
		height: Pixel.getPixel(17),
	},
	imagebuttonok: {
		width: width,
		backgroundColor: FontAndColor.COLORA3,
		height: Pixel.getPixel(130),
		paddingLeft: Pixel.getPixel(15),
		paddingRight: Pixel.getPixel(15),
		paddingTop: Pixel.getPixel(25)
	}
});