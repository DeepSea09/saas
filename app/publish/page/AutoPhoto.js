/**
 * Created by Administrator on 2017/2/10.
 */
import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    Dimensions,
    StyleSheet,
    Platform,
    InteractionManager,
    TouchableOpacity
} from 'react-native';

import * as fontAndColor from '../../constant/fontAndColor';
import AllNavigationView from '../../component/AllNavigationView';
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import ImageSource from '../component/ImageSource';
import * as ImageUpload from '../../utils/ImageUpload';
import * as AppUrls from "../../constant/appUrls";

const {width, height} = Dimensions.get('window');
const background = require('../../../images/publish/background.png');
const photo = require('../../../images/publish/photo.png');
const photoMask = require('../../../images/publish/photo-mask.png');
import ImagePicker from "react-native-image-picker";

import SQLiteUtil from '../../utils/SQLiteUtil';
const SQLite = new SQLiteUtil();
const IS_ANDROID = Platform.OS === 'android';

const options = {
    //弹出框选项
    title: '请选择',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '选择相册',
    allowsEditing: true,
    noData: false,
    quality: 1.0,
    maxWidth: 480,
    maxHeight: 800,
    storageOptions: {
        skipBackup: true,
        path: 'images',
    }
};

export default class AutoPhoto extends Component {

    constructor(props) {
        super(props);
        let hasPhoto = false;
        if(this.isEmpty(this.props.carData.pictures) === false){
            this.pictures = JSON.parse(this.props.carData.pictures);
            this.selectSource = {uri: this.pictures[0].url};
            hasPhoto = true;
        }else {
            this.pictures = [];
        }
        this.state = {
            hasPhoto: hasPhoto,
            renderPlaceholderOnly: true
        }
    }

    isEmpty = (str)=>{
        if(typeof(str) != 'undefined' && str !== ''){
            return false;
        }else {
            return true;
        }
    };

    componentWillMount() {

    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: false});
        });
    }

    componentWillUnmount() {

    }

    _renderPlaceholderView = () => {
        return (<Image style={[styles.img,{height:height-this.props.barHeight}]} source={background}/>);
    };

    _labelPress = () => {
        if(IS_ANDROID === true){
            this.imageSource.openModal();
        }else{
            ImagePicker.showImagePicker(options, (response) => {
                if (response.didCancel) {
                } else if (response.error) {
                } else if (response.customButton) {
                } else {
                    this._uploadPicture(response);
                }
            });
        }
    };

    _rePhoto = () => {
        if(IS_ANDROID === true){
            this.imageSource.openModal();
        }else{
            ImagePicker.showImagePicker(options, (response) => {
                if (response.didCancel) {
                } else if (response.error) {
                } else if (response.customButton) {
                } else {
                    this._uploadPicture(response);
                }
            });
        }
    };

    _onBack = () => {
        this.props.onBack();
    };

    _galleryClick = () => {
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {}
            else if (response.error) {}
            else if (response.customButton) {}
            else {
                this._uploadPicture(response);
            }
        });
    };

    _uploadPicture = (response)=>{
        let params ={
            file:'data:image/jpeg;base64,' + encodeURI(response.data).replace(/\+/g,'%2B')
        };
        this.props.showLoading();
        ImageUpload.request(AppUrls.INDEX_UPLOAD,'Post',params).then(
            (response)=>{
                if(response.mycode === 1){
                    this.selectSource = {uri: response.mjson.data.url};
                    this.setState({
                        hasPhoto:true
                    });

                    let left ={
                        name : 'left_anterior',
                        file_id : response.mjson.data.file_id,
                        url: response.mjson.data.url,
                    };
                    this.pictures = [];
                    this.pictures.push(left);

                    SQLite.changeData(
                        'UPDATE publishCar SET pictures = ? WHERE vin = ?',
                        [ JSON.stringify(this.pictures), this.props.carData.vin]);
                    this.props.closeLoading();
                }else {
                    this.props.closeLoading();
                    this.props.showHint('上传失败');
                }
            },(error)=>{
                this.props.closeLoading();
                this.props.showHint(JSON.stringify(error));
            });
    };

    _cameraClick = () => {
        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {}
            else if (response.error) {}
            else if (response.customButton) {}
            else {
                this._uploadPicture(response);
            }
        });
    };

    render() {
        if (this.state.renderPlaceholderOnly) {
            return this._renderPlaceholderView();
        }
        return (
            <View style={styles.container}>
                <ImageSource galleryClick={this._galleryClick}
                             cameraClick={this._cameraClick}
                             ref={(modal) => {this.imageSource = modal}}/>
                <Image style={[styles.img,{height:height-this.props.barHeight}]} source={background}>
                    <AllNavigationView
                        backIconClick={this._onBack}
                        title='拍摄车辆照片'
                        wrapStyle={styles.wrapStyle}/>
                    {
                        this.state.hasPhoto
                            ? <Image style={styles.photoContainer} source={this.selectSource}>
                                <Image style={styles.hasPhotoContainer} source={photoMask}>
                                    <Text allowFontScaling={false}  style={styles.photoLabel}>左前45°照</Text>
                                    <View style={styles.fillSpace}/>
                                    <TouchableOpacity
                                        onPress={this._rePhoto}
                                        activeOpacity={0.6}>
                                        <Text allowFontScaling={false}  style={styles.rephotoLabel}>重拍</Text>
                                    </TouchableOpacity>
                                </Image>
                            </Image>
                            : <TouchableOpacity
                                onPress={this._labelPress}
                                activeOpacity={0.6}>
                                <Image style={styles.photoContainer} source={photo}>
                                    <View style={styles.noPhotoContainer}>
                                        <Text allowFontScaling={false}  style={styles.noPhoto}>请拍摄左前45°照</Text>
                                    </View>
                                </Image>
                            </TouchableOpacity>
                    }
                </Image>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: width,
        backgroundColor: 'transparent'
    },
    img: {
        width: width,
        backgroundColor: 'transparent',
        alignItems: 'center'
    },
    photoContainer: {
        marginTop: Pixel.getPixel(230),
        width: Pixel.getPixel(160),
        height: Pixel.getPixel(120),
        justifyContent: 'flex-end',
    },
    noPhotoContainer: {
        alignItems: 'center',
        marginBottom: Pixel.getPixel(30)
    },
    noPhoto: {
        fontSize: Pixel.getFontPixel(14),
        color: '#FFFFFF',
    },
    hasPhotoContainer: {
        width: Pixel.getPixel(160),
        flexDirection: 'row',
        alignItems: 'center',
        padding: Pixel.getPixel(10)
    },
    photoLabel: {
        fontSize: Pixel.getFontPixel(12),
        color: '#FFFFFF'
    },
    rephotoLabel: {
        fontSize: Pixel.getFontPixel(12),
        color: fontAndColor.COLORB1
    },
    fillSpace: {
        flex: 1
    },
    wrapStyle: {
        backgroundColor: 'transparent'
    }
});