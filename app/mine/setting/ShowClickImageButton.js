/**
 * Created by yujinzhong on 2017/7/28.
 */
import React, {Component} from 'react';
import {
	AppRegistry,
	View,
	Text,
	Image,
	StyleSheet,
	Dimensions,
	TouchableOpacity,

} from 'react-native';
/*
 * 获取字体型号,和颜色的文件
 **/
import * as fontAndColor  from '../../constant/fontAndColor';
import  PixelUtil from '../../utils/PixelUtil'
var Pixel = new PixelUtil();
/*
 * 获取屏幕的宽和高
 **/
const {width, height} = Dimensions.get('window');

export default class YJZButton extends Component {
	constructor(props) {
		super(props);

		this.state = {

			SELECT: this.props.select,
		};
	}
	render() {
		let items = [];
		let buttonArray = this.props.dataArray;
		buttonArray.map((dataSource) => {
			let tabItem;
			tabItem =
				<YJZButton
					key = {dataSource.key} select = {dataSource.select}
					UnableClick={dataSource.unableClick} PartTitle={dataSource.partTitle}
					NumTitle={dataSource.numberTitle} MYLEFT={dataSource.leftDistance} MYTOP={dataSource.topDistance}
					callBack={(partTitle)=>{
					this._ONclick(partTitle);
				}

				}>
				</YJZButton>
			items.push(tabItem);
		})
		return (
			<View>
				<View style={{width:Width}}>
					<Text allowFontScaling={false} style={styles.firstTextStyle}>外观受损图</Text>
				</View>
				<Image
					source={require('../../../images/mainImage/moxingyi.png')}
					style={styles.imageStyle}
				>
					{items}

				</Image>
			</View>

		);
	}
	onPress = () => {
		if (this.props.UnableClick){

		}else{
			this.setState({
				SELECT:!this.state.SELECT
			});
			this.props.callBack(this.props.PartTitle)
		}

	}
}
const styles = StyleSheet.create({
	imageTwoStyle:{
		marginTop: Pixel.getPixel(20),
		width: Pixel.getPixel(327),
		height: Pixel.getPixel(455),
	},
	firstTextStyle: {
		color: fontAndColor.COLORA0,
		fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT30),
		marginTop: Pixel.getPixel(10),
		marginLeft: Pixel.getPixel(20),
	},
	imageStyle: {
		marginTop: Pixel.getPixel(20),
		width: Pixel.getPixel(327),
		height: Pixel.getPixel(415),
	},


});