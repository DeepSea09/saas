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
import * as fontAndColor from '../../constant/fontAndColor';
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
const unselect = require('../../../images/publish/date-select.png');
const select = require('../../../images/publish/car-select.png');

export default class NewIndicator extends Component{

    constructor(props){
        super(props);
        this.viewData=[
            {title:'款型',page:0},
            {title:'照片',page:1},
            {title:'类型',page:2},
            {title:'时间',page:3},
            {title:'里程',page:4},
            {title:'更多',page:5}
        ];
    }


    _onPress = (page) =>{
        if(!this.props.canChange){
            if(page !== 5){
                this.props.goToPage(page)
            }else{
                this.props.goToMore();
            }
        }else{
            this.props.showHint('请先填写车架号');
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
                {indicators}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container:{
        width:width,
        height:Pixel.getPixel(57),
        backgroundColor:'rgba(47,155,250,0.6)',
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center'
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