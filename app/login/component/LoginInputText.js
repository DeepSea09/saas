import React, {Component, PropTypes} from "react";
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    TouchableWithoutFeedback,
    ActivityIndicator,
    PixelRatio
} from "react-native";
import * as FontAndColor from "../../constant/fontAndColor";
import SendMmsCountDown from "./SendMmsCountDown";
import PixelUtil from "../../utils/PixelUtil";
import MyButton from "../../component/MyButton";

var Pixel = new PixelUtil();
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
let onePT = 1 / PixelRatio.get(); //一个像素

export default class LoginInputText extends Component {

    constructor(props) {
        super(props);
        this.state = {
            values: "",//输入框输入内容
            rightIconLodding: false,
        }
    }

    static defaultProps = {
        leftIcon: true,
        rightIcon: true,
        rightButton: false,
        clearValue: false,
        import: false,
        editable: true,

        maxLength: 1000,

        leftIconUri: require('../../../images/welcome.jpg'),
        rightIconSource: {uri: 'https://facebook.github.io/react/img/logo_og.png'},

        textPlaceholder: '请输入',
        keyboardType: 'default',
        leftText: null,
        secureTextEntry: false,//设置是否为密码安全输入框	bool，默认为false
    };

    static propTypes = {
        leftIcon: PropTypes.bool,
        rightIcon: PropTypes.bool,
        rightButton: PropTypes.bool,
        secureTextEntry: PropTypes.bool,
        clearValue: PropTypes.bool,//清除输入框内容
        import: PropTypes.bool,//是否为必填项
        editable: PropTypes.bool,

        leftIconUri: PropTypes.number,
        rightIconSource: PropTypes.object,
        maxLength: PropTypes.number,//限制文本输入框最大的输入字符长度
        textPlaceholder: PropTypes.string,
        leftText: PropTypes.string,
        keyboardType: PropTypes.string,  //键盘类型：用来选择默认弹出键盘类型

        inputTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        leftIconStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        rightIconStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        viewStytle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),

        rightIconClick: PropTypes.func,//定义搜索结果控件
        callBackSms: PropTypes.func,//发送短语验证码
    }

    clickBtn() {
        alert("未设置点击事件")
    }

    //改变右边图标的状态
    lodingStatus(val) {
        this.setState({
            rightIconLodding: val,
        });
    }

    getInputTextValue() {
        return this.state.values;
    }

    setInputTextValue = (text) => {
        this.setState({
            values: text
        });
    }

    renderLoading() {
        return (
            <ActivityIndicator size='small'
                               style={[styles.iconStyle, {width: Pixel.getPixel(45)}, this.props.rightIconStyle]}/>
        );
    }

    render() {
        return (
            <View style={[styles.componentStyle, this.props.viewStytle]}>

                {
                    this.props.leftIcon ?
                        <Image source={this.props.leftIconUri}
                               style={[styles.iconStyle, this.props.leftIconStyle]}/>
                        : null
                }
                {this.props.leftText ?
                    <Text allowFontScaling={false}  style={styles.leftTextStyle}>{this.props.leftText}</Text>
                    : null
                }

                {this.props.import ?
                    <Text allowFontScaling={false}  style={{
                        color: FontAndColor.COLORB2,
                        fontSize: FontAndColor.BUTTONFONT,
                        paddingRight: Pixel.getPixel(2)
                    }}>*</Text>
                    : null
                }
                <View style={
                    {
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>

                    <TextInput
                        ref="inputText"
                        underlineColorAndroid={"#00000000"}
                        placeholder={this.props.textPlaceholder}
                        placeholderTextColor={FontAndColor.COLORA1}
                        keyboardType={this.props.keyboardType}
                        style={[styles.textInputStyle, this.props.inputTextStyle]}
                        maxLength={this.props.maxLength}
                        secureTextEntry={this.props.secureTextEntry}
                        value={this.state.values}
                        onFocus={
                            this.props.foucsChange ? this.props.foucsChange : () => {}

                        }
                        onBlur={
                            this.props.onMyBlur ? this.props.onMyBlur : () => {}

                        }
                        editable={this.props.editable}
                        onChangeText={(text) => {
                            this.setState({
                                values: text
                            });
                        }}/>

                    {
                        this.props.rightIcon ?
                            !this.state.rightIconLodding ?
                                <TouchableWithoutFeedback
                                    onPress={this.props.rightIconClick ? this.props.rightIconClick : this.clickBtn}>
                                    <Image
                                        source={this.props.rightIconSource ? this.props.rightIconSource : require('./../../../images/login/loadingf_fali.png')}
                                        style={[styles.iconStyle, {
                                            width: Pixel.getPixel(100),
                                            height: Pixel.getPixel(32),
                                            resizeMode: 'stretch'
                                        }, this.props.rightIconStyle]}/>
                                </TouchableWithoutFeedback>
                                : this.renderLoading()
                            : null
                    }
                    {
                        this.props.rightButton ?
                            <SendMmsCountDown ref="sendMms" callBackSms={this.props.callBackSms}/> : null
                    }
                    {
                        this.props.clearValue && this.state.values.length > 0 ?
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
        );
    }

    clearValue = () => {
        this.setState({
            values: ""
        });
    }

    StartCountDown = () => {
        if (this.props.rightButton) {
            this.refs.sendMms.StartCountDown();
        } else {
            alert("您没有开启此功能哦")
        }
    }
}

const styles = StyleSheet.create({
    componentStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: onePT,
        borderBottomColor: FontAndColor.COLORA4,
        height: Pixel.getPixel(45),
    },
    textInputStyle: {
        flex: 1,
        height: Pixel.getPixel(44),
        textAlign: 'left',
        alignSelf: 'center',
        fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT),
        paddingLeft: Pixel.getPixel(15),
        paddingTop: 0,
        paddingBottom: 0,
        color: FontAndColor.COLORA0,
    },
    iconStyle: {
        width: Pixel.getPixel(25),
        height: Pixel.getPixel(25),
    },
    leftTextStyle: {
        fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT),
        color: FontAndColor.COLORA0,
        paddingRight: 5,
    }

});