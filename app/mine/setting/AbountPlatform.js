import React, {Component} from "react";
import {
    NativeModules,
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    PixelRatio,
    TouchableOpacity,
    Platform,
    TouchableWithoutFeedback,
    Modal,
    CameraRoll
} from "react-native";
import BaseComponent from "../../component/BaseComponent";
import PixelUtil from "../../utils/PixelUtil";
import * as FontAndColor from "../../constant/fontAndColor";
import NavigationBar from "../../component/NavigationBar";
import* as StorageKeyNames from '../../constant/storageKeyNames';
import {SequencingView} from '../../carSource/znComponent/CarSequencingView';
import *as weChat from 'react-native-wechat';
import * as fontAndColor from '../../constant/fontAndColor';


let ScreenWidth = Dimensions.get('window').width

let sequencingDataSource = [
    {
        "title": "分享给朋友",
        "value": "1"
    },
    {
        "title": "保存到相册",
        "value": "2"
    },
    {
        "title": "取消",
        "value": "3"
    }
]


var Pixel = new PixelUtil();
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
var onePT = 1 / PixelRatio.get(); //一个像素
export default class Setting extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            renderPlaceholderOnly: true,
            sequencingType:'',
        }
    }

    initFinish = () => {
        //InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: false});
            // this.Verifycode();
        //});
    }


    render() {
        if (this.state.renderPlaceholderOnly) {
            return ( <TouchableWithoutFeedback onPress={() => {
                this.setState({
                    show: false,
                });
            }}>
                <View style={{flex: 1, backgroundColor: FontAndColor.COLORA3}}>
                    <NavigationBar
                        leftImageShow={false}
                        leftTextShow={true}
                        leftText={""}
                        centerText={"设置"}
                        rightText={""}
                    />
                </View>
            </TouchableWithoutFeedback>);
        }
        return (
            <View style={styles.container}>
                <NavigationBar
                    leftImageShow={true}
                    leftTextShow={false}
                    centerText={"关于服务平台"}
                    rightText={""}
                    leftImageCallBack={this.backPage}/>
                <Image source={require("./../../../images/setting/logo.png")} style={styles.logoStyle}/>
                <Text allowFontScaling={false}  style={{
                    marginTop: 15,
                    fontSize: FontAndColor.LITTLEFONT,
                    color: FontAndColor.COLORA0
                }}>{"当前版本" + StorageKeyNames.VERSON_NAME}</Text>
                <TouchableOpacity
                    activeOpacity={1}
                    onLongPress = {()=>{
                        this.refs.SequencingView.visibleCilck(true);
                    }}
                >
                    <Image source={require('./../../../images/setting/imagedownload.png')} style={styles.QRCodeStyle}/>
                </TouchableOpacity>
                <Text allowFontScaling={false} 
                    style={{color: FontAndColor.COLORA0, fontSize: Pixel.getPixel(17), fontWeight: 'bold'}}>长按二维码分享给好友</Text>
                <Text allowFontScaling={false}  style={{
                    fontSize: FontAndColor.LITTLEFONT,
                    color: FontAndColor.COLORA0,
                    marginTop: Pixel.getPixel(10),
                }}>您的朋友也可以下载服务平台客户端</Text>
                <View style={{flex: 1}}/>
                <Text allowFontScaling={false}  style={{
                    fontSize: FontAndColor.CONTENTFONT,
                    color: FontAndColor.COLORA1,
                    marginTop: Pixel.getPixel(10),
                    marginBottom: Pixel.getFontPixel(20),
                }}>Copyright第1车贷版权所有</Text>


                <SequencingView
                    ref="SequencingView"
                    checkedType={this.state.sequencingType}
                    checkedClick={this.sequencingCheckedClick}
                    sequencingDataSource={sequencingDataSource}/>

                <SharedView ref="sharedView"/>

            </View>
        );
    }

    callClick = (phoneNumer) => {
        if (Platform.OS === 'android') {
            NativeModules.VinScan.callPhone(phoneNumer);
        } else {
            Linking.openURL('tel:' + phoneNumer);
        }
    };

    sequencingCheckedClick = (title, value) => {
        if (value == 1){ //分享给朋友

            this.refs.sharedView.isVisible(true);

        }else if(value==2){  //保存到相册
            if (Platform.OS === 'android') {
                NativeModules.VinScan.getPicture((path) => {
                    //console.log('保存path', path)
                    CameraRoll.saveToCameraRoll(path).then((response) => {
                        this.props.showToast('保存成功')
                    }, (reject) => {
                        //console.log('保存失败', reject)
                        this.props.showToast('保存失败，请重新尝试')
                    });
                });
            } else {
                CameraRoll.saveToCameraRoll('http://dycd-static.img-cn-beijing.aliyuncs.com/Uploads/Oss/201708/26/c7c9c803e06a8e4d.jpg').then((response) => {
                    //CameraRoll.saveToCameraRoll('file:///assets/images/erweima.png').then((response)=>{
                    this.props.showToast('保存成功')
                    //console.log('保存成功')
                }, (reject) => {
                    //console.log('保存失败', reject)
                    this.props.showToast('保存失败，请重新尝试')
                });
            }
        }else {
            // 取消
        }
    };


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: FontAndColor.COLORA3,
    },
    logoStyle: {
        width: Pixel.getPixel(100),
        height: Pixel.getPixel(100),
        marginTop: Pixel.getPixel(65),
    },
    QRCodeStyle: {
        width: Pixel.getPixel(128),
        height: Pixel.getPixel(128),
        marginTop: Pixel.getPixel(90),
        marginBottom: Pixel.getPixel(20),
    }
});



class SharedView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isVisible: false,
        };
    }

    isVisible = (visible) => {

        this.setState({
            isVisible: visible,
        });
    }

    // 分享好友
    sharedWechatSession = () => {


        weChat.isWXAppInstalled()
            .then((isInstalled) => {

                if (isInstalled) {

                    weChat.shareToSession({
                        type:'imageUrl',

                        imageUrl:'http://dycd-static.img-cn-beijing.aliyuncs.com/Uploads/Oss/201708/26/c7c9c803e06a8e4d.jpg'

                    }).catch((error) => {
                    })
                } else {
                    this.isVisible(false);

                }
            },);
    }

    // 分享朋友圈
    sharedWechatTimeline = () => {
        weChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {

                    weChat.shareToTimeline({
                        type: 'imageUrl',
                        imageUrl:'http://dycd-static.img-cn-beijing.aliyuncs.com/Uploads/Oss/201708/26/c7c9c803e06a8e4d.jpg'

                    }).catch((error) => {
                    })
                } else {
                    this.isVisible(false);
                }
            });
    }


    render() {

        return (
            <Modal
                visible={this.state.isVisible}
                transparent={true}
                onRequestClose={() => {
                    this.isVisible(false)
                }}
                animationType={'fade'}>

                <TouchableOpacity style={SharedViewStyle.sharedContaier} onPress={() => {
                    this.isVisible(false)
                }}>
                    <View style={SharedViewStyle.sharedView}>
                        <View style={SharedViewStyle.sharedViewHead}>
                            <Text allowFontScaling={false}  style={SharedViewStyle.sharedViewHeadText}>分享到</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity style={SharedViewStyle.sharedItemView} onPress={() => {
                                this.sharedWechatSession(this.props.carData);
                                this.isVisible(false);
                            }}>
                                <Image source={require('../../../images/carSourceImages/shared_wx.png')}/>
                                <Text allowFontScaling={false}  style={SharedViewStyle.sharedText}>微信好友</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={SharedViewStyle.sharedItemView} onPress={() => {
                                this.sharedWechatTimeline(this.props.carData);
                                this.isVisible(false);
                            }}>
                                <Image source={require('../../../images/carSourceImages/shared_friend.png')}/>
                                <Text allowFontScaling={false}  style={SharedViewStyle.sharedText}>朋友圈</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>

        )
    }
}

const SharedViewStyle = StyleSheet.create({

    sharedContaier: {

        flex: 1,
        backgroundColor: 'rgba(1,1,1,0.5)',
    },
    sharedView: {

        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: fontAndColor.COLORA3,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',

    },
    sharedViewHead: {
        height: Pixel.getPixel(44),
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: ScreenWidth
    },
    sharedViewHeadText: {

        color: fontAndColor.COLORA0,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
    },
    sharedItemView: {

        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: Pixel.getPixel(20),
        marginRight: Pixel.getPixel(20),
        marginTop: Pixel.getPixel(10),
        marginBottom: Pixel.getPixel(10),
    },
    sharedText: {
        color: fontAndColor.COLORA1,
        textAlign: 'center',
        marginTop: Pixel.getPixel(10),
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
    },
})