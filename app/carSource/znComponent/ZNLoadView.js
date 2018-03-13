/**
 * Created by zhengnan on 17/2/28.
 */

import React, {Component} from 'react';
import {

    StyleSheet,
    View,
    Modal,

} from 'react-native';

import Spinner  from 'react-native-spinkit';

export default class  ZNLoadView extends  Component{

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {

            visible:false,
        };
      }

    visibleClick =(visible)=> {

        this.setState({
            visible:visible,
        });
    }

    getVisible=()=>{

        return this.state.visible;
    }

    render(){
        return(
            <Modal visible={this.state.visible}
                   transparent={true}>
                <View style={styles.rootContaier}>
                    <Spinner isVisible={this.props.isLoadData} size={50} type={'Wave'} color={"#05c5c2"}/>
                </View>
            </Modal>
        )
    }

}


const  styles = StyleSheet.create({

    rootContaier:{
        flex:1,
        backgroundColor:'rgba(1,1,1,0.2)',
        alignItems:'center',
        justifyContent:'center'}


});