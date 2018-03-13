import {
    AsyncStorage
} from 'react-native';
export default class StorageUtil {

    static ERRORCODE = "236407";

    static mSetItem(keyName, keyValue, callBack) {
        AsyncStorage.setItem(keyName, keyValue, function (errs) {
            //TODO:错误处理
            if (errs) {
            }
            if (!errs) {
                // console.log('存储无误');
                if (callBack) {
                    callBack();
                }
            }
        });
    }

    static mGetItem(keyName, callBack) {
        AsyncStorage.getItem(keyName, function (errs, result) {
                //TODO:错误处理
                if (!errs) {
                    callBack({code: 1, result: result});
                } else {
                    callBack({code: -1, error: StorageUtil.ERRORCODE});
                }
            }
        );
    }

    static  mRemoveItem(keyName) {
        AsyncStorage.removeItem(keyName, function (errs) {
            if (!errs) {
                // console.log('移除成功');
            }
        });
    }

}