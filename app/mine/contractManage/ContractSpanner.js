import React, {
    Component,
    PropTypes
} from 'react';

import {
    StyleSheet,
    View,
    Dimensions,
    Text,
    Animated,
    TouchableHighlight,
    Image,
    Modal,
    TouchableOpacity,
} from 'react-native';
import * as fontAndClolr from '../../constant/fontAndColor';
export  default class ShareSpanner extends Component {
    constructor(props) {
        super(props);
        //应用注册
        this.state = {
            show: false,
        };
    }

    // 显示/隐藏 modal
    setModalVisible() {
        let isShow = this.state.show;
        this.setState({
            show: !isShow,
        });
    }
    _hideModal = ()=> {
        this.setState({
            show: false
        });
    };

    render() {
        return (
            <Modal
                animationType='fade'
                transparent={true}
                visible={this.state.show}
                onShow={() => {
                }}
                onRequestClose={() => {
                }}>
                <TouchableOpacity style={styles.modalStyle} onPress={this._hideModal}>
                <View style={styles.modalStyle}>
                    <View style={{flex: 1, backgroundColor: '#bbB2B2B2'}}/>
                    <View style={styles.subView}>
                        <TouchableHighlight onPress={() => {
                            this.setModalVisible()}}>
                            <View style={styles.content}>
                                <Text allowFontScaling={false}  style={styles.spinnerTitle}>
                                    某某某担保合同
                                </Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={() => {
                            this.setModalVisible()}}>
                            <View style={styles.content}>
                                <Text allowFontScaling={false}  style={[styles.spinnerTitle,{color: fontAndClolr.COLORB0} ]}>
                                    融资服务合同
                                </Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={() => {
                            this.setModalVisible()}}>
                            <View style={styles.content}>
                                <Text allowFontScaling={false}  style={styles.spinnerTitle}>
                                    高额保证反担保合同
                                </Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
                </TouchableOpacity>
            </Modal>

        );
    }
}

const styles = StyleSheet.create({
    // modal的样式
    modalStyle: {
        // backgroundColor:'#ccc',
        flex: 1,
    },
    // modal上子View的样式
    subView: {
        flexDirection:'column',
        backgroundColor:'#fff'
    },
    spinnerTitle: {
        fontSize: 12,
    },
    content: {
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: fontAndClolr.COLORA4,
        borderBottomWidth: 1,
    },
});