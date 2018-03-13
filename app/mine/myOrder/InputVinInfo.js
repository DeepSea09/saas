/**
 * Created by hanmeng on 2017/5/13.
 */

import React, {Component} from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    ListView
} from 'react-native';

import * as fontAndColor from '../../constant/fontAndColor';
import PixelUtil from '../../utils/PixelUtil';
import InputVinInfoScene from "./InputVinInfoScene";
const Pixel = new PixelUtil();
const {width, height} = Dimensions.get('window');

export default class InputVinInfo extends Component {

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: this.ds.cloneWithRows(this.props.viewData),
            modalVisible: false
        };
    }

    _hideModal = () => {
        this.setState({
            modalVisible: false
        });
    };


    refresh = (data) => {
        this.setState({
            dataSource: this.ds.cloneWithRows(data),
        });
    };

    openModal = (mType) => {
        this.setState({
            modalVisible: true
        });
        this.mType = mType;
    };

    render() {
        return (
            <Modal
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                }}>
                <TouchableOpacity style={styles.container} onPress={this._hideModal}>
                    <View>
                        <ListView
                            removeClippedSubviews={false}
                            dataSource={this.state.dataSource}
                            renderRow={this._renderRow}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }


    // 每一行中的数据
    _renderRow = (rowData, sectionID, rowID) => {
        if (rowID != 2) {
            // 扫描
            return (
                <TouchableOpacity
                    activeOpacity={0.8}
                    key={rowID}
                    onPress={() => {
                        this.props.vinPress(this.mType, rowID); this._hideModal
                    }}>
                    <View style={styles.rowStyle}>
                        <Text allowFontScaling={false}  style={styles.fontMain}>{rowData.model_name}</Text>
                    </View>
                </TouchableOpacity>
            )
        } else {
            //手动输入
            return (
                <TouchableOpacity
                    activeOpacity={0.8}
                    key={rowID}
                    onPress={() => {
                        this.toNextPage({
                            name: 'InputVinInfoScene',
                            component: InputVinInfoScene,
                            params: {}
                        }); this._hideModal()
                    }}>
                    <View style={styles.rowStyle}>
                        <Text allowFontScaling={false}  style={styles.fontMain}>{rowData.model_name}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
    };

    toNextPage = (mProps) => {
        const navigator = this.props.navigator;
        if (navigator) {
            navigator.push({
                ...mProps
            })
        }
    }

}

const styles = StyleSheet.create({
    container: {
        width: width,
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-end'
    },
    rowStyle: {
        backgroundColor: '#FFFFFF',
        height: Pixel.getPixel(44),
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: fontAndColor.COLORA4,
        borderBottomWidth: 0.5
    },
    fontMain: {
        color: '#000000',
        fontSize: Pixel.getFontPixel(14)
    },
    splitLine: {
        borderColor: fontAndColor.COLORA4,
        borderWidth: 0.5
    }
});



