/**
 * Created by lhc on 2017/2/15.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    ListView,
    InteractionManager,
    NativeModules
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../constant/fontAndColor';
import BaseComponent from '../../component/BaseComponent';
import NavigationView from '../../component/AllNavigationView';
import {request} from '../../utils/RequestUtil';
import CompanyItem from './component/CompanyItem';
import * as MyUrl from '../../constant/appUrls';
let selected = [];
export  default class SelectGenderScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        // let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        selected = [];
        this.state = {
            renderPlaceholderOnly: 'blank',
            source: []
        };
    }


    initFinish = () => {
        this.getData();
    }
    getData = () => {
        let maps = {};
        request(MyUrl.USER_ROLE, 'Post', maps)
            .then((response) => {
                    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                    this.setState({
                        source: ds.cloneWithRows(response.mjson.data),
                        renderPlaceholderOnly: 'success'
                    });
                },
                (error) => {
                    if (error.mycode == '-2100045' || error.mycode == '-1') {
                        this.setState({renderPlaceholderOnly: 'null'});
                    } else {
                        this.setState({renderPlaceholderOnly: 'error'});
                    }
                });
    }


    render() {
        if (this.state.renderPlaceholderOnly != 'success') {
            return this._renderPlaceholderView();
        }
        return (
            <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1}}>
                <ListView
                    removeClippedSubviews={false}
                    style={{marginTop: Pixel.getTitlePixel(79)}}
                    dataSource={this.state.source}
                    renderRow={this._renderRow}
                    renderSeparator={this._renderSeparator}
                />
                <NavigationView
                    title={this.props.title}
                    backIconClick={this.backPage}
                    renderRihtFootView={this._navigatorRightView}
                />
            </View>
        );
    }

    _renderRow = (movie, sectionId, rowId) => {
        return (
            <CompanyItem name={movie.role_name} callBack={(value)=>{
                if(value){
                    selected.push(movie);
                }else{
                    for(let i = 0;i<selected.length;i++){
                        if(movie.role_id==selected[i].role_id){
                            selected.splice(i,1);
                            return;
                        }
                    }
                }
            }}/>
        )
    }

    _navigatorRightView = () => {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => {
                this.props.callBack(selected);
                this.backPage();
            }} style={{width:Pixel.getPixel(53),height:Pixel.getPixel(27),backgroundColor: '#fff',
            justifyContent:'center',alignItems: 'center'}}>
                <Text allowFontScaling={false}
                      style={{fontSize: Pixel.getFontPixel(15),color:fontAndColor.COLORB0}}>完成</Text>
            </TouchableOpacity>
        );
    }

    _renderSeparator(sectionId, rowId) {

        return (
            <View style={styles.Separator} key={sectionId + rowId}>
            </View>
        )
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor: fontAndColor.COLORA3}}>
                {this.loadView()}
                <NavigationView
                    title={this.props.title}
                    backIconClick={this.backPage}
                />
            </View>
        );
    }

}
const styles = StyleSheet.create({

    image: {
        width: 43,
        height: 43,
    },
    Separator: {
        backgroundColor: fontAndColor.COLORA3,
        height: Pixel.getPixel(1),

    },
    margin: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)

    },
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'}
})