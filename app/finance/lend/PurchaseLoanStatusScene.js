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
    ListView,
    InteractionManager
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../constant/fontAndColor';
import BaseComponent from '../../component/BaseComponent';
import PurchasePickerChildItem from '../component/PurchaseLoanStatusItem';
import *as apis from '../../constant/appUrls'
import AllNavigationView from '../../component/AllNavigationView';
import {request} from '../../utils/RequestUtil'
import {
    STATECODE,

} from './component/MethodComponent'
export  default class PurchaseLoanStatusScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows([]),
            renderPlaceholderOnly: STATECODE.loading
        };
    }


    initFinish = () => {
        this.getOrderStateList()
    }

    getOrderStateList=()=>{

        let maps = {
            api: apis.GET_PAYMENT_SCHEDULE_ALL,
            loan_code: this.props.loanNumber
        };
        // if(this.props.loanType ){
        //     Object.assign(maps,{type: this.props.loanType})
        // }
        request(apis.FINANCE, 'Post', maps)
            .then((response) => {
                    let tempjson = response.mjson.data;
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(tempjson),
                        renderPlaceholderOnly: STATECODE.loadSuccess
                    })
                },
                (error) => {

                    this.setState({
                        renderPlaceholderOnly: STATECODE.loadError
                    })
                    if (error.mycode != -300 || error.mycode != -500) {
                        this.props.showToast(error.mjson.msg);

                    } else {

                        this.props.showToast('服务器连接有问题')
                    }
                });



    }




    render() {
        if(this.state.renderPlaceholderOnly!==STATECODE.loadSuccess){
            return( <View style={styles.container}>
                {this.loadView()}
                <AllNavigationView title='订单状态' backIconClick={()=>{
                   this.backPage();
               }}/>

            </View>
            );
        }
        return (
            <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1}}>
                <AllNavigationView
                    title="状态跟踪"
                    backIconClick={this.backPage}
                />
                <View style={{
                    marginTop: Pixel.getTitlePixel(64),
                    backgroundColor: '#ffffff',
                    width: width,
                    height: Pixel.getPixel(44),
                    flexDirection: 'row',
                    paddingLeft: Pixel.getPixel(15),
                    paddingRight: Pixel.getPixel(15)
                }}>
                    <View style={{
                        flex: 1,
                        height: Pixel.getPixel(44),
                        alignItems: 'flex-start',
                        justifyContent: 'center'
                    }}>
                        <Text allowFontScaling={false}  style={{
                            fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                            color: fontAndColor.COLORA1
                        }}>借款单号</Text>
                    </View>
                    <View style={{
                        flex: 1,
                        height: Pixel.getPixel(44),
                        alignItems: 'flex-end',
                        justifyContent: 'center'
                    }}>
                        <Text allowFontScaling={false}  style={{
                            fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                            color: fontAndColor.COLORA0

                        }}>{this.props.loanNumber}</Text>
                    </View>
                </View>
                <ListView
                    removeClippedSubviews={false}
                    style={{marginTop: Pixel.getPixel(15)}}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    renderSeparator={this._renderSeparator}
                />
            </View>
        );
    }

    _renderRow = (movie, sectionId, rowId) => {
        return (
            <PurchasePickerChildItem lastIndex={this.state.dataSource._dataBlob.length-1} index={rowId} items={movie}/>
        )
    }

    _renderSeparator(sectionId, rowId) {

        return (
            <View style={styles.Separator} key={sectionId + rowId}>
            </View>
        )
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height}}>
                <NavigationView
                    title="状态跟踪"
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
    Separator: {
        height: 0,
        backgroundColor: '#00000000'

    },
    margin: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)

    },
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'},

    container: {
        flex: 1,
        backgroundColor: 'white'
    }
})