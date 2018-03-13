import React, {Component} from "react";
import {
    AppRegistry,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    InteractionManager,
    ListView,
    PixelRatio,
    TextInput,
    Image,
    NativeModules,
    TouchableHighlight
} from "react-native";
import BaseComponent from "../../component/BaseComponent";
import NavigationView from '../../component/AllNavigationView';
import * as FontAndColor from "../../constant/fontAndColor";
import PixelUtil from "../../utils/PixelUtil";
import {request} from "../../utils/RequestUtil";
import * as AppUrls from "../../constant/appUrls";
import UploadPickerItem from "../component/UploadPickerItem";
import ChooseButton from "../../component/ChooseButton";
import * as apis from "../../constant/appUrls";
import MyButton from '../../component/MyButton';
import  SelectDJRScene from  '../../finance/lend/SelectDJRScene'
let results = [];
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Pixel = new PixelUtil();
var onePT = 1 / PixelRatio.get(); //一个像素
var Platform = require('Platform');
let childItems = [];
let DengJiRen = [];
export default class DDCarInfoScene extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            renderPlaceholderOnly: 'blank',
            listViewShow: true,
            chexing: "奥迪",
            chejia_number: "1234567890",
            dengjiren: "张三",
            sign_type: "图片上传",
            source: {},
        };
        this.xb = [];
    }

    componentWillUnmount() {
        results = [];
        childItems = [];
        DengJiRen = [];
    }

    /**
     * from @zhaojian
     *
     * 开始加载
     **/
    initFinish = () => {
        this.getCarInfo();

    }

    /**
     * 获取订单融资车辆照片分类3
     * getPurchaAutoPicCate
     **/
    getPurchaAutoPicCate = () => {
        let maps = {
            api: AppUrls.GETDINGDANAUTOPICCATE,


        };
        request(AppUrls.FINANCE, 'Post', maps)
            .then((response) => {
                    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                    if (response.mjson.data.cate_list == null || response.mjson.data.cate_list.length <= 0) {
                        this.setState({
                            source: ds.cloneWithRows(['10032']),
                            renderPlaceholderOnly: 'error'
                        });
                    }
                    else {
                        for (let i = 0; i < response.mjson.data.cate_list.length; i++) {
                            childItems.push({
                                code: response.mjson.data.cate_list[i].code,
                                id: response.mjson.data.cate_list[i].id,
                                list: []
                            });

                        }
                        if (this.props.carData.order_ownership_status == '1') {
                            for (let i = 0; i < childItems.length; i++) {
                                for (let j = 0; j < this.props.carData.file_list.length; j++) {
                                    if (childItems[i].code == this.props.carData.file_list[j].code) {
                                        childItems[i].list.push({
                                            url: this.props.carData.file_list[j].icon,
                                            fileId: this.props.carData.file_list[j].file_id
                                        });
                                        results.push({
                                            code: this.props.carData.file_list[j].code,
                                            code_id: this.props.carData.file_list[j].id,
                                            file_id: this.props.carData.file_list[j].file_id
                                        });
                                    }
                                }
                            }
                        }
                        this.setState({
                            source: ds.cloneWithRows(response.mjson.data.cate_list),
                            renderPlaceholderOnly: 'success'
                        });
                    }

                }, (error) => {
                    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                    this.setState({
                        renderPlaceholderOnly: 'success',
                        source: ds.cloneWithRows(['10032']),
                    });
                }
            )
    }


    /**
     * 获取车辆信息(车型，车架号)1
     * getCarInfo
     **/
    getCarInfo = () => {
        let maps = {
            api: apis.AUTODETAIL,
            info_id: this.props.carData.info_id,
            platform_order_number: this.props.platform_order_number,
        }
        request(apis.FINANCE, 'Post', maps)
            .then((response) => {

                this.state.chejia_number = response.mjson.data.detail.frame_number,
                    this.state.chexing = response.mjson.data.detail.model_name,
                    this.info_id = response.mjson.data.detail.info_id,
                    this.base_id = response.mjson.data.detail.base_id,
                    this.dengjiren = response.mjson.data.detail.register_user_name,
                    this.is_mortgagor = response.mjson.data.detail.is_mortgagor,

                    this.register_user_id = response.mjson.data.detail.register_user_id,
                    this.props.carData.file_list = response.mjson.data.detail.file_list.vehicle_ownership_description,
                    this.getBusinessList();
                if(this.is_mortgagor == 1){
                    this.setState({
                        listViewShow: false,
                    })
                }else {
                    this.setState({
                        listViewShow: true,
                    })
                };

            }, (error) => {
                this.setState({
                    renderPlaceholderOnly: 'error'
                });
            });
    }


    /**
     * 获取商户登记人/收车人列表2
     * getBusinessList
     **/
    getBusinessList = () => {
        let maps = {
            api: apis.GETBUSINESSLIST,
        }
        request(apis.FINANCE, 'Post', maps)
            .then((response) => {
                for (let i = 0; i < response.mjson.data.reg_user_list.length; i++) {
                    this.xb.push({
                        business_name: response.mjson.data.reg_user_list[i].business_name,
                        id: response.mjson.data.reg_user_list[i].id,
                        merge_id: response.mjson.data.reg_user_list[i].merge_id,
                        is_mortgagor: response.mjson.data.reg_user_list[i].is_mortgagor,
                    });
                    DengJiRen.push(
                        response.mjson.data.reg_user_list[i].business_name,
                    )
                }
                this.getPurchaAutoPicCate();
            }, (error) => {
                this.setState({
                    renderPlaceholderOnly: 'error'
                });
            });
    }
    /**
     * 更新订单融资车辆
     * updateCarInfo
     **/
    updateCarInfo = () => {
        let maps;
        let complete;
        if (this.register_user_id == "" || this.register_user_id == undefined) {
            this.props.showToast("请选择登记人");
            complete = false;
        } else {
            if (this.is_mortgagor == 1) {
                maps = {
                    api: apis.DDUPDATEAUTO,
                    base_id: this.base_id,
                    info_id: this.info_id,
                    register_user_id: this.register_user_id,
                }
                complete = true;

            } else {
                if (results.length <= 0) {
                    this.props.showToast("照片不能为空");
                    complete = false;

                } else {
                    maps = {
                        api: apis.DDUPDATEAUTO,
                        base_id: this.base_id,
                        info_id: this.info_id,
                        register_user_id: this.register_user_id,
                        file_list: JSON.stringify(results),
                    }
                    complete = true;

                }
            }

        }
        if (complete) {
            this.props.showModal(true);
            request(apis.FINANCE, 'Post', maps)
                .then((response) => {
                    this.props.showModal(false);
                    this.props.showToast("车辆权属信息更新成功");
                    this.props.backRefresh();
                    this.backPage();


                }, (error) => {
                    this.setState({
                        renderPlaceholderOnly: 'error'
                    });
                });
        }

    }


    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        }
        return (
            <View style={styles.container}>
                <View style={{
                    width: width,
                    flexDirection: 'column',
                    flex: 1,
                    marginTop: Pixel.getTitlePixel(69)
                }}>
                    {this._renderSectionHeader()}
                    {
                        (this.state.renderPlaceholderOnly == "success" && this.state.listViewShow) ?
                            <ListView
                                dataSource={this.state.source}
                                renderRow={this._renderRow}
                                renderSeparator={this._renderSeparator}
                            /> : null
                    }

                </View>


                <MyButton buttonType={MyButton.TEXTBUTTON}
                          content={'完成'}
                          parentStyle={styles.loginBtnStyle}
                          childStyle={styles.loginButtonTextStyle}
                          mOnPress={() => {
                              this.updateCarInfo();
                          }}/>
                <NavigationView
                    title="车辆信息"
                    backIconClick={this.backPage}
                />
            </View>
        )
    }

    /**
     * from @zhaojian
     *
     * 绘制列表每一行
     **/
    _renderRow = (movie, sectionId, rowId) => {
        if (movie == '10032') {
            return (<View></View>);
        }
        return (
            <UploadPickerItem totalNum={5} results={results} showModal={(value) => {
                this.props.showModal(value)
            }}
                              showToast={(value) => {
                                  this.props.showToast(value)
                              }} items={movie} childList={childItems[rowId]}/>
        )
    }

    _renderSeparator(sectionId, rowId) {
        return (
            <View style={styles.Separator} key={sectionId + rowId}/>
        )
    }

    /**
     * from @zhaojian
     *
     * 绘制头部控件
     **/
    _renderSectionHeader = (sectionData, sectionID) => {

        return (
            <View style={styles.headerALL}>
                <View style={styles.itemBackground}>
                    <Text style={styles.leftFont}>车型</Text>
                    <View style={styles.fillSpace}/>
                    <Text style={styles.headerCellRight}>{this.state.chexing}</Text>
                </View>

                <View style={{backgroundColor: FontAndColor.COLORA4, width: width, height: Pixel.getPixel(1)}}/>

                <View style={styles.itemBackground}>
                    <Text style={styles.leftFont}>车架号</Text>
                    <View style={styles.fillSpace}/>
                    <Text style={styles.headerCellRight}>{this.state.chejia_number}</Text>
                </View>

                <View style={{backgroundColor: FontAndColor.COLORA4, width: width, height: Pixel.getPixel(1)}}/>

                <ChooseButton ref="djr" leftText={'登记人'} showArrow={true}
                              rightText={this.dengjiren ? this.dengjiren : "请选择登记人"}
                              onPressButton={this.onPressButton}/>

                <View style={{backgroundColor: FontAndColor.COLORA4, width: width, height: Pixel.getPixel(1)}}/>

                <View style={styles.itemBackground}>
                    <Text style={styles.leftFont}>
                        <Text style={{color: FontAndColor.COLORB2}}>*</Text>权属声明签署方式</Text>
                    <View style={styles.fillSpace}/>
                    <Text style={styles.headerCellRight}>{this.state.sign_type}</Text>
                </View>

                <View style={{backgroundColor: FontAndColor.COLORA3, width: width, height: Pixel.getPixel(10)}}/>

            </View>
        )
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height, backgroundColor: FontAndColor.COLORA3}}>
                {this.loadView()}
                <NavigationView
                    title="车辆信息"
                    backIconClick={this.backPage}
                />
            </View>
        );
    }

    /**
     * 点击选择登记人
     * onPressButton
     **/
    onPressButton = () => {

        this.toNextPage(
            {
                name: 'SelectDJRScene',
                component: SelectDJRScene,
                params: {
                    regShowData: DengJiRen,
                    title: '选择登记人',
                    callBack: (name, index) => {

                        this.refs.djr.changeRightText(name);
                        this.register_user_id = this.xb[index].id;
                        this.is_mortgagor = this.xb[index].is_mortgagor;

                        if (this.xb[index].is_mortgagor == 1) {
                            this.setState({
                                listViewShow: false,
                            });
                        } else {
                            this.setState({
                                listViewShow: true,
                            });
                        }

                    }
                }
            })
    }

}

const styles = StyleSheet.create({
    headerALL: {
        width: width,
    },
    headerCell: {},
    headerCellLeft: {},
    headerCellRight: {},
    fillSpace: {
        flex: 1
    },
    itemBackground: {
        flexDirection: 'row',
        height: Pixel.getPixel(44),
        backgroundColor: 'white',
        paddingHorizontal: Pixel.getPixel(15),
        alignItems: 'center'
    },
    leftFont: {
        fontSize: Pixel.getFontPixel(14),
        color: 'black'
    },
    container: {
        flex: 1,
        marginTop: Pixel.getPixel(0),   //设置listView 顶在最上面
        backgroundColor: FontAndColor.COLORA3,
        alignItems: 'center'
    },
    buttonTextStyle: {
        color: FontAndColor.COLORA3,
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT)
    },

    buttonStyle: {
        borderColor: FontAndColor.COLORB0,
        borderWidth: 1,
        width: Pixel.getPixel(100),
        height: Pixel.getPixel(32),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Pixel.getPixel(12),
        marginBottom: Pixel.getPixel(12),
    },

    buttonSelectStyle: {
        borderColor: FontAndColor.COLORA2,
        borderWidth: 1,
        width: Pixel.getPixel(100),
        height: Pixel.getPixel(32),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Pixel.getPixel(12),
        marginBottom: Pixel.getPixel(12),
    },
    buttonTextSelectStyle: {
        fontSize: Pixel.getFontPixel(18),
        color: FontAndColor.COLORA2,
    },

    loginBtnEnStyle: {
        height: Pixel.getPixel(44),
        width: width - Pixel.getPixel(30),
        backgroundColor: "#69DCDA",
        marginTop: Pixel.getPixel(20),
        marginBottom: Pixel.getPixel(15),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Pixel.getPixel(4),
    },

    boundStateStyle: {
        flex: 1,
        color: FontAndColor.COLORB2,
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT),
        textAlign: 'right'
    },
    boundSuccessStyle: {
        flex: 1,
        color: FontAndColor.COLORB0,
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT),
        textAlign: 'right'
    },
    Separator: {
        backgroundColor: FontAndColor.COLORA3,
        height: Pixel.getPixel(1),
    },
    buttonStyleFill: {
        height: Pixel.getPixel(40),
        backgroundColor: FontAndColor.COLORB0,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        width: Pixel.getPixel(width) - Pixel.getPixel(20),
    },
    buttonsFlex: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    loginBtnStyle: {
        height: Pixel.getPixel(44),
        width: Pixel.getPixel(width) - Pixel.getPixel(30),
        backgroundColor: FontAndColor.COLORB0,
        marginTop: Pixel.getPixel(30),
        marginBottom: Pixel.getPixel(15),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Pixel.getPixel(4),
    },
    loginButtonTextStyle: {
        color: FontAndColor.COLORA3,
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT)
    },
})