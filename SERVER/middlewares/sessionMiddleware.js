/**
 *@author ZY
 *@date 2023/4/4
 *@Description:session中间件
 * TODO:使用：eg:存储验证码 req.sessionMiddleware.code = 123  过了有效期 req.sessionMiddleware.code=null
 */

const sessionMiddleware = require('express-session')
const sessionAuth = sessionMiddleware({
    secret: "ZYapi",	// 对cookie进行签名
    name: "session",	// cookie名称，默认为connect.sid
    resave: false,	// 强制将会话保存回会话容器
    rolling: false,	// 强制在每个response上设置会话标识符cookie
    cookie: {
        maxAge: 5 * 60 * 1000 // 5分钟后失效
    }
});
module.exports = sessionAuth;
