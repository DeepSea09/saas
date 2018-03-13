/**
 * Created by Administrator on 2017/2/16.
 */
import React,{ Component } from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

const { width } = Dimensions.get('window');
import ShowToast from '../../component/toast/ShowToast';
import * as fontAndColor from '../../constant/fontAndColor';
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
const unselect = require('../../../images/publish/date-select.png');
const select = require('../../../images/publish/car-select.png');

export default class EditIndicator extends Component{

    constructor(props){
        super(props);
        this.viewData=[
            {title:'款型',page:0},
            {title:'照片',page:1},
            {title:'类型',page:2},
            {title:'时间',page:3},
            {title:'号牌',page:4},
            {title:'里程',page:5},
            {title:'排放',page:6},
            {title:'标签',page:7},
            {title:'运营',page:8},
            {title:'颜色',page:9},
            {title:'次数',page:10},
            {title:'其他',page:11}
        ];
    }


    _onPress = (page) =>{
        if(!this.props.canChange){
            this.props.goToPage(page);
        }else{
            alert('请先填写车架号');
        }
    };

    _renderIndicator = () => {
        return this.viewData.map((data)=>{
            const isTabActive = this.props.activeTab === data.page;
            return(
                <TouchableOpacity
                    key={'id'+ data.page}
                    style = {isTabActive ? styles.selectContainer : styles.defaultContainer}
                    activeOpacity={0.6}
                    onPress={()=>{this._onPress(data.page)}}>
                    <View style={styles.centerItem}>
                        <Text allowFontScaling={false}  style={isTabActive ? styles.selectText : styles.defaultText}>{data.title}</Text>
                        <Image style={styles.imgContainer} source={isTabActive ? select : unselect}/>
                    </View>
                </TouchableOpacity>
            );
        });
    };

    render(){
        let indicators = this._renderIndicator();
        return(
            <View style={styles.container}>
                <View style={styles.upSpace}>
                    {indicators.slice(0,6)}
                </View>
                <View style={styles.bottomSpace}>
                    {indicators.slice(6)}
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container:{
        width:width,
        height:Pixel.getPixel(94),
        backgroundColor:'rgba(47,155,250,0.6)',
    },
    upSpace:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'flex-end',
        marginBottom:Pixel.getPixel(5)
    },
    bottomSpace:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'flex-start',
        marginTop:Pixel.getPixel(5)
    },
    defaultContainer:{
        width:Pixel.getPixel(50),
        height:Pixel.getPixel(27),
        borderWidth:0.5,
        borderColor:'#FFFFFF',
        borderRadius:Pixel.getPixel(2),
        backgroundColor:'transparent',
        justifyContent:'center'
    },
    defaultText:{
        fontSize:Pixel.getFontPixel(14),
        color:'#FFFFFF'
    },
    imgContainer:{
        width:Pixel.getPixel(7),
        height:Pixel.getPixel(12),
        marginLeft:Pixel.getPixel(2)
    },
    selectContainer:{
        width:Pixel.getPixel(50),
        height:Pixel.getPixel(27),
        borderRadius:Pixel.getPixel(2),
        backgroundColor:'#FFFFFF',
        justifyContent:'center'
    },
    centerItem:{
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row'
    },
    selectText:{
        fontSize:Pixel.getFontPixel(14),
        color:fontAndColor.COLORB0
    },
});