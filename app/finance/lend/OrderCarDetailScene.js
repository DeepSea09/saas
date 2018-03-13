/**
 * Created by lhc on 2017/3/3.
 */


import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ListView,
    Image,
    Text
} from 'react-native';
import {CommnetListItem, LendCarItemCell, CommenButton,commnetStyle,ComentImageButton} from './component/ComponentBlob'
import {width, height, fontadapeSize, adapeSize,STATECODE,PAGECOLOR,getRowData,getSectionData,changeToMillion} from './component/MethodComponent'
import  AllNavigationView from '../../component/AllNavigationView';
import BaseComponent from '../../component/BaseComponent';
import {request} from '../../utils/RequestUtil'
import *as apis from '../../constant/appUrls'
import ImagePageView from 'react-native-viewpager'

const ImageSouce= {

    imageSouce:[]

}
export default class OrderCarDetailScene extends BaseComponent{

    constructor(props) {
        super(props);
        // 初始状态
        const ds = new ListView.DataSource(
            {
                getRowData: getRowData,
                getSectionHeaderData: getSectionData,
                rowHasChanged: (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
            }
        )//
        const ImageData = new ImagePageView.DataSource({pageHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRowsAndSections(this.titleNameBlob({},[])),
            renderPlaceholderOnly: STATECODE.loading,
            imagePikerData: ImageData.cloneWithPages([])
        }
    }

    initFinish() {

        this.getCarInfo();
    }

    getCarInfo=()=>{

        let maps = {
            api: apis.GET_CAR_INFO,
            auto_id: this.props.auto_id,
            type:this.props.type

        };
        request(apis.FINANCE, 'Post', maps)
            .then((response) => {

                    let tempjson = response.mjson.data

                    tempjson.img_list.map((item)=>{

                        ImageSouce.imageSouce.push(item.fileurl)
                    })


                    this.setState({
                        renderPlaceholderOnly: STATECODE.loadSuccess,
                        dataSource:this.state.dataSource.cloneWithRowsAndSections(this.titleNameBlob(tempjson,tempjson.img_list)),
                        imagePikerData:this.state.imagePikerData.cloneWithPages(ImageSouce.imageSouce),
                    })
                },
                (error) => {
                    this.setState({
                        renderPlaceholderOnly:STATECODE.loadError,
                    })
                    if(error.mycode!= -300||error.mycode!= -500){
                        this.props.showToast(error.mjson.msg);

                    }else {
                        this.props.showToast('服务器连接有问题')

                    }
                });
    }


    titleNameBlob=(jsonData,carData)=>{

        let dataSource = {};
        let section1=[
            {title: '评估日期', key: jsonData.reassessed_time},
            {title:'评估师',key:jsonData.reassessed_username},
            {title: '车型', key: jsonData.model_name},
            {title: '车牌号', key: jsonData.plate_number},
            {title: '车架号', key: jsonData.frame_number},
            {title: '车身颜色', key: jsonData.car_color},
            {title: '内饰颜色', key: jsonData.trim_color},
            {title: '监管地点',     key: jsonData.rp_name},
            {title: '评估金额', key: changeToMillion(jsonData.lend_mny)+'万元'},
            {title: '放款金额', key: changeToMillion(jsonData.loan_mny_fk)+'万元'},
            {title: '在库天数', key: jsonData.library_day+'天'},
        ]
        if (jsonData.isextension==='1'){

            section1.push({title: '保证金', key: jsonData.bondmny},{title: '保证金状态', key: jsonData.bond_status_str})
        }


        dataSource['section1']=section1
        if(carData.length>0){
            dataSource['section2']=carData;
        }

        return dataSource;
    }

    renderImagePage=(data,pageId)=>{

        return (
            <Image source={{uri:data}} style={{ backgroundColor:'white', height: adapeSize(250), width:width}}/>
        )

    }

    renderRow = (rowData, sectionID, rowId, highlightRow) => {


        if (sectionID === 'section2') {
            if(rowId==='0'){

                return(
                    <ImagePageView
                    dataSource={this.state.imagePikerData}    //数据源（必须）
                    renderPage={this.renderImagePage}     //page页面渲染方法（必须）
                    isLoop={false}                        //是否可以循环
                    autoPlay={false}                      //是否自动
                    locked={false}                        //为true时禁止滑动翻页
                />)

            }else {

                return null;
            }
        }
        return (
            <CommnetListItem textStyle={rowData.title === '评估日期' ? {color: PAGECOLOR.COLORB2} : null} leftTitle={rowData.title} showValue={rowData.key}/>
        );
    }
    renderSectionHeader = (sectionData, sectionID) => {

        if(sectionID==='section2'){
            return (

                <View style={ {backgroundColor:PAGECOLOR.COLORA3, height:adapeSize(20),alignItems:'flex-start',justifyContent:'center'}}>
                    <Text allowFontScaling={false}  style={{marginLeft:adapeSize(15)}}>车辆照片</Text>
                </View>
            )
        }

        return null;

    }
    renderSeparator =(sectionID,rowId,adjacentRowHighlighted)=>{

        let separtrorHegigth =1;
        if (rowId==='1'){
            separtrorHegigth=10;
        }
        return (
            <View key={`${sectionID}-${rowId}`} style={{
                height:adjacentRowHighlighted?2:separtrorHegigth,
                backgroundColor:PAGECOLOR.COLORA3
            }}>
            </View>
        )
    }

    render(){

        if(this.state.renderPlaceholderOnly!==STATECODE.loadSuccess)
        {
            return(
                <View style={styles.container}>
                    {this.loadView()}
                    <AllNavigationView title='车辆详情' backIconClick={()=>{
                        this.backPage();
                    }}/>
                </View>);
        }
        return(
            <View style={styles.container}>
            <ListView
                removeClippedSubviews={false}
                style={{marginTop:64}}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}
                renderSeparator={this.renderSeparator}
                renderSectionHeader={this.renderSectionHeader}
            />
            <AllNavigationView title='车辆详情' backIconClick={()=>{ this.backPage();}}/>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {

        flex: 1,
        backgroundColor: PAGECOLOR.COLORA3
    },
})
