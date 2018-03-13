/**
 * Created by zhengnan on 2017/5/9.
 */


import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    ListView,
    Text,
    TouchableOpacity,
    Dimensions,
    Animated,
    Image
} from 'react-native';

import * as fontAndColor from '../../../constant/fontAndColor';
import PixelUtil from '../../../utils/PixelUtil';
const Pixel = new PixelUtil();

import *as appUrls from '../../../constant/appUrls';
import {request} from "../../../utils/RequestUtil";

const provinceData = (require('../../../carSource/carData/carFilterData.json')).provinceSource2;
const SceneWidth = Dimensions.get('window').width;
const delImage = require('../../../../images/deleteIcon2x.png');

let selectData={
    provice_code:'',
    provice_name:'',
    city_name:'',
    city_code:'',
    district_name:'',
    district_code:'',
    repoId:''
};
let orderId='';
export default class WarehouseListScene extends Component{

    componentWillMount() {
        selectData.provice_name = '';
        selectData.provice_code = '';
        selectData.city_name='';
        selectData.city_code='';
        selectData.district_name='';
        selectData.district_code='';
        selectData.repoId='';
    }

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        orderId=this.props.orderId;
        this.titleArray = [];

        let  getSectionData = (dataBlob,sectionID)=>{
            return dataBlob[sectionID];
        };
        let  getRowData = (dataBlob,sectionID,rowID)=>{
            return dataBlob[sectionID+":"+rowID];
        };

        const dataSource = new  ListView.DataSource(
            {
                getSectionData:getSectionData,
                getRowData:getRowData,
                sectionHeaderHasChanged:(s1,s2)=>s1!==s2,
                rowHasChanged:(r1,r2)=>r1!==r2,
            }
        );

        let dataBlob={},sectionIDS=[],rowIDS=[],rows=[];
        for (var i=0;i<provinceData.length;i++){

            sectionIDS.push(i);
            dataBlob[i]=provinceData[i].title;
            this.titleArray.push(dataBlob[i]);
            rows = provinceData[i].data;
            rowIDS[i] = [];
            for (var j=0;j<rows.length;j++){
                rowIDS[i].push(j);
                dataBlob[i+':'+j] = rows[j];
            }
        }

        this.state = {
            dataSource:dataSource.cloneWithRowsAndSections(dataBlob,sectionIDS,rowIDS),
            isShowCityList:false,
            isShowDistrictList:false
        };
    }

    _checkedCityClick=()=>{
        if (!this.state.isShowDistrictList) {
            this.setState({
                isShowDistrictList: true,
            });
        } else {
            this.refs.districtList.loadData();
        }
    };

    _checkDistrictClick = ()=>{
        this.props.checkAreaClick(selectData);
        this.props.closePress();
    };

    loadModel=(type)=>{
        this.props.showModal(type);
    };

    render(){
        return(
            <View style={styles.absContainer}>
                <View style={styles.rootContainer}>
                    <View style={styles.rootTitleContainer}>
                        <Text style={styles.rootTitleText}>所在区域</Text>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={styles.rootDelContainer}
                            onPress={()=>{
                                this.props.closePress();
                            }}
                        >
                            <Image style={styles.rootDelImage} source={delImage}/>
                        </TouchableOpacity>
                    </View>
                    <ListView
                        ref="listView"
                        dataSource={this.state.dataSource}
                        renderSectionHeader={(sectionData)=>{
                            return(
                                <View style={styles.sectionHeader}>
                                    <Text allowFontScaling={false}  style={styles.sectionText}>{sectionData}</Text>
                                </View>
                            )
                        }}
                        renderRow={this.renderRow}
                        enableEmptySections={true}
                        removeClippedSubviews={false}
                        onScroll={() => {
                            if (this.state.isShowCityList) {
                                this.setState({
                                    isShowCityList:false,
                                });
                            }}}/>
                    <ZNListIndexView indexTitleArray={this.titleArray} indexClick={this._indexAndScrollClick}/>
                    {
                        this.state.isShowCityList && (<CityList  isZs = {this.props.isZs} ref="cityList" checkedCityClick={this._checkedCityClick} isSelectProvince = {this.props.isSelectProvince} showLoadModel={this.loadModel}/>)
                    }
                    {
                        this.state.isShowDistrictList && (<DistrictList  ref="districtList" checkDistrictClick={this._checkDistrictClick} showLoadModel={this.loadModel}/>)
                    }
                </View>
            </View>)
    }

    // 每一行中的数据
    renderRow = (rowData) => {
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={()=>{
                    this.setState({isShowCityList:true});

                    if(selectData.provice_code == rowData.province){return;}

                    selectData.city_name=rowData.cityName;
                    selectData.city_code=rowData.city;
                    selectData.provice_name=rowData.provName;
                    selectData.provice_code=rowData.provCode;
                    selectData.district_name=rowData.countyName;
                    selectData.district_code=rowData.county;

                    this.refs.cityList && this.refs.cityList.loadData();
                }}>
                <View style={styles.rowCell}>
                    <Text allowFontScaling={false}  style={styles.rowCellText}>{rowData.provName}</Text>
                </View>
            </TouchableOpacity>
        )
    };

    _indexAndScrollClick = (index) => {

        let listView = this.refs.listView;
        let scrollY = index * Pixel.getPixel(40);
        for (let i = 0; i < index; i++) {
            let rowIndex = provinceData[i].data.length;
            scrollY += +rowIndex * Pixel.getPixel(44);
        }
        listView.scrollTo({x: 0, y: scrollY, animated: true});
    };

}

class CityList extends  Component{

    componentDidMount() {

        this.state.valueRight.setValue(SceneWidth);
        Animated.spring(
            this.state.valueRight,
            {
                toValue: SceneWidth * 0.2,
                friction: 5,
            }
        ).start();

        this.loadData();


    }
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        const dataSource = new ListView.DataSource({
            rowHasChanged:(r1,r2)=>r1!==r2,
        });

        this.state = {
            dataSource:dataSource,
            valueRight: new Animated.Value(0),
        };
    }

    loadData=()=>{

        this.props.showLoadModel(true);

        request(appUrls.GETWAREHOUSEINFO,'post',{ company_id: global.companyBaseID,
            order_id: orderId,
            province: selectData.provice_code,})
            .then((response) => {

                this.props.showLoadModel(false);

                if(response.mycode ==1){
                    this.setState(
                        {dataSource:this.state.dataSource.cloneWithRows(response.mjson.data)}
                    );
                }


            }, (error) => {
                this.props.showLoadModel(false);

                console.log(error);

            });
    }
    render(){
        return(
            <Animated.View style={[styles.cityContainer,{left:this.state.valueRight}]}>
                <ListView dataSource={this.state.dataSource}
                          renderRow={this.renderRow}
                          removeClippedSubviews={false}
                          enableEmptySections={true}
                          renderHeader={()=>{
                              return(
                                  <TouchableOpacity style={styles.sectionHeader} onPress={()=>{
                                      if(this.props.isSelectProvince)
                                      {
                                          this.props.checkedCityClick();
                                      }
                                  }} activeOpacity={1}>
                                      <Text allowFontScaling={false}  style={styles.sectionText}>{selectData.provinceName}</Text>
                                  </TouchableOpacity>
                              )}}/>
            </Animated.View>
        )
    }
    // 每一行中的数据
    renderRow = (rowData) => {
        return (

            <TouchableOpacity style={styles.rowCell} onPress={()=>{
                selectData.city_name=rowData.cityName;
                selectData.city_code=rowData.city;
                selectData.provice_name=rowData.provinceName;
                selectData.provice_code=rowData.province;
                selectData.district_name=rowData.countyName;
                selectData.district_code=rowData.county;

                this.props.checkedCityClick();
            }}>
                <Text allowFontScaling={false}  style={styles.rowCellText}>{rowData.cityName+rowData.countyName}</Text>
            </TouchableOpacity>
        )
    };
}

class DistrictList extends  Component{

    componentDidMount() {

        this.state.valueRight.setValue(SceneWidth);
        Animated.spring(
            this.state.valueRight,
            {
                toValue: SceneWidth * 0.5,
                friction: 5,
            }
        ).start();

        this.loadData();


    }
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        const dataSource = new ListView.DataSource({
            rowHasChanged:(r1,r2)=>r1!==r2,
        });

        this.state = {
            dataSource:dataSource,
            valueRight: new Animated.Value(0),
        };
    }

    loadData=()=>{

        this.props.showLoadModel(true);

        request(appUrls.GETWAREHOUSEINFO,'post',{ company_id: global.companyBaseID,
            order_id: orderId,
            province: selectData.provice_code,
            city: selectData.city_code,})
            .then((response) => {

                this.props.showLoadModel(false);

                if(response.mycode ==1){
                    this.setState(
                        {dataSource:this.state.dataSource.cloneWithRows(response.mjson.data)}
                    );
                }

            }, (error) => {
                this.props.showLoadModel(false);
                console.log(error);
            });
    };

    render(){
        return(
            <Animated.View style={[styles.cityContainer,{left:this.state.valueRight}]}>
                <ListView dataSource={this.state.dataSource}
                          renderRow={this.renderRow}
                          removeClippedSubviews={false}
                          enableEmptySections={true}
                          renderHeader={()=>{
                              return(
                                  <TouchableOpacity style={styles.sectionHeader} onPress={()=>{
                                      if(this.props.isSelectProvince)
                                      {
                                          this.props._checkDistrictClick();
                                      }
                                  }} activeOpacity={1}>
                                      <Text allowFontScaling={false}  style={styles.sectionText}>{selectData.city_name}</Text>
                                  </TouchableOpacity>
                              )}}/>
            </Animated.View>
        )
    }
    // 每一行中的数据
    renderRow = (rowData) => {
        return (

            <TouchableOpacity style={styles.rowCell} onPress={()=>{
                selectData.city_name=rowData.cityName;
                selectData.city_code=rowData.city;
                selectData.provice_name=rowData.provinceName;
                selectData.provice_code=rowData.province;
                selectData.district_name=rowData.countyName;
                selectData.district_code=rowData.county;
                selectData.repoId=rowData.repoId;
                this.props.checkDistrictClick();
            }}>
                <Text allowFontScaling={false}  style={styles.rowCellText}>{rowData.countyName+rowData.address}</Text>
            </TouchableOpacity>
        )
    };
}

class ZNListIndexView extends Component{

    render(){
        const {indexTitleArray}=this.props;
        return(
            <View style={styles.indexView}>
                {
                    indexTitleArray.map((data,index)=>{
                        return(
                            <TouchableOpacity key={index} style={styles.indexItem} onPress={()=>{

                                this.props.indexClick(index);

                            }}>
                                <Text allowFontScaling={false}  style={styles.indexItemText}>{data}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    absContainer:{
        position:'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0,
    },
    rootContainer:{
        flex:1,
        width:SceneWidth,
        backgroundColor:'rgba(0,0,0,0.3)',
        paddingTop:Pixel.getPixel(140),

    },
    rootTitleContainer:{
        height:Pixel.getPixel(44),
        backgroundColor:'#fff',
        alignItems:'center',
        justifyContent:'center'
    },
    rootTitleText:{
        color:fontAndColor.COLORA0,
        fontSize:Pixel.getFontPixel(16)
    },
    rootDelContainer:{
        height:Pixel.getPixel(44),
        width:Pixel.getPixel(44),
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        right:Pixel.getPixel(5),
        bottom:0
    },
    rootDelImage:{
        height:Pixel.getPixel(16),
        width:Pixel.getPixel(16),
    },
    sectionHeader: {
        backgroundColor: fontAndColor.COLORA3,
        height: Pixel.getPixel(40),
        justifyContent: 'center'
    },
    sectionText: {
        marginLeft: Pixel.getPixel(15),
        color: fontAndColor.COLORA1,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),
    },
    rowCell: {

        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: fontAndColor.COLORA3,
        height: Pixel.getPixel(44),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',

    },
    rowCellText: {
        marginLeft: Pixel.getPixel(15),
        color: fontAndColor.COLORA0,
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),
    },
    indexView: {
        position: 'absolute',
        bottom: 0,
        top: Pixel.getPixel(184),
        backgroundColor: 'transparent',
        right: 0,
        width: Pixel.getPixel(45),
        alignItems: 'center',
        justifyContent: 'center',

    },
    indexItem: {
        marginTop: Pixel.getPixel(6),
        width: Pixel.getPixel(30),
        backgroundColor: 'transparent',
    },
    indexItemText: {
        color: fontAndColor.COLORA0,
        fontSize: Pixel.getFontPixel(fontAndColor.CONTENTFONT),
        textAlign: 'center',
    },
    cityContainer:{
        backgroundColor: 'white',
        top: Pixel.getPixel(184),
        bottom: 0,
        position: 'absolute',
        width: SceneWidth * 0.8,
        borderLeftWidth: 2,
        borderLeftColor: fontAndColor.COLORA3,
    },
    districtContainer:{
        backgroundColor: 'white',
        top: Pixel.getPixel(184),
        bottom: 0,
        position: 'absolute',
        width: SceneWidth * 0.5,
        borderLeftWidth: 2,
        borderLeftColor: fontAndColor.COLORA3,
    }
});