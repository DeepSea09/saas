/**
 * Created by zhengnan on 2017/11/27.
 */

export default class StringTransformUtil{


    /**
     * from -ZN
     * 保留小数点后两位,去掉多余小数点后的0
     * 如：2.0111 - 2.01     2.00 - 2
     * @param carMoney
     * @returns {*}
     */
    carMoneyChange(carMoney){

        let newCarMoney = parseFloat(carMoney);
        let carMoneyStr = newCarMoney.toFixed(2);
        let moneyArray = carMoneyStr.split(".");
        if (moneyArray.length > 1) {
            if (moneyArray[1] > 0) {

                return moneyArray[0] + '.' + moneyArray[1];
            } else {

                return moneyArray[0];
            }

        } else {
            return carMoneyStr;
        }
    }

    /**
     * from - ZN
     * 时间戳-转换为时间 +'000'
     * @param time
     * @returns {string}
     */
    dateReversal(time){

        const date = new Date();
        date.setTime(time);
        return (date.getFullYear() + "-" + (this.PrefixInteger(date.getMonth() + 1, 2)));

    };
    PrefixInteger = (num, length) => {

        return (Array(length).join('0') + num).slice(-length);

    }
}