/**
 * Created by yujinzhong on 2017/2/8.
 */






import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';

export default class Testview22 extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text allowFontScaling={false}  style={styles.welcome}>
                    Welcome to React Native!
                </Text>
                <Text allowFontScaling={false}  style={styles.instructions}>
                    To get started, edit index.ios.js
                </Text>
                <Text allowFontScaling={false}  style={styles.instructions}>
                    Press Cmd+R to reload,{'\n'}
                    Cmd+D or shake for dev menu
                </Text>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
