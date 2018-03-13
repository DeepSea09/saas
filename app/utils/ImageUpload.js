import StorageUtil from "./StorageUtil";
var Platform = require('Platform');
import * as StorageKeyNames from "../constant/storageKeyNames";
const request = (url, method, params) => {

    let isOk;
    let body = '';
    for (let key of Object.keys(params)) {
        body += key;
        body += '=';
        body += params[key];
        body += '&';
    }
    if (body.length > 0) {
        body = body.substring(0, body.length - 1);
    }

    return new Promise((resolve, reject) => {
        StorageUtil.mGetItem(StorageKeyNames.TOKEN, (data) => {
            let token = '';
            if (data.code === 1) {
                token = data.result;
            }
            // console.log('token===' + token);
            let device_code = '';

            if (Platform.OS === 'android') {
                device_code = 'dycd_dms_manage_android';
            } else {
                device_code = 'dycd_dms_manage_android';
            }
            fetch(url + '?token=' + '0dee763feb648e3b901af57146d428a3' + '&device_code=' + device_code, {
                method,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body:body
            })
                .then((response) => {
                    if (response.ok) {
                        isOk = true;
                    } else {
                        isOk = false;
                    }
                    console.log(response);
                    return response.json();
                })
                .then((responseData) => {
                    if (isOk) {
                        for (let key of Object.keys(params)) {
                            // console.log(key+"===" + params[key]);
                        }
                        // console.log('------'+url + '?token=' + token + '&device_code=' + device_code);
                        // console.log("success----------" + JSON.stringify(responseData));
                        if (responseData.code == 1) {
                            resolve({mjson: responseData, mycode: 1});
                        } else {
                            reject({mycode: responseData.code, mjson: responseData});
                        }
                        // } else {
                        // console.log("error----------" + JSON.stringify(responseData));
                        reject({mycode: -300});
                    }
                })
                .catch((error) => {
                    // console.log("error----------error" + error);
                    reject({mycode: -500, error: error});
                });
        })
    });
}

export {request};