import React, {Component, PureComponent} from 'react';
import {
    AppRegistry,
    View,
    TouchableOpacity,
    Text,
    Image,
    StyleSheet,
    Dimensions,
} from 'react-native';

let {height, width} = Dimensions.get('window');
import  PixelUtil from '../../utils/PixelUtil'
import  * as fontAndColor from '../../constant/fontAndColor'
var Pixel = new PixelUtil();
import HomeJobButton from './HomeJobButton';
import GetPermissionUtil from '../../utils/GetPermissionUtil';
const GetPermission = new GetPermissionUtil();
export default class HomeJobItem extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            show: false
        }
    }

    componentWillMount() {
        GetPermission.getLastList((preList) => {
            this.list = preList;
            this.setState({show: true});
        });
    }

    render() {
        if(this.state.show==false){
            return <View></View>
        }
        let firstChild = [];
        let lastChild = [];
        for (let i = 0; i < this.list.length; i++) {
            if (i >= 8) {
                break;
            }
            if (i < 4) {
                firstChild.push(<HomeJobButton key={'job'+i} image={this.list[i].image} name={this.list[i].name}
                                               click={()=>{
                                                   if(this.list[i].componentName){
                                                       this.props.callBack(
                                                           {    name:this.list[i].componentName,
                                                                id:this.list[i].id,
                                                                component:this.list[i].component,
                                                               params:{}
                                                           }
                                                       )
                                                   }else{
                                                       this.list[i].pushAction();
                                                   }
                                                  }
                                               }/>);
            } else {
                if (i > 6 && this.list.length > 8) {
                    lastChild.push(<HomeJobButton key={'job'+i} image={require('../../../images/workbench/gd.png')}
                                                  name='更多'
                                                  click={()=>{this.props.jumpScene('sendpage','a')}}/>);
                } else {
                    lastChild.push(<HomeJobButton key={'job'+i} image={this.list[i].image} name={this.list[i].name}
                                                  click={()=>{if(this.list[i].componentName){
                                                      this.props.callBack(
                                                          { name:this.list[i].componentName,
                                                              id:this.list[i].id,
                                                              component:this.list[i].component,params:{}
                                                          }
                                                      )
                                                  }else{
                                                      this.list[i].pushAction();
                                                  }
                                                  }}/>);

                }

            }
        }
        let itemList = [];
        itemList.push(<View key={'view1'} style={[{marginTop:Pixel.getPixel(27),width:width,
        flexDirection: 'row'},this.list.length > 4?{}:{marginBottom:Pixel.getPixel(20)}]}>
            {firstChild}
        </View>);
        if (this.list.length > 4) {
            itemList.push(<View key={'view2'} style={{marginTop:Pixel.getPixel(27),marginBottom:Pixel.getPixel(20),
            width:width,flexDirection: 'row'}}>
                {lastChild}
            </View>)
        }
        return (
            <View style={{width:width,backgroundColor:fontAndColor.COLORA3}}>
                <View style={{width:width,backgroundColor:'#fff',
                marginBottom:Pixel.getPixel(10)}}>
                    {itemList}
                </View>
            </View>

        );
    }
}