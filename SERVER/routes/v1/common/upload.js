/**
 *@author ZY
 *@date 2023/4/13
 *@Description:上传下载相关的接口
 */

const express = require('express');
const router = express.Router();
const UploadController = require('@controllers/v1/common/UploadController')

/****************************************************************************/

/**
 * 文件上传
 * @route POST /v1/common/upload
 * @group 上传下载 - 上传下载相关
 * @returns {object} 200 - {"status": 1,"message": "登录成功.","data": {...},"time": 1680598858753} 包括 下载地址 预览地址
 * @returns {Error}  default - Unexpected error
 * @security JWT   需要token
 */

router.post('/', UploadController.upload);

/**
 * 文件预览或者下载
 * @route POST /v1/common/upload/file/:filename
 * @group 上传下载 - 上传下载相关
 * @returns {object} 200 - {"status": 1,"message": "登录成功.","data": {...},"time": 1680598858753} 包括 下载地址 预览地址
 * @returns {Error}  default - Unexpected error
 * @security JWT   需要token
 */

router.get('/file/:filename', UploadController.file);


/**
 * 删除文件 {filename:---}
 * @route POST /v1/common/upload/delete
 * @group 上传下载 - 上传下载相关
 * @returns {object} 200 - {"status": 1,"message": "登录成功.","data": {...},"time": 1680598858753} 包括 下载地址 预览地址
 * @returns {Error}  default - Unexpected error
 * @security JWT   需要token
 */

router.get('/delete', UploadController.deleteFile);


module.exports = router;
