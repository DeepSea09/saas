/**
 * Created by lhc on 2017/2/15.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    InteractionManager,
    Modal,
    WebView
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
let RJson = {};
import BaseComponent from '../../component/BaseComponent';
import NavigationView from '../../component/AllNavigationView';
import * as fontAndColor from '../../constant/fontAndColor';
let imageItems = [];
import ViewPager from 'react-native-viewpager';
import SelectLoanNumber from '../../finance/lend/component/SelectLoanNumber';
let numberPage = 0;
let namePage = 0;
import {request} from '../../utils/RequestUtil';
import * as Urls from '../../constant/appUrls';

export  default class ContractSignScene extends BaseComponent {

    constructor(props, context) {
        super(props, context);
        this.state = {renderPlaceholderOnly: 'blank', dataSource: [], freshButton: true, webUrl: ''};
        this.sign_part = '';
    }


    initFinish = () => {
        this.getData();
    }

    getData = () => {
        let maps = {
            api: Urls.CONTRACT_CONTRACTDETAIL,
            contract_id: this.props.contract_id,    //合同ID
            product_type_code: this.props.product_type_code,	//产品类型编码

        };
        request(Urls.FINANCE, 'Post', maps)
            .then((response) => {
                    // if (response.mjson.data.contract_file_path == '') {
                        imageItems = [];
                        RJson = response.mjson;
                        imageItems.push(...response.mjson.data.contract_image_path);
                        this.sign_part = RJson.data.sign_part;
                        let ds = new ViewPager.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        this.setState({
                            dataSource: ds.cloneWithPages(imageItems),
                            renderPlaceholderOnly: 'success',
                        });
                    // } else {
                    //     this.setState({
                    //         webUrl:response.mjson.data.contract_file_path,
                    //         renderPlaceholderOnly: 'success',
                    //     });
                    // }
                },
                (error) => {
                    if (error.mjson.code == '5020002') {
                        this.setState({renderPlaceholderOnly: 'null'});
                    } else {

                        this.setState({renderPlaceholderOnly: 'error'});
                    }
                });
    }

    contractSign = () => {
        this.props.showModal(true);
        let maps = {
            api: Urls.CONTRACT_SIGN_MINE,
            contract_id: this.props.contract_id,    //合同ID
            opt_user_id: this.props.opt_user_id,
            signator_id: this.props.user_id
        };
        request(Urls.FINANCE, 'Post', maps)
            .then((response) => {
                    this.props.showToast('签署成功');
                    this.setState({freshButton: false});
                    if (this.props.callBack) {
                        this.props.callBack();
                    }
                    this.backPage();
                },
                (error) => {
                    this.props.showToast('签署失败');
                });
    }


    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        }
            return (
                <View style={{flex:1,backgroundColor: fontAndColor.COLORA3}}>
                    <View style={{marginTop:Pixel.getTitlePixel(64),flex:1}}>
                        <ViewPager
                            dataSource={this.state.dataSource}    //数据源（必须）
                            renderPage={this._renderPage}         //page页面渲染方法（必须）
                            isLoop={false}                        //是否可以循环
                            autoPlay={false}                      //是否自动
                            initialPage={0}       //指定初始页面的index
                            locked={false}                        //为true时禁止滑动翻页
                            renderPageIndicator={this._renderPageIndicator}
                        />
                    </View>
                    <View style={{width:width,height:Pixel.getPixel(44),flexDirection: 'row'}}>
                        {this.props.showButton == true && this.state.freshButton ? <TouchableOpacity onPress={()=>{
                       this.contractSign();
                    }} activeOpacity={0.8} style={{flex:1,backgroundColor:fontAndColor.COLORB0,justifyContent:'center'
                    ,alignItems:'center'}}>
                                <Text allowFontScaling={false}  style={{fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                        color:'#fff'}}>签署合同</Text>
                            </TouchableOpacity> : <View/>}
                    </View>
                    <NavigationView
                        title="合同"
                        backIconClick={this.backPage}
                    />
                </View>
            );
    }

    _renderPage = (data) => {
        let nowdate = Date.parse(new Date());
        return (
            <Image onLoadEnd={()=>{
                this.props.showModal(false);
            }} onLoadStart={()=>{
                this.props.showModal(true);
            }} style={{flex:1}}
                   source={{uri: data+'?'+nowdate}}
            />
        );

    }

    _renderPageIndicator = () => {

        return (
            <View
            />
        );

    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor: fontAndColor.COLORA3}}>
                {this.loadView()}
                <NavigationView
                    title="合同"
                    backIconClick={this.backPage}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({

    image: {

        width: 43,
        height: 43,
    },
    tabView: {
        flex: 1,
        padding: 10,
        backgroundColor: 'red',
    }
})