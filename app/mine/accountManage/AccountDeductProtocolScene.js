/**
 * Created by zhengnan on 2017/8/14.
 */

import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    WebView,
    TouchableOpacity,
    Dimensions,
    Image,

} from 'react-native';

import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../constant/fontAndColor';
import BaseComponent from '../../component/BaseComponent';
import NavigationView from '../../component/AllNavigationView';
import ViewPager from 'react-native-viewpager';
import {request} from '../../utils/RequestUtil';
import * as Urls from '../../constant/appUrls';
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";

const {width, height} = Dimensions.get('window');


export default class AccountDeductProtocolScene extends BaseComponent {

    render(){
        return(
            <View style={styles.rootView}>
                <ViewPager style={ this.props.protocolType!=1 && {marginBottom:Pixel.getPixel(64)}}
                    dataSource={this.state.dataSource}    //数据源（必须）
                    renderPage={this._renderPage}         //page页面渲染方法（必须）
                    isLoop={false}                        //是否可以循环
                    autoPlay={false}                      //是否自动
                    initialPage={0}       //指定初始页面的index
                    locked={false}                        //为true时禁止滑动翻页
                    renderPageIndicator={()=><View/>}
                />
                {
                    this.props.protocolType!=1 && (
                    <TouchableOpacity style={styles.footBtn} activeOpacity={1} onPress={this.openProtocol}>
                        <Text style={{color:'white',fontSize:Pixel.getFontPixel(fontAndColor.BUTTONFONT30),textAlign:'center'}}>签署合同并开通电子账户还款</Text>
                    </TouchableOpacity>
                    )
                }
                <NavigationView title={this.props.contractData.contract_name} backIconClick={this.backPage}/>
            </View>
        )
    }
    // 构造
      constructor(props) {
        super(props);
          let ds = new ViewPager.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          this.state = {
            dataSource:ds.cloneWithPages(this.props.contractData.contract_image_path),
        };
      }



    _renderPage = (data) => {
        let nowdate = Date.parse(new Date());
        return (
            <Image  style={{flex:1}}  source={{uri: data+'?'+nowdate}}/>
        );

    }

    openProtocol=()=>{
        let maps = {
            api: Urls.FIRST_REPAYMENT_CONTRACT_SIGN,
            contract_id:this.props.contractData.contract_id,
            signator_id:this.props.contractData.signator_id,
        };
        this.props.showModal(true);
        request(Urls.FINANCE, 'Post', maps).then((response) => {
                this.props.showModal(false);
                this.backToTop();
            },
            (error) => {
                this.props.showModal(false);
                this.props.showToast(error.mjson.msg);

            });
    }
}

const styles = StyleSheet.create({
    rootView:{
        flex:1,
        backgroundColor:fontAndColor.COLORA3,
        paddingTop:Pixel.getTitlePixel(64),
    },
    footBtn:{
        backgroundColor:fontAndColor.COLORB0,
        left:0,
        right:0,
        bottom:0,
        height:Pixel.getPixel(44),
        alignItems:'center',
        justifyContent:'center',
        position: 'absolute',
    }
})