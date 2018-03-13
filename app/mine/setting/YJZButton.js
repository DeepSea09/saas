/**
 * Created by yujinzhong on 2017/7/26.
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
import * as fontAndClolr from '../../constant/fontAndColor';
import  PixelUtil from '../../utils/PixelUtil'
var Pixel = new PixelUtil();
/*
 * 获取屏幕的宽和高
 **/
const {width, height} = Dimensions.get('window');

export default class YJZButton extends Component {
	constructor(props) {
		super(props);

		this.selectType = this.props.select;
		this.state = {

			SELECT: this.props.select,
		};
	}
	render() {

		return (
			<TouchableOpacity activeOpacity={0.9}
			                  style={[styles.container,{left:Pixel.getPixel(this.props.MYLEFT),top:Pixel.getPixel(this.props.MYTOP)}]}
			                  onPress={() => this.onPress()}
			                  >
				<Image
					source = {this.state.SELECT ?require('../../../images/mainImage/lanquan@3x.png') :require('../../../images/mainImage/baiquan@3x.png')}
					style={styles.imageStyle}

				>
					<Text   style={ this.state.SELECT ?styles.SelectNumTitleStyle:styles.NumTitleStyle}>{this.props.NumTitle}</Text>
				</Image>

				<Text   style={styles.PartTitleStyle}>{this.props.PartTitle}</Text>
			</TouchableOpacity>

		);
	}
	onPress = () => {
		if (this.props.UnableClick){

		}else{
            this.selectType = !this.selectType;
			this.setState({
				SELECT:this.selectType
			});
			this.props.callBack(this.props.PartTitle,this.selectType,this.props.NumTitle);
		}

	}
}
const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		position:'absolute'
	},
	imageStyle: {
		width: Pixel.getPixel(17),
		height: Pixel.getPixel(17),
		justifyContent: 'center',
		alignItems: 'center',
		overflow :'hidden'
	},

	NumTitleStyle: {
		fontSize: Pixel.getFontPixel(10),
		color: fontAndClolr.COLORB0,
		backgroundColor:'#00000000',

	},
	SelectNumTitleStyle: {
		fontSize: Pixel.getFontPixel(10),
		color: fontAndClolr.COLORA3,
		backgroundColor:'#00000000',

	},
	PartTitleStyle: {
		fontSize: Pixel.getFontPixel(fontAndClolr.MARKFONT22),
		color: fontAndClolr.COLORA0,
		backgroundColor:"#00000000",
	},


});