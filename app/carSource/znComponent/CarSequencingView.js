/**
 * Created by zhengnan on 17/3/1.
 */
import React, {Component} from 'react';

import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    Modal,

} from 'react-native';

import * as fontAndColor    from '../../constant/fontAndColor';
import PixelUtil            from '../../utils/PixelUtil';
const Pixel = new PixelUtil();

const {width, height} = Dimensions.get('window');

export class SequencingButton extends Component {

    render() {

        const {buttonClick} = this.props;
        return (
            <TouchableOpacity style={styles.sequencingButton} onPress={buttonClick}>
                <Image source={require('../../../images/carSourceImages/sort.png')}/>
                <Text allowFontScaling={false}  style={styles.sequencingText}>排序</Text>
            </TouchableOpacity>
        )
    }

}

export class SequencingView extends Component {

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {

            isVisible:false,

        };
      }

     visibleCilck = (visible)=>{

         this.setState({
             isVisible:visible,
         });
     }

    render() {
        const {checkedType, checkedClick,sequencingDataSource}=this.props;
        return (
            <Modal visible={this.state.isVisible} transparent={true} onRequestClose={()=>{this.visibleCilck(false)}}>
            <View style={styles.SeqencingView}>
                <TouchableOpacity style={{flex:1}} onPress={()=>{
                    this.visibleCilck(false);
                }}/>
                <View style={{backgroundColor:'white'}}>
                    <ScrollView>
                        {
                            sequencingDataSource.map((data, index) => {
                                return (
                                    <TouchableOpacity key={index} onPress={()=>{

                                        checkedClick(data.title,data.value);
                                        this.visibleCilck(false);

                                    }}>
                                        <View style={styles.checkedCell}>
                                            <Text allowFontScaling={false}  style={[styles.checkedCellText,data.title == checkedType.title && {color:fontAndColor.COLORB0}]}>{data.title}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </ScrollView>
                </View>
            </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({

    sequencingButton: {

        flexDirection: 'row',
        position: 'absolute',
        width: Pixel.getPixel(70),
        height: Pixel.getPixel(30),
        right: Pixel.getPixel(20),
        borderRadius: 15,
        backgroundColor: fontAndColor.COLORB1,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: Pixel.getBottomPixel(55),
    },
    sequencingText: {

        color: 'white',
        fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT),
        marginLeft: Pixel.getPixel(5),

    },

    SeqencingView: {

        backgroundColor: 'rgba(0, 0, 0,0.3)',
        justifyContent: 'flex-end',
        flex:1

    },
    checkedCell: {

        backgroundColor: 'white',
        height: Pixel.getPixel(44),
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: fontAndColor.COLORA3,

    },
    checkedCellText: {

        fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT),
        textAlign: 'center',
        color: fontAndColor.COLORA0,

    },
});

