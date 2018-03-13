import React, {Component} from 'react';
import {
    AppRegistry,
    View,
    StatusBar,
    Modal,
    Image,
    Text,
    TouchableOpacity,
    ListView
} from 'react-native';
import  PixelUtil from '../utils/PixelUtil'
let Pixel = new PixelUtil();
let Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');
import  * as fontAndColor from '../constant/fontAndColor';
export default class AdjustModal extends Component {

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isShow: false,
            source: []
        };
    }

    changeShowType = (value, source) => {
            let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            this.setState({
                isShow: value,
                source: ds.cloneWithRows(source)
            });
    }


    render() {
        return (
            <Modal
                ref='loadingModal'
                animationType={"none"}
                transparent={true}
                visible={this.state.isShow}
                onRequestClose={() => {}}
            >
                <TouchableOpacity
                    onPress={()=>{
                       this.setState({
                            isShow: false
                        });
                    }}
                    activeOpacity={1}
                    style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.3)'}}>
                    <View style={{width:width-width/4,backgroundColor:'#fff',justifyContent:'center',alignItems: 'center'}}>
                        <Text allowFontScaling={false}  style={{fontSize:Pixel.getPixel(17),fontWeight: 'bold',color:'#000',marginTop: Pixel.getPixel(11)}}>调整</Text>
                        <View style={{width:width-width/4,height:Pixel.getPixel(32),backgroundColor:fontAndColor.COLORA3
                        ,flexDirection:'row',paddingRight:Pixel.getPixel(15),paddingLeft:Pixel.getPixel(15),marginTop: Pixel.getPixel(11)}}>
                           <View style={{flex:1,justifyContent:'center',alignItems:'flex-start'}}>
                               <Text allowFontScaling={false}  style={{fontSize: Pixel.getPixel(fontAndColor.MARKFONT22),color: fontAndColor.COLORA1}}>调整项</Text>
                           </View>
                            <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                                <Text allowFontScaling={false}  style={{fontSize: Pixel.getPixel(fontAndColor.MARKFONT22),color: fontAndColor.COLORA1}}>调整金额</Text>
                            </View>
                        </View>
                        {this.state.isShow?<ListView
                                removeClippedSubviews={false}
                                dataSource={this.state.source}
                                renderRow={this._renderRow}
                                renderSeparator={this._renderSeparator}
                            />:<View/>}

                        <TouchableOpacity onPress={()=>{
                             this.setState({
                            isShow: false
                        });
                        }} activeOpacity={0.9} style={{width:Pixel.getPixel(100),height:Pixel.getPixel(35),
                         marginTop:Pixel.getPixel(16),flexDirection:'row',
                         justifyContent:'center',alignItems:'center',borderRadius:3,borderWidth:1,borderColor:fontAndColor.COLORB0,
                         marginBottom:Pixel.getPixel(16)}}>
                             <Text allowFontScaling={false}  style={{fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),color: fontAndColor.COLORB0}}>知道了</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }

    _renderRow = (movie) => {
        let isadjust = '';
        if(movie.isadjust=='1'){
            isadjust = '保证金还款';
        }else if(movie.isadjust=='2'){
            isadjust = '循环贷';
        }else if(movie.isadjust=='3'){
            isadjust = '提前还款';
        }else if(movie.isadjust=='4'){
            isadjust = '优惠卷';
        }else if(movie.isadjust=='5'){
            isadjust = '续租服务费';
        }else{
            isadjust = '续租';
        }
        return (
            <View style={{width:width-width/4,height:Pixel.getPixel(44)
                        ,flexDirection:'row',paddingRight:Pixel.getPixel(15),paddingLeft:Pixel.getPixel(15),marginTop: Pixel.getPixel(11)}}>
                <View style={{flex:1,justifyContent:'center',alignItems:'flex-start'}}>
                    <Text allowFontScaling={false}  style={{fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),color: fontAndColor.COLORA1}}>
                        {isadjust}
                    </Text>
                </View>
                <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                    <Text allowFontScaling={false}  style={{fontSize: Pixel.getPixel(fontAndColor.LITTLEFONT28),color: fontAndColor.COLORA1}}>
                        {movie.adjustmoney}
                    </Text>
                </View>
            </View>
        )
    }

    _renderSeparator(sectionId, rowId) {
        return (
            <View style={{width:width-width/4,height:1,backgroundColor:fontAndColor.COLORA3}} key={sectionId + rowId}/>
        )
    }
}