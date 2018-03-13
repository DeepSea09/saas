import React, {Component} from "react";
import {
    AppRegistry,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    InteractionManager,
    ListView
} from "react-native";
import BaseComponent from "../component/BaseComponent";
import NavigationBar from "../component/NavigationBar";
import * as FontAndColor from "../constant/fontAndColor";
import PixelUtil from "../utils/PixelUtil";

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Pixel = new PixelUtil();
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var contents = [
    {name: "黑色", color: '#000000'},
    {name: "白色", color: '#E1E1E1'},
    {name: "银灰色", color: '#999999'},
    {name: "深灰色", color: '#707070'},
    {name: "红色", color: '#FF0000'},
    {name: "橙色", color: '#FF8000'},
    {name: "绿色", color: '#8FE477'},
    {name: "蓝色", color: '#51C1F9'},
    {name: "咖啡色", color: '#94672B'},
    {name: "紫色", color: '#D389ED'},
    {name: "香槟色", color: '#E6D29E'},
    {name: "多彩色", color: '#4CD964'},
    {name: "黄色", color: '#FFFF00'},
    {name: "其他", color: '#E1E1E1'},
];
export default class ColorChoose extends BaseComponent {

    constructor(props) {
        super(props);

        this.state = {
            renderPlaceholderOnly: true,
            source: ds.cloneWithRows(contents),
        };
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
                        centerText={"选择颜色"}
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
                    centerText={"选择颜色"}
                    rightText={"  "}
                    leftImageCallBack={this.backPage}
                />
                <View style={styles.container}>
                    <ListView
                        initialListSize={3}
                        stickyHeaderIndices={[]}
                        onEndReachedThreshold={1}
                        scrollRenderAheadDistance={1}
                        pageSize={3}
                        removeClippedSubviews={false}
                        contentContainerStyle={styles.listStyle}
                        dataSource={this.state.source}
                        style={{paddingLeft: 10, paddingRight: 10}}
                        renderRow={this._renderRow}
                    />

                </View>
            </View>
        );
    }

    _renderRow = (data, sindex, rowID) => {
        return (
            <TouchableOpacity onPress={() => this.finshPage(data)}>
                <View style={styles.itemStyle}>
                    <View style={[styles.itemIconStyle, {backgroundColor: data.color,}]}/>
                    <Text allowFontScaling={false}  style={styles.itemTextStyle}>{data.name}</Text>
                </View>
            </TouchableOpacity>

        )
    }

    finshPage = (data) => {
        if (this.props.callBack) {
            this.props.callBack(data.name);
        }
        this.backPage();
    }

}

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        backgroundColor: FontAndColor.COLORA3,
    },
    container: {
        flex: 1,
        marginTop: Pixel.getPixel(0),   //设置listView 顶在最上面
        backgroundColor: 'white',
    },
    listStyle: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
    itemStyle: {
        width: 100,
        height: 40,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: FontAndColor.COLORA1,
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemIconStyle: {
        width: 30,
        height: 30,
        marginLeft: 5,
        borderRadius: 15,
        paddingTop: 5,
        paddingBottom: 5,
    },
    itemTextStyle: {
        flex: 1, textAlign: 'center', marginRight: 5
    }
});