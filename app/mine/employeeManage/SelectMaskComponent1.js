/**
 * Created by Administrator on 2017/2/13.
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
const Pixel = new PixelUtil();
const {width, height} = Dimensions.get('window');
let allData = [];
let itemIds = [];
export default class SelectMaskComponent extends Component {

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.compData = new Array(...this.props.viewData);
        this.compData.map((data) => {
            data['selected'] = false;
        });
        this.state = {
            dataSource: this.ds.cloneWithRows(this.compData),
            modalVisible: false,
            isCompanyModel: false,
        };
    }

    changeData = (data) => {
        itemIds=[];
        this.compData = new Array(...data);
        this.compData.map((data) => {
            data['selected'] = false;
        });
        this.setState({
            dataSource: this.ds.cloneWithRows(this.compData)
        })
    };


    _hideModal = () => {
        this.setState({
            modalVisible: false
        });
    };

    openModal = () => {
        this.setState((preState, props) => ({
            modalVisible: true
        }));
    };

    componentWillUnmount() {
        itemIds = [];
    }

    isSelect = (rowID) => {
        // let newList = new Array(...allData);
        // let select=this.state.isSelected;
        this.compData[rowID]['selected'] = !this.compData[rowID]['selected'];
        this.setState({
            dataSource: this.ds.cloneWithRows(this.compData)
        });
        if (this.compData[rowID]['selected']) {
            itemIds.push(rowID);
        } else {
            for(let i = 0;i<itemIds.length;i++){
                 if(itemIds[i]==rowID){
                   itemIds.splice(i,1);
                 }
            }
        }

    }

    render() {
        return (
            <Modal
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                }}>
                <TouchableOpacity style={styles.container} onPress={
                    () => {
                        this._hideModal();
                        this.props.onClick(itemIds)
                    }}>

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
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                key={rowID}
                onPress={() => {
                    this.isSelect(rowID)
                }}>
                <View style={styles.rowStyle}>
                    <Text allowFontScaling={false} 
                        style={[styles.fontMain, rowData.selected && {color: fontAndColor.COLORB0}]}>{rowData.enterprise_name}</Text>
                </View>
            </TouchableOpacity>
        );
    };

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



