/**
 * Created by hanmeng on 2017/8/10.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Modal,
    UIManager,
    findNodeHandle
} from 'react-native';

const {width, height} = Dimensions.get('window');
import * as fontAndColor from '../../constant/fontAndColor';
import PixelUtil from '../../utils/PixelUtil';
import HeadLineDetailScene from "../headLine/HeadLineDetailScene";
const Pixel = new PixelUtil();
import SQLiteUtil from "../../utils/SQLiteUtil";
import BaseComponent from "../../component/BaseComponent";
import SysMessageDetailScene from "../sysMessage/SysMessageDetailScene";
const SQLite = new SQLiteUtil();
const cellJianTou = require('../../../images/mainImage/celljiantou.png');

export class MessageListItem extends BaseComponent {

    /**
     *
     **/
    constructor(props) {
        super(props);
        this.state = {
            rowData: this.props.rowData,
            longPress: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            rowData: nextProps.rowData
        });
    }

    /**
     *
     * @returns {XML}
     **/
    render() {
        return (
            <View>
                <TouchableOpacity
                    ref={(sectionHeader) => { this.sectionHeader = sectionHeader; }}
                    onLongPress={() => {
                        this.setState({
                            longPress: true
                        });
                        const handle = findNodeHandle(this.sectionHeader);
                        UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
                            //console.log(pageX+'-----'+pageY);
                            this.props.callBack(this.props.keys, pageY, this.state.rowData.id);
                        });

                    }}
                    onPress={() => {
                        let data = this.state.rowData;
                        data.isRead = true;
                        if (this.props.type === 'advertisement') {
                            this.updateHeadLineInfoState(data);
                            this.toNextPage({
                                name: 'HeadLineDetailScene',
                                component: HeadLineDetailScene,
                                params: {
                                    url: this.state.rowData.content
                                }
                            });
                        } else {
                            this.updateSysMessageInfoState(data);
                            this.toNextPage({
                                name: 'SysMessageDetailScene',
                                component: SysMessageDetailScene,
                                params: {
                                    url: this.state.rowData.content
                                }
                            });
                        }
                    }}>
                    <View style={{
                        marginRight: Pixel.getPixel(15),
                        marginLeft: Pixel.getPixel(15),
                        backgroundColor: '#ffffff',
                        borderRadius: Pixel.getPixel(4),
                        borderWidth: 1,
                        borderColor: '#ffffff'

                    }}>
                        <Text allowFontScaling={false} style={{
                            marginLeft: Pixel.getPixel(15),
                            marginTop: Pixel.getPixel(20),
                            fontSize: Pixel.getFontPixel(fontAndColor.NAVIGATORFONT),
                            color: this.state.rowData.isRead ? fontAndColor.COLORA1 : fontAndColor.COLORA0
                        }}>{this.state.rowData.title}</Text>
                        <Text allowFontScaling={false} style={{
                            marginLeft: Pixel.getPixel(15),
                            marginTop: Pixel.getPixel(10),
                            fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),
                            color: fontAndColor.COLORA1
                        }}> </Text>
                        <View style={{
                            marginTop: Pixel.getPixel(10),
                            marginRight: Pixel.getPixel(15),
                            marginLeft: Pixel.getPixel(15),
                            height: 1,
                            backgroundColor: fontAndColor.COLORA4
                        }}/>
                        <View style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            height: Pixel.getPixel(44),
                            backgroundColor: '#ffffff'
                        }}>
                            <Text allowFontScaling={false} style={{
                                marginLeft: Pixel.getPixel(15),
                                fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),
                                color: fontAndColor.COLORA2
                            }}>查看详情</Text>
                            <View style={{flex: 1}}/>
                            <Image source={cellJianTou} style={{marginRight: Pixel.getPixel(15)}}/>
                        </View>
                    </View>
                </TouchableOpacity>

                {/*this.state.longPress &&
                <TouchableOpacity onPress={() => {

                }}>
                    <View style={{
                        position: 'absolute',
                        right: Pixel.getPixel(30),
                        top: this.props.rowID == 0 ? 0 : Pixel.getPixel(-15),
                    }}>
                        <Image
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            source={require('../../../images/message/longPressButton.png')}>
                            <Text style={{
                                marginBottom: Pixel.getPixel(8),
                                backgroundColor: '#00000000',
                                fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                                color: '#ffffff'
                            }}>删除</Text>
                        </Image>
                    </View>
                </TouchableOpacity>*/}
                {/*this.state.longPress &&
                    <TouchableOpacity
                        style={{position: 'absolute',width: width, height: height,backgroundColor:'#F0F'
                        }}
                        onPress={() => {
                            this.setState({
                                longPress: false
                            });
                        }}
                        activeOpacity={1}>

                            <Image
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'absolute',
                                    right: Pixel.getPixel(30),
                                    top: Pixel.getPixel(-15),
                                }}
                                source={require('../../../images/message/longPressButton.png')}>
                                <Text style={{
                                    marginBottom: Pixel.getPixel(8),
                                    backgroundColor: '#00000000',
                                    fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                                    color: '#ffffff'
                                }}>删除</Text>
                            </Image>
                    </TouchableOpacity>*/}
            </View>
        )
    }

    /**
     *   show / hide
     **/
    changeButtonState = (isHide) => {
        this.setState({
            longPress: isHide
        });
    };

    /**
     *   更新数据库中数据的已读状态isRead
     **/
    updateHeadLineInfoState = (data) => {
        SQLite.changeData('UPDATE messageHeadLineModel set isRead = ? WHERE id = ? AND tel = ?',
            [true, data.id, data.tel]);
        this.setState({
            rowData: data
        });
    };

    /**
     *   更新数据库中数据的已读状态isRead
     **/
    updateSysMessageInfoState = (data) => {
        SQLite.changeData('UPDATE messageSystemModel set isRead = ? WHERE id = ? AND tel = ?',
            [true, data.id, data.tel]);
        this.setState({
            rowData: data
        });
    };

}

const styles = StyleSheet.create({
    selectView: {
        top: Pixel.getTitlePixel(75),
        backgroundColor: '#00000000',
        left: 0,
        right: 0,
        position: 'absolute',
        bottom: 0
    }
});