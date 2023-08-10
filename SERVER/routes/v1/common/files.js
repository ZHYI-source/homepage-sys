/**
 *@author ZY
 *@date 2023/7/8 22:27
 *@Description:上传下载相关的接口
 */

const express = require('express');
const router = express.Router();
const FilesController = require('@controllers/v1/common/FilesController')

/****************************************************************************/

/**
 * 图片上传
 * @route POST /v1/common/files/upload/img
 * @group 上传下载 - 上传下载相关
 * @returns {Error}  default - Unexpected error
 * @security JWT   需要token
 */

router.post('/upload', FilesController.upload);

/**
 * 图片下载
 * @route POST /v1/common/files/download/img:filename
 * @group 上传下载 - 上传下载相关
 * @returns {Error}  default - Unexpected error
 */

router.get('/download/img/:filename', FilesController.downloadImg);
router.get('/download/media/:filename', FilesController.downloadMedia);
router.get('/download/files/:filename', FilesController.downloadFile);


/**
 * 图片预览
 * @route POST /v1/common/files/preview/img:filename
 * @group 上传下载 - 上传下载相关
 * @returns {Error}  default - Unexpected error
 */

router.get('/preview/img/:filename', FilesController.previewImg);
router.get('/preview/media/:filename', FilesController.previewMedia);

/**
 * 图片删除
 * @route POST /v1/common/files/delete/img:filename
 * @group 上传下载 - 上传下载相关
 * @returns {Error}  default - Unexpected error
 */

router.get('/delete/img/:filename', FilesController.deleteImg);
router.get('/delete/media/:filename', FilesController.deleteMedia);
router.get('/delete/files/:filename', FilesController.deleteFiles);



module.exports = router;
