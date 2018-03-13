/**
 * Created by lhc on 2017/2/15.
 */
import React, {Component, PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    ListView,
    InteractionManager,
    TextInput,
    PixelRatio
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../../constant/fontAndColor';
let onePT = 1 / PixelRatio.get(); //一个像素
let oldText = '';
export  default class AccountInput extends PureComponent {

    constructor(props) {
        super(props);
        oldText = '';
        this.state = {
            value: '',
            name:'',
            id:''
        };
    }

    getTextValue=()=>{
        return this.state.value;
    }

    getAllValue=()=>{
        return {value:this.state.value,name:this.state.name,id:this.state.id}
    }

    setTextValue=(value,id)=>{
      this.setState({
          name:value,
          id:id
      });
    }

    clearValue=()=>{
        this.setState({
            name:'',
            id:'',
        });
    }



    render() {
        return (
            <View style={{backgroundColor: '#fff',width:width,height:Pixel.getPixel(88),
                marginTop:Pixel.getTitlePixel(79),paddingLeft: Pixel.getPixel(15),paddingRight:Pixel.getPixel(15)}}>
                <View style={{flex:1,flexDirection:'row'}}>
                    <View style={{flex:1,justifyContent:'center'}}>
                        <Text allowFontScaling={false}  style={{color: '#000',fontSize: Pixel.getFontPixel(14)}}>
                            转账账号
                        </Text>
                    </View>
                    <View style={{flex:2,flexDirection:'row',alignItems: 'center'}}>
                        <TextInput style={{fontSize: Pixel.getFontPixel(14),color:
                         '#000',textAlign: 'right',flex:1,paddingTop:Pixel.getPixel(5),
                         paddingBottom: Pixel.getPixel(5)}}
                                   returnKeyType={"search"}
                                   maxLength={26}
                                   keyboardType={'number-pad'}
                                   placeholder={'请输入转账账号'}
                                   underlineColorAndroid={"#00000000"}
                                   value={this.state.value}
                                   onChangeText={this.goSearch}/>
                    </View>
                </View>
                <View style={{width:width-Pixel.getPixel(30),height:onePT,backgroundColor:fontAndColor.COLORA3}}></View>
                <View style={{flex:1,flexDirection:'row'}}>
                    <View style={{flex:1,justifyContent:'center'}}>
                        <Text allowFontScaling={false}  style={{color: '#000',fontSize: Pixel.getFontPixel(14)}}>
                            账号所有人
                        </Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'flex-end'}}>
                        <Text allowFontScaling={false}  style={{color: '#000',fontSize: Pixel.getFontPixel(14)}}>
                            {this.state.name}
                        </Text>
                    </View>
                </View>
            </View>

        );
    }

    goSearch = (text) => {
            this.setState({
                value: text
            });
    }

    componentDidUpdate() {
        if(this.state.value.length>=26){
            if(oldText==this.state.value){

            }else{
                this.props.callBack();
            }
            oldText = this.state.value;
        }
    }

}
const styles = StyleSheet.create({

    image: {
        width: 43,
        height: 43,
    },
    Separator: {
        backgroundColor: fontAndColor.COLORA3,
        height: Pixel.getPixel(10),

    },
    margin: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)

    },
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'}
})