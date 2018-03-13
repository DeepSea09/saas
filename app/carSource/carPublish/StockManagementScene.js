/**
 * Created by zhengnan on 2017/5/11.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    Image,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Keyboard,
    ScrollView,
    Platform,
    NativeModules,
    DeviceEventEmitter,
    KeyboardAvoidingView,

}   from 'react-native';

import DateTimePicker from 'react-native-modal-datetime-picker';
import BaseComponent from '../../component/BaseComponent';
import AllNavigationView from '../../component/AllNavigationView';
import {CellView, CellSelectView} from '../znComponent/CarPublishCell';

import *as fontAndColor from '../../constant/fontAndColor';
import VinInfo from '../../publish/component/VinInfo';
import * as Net from '../../utils/RequestUtil';
import * as AppUrls from '../../constant/appUrls';
import PixelUtil from '../../utils/PixelUtil';
import CarUpImageCell from '../znComponent/MsgCarUpImageCell';
import  AllLoading from '../../component/AllLoading';

import SelectCarSourceView from '../znComponent/SelectCarSourceView';

const Pixel = new PixelUtil();
const sceneWidth = Dimensions.get('window').width;
const sceneHeight = Dimensions.get('window').height;
const scanImg = require('../../../images/financeImages/scan.png');
const IS_ANDROID = Platform.OS === 'android';

export default class StockManagementScene extends BaseComponent {


    initFinish = () => {
        // this.loadCarConfigurationData();
        this.setState({
            renderPlaceholderOnly: /*value ? 'loading' :*/ 'success'
        });
    }
    allRefresh = () => {
        // this.loadCarConfigurationData();
    }

    // 构造
    constructor(props) {
        super(props);

        this.results = [];
        this.scanType = [
            {model_name: '扫描前风挡'},
            {model_name: '扫描行驶证'}
        ];
        this.modelData = [];
        this.modelInfo = {};
        if (this.props.dataID) {
            this.carData = {
                auto_pid: this.props.carData.id,
                car_color: this.props.carData.car_color,
                engine_number: this.props.carData.engine_number,
                manufacture: this.props.carData.manufacture != '' ? this.dateReversal(this.props.carData.manufacture + "000") : "",
                pictures: this.props.carData.imgs,
                purchase_price: this.props.carData.purchase_price,
                status: this.props.carData.status,
                vin: this.props.carData.vin,
                model_name: this.props.carData.model_name,
                model_id: this.props.carData.model_id
            };
            this.carData.id = this.props.dataID;
            this.carData.auto_pid = this.props.carData.svi_id;
        } else {
            this.props.carData.imgs = [];
            this.carData = {
                auto_pid: this.props.carData.id,
                car_color: this.props.carData.car_color,
                engine_number: this.props.carData.engine_number,
                pictures: this.props.carData.imgs,
                purchase_price: this.props.carData.purchase_price,
                status: this.props.carData.status,
                model_name: this.props.carData.model_name,
                model_id: this.props.carData.model_id
            };
        }
        this.titleData1 = [
            [
                {
                    title: '所属车型',
                    isShowTag: false,
                    value:this.carData.model_name+'  '+this.carData.car_color.split("|")[0],
                    isShowTail: true,
                },
                {
                    title: '车辆信息',
                    isShowTag: true,
                    subTitle: "",
                    tailView: () => {
                        return (
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                <TextInput style={[styles.textInput,{width:Pixel.getPixel(150)}]}
                                           ref={(input) => {this.vinInput = input}}
                                           placeholder='请输入车架号'
                                           underlineColorAndroid='transparent'
                                           defaultValue={this.carData.vin?this.carData.vin:''}
                                           maxLength={17}
                                           editable={this.props.dataID?false:true}
                                           onChangeText={this._onVinChange}
                                           onFocus={()=>{
                                                this.setCurrentPy('vinInput');
                                             }}
                                           placeholderTextColor={fontAndColor.COLORA1}
                                           keyboardType={'ascii-capable'}
                                           placheolderFontSize={Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}
                                />
                                {
                                    !this.props.dataID && (<TouchableOpacity onPress={this._onScanPress}
                                                                            style={{flexDirection:'row', alignItems:'center'}}>
                                        <Image style={styles.scanImage} source={scanImg}/>
                                        <Text allowFontScaling={false}
                                              style={{color:fontAndColor.COLORA2, fontSize:fontAndColor.LITTLEFONT28,marginLeft:Pixel.getPixel(5)}}>扫描</Text>
                                    </TouchableOpacity>)
                                }
                            </View>
                        )
                    }
                },
                {
                    title: '发动机号',
                    isShowTag: false,
                    isShowTail: false,
                    tailView: () => {
                        return (
                            <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                                <TextInput
                                    style={[styles.textInput,{width:sceneWidth-Pixel.getPixel(220),height:Pixel.getPixel(30)}]}
                                    placeholder='请输入 '
                                    maxLength={8}
                                    underlineColorAndroid='transparent'
                                    defaultValue={this.carData.engine_number?this.carData.engine_number:''}
                                    onChangeText={(text)=>{this.carData['engine_number']=text}}
                                    onEndEditing={()=>{this.saveCarData();}}
                                    ref={(input) => {this.procedureInput = input}}
                                    onFocus={()=>{
                                      this.setCurrentPy(this.procedureInput);
                                  }}
                                    placeholderTextColor={fontAndColor.COLORA1}
                                    placheolderFontSize={Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}
                                />
                            </View>
                        )
                    }
                },
                {
                    title: '出厂日期',
                    isShowTag: false,
                    value: this.carData.manufacture?this.carData.manufacture:'请选择',
                    isShowTail: true,
                }
            ],
            [{
                title: '采购价',
                subTitle: '仅供车商老板、采购、财务查看',
                isShowTag: false,
                isShowTail: false,
                tailView: () => {
                    return (
                        <View style={{alignItems:'center', flexDirection:'row',justifyContent:'flex-end'}}>
                            <TextInput style={styles.textInput}
                                       ref={(ref)=>{this.purchase_price = ref}}
                                       placeholder='请输入 '
                                       keyboardType={'numeric'}
                                       maxLength={7}
                                       onFocus={()=>{
                                           this.setState({keyboardGap:0});
                                       }}
                                       underlineColorAndroid='transparent'
                                       placeholderTextColor={fontAndColor.COLORA1}
                                       defaultValue={this.carData.purchase_price?this.carMoneyChange(this.carData.purchase_price):''}
                                       onEndEditing={()=>{
                                           this.setState({keyboardGap:-Pixel.getPixel(180)});
                                           this.saveCarData();}}
                                       onChangeText={(text)=>{
                                            if(text.length>4&&text.indexOf('.')==-1){
                                               text = text.substring(0,4);
                                            }
                                           let moneyStr = this.chkPrice(text);
                                           this.carData['purchase_price']= moneyStr;
                                           this.purchase_price.setNativeProps({
                                               text: moneyStr,
                                           });
                                       }}/>
                            <Text allowFontScaling={false} style={styles.textInputTitle}>万元 </Text>
                        </View>)
                }
            }],
        ];

        let imagTitle = [
            [
                {
                    type: '2',
                    name: 'vin_no',
                    title: '车架号图',
                    subTitle: '',
                    number: 1,
                    imgArray: [],
                    explain: '2',
                }
            ],
            [
                {
                    type: '2',
                    name: 'procedure',
                    title: '手续图',
                    subTitle: '中规车请上传合格证照片，非中规车请上传关单、商检单、一次性证书正反面',
                    number: 5,
                    imgArray: [],
                    explain: '2',
                }
            ]
        ];

        if (this.props.carData.imgs) {
            this.results.push(...this.props.carData.imgs);
            this.carData['pictures'] = JSON.stringify(this.results);
            imagTitle.map((data, index) => {
                this.props.carData.imgs.map((imgData, subIndex) => {
                    if (data[0].name == imgData.name) {
                        data[0].imgArray.push(imgData);
                    }
                });
            });
        }
        this.titleData1.push(...imagTitle);

        this.state = {
            titleData: this.titleData1,
            isDateTimePickerVisible: false,
            renderPlaceholderOnly: 'loading',
            keyboardGap:-Pixel.getPixel(180),
        };
    }

    setCurrentPy = (ref) => {

        // console.log(ref);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    /**
     * from @zhaojian
     *
     * 校验车辆金额
     **/
    carMoneyChange = (carMoney) => {
        let newCarMoney = parseFloat(carMoney);
        let carMoneyStr = newCarMoney.toFixed(2);
        let moneyArray = carMoneyStr.split(".");
        // console.log(carMoney+'/'+newCarMoney +'/' + carMoneyStr +'/' +moneyArray);
        if (moneyArray.length > 1) {
            if (moneyArray[1] > 0) {
                return moneyArray[0] + '.' + moneyArray[1];
            } else {
                return moneyArray[0];
            }
        } else {
            return carMoneyStr;
        }
    }

    /**
     * from @zhaojian
     *
     * 正则校验，保证小数点后只能有两位
     **/
    chkPrice = (obj) => {
        obj = obj.replace(/[^\d.]/g, "");
        //必须保证第一位为数字而不是.
        obj = obj.replace(/^\./g, "");
        //保证只有出现一个.而没有多个.
        obj = obj.replace(/\.{2,}/g, ".");
        //保证.只出现一次，而不能出现两次以上
        obj = obj.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        if ((/\.\d{3}/).test(obj)) {
            obj = obj.substring(0, obj.length - 1);
        }
        return obj;
    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (
                <View style={{flex: 1, backgroundColor: 'white'}}>
                    {this.loadView()}
                    <AllNavigationView title="车辆信息" backIconClick={this.backPage}/>
                </View>);
        }

        return (
            <View style={styles.rootContainer}>
                {
                    IS_ANDROID ? (this.loadScrollView()) : (
                            <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={this.state.keyboardGap}>
                                {
                                    this.loadScrollView()
                                }
                            </KeyboardAvoidingView>
                        )
                }

                <VinInfo viewData={this.scanType} vinPress={this._vinPress} ref={(modal) => {this.vinModal = modal}}/>
                <DateTimePicker
                    titleIOS="请选择日期"
                    confirmTextIOS='确定'
                    cancelTextIOS='取消'
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />

                <AllLoading callEsc={()=>{
                            this.carData['flag'] = '2';
                            this.saveStockData();
                }} ref={(modal) => {this.allloading = modal}} canColse='false' callBack={()=>{
                            this.carData['flag'] = '1';
                            this.saveStockData();
                }}/>
                <SelectCarSourceView ref={(ref)=>{this.SelectCarSourceView = ref}} selectCarAction={this.selectAction}/>
                <AllNavigationView title="车辆信息" backIconClick={this.backPage}/>
            </View>
        )
    }

    loadScrollView = () => {
        return (
            <ScrollView ref={(ref)=>{this.scrollView = ref}} keyboardDismissMode={IS_ANDROID?'none':'on-drag'}>
                {
                    this.state.titleData.map((data, index) => {
                        return (
                            <View style={{marginTop:10,backgroundColor:'white'}} key={index}>
                                {
                                    data.map((rowData, subIndex) => {
                                        return (
                                            <TouchableOpacity
                                                key={subIndex}
                                                onPress={()=>{this.cellClick(rowData.title)}}
                                                activeOpacity={1}>
                                                {rowData.type == '2' ?
                                                    <CarUpImageCell
                                                        results={this.results}
                                                        retureSaveAction={()=>{
                                                        this.carData['pictures']=JSON.stringify(this.results);
                                                        }}
                                                        showModal={(value)=>{this.props.showModal(value)}}
                                                        showToast={(value)=>{this.props.showToast(value)}}
                                                        items={rowData}
                                                        childList={rowData.imgArray}
                                                    />
                                                    :
                                                    <CellView cellData={rowData}/>}
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        )
                    })
                }
                <View style={styles.footContainer}>
                    <TouchableOpacity onPress={this.footBtnClick}>
                        <View style={styles.footView}>
                            <Text allowFontScaling={false} style={styles.footText}>提交</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }

    /**
     * 创建、修改库存
     */
    saveStockData = () => {

        this.props.showModal(true);
        Net.request(AppUrls.CAR_STOCK_SAVE, 'post', this.carData).then((response) => {

            this.props.showModal(false);

            // if (response.mycode == 1) {
            //     this.carData = response.mjson.data;
            //     this.carData.manufacture = response.mjson.data.manufacture != '' ? this.dateReversal(response.mjson.data.manufacture + '000') : '';
            //     this.carData.init_reg = response.mjson.data.init_reg != '' ? this.dateReversal(response.mjson.data.init_reg + '000') : '';
            //     this.carData.emission_standards = response.mjson.data.emission_standards;
            // }

            this.props.refreshingData && this.props.refreshingData();
            this.backPage();

        }, (error) => {
            this.props.showModal(false);
            // 600030：该车辆已存在，不可重复入库
            // 600031：确认是否将该车源的可售车辆数+1
            // 600032：确认是否将该车源的可售车辆数-1
            if (/*error.mycode == 600030 ||*/ error.mycode == 600031 || error.mycode == 600032) {
                this.allloading.changeShowType(true, error.mjson.msg);
            } else {
                this.props.showToast(error.mjson.msg);
            }

        });

    }


    cellClick = (title) => {

        if(title == '所属车型'){
            this.SelectCarSourceView.setVisible(true);

        }else if (title == '出厂日期') {
            this._labelPress('factory');
        }

    }

    selectAction=(carData)=>{
        this.carData.auto_pid = carData.id;
        this.carData.car_color = carData.car_color;
        this.carData.model_name = carData.model_name;
        this.carData.model_id = carData.model_id;
        this.titleData1[0][0].value = this.carData.model_name+'  '+this.carData.car_color.split("|")[0];
        this.upTitleData();

    }


    footBtnClick = () => {


        if (!this.carData.vin || this.carData.vin == '') {
            this.props.showToast('请输入正确的车架号');
            return;
        }

        if (!this.carData.pictures) {
            this.carData.pictures = ""
        }

        if(!this.props.dataID){
            if(this.currentModelName){
                if(this.currentModelName!=this.carData.model_id){
                    this.props.showToast('该车架号所匹配出的车型与所选车型不一致');
                    return;
                }
            }
        }

        // if (!this.carData.manufacture) {
        //     this.props.showToast('选择出厂日期');
        //     return;
        // }
        //
        // if (!this.carData.purchase_price) {
        //     this.props.showToast('请填写采购价');
        //     return;
        // }

        // let navigatorParams = {
        //     name: "CarPublishSecondScene",
        //     component: CarPublishSecondScene,
        //     params: {
        //         carData: this.carData,
        //         carConfigurationData: this.carConfigurationData,
        //     }
        // }
        // this.toNextPage(navigatorParams);
        // this.carData['flag'] = '1';
        this.saveStockData();

    }

    _onScanPress = () => {
        this.vinModal.refresh(this.scanType);
        this.vinModal.openModal(1);
    }

    _handleDatePicked = (date) => {
        let d = this.dateFormat(date, 'yyyy-MM-dd');
        if (this.type === 'factory') {

            this.titleData1[0][3].value = d;
            this.carData['manufacture'] = d;

        } else {
            this.titleData1[0][3].value = d;
            this.carData['init_reg'] = d;
        }

        this.upTitleData();
        this._hideDateTimePicker();
    };

    _hideDateTimePicker = () => {
        this.setState({isDateTimePickerVisible: false});
    };

    _labelPress = (type) => {
        this.type = type;
        this.setState({isDateTimePickerVisible: true});
    };


    _vinPress = (type, index) => {
        if (type == 1) {
            if (IS_ANDROID === true) {
                NativeModules.VinScan.scan(parseInt(index)).then((vl) => {
                    this.vinInput.setNativeProps({
                        text: vl
                    });
                    this._onVinChange(vl);
                }, (error) => {
                });
            } else {
                this.timer = setTimeout(
                    () => {
                        NativeModules.VinScan.scan(parseInt(index)).then((vl) => {
                            this.vinInput.setNativeProps({
                                text: vl
                            });
                            this._onVinChange(vl);
                        }, (error) => {
                        });
                    },
                    500
                );
            }
        } else if (type == 0) {

            this.titleData1[0][3].value = this.modelData[index].model_year + '-06-01';
            this.carData['manufacture'] = this.modelData[index].model_year + '-06-01';
            this.currentModelName  = this.modelData[index].model_id;
            this.upTitleData();
        }

    };

    //车架号改变
    _onVinChange = (text) => {

        if (text.length === 17) {
            this._showLoading();
            this.vinInput.blur();
            Net.request(AppUrls.VIN_CHECK, 'post', {vin: text}).then(
                (response) => {
                    if (response.mycode === 1 && response.mjson.data.valid) {
                        this.titleData1[0][3].value = '请选择';
                        this.carData['vin'] = text;
                        Net.request(AppUrls.VININFO, 'post', {vin: text}).then(
                            (response) => {
                                this._closeLoading();
                                if (response.mycode === 1) {
                                    let rd = response.mjson.data;
                                    if (rd.length === 1) {


                                        this.titleData1[0][3].value = rd[0].model_year + '-06-01';
                                        this.carData['manufacture'] = rd[0].model_year + '-06-01';
                                        this.currentModelName = rd[0].model_id;

                                    } else if (rd.length > 1) {

                                        this.carData['vin'] = text;
                                        this.modelData = response.mjson.data;
                                        this.vinModal.refresh(this.modelData);
                                        this.vinModal.openModal(0);
                                    }

                                }
                                this.upTitleData();

                            },
                            (error) => {
                                this._closeLoading();
                                this.props.showToast(error.mjson.msg);
                            }
                        );

                    } else {
                        this._closeLoading();
                        this.titleData1[0][1].subTitle = '校验失败';
                        this.carData['vin'] = '';
                        this.upTitleData();
                    }
                },
                (error) => {
                    this._closeLoading();
                    this.titleData1[0][1].subTitle = '校验失败';
                    this.carData['vin'] = '';
                    this.upTitleData();
                }
            );
        } else {
            this.carData['vin'] = '';
        }
    };


    upTitleData = () => {

        this.setState({
            titleData: this.titleData1,
        });
    };

    saveCarData = () => {

    }

    _showLoading = () => {
        this.props.showModal(true);
    };

    _closeLoading = () => {
        this.props.showModal(false);
    };
    //提示信息
    _showHint = (hint) => {
        this.props.showToast(hint);
    };


    dateFormat = (date, fmt) => {
        let o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    dateReversal = (time) => {

        const date = new Date();
        date.setTime(time);
        return (date.getFullYear() + "-" + (this.PrefixInteger(date.getMonth() + 1, 2))) + "-" + (this.PrefixInteger(date.getDate(), 2));

    };

    PrefixInteger = (num, length) => {

        return (Array(length).join('0') + num).slice(-length);

    }

}


const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: fontAndColor.COLORA3,
        paddingTop: Pixel.getTitlePixel(64)
    },
    footContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Pixel.getPixel(20),

    },
    footView: {
        backgroundColor: fontAndColor.COLORB0,
        height: Pixel.getPixel(44),
        justifyContent: 'center',
        alignItems: 'center',
        width: sceneWidth - Pixel.getPixel(30),
        borderRadius: Pixel.getPixel(3),
        marginBottom: Pixel.getPixel(20),
    },
    footText: {
        textAlign: 'center',
        color: 'white',
        fontSize: fontAndColor.BUTTONFONT30
    },
    textInput: {
        height: Pixel.getPixel(30),
        borderColor: fontAndColor.COLORA0,
        width: Pixel.getPixel(100),
        textAlign: 'right',
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        backgroundColor: 'white',
    },
    scanImage: {
        height: Pixel.getPixel(18),
        width: Pixel.getPixel(18),
        marginLeft: Pixel.getPixel(8)
    },
});