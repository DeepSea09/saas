/**
 * Created by zhengnan on 2018/3/5.
 */

import React,{Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    NativeModules,
    Platform,
    Linking
} from 'react-native'

const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import NavigationView from '../../component/AllNavigationView';
import * as fontAndColor from '../../constant/fontAndColor';
import BaseComponent from '../../component/BaseComponent';
import * as Net from '../../utils/RequestUtil';
import * as AppUrls from '../../constant/appUrls';

export  default class CarriagePriceInfoScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            isShowCallUpView:false,
        }

    }

    componentWillMount() {
        this.loadData();

    }
    render() {
        const {
            carCount,
            carPrice,
            endAddr,
            startAddr,
            model_name
        } = this.props;

        return(
            <View style={styles.root}>
                <ScrollView onScroll={this.onScroll}>
                    <Image style={styles.headImage} source={require('../../../images/carriagePriceImage/headImage.png')}>
                        <Text style={styles.headTitle} allowFontScaling={false}>{model_name}</Text>
                        <View style={styles.headContentView}>
                            <View style={styles.headSubView}>
                                <Text style={styles.headSubTitleText} allowFontScaling={false}>单价:</Text>
                                <Text style={styles.headSubNumberText} allowFontScaling={false}>{`${carPrice}万`}</Text>
                            </View>
                            <Image style={{width:Pixel.getPixel(1)}} source={require('../../../images/carriagePriceImage/line.png')}/>
                            <View style={styles.headSubView}>
                                <Text style={styles.headSubTitleText} allowFontScaling={false}>台数:</Text>
                                <Text style={styles.headSubNumberText} allowFontScaling={false}>{carCount}台</Text>
                            </View>
                        </View>
                    </Image>
                    <CarriagePriceInfoItemView type={1} select={1} text1={'始发地'} text2={startAddr} value1="一车上门取车" value2="自己送车到店"/>
                    <CarriagePriceInfoItemView type={2} select={1} text1={'到达地'} text2={endAddr} value1="自己到网店提车" value2="一车送车到户"/>
                    {
                        this.state.priceData &&  <CarriagePriceInfoListView data={this.state.priceData}/>
                    }
                </ScrollView>
                <View style={{height:Pixel.getPixel(50.5),backgroundColor:'white',paddingHorizontal:Pixel.getPixel(15),
                    alignItems:'center',
                    flexDirection:'row',
                    justifyContent:'space-between',
                    bottom:0,
                    position:'absolute',
                    width:width,
                    borderTopWidth:Pixel.getPixel(1),
                    borderTopColor:fontAndColor.COLORA4,
                }}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={{color:fontAndColor.COLORA1, fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}}>总价：</Text>
                        <Text style={{color:fontAndColor.COLORB2, fontSize:Pixel.getFontPixel(fontAndColor.BUTTONFONT30)}}>{this.state.priceData && this.state.priceData.totalPrice}元</Text>
                    </View>
                    <TouchableOpacity activeOpacity={1} onPress={()=>{ this.state.priceData && this.setState({isShowCallUpView:true})}}>
                        <View style={{width:Pixel.getPixel(100.5),height:Pixel.getPixel(32.5),backgroundColor: this.state.priceData ? fontAndColor.COLORB0 :fontAndColor.COLORA3,
                            alignItems:'center',justifyContent:'center',borderRadius:Pixel.getPixel(2)
                        }}>
                            <Text style={{color:'white', fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}}>立即支付</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {
                    this.state.isShowCallUpView && <CallUpView cancelClick={this.cancelClick} callUpClick={this.callUpClick}/>
                }
                <NavigationView ref={(ref)=>this.navigationView=ref} title='运价查询' backIconClick={this.backPage} wrapStyle={{backgroundColor:'transparent'}}/>
            </View>
        )
    }

    onScroll =(event)=> {

        if (event.nativeEvent.contentOffset.y > 0) {

            this.navigationView.setNavigationBackgroindColor(fontAndColor.COLORB0);

        } else {
            this.navigationView.setNavigationBackgroindColor('transparent');
        }
    }

    cancelClick=()=>{
        this.setState({
            isShowCallUpView:false
        })
    }

    callUpClick=(PhoneNumber)=>{
        if (Platform.OS === 'android') {
            NativeModules.VinScan.callPhone(PhoneNumber);
        } else {
            Linking.openURL('tel:' + PhoneNumber);
        }

        this.cancelClick();
    }

    loadData=()=>{

        const paramsData= {
            carCount:this.props.carCount,
            carPrice:this.props.carPrice,
            carType:this.props.carType,
            endAddr:this.props.endAddr,
            endAddrRegionId:this.props.endAddrRegionId,
            model_id:this.props.model_id,
            startAddr:this.props.startAddr,
            startAddrRegionId:this.props.startAddrRegionId,
            transportType:this.props.transportType,
            company_id:global.companyBaseID};

        this.props.showModal(true);
        Net.request(AppUrls.ORDER_LOGISTICS_QUERY,'post',paramsData).then((response) => {
            this.props.showModal(false);
            let data = response.mjson.data;
            // let priceData=[{title:'运价',value:data.freight},{title:'保险费',value:data.insurance},{title:'服务费',value:data.serviceFee},{title:'提验车费',value:data.checkCarFee},{title:'送店费',value:data.toStoreFee},{title:'税费',value:data.taxation},{title:'总价',value:data.totalPrice}];
            this.setState({priceData:data});

        }, (error) => {

            this.props.showModal(false);
            this.props.showToast(error.mjson.msg);

        });
    }


}


class CarriagePriceInfoItemView extends Component{
    render(){
        const {type,select,text1,text2,value1,value2} = this.props;
        return(
            <View style={styles.carriagePriceInfoItemView}>
                <View style={styles.carriagePriceInfoLeftItem}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Image source={type==1?require('../../../images/carriagePriceImage/startLocation.png') : require('../../../images/carriagePriceImage/stopLocation.png')} style={{marginRight:Pixel.getPixel(5.5)}}/>
                        <Text style={{fontSize:Pixel.getFontPixel(fontAndColor.BUTTONFONT30),color:fontAndColor.COLORA0}}>{text1}</Text>
                    </View>
                    <View style={{flexDirection:'row', alignItems:'center',marginTop:Pixel.getPixel(12.5)}}>
                        <Text style={{fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),color:fontAndColor.COLORA0}}>{text2}</Text>
                    </View>
                </View>
                <View style={styles.carriagePriceInfoRightItem}>
                    <View style={{flexDirection:'row', alignItems:'center',marginBottom:Pixel.getPixel(20.5)}}>
                        <Image style={{marginRight:Pixel.getPixel(17)}} source={select==1? require('../../../images/carriagePriceImage/select@2x.png'):require('../../../images/carriagePriceImage/noSelect.png')}/>
                        <Text style={{fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),color:select==1? fontAndColor.COLORA0:fontAndColor.COLORA1}}>{value1}</Text>
                    </View>
                    <View style={{flexDirection:'row', alignItems:'center',marginTop:Pixel.getPixel(5)}}>
                        <Image style={{marginRight:Pixel.getPixel(17)}} source={select==2? require('../../../images/carriagePriceImage/select@2x.png'):require('../../../images/carriagePriceImage/noSelect.png')}/>
                        <Text style={{fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),color:select==2? fontAndColor.COLORA0:fontAndColor.COLORA1}}>{value2}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

class CarriagePriceInfoListView extends Component{
    render(){
        let priceData= this.props.data;
        return(
            <View style={styles.carriagePriceInfoListView}>
                <View style={{flex:1,borderBottomColor:fontAndColor.COLORA3,borderBottomWidth:Pixel.getPixel(1),paddingBottom:Pixel.getPixel(12),marginBottom:Pixel.getPixel(17.5), flexDirection:'row',alignItems:'center'}}>
                    <Text style={{color:fontAndColor.COLORA0, fontSize:Pixel.getFontPixel(fontAndColor.BUTTONFONT30)}}>运费单总价：</Text>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={{color:fontAndColor.COLORA0, fontSize:Pixel.getPixel(fontAndColor.BUTTONFONT30)}}>{priceData.totalPrice}</Text>
                        <Text style={{color:fontAndColor.COLORA0, fontSize:Pixel.getPixel(fontAndColor.CONTENTFONT24)}}>元</Text>
                        {
                            <Text style={{color:fontAndColor.COLORA1, fontSize:Pixel.getPixel(fontAndColor.CONTENTFONT24)}}>{priceData.taxation>0?`(含税${priceData.taxation}元)`:'(不含税)'}</Text>
                        }
                    </View>
                </View>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:width-Pixel.getPixel(30)}}>
                    <View>
                        <PriceItemView title="运费" value={priceData.freight}/>
                        <PriceItemView title="提验车费" value={priceData.checkCarFee}/>

                    </View>
                    <View>
                        <PriceItemView title="保险费" value={priceData.insurance}/>
                        <PriceItemView title="送店费" value={priceData.toStoreFee}/>

                    </View>
                    <View>
                        <PriceItemView title="服务费" value={priceData.serviceFee}/>
                        <View style={{backgroundColor:'white',marginBottom:Pixel.getPixel(23)}}>
                            <Text style={{color:fontAndColor.COLORA1, fontSize:Pixel.getPixel(fontAndColor.LITTLEFONT28)}}> </Text>
                            <View style={{marginTop:Pixel.getPixel(10), flexDirection:'row', alignItems:'center'}}>
                                <Text style={{color:fontAndColor.COLORA0, fontSize:Pixel.getPixel(fontAndColor.LITTLEFONT28)}}> </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

class PriceItemView extends Component{
    render(){
        let {title,value} = this.props;
        return(
            <View style={{backgroundColor:'white',marginBottom:Pixel.getPixel(23)}}>
                <Text style={{color:fontAndColor.COLORA1, fontSize:Pixel.getPixel(fontAndColor.LITTLEFONT28)}}>{title}</Text>
                <View style={{marginTop:Pixel.getPixel(10), flexDirection:'row', alignItems:'center'}}>
                    <Text style={{color:fontAndColor.COLORA0, fontSize:Pixel.getPixel(fontAndColor.LITTLEFONT28)}}>{value}</Text>
                    <Text style={{color:fontAndColor.COLORA0, fontSize:Pixel.getPixel(fontAndColor.CONTENTFONT24)}}>元</Text>
                </View>
            </View>
        )
    }
}

class CallUpView extends Component{
    render(){
        return(
            <TouchableOpacity activeOpacity={1} style={styles.callUpView} onPress={this.props.cancelClick}>
                <View style={styles.callUpItem}>
                    <Text style={{color:fontAndColor.COLORA1, fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24),marginTop:Pixel.getPixel(24.5)}}>在线支付即将启用...</Text>
                    <Text style={{color:fontAndColor.COLORA0, fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),marginTop:Pixel.getPixel(20)}}>下单电话:010-59230023</Text>
                    <Text style={{color:fontAndColor.COLORA0, fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24),marginTop:Pixel.getPixel(11.5)}}>第1车贷24小时为您服务</Text>
                    <TouchableOpacity onPress={()=>this.props.callUpClick('010-59230023')} activeOpacity={1}>
                        <View style={{backgroundColor:fontAndColor.COLORB0,width:Pixel.getPixel(100.5),height:Pixel.getPixel(32.5),borderRadius:Pixel.getPixel(2),justifyContent:'center',
                            alignItems:'center',marginTop:Pixel.getPixel(22.5),marginBottom:Pixel.getPixel(15)
                        }}>
                            <Text style={{color:'white', fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}}>拨打</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({

    root:{
        flex:1,
        backgroundColor:fontAndColor.COLORA3,
        paddingBottom:Pixel.getPixel(50.5)
    },
    headImage:{
        paddingTop:Pixel.getTitlePixel(64),
        width:width,
        height:Pixel.getPixel(149),
        alignItems:'center',
        justifyContent:'space-between',
        paddingBottom:Pixel.getPixel(8.5),
        marginBottom:Pixel.getPixel(6.5),
        // backgroundColor:'yellow'
    },
    headTitle:{
        color:'white',
        fontSize:Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
        marginTop:Pixel.getPixel(10),
        backgroundColor:'transparent'
    },
    headContentView:{
        flexDirection:'row',
        width:width,
        height:Pixel.getPixel(30),
        alignItems:'center',
        justifyContent:'space-between',
        // backgroundColor:'yellow'
    },
    headSubView:{
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
        height:Pixel.getPixel(40),
        width:width/2-Pixel.getPixel(1),
    },
    headSubTitleText:{
        color:'white',
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        backgroundColor:'transparent'

    },
    headSubNumberText:{
        color:'white',
        fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        fontWeight:'bold',
        backgroundColor:'transparent'

    },
    carriagePriceInfoItemView:{
        width:width,
        height:Pixel.getPixel(99),
        backgroundColor:'white',
        padding:Pixel.getPixel(15),
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'space-between',
        marginBottom:Pixel.getPixel(8),
    },
    carriagePriceInfoLeftItem:{
        justifyContent:'center',
        width:width *0.55
    },
    carriagePriceInfoRightItem:{
        justifyContent:'center',
        width:width *0.45
    },
    carriagePriceInfoListView:{
        backgroundColor:'white',
        paddingHorizontal:Pixel.getPixel(15),
        paddingTop:Pixel.getPixel(15.5),
    },
    callUpView:{
        top:0,
        right:0,
        bottom:0,
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        backgroundColor:'rgba(0,0,0,0.3)',
        left:0,
        borderRadius:Pixel.getPixel(2)
    },
    callUpItem:{
        width:Pixel.getPixel(260.5),
        backgroundColor:'white',
        alignItems:'center',
        borderRadius:Pixel.getPixel(4),
    }

})