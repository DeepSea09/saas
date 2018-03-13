import  React, {Component, PropTypes} from  'react'
import  {

    View,
    Text,
    ListView,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity
} from  'react-native'

import * as fontAndClolr from '../../constant/fontAndColor';
import  PixelUtil from '../../utils/PixelUtil'
import NavigationView from '../../component/AllNavigationView';
import BaseComponent from '../../component/BaseComponent';
var Pixel = new PixelUtil();
/*
 * 获取屏幕的宽和高
 **/
const {width, height} = Dimensions.get('window');

export default class SeeEmployeeInfoScene extends BaseComponent {
    // 构造
    constructor(props) {
        super(props);
        const {username, mobile, sex, company,role} = this.props;
        var Car = [
            {
                "cars": [
                    {
                        "title": "姓名",
                        "name": username
                    },
                    {
                        "title": "性别",
                        "name": sex
                    },

                ],
                "title": "section0"
            },
            {
                "cars": [
                    {
                        "title": "所属公司",
                        "name": company
                    },
                    {
                        "title": "角色",
                        "name": role
                    },
                ],
                "title": "section1"
            },
            {
                "cars": [
                    {
                        "title": "账号",
                        "name": mobile
                    },
                    {
                        "title": "密码",
                        "name": "********"
                    },
                    {
                        "title": "确认密码",
                        "name": "********"
                    },

                ],
                "title": "section2"
            },
        ]
        // 初始状态
        //    拿到所有的json数据
        var jsonData = Car;

        //    定义变量
        var dataBlob = {},
            sectionIDs = [],
            rowIDs = [];
        for (var i = 0; i < jsonData.length; i++) {
            //    1.拿到所有的sectionId
            sectionIDs.push(i);

            //    2.把组中的内容放入dataBlob内容中
            dataBlob[i] = jsonData[i].title;

            //    3.设置改组中每条数据的结构
            rowIDs[i] = [];

            //    4.取出改组中所有的数据
            var cars = jsonData[i].cars;

            //    5.便利cars,设置每组的列表数据
            for (var j = 0; j < cars.length; j++) {
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
        const ds = new ListView.DataSource({
                getSectionData: getSectionData,
                getRowData: getRowData,
                rowHasChanged: (r1, r2) => r1 !== r2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
            }
        );

        this.state = {
            source: ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs)

        };
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationView
                    title='员工信息'
                    backIconClick={this.backPage}
                />
                <ListView
                    removeClippedSubviews={false}
                    style={styles.listStyle}
                    dataSource={this.state.source}
                    renderRow={this._renderRow}
                    renderSectionHeader={this._renderSectionHeader}
                />

            </View>
        );
    }

    // 每一行中的数据
    _renderRow = (rowData) => {
        return (
            <View style={styles.rowView}>

                <Text allowFontScaling={false}  style={styles.rowLeftTitle}>{rowData.title}</Text>
                <Text allowFontScaling={false}  style={styles.rowRightTitle}>{rowData.name }</Text>

            </View>
        );
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
        backgroundColor: fontAndClolr.COLORA3,
    },
    listStyle: {
        marginTop: Pixel.getTitlePixel(64)
    },
    sectionView: {
        height: Pixel.getPixel(10),
        backgroundColor: fontAndClolr.COLORA3,
    },
    rowView: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomColor: fontAndClolr.COLORA4,
        borderBottomWidth: 1,
        flexDirection: 'row'
    },
    rowLeftTitle: {
        marginLeft: Pixel.getPixel(15),
        flex: 1,
        fontSize: Pixel.getFontPixel(fontAndClolr.LITTLEFONT28),
        color: fontAndClolr.COLORA0,

    },
    rowRightTitle: {
        marginRight: Pixel.getPixel(15),
        color: fontAndClolr.COLORA1,
        fontSize: Pixel.getFontPixel(fontAndClolr.LITTLEFONT28),

    },


});