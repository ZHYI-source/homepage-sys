/**
 *@author ZY
 *@date 2023/8/7 下午12:49:36
 *@Description:留言相关的接口
 */

const express = require('express');
const router = express.Router();

const MessagesController = require('@controllers/v1/blog/MessagesController')


/****************************************************************************/

/**
 * 获取留言列表
 * @route POST /v1/blog/messages/list
 * @group 留言管理 - 留言相关
 */

router.post('/list', MessagesController.messageslist);

/**
 * 创建留言
 * @route POST /v1/blog/messages/create
 * @group 留言管理 - 留言相关
 * @returns {object} 200 - 成功响应
 */

router.post('/create', MessagesController.messagesCreate);


/**
 * 删除留言
 * @route POST /v1/blog/messages/delete
 * @group 留言管理 - 留言相关
 * @param {string} _id.required - 留言_ID且唯一
 * @returns {object} 200 - 成功响应
 */
router.post('/delete', MessagesController.messagesDelete);

/**
 * 更新留言信息
 * @route POST /v1/blog/messages/update
 * @group 留言管理 - 留言相关
 */
router.post('/update', MessagesController.messagesUpdate);

/***************前台留言接口*****************/

/**
 * 留言信息
 * @route POST /v1/blog/messages/client/list
 * @group 留言管理 - 留言相关
 */
router.post('/client/list', MessagesController.messagesClientlist);
/**
 * 留言
 * @route POST /v1/blog/messages/client/create
 * @group 留言管理 - 留言相关
 */
router.post('/client/create', MessagesController.messagesClientCreate);

/**
 * 回复留言
 * @route POST /v1/blog/messages/client/reply
 * @group 留言管理 - 留言相关
 */
router.post('/client/reply', MessagesController.messagesClientReply);
/**
 * 点赞留言
 * @route POST /v1/blog/messages/client/like
 * @group 留言管理 - 留言相关
 */
router.post('/client/like', MessagesController.messagesClientLike);
/**
 * 反对留言
 * @route POST /v1/blog/messages/client/opposeNum
 * @group 留言管理 - 留言相关
 */
router.post('/client/opposeNum', MessagesController.messagesClientOpposeNum);

module.exports = router;
