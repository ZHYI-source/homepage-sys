/**
 * Token 身份验证中间件
 *
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 * @returns {void}
 *
 * @throws {Error} - 如果身份验证失败，则抛出错误
 */
const {expressjwt: jwt} = require("express-jwt");

function tokenAuthentication(req, res, next) {
    jwt({
        secret: process.env.SIGN_KEY,
        algorithms: ['HS256'],
        requestProperty: 'user',
        credentialsRequired: true,
        getToken: function fromHeaderOrQuerystring(req, res) {
            if (req.headers.authorization &&
                req.headers.authorization.split(" ")[0] === "Bearer") {
                return req.headers.authorization.split(" ")[1];
            } else if (req.query && req.query.token) {
                return req.query.token;
            }
            return null;
        },
    })(req, res, function (err) {
        if (err) {
            //抛出错误给全局错误信息处理
            return next(err);
        }
        req.userId = req.user._id;
        next();
    });
}

module.exports = tokenAuthentication;
