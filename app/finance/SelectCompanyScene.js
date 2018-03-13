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
    InteractionManager
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../constant/fontAndColor';
import NavigationView from '../component/AllNavigationView';
const childItems = [];
import {request} from '../utils/RequestUtil';
import * as Urls from '../constant/appUrls';
export  default class SelectCompanyScene extends Component {

    constructor(props) {
        super(props);
        // 初始状态
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            renderPlaceholderOnly: true,
            source: ds.cloneWithRows(this.props.loanList)
        };
    }

    componentDidMount() {
        //InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: false});
        //});
    }


    render() {
        if (this.state.renderPlaceholderOnly) {
            return this._renderPlaceholderView();
        }
        return (
            <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1}}>
                <NavigationView
                    title="切换公司"
                />
                <ListView
                    removeClippedSubviews={false}
                    style={{marginTop: Pixel.getTitlePixel(79)}}
                    dataSource={this.state.source}
                    renderRow={this._renderRow}
                    renderSeparator={this._renderSeparator}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        );
    }

    setLoan = (movie) => {
        if(movie.is_done_credit=='1'){
            this.props.showModal(true);
            let maps = {
                api: Urls.OPT_LOAN_SUBJECT,
                opt_merge_id: movie.merge_id,
                opt_user_id: movie.user_id,
            };
            request(Urls.FINANCE, 'Post', maps)
                .then((response) => {
                        this.props.callBack(movie.companyname);
                        this.props.showModal(false);
                    },
                    (error) => {
                        this.props.showModal(false);
                        this.props.showToast('网络连接失败');
                    });
        }else{
            this.props.showToast('当前企业未完成授信');
        }
    }

    _renderRow = (movie, sectionId, rowId) => {
        let names = '';
        if(movie.companyname==null||movie.companyname==''){
            names = movie.name;
        }else{
            names = movie.name+'('+movie.companyname+')';
        }
        return (
            <TouchableOpacity
                onPress={()=> {
                    this.setLoan(movie);
                }}
                activeOpacity={0.8}
                style={{
                    width: width, height: Pixel.getPixel(77),
                    backgroundColor: '#fff', paddingLeft: Pixel.getPixel(15),
                    paddingRight: Pixel.getPixel(15), flexDirection: 'row'
                }}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <Image style={{width: Pixel.getPixel(38), height: Pixel.getPixel(33)}}
                           source={require('../../images/financeImages/companyIcon.png')}></Image>
                </View>
                <View style={{flex: 4, justifyContent: 'center'}}>
                    <Text allowFontScaling={false} 
                        style={{fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30), color: fontAndColor.COLORA0}}>
                        {names}</Text>
                    <Text allowFontScaling={false} 
                        style={{
                            fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT24),
                            color: fontAndColor.COLORA1,
                            marginTop: Pixel.getPixel(10)
                        }}>{movie.is_done_credit=='1'?'授信额度' + movie.credit_mny / 10000 + '万':'未完成授信'}
                    </Text>
                </View>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
                    <Image style={{width: Pixel.getPixel(12), height: Pixel.getPixel(12)}}
                           source={require('../../images/mainImage/celljiantou.png')}/>
                </View>
            </TouchableOpacity>
        )
    }

    _renderSeparator(sectionId, rowId) {

        return (
            <View style={styles.Separator} key={sectionId + rowId}>
            </View>
        )
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height}}>
                <NavigationView
                    title="切换公司"
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
        height: Pixel.getPixel(10),

    },
    margin: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)

    },
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'}
})