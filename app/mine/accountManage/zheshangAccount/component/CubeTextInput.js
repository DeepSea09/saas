/**
 * Created by dingyonggang on 2017/10/27.
 */
import React, {Component, PropTypes} from "react";
import {
    TouchableWithoutFeedback,
    StyleSheet,
    Text,
    View,
    TextInput,
    PixelRatio,
    Keyboard
} from "react-native";
import * as FontAndColor from "../../../../constant/fontAndColor";
import PixelUtil from "../../../../utils/PixelUtil";
import SaasText from "./SaasText";


let Pixel = new PixelUtil();
let Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');
let onePT = 1 / PixelRatio.get(); //一个像素
let Size = 37;



export default class CubeTextInput extends Component {


    constructor(props) {
        super(props)
        this.state = {
            values: this.pushVules(''),
            focus:true
        }
    }

    componentWillMount() {
        this.k = Keyboard.addListener('keyboardDidHide', this.k_h)
    }

    componentWillUnmount() {
        this.k.remove()
    }

    //键盘收起来了 哈哈
    k_h = ()=>{
        this.refs.text_input.blur()
    }


    pushVules = (text) => {

        let valueArray = []
        for (let i = 0; i < this.props.count; i++) {
            if (i < text.length) {
                valueArray.push(Array.from(text)[i]);
            } else {
                valueArray.push('')
            }
        }
        return valueArray
    }

    onChangeText = (text) => {
        this.setState({
            values: this.pushVules(text)
        })
        this.props.onChangeText(text)
    }


    render() {

        let cubes = [];

        for (let i = 0; i < this.props.count; i++) {
            cubes.push(
                <TouchableWithoutFeedback
                    key={i}
                    onPress={()=>{
                        if(!this.refs.text_input.isFocused()){
                            this.refs.text_input.focus()
                        }
                            this.refs.text_input.focus()
                    }}
                >
                    <View
                        key={i + ''}
                        style={{
                            borderRightColor: FontAndColor.COLORA4,
                            borderRightWidth: i === this.props.count - 1 ? 0 : StyleSheet.hairlineWidth,
                            width: Size,
                            height: Size,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <SaasText
                            style={{fontSize: 25}}
                        >{this.state.values[i]}</SaasText>
                    </View>
                </TouchableWithoutFeedback>

            )
        }

        return (
            <View
                style={[{flexDirection: 'row', borderWidth: 1, borderColor: FontAndColor.COLORA4,}, this.props.style]}
            >
                {cubes}
                <TextInput
                    ref='text_input'
                    style={{
                        width: 0,
                        height: 0,
                        padding: 0
                    }}
                    underlineColorAndroid={"#00000000"}
                    keyboardType={'numeric'}
                    autoFocus={true}
                    maxLength={this.props.count}
                    onChangeText={(text) => {
                        this.onChangeText(text);
                    }}

                />
            </View>
        )
    }
}
