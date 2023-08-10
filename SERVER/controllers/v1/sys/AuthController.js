const jwt = require("jsonwebtoken");
const {body, query, validationResult} = require('express-validator');
const {UsersModel} = require('@models/v1')
const apiResponse = require('@utils/utils.apiResponse')
const mailer = require('@utils/utils.mailer')
const {randomNumber, encryption, parseIP, getPublicIP, getEmailAvatar, decryption} = require('@utils/utils.others')
const log = require('@utils/utils.logger')
const svgCaptcha = require('svg-captcha');
const {actionRecords} = require("@middlewares/actionLogMiddleware");

const UAParser = require("ua-parser-js");

/**
 * TODO:
 *   express-validator : https://express-validator.github.io/docs/
 *   参数校验方法查询（基于validator.js库）: https://github.com/validatorjs/validator.js#Validators
 *   eg:isLength isEmail trim ...
 * */
/******************************************************************************************/

// 生产随机验证码
exports.captcha = [
    async (req, res) => {
        try {
            //验证码配置api
            let options = {
                //线条数
                noise: Math.floor(Math.random() * 5),
                color: true,
                fontSize: 55,
                width: 90,
                height: 38,
            }
            let captcha = svgCaptcha.createMathExpr(options)
            //存储到session
            req.session.code = captcha.text
            apiResponse.successResponseWithData(res, "成功.", captcha.data);
        } catch (err) {
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        }
    }
]

/**
 * User login 登录.
 * @param {string}  username 用户名
 * @param {string}  password 密码
 * @param {string}  code 验证码
 * @returns {Object}
 */
exports.login = [
    actionRecords({module: '登录'}),
    //参数验证
    [
        body("username").notEmpty().withMessage('用户名不能为空.'),
        body("password").notEmpty().withMessage('密码不能为空.'),
        body("code").notEmpty().withMessage('验证码不能为空.'),
    ],

    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // console.error('****validationError*****: '+errors.array()[0].msg)
                return apiResponse.validationErrorWithData(res, errors.array()[0].msg);
            } else {
                if (!req.session.code) return apiResponse.validationErrorWithData(res, "验证码已失效");
                if (req.session.code !== req.body.code) return apiResponse.validationErrorWithData(res, "验证码错误");
                const userWithData = await UsersModel.findOne({username: req.body.username})
                if (!userWithData) return apiResponse.validationErrorWithData(res, "用户名不存在");
                // 密码和数据库密码匹配
                let isPass = await decryption(req.body.password, userWithData.password)

                if (!isPass) return apiResponse.validationErrorWithData(res, "用户名或密码错误");
                if (!userWithData.status) return apiResponse.unauthorizedResponse(res, "当前账户已被禁用,请联系管理员.");


                // 构建响应给前端的数据
                let userData = {
                    _id: userWithData._id,
                    username: userWithData.username,
                    nickname: userWithData.nickname,
                    roleId: userWithData.roleId,
                    status: userWithData.status,
                };
                userData.token = 'Bearer ' + jwt.sign(
                    userData,
                    process.env.SIGN_KEY,
                    {
                        expiresIn: 3600 * 24 * 3 // token 3天有效期
                    }
                )
                log.info(`*** 昵称: ${userWithData.nickname} 登录成功`)
                return apiResponse.successResponseWithData(res, "登录成功.", userData);
            }
        } catch (err) {
            console.log(err);
            log.error(`*** ${req.body.username} 登录失败 ** 错误信息 : ${JSON.stringify(err)}`)
            return apiResponse.ErrorResponse(res, err);
        }
    }
]


/**
 * User register 用户注册
 * @param {string}  nickname 昵称
 * @param {string}  username 用户名
 * @param {string}  password 密码
 * @param {string}  email  邮箱
 * @returns {Object}
 */
exports.register = [
    actionRecords({module: '注册'}),
    //必填参数验证
    [
        body("nickname").notEmpty().withMessage('昵称不能为空.'),
        body("username").notEmpty().withMessage('用户名不能为空.').custom((value, {req}) => {
            return UsersModel.findOne({username: value}).then(user => {
                if (user) {
                    return Promise.reject(`用户名:${user.username}已经注册,请更换其他.`);
                }
            });
        }),
        body("password").notEmpty().withMessage('密码不能为空.').isLength({min: 6}).trim().withMessage('密码不能小于6位.'),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // console.error('****validationError*****: '+errors.array()[0].msg)
                return apiResponse.validationErrorWithData(res, errors.array()[0].msg);
            } else {
                const clientIP = getPublicIP(req);
                //识别常见的浏览器、操作系统和设备等信息
                const u = new UAParser(req.headers['user-agent']);
                const address = await parseIP(clientIP);
                const equipment = u.getBrowser().name ? `${u.getBrowser().name}.v${u.getBrowser().major}` : '未知'

                // 密码加密
                let enPassword = await encryption(req.body.password)
                let avatar = await getEmailAvatar(req.body.email)
                //Save users.
                let newUser = {
                    type: 'admin',//默认管理端用户
                    avatar: req.body.avatar || avatar,
                    nickname: req.body.nickname,
                    username: req.body.username,
                    password: enPassword,
                    userIp: clientIP,
                    email: req.body.email,
                    address,
                    platform: equipment,
                    roleId: '64a7aa20a971facd04696242',
                };
                const addInfo = await UsersModel.create(newUser)
                if (addInfo) {
                    //发送邮件
                    addInfo.email && await mailer.send(req.body.email, `恭喜您已注册成功,感谢您的使用ZY·ADMIN！`)
                    log.info(`+++ 新用户: ${req.body.username} 注册成功`)
                    return apiResponse.successResponse(res, "注册成功");
                }
            }
        } catch (err) {
            console.log(err)
            return apiResponse.ErrorResponse(res, err);
        }
    }
]


/**
 * User Verify Confirm code 用户账号邮件验证码确认
 * @param {string}  email  邮箱
 * @param {string}  opt    验证码
 * @returns {Object}
 */
exports.verifyConfirm = [
    //必填参数验证
    [
        query("email").notEmpty().withMessage('邮箱不能为空.').isEmail().normalizeEmail().withMessage("邮箱格式不正确."),
        query("code").notEmpty().withMessage('验证码不能为空.').withMessage("验证码不能为空."),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // console.error('****validationError*****: '+errors.array()[0].msg)
                return apiResponse.validationErrorWithData(res, errors.array()[0].msg);
            } else {
                let {code} = req.session
                if (!code) return apiResponse.unauthorizedResponse(res, "验证码已失效,请重新获取.");
                //
                let query = {email: req.query.email};
                const userInfo = await UsersModel.findOne(query)
                if (!userInfo) return apiResponse.unauthorizedResponse(res, "邮箱号码不存在.");

                // if (userInfo.confirmOTP === req.query.code) {
                if (code === Number(req.query.code)) {
                    UsersModel.findOneAndUpdate(query, {
                        isConfirmed: 1,
                    }).catch(err => {
                        return apiResponse.ErrorResponse(res, err);
                    });
                    return apiResponse.successResponse(res, "账户验证成功！可进行登录.");
                } else {
                    return apiResponse.unauthorizedResponse(res, "验证码错误");
                }
            }
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
]


/**
 * Resend Confirm code. 重发验证码
 * @param {string}  email  邮箱
 * @returns {Object}
 */
exports.resendConfirmCode = [

    //必填参数验证
    [query("email").notEmpty().withMessage('邮箱不能为空.').isEmail().normalizeEmail().withMessage("邮箱格式不正确."),],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // console.error('****validationError*****: '+errors.array()[0].msg)
                return apiResponse.validationErrorWithData(res, errors.array()[0].msg);
            } else {
                //
                let query = {email: req.query.email};
                const userInfo = await UsersModel.findOne(query)
                if (!userInfo) return apiResponse.unauthorizedResponse(res, "邮箱号码不存在.");
                if (userInfo.isConfirmed) return apiResponse.unauthorizedResponse(res, "账户已经验证.");

                // 生成新验证码
                let newCode = randomNumber(4);

                // 更新用户验证状态 验证码
                await UsersModel.findOneAndUpdate(query, {isConfirmed: 0}).catch(err => {
                    return apiResponse.ErrorResponse(res, err);
                })
                // 发送验证码
                await mailer.send(req.query.email, `✨您的验证码：${newCode}  有效期5分钟`)
                //session存储验证码
                req.session.code = newCode
                console.log('新的验证码：', newCode)
                return apiResponse.successResponse(res, "验证码发送成功！请在5分钟内进行验证.");

            }
        } catch (err) {
            console.log(err)
            return apiResponse.ErrorResponse(res, JSON.stringify(err));
        }
    }
]






