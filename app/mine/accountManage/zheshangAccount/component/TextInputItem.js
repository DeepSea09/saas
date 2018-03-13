/**
 * Created by dingyonggang on 2017/10/27.
 */
import React, {Component, PropTypes} from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    TouchableWithoutFeedback,
    ActivityIndicator,
    PixelRatio
} from "react-native";
import * as FontAndColor from "../../../../constant/fontAndColor";
import SendMmsCountDown from "../../../../login/component/SendMmsCountDown";
import PixelUtil from "../../../../utils/PixelUtil";
import MyButton from "../../../../component/MyButton";

let Pixel = new PixelUtil();
let Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');
let onePT = 1 / PixelRatio.get(); //一个像素
import SText from './SaasText'



export default class TextInputItem extends Component{

    constructor(props){
        super(props)
        this.state = {
            value: this.props.value
        }
    }

    static defaultProps = {
        rightIcon:false,
        loading:false,
        editable:true,
        value:null,
        title:'标题',
        rightButton: false,
        clearValue: false,
        maxLength: 100,
        annotation:null,
        textPlaceholder: null,
        keyboardType: 'default',
        secureTextEntry: false,//设置是否为密码安全输入框	bool，默认为false
        separator:true,
        onChangeText:null,

    };

    static propTypes = {

        rightIcon:PropTypes.bool,
        loading:PropTypes.bool,
        onChangeText:PropTypes.func,
        editable:PropTypes.bool,
        value:PropTypes.string,
        title:PropTypes.string,
        separator:PropTypes.bool,
        rightButton: PropTypes.bool,
        clearValue: PropTypes.bool,//清除输入框内容
        annotation:PropTypes.string,
        maxLength: PropTypes.number,//限制文本输入框最大的输入字符长度
        textPlaceholder: PropTypes.string,
        keyboardType: PropTypes.string,  //键盘类型：用来选择默认弹出键盘类型
        inputTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        viewStytle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        titleStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        callBackSms: PropTypes.func,//发送短语验证码
    }

    StartCountDown = () => {
        if (this.props.rightButton) {
            this.refs.sendMms.StartCountDown();
        } else {
            alert("您没有开启此功能哦")
        }
    }
    getInputTextValue() {
        return this.state.value;
    }

    setInputTextValue = (text) => {
        this.setState({
            value: text
        });
    }

    render(){
        return(

            <View style = {{backgroundColor:'white'}}>
                <View style = {[styles.container, this.props.separator?{borderBottomColor: FontAndColor.COLORA4}:{borderBottomColor:'white'}]}>
                    <SText
                        style={[styles.title, this.props.titleStyle]}
                    >{this.props.title}</SText>
                    <TextInput
                        ref="inputText"
                        underlineColorAndroid={"#00000000"}
                        keyboardType = {this.props.keyboardType}
                        placeholder = {this.props.textPlaceholder?this.props.textPlaceholder:'请输入'+this.props.title}
                        style={[styles.textInputStyle, this.props.inputTextStyle]}
                        maxLength={this.props.maxLength}
                        secureTextEntry={this.props.secureTextEntry}
                        value={this.state.value}
                        editable = {this.props.editable}
                        onChangeText={(text) => {
                            this.setState({
                                value: text
                            });

                            if(this.props.onChangeText){
                                this.props.onChangeText(text)
                            }

                        }}
                    />

                    {
                        this.props.loading?

                            <ActivityIndicator size='small'/>

                            :null
                    }

                    {
                        this.props.rightIcon?
                            <Image source = {require('../../../../../images/mainImage/celljiantou.png')}/>
                            :null
                    }
                    {
                        this.props.rightButton ?
                            <SendMmsCountDown ref="sendMms" callBackSms={this.props.callBackSms}/> : null
                    }
                    {
                        this.props.annotation?
                            <SText
                                style={styles.annotation}
                            >{this.props.annotation}</SText> : null
                    }

                </View>

            </View>

        )
    }

}


const styles = StyleSheet.create({

    title:{
        fontSize:15,
        color:FontAndColor.COLORA0
    },
    container: {
        marginHorizontal:15,
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

    annotation:{
        fontSize:15,
        color:FontAndColor.COLORA2
    }

});