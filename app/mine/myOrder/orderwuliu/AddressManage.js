import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View, TouchableOpacity, Dimensions, Image,ListView,RefreshControl
} from 'react-native';
import BaseComponent from '../../../component/BaseComponent';
import NavigatorView from '../../../component/AllNavigationView';
import AddressManageEditScene from '../../addressManage/AddressManageEditScene';

const {width} = Dimensions.get('window');
import * as FontAndColor from '../../../constant/fontAndColor';
import PixelUtil from '../../../utils/PixelUtil';
import MyButton from "../../../component/MyButton";
import PickUpInfo from './PickUpInfo';

const selected_icon = require('../../../../images/selected_icon.png');
const no_select_icon = require('../../../../images/no_select_icon.png');
const Pixel = new PixelUtil();
import {request} from '../../../utils/RequestUtil';
import * as Urls from '../../../constant/appUrls';
let allSouce=[];
let accountInfo = [];
let callBackInfo={};
export default class AddressManage extends BaseComponent {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            renderPlaceholderOnly: false,
            accountInfo: accountInfo,
            dataSource: this.ds.cloneWithRows(allSouce),
            isRefreshing: false,
        }
    }

    initFinish() {
        allSouce=[]
        this.getData();
    }

    getData = () => {
        let maps = {
            company_id:global.companyBaseID,
        };
        request(Urls.GET_FLOWSOTHER_LIST, 'Post', maps)
            .then((response) => {
                    accountInfo=[];
                    this.props.showModal(false);
                    if(response.mycode == 1){
                        allSouce.push(...response.mjson.data);
                        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        allSouce.map((data)=>{
                            //console.log('----1',data.id+'---'+this.props.addressId);
                            accountInfo.push({
                                contact_name:data.contact_name,
                                contact_phone:data.contact_phone,
                                full_address:data.full_address,
                                id:data.id,
                                is_default:data.id==this.props.addressId?1:0,
                                province: data.province,
                                city: data.city,
                                district: data.district,
                                is_port: data.is_port
                            })
                            callBackInfo={
                                full_address:data.full_address,
                                id:data.id,
                                province: data.province,
                                city: data.city,
                                district: data.district,
                                is_port: data.is_port,
                                contact_name:data.contact_name,
                                contact_phone:data.contact_phone,
                            }
                        })
                        this.setState({
                            dataSource: ds.cloneWithRows(accountInfo),
                            isRefreshing: false,
                            renderPlaceholderOnly: 'success'
                        });
                    }else{
                        this.setState({renderPlaceholderOnly: 'error'});
                    }
                },
                (error) => {
                    this.props.showModal(false);
                    this.setState({renderPlaceholderOnly: 'error', isRefreshing: false});
                });
    };
    refreshingData = () => {
        allSouce = [];
        this.setState({isRefreshing: true});
        this.getData();
    };

    allRefresh = () => {
        this.setState({
            renderPlaceholderOnly: 'loading',
        });
        this.getData();
    }


    itemClick = (index) => {
        accountInfo.map((data) => {
            data.is_default = 0;
        })
        callBackInfo={
            full_address:accountInfo[index].full_address,
            id:accountInfo[index].id,
            province: accountInfo[index].province,
            city: accountInfo[index].city,
            district: accountInfo[index].district,
            is_port: accountInfo[index].is_port,
            contact_name:accountInfo[index].contact_name,
            contact_phone:accountInfo[index].contact_phone,
        }
        accountInfo[index].is_default = 1;
        this.setState({
            dataSource: this.ds.cloneWithRows(accountInfo),
        });

    }
    _renderRow=(data,s,index)=>{
        return (
            <TouchableOpacity key={index + 'accountInfo'} activeOpacity={0.8} onPress={() => {
                this.itemClick(index);
            }}>
                <View style={[{
                    justifyContent: 'center', borderBottomWidth: Pixel.getPixel(1),
                    borderColor: FontAndColor.COLORA4,
                    backgroundColor: 'white',
                    paddingBottom:Pixel.getPixel(15)
                }]}>
                    <View style={styles.content_title_text_wrap}>
                        <Image source={data.is_default==1 ? selected_icon : no_select_icon}
                               style={{marginRight: Pixel.getPixel(15)}}/>
                        <Text style={styles.content_title_text}>{data.contact_name}</Text>
                        <Text style={styles.content_base_Right}>{data.contact_phone}</Text>
                    </View>
                    <Text style={styles.address_text}>{data.full_address}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    _renderItem = () => {
        return (
            <View style={{flex: 1}}>

                <View style={{
                    backgroundColor: 'white',
                    paddingHorizontal: Pixel.getPixel(15)
                }}>
                    <ListView
                        dataSource={this.state.dataSource}
                        removeClippedSubviews={false}
                        renderRow={this._renderRow}
                        enableEmptySections={true}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this.refreshingData}
                                tintColor={[FontAndColor.COLORB0]}
                                colors={[FontAndColor.COLORB0]}
                            />
                        }
                    />

                </View>

                <MyButton buttonType={MyButton.TEXTBUTTON}
                          content={'新增管理'}
                          parentStyle={styles.loginBtnStyle}
                          childStyle={styles.loginButtonTextStyle}
                          mOnPress={() => {
                              this.toNextPage({
                                  component:AddressManageEditScene,
                                  name:'AddressManageEditScene',
                                  params:{item:{},refreshData:this.refreshingData}
                              });
                          }}/>
            </View>
        );

    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return ( <View style={styles.container}>
                {this.loadView()}
                <NavigatorView title='地址管理' backIconClick={this.backPage}/>
            </View>);
        } else {
            return (<View style={styles.container}>
                <View style={{flex: 1, marginTop: Pixel.getTitlePixel(65),}}>
                    {
                        this._renderItem()
                    }
                </View>
                <NavigatorView title='地址管理' backIconClick={this.backPage} renderRihtFootView={this.renderRightView}/>
            </View>)
        }

    }

    renderRightView = () => {
        return (
            <TouchableOpacity onPress={
                () => {
                    this.backPage();
                    this.props.callBack(callBackInfo);
                }
            }>
                <View style={{
                    marginLeft: Pixel.getPixel(20),
                    width: Pixel.getPixel(80),
                    height: Pixel.getPixel(40),
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text allowFontScaling={false}
                          style={{color: 'white', fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT30)}}>完成</Text>
                </View>
            </TouchableOpacity>
        )


    }


}

const styles = StyleSheet.create({
    container: {
        backgroundColor: FontAndColor.COLORA3,
        flex: 1,
    },
    content_title_text_wrap: {
        height: Pixel.getPixel(42),
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    content_title_text: {
        flex: 1,
        fontSize: Pixel.getFontPixel(15),
        color: 'black',
    },
    content_base_text_wrap: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: Pixel.getPixel(1),
        borderColor: FontAndColor.COLORA4,
        marginHorizontal: Pixel.getPixel(15)
    },
    content_base_Right: {
        fontSize: Pixel.getFontPixel(15),
        color: 'black',
        textAlign: 'right'
    },
    image: {
        marginLeft: Pixel.getPixel(10),
    },
    loginBtnStyle: {
        height: Pixel.getPixel(44),
        width: width - Pixel.getPixel(30),
        backgroundColor: FontAndColor.COLORB0,
        marginTop: Pixel.getPixel(10),
        position:'absolute',
        bottom:Pixel.getPixel(10),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Pixel.getPixel(4),
        marginLeft: Pixel.getPixel(15)
    },
    loginButtonTextStyle: {
        color: FontAndColor.COLORA3,
        fontSize: Pixel.getFontPixel(FontAndColor.BUTTONFONT)
    },
    address_text: {
        fontSize: Pixel.getFontPixel(15),
        color: FontAndColor.COLORA1,
        flexWrap: 'wrap'
    },
});
