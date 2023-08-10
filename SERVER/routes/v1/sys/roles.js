/**
*@author ZY
*@date 2023/7/3 下午2:55:06
*@Description:角色相关的接口
*/

const express = require('express');
const router = express.Router();

const RolesController = require('@controllers/v1/sys/RolesController')


/****************************************************************************/

/**
* 获取角色列表

* @route POST /v1/sys/roles/list

* @group 角色管理 - 角色相关
*/

router.post('/list', RolesController.roleslist);

/**
* 创建角色

* @route POST /v1/sys/roles/create

* @group 角色管理 - 角色相关
* @returns {object} 200 - 成功响应
*/

router.post('/create', RolesController.rolesCreate);


/**
* 删除角色

* @route POST /v1/sys/roles/delete

* @group 角色管理 - 角色相关
* @param {string} id.required - 角色ID且唯一
* @returns {object} 200 - 成功响应
*/
router.post('/delete', RolesController.rolesDelete);

/**
* 更新角色信息

* @route POST /v1/sys/roles/update

* @group 角色管理 - 角色相关
*/
router.post('/update', RolesController.rolesUpdate);
/**
* 查找指定的角色信息

* @route POST /v1/sys/roles/findOne

* @group 角色管理 - 角色相关
*/
router.post('/findOne', RolesController.rolesFindOne);


module.exports = router;
