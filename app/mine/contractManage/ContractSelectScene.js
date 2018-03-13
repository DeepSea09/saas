import  React, {Component, PropTypes} from  'react'
import  {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    ListView,
    RefreshControl,
    Image
} from  'react-native'

import * as fontAndColor from '../../constant/fontAndColor';
import  PixelUtil from '../../utils/PixelUtil'
var Pixel = new PixelUtil();
const cellJianTou = require('../../../images/mainImage/celljiantou.png');
import BaseComponent from "../../component/BaseComponent";
import NavigatorView from '../../component/AllNavigationView';
import ContractManageScene from './ContractManageScene';
/*
 * 获取屏幕的宽和高
 **/
const {width, height} = Dimensions.get('window');
export default class AdjustManageScene extends BaseComponent {
    initFinish = () => {
        let select = ["售后回租合同"];
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
            dataSource:ds.cloneWithRows(select),
            renderPlaceholderOnly:'success'
        });
    }
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            dataSource: {},
            renderPlaceholderOnly: 'blank',
            isRefreshing: false
        };

    }


    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return ( <View style={styles.container}>

                {this.loadView()}
                <NavigatorView title='合同管理' backIconClick={this.backPage}/>
            </View>);
        }else {
            return (<View style={styles.container}>
                <NavigatorView title='合同管理' backIconClick={this.backPage}/>
                <ListView style={{backgroundColor:fontAndColor.COLORA3,marginTop:Pixel.getTitlePixel(74)}}
                          dataSource={this.state.dataSource}
                          renderRow={this._renderRow}
                          removeClippedSubviews={false}
                          enableEmptySections = {true}
                />

            </View>);
        }
    }

    // 每一行中的数据
    _renderRow = (rowData, selectionID, rowID) => {
        return (
            <TouchableOpacity
                onPress={()=>{
                  if(rowID==0){
                      this.toNextPage({name:'ContractManageScene',component:ContractManageScene,params:{from:'xs'}});
                  }else{
                      this.toNextPage({name:'ContractManageScene',component:ContractManageScene,params:{from:'xx'}});
                  }
                }}
                activeOpacity={0.9}
            >
                <View style={styles.rowView} >
                    <Text allowFontScaling={false}  style={styles.rowLeftTitle}>{rowData}</Text>
                    <Text allowFontScaling={false}  style={styles.rowRightTitle} ></Text>
                    <Image source={cellJianTou} style={styles.image}></Image>

                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {

        flex: 1,
        marginTop: Pixel.getPixel(0),   //设置listView 顶在最上面
        backgroundColor: fontAndColor.COLORA3,
    },
    listStyle: {
        marginTop: Pixel.getPixel(15)
    },
    sectionView: {
        height: Pixel.getPixel(10),
        backgroundColor: fontAndColor.COLORA3,
    },
    rowView: {
        height: 44,
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomColor: fontAndColor.COLORA4,
        borderBottomWidth: 1,
        flexDirection: 'row'
    },
    rowLeftTitle: {
        marginLeft: Pixel.getPixel(15),
        flex: 1,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        color: fontAndColor.COLORA0,

    },
    rowRightTitle: {
        marginRight: Pixel.getPixel(10),
        color: fontAndColor.COLORA2,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),

    },
    image:{
        marginRight:Pixel.getPixel(15),
    }


});