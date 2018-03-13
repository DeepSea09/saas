/**
 * Created by zhengnan on 2017/5/12.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    TouchableOpacity,
    Dimensions,
    Platform,
    Image,
}   from 'react-native';

import BaseComponent from '../../component/BaseComponent';
import AllNavigationView from '../../component/AllNavigationView';
import *as fontAndColor from '../../constant/fontAndColor';
import PixelUtil from '../../utils/PixelUtil';
import CarUpImageCell from '../znComponent/CarUpImageCell';
import StorageUtil from "../../utils/StorageUtil";
import SuccessModal from '../../publish/component/SuccessModal';
import CarMySourceScene from '../CarMySourceScene';

import * as Net from '../../utils/RequestUtil';
import * as AppUrls from '../../constant/appUrls';

const Pixel = new PixelUtil();
const sceneWidth = Dimensions.get('window').width;
const IS_ANDROID = Platform.OS === 'android';
import SelectPhotoModal from '../../component/SelectPhotoModal';
export default class NewCarUpImageScene extends BaseComponent {

    initFinish = () => {

    }
    // 构造
    constructor(props) {
        super(props);

        this.titleData = [];
        this.results = [];
        this.carData = this.props.carData;
        if (this.carData.v_type == 2) {
            for (let carImageObject of this.props.carConfigurationData.new_car_pic) {
                carImageObject['imgArray'] = [];
                this.titleData.push(carImageObject);
            }
        }

        if (this.carData.pictures) {
            let imgas = JSON.parse(this.carData.pictures);
            this.results.push(...imgas);
            this.titleData.map((data, index) => {
                imgas.map((imgData, subIndex) => {
                    if (data.name == imgData.name) {
                        data.imgArray.push(imgData);
                    }
                });
            });
        } else if (this.carData.imgs) {
            this.results.push(...this.carData.imgs);
            this.carData['pictures'] = JSON.stringify(this.results);
            this.titleData.map((data, index) => {
                this.carData.imgs.map((imgData, subIndex) => {
                    if (data.name == imgData.name) {
                        data.imgArray.push(imgData);
                    }
                });
            });
        }

        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: dataSource.cloneWithRows(this.titleData),
        };
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        return (
            <View style={styles.rootContainer}>
                <SuccessModal okClick={this._goToSource} ref={(modal) => {this.successModal = modal}}/>
                <ListView
                    removeClippedSubviews={false}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderSeparator={this.renderSeparator}
                    renderFooter={this.renderFooter}
                />
                <AllNavigationView title="上传图片" backIconClick={this.backPage}/>
                <SelectPhotoModal ref="selectphotomodal"/>
            </View>)
    }

    renderSeparator(sectionId, rowId) {
        return (
            <View style={styles.Separator} key={sectionId + rowId}/>
        )
    }

    renderFooter = () => {
        return (
            <View style={styles.footContainer}>
                <TouchableOpacity onPress={this.footBtnClick}>
                    <View style={styles.footView}>
                        <Text allowFontScaling={false} style={styles.footText}>申请上架</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderRow = (data) => {
        return (
            <CarUpImageCell
                results={this.results}
                retureSaveAction={()=>{
                    this.carData['pictures']=JSON.stringify(this.results);

                    if(this.carData.show_shop_id && !this.carData.id){
                        StorageUtil.mSetItem(String(this.carData.new_show_shop_id),JSON.stringify(this.carData));
                    }
                }}
                showModal={(value)=>{this.props.showModal(value)}}
                showToast={(value)=>{this.props.showToast(value)}}
                items={data}
                childList={data.imgArray}
            />
        )
    }

    _goToSource = () => {

        let sourceParams = {
            name: 'CarMySourceScene',
            component: CarMySourceScene,
            params: {
                page: 2,
            }
        };
        this.toNextPage(sourceParams);
    };

    footBtnClick = () => {

        this.props.showModal(true);
        let errorTitle = '';
        for (let i = 0; i < this.titleData.length; i++) {
            let item = this.titleData[i];
            if (item.explain == '1') {
                let isNull = true;
                for (let j = 0; j < this.results.length; j++) {
                    if (this.results[j].name == item.name) {
                        isNull = false;
                    }
                }
                if (isNull) {
                    errorTitle = item.title;
                    break;
                }
            }
        }
        if (errorTitle != '') {
            this.props.showModal(false);
            this.props.showToast('请上传' + errorTitle + '图片');

        } else {

            this.publishCar();

        }
    }

    publishCar = () => {

        Net.request(AppUrls.CAR_SAVE, 'post', this.carData).then((response) => {

            this.props.showModal(false);

            if (response.mycode == 1 || response.mycode == 600010) {
                if (this.carData.show_shop_id) {
                    StorageUtil.mRemoveItem(String(this.carData.new_show_shop_id));
                }
                if (IS_ANDROID === true) {
                    this.successModal.openModal();
                } else {
                    this.timer = setTimeout(
                        () => {
                            this.successModal.openModal();
                        },
                        500
                    );
                }
            } else {
                this.showToast('网络连接失败');

            }

        }, (error) => {

            this.props.showModal(false);

            if (error.mycode === -300 || error.mycode === -500) {
                this.showToast('网络连接失败');

            } else if (error.mycode == 600010) {
                if (this.carData.show_shop_id) {
                    StorageUtil.mRemoveItem(String(this.carData.new_show_shop_id));
                }
                if (IS_ANDROID === true) {
                    this.successModal.openModal();
                } else {
                    this.timer = setTimeout(
                        () => {
                            this.successModal.openModal();
                        },
                        500
                    );
                }
            }
            else {
                this.showToast(error.mjson.msg);
            }
        });
    }

    showToast = (errorMsg) => {
        if (IS_ANDROID === true) {
            this.props.showToast(errorMsg);
        } else {
            this.timer = setTimeout(
                () => {
                    this.props.showToast(errorMsg)
                },
                500
            );
        }
    }
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: fontAndColor.COLORA3,
        paddingTop: Pixel.getTitlePixel(64),
    },
    Separator: {
        backgroundColor: fontAndColor.COLORA3,
        height: Pixel.getPixel(10),

    }, footContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Pixel.getPixel(20),
        marginBottom: Pixel.getPixel(20),

    },
    footView: {
        backgroundColor: fontAndColor.COLORB0,
        height: Pixel.getPixel(44),
        justifyContent: 'center',
        alignItems: 'center',
        width: sceneWidth - Pixel.getPixel(30),
        borderRadius: Pixel.getPixel(3),
    },
    footText: {
        textAlign: 'center',
        color: 'white',
        fontSize: fontAndColor.BUTTONFONT30
    },
});