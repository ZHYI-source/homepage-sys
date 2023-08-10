/**
 *@author ZY
 *@date 2023/7/7 下午2:37:53
 *@Description:操作日志相关的接口
 */

const express = require('express');
const router = express.Router();

const Users_opt_logsController = require('@controllers/v1/sys/Users_opt_logsController')


/****************************************************************************/

/**
 * 获取操作日志列表
 * @route POST /v1/sys/users_opt_logs/list
 * @group 操作日志管理 - 操作日志相关
 */

router.post('/list', Users_opt_logsController.users_opt_logslist);

/**
 * 创建操作日志
 * @route POST /v1/sys/users_opt_logs/create
 * @group 操作日志管理 - 操作日志相关
 * @returns {object} 200 - 成功响应
 */

router.post('/create', Users_opt_logsController.users_opt_logsCreate);


/**
 * 删除操作日志
 * @route POST /v1/sys/users_opt_logs/delete
 * @group 操作日志管理 - 操作日志相关
 * @param {string} _id.required - 操作日志_ID且唯一
 * @returns {object} 200 - 成功响应
 */
router.post('/delete', Users_opt_logsController.users_opt_logsDelete);
/**
 * 批量删除操作日志
 * @route POST /v1/sys/users_opt_logs/deleteAll
 * @group 操作日志管理 - 操作日志相关
 * @param {Array} _id.required - 操作日志_ID且唯一
 * @returns {object} 200 - 成功响应
 */
router.post('/deleteAll', Users_opt_logsController.users_opt_logsDeleteAll);

/**
 * 更新操作日志信息
 * @route POST /v1/sys/users_opt_logs/update
 * @group 操作日志管理 - 操作日志相关
 */
router.post('/update', Users_opt_logsController.users_opt_logsUpdate);
/**
 * 导出操作日志信息
 * @route POST /v1/sys/users_opt_logs/export
 * @group 操作日志管理 - 操作日志相关
 */
router.post('/export', Users_opt_logsController.users_opt_logsExport);
/**
 * 导入操作日志信息
 * @route POST /v1/sys/users_opt_logs/import
 * @group 操作日志管理 - 操作日志相关
 */
router.post('/import', Users_opt_logsController.users_opt_logsImport);
/**
 * 导入操作日志信息模板
 * @route GET /v1/sys/users_opt_logs/downloadTemplate
 * @group 操作日志管理 - 操作日志相关
 */
router.post('/downloadTemplate', Users_opt_logsController.users_opt_logsDownloadTemplate);

module.exports = router;
