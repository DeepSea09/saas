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
import MyButton from '../../component/MyButton';
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
        childItems.push({name: '注销', value: ''});
        this.state = {
            renderPlaceholderOnly: 'blank',
        };
    }

    initFinish = () => {
        this.getData();
    }

    getData = () => {
        let maps = {
            staff_id: this.props.id
        };
        request(Urls.USER_EMPLOYEE_VIEW, 'Post', maps)
            .then((response) => {
                    StorageUtil.mGetItem(StorageKeyNames.ENTERPRISE_LIST, (data) => {
                        if (data.code == 1 && data.result != null) {
                            comps = JSON.parse(data.result);
                            this.getRoleData(response.mjson.data);
                        }
                    })
                },
                (error) => {
                    if (error.mycode == '-2100045' || error.mycode == '-1') {
                        this.setState({renderPlaceholderOnly: 'null'});
                    } else {
                        this.setState({renderPlaceholderOnly: 'error'});
                    }
                });
    }

    getRoleData = (data) => {
        let maps = {};
        request(Urls.USER_ROLE, 'Post', maps)
            .then((response) => {
                    let newComps = [];
                    let role_ids = [];
                    for (let i = 0; i < data.company.length; i++) {
                        for (let j = 0; j < comps.length; j++) {
                            if (data.company[i].company_id == comps[j].enterprise_uid) {
                                newComps.push(comps[j]);
                            }
                        }
                        if (i === 0) {
                            role_ids = data.company[i].role_ids;
                        }
                    }
                    let newRole = [];
                    //let role_ids = (data.company.role_id + '').split(',');
                    for (let i = 0; i < role_ids.length; i++) {
                        for (let j = 0; j < response.mjson.data.length; j++) {
                            if (role_ids[i] == response.mjson.data[j].role_id) {
                                newRole.push(response.mjson.data[j]);
                            }
                        }
                    }
                    childItems[0].value = data.base.username;
                    childItems[1].value = data.base.sex;
                    childItems[2].value = newComps;
                    childItems[3].value = newRole;
                    childItems[4].value = data.base.account;
                    childItems[5].value = '';
                    childItems[6].value = '';

                    this.setState({
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
        if (this.state.renderPlaceholderOnly !== 'success') {
            return this._renderPlaceholderView();
        }
        let items = [];
        for (let i = 0; i < childItems.length; i++) {
            if (i == 7) {
                items.push(<MyButton key={i+'bo'} buttonType={MyButton.TEXTBUTTON}
                                     content={'注销'}
                                     parentStyle={styles.loginBtnStyle}
                                     childStyle={styles.loginButtonTextStyle}
                                     mOnPress={()=>{
                                         this.deleteData();
                                     }}/>);
            } else if (i == 1) {
                let sex = '';
                if (childItems[i].value == 1) {
                    sex = '男';
                } else if (childItems[i].value == 2) {
                    sex = '女';
                } else {
                    sex = childItems[i].value;
                }
                items.push(<SelectEmployeeInput default={sex} ref='selectsex' key={i+'bo'}
                                                items={childItems[i]} toSelect={()=>{
                    this.toNextPage({name:'SelectTypeScene',component:SelectTypeScene,params:{regShowData:['男','女'],
                    title:'选择性别',callBack:(name,index)=>{
                        childItems[i].value =index;
                        this.refs.selectsex.setValue(name);
                    }}})
                }}/>);
            } else if (i == 2) {
                let compony = '';
                for (let j = 0; j < childItems[i].value.length; j++) {
                    compony = childItems[i].value[j].enterprise_name + ' ' + compony;
                }
                items.push(<SelectEmployeeInput default={compony} ref="company" key={i+'bo'} items={childItems[i]}
                                                toSelect={()=>{
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
                let roles = '';
                for (let j = 0; j < childItems[i].value.length; j++) {
                    roles = childItems[i].value[j].role_name + ' ' + roles;
                }
                items.push(<SelectEmployeeInput default={roles} ref='juese' key={i+'bo'} items={childItems[i]} toSelect={()=>{
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
                items.push(<AddEmployeeInput default={childItems[i].value} key={i+'bo'} items={childItems[i]}/>);
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
                    title="编辑员工"
                    backIconClick={this.backPage}
                    renderRihtFootView={this._navigatorRightView}
                />
            </View>
        );
    }

    deleteData = () => {
        this.props.showModal(true);
        request(Urls.USER_EMPLOYEE_DESTROY, 'post', {
            staff_id: this.props.id,

        }).then((response) => {
            if (response.mjson.code == '1') {
                this.props.showToast("注销成功");
                this.props.callBack();
                this.backPage();
            } else {
                this.props.showToast(response.mjson.msg);
            }

        }, (error) => {


        });

    }

    checkEmpty = () => {
        for (let i = 0; i < childItems.length; i++) {
            if (childItems[i].name == '注销') {
                continue;
            }
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
            //sex: childItems[1].value.split(',')[1],
            sex: childItems[1].value,
            username: childItems[0].value,
            staff_id: this.props.id
        };
        request(Urls.USER_EMPLOYEE_SAVE, 'Post', maps)
            .then((response) => {
                    this.props.showToast('添加成功');
                    this.props.callBack();
                    this.backPage();
                },
                (error) => {
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
                    title="编辑员工"
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
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'},
    loginBtnStyle: {
        height: Pixel.getPixel(44),
        width: width - Pixel.getPixel(30),
        backgroundColor: fontAndColor.COLORB2,
        marginTop: Pixel.getPixel(30),
        marginBottom: Pixel.getPixel(30),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Pixel.getPixel(4),
        marginLeft: Pixel.getPixel(15)
    },
    loginButtonTextStyle: {
        color: fontAndColor.COLORA3,
        fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT)
    },

})