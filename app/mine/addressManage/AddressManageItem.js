import  React,{Component} from  'react'
import  {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image
} from  'react-native'

import * as fontAndColor from '../../constant/fontAndColor';
import  PixelUtil from '../../utils/PixelUtil'
let Pixel = new PixelUtil();
const select_img = require('../../../images/mine/get_carer_selected.png');
const unselect_img = require('../../../images/mine/get_carer_unselect.png');
const delete_img = require('../../../images/mine/get_carer_delete.png');
const edit_img = require('../../../images/mine/get_carer_edit.png');

export default class AddressManageItem extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.itemView}>
                    <Text style={styles.itemLeftText}>{this.props.item.contact_name}</Text>
                    <Text style={styles.itemRightText}>{this.props.item.contact_phone}</Text>
                </View>
                <View style={styles.itemView}>
                    <Text style={styles.itemLeftText}>{this.props.item.full_address}</Text>
                </View>
                <View style={styles.itemSeparator}/>
                <View style={styles.bottomContainer}>
                    {
                        this.props.item.is_default == 1
                            ?
                            <View style={styles.bottomLeft}>
                                <Image source={select_img} style={styles.bottomLeftImg}/>
                                <Text style={styles.bottomLeftText}>{'默认地址'}</Text>
                            </View>
                            :
                            <TouchableOpacity
                                activeOpacity={0.6}
                                style={styles.bottomLeft}
                                onPress={()=>{this.props.setDefault(this.props.item)}}
                            >
                                <Image source={unselect_img} style={styles.bottomLeftImg}/>
                                <Text style={styles.bottomLeftText}>{'设为默认'}</Text>
                            </TouchableOpacity>
                    }

                    <View style={styles.bottomRight}>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={styles.bottomRightBtn}
                            onPress={()=>{this.props.onEdit(this.props.item)}}
                        >
                            <Image source={edit_img} style={styles.bottomRightImg}/>
                            <Text style={styles.bottomRightText}>{'编辑'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={styles.bottomRightBtn}
                            onPress={()=>{this.props.onDelete(this.props.item)}}
                        >
                            <Image source={delete_img} style={styles.bottomRightImg}/>
                            <Text style={styles.bottomRightText}>{'删除'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Pixel.getPixel(0),
        backgroundColor: 'white',
    },
    itemView:{
        height:Pixel.getPixel(36),
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal:Pixel.getPixel(15),
    },
    itemLeftText:{
        fontSize:Pixel.getFontPixel(14),
        color:'black',
        flex:1
    },
    itemRightText:{
        color:'black',
        fontSize:Pixel.getFontPixel(14),
        flex:2,
        textAlign:'right'
    },
    itemSeparator:{
        borderColor:fontAndColor.COLORA3,
        borderTopWidth:1
    },
    bottomContainer:{
        height:Pixel.getPixel(46),
        backgroundColor:'white',
        flexDirection:'row',
        alignItems:'center'
    },
    btnText:{
        fontSize:Pixel.getFontPixel(15),
        color:'#ffffff'
    },
    bottomLeft:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        marginLeft:Pixel.getPixel(15)
    },
    bottomLeftImg:{
        width:Pixel.getPixel(16),
        height:Pixel.getPixel(17)
    },
    bottomLeftText:{
        fontSize:Pixel.getFontPixel(15),
        marginLeft:Pixel.getPixel(10),
        color:'black'
    },
    bottomRight:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        marginRight:Pixel.getPixel(15),
        justifyContent:'flex-end'
    },
    bottomRightBtn:{
        flexDirection:'row',
        alignItems:'center',
        marginLeft:Pixel.getPixel(30),
        padding:Pixel.getPixel(5)
    },
    bottomRightText:{
        fontSize:Pixel.getFontPixel(15),
        marginLeft:Pixel.getPixel(5),
        color:'black'
    },
    bottomRightImg:{
        width:Pixel.getPixel(16),
        height:Pixel.getPixel(16)
    },
});