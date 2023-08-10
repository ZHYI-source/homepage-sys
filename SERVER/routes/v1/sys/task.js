/**
 *@author ZY
 *@date 2023/4/10
 *@Description:任务相关的接口
 */

const express = require('express');
const router = express.Router();
const SendEmail = require('@scheduler/task/SendEmail')

/****************************************************************************/


/**
 * 开始发送邮件定时任务
 * @route GET /v1/sys/task/startSendEmail
 * @group 定时任务 - 定时任务相关
 * @returns {object} 200 - {"status": 1,"message": "登录成功.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */

router.get('/startSendEmail', function (req, res) {
    //用户的定时任务开始
    SendEmail.start();
    res.send('用户的定时任务开始!');
});

/**
 * 停止发送邮件定时任务
 * @route GET /v1/sys/task/stopSendEmail
 * @group 定时任务 - 定时任务相关
 * @returns {object} 200 - {"status": 1,"message": "登录成功.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */

router.get('/stopSendEmail', function (req, res) {
    SendEmail.stop();
    res.send('用户的定时任务开始!');
});

module.exports = router;
