/**
 * Created by Administrator on 2017/2/10.
 */
import React,{ Component } from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    InteractionManager
}from 'react-native';

import DateTimePicker from 'react-native-modal-datetime-picker';
import * as fontAndColor from '../../constant/fontAndColor';
import AllNavigationView from '../../component/AllNavigationView';
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();

const { width,height } = Dimensions.get('window');
const background = require('../../../images/publish/background.png');
const arrow = require('../../../images/publish/date-select.png');
import SQLiteUtil from '../../utils/SQLiteUtil';
const SQLite = new SQLiteUtil();

export default class AutoDate extends Component{

    constructor(props){
        super(props);
        this.type = '';
        let manufacture = this.props.carData.manufacture;
        let init_reg = this.props.carData.init_reg;
        let hasRegister = this.props.carData.v_type === '1' || this.props.carData.v_type === '';

        if(this.isEmpty(this.props.carData.model)  === false){

            let model = JSON.parse(this.props.carData.model);
            let model_year = model.model_year;
            if(this.isEmpty(model_year) === true){
                model_year='2000';
            }
            if(manufacture === '') manufacture = model_year +'-06-01';
            if(init_reg === '') init_reg = model_year +'-06-01';
            if(hasRegister === false) init_reg = '';
            SQLite.changeData(
                'UPDATE publishCar SET manufacture = ?,init_reg = ? WHERE vin = ?',
                [ manufacture,init_reg, this.props.carData.vin]);
        }
        this.state ={
            factoryDate:manufacture,
            registerDate:init_reg,
            isDateTimePickerVisible: false,
            renderPlaceholderOnly: true,
            hasRegister:hasRegister,
        }
    }

    isEmpty = (str)=>{
        if(typeof(str) != 'undefined' && str !== ''){
            return false;
        }else {
            return true;
        }
    };

    componentWillMount(){

    }

    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: false});
        });
    }

    componentWillReceiveProps(nextProps: Object) {
        this.setState({
            hasRegister: nextProps.carData.v_type === '1'|| nextProps.carData.v_type === ''
        },()=>{
            if(this.state.hasRegister === false) {
                SQLite.changeData(
                    'UPDATE publishCar SET init_reg = ? WHERE vin = ?',
                    ['', this.props.carData.vin]);
            }
        });
    }

    _renderPlaceholderView = ()=>{
        return(<Image style={[styles.img,{height:height-this.props.barHeight}]} source={background} />);
    };

    componentWillUnmount(){

    }

    _handleDatePicked = (date)=>{
        let d = this.dateFormat(date,'yyyy-MM-dd');
        if(this.type === 'factory'){
            this.setState({factoryDate:d});
            SQLite.changeData(
                'UPDATE publishCar SET manufacture = ? WHERE vin = ?',
                [ d, this.props.carData.vin]);
        }else{
            this.setState({registerDate:d});
            SQLite.changeData(
                'UPDATE publishCar SET init_reg = ? WHERE vin = ?',
                [ d, this.props.carData.vin]);
        }

        this._hideDateTimePicker();
    };

    _hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    _labelPress=(type)=>{
        this.type = type;
        this.setState({ isDateTimePickerVisible: true });
    };

    _onBack = ()=>{
        this.props.onBack();
    };

    _renderRihtFootView = ()=>{
        return(
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={()=>{}}>
                <Text allowFontScaling={false}  style={styles.rightTitleText}>完成</Text>
            </TouchableOpacity>
        );
    };

    render(){
        if (this.state.renderPlaceholderOnly) {
            return this._renderPlaceholderView();
        }

        return(
            <View style={styles.container}>
                <Image source={background} style={[styles.img,{height:height-this.props.barHeight}]}>
                    <AllNavigationView
                        backIconClick={this._onBack}
                        title='选择日期'
                        wrapStyle={styles.wrapStyle}
                    />
                    <TouchableOpacity
                        style={[styles.circleContainer,styles.factoryCircle]}
                        activeOpacity={0.6}
                        onPress={()=>{this._labelPress('factory')}}
                    >
                        <View style={styles.center}>
                            <Text allowFontScaling={false}  style={[styles.fontMain,styles.leftText]}>出厂日期</Text>
                            <Text allowFontScaling={false}  style={[styles.fontMain,styles.fillSpace]} >{this.state.factoryDate}</Text>
                            <Image style={styles.imgContainer} source={arrow}/>
                        </View>
                    </TouchableOpacity>
                    {this.state.hasRegister && <TouchableOpacity
                        style={[styles.circleContainer,styles.registerCircle]}
                        activeOpacity={0.6}
                        onPress={()=>{this._labelPress('register')}}
                    >
                        <View style={styles.center}>
                            <Text allowFontScaling={false}  style={[styles.fontMain,styles.leftText]}>初登日期</Text>
                            <Text allowFontScaling={false}  style={[styles.fontMain,styles.fillSpace]} >{this.state.registerDate}</Text>
                            <Image style={styles.imgContainer} source={arrow}/>
                        </View>
                    </TouchableOpacity>}
                    <DateTimePicker
                        titleIOS="请选择日期"
                        confirmTextIOS='确定'
                        cancelTextIOS='取消'
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this._handleDatePicked}
                        onCancel={this._hideDateTimePicker}
                    />
                </Image>
            </View>
        );
    };

    dateFormat = (date,fmt) => {
        let o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
}

const styles = StyleSheet.create({
    container:{
        width:width,
        backgroundColor:'transparent'
    },
    img:{
        width:width,
        backgroundColor:'transparent',
        alignItems:'center'
    },
    factoryCircle:{
        marginTop:Pixel.getPixel(209)
    },
    registerCircle:{
        marginTop:Pixel.getPixel(70)
    },
    circleContainer:{
        height:Pixel.getPixel(44),
        flexDirection:'row',
        marginHorizontal:Pixel.getPixel(35),
        borderColor:'#FFFFFF',
        borderWidth:1,
        borderRadius:Pixel.getPixel(22),
        alignItems:'center',
        backgroundColor:'rgba(255,255,255,0.2)',
    },
    leftText:{
        marginLeft:Pixel.getPixel(20),
    },
    fontMain:{
        color:'#FFFFFF',
        fontSize:Pixel.getFontPixel(14)
    },
    imgContainer:{
        width:Pixel.getPixel(9),
        height:Pixel.getPixel(15),
        marginRight:Pixel.getPixel(20)
    },
    fillSpace:{
        flex:1,
        textAlign:'right',
        marginRight:Pixel.getPixel(6)
    },
    center:{
        flexDirection:'row',
        alignItems:'center'
    },
    wrapStyle:{
        backgroundColor:'transparent'
    },
    rightTitleText: {
        color: 'white',
        fontSize: Pixel.getFontPixel(fontAndColor.NAVIGATORFONT34),
        textAlign: 'right',
        backgroundColor: 'transparent'
    }
});