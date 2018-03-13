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

import * as fontAndColor from '../../../constant/fontAndColor';
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();
const {width, height} = Dimensions.get('window');

export default class SelectLoanNumber extends Component {

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: this.ds.cloneWithRows(['1']),
            modalVisible: false
        };
    }

    _hiedModal = () => {
        this.setState({
            modalVisible: false,
            topOrBottom: 'bottom'
        });
    };


    openModalForNumber = (data) => {
        this.setState({
            dataSource: this.ds.cloneWithRows(data),
            modalVisible: true,
            topOrBottom: 'top'
        });
    };

    openModalForName = (data) => {
        this.setState({
            dataSource: this.ds.cloneWithRows(data),
            modalVisible: true,
            topOrBottom: 'bottom'
        });
    };

    render() {
        return (
            <Modal
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {}}>
                <TouchableOpacity onPress={()=>{
                   this.setState({
                      modalVisible:false
                   });
                }} style={{flex:1}}>
                    {this.state.topOrBottom == 'top' ?
                        <View style={{width:width,height:Pixel.getTitlePixel(64)}}></View> : <View/>}
                    <View style={[{flex:1,backgroundColor:'rgba(0,0,0,0.3)'},
                    this.state.topOrBottom=='top'?{justifyContent:'flex-start'}:{justifyContent:'flex-end'}]}>
                        <View>
                            <ListView
                                removeClippedSubviews={false}
                                dataSource={this.state.dataSource}
                                renderRow={this._renderRow}
                            />
                        </View>
                    </View>
                    {this.state.topOrBottom == 'bottom' ?
                        <View style={{width:width,height:Pixel.getPixel(44)}}></View> : <View/>}
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
                onPress={()=>{
                    if(this.state.topOrBottom == 'top'){
                        this.props.numberBack(rowID)
                    }else{
                        this.props.nameBack(rowID)
                    }
                    this._hiedModal()}}>
                <View style={styles.rowStyle}>
                    <Text allowFontScaling={false}  style={styles.fontMain}>{this.state.topOrBottom == 'top' ? rowData.code : rowData.contract_name}</Text>
                </View>
            </TouchableOpacity>
        );
    };

}

const styles = StyleSheet.create({
    container: {
        width: width,
        flex: 1,
        // backgroundColor:'rgba(0,0,0,0.3)',
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



