/**
*@author ZY
*@date 2023/7/5 下午9:52:46
*@Description:代码生成相关的接口
*/

const express = require('express');
const router = express.Router();

const CodesController = require('@controllers/v1/dev/CodesController')


/****************************************************************************/

/**
* 获取代码生成列表

* @route POST /v1/dev/codes/list

* @group 代码生成管理 - 代码生成相关
*/

router.post('/list', CodesController.codeslist);


/**
* 删除代码生成

* @route POST /v1/dev/codes/delete

* @group 代码生成管理 - 代码生成相关
* @param {string} _id.required - 代码生成ID且唯一
* @param {string} name.required - 代码生成名称
* @returns {object} 200 - 成功响应
*/
router.post('/delete', CodesController.codesDelete);
/**
* 批量删除代码生成
* @route POST /v1/dev/codes/delete
* @group 代码生成管理 - 代码生成相关
* @param {Array} ids.required - 代码生成ID数组
* @returns {object} 200 - 成功响应
*/
router.post('/deleteAll', CodesController.codesDeleteAll);



/**
 * 主页
 * @route GET /v1/dev/codes/collections
 * @group API - 根路径
 */
router.get('/collections', CodesController.modelsList);

/**
 * 单表前端增删改页面代码生成
 * @route POST /v1/dev/codes/singleCurdFrontAndBack
 * @param {String} tableName - 表名称 在mongodb注册的名称
 * @param {String} comment - 表中文
 * @param {String} newModules - 新模块: book 或者 auth   默认: sys
 * @param {String} auth - 权限：sys:users:create 只需传 sys
 * @group API - 根路径
 */
router.post('/singleCurdFrontAndBack', CodesController.singleCurdFrontAndBack);


/**
 * 代码生成的文件下载
 * @route POST /v1/dev/codes/download
 * @param {String} name - 表名称 在mongodb注册的名称
 * @group API - 根路径
 */
router.get('/download', CodesController.download);


module.exports = router;
