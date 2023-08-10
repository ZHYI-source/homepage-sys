/**
*@author ZY
*@date 2023/7/17 上午9:34:00
*@Description:资源管理相关的接口
*/

const express = require('express');
const router = express.Router();

const ResourcesController = require('@controllers/v1/sys/ResourcesController')


/****************************************************************************/

/**
* 获取资源管理列表
* @route POST /v1/sys/resources/list
* @group 资源管理管理 - 资源管理相关
*/

router.post('/list', ResourcesController.resourceslist);

/**
* 创建资源管理
* @route POST /v1/sys/resources/create
* @group 资源管理管理 - 资源管理相关
* @returns {object} 200 - 成功响应
*/

router.post('/create', ResourcesController.resourcesCreate);


/**
* 删除资源管理
* @route POST /v1/sys/resources/delete
* @group 资源管理管理 - 资源管理相关
* @param {string} _id.required - 资源管理_ID且唯一
* @returns {object} 200 - 成功响应
*/
router.post('/delete', ResourcesController.resourcesDelete);

/**
* 更新资源管理信息
* @route POST /v1/sys/resources/update
* @group 资源管理管理 - 资源管理相关
*/
router.post('/update', ResourcesController.resourcesUpdate);

module.exports = router;
