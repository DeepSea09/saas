import React, {Component, PropTypes, PureComponent} from "react";
import {AppRegistry, StyleSheet, View, Text} from "react-native";
import MyButton from "./MyButton";
import * as FontAndColor from "../constant/fontAndColor";
import PixelUtil from "../utils/PixelUtil";

var Platform = require('Platform');
var Pixel = new PixelUtil();

export default class NavigationBar extends PureComponent {

    static defaultProps = {
        leftTextShow: false,
        leftImageShow: true,
        centerTextShow: true,
        rightTextShow: true,
        rightImageShow: false,

        leftText: "",
        leftImage: require('../../images/login/navigotion_back.png'),
        rightImage: require('../../images/login/add.png'),
        centerText: "注册",
        rightText: "提交",
    };

    static propTypes = {
        leftTextShow: PropTypes.bool,
        leftImageShow: PropTypes.bool,
        // centerTextShow: PropTypes.bool,
        rightTextShow: PropTypes.bool,
        rightImageShow: PropTypes.bool,

        leftText: PropTypes.string,
        leftImage: PropTypes.number,
        rightImage: PropTypes.number,
        centerText: PropTypes.string,
        rightText: PropTypes.string,

        leftTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        leftImageStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        rightImageStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        centerTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        rightTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        titleVeiwSytle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),

        leftTextCallBack: PropTypes.func,
        leftImageCallBack: PropTypes.func,
        rightImageCallBack: PropTypes.func,
        // centerTextCallBack: PropTypes.func,
        rightTextCallBack: PropTypes.func,
    }

    render() {
        return (
            <View
                style={[(Platform.OS === 'android') ? styles.titleAndroidStyle : styles.titleIOSStyle, this.props.titleVeiwSytle]}>

                {this.props.leftTextShow ?
                    <MyButton buttonType={MyButton.TEXTBUTTON}
                              content={this.props.leftText}
                              childStyle={[styles.leftTextStyle, this.props.leftTextStyle]}
                              mOnPress={this.props.leftTextCallBack}/>
                    : null
                }

                {this.props.leftImageShow ?
                    <MyButton buttonType={MyButton.IMAGEBUTTON}
                              content={this.props.leftImage}
                              parentStyle={styles.buttonStyle}
                              childStyle={[styles.leftImageStyle, this.props.leftImageStyle]}
                              mOnPress={this.props.leftImageCallBack}/>
                    : null
                }


                <Text allowFontScaling={false}  style={[styles.centerTextStyle, this.props.centerTextStyle]}>
                    {this.props.centerText}
                </Text>

                {this.props.rightTextShow ?
                        <MyButton buttonType={MyButton.TEXTBUTTON} content={this.props.rightText}
                                  childStyle={[styles.rightTextStyle, this.props.rightTextStyle]}
                                  mOnPress={ this.props.rightTextCallBack }/>
                    : null
                }

                {this.props.rightImageShow ?
                    <MyButton buttonType={MyButton.IMAGEBUTTON}
                              content={this.props.rightImage}
                              parentStyle={styles.rightButtonStyle}
                              childStyle={[styles.leftImageStyle, this.props.rightImageStyle]}
                              mOnPress={this.props.rightImageCallBack}/>
                    : null
                }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonStyle: {
        width: Pixel.getPixel(100),
        paddingTop: Pixel.getPixel(5),
        paddingBottom: Pixel.getPixel(5),
        paddingLeft: Pixel.getPixel(15),
        paddingRight: Pixel.getPixel(15),
    },
    rightButtonStyle: {
        width: Pixel.getPixel(100),
        paddingTop: Pixel.getPixel(5),
        paddingBottom: Pixel.getPixel(5),
        paddingLeft: Pixel.getPixel(15),
        paddingRight: Pixel.getPixel(15),
        alignItems: 'flex-end',
    },
    titleAndroidStyle: {
        height: Pixel.getTitlePixel(64),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#05C5C2',
    },
    titleIOSStyle: {
        height: Pixel.getTitlePixel(64),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#05C5C2',
        paddingTop: Pixel.getPixel(20)
    },
    leftTextStyle: {
        textAlign: 'left',
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT),
        paddingLeft: Pixel.getPixel(15),
        paddingRight: Pixel.getPixel(15),
        paddingTop: Pixel.getPixel(5),
        paddingBottom: Pixel.getPixel(5),
        color: FontAndColor.COLORA3,
        width: Pixel.getPixel(100),
    },
    rightTextStyle: {
        textAlign: 'right',
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT),
        paddingLeft: Pixel.getPixel(15),
        paddingRight: Pixel.getPixel(15),
        paddingTop: Pixel.getPixel(5),
        paddingBottom: Pixel.getPixel(5),
        color: FontAndColor.COLORA3,
        width: Pixel.getPixel(100),
    },
    centerTextStyle: {
        flex: 1,
        textAlign: 'center',
        fontSize: Pixel.getFontPixel(FontAndColor.NAVIGATORFONT),
        paddingLeft: Pixel.getPixel(15),
        paddingRight: Pixel.getPixel(15),
        color: FontAndColor.COLORA3,
    },
    leftImageStyle: {
        width: Pixel.getPixel(20),
        height: Pixel.getPixel(20),
    },
});