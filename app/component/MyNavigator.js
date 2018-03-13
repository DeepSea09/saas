import React, {Component} from 'react';
import {
    AppRegistry,
    View,
    TouchableOpacity,
    Navigator,
    TouchableHighlight
} from 'react-native';
var Platform = require('Platform');
import RootScene from '../main/RootScene';
import {setAll} from '../constant/AllBackLogin';
export default class MyNavigator extends Component {
    render() {
        return (
            <Navigator
                initialRoute={{
                    component: RootScene,
                    name: 'rootScene'
                }}
                configureScene={(route) => {
                    
                    if (Platform.OS === 'android') {
                        return Navigator.SceneConfigs.FloatFromBottomAndroid;
                    }
                    return Navigator.SceneConfigs.FloatFromRight;
                }}
                renderScene={(route, navigator) => {
                    let Component = route.component;
                    if (route.component) {
                         setAll(navigator);
                        return <Component {...route.params} navigator={navigator} showToast={(content)=>{
                            this.props.showToast(content);
                        }} showModal={(value)=>{
                            this.props.showModal(value);
                        }
                        }/>
                    }
                }}>
            </Navigator>
        );
    }
}