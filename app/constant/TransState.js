/**
 * Created by hanmeng on 2018/2/3.
 */

transStateMapping = (ordersTrans) => {
    switch (ordersTrans.status) {
        case 0:    // 0 是前端自己定义的状态 说明未生成运单
            return {'state': 0, 'waybillState': ''};
        case 1: //1 =>'填写完',
        case 2: //2 =>'支付运单成功',
        case 100: // 100 =>'支付运单中',
        case 101: // 101 =>'支付运单失败',
        case 200: // 200 =>'支付运单成功生成运单失败',
            return {'state': 1, 'waybillState': '运费' + ordersTrans.total_amount + '元'};
        case 201:   // 201 =>'支付运单成功生成运单成功',
            return {'state': 2, 'waybillState': '已支付'};
        case 30:  //  30 =>'审核成功待发',
        case 31:  //  31 =>'审核失败待发',
            return {'state': 3, 'waybillState': '已支付'};
        case 3:  //  3 =>'发运',
            return {'state': 4, 'waybillState': '已支付'};
        case 4:  // 4 =>'到店',
            return {'state': 5, 'waybillState': '已到店'};
        case 5:  // 5 =>'到库',
        case 6:  // 6 =>'申请提车函',
        case 8:  // 8 =>'申请提车函支付失败',
        case 10:  // 10 =>'申请转单车',
        case 13:  // 13 =>'申请转单车支付失败',
            return {'state': 6, 'waybillState': '已入库'};
        case 7: // 7 =>'申请提车函支付中',
            return {'state': 7, 'waybillState': '已入库'};
        case 9:    // 9 =>'申请提车函支付完成',
            return {'state': 8, 'waybillState': '仓储费已支付'};
        case 12:  // 12 =>'申请转单车支付中',
        case 14:  // 14 =>'申请转单车支付成功',
        case 15: //  15 =>'申请转单车支付成功生成运单失败',
        case 16: //  16 =>'申请转单车支付成功生成运单成功',
            return {'state': 9, 'waybillState': '已入库'};
        case 11: // 11 =>'终结',
            return {'state': 10, 'waybillState': '已交车'};
        default:
            return {'state': 0, 'waybillState': ''};
    }
};

export const NONE_WAYBILL = 0;
export const FILL_WAYBILL = 1;
export const PAY_SUCCESS = 2;
export const AUDIT_FAILURE = 3;
export const AUDIT_SUCCESS = 4;
export const START_TRANSPORT = 5;
export const TO_THE_SHOP = 6;
export const TO_THE_GARAGE = 7;
export const GET_CAR_PAY = 8;
export const GET_CAR_PAY_FINISH = 9;
export const APPLY_SINGLE_CAR = 10;
export const WAYBILL_END = 11;


