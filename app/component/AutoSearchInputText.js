/**
 * searchBtShow 设置输入框是否有搜索按钮
 * inputPlaceholder 输入框提示语
 * inputTextStyle 输入框样式
 * btnStyle 搜索按钮样式
 */
import React, {Component, PropTypes} from "react";
import {AppRegistry, StyleSheet, Text, View, PixelRatio, TextInput, TouchableOpacity, Image} from "react-native";

var onePT = 1 / PixelRatio.get(); //一个像素

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
import BaseComponent from './BaseComponent';
import StorageUtil from '../utils/StorageUtil';
import * as StorageKey from '../constant/storageKeyNames';
import SQLiteUtil from '../utils/SQLiteUtil';
var SQLite = new SQLiteUtil();

export default class Search extends BaseComponent {
    static defaultProps = {
        searchBtShow: false,
        inputPlaceholder: "请输入用户名",
    };

    initFinish = () => {
        this.getOldSearch();
    }

    constructor(props) {
        super(props);
        //初始化方法
        this.state = {
            show: false,
            value: "",
            saveData: []
        }
    }

    //执行搜索操作搜索
    goSearch = (text) => {
        if (text === '') {
            this.getOldSearch();
            this.showDefultContext();
            this.setState({
                value: text
            });
        } else {
            this.getDataBase(text)
            this.setState({
                value: text
            });
        }

    }
    getDataBase = (text) => {
        let that = this;
        let sql;
        if (this.props.searchType === 'carName') {
            sql = 'select * from carName where name like ? LIMIT 5';
        } else {
            sql = 'select * from cityName where name like ? LIMIT 5';
        }
        SQLite.selectData(sql, ['%' + text + '%'], (data) => {
            if (data.code === 1) {
                let names = [];
                if (data.result.rows.length > 0) {
                    for (let i = 0; i < data.result.rows.length; i++) {
                        names.push(data.result.rows.item(i).name);
                    }
                    that.setState({
                        show: true,
                        saveData: names
                    });
                }
            }
        });
    }

    getOldSearch = () => {
        let that = this;
        let name = this.props.searchType === "carName" ? StorageKey.CAR_SEARCH : StorageKey.CITY_SEARCH;
        StorageUtil.mGetItem(name, (data) => {
            if (data.code === 1) {
                data.result = '奥迪,宝马,比亚迪,凯迪拉克';
                if (data.result !== null && data.result !== '') {
                    that.setState({
                        saveData: data.result.split(',')
                    });
                } else {
                    that.setState({
                        saveData: []
                    });
                }
            } else {
                that.setState({
                    saveData: []
                });
            }
        });
    }

    //显示默认内容
    showDefultContext = () => {
        if (this.state.saveData.length > 0) {
            this.setState({
                show: true,
            });
        }
    }

    //隐藏
    hide(val) {
        this.setState({
            show: false,
            value: val
        });
    }

    render() {
        let views = [];
        for (let x in this.state.saveData) {
            views.push(
                <Text allowFontScaling={false} 
                    key={x}
                    style={this.props.itemStyle}
                    onPress={this.hide.bind(this, this.state.saveData[x])}
                    numberOfLines={1}
                >
                    {this.state.saveData[x]}
                </Text>
            );
        }

        return (
            <View style={this.props.parentStyle}>
                <View style={[styles.flexDirection, this.props.childStyle]}>
                    <View style={styles.flex}>
                        <TextInput style={[this.props.inputTextStyle]}
                                   returnKeyType={"search"}
                                   placeholder={this.props.inputPlaceholder}
                                   underlineColorAndroid={"#00000000"}
                                   onEndEditing={this.hide.bind(this, this.state.value)}
                                   onSubmitEditing={() => {
                                       this.setState({
                                           show: false
                                       });
                                       this.props.submitEditing(this.state.value);
                                   }}
                                   value={this.state.value}
                                   onFocus={this.showDefultContext}
                                   onChangeText={this.goSearch}/>
                    </View>
                    {this.props.searchBtShow ?
                        <TouchableOpacity style={[this.props.btnStyle]} onPress={() => {
                            this.setState({
                                show: false
                            });
                            this.props.submitEditing(this.state.value);
                        }}>
                            <Image style={{flex: 1}} source={require('../../images/findIcon.png')}/>
                        </TouchableOpacity>
                        : null
                    }
                </View>

                {/* //结果列表*/}
                {
                    this.state.show ?
                        <TouchableOpacity activeOpacity={1} style={[{width: width,height:height}]}
                                          onPress={() => {
                                              this.setState({
                                                  show: false
                                              });
                                          }}>
                            <View style={[this.props.resultStyle]}>
                                {views}
                            </View>
                        </TouchableOpacity>
                        :
                        null
                }
            </View>
        );
    }
}


const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    green: {
        backgroundColor: '#cd2d1c'
    },
    flexDirection: {
        flexDirection: 'row',
    },
    inputHeight: {
        height: 45,
    },
    //输入框样式
    inputs: {
        borderWidth: 1,
        borderColor: '#CCC',
    },
    btn: {
        width: 17,
        height: 17,
        borderRadius: 4,
        position: 'absolute',
        top: 45 / 2 - 17 / 2,
        left: 5
    },
    search: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    result: {
        borderColor: '#00000000',
        borderTopWidth: onePT,
        height: height,
        width: 200
    },
    item: {
        fontSize: 16,
        padding: 5,
        paddingTop: 10,
        paddingBottom: 10,
        borderWidth: onePT,
        borderColor: '#ddd',
        borderTopWidth: 0,
        backgroundColor: '#ffffff'
    }
});
