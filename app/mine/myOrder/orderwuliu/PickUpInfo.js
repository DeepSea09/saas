import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View, TouchableOpacity, Dimensions, Image,ListView
} from 'react-native';
import BaseComponent from '../../../component/BaseComponent';
import NavigatorView from '../../../component/AllNavigationView';
import {request} from '../../../utils/RequestUtil';
import * as Urls from '../../../constant/appUrls';

const {width} = Dimensions.get('window');
import * as FontAndColor from '../../../constant/fontAndColor';
import PixelUtil from '../../../utils/PixelUtil';

const Pixel = new PixelUtil();
let accountInfo = [{name: '张大大', tel: '13000000001'}, {name: '李小小', tel: '13000000001'}]
export default class PickUpInfo extends BaseComponent {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            renderPlaceholderOnly: false,
            accountInfo: accountInfo,
            dataSource: this.ds.cloneWithRows(accountInfo),
            isRefreshing: false,
        }
    }

    initFinish() {
        this.setState({
            renderPlaceholderOnly: 'success'
        });
    }
    _renderRow=(data,s,index)=>{
        return (
            <TouchableOpacity key={index + 'accountInfo'} activeOpacity={0.8} onPress={() => {
            }}>
                <View style={styles.content_title_text_wrap}>
                    <Text style={styles.content_title_text}>{data.name}</Text>
                    <Text style={styles.content_base_Right}>{data.tel}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    _renderItem = () => {
        return (
            <View style={{flex: 1}}>

                <View style={{
                    backgroundColor: 'white',
                    paddingHorizontal: Pixel.getPixel(15)
                }}>
                    <View style={{
                        borderBottomWidth: 1,
                        borderColor: FontAndColor.COLORA4,
                    }}>
                        <Text style={{
                            fontSize: Pixel.getFontPixel(15),
                            marginVertical: Pixel.getPixel(15),
                            color: 'black',
                            borderBottomWidth: 1,
                            borderColor: FontAndColor.COLORA4,
                        }}>{'提车人'}</Text>
                    </View>

                    <ListView
                        dataSource={this.state.dataSource}
                        removeClippedSubviews={false}
                        renderRow={this._renderRow}
                        enableEmptySections={true}
                    />

                </View>
            </View>
        );

    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return ( <View style={styles.container}>
                {this.loadView()}
                <NavigatorView title='提车人信息' backIconClick={this.backPage}/>
            </View>);
        } else {
            return (<View style={styles.container}>
                <View style={{flex: 1, marginTop: Pixel.getTitlePixel(65),}}>
                    {
                        this._renderItem()
                    }
                </View>
                <NavigatorView title='提车人信息' backIconClick={this.backPage}/>
            </View>)
        }

    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: FontAndColor.all_background,
        flex: 1,
    },
    content_title_wrap: {
        height: Pixel.getPixel(51),
        backgroundColor: FontAndColor.all_background,
    },
    content_title_text_wrap: {
        height: Pixel.getPixel(45),
        alignItems: 'center',
        flexDirection: 'row',
    },
    content_title_text: {
        flex: 1,
        fontSize: Pixel.getFontPixel(15),
        color: FontAndColor.COLORA1,
    },
    content_base_wrap: {
        height: Pixel.getPixel(46),
        minHeight: Pixel.getPixel(46),
        backgroundColor: 'white'
    },
    content_base_text_wrap: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: Pixel.getPixel(1),
        borderColor: FontAndColor.COLORA4,
        marginHorizontal: Pixel.getPixel(15)
    },
    content_base_Right: {
        fontSize: Pixel.getFontPixel(15),
        color: FontAndColor.COLORA1,
        textAlign: 'right'
    },
    top_text: {}

});
