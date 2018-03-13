import React, {Component, PropTypes} from "react";
import {AppRegistry, StyleSheet, Text, View, PixelRatio, TextInput, Image} from "react-native";
import * as FontAndColor from "../../constant/fontAndColor";
import PixelUtil from "../../utils/PixelUtil";
import MyButton from "../../component/MyButton";

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var onePT = 1 / PixelRatio.get(); //一个像素
var Pixel = new PixelUtil();

export default class Search extends Component {

    constructor(props) {
        super(props);
        //初始化方法
        this.state = {
            value: "",
        }
    }

    static defaultProps = {
        leftIconShow: true,
        clearValue: false,
        inputPlaceholder: "请输入用户名",
        leftIconUri: './../images/login/phone.png',
        keyboardType: null,
    };

    /**
     * searchBtShow 设置输入框是否有搜索按钮
     * inputPlaceholder 输入框提示语
     * inputTextStyle 输入框样式
     * btnStyle 搜索按钮样式
     */
    static propTypes = {
        leftIconShow: PropTypes.bool,
        clearValue: PropTypes.bool,//清除输入框内容

        inputPlaceholder: PropTypes.string,
        keyboardType: PropTypes.string,

        inputTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        leftIconStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        itemStyel: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),

        callBackSearchResult: PropTypes.func,//定义搜索结果控件
    }

    //执行搜索操作搜索--此处执行搜索操作时隐藏
    goSearch = (text) => {
        if (text == "") {
            this.props.callBackSearchResult(true);
            this.setState({
                value: text
            });
        } else {
            this.props.callBackSearchResult(false);
            this.setState({
                value: text
            });
        }
    }

    getInputTextValue() {
        return this.state.value
    }

    setInputTextValue = (text) => {
        this.setState({
            value: text
        });
    }

    //文本框获取焦点时判断是否隐藏收索结果框
    showDefultContext = () => {
        if (this.state.value == "") {
            this.props.callBackSearchResult(true);
        } else {
            this.props.callBackSearchResult(false);
        }
    }

    //隐藏
    hide(val) {
        this.props.callBackSearchResult(false);
    }

    //设置输入框内容
    setValue(val) {
        this.setState({
            value: val
        });
    }

    //清空输入框内容
    clearValue = () => {
        this.props.callBackSearchResult(true);
        this.setState({
            value: "",
        });
    }

    render() {
        return (
            <View style={[styles.width, this.props.itemStyel]}>
                <View style={[styles.flexDirection, styles.inputHeight]}>
                    {this.props.leftIconShow ?
                        <Image source={require('./../../../images/login/phone.png')}
                               style={[styles.iconStyle, this.props.leftIconStyle]}/>
                        : null
                    }
                    <View style={styles.flex}>
                        <TextInput style={[styles.inputs, this.props.inputTextStyle]}
                                   returnKeyType={"search"}
                                   placeholder={this.props.inputPlaceholder}
                                   placeholderTextColor={FontAndColor.COLORA1}
                                   underlineColorAndroid={"#00000000"}
                                   value={this.state.value}
                                   onFocus={this.showDefultContext}
                                   keyboardType={this.props.keyboardType}
                                   maxLength={11}
                                   onChangeText={this.goSearch}/>
                        {
                            this.props.clearValue && this.state.value.length > 0 ?
                                <MyButton buttonType={MyButton.IMAGEBUTTON}
                                          content={require("../../../images/login/clear.png")}
                                          parentStyle={
                                              {padding: Pixel.getPixel(5)}
                                          }
                                          childStyle={{
                                              width: Pixel.getPixel(17),
                                              height: Pixel.getPixel(17)
                                          }}
                                          mOnPress={this.clearValue}/> : null

                        }
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    flexDirection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: FontAndColor.COLORA4,
        borderBottomWidth: onePT,
    },
    inputHeight: {
        height: Pixel.getPixel(44),
    },
    //输入框样式
    inputs: {
        flex: 1,
        height: Pixel.getPixel(44),
        paddingLeft: Pixel.getPixel(15),
        paddingRight: Pixel.getPixel(2),
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0,
        fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT),
        color: FontAndColor.COLORA0
    },
    iconStyle: {
        width: Pixel.getPixel(25),
        height: Pixel.getPixel(25),
    },
    width: {
        width: width - Pixel.getPixel(30),
    }
});
