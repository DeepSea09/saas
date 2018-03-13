import React, {Component, PropTypes} from "react";
import {
    View,
    Text,
    ListView,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView
} from "react-native";
import * as FontAndColor from "../../constant/fontAndColor";
import PixelUtil from "../../utils/PixelUtil";
import SelectMaskComponent from "./SelectMaskComponent";
import SelectMaskComponent1 from "./SelectMaskComponent1";
import BaseComponent from "../../component/BaseComponent";
import * as AppUrls from "../../constant/appUrls";
import {request} from "../../utils/RequestUtil";
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";
import md5 from "react-native-md5";
import NavigationBar from "../../component/NavigationBar";
const cellJianTou = require('../../../images/mainImage/celljiantou.png');
let ROWID = 0;
let ds = {};
let SECTIONID = 0;
let Pixel = new PixelUtil();

const {width, height} = Dimensions.get('window');
var Car = [];

export default class AddEmployeeScene extends BaseComponent {
    initFinish = () => {
    }
    saveData = () => {
        this.company_idss=[];
        this.props.showModal(true);
        this.isClick = false;
        if (this.items.length > 0) {

            for (let value of this.items) {

                this.company_idss.push(this.company_ids[value]);
            }
        }
        let url = AppUrls.BASEURL + 'v1/user.employee/save';
        request(url, 'post', {
            account: Car[2].cars[0].name,
            company_ids: this.company_idss.toString(),
            password: md5.hex_md5(Car[2].cars[1].name),
            repassword: md5.hex_md5(Car[2].cars[1].name),
            role_id: this.roleId,   //角色ID【必填】	number	1：实际控制人 2：财务 3：收车人员 4：销售人员
            sex: this.sex,//number	1：男（默认）；2：女
            username: Car[0].cars[0].name

        }).then((response) => {
            this.props.showModal(false);
            if (response.mjson.code == '1') {
                this.props.showToast("提交成功");
                if (this.props.callBack) {
                    this.props.callBack();
                }
                this.backPage();
                this.isClick = true;
            } else {
                this.props.showToast(response.mjson.msg);
            }

        }, (error) => {
            this.props.showModal(false);
            this.isClick = true;
            this.props.showToast(error.mjson.msg);

        });

    }

    // 构造
    constructor(props) {
        Car = [
            {
                "cars": [
                    {
                        "title": "姓名",
                        "name": ''
                    },
                    {
                        "title": "性别",
                        "name": ''
                    },

                ],
                "title": "section0"
            },
            {
                "cars": [
                    {
                        "title": "所属公司",
                        "name": ''
                    },
                    {
                        "title": "角色",
                        "name": ''
                    },
                ],
                "title": "section1"
            },
            {
                "cars": [
                    {
                        "title": "账号",
                        "name": ''
                    },
                    {
                        "title": "密码",
                        "name": ""
                    },
                    {
                        "title": "确认密码",
                        "name": ""
                    },

                ],
                "title": "section2"
            },
        ]
        super(props);
        this.companys = [];
        this.company_ids = [];
        this.company_idss = [];
        this.items = [];
        this.roleId = '';
        this.sex = '';
        this.isClick = true;

        StorageUtil.mGetItem(StorageKeyNames.ENTERPRISE_LIST, (data) => {
            if (data.code == 1 && data.result != null) {
                this.comps = JSON.parse(data.result);
                for (let value of JSON.parse(data.result)) {
                    this.companys.push(value.enterprise_name);
                    this.company_ids.push(value.enterprise_uid);
                }
            }
        })
        // 初始状态
        //    拿到所有的json数据
        let jsonData = Car;

        //    定义变量
        let dataBlob = {},
            sectionIDs = [],
            rowIDs = [];
        for (let i = 0; i < jsonData.length; i++) {
            //    1.拿到所有的sectionId
            sectionIDs.push(i);

            //    2.把组中的内容放入dataBlob内容中
            dataBlob[i] = jsonData[i].title;

            //    3.设置改组中每条数据的结构
            rowIDs[i] = [];

            //    4.取出改组中所有的数据
            let cars = jsonData[i].cars;

            //    5.便利cars,设置每组的列表数据
            for (let j = 0; j < cars.length; j++) {
                //    改组中的每条对应的rowId
                rowIDs[i].push(j);

                // 把每一行中的内容放入dataBlob对象中
                dataBlob[i + ':' + j] = cars[j];
            }
        }

        let getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];
        };

        let getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[sectionID + ":" + rowID];
        };
        ds = new ListView.DataSource({
                getSectionData: getSectionData,
                getRowData: getRowData,
                rowHasChanged: (r1, r2) => r1 !== r2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
            }
        );

        this.xb = ['男', '女',];
        this.gongneng = this.props.roleList;
        // this.gongneng2 = ['管理员','财务','员工'];
        this.state = {
            source: ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
            maskSource: this.xb,
            rowdata: null,

        };
    }


    render() {
        return (
            <View style={styles.container}>

                <NavigationBar
                    leftImageShow={true}
                    leftTextShow={false}
                    leftText={""}
                    centerText={"添加员工"}
                    rightText={"完成"}
                    leftImageCallBack={this.backPage}
                    rightTextStyle={{
                        color: FontAndColor.COLORB0,
                        borderRadius: Pixel.getPixel(2),
                        backgroundColor: '#ffffff',
                        marginRight: Pixel.getPixel(15),
                        marginLeft: Pixel.getPixel(15),
                        width: Pixel.getPixel(53),
                        textAlign: 'center',
                        paddingLeft: 0,
                        paddingRight: 0,
                        paddingTop: Pixel.getPixel(3),
                        paddingBottom: Pixel.getPixel(3),
                    }}
                    rightTextCallBack={() => {
                        if (this.isClick) {
                            this._completedForEdit();
                        }
                    }}
                />

                {/*              蒙版选择器        */}
                <SelectMaskComponent viewData={[]} onClick={(rowID) => this._onClick(rowID)}
                                     ref={(modal) => {
                                         this.selectModal = modal
                                     }}
                />
                {/*              蒙版选择器        */}
                <SelectMaskComponent1 viewData={[]} onClick={(rowID) => this.onClickCompany(rowID)}
                                      ref={(modal) => {
                                          this.selectModal1 = modal
                                      }}
                />

                    <ListView
                        removeClippedSubviews={false}
                        style={styles.listStyle}
                        dataSource={this.state.source}
                        renderRow={this._renderRow}
                        renderSectionHeader={this._renderSectionHeader}/>
            </View>
        );
    }

    /**      导航栏完成按钮点击事件          */
    _completedForEdit = () => {
        for (let i = 0; i < Car.length; i++) {
            let cars = Car[i].cars;
            for (let j = 0; j < cars.length; j++) {
                if (cars[j].name <= 0) {
                    this.props.showToast("请输入" + Car[i].cars[j].title);
                    return;
                }
            }
        }
        if (Car[2].cars[0].name.length != 11) {
            this.props.showToast("请输入正确的用户名");
        } else if (Car[2].cars[1].name.length < 6) {
            this.props.showToast("密码必须为6~16位");
        } else if (Car[2].cars[1].name !== Car[2].cars[2].name) {
            this.props.showToast("两次输入的密码不同");
        } else {
            this.saveData()
        }


    }

    /**      row的点击事件          */
    _rowAndSectionClick = (rowID, sectionID) => {
        ROWID = rowID;
        SECTIONID = sectionID;
        if (sectionID === 0 && rowID === 1) {
            this._openModal(this.xb);
        } else if (sectionID === 1 && rowID === 0) {
            this._openModal1(this.comps);
        } else if (sectionID === 1 && rowID === 1) {
            this._openModal(this.gongneng);
        }
    }

    _openModal = (dt, rowId, sectionID) => {
        this.selectModal.changeData(dt);
        this.selectModal.openModal();
        this.currentData = dt;
        if (SECTIONID === 1 && ROWID === 0) {
            // this.selectModal.isCompanys();
        }
    }
    _openModal1 = (dt, rowId, sectionID) => {
        this.selectModal1.changeData(dt);
        this.selectModal1.openModal();
        this.currentData = dt;
        if (SECTIONID === 1 && ROWID === 0) {
            // this.selectModal.isCompanys();
        }
    }
    onClickCompany = (itemIds) => {
        if (SECTIONID === 1 && ROWID === 0) {
            if (itemIds.length > 0) {

                Car[SECTIONID].cars[ROWID].name = this.companys[itemIds[0]];
                this.items = itemIds;
            }
        }
        console.log(this.items);
        let jsonData = Car;

        //    定义变量
        let dataBlob = {},
            sectionIDs = [],
            rowIDs = [];
        for (let i = 0; i < jsonData.length; i++) {
            //    1.拿到所有的sectionId
            sectionIDs.push(i);

            //    2.把组中的内容放入dataBlob内容中
            dataBlob[i] = jsonData[i].title;

            //    3.设置改组中每条数据的结构
            rowIDs[i] = [];

            //    4.取出改组中所有的数据
            let cars = jsonData[i].cars;

            //    5.便利cars,设置每组的列表数据
            for (let j = 0; j < cars.length; j++) {
                //    改组中的每条对应的rowId
                rowIDs[i].push(j);

                // 把每一行中的内容放入dataBlob对象中
                dataBlob[i + ':' + j] = cars[j];
            }
        }

        let getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];
        };

        let getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[sectionID + ":" + rowID];
        };
        ds = new ListView.DataSource({
                getSectionData: getSectionData,
                getRowData: getRowData,
                rowHasChanged: (r1, r2) => r1 !== r2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
            }
        );

        this.setState({
            source: ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
        });
    }
    /**      蒙版listview  点击选择,返回点击cell的id          */
    _onClick = (rowID) => {
        if (SECTIONID === 0 && ROWID === 1) {

            this.sex = parseInt(rowID) + 1 + '';
        } else if (SECTIONID === 1 && ROWID === 1) {

            for(let value of this.props.roleData){

                if(value.role_name==this.props.roleList[rowID]){

                    this.roleId = value.role_id;
                }
            }
        }
        Car[SECTIONID].cars[ROWID].name = this.currentData[rowID];


        let jsonData = Car;

        //    定义变量
        let dataBlob = {},
            sectionIDs = [],
            rowIDs = [];
        for (let i = 0; i < jsonData.length; i++) {
            //    1.拿到所有的sectionId
            sectionIDs.push(i);

            //    2.把组中的内容放入dataBlob内容中
            dataBlob[i] = jsonData[i].title;

            //    3.设置改组中每条数据的结构
            rowIDs[i] = [];

            //    4.取出改组中所有的数据
            let cars = jsonData[i].cars;

            //    5.便利cars,设置每组的列表数据
            for (let j = 0; j < cars.length; j++) {
                //    改组中的每条对应的rowId
                rowIDs[i].push(j);

                // 把每一行中的内容放入dataBlob对象中
                dataBlob[i + ':' + j] = cars[j];
            }
        }

        let getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];
        };

        let getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[sectionID + ":" + rowID];
        };
        ds = new ListView.DataSource({
                getSectionData: getSectionData,
                getRowData: getRowData,
                rowHasChanged: (r1, r2) => r1 !== r2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
            }
        );

        this.setState({
            source: ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
        });
    }


    // 每一行中的数据
    _renderRow = (rowData, sectionID, rowID) => {
        let HIDDEN;
        let PASSWORD;
        if ((sectionID === 0 && rowID === 0) || sectionID === 2) {
            HIDDEN = false;
        }
        else {
            HIDDEN = true;
        }

        if ((sectionID === 2 && rowID === 1) || (sectionID === 2 && rowID === 2)) {
            PASSWORD = true;
        }
        else {
            PASSWORD = false;
        }

        return (
            <TouchableOpacity onPress={() => this._rowAndSectionClick(rowID, sectionID)
            }>
                <View style={styles.rowView}>

                    <Text allowFontScaling={false}  style={styles.rowLeftTitle}>{rowData.title}</Text>
                    {HIDDEN ? <Text allowFontScaling={false} 
                            style={[styles.rowRightTitle,]}>{this.state.rowdata ? this.state.rowdata : rowData.name}</Text> :
                        <TextInput ref={sectionID + rowID} defaultValue={rowData.name}
                                   placeholder={"请输入" + rowData.title } style={styles.inputStyle}
                                   onChangeText={(text) => this._textChange(sectionID, rowID, text)}
                                   secureTextEntry={PASSWORD}
                                   underlineColorAndroid={"#00000000"}

                        />}


                    <Image source={cellJianTou} style={styles.rowjiantouImage}/>


                </View>
            </TouchableOpacity>
        );
    }
    _textChange = (sectionID, rowID, text) => {
        ROWID = rowID;
        SECTIONID = sectionID;
        Car[SECTIONID].cars[ROWID].name = text;
    }
    // 每一组对应的数据
    _renderSectionHeader(sectionData, sectionId) {
        return (
            <View style={styles.sectionView}>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {

        flex: 1,
        marginTop: Pixel.getPixel(0),   //设置listView 顶在最上面
        backgroundColor: FontAndColor.COLORA3,
    },
    listStyle: {
        // marginTop: Pixel.getTitlePixel(64)
    },
    sectionView: {
        height: Pixel.getPixel(10),
        backgroundColor: FontAndColor.COLORA3,
    },
    rowView: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomColor: FontAndColor.COLORA4,
        borderBottomWidth: 1,
    },
    rowLeftTitle: {
        marginLeft: Pixel.getPixel(15),
        width: Pixel.getPixel(60),
        fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT28),
        color: FontAndColor.COLORA0,

    },
    rowRightTitle: {
        flex: 1,
        marginRight: Pixel.getPixel(5),
        color: FontAndColor.COLORA1,
        fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT28),
        textAlign: 'right',


    },
    inputStyle: {
        flex: 1,
        marginRight: Pixel.getPixel(5),
        textAlign: 'right',
        fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT28),
        color: FontAndColor.COLORA1,
    },
    rowjiantouImage: {
        width: Pixel.getPixel(12),
        height: Pixel.getPixel(12),
        marginRight: Pixel.getPixel(15),

    },
    loginBtnStyle: {
        height: Pixel.getPixel(44),
        width: width - Pixel.getPixel(30),
        backgroundColor: FontAndColor.COLORB2,
        marginTop: Pixel.getPixel(30),
        marginBottom: Pixel.getPixel(30),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Pixel.getPixel(4),
        marginLeft: Pixel.getPixel(15)
    },
    loginButtonTextStyle: {
        color: FontAndColor.COLORA3,
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT)
    },


});