/**
 *文件上传工具：
 *  imageUploadUtil ： 图片上传
 */
import * as AppUrls from "../constant/appUrls";
const imageUploadUtil = (uris) => {
    let formData = new FormData();      //因为需要上传多张图片,所以需要遍历数组,把图片的路径数组放入formData中
    for (var i = 0; i < uris.length; i++) {
        let file = {
            //这里的key(uri和type和name)不能改变,
            uri: uris[i],
            type: 'multipart/form-data',
            name: 'image.png'
        };
        formData.append("files", file);   //这里的files就是后台需要的key
        formData.append("device_code", "dycd_dms_manage_android");   //这里的files就是后台需要的key
    }

    fetch(AppUrls.AUTH_UPLOAD_FILE, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        body: formData,
    }).then((response) => {
        response.text()
    }).then((responseData) => {
    }).catch((error) => {
    });
}

export {imageUploadUtil};