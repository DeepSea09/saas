import  React, {Component, PropTypes} from  'react'
import  {

    View,
    Text,
    ListView,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity
} from  'react-native'

import * as fontAndClolr from '../../constant/fontAndColor';
import  PixelUtil from '../../utils/PixelUtil'
var Pixel = new PixelUtil();
import NavigationBar from "../../component/NavigationBar";
import BaseComponent from "../../component/BaseComponent";
import ShareSpanner from '../../mine/contractManage/ContractSpanner'
/*
 * 获取屏幕的宽和高
 **/
const {width, height} = Dimensions.get('window');

export default class ContractSign extends BaseComponent {
    initFinish = () => {
    }
    // 构造
    constructor(props) {
        super(props);

    }

    render() {
        const isShow=this.props.show;
        return (
            <View style={styles.container}>
                <NavigationBar
                    centerText={'合同签署'}
                    rightText={''}
                    leftImageCallBack={this.backPage}
                />

                <View style={styles.contentStyle}>

                </View>
                <View style={styles.bottomStyle}>
                    <TouchableOpacity onPress={()=>{}} style={styles.leftStyle}>
                        <View style={{flexDirection: 'row',justifyContent: 'center', alignItems: 'center',}}>
                            <Image source={require('../../../images/service_contract@2x.png')}
                                   style={{marginRight: 5}}></Image>
                            <Text allowFontScaling={false}  style={styles.buttonText}>融资服务合同</Text>
                        </View>
                    </TouchableOpacity>
                    { isShow ? (<TouchableOpacity onPress={()=>{this.shareSpanner.setModalVisible()}} style={styles.rightStyle}>
                            <Text allowFontScaling={false}  style={styles.buttonText}>签署合同</Text>
                    </TouchableOpacity>) : null
                    }

                </View>

                <ShareSpanner style={styles.spannerStyle} ref={(shareSpanner)=>{this.shareSpanner = shareSpanner}}></ShareSpanner>

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Pixel.getPixel(0),   //设置listView 顶在最上面
        flexDirection: 'column'
    },
    bottomStyle: {
        height: 44,
        flexDirection: 'row'

    },
    contentStyle: {
        flex: 1,
        backgroundColor: 'white',
    },
    leftStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: fontAndClolr.COLORA2,
        flexDirection: 'row'
    },
    rightStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: fontAndClolr.COLORB0
    },
    leftContent: {
        flexDirection: 'row'
    },
    buttonText: {
        fontSize: 12,
        color: 'white'
    },
    spannerStyle:{
        position: 'absolute',
        bottom: 44,
    }
});