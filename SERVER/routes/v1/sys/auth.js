/**
 *@author ZY
 *@date 2023/7/3
 *@Description:权限相关的接口
 */

const express = require('express');
const router = express.Router();
const AuthController = require('@controllers/v1/sys/AuthController')

/****************************************************************************/


/**
 * 验证码
 * @route GET /v1/sys/auth/captcha
 * @group 权限验证 - 登录注册相关
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */

router.get('/captcha', AuthController.captcha);


/**
 * 登录
 * @route POST /v1/sys/auth/login
 * @group 权限验证 - 登录注册相关
 * @param {string} email 邮箱
 * @param {string} password 密码
 * @returns {object} 200 - {"status": 1,"message": "登录成功.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */

router.post('/login', AuthController.login);

/**
 * 注册
 * @route POST /v1/sys/auth/register
 * @group 权限验证 - 登录注册相关
 * @param {string} email 邮箱
 * @param {string} password 密码
 * @param {string} username 昵称
 * @returns {object} 200 - {"status": 1,"message": "...","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.post('/register', AuthController.register);

/**
 * 检验验证码
 * @route GET /v1/sys/auth/verifyConfirm
 * @group 权限验证 - 登录注册相关
 * @param {string} email 邮箱
 * @param {string} code 验证码
 * @returns {object} 200 - {"status": 1,"message": "...","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.get('/verifyConfirm', AuthController.verifyConfirm);

/**
 * 重发验证码
 * @route GET /v1/sys/auth/resendConfirmCode
 * @group 权限验证 - 登录注册相关
 * @param {string} email 邮箱
 * @returns {object} 200 - {"status": 1,"message": "...","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.get('/resendConfirmCode', AuthController.resendConfirmCode);


module.exports = router;
