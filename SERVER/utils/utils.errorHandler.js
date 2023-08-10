const apiResponse = require('@utils/utils.apiResponse')
const logger = require('@utils/utils.logger')
const chalk = require('chalk');

// 全局错误处理中间件
function errorHandler(err, req, res, next) {
    if (err) {
        // console.error(chalk.bold.red(`【TIME】: ${new Date().toLocaleString()}`));
        // console.error(chalk.bold.red(`【URL】: ${req.method} ${req.originalUrl}`));
        // console.error(chalk.bold.red(`【参数】: ${JSON.stringify(req.body) ?? JSON.stringify(req.query)}`));
        // console.error(chalk.bold.red('【错误】:' + err));
        // console.error(err);
        console.error(chalk.bold.red('*********************************'))
        // 记录错误日志
        logger.error(`错误信息
        【URL】: ${req.method} ${req.originalUrl}
        【参数】: ${JSON.stringify(req.body) || JSON.stringify(req.query) || JSON.stringify(req.params) }
        【错误】: ${err}`)
        console.error(chalk.bold.red('*********************************'))
    }
    // 根据不同的错误类型进行相应的处理
    if (err.name === 'UnauthorizedError') {
        // Token 验证失败
        return apiResponse.unauthorizedResponse(res, 'Token不存在或已过期');
    } else if (err.name === 'ForbiddenError') {
        // 403 Forbidden: 用户无权限访问资源
        return apiResponse.forbiddenResponse(res, '用户无权限访问资源');
    } else if (err.name === 'NotFoundError') {
        // 404 Not Found: 请求的资源不存在
        return apiResponse.notFoundResponse(res, '请求的资源不存在');
    } else if (err.name === 'ValidationError') {
        // 400 Bad Request: 请求参数不合法、缺失或格式错误
        return apiResponse.validationErrorWithData(res, '请求参数不合法');
    } else if (err.name === 'ConflictError') {
        // 409 Conflict: 请求的操作与当前状态冲突
        return apiResponse.ErrorResponse(res, '请求的操作与当前状态冲突');
    } else {
        // 默认处理为 500 Internal Server Error
        return apiResponse.ErrorResponse(res, err||'服务器内部错误');
    }
}

module.exports = errorHandler;
