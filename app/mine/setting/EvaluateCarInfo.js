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
	ScrollView
} from "react-native";
import BaseComponent from "../../component/BaseComponent";
import PixelUtil from "../../utils/PixelUtil";
import * as FontAndColor from "../../constant/fontAndColor";
import NavigationBar from "../../component/NavigationBar";
import MyButton from "../../component/MyButton";
import EvaluateCarInfoTWO from "./EvaluateCarInfoTWO";

import YJZButton from '../../mine/setting/YJZButton';

var Pixel = new PixelUtil();
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
var onePT = 1 / PixelRatio.get(); //一个像素
var Platform = require('Platform');
export default class EvaluateCarInfo extends BaseComponent {
	constructor(props) {
		super(props);
		this.aspectSelectArray = [];
		this.state = {
			SELECT: true,
		}
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
				<NavigationBar
					leftImageShow={true}
					leftTextShow={false}
					centerText={"评估车辆信息"}
					rightText={""}
					leftImageCallBack={this.backPage}/>

				<ScrollView contentContainerStyle={{alignItems: 'center',backgroundColor:'white'}} >
					<View style={[styles.itemStyle, {marginTop: Pixel.getPixel(15)}]}>

						<Text allowFontScaling={false} style={styles.firstTextStyle}>{this.props.carData.carName}</Text>
						<Text allowFontScaling={false} style={styles.secondTextStyle}>{this.props.carData.vin}</Text>
						<Image
							source={require('../../../images/mainImage/progressONE.png')}
							style={styles.progressImageStyle}

						/>
						<Text allowFontScaling={false} style={styles.forthTextStyle}>请将外观损坏或污染的位置按钮点亮</Text>
						<View style={{height: Pixel.getPixel(1),width: Width -Pixel.getPixel(30),
					              marginBottom:Pixel.getPixel(0),backgroundColor: FontAndColor.COLORA4}}/>

					</View>
					<Image
						source={require('../../../images/mainImage/moxingyi@3x.png')}
						style={styles.imageStyle}

					>
						<YJZButton PartTitle="左前大灯" NumTitle="2" MYLEFT={100} MYTOP={80} callBack={this.callBack}/>
						<YJZButton PartTitle="右前大灯" NumTitle="1" MYLEFT={170} MYTOP={80} callBack={this.callBack}/>
						<YJZButton PartTitle="左外后车镜" NumTitle="13" MYLEFT={70} MYTOP={40} callBack={this.callBack}/>
						<YJZButton PartTitle="右外后车镜" NumTitle="11" MYLEFT={190} MYTOP={40} callBack={this.callBack}/>
						<YJZButton PartTitle="前格栅" NumTitle="12" MYLEFT={144} MYTOP={20} callBack={this.callBack}/>
						<YJZButton PartTitle="左前轮" NumTitle="3" MYLEFT={7} MYTOP={122} callBack={this.callBack}/>
						<YJZButton PartTitle="左后轮" NumTitle="6" MYLEFT={6} MYTOP={285} callBack={this.callBack}/>
						<YJZButton PartTitle="右前轮" NumTitle="7" MYLEFT={290} MYTOP={120} callBack={this.callBack}/>
						<YJZButton PartTitle="右后轮" NumTitle="10" MYLEFT={288} MYTOP={282} callBack={this.callBack}/>
						<YJZButton PartTitle="左前车窗" NumTitle="4" MYLEFT={53} MYTOP={182} callBack={this.callBack}/>
						<YJZButton PartTitle="左后车窗" NumTitle="5" MYLEFT={53} MYTOP={225} callBack={this.callBack}/>
						<YJZButton PartTitle="右前车窗" NumTitle="8" MYLEFT={225} MYTOP={183} callBack={this.callBack}/>
						<YJZButton PartTitle="右后车窗" NumTitle="9" MYLEFT={225} MYTOP={226} callBack={this.callBack}/>
						<YJZButton PartTitle="前挡风玻璃" NumTitle="14" MYLEFT={135} MYTOP={156} callBack={this.callBack}/>
						<YJZButton PartTitle="天窗玻璃及饰条" NumTitle="15" MYLEFT={125} MYTOP={210} callBack={this.callBack}/>
						<YJZButton PartTitle="后挡风玻璃" NumTitle="16" MYLEFT={135} MYTOP={276} callBack={this.callBack}/>
						<YJZButton PartTitle="右后尾灯" NumTitle="17" MYLEFT={198} MYTOP={376} callBack={this.callBack}/>
						<YJZButton PartTitle="四轮轮罩" NumTitle="18" MYLEFT={142} MYTOP={376} callBack={this.callBack}/>
						<YJZButton PartTitle="左后尾灯" NumTitle="19" MYLEFT={85} MYTOP={376} callBack={this.callBack}/>

					</Image>

					<MyButton buttonType={MyButton.TEXTBUTTON}
					          content={'下一步'}
					          parentStyle={styles.loginBtnStyle}
					          childStyle={styles.loginButtonTextStyle}
					          mOnPress={this.loginOut}/>
				</ScrollView>


			</View>
		);
	}

    callBack=(PartTitle,selectType,NumTitle)=>{
		if(selectType){
			this.aspectSelectArray.push(NumTitle);
		}else {
			for(let i=0;i<this.aspectSelectArray.length;i++){
				if(this.aspectSelectArray[i] == NumTitle){
					this.aspectSelectArray.splice(i,1);
				}
			}
		}

	}

	loginOut = () => {


		this.toNextPage({
			name: 'EvaluateCarInfoTWO',
			component: EvaluateCarInfoTWO,
			params: {
				carData:this.props.carData,
                roleName:this.props.roleValue,
                type:this.props.type,
                aspectSelectArray:this.aspectSelectArray,
                reloadTaskData:this.props.reloadTaskData,

            },
		})
	}


}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: FontAndColor.COLORA3,
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
	progressImageStyle:{
		marginTop: Pixel.getPixel(15),
		width: Pixel.getPixel(291),
		height: Pixel.getPixel(30),
	}

});