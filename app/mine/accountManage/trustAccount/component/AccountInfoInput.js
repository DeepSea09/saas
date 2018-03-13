/**
 * Created by hanmeng on 2017/11/13.
 */
import React, {PureComponent} from 'react';
import {
    Text,
    View,
    Dimensions,
    TextInput,
    KeyboardAvoidingView
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../../../constant/fontAndColor';
export default class AccountInfoInput extends PureComponent {

    /**
     *
     **/
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.defValue ? this.props.defValue : ''
        }
    }

    /**
     *
     **/
    changeVisible = (value) => {
        this.setState({});
    }

    /**
     *   清空输入数据
     **/
    clearInputText = () => {
        this.setState({
            value: ''
        });
    };

    /**
     *
     **/
    render() {
        return (<View style={{width: width, height: Pixel.getPixel(45), backgroundColor: '#fff'}}>
            <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={-Pixel.getPixel(100)}>
                <View style={{
                    width: width, height: Pixel.getPixel(44), backgroundColor: '#00000000', flexDirection: 'row',
                    paddingLeft: Pixel.getPixel(15), paddingRight: Pixel.getPixel(15)
                }}>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <Text allowFontScaling={false}
                              style={{fontSize: Pixel.getFontPixel(14), color: '#000'}}>{this.props.items.name}</Text>
                    </View>
                    <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row'}}>
                        <TextInput style={{
                            fontSize: Pixel.getFontPixel(14),
                            color: fontAndColor.COLORA2,
                            textAlign: 'right',
                            width: width / 2 - Pixel.getPixel(19),
                            marginRight: Pixel.getPixel(5),
                            height: Pixel.getPixel(44),
                            paddingLeft: 0,
                            paddingRight: 0,
                            paddingTop: 0,
                            paddingBottom: 0,
                        }}
                            //defaultValue={this.props.defValue ? this.props.defValue : ''}
                                   keyboardType={this.props.items.name == '手机号' ? 'numeric' : 'default'}
                                   returnKeyType={"search"}
                            //secureTextEntry={pwd}
                                   placeholder={'请输入' + this.props.items.name}
                                   underlineColorAndroid={"#00000000"}
                                   value={this.state.value}
                            //maxLength={this.props.items.name == '电话' || this.props.items.name == '手机号码' ? 11 : 32}
                            //onBlur={this.uniqueCheck}
                            onChangeText={this.goSearch}
                        />
                    </View>
                </View>
                <View style={{width: width, height: Pixel.getPixel(1), backgroundColor: fontAndColor.COLORA3}}>

                </View>
            </KeyboardAvoidingView>
        </View>);
    }

    /**
     *   更新文字内容
     **/
    goSearch = (text) => {
        this.props.items.value = text;
        this.setState({
            value: text
        });
    }
}