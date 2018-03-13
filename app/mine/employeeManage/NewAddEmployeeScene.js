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
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../constant/fontAndColor';
import BaseComponent from '../../component/BaseComponent';
import NavigationView from '../../component/AllNavigationView';
import md5 from "react-native-md5";
let childItems = [];
import {request} from '../../utils/RequestUtil';
import * as Urls from '../../constant/appUrls';
import StorageUtil from "../../utils/StorageUtil";
import * as StorageKeyNames from "../../constant/storageKeyNames";
import AddEmployeeInput from './component/AddEmployeeInput';
import SelectEmployeeInput from './component/SelectEmployeeInput';
import SelectTypeScene from './SelectTypeScene';
import SelectGenderScene from './SelectGenderScene';
import SelectCompanyScene from './SelectCompanyScene';
let comps = [];
export  default class BankCardScene extends BaseComponent {

    constructor(props) {
        super(props);
        childItems = [];
        comps = [];
        // 初始状态
        childItems.push({name: '姓名', value: ''});
        childItems.push({name: '性别', value: ''});
        childItems.push({name: '所属公司', value: []});
        childItems.push({name: '角色', value: []});
        childItems.push({name: '账号', value: ''});
        childItems.push({name: '密码', value: ''});
        childItems.push({name: '确认密码', value: ''});
        this.state = {
            renderPlaceholderOnly: 'blank',
        };
    }

    initFinish = () => {
        this.getData();
    }

    getData = () => {
        StorageUtil.mGetItem(StorageKeyNames.ENTERPRISE_LIST, (data) => {
            if (data.code == 1 && data.result != null) {
                comps = JSON.parse(data.result);
                this.setState({
                    renderPlaceholderOnly: 'success',
                });
            }
        })
    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        }
        let items = [];
        for (let i = 0; i < childItems.length; i++) {
            if (i == 1) {
                items.push(<SelectEmployeeInput ref='selectsex' key={i+'bo'} items={childItems[i]} toSelect={()=>{
                    this.toNextPage({name:'SelectTypeScene',component:SelectTypeScene,params:{regShowData:['男','女'],
                    title:'选择性别',callBack:(name,index)=>{
                        childItems[i].value = name+','+index;
                        this.refs.selectsex.setValue(name);
                    }}})
                }}/>);
            } else if (i == 2) {

                items.push(<SelectEmployeeInput ref="company" key={i+'bo'} items={childItems[i]} toSelect={()=>{
                    this.toNextPage({name:'SelectCompanyScene',component:SelectCompanyScene,params:{
                        comps:comps,
                    title:'选择公司',callBack:(selected)=>{
                        let names = '';
                        for(let i =0;i<selected.length;i++){
                            names = selected[i].enterprise_name+' '+names;
                        }
                        childItems[i].value = selected;
                        this.refs.company.setValue(names);
                    }}})
                }}/>);
            } else if (i == 3) {
                items.push(<SelectEmployeeInput ref='juese' key={i+'bo'} items={childItems[i]} toSelect={()=>{
                    this.toNextPage({name:'SelectGenderScene',component:SelectGenderScene,params:{
                    title:'选择角色',callBack:(selected)=>{
                        let names = '';
                        for(let i =0;i<selected.length;i++){
                            names = selected[i].role_name+' '+names;
                        }
                        childItems[i].value = selected;
                        this.refs.juese.setValue(names);
                    }}})
                }}/>);
            } else {
                items.push(<AddEmployeeInput key={i+'bo'} items={childItems[i]}/>);
            }

        }
        return (
            <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1}}>
                <ScrollView keyboardShouldPersistTaps={'handled'}
                            style={{marginTop: Pixel.getTitlePixel(79)}}
                >
                    {items}
                </ScrollView>
                <NavigationView
                    title="添加员工"
                    backIconClick={this.backPage}
                    renderRihtFootView={this._navigatorRightView}
                />
            </View>
        );
    }

    checkEmpty = () => {
        for (let i = 0; i < childItems.length; i++) {
            if (i == 2) {
                if (childItems[i].value.length <= 0) {
                    this.props.showToast(childItems[i].name + '不能为空');
                    return;
                }
            } else {
                if (childItems[i].value == '') {
                    this.props.showToast(childItems[i].name + '不能为空');
                    return;
                }
            }
        }
        if (childItems[5].value !== childItems[6].value) {
            this.props.showToast('两次输入密码不一致');
            return;
        }
        this.addEmployee();
    }
    addEmployee = () => {
        this.props.showModal(true);
        let company_ids = '';
        for (let i = 0; i < childItems[2].value.length; i++) {
            company_ids = childItems[2].value[i].enterprise_uid + ',' + company_ids;
        }
        let news = company_ids.substring(0, company_ids.length - 1);
        let role_ids = '';
        for (let i = 0; i < childItems[3].value.length; i++) {
            role_ids = childItems[3].value[i].role_id + ',' + role_ids;
        }
        let new_role_id = role_ids.substring(0, role_ids.length - 1);
        let maps = {
            account: childItems[4].value,
            company_ids: news,
            password: md5.hex_md5(childItems[5].value),
            repassword: md5.hex_md5(childItems[6].value),
            role_id: new_role_id,
            sex: childItems[1].value.split(',')[1],
            username: childItems[0].value
        };
        request(Urls.USER_EMPLOYEE_SAVE, 'Post', maps)
            .then((response) => {
                    this.props.showModal(false);
                    this.props.showToast('添加成功');
                    this.props.callBack();
                    this.backPage();
                },
                (error) => {
                    this.props.showModal(false);
                    if (error.mycode == -300 || error.mycode == -500) {
                        this.props.showToast('添加失败');
                    } else {
                        this.props.showToast(error.mjson.msg);
                    }
                });
    }

    _navigatorRightView = () => {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => {
                this.checkEmpty();
            }} style={{width:Pixel.getPixel(53),height:Pixel.getPixel(27),backgroundColor: '#fff',
            justifyContent:'center',alignItems: 'center'}}>
                <Text allowFontScaling={false}
                      style={{fontSize: Pixel.getFontPixel(15),color:fontAndColor.COLORB0}}>完成</Text>
            </TouchableOpacity>
        );
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor: fontAndColor.COLORA3}}>
                {this.loadView()}
                <NavigationView
                    title="添加员工"
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
        height: Pixel.getPixel(10),

    },
    margin: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)

    },
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'}
})