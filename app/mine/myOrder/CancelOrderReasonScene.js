import React, {Component} from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Dimensions,
    BackAndroid,
    NativeModules,
    KeyboardAvoidingView,
} from 'react-native'

import ImageSource from "../../publish/component/ImageSource";
import * as fontAndColor from '../../constant/fontAndColor';
import ImagePicker from "react-native-image-picker";
import BaseComponent from '../../component/BaseComponent';
import NavigationBar from "../../component/NavigationBar";
import PixelUtil from "../../utils/PixelUtil";
import StoreageUtil from '../../utils/StorageUtil';
import * as StoreageKeyNames from '../../constant/storageKeyNames';
import {request} from "../../utils/RequestUtil";
import * as Urls from '../../constant/appUrls';
import * as ImageUpload from "../../utils/ImageUpload";

let Platform = require('Platform');
const photo = require('../../../images/add_photo.png');  // 加号

let screen_width = Dimensions.get('window').width;

let Pixel = new PixelUtil();


const options = {
    //弹出框选项
    title: '请选择',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '选择相册',
    allowsEditing: false,
    noData: false,
    quality: 1.0,
    maxWidth: 480,
    maxHeight: 800,
    storageOptions: {
        skipBackup: true,
        path: 'images',
    }
}

export default class CancelOrderReasonScene extends BaseComponent {

    constructor(props) {
        super(props)

        cancelTypes = [
            {
                value: '车况不可接受',
                check: false,
                buyer_cancel_type: 1
            },
            {
                value: '临时加价',
                check: false,
                buyer_cancel_type: 2
            },
            {
                value: '车辆不可迁入落户地',
                check: false,
                buyer_cancel_type: 3
            },
            {
                value: '对方态度恶劣',
                check: false,
                buyer_cancel_type: 4
            },
            {
                value: '其他',
                check: false,
                buyer_cancel_type: 5
            },
        ]

        cancelImages = [
            {
                image: photo,
                deletable: false,
                url: ''
            }
        ]


        this.state = {
            selected_buyer_cancel_type: 0,
            buyer_cancel_img: '',
            buyer_cancel_desc: '',
            node: 1,
            pictures: cancelImages,
            buyer_cancel_types: cancelTypes,
        }
    }

    componentWillUnmount() {

        console.log('12345678')
    }

    componentDidMount() {

        try {
            BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
        } catch (e) {


        } finally {


        }
    }


    handleBack = () => {
        this.backPage();
        return true;
    }

    backPage = () => {
        const navigator = this.props.navigator;
        if (navigator) {
            navigator.pop();
        }
    }


    render() {

        return (

            <View style={{flex: 1, backgroundColor: fontAndColor.COLORA3}}>

                <NavigationBar
                    centerText={'原因描述'}
                    rightText={''}
                    leftImageCallBack={this.backPage}
                />


                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.style_scrollview_container}>

                    <KeyboardAvoidingView
                        behavior={'position'}
                        //1keyboardVerticalOffset={}
                    >

                        {   // 取消原因选项
                            this.state.buyer_cancel_types.map((data, index) => {
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {

                                            cancelTypes.map((typeData, index) => {
                                                typeData.check = false
                                            })
                                            cancelTypes[index].check = true;

                                            this.setState({
                                                buyer_cancel_types: cancelTypes,
                                                selected_buyer_cancel_type: data.buyer_cancel_type
                                            });
                                        }}
                                        activeOpacity={1}
                                    >
                                        <View style={styles.style_select_item}>
                                            <Image style={{marginLeft: 15}}
                                                   source={data.check ? require('../../../images/checked.png') : require('../../../images/unchecked.png')}/>
                                            <Text style={{marginLeft: 20}}>{data.value}</Text>
                                        </View>

                                    </TouchableOpacity>

                                )
                            })
                        }


                        <View style={{marginTop: 15, backgroundColor: 'white',}}>
                            <TextInput
                                underlineColorAndroid='transparent'
                                fontSize={fontAndColor.BUTTONFONT30}
                                style={styles.style_text_input}
                                maxLength={100}
                                multiline={true}
                                onChangeText={this._onChangeText}
                                placeholder='其他原因描述，不超过100个字符'

                            />
                            <Text
                                style={styles.style_text_number}>{this.state.buyer_cancel_desc.length + '/' + 100}</Text>
                        </View>

                        <View style={{marginTop: 15, backgroundColor: 'white'}}>

                            <Text style={styles.style_upload_text_label}>{'上传照片'}</Text>

                            <View style={{
                                flexDirection: 'row',
                                marginVertical: Pixel.getPixel(15),
                                marginHorizontal: Pixel.getPixel(15),

                            }}>
                                {
                                    this.state.pictures.map((picture, index) => {
                                        if (index > 2) {   //最多显示添加三张， 多余的不予渲染
                                            return;
                                        }
                                        return (
                                            <SelectedImage
                                                key={index}
                                                source={picture.image}
                                                deletable={picture.deletable}

                                                onPressDelete={() => {

                                                    if (!picture.deletable) { //如果是不可以删除的图片说明就是加号图片 ，这个不能删
                                                        return;
                                                    }

                                                    cancelImages.splice(picture, 1);
                                                    this.setState({
                                                        pictures: cancelImages
                                                    })

                                                }}

                                                onPressAdd={() => {

                                                    if (picture.deletable) { //如果是可删除的图片说明就不是加号图片 ，就没有添加功能
                                                        return;

                                                    }

                                                    ImagePicker.showImagePicker(options, (imageResponse) => {
                                                        if (imageResponse.didCancel) {
                                                        } else if (imageResponse.error) {
                                                        } else if (imageResponse.customButton) {
                                                        } else {   //上传照片。。。  层次太多，可读性差，如果再没啥注释，简直是崩溃，自己看着都费劲

                                                            let params = {
                                                                file: 'data:image/jpeg;base64,' + encodeURI(imageResponse.data).replace(/\+/g, '%2B')
                                                            };

                                                            this.setState({
                                                                loading: true,
                                                            });
                                                            ImageUpload.request(Urls.INDEX_UPLOAD, 'Post', params).then(
                                                                (netResponse) => {

                                                                    if (netResponse.mycode === 1) {  // 上传成功

                                                                        this.setState({   // 关闭loading
                                                                            loading: false,
                                                                        });

                                                                        // 储存imageURL 并更新数据源，

                                                                        pictureToBeStored = {
                                                                            image: {uri: imageResponse.uri},
                                                                            url: netResponse.mjson.data.url,
                                                                            deletable: true
                                                                        }
                                                                        cancelImages.splice(cancelImages.length - 1, 0, pictureToBeStored);

                                                                        this.setState({
                                                                            pictures: cancelImages,
                                                                        })

                                                                    } else {
                                                                        this.setState({
                                                                            loading: false,
                                                                        });
                                                                        this.props.showToast('上传失败')
                                                                    }
                                                                }, (error) => {
                                                                    this.props.showToast('上传失败');
                                                                });

                                                        }
                                                    });


                                                }

                                                }

                                            />
                                        )
                                    })
                                }
                            </View>
                        </View>


                        <TouchableOpacity
                            onPress={() => {

                                if (this.state.selected_buyer_cancel_type == 0) {  //取消原因必选
                                    this.props.showToast('请选择原因');
                                    return;
                                }

                                if (this.state.selected_buyer_cancel_type == 1) {  //取消原因是车况，需要描述原因和上传照片

                                    if (this.state.buyer_cancel_desc == '') {
                                        this.props.showToast('请输入描述');
                                        return;
                                    }
                                    if (this.state.buyer_cancel_desc.length < 10) {
                                        this.props.showToast('最少输入10个汉字描述');
                                        return;
                                    }
                                    if (cancelImages.length == 1) {
                                        this.props.showToast('请上传照片');
                                        return;
                                    }

                                }

                                if (this.state.selected_buyer_cancel_type == 5) {  // 取消原因是其他， 需要描述原因，照片非必选
                                    if (this.state.buyer_cancel_desc == '') {
                                        this.props.showToast('请输入描述');
                                        return;
                                    }

                                    if (this.state.buyer_cancel_desc.length < 10) {
                                        this.props.showToast('最少输入10个汉字描述');
                                        return;
                                    }
                                }

                                //TODO  提交资料。。。
                                let urls = ''

                                for (let i = 0; i < cancelImages.length; i++) {
                                    if (i == cancelImages.length - 1) {
                                        break
                                    }
                                    urls += cancelImages[i].url + ';'
                                }

                                this.setState({
                                    loading: true,
                                })
                                StoreageUtil.mGetItem(StoreageKeyNames.LOAN_SUBJECT, (data) => {
                                    if (data.code == 1 && data.result != null) {
                                        let datas = JSON.parse(data.result);
                                        let param = {
                                            buyer_cancel_desc: this.state.buyer_cancel_desc,
                                            buyer_cancel_img: urls,
                                            buyer_cancel_type: this.state.selected_buyer_cancel_type,
                                            company_id: datas.company_base_id,
                                            order_id: this.props.order_id,
                                            node: 1,
                                            type: 1
                                        };
                                        //  取消订单， 现在是的地址是临时测试地址, 记得后续再改
                                        console.log('params', param);
                                        request(Urls.ORDER_CANCEL, 'Post', param).then((response) => {
                                            this.setState({
                                                loading: false,
                                            })
                                            console.log('response', response);
                                            this.props.refresh();
                                            this.backPage();
                                        }, (error) => {
                                            this.setState({
                                                loading: false,
                                            })
                                            console.log('error', error)
                                            this.props.showToast(error.mjson.msg);

                                        })
                                    } else {
                                        this.setState({
                                            loading: false,
                                        })
                                        this.props.showToast('取消订单申请失败');
                                    }
                                });
                            }}
                            style={styles.style_commite_container}>

                            <Text style={{color: 'white'}}>{'提交'}</Text>


                        </TouchableOpacity>

                        {this.loadingView()}

                    </KeyboardAvoidingView>

                </ScrollView>

            </View>
        )

    }

    _onChangeText = (text) => {
        this.setState({
            buyer_cancel_desc: text
        })

        // console.log(this.state.selected_buyer_cancel_type);
        // console.log(this.state.buyer_cancel_desc);
    }

}

const styles = StyleSheet.create({

    style_scrollview_container: {
        paddingTop: Pixel.getPixel(20),
        flex: 1
    },

    style_select_item: {
        width: screen_width,
        height: Pixel.getPixel(50),
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center',
    },

    style_text_input: {
        marginTop: Pixel.getPixel(10),
        paddingHorizontal: Pixel.getPixel(10),
        width: screen_width,
        height: Pixel.getPixel(110),
        textAlignVertical: 'top'
    },

    style_text_number: {
        marginTop: Pixel.getPixel(10),
        height: Pixel.getPixel(20),
        textAlign: 'right',
        marginRight: Pixel.getPixel(5)
    },

    style_upload_text_label: {
        fontSize: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15),
        marginTop: 15,

    },

    style_commite_container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: Pixel.getPixel(15),
        marginVertical: Pixel.getPixel(30),
        backgroundColor: fontAndColor.COLORB0,
        height: Pixel.getPixel(44),
        borderRadius: Pixel.getPixel(3),
    }
})

// 上传的照片组件
class SelectedImage extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        return (

            <View style={selectedImageStyle.style_container}>
                <TouchableOpacity
                    onPress={this.props.onPressAdd}
                    activeOpacity={1}
                >

                    <Image style={selectedImageStyle.style_deleget_image} source={this.props.source}/>

                    <TouchableOpacity
                        onPress={this.props.onPressDelete}
                        style={selectedImageStyle.style_deleget_image_container}
                    >
                        <Image opacity={this.props.deletable ? 1 : 0} source={require('../../../images/delete.png')}/>
                    </TouchableOpacity>

                </TouchableOpacity>

            </View>
        )
    }
}

const selectedImageStyle = StyleSheet.create({

    style_container: {
        width: Pixel.getPixel(83),
        height: Pixel.getPixel(60),
        marginRight: Pixel.getPixel(20),
        //backgroundColor:'blue',
    },

    style_deleget_image_container: {
        width: Pixel.getPixel(10),
        height: Pixel.getPixel(10),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    style_deleget_image: {

        marginTop: Pixel.getPixel(5),
        marginLeft: Pixel.getPixel(5),
        marginBottom: Pixel.getPixel(0),
        marginRight: Pixel.getPixel(0),
        resizeMode: 'center',
        width: 74,
        height: 55

    }
})