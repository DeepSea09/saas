/**
 * Created by yujinzhong on 2017/7/27.
 */
import React, {Component} from "react";
import {
	AppRegistry,
	View,
	Text,
	StyleSheet,
	Image,
	Dimensions,
	PixelRatio,
	TouchableOpacity,
	InteractionManager,
	TouchableWithoutFeedback,
	NativeModules,
	ScrollView,
	TextInput,
} from "react-native";
import BaseComponent from "../../component/BaseComponent";
import PixelUtil from "../../utils/PixelUtil";
import * as FontAndColor from "../../constant/fontAndColor";
import AllNavigationView from  '../../component/AllNavigationView';
import MyButton from "../../component/MyButton";
import * as AppUrls from "../../constant/appUrls";
import  {request}   from '../../utils/RequestUtil';

import WriteArrangeCostDetailTWO from '../../mine/setting/WriteArrangeCostDetailTWO';

var Pixel = new PixelUtil();
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
var onePT = 1 / PixelRatio.get(); //一个像素
var Platform = require('Platform');
const IS_ANDROID = Platform.OS === 'android';

export default class EvaluateCarInfo extends BaseComponent {
	constructor(props) {
		super(props);
		this.remark = '';

    }

	initFinish = () => {
		InteractionManager.runAfterInteractions(() => {
			this.setState({renderPlaceholderOnly: false});
			// this.Verifycode();
		});
	}

	render() {

		return (
			<View style={styles.container}>
				<ScrollView keyboardDismissMode={IS_ANDROID?'none':'on-drag'}>
					<View style={[styles.itemStyle, {marginTop: Pixel.getPixel(15)}]}>

						<Text allowFontScaling={false} style={styles.firstTextStyle}>{this.props.carData.carName}</Text>
						<Text allowFontScaling={false} style={styles.secondTextStyle}>{this.props.carData.vin}</Text>
						<Image
							source={require('../../../images/mainImage/progressFOUR.png')}
							style={styles.progressImageStyle}
						/>
						<Text allowFontScaling={false} style={styles.secondTextStyle}></Text>
						<View style={{height: Pixel.getPixel(1),width: Width -Pixel.getPixel(30),
                            marginBottom:Pixel.getPixel(0),backgroundColor: FontAndColor.COLORA4}}/>
					</View>
					<View style={{height: Pixel.getPixel(120),width: Width,
                        marginTop:Pixel.getPixel(10),backgroundColor:'white'}}>
						<Text allowFontScaling={false} style={styles.beizhuTextStyle}>备注</Text>
						<TextInput
							multiline={true}
							ref="inputText"
							underlineColorAndroid={"#00000000"}
							placeholder="请输入备注信息"
							placeholderTextColor={FontAndColor.COLORA1}
							style={styles.textInputStyle}
							onChangeText={(text) => {
                                this.remark = text;
                            }}/>
					</View>
				</ScrollView>
				<MyButton buttonType={MyButton.TEXTBUTTON}
						  content={'提交'}
						  parentStyle={styles.loginBtnStyle}
						  childStyle={styles.loginButtonTextStyle}
						  mOnPress={this.loginOut}/>
				<AllNavigationView title="评估车辆信息" backIconClick={this.backPage}/>
			</View>
		);
	}

	loginOut = () => {

		let {aspectSelectArray,withinArray,paintArray} = this.props;
		console.log(aspectSelectArray,withinArray,paintArray);
		let selectStr = '';
		if(aspectSelectArray.length>0){
			selectStr+='1:';
			for (let index=0;index<aspectSelectArray.length;index++)
			{
				let NumTitle = aspectSelectArray[index];
				selectStr+=(NumTitle + (index==aspectSelectArray.length-1?';':','));
			}
		}
		if(withinArray.length>0){
			selectStr+='2:';
			for (let index=0;index<withinArray.length;index++)
			{
                let NumTitle = withinArray[index];
                selectStr+=(NumTitle + (index==withinArray.length-1?';':','));
			}
		}
		if(paintArray.length>0){
			selectStr+='3:';
			for (let index=0;index<paintArray.length;index++)
			{
                let NumTitle = paintArray[index];
                selectStr+=(NumTitle + (index==paintArray.length-1?'':','));
			}
		}

        this.props.showModal(true);
        request(AppUrls.CAR_CHESHANG_PGS_EDIT_TASK,'post',{
            infos:selectStr,
            remark:this.remark,
            tid:this.props.carData.id,
		}).then((response) => {
            this.props.showModal(false);
			this.navigationBack();
        }, (error) => {
			this.props.showToast(error.mjson.msg);
        });


	}

    navigationBack=()=>{
        const navigator = this.props.navigator;
        if (navigator) {
            for (let i = 0; i < navigator.getCurrentRoutes().length; i++) {
                if (navigator.getCurrentRoutes()[i].name == 'CarTrimScene') {
                    navigator.popToRoute(navigator.getCurrentRoutes()[i]);
                    this.props.reloadTaskData && this.props.reloadTaskData();
                    break;
                }
            }
        }
    }


}
const styles = StyleSheet.create({
		container: {
			flex: 1,
			alignItems: 'center',
			backgroundColor: FontAndColor.COLORA3,
			paddingTop:Pixel.getTitlePixel(64),
		},
		itemStyle: {
			flexDirection: 'column',
			alignItems: 'center',
			width: Width,
			height: Pixel.getPixel(160),
			backgroundColor: '#ffffff'
		},
		firstTextStyle: {
			color: FontAndColor.COLORA0,
			fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT30),
			marginTop: Pixel.getPixel(20),
		},
		secondTextStyle: {
			color: FontAndColor.COLORA0,
			fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT28),
			marginTop: Pixel.getPixel(10),
		},
		forthTextStyle: {
			flex: 1,
			color: FontAndColor.COLORA0,
			fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT28),
			marginTop: Pixel.getPixel(19),
		},
		beizhuTextStyle: {
			color: FontAndColor.COLORA0,
			fontSize: Pixel.getFontPixel(FontAndColor.NAVIGATORFONT34),
			marginTop: Pixel.getPixel(10),
			marginLeft: Pixel.getPixel(10),
		},
		loginBtnStyle: {
			height: Pixel.getPixel(44),
			width: Width - Pixel.getPixel(30),
			backgroundColor: FontAndColor.COLORB0,
			marginTop: Pixel.getPixel(30),
			marginBottom: Pixel.getPixel(10),
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: Pixel.getPixel(4),
		},
		loginButtonTextStyle: {
			color: FontAndColor.COLORA3,
			fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT)
		},
		imageStyle: {
			marginTop: Pixel.getPixel(20),
			width: Pixel.getPixel(327),
			height: Pixel.getPixel(415),
		},
		progressImageStyle: {
			marginTop: Pixel.getPixel(15),
			width: Pixel.getPixel(291),
			height: Pixel.getPixel(30),
		},
		textInputStyle: {

			width: Width - Pixel.getPixel(30),
			flex: 1,
			textAlign: 'left',
			marginTop: Pixel.getPixel(10),
			fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT),
			marginLeft: Pixel.getPixel(10),
			paddingLeft: Pixel.getPixel(0),
			paddingTop: 0,
			paddingBottom: 0,
			color: FontAndColor.COLORA0,

		},

	})
	;