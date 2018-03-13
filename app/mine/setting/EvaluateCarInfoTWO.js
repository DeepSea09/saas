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
import EvaluateCarInfoTHREE from "./EvaluateCarInfoTHREE";

import YJZButton from '../../mine/setting/YJZButton';

var Pixel = new PixelUtil();
const Width = Dimensions.get('window').width;
var onePT = 1 / PixelRatio.get(); //一个像素
var Platform = require('Platform');
let buttonArray = [];
export class buttonItemInfo {
	constructor(numberTitle, partTitle, unableClick, leftDistance, topDistance, select) {

		this.numberTitle = numberTitle;
		this.partTitle = partTitle;
		this.unableClick = unableClick;
		this.leftDistance = leftDistance;
		this.topDistance = topDistance;
		this.select = select;
		this.key = partTitle;

	}

}
;
export default class EvaluateCarInfo extends BaseComponent {
	constructor(props) {
		super(props);
		this.withinArray = [];
		this.state = {
			SELECT: true,
		}
		buttonArray = [
            new buttonItemInfo('1', '前排风出口', false, 245, 30, false),
            new buttonItemInfo('2', '右前门内饰', false, 245, 115, false),
            new buttonItemInfo('3', '右后门内饰', false, 245, 210, false),
            new buttonItemInfo('4', '后排风出口', false, 245, 300, false),
            new buttonItemInfo('5', '安全带外观检查', false, 6, 327, false),
            new buttonItemInfo('6', '左后门内饰', false, 28, 210, false),
            new buttonItemInfo('7', '左前门内饰', false, 27, 117, false),
            new buttonItemInfo('8', '副仪表盘', false, 90, 85, false),
            new buttonItemInfo('9', '中控台', false, 150, 85, false),
            new buttonItemInfo('10', '安全气囊', false, 190, 95, false),
            new buttonItemInfo('11', '主座椅', false, 115, 175, false),
            new buttonItemInfo('12', '扶手箱', false, 150, 145, false),
            new buttonItemInfo('13', '副座椅', false, 185, 175, false),
            new buttonItemInfo('14', '顶衬', false, 155, 225, false),
            new buttonItemInfo('15', '左后座椅', false, 112, 260, false),
            new buttonItemInfo('16', '右后座椅', false, 185, 260, false),
            new buttonItemInfo('17', '随车工具', false, 145, 327, false),
            new buttonItemInfo('18', '备胎', false, 198, 390, false),
            new buttonItemInfo('19', '后备箱盖板', true, 85, 410, false),
		];
	}

	render() {
		let items = [];
		buttonArray.map((dataSource) => {
			let tabItem;
			tabItem =
				<YJZButton
					key = {dataSource.key} select = {dataSource.select}
					UnableClick={dataSource.unableClick} PartTitle={dataSource.partTitle}
					NumTitle={dataSource.numberTitle} MYLEFT={dataSource.leftDistance} MYTOP={dataSource.topDistance}
					callBack={this._ONclick}>
				</YJZButton>
			items.push(tabItem);
		})
		return (
			<View style={styles.container}>
				<NavigationBar
					leftImageShow={true}
					leftTextShow={false}
					centerText={"评估车辆信息"}
					rightText={""}
					leftImageCallBack={this.backPage}/>

				<ScrollView contentContainerStyle={{alignItems: 'center',backgroundColor:'white'}}>
					<View style={[styles.itemStyle, {marginTop: Pixel.getPixel(15)}]}>

						<Text allowFontScaling={false} style={styles.firstTextStyle}>{this.props.carData.carName}</Text>
						<Text allowFontScaling={false} style={styles.secondTextStyle}>{this.props.carData.vin}</Text>
						<Image
							source={require('../../../images/mainImage/progressTWO.png')}
							style={styles.progressImageStyle}

						/>
						<Text allowFontScaling={false} style={styles.forthTextStyle}>请将内饰损坏或污染的位置按钮点亮</Text>
						<View style={{height: Pixel.getPixel(1),width: Width -Pixel.getPixel(30),
					              marginBottom:Pixel.getPixel(0),backgroundColor: FontAndColor.COLORA4}}/>

					</View>
					<Image
						source={require('../../../images/mainImage/moxinger@3x.png')}
						style={styles.imageStyle}
						resizeMode="contain"

					>
						{items}

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

	_ONclick = (PartTitle,selectType,NumTitle) => {

        if(selectType){
            this.withinArray.push(NumTitle);
        }else {
            for(let i=0;i<this.withinArray.length;i++){
                if(this.withinArray[i] == NumTitle){
                    this.withinArray.splice(i,1);
                }
            }
        }

	}
	loginOut = () => {
		this.toNextPage({
			name: 'EvaluateCarInfoTHREE',
			component: EvaluateCarInfoTHREE,
			params: {
                carData:this.props.carData,
                roleName:this.props.roleValue,
                type:this.props.type,
                aspectSelectArray:this.props.aspectSelectArray,
                withinArray:this.withinArray,
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
		height: Pixel.getPixel(455),
	},
	progressImageStyle: {
		marginTop: Pixel.getPixel(15),
		width: Pixel.getPixel(291),
		height: Pixel.getPixel(30),
	}

});
