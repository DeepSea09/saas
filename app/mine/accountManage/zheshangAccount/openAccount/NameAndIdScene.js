/**
 * Created by dingyonggang on 2017/10/27.
 */
import React, {Component} from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    InteractionManager,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import BaseComponent from "../../../../component/BaseComponent";
import NavigationBar from "../../../../component/NavigationBar";
import * as FontAndColor from "../../../../constant/fontAndColor";
import PixelUtil from "../../../../utils/PixelUtil";
import MyButton from "../../../../component/MyButton";
import {request} from "../../../../utils/RequestUtil";
import * as AppUrls from "../../../../constant/appUrls";
import md5 from "react-native-md5";
import StorageUtil from "../../../../utils/StorageUtil";
import * as StorageKeyNames from "../../../../constant/storageKeyNames";
import TextInputItem from '../component/TextInputItem'
import CardPhoneSmsScene from './CardPhoneSmsScene'
import ZSBaseComponent from  '../component/ZSBaseComponent'

let Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');
let Pixel = new PixelUtil();
let Platform = require('Platform');

let type = -1;
//  1：企业
//  2：个人

export default class NameAndIdScene extends ZSBaseComponent {
    constructor(props) {
        super(props);
        type = this.props.type;
        this.state = {
            renderPlaceholderOnly: true,
        }
    }

    initFinish = () => {
        InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: false});
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
                        centerText={type===1?'企业开户':'个人开户'}
                        rightText={""}
                    />
                </View>
            </TouchableWithoutFeedback>);
        }
        return (
            <TouchableWithoutFeedback
                onPress = {()=>{
                    this.dismissKeyboard();
                }}
            >
                <View  style={styles.container}>
                    <NavigationBar
                        leftImageShow={true}
                        leftTextShow={false}
                        centerText={type===1?'企业开户':'个人开户'}
                        rightText={""}
                        leftImageCallBack={()=>{
                            this.backPage()
                        }}
                    />
                    <View style = {{width:width, marginTop:15, }}>

                        <TextInputItem
                            ref='name'
                            title={type === 1?'企业名称':'真实姓名'}

                        />

                        <TextInputItem
                            ref = 'id'
                            title={type === 1?'社会信用代码':'证件号码'}
                            textPlaceholder={type===1?'请输入企业社会信用代码':'请输入身份证号码'}
                            separator={false}
                        />
                    </View>
                    <MyButton buttonType={MyButton.TEXTBUTTON}
                              content={'下一步'}
                              parentStyle={styles.buttonStyle}
                              childStyle={styles.buttonTextStyle}
                              mOnPress={this.next}/>
                    {this.out_of_service()}
                </View>
            </TouchableWithoutFeedback>

        );
    }

    next=()=>{

        let name =  this.refs.name.getInputTextValue();
        let id = this.refs.id.getInputTextValue();


        if (name === '' || name === null){
            this.props.showToast(type === 1?'请输入企业名称':'请输入真实姓名'); return;
        }
        if(id === '' || id === null){
            this.props.showToast(type === 1?'请输入企业社会信用代码':'请输入身份证号码'); return;
        }
        if(id.length!==18){
            this.props.showToast(type===1?'社会信用代码格式有误':'身份证号格式有误'); return;
        }
        if(type ===1&& !this.CheckEnterpriseCode(id)){
            this.props.showToast('社会信用代码格式有误'); return;
        }

        this.generateAccount(name, id);

    }

    CheckEnterpriseCode = (str)=>{

        let contain_puctuation = false
        let contain_numeric = false
        let contain_alphabet = false

        for(let i = 0; i<str.length; i++){
            let c = str[i];

            if(this.isPuctuation(c)){
                contain_puctuation = true;
            }else if(this.isNumeric(c)){
                contain_numeric = true;
            }else if(this.isAlphabet(c)){
                contain_alphabet = true;
            }else {
               return false;
            }
        }

        if(contain_puctuation === true && contain_alphabet === false && contain_numeric === false){
            return false;  //纯标点符号
        }
        if(contain_puctuation === false && contain_alphabet === true && contain_numeric === false){
            return false; // 纯字母
        }

        return true
    }

    // 是否为标点符号
    isPuctuation = (c)=>{
        let re = /[.,\/#!$%\^&\*;:{}=\-_`~()]/;
        if (re.test(c)) {
            return true;
        }else {
            return false;
        }
    }

    //是否为数字
    isNumeric = (c)=>{
        let re = /[0-9]/;
        if (re.test(c)) {
            return true;
        }else {
            return false;
        }
    }

    //是否为字母
    isAlphabet = (c)=>{
        let re = /[a-zA-Z]/;
        if (re.test(c)) {
            return true;
        }else {
            return false;
        }

    }

    // 用姓名和身份证号，生成资金账号，下一步开户的时候会用到  产品原型和UI里都没有体现
    generateAccount = (name, id)=>{

        // this.toNextPage({
        //     component:CardPhoneSmsScene,
        //     name:'CardPhoneSmsScene',}
        //    )


        this.props.showModal(true)
        StorageUtil.mGetItem(StorageKeyNames.LOAN_SUBJECT, (data)=>{

            if (data.code === 1){

                let result = JSON.parse(data.result)

                let params = {
                    user_type:type,
                    cert_no:id,
                    cert_type:type === 1?2:1,
                    enter_base_id:result.company_base_id,
                    cust_name:name,

                }

                request(AppUrls.ZS_GENERATE_E_ACCOUNT, 'POST', params).then((response)=>{
                    this.props.showModal(false)

                        console.log(response)
                        this.toNextPage({
                            component:CardPhoneSmsScene,
                            name:'CardPhoneSmsScene',
                            params:{account:response.mjson.data, callBack:this.props.callBack}
                        })
                }, (error)=>{

                       this.props.showModal(false)
                    if(error.mycode === 8050324){  // 不在服务时间内
                        this.setState({
                            out_of_service_msg:error.mjson.msg,
                            alert:true
                        })
                        return
                    }
                       this.props.showToast(error.mjson.msg)
                })

            }
        })


    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: FontAndColor.COLORA3,
    },
    buttonStyle: {
        height: Pixel.getPixel(44),
        width: width - Pixel.getPixel(30),
        backgroundColor: FontAndColor.COLORB0,
        marginVertical: Pixel.getPixel(30),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Pixel.getPixel(4),
    },
    buttonTextStyle: {
        color: FontAndColor.COLORA3,
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT)
    },
    itemStyel: {
        backgroundColor: "#ffffff",
        paddingLeft: Pixel.getPixel(15),
        paddingRight: Pixel.getPixel(15),
    },
});

