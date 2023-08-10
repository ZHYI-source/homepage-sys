/**
*@author ZY
*@date 2023/7/3 上午11:56:05
*@Description:管理员相关的接口
*/

const express = require('express');
const router = express.Router();

const UsersController = require('@controllers/v1/sys/UsersController')



/****************************************************************************/

/**
* 获取管理员列表

* @route POST /v1/sys/users/list

* @group 管理员管理 - 管理员相关
*/

router.post('/list', UsersController.userslist);

/**
* 创建管理员

* @route POST /v1/sys/users/create

* @group 管理员管理 - 管理员相关
* @returns {object} 200 - 成功响应
*/

router.post('/create', UsersController.usersCreate);


/**
* 删除管理员

* @route POST /v1/sys/users/delete

* @group 管理员管理 - 管理员相关
* @param {string} id.required - 管理员ID且唯一
* @returns {object} 200 - 成功响应
*/
router.post('/delete', UsersController.usersDelete);

/**
* 更新管理员信息

* @route POST /v1/sys/users/update

* @group 管理员管理 - 管理员相关
*/
router.post('/update', UsersController.usersUpdate);

/**
 * 重置管理员密码

 * @route POST /v1/sys/users/reset

 * @group 管理员管理 - 管理员相关
 */
router.post('/reset', UsersController.usersReset);


/**
 * 获取管理员信息

 * @route POST /v1/sys/users/findOne

 * @group 管理员管理 - 管理员相关
 */
router.post('/findOne', UsersController.usersFindOne);


module.exports = router;
