/**
 * Created by zhengnan on 2017/12/15.
 */

import React,{Component} from 'react'

import {
    StyleSheet,
    View,
    Text,
    ListView,
    RefreshControl,
    Modal,
    TouchableOpacity,
    Dimensions,
    Image
} from 'react-native'

let carSelectViewData = [];
let carSelectViewDataPage = 1;
let carSelectViewDataStatus = 1;

import BaseComponent from '../../component/BaseComponent';
import ListFooter           from './LoadMoreFooter';
import * as AppUrls from "../../constant/appUrls";
import  {request}           from '../../utils/RequestUtil';
import * as fontAndColor from '../../constant/fontAndColor';
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
const ScreenWidth = Dimensions.get('window').width;

export default class SelectCarSourceView extends BaseComponent {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态

        const carData = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id != r2.id});
        this.state = {
            visible :false,
            carData:carData,
            renderPlaceholderOnly: 'blank',
            carSelectViewData: carSelectViewDataStatus,
        };
    }

    setVisible=(isShow)=>{
        this.setState({
            visible:isShow,
        });
    }


    componentDidMount() {
        // InteractionManager.runAfterInteractions(() => {
        this.setState({renderPlaceholderOnly: 'loading'});
        this.initFinish();
        // });
    }

    initFinish = () => {
        if(carSelectViewData.length>0){
            this.setState({
                carData: this.state.carData.cloneWithRows(carSelectViewData),
                renderPlaceholderOnly: 'success',
                carSelectViewDataStatus:carSelectViewDataStatus,
            });
        }else {
            this.loadData();
        }

    };

    allRefresh=()=>{
        this.setState({renderPlaceholderOnly: 'loading'});
        this.loadData();

    }


    loadData = () => {

        let url = AppUrls.CAR_USER_CAR;
        carSelectViewDataPage = 1;
        request(url, 'post', {
            page: carSelectViewDataPage,
            row: 10,
            type:2,

        }).then((response) => {

            carSelectViewData=response.mjson.data.list;
            carSelectViewDataStatus = response.mjson.data.status;

            for(let data of carSelectViewData){
                if(!this.isCarLong && data.long_aging == 1){
                    this.isCarLong = true;
                }
            }

            if (carSelectViewData.length) {
                this.setState({
                    carData: this.state.carData.cloneWithRows(carSelectViewData),
                    renderPlaceholderOnly: 'success',
                    carSelectViewDataStatus:carSelectViewDataStatus,
                });

            } else {
                this.setState({
                    renderPlaceholderOnly: 'null',
                    carSelectViewDataStatus: carSelectViewDataStatus,

                });
            }

        }, (error) => {

            this.setState({
                renderPlaceholderOnly: 'error',
            });

        });

    }

    loadMoreData = () => {

        let url = AppUrls.CAR_USER_CAR;
        carSelectViewDataPage += 1;
        request(url, 'post', {
            page: carSelectViewDataPage,
            row: 10,
            type:2,

        }).then((response) => {
            carSelectViewDataStatus = response.mjson.data.status;
            let carData = response.mjson.data.list;
            if (carData.length) {
                for (let i = 0; i < carData.length; i++) {

                    if(!this.isCarLong && carData[i].long_aging == 1){
                        this.isCarLong = true;
                    }
                    carSelectViewData.push(carData[i]);
                }

                this.setState({
                    carData:this.state.carData.cloneWithRows(carSelectViewData),
                    carSelectViewDataStatus:carSelectViewDataStatus,
                });
            } else {

                this.setState({
                    carSelectViewDataStatus: carSelectViewDataStatus,
                });
            }

        }, (error) => {


        });
    }


    toEnd = () => {

        if (carSelectViewData.length && !this.state.isRefreshing && carSelectViewDataStatus != 2) {
            this.loadMoreData();
        }

    };

    renderListFooter = () => {

        if (this.state.isRefreshing) {
            return null;
        } else {
            return (<ListFooter isLoadAll={this.state.carUpperFrameStatus==1? false : true}/>)
        }
    }


    render(){
        return(
            <Modal animationType={'none'} visible={this.state.visible} transparent = {true} onRequestClose={()=>{this.setVisible(false)}}>
                <TouchableOpacity style={{ backgroundColor:'rgba(0, 0, 0,0.3)', alignItems:'center',justifyContent:'flex-end', flex:1} }
                                  activeOpacity={1}
                                  onPress={()=>{this.setVisible(false)}}>
                    {
                        this.state.renderPlaceholderOnly !== 'success'?(

                                <View style={{backgroundColor:'white',flex:1,
                                    alignItems:'center',justifyContent:'center',width:ScreenWidth,
                                }}>
                                    {
                                        this.state.renderPlaceholderOnly == 'null'?(this.nullDataView()):(this.loadView())
                                    }
                                </View >):(
                                <View style={{width:ScreenWidth,backgroundColor:'white'}}>
                                    <ListView
                                        removeClippedSubviews={false}
                                        dataSource={this.state.carData}
                                        initialListSize={10}
                                        onEndReachedThreshold={1}
                                        stickyHeaderIndices={[]}//仅ios
                                        enableEmptySections={true}
                                        scrollRenderAheadDistance={10}
                                        pageSize={10}
                                        renderFooter={this.renderListFooter}
                                        onEndReached={this.toEnd}
                                        renderRow={this.renderRow}
                                    />
                                </View>)
                    }

                </TouchableOpacity>
            </Modal>
        )
    }

    renderRow =(rowData)=>{

        return(
            <TouchableOpacity activeOpacity={1} onPress={()=>{ this.setVisible(false); this.props.selectCarAction(rowData)} }>
                <View style={{height:Pixel.getPixel(44), alignItems:'center',justifyContent:'center',borderBottomWidth:Pixel.getPixel(0.5),borderBottomColor:fontAndColor.COLORA3,backgroundColor:'white'}}>
                    <Text style={{color:fontAndColor.COLORA0, fontSize:Pixel.getFontPixel(fontAndColor.LITTLEFONT28)}}>{rowData.model_name+'  '+rowData.car_color.split("|")[0]}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    nullDataView=()=>{
        return(
            <View style={{flex: 1, alignItems: 'center',justifyContent:'center'}}>
                <Image
                    style={{
                        width: Pixel.getPixel(121),
                        height: Pixel.getPixel(163),
                    }}
                    source={require('../../../images/noData.png')}/>
                <Text allowFontScaling={false}
                      style={{
                          color: fontAndColor.COLORA0, fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                          marginTop: Pixel.getPixel(27)
                      }}>
                    暂无数据
                </Text>
                <TouchableOpacity onPress={()=>{
                    this.setVisible(false);
                    this.props.pushNewCarAction && this.props.pushNewCarAction();
                }} activeOpacity={1} style={{justifyContent:'center',alignItems: 'center',
                    backgroundColor: fontAndColor.COLORB0,marginTop:Pixel.getPixel(20),paddingHorizontal:Pixel.getPixel(60),paddingVertical:Pixel.getPixel(10)}}>
                    <Text allowFontScaling={false}  style={{color: '#fff',fontSize:
                        Pixel.getFontPixel(fontAndColor.BUTTONFONT30)}}>发布新车源</Text>
                </TouchableOpacity>
                <Text allowFontScaling={false}
                      style={{
                          color: fontAndColor.COLORA1, fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                          marginTop: Pixel.getPixel(10)
                      }}>
                </Text>
            </View>
        )
    }
}