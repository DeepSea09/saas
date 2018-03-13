import React, {Component} from "react";
import {
    View,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import PixelUtil from "../../../../utils/PixelUtil";
import * as fontAndColor from "../../../../constant/fontAndColor";
import BaseComponent from "../../../../component/BaseComponent";
import MyButton from '../../../../../app/component/MyButton'
import SaasText from './SaasText'


const {width, height} = Dimensions.get('window');
const Pixel = new PixelUtil();


let dismissKeyboard = require('dismissKeyboard')

export default class ZSBaseComponent extends BaseComponent {

    constructor(props){
        super(props)

        this.state = {
            alert:false
        }
    }

    out_of_service = () => {

        if (this.state.alert) {
            return (

                <TouchableOpacity
                    onPress={() => {
                        this.setState({
                            alert: false
                        })
                    }}
                    style={{
                        flexDirection: 'column',
                        position: 'absolute',
                        backgroundColor: 'rgba(0,0,0,.5)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: width,
                        height: height
                    }}>
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 5,
                        alignItems: 'center'
                    }}>
                        <SaasText style={{fontWeight: 'bold', fontSize: 20, marginVertical: 15}}>提示</SaasText>
                        <SaasText
                            numberOfLines={2}
                            style={{
                                marginBottom: 5,
                                marginHorizontal: 30,
                                textAlign: 'center',
                                width:200

                            }}>{this.state.out_of_service_msg}</SaasText>
                        <MyButton
                            buttonType={MyButton.TEXTBUTTON}
                            mOnPress={() => {
                                this.setState({
                                    alert: false
                                })
                            }}
                            content={'知道了'}
                            parentStyle={{
                                borderColor: fontAndColor.COLORB0,
                                borderWidth: 1,
                                borderRadius: 4,
                                marginVertical: 15
                            }}
                            childStyle={{
                                color: fontAndColor.COLORB0,
                                fontSize: 17,
                                marginHorizontal: 20,
                                marginVertical: 5
                            }}
                        />

                    </View>
                </TouchableOpacity>

            )

        } else {
            return null
        }
    }

}