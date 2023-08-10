/**
 *@author ZY
 *@date 2023/7/6 下午4:00:17
 *@Description:权限管理相关的接口
 */

const express = require('express');
const router = express.Router();

const PermissionsController = require('@controllers/v1/sys/PermissionsController')


/****************************************************************************/

/**
 * 获取权限管理列表树 无需验证接口权限

 * @route POST /v1/sys/permissions/tree

 * @group 权限管理管理 - 权限管理相关
 */

router.post('/tree', PermissionsController.permissionsTree);

/**
 * 获取权限管理列表

 * @route POST /v1/sys/permissions/list

 * @group 权限管理管理 - 权限管理相关
 */

router.post('/list', PermissionsController.permissionslist);

/**
 * 创建权限管理

 * @route POST /v1/sys/permissions/create

 * @group 权限管理管理 - 权限管理相关
 * @returns {object} 200 - 成功响应
 */

router.post('/create', PermissionsController.permissionsCreate);


/**
 * 删除权限管理

 * @route POST /v1/sys/permissions/delete

 * @group 权限管理管理 - 权限管理相关
 * @param {string} id.required - 权限管理ID且唯一
 * @returns {object} 200 - 成功响应
 */
router.post('/delete', PermissionsController.permissionsDelete);

/**
 * 更新权限管理信息

 * @route POST /v1/sys/permissions/update

 * @group 权限管理管理 - 权限管理相关
 */
router.post('/update', PermissionsController.permissionsUpdate);

/**
 * 更新权限状态

 * @route POST /v1/sys/permissions/stop

 * @group 权限管理管理 - 权限管理相关
 */
router.post('/stop', PermissionsController.permissionsStop);

module.exports = router;
