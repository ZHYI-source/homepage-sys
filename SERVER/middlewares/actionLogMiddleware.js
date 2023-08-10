const chalk = require('chalk');
const UAParser = require("ua-parser-js");
const request = require("request");
const {UsersOptLogModel} = require('@models/v1');

// IP地址解析
function parseIP(clientIp) {
    return new Promise((resolve, reject) => {
        request(
            `https://opendata.baidu.com/api.php?query=[${clientIp}]&co=&resource_id=6006&oe=utf8`,
            {method: 'GET'},
            function (error, response, body) {
                if (error !== null) {
                    reject(error);
                    return;
                }
                if (body && !body.status) {
                    resolve(body.length && JSON.parse(body).data[0].location || '-');
                }
            }
        );
    });
}

// 获取用户的真实公网IP
function getPublicIP(req) {
    const headers = req.headers;
    if (headers['x-real-ip']) {
        return headers['x-real-ip'];
    }
    if (headers['x-forwarded-for']) {
        const ipList = headers['x-forwarded-for'].split(',');
        return ipList[0];
    }
    return '0.0.0.0';
}

/**
 * 记录操作日志.
 * @param {string}  module 模块名
 * @param {string}  content 操作内容
 * @returns {Function}
 */
const actionRecords = ({module, content}) => {
    return async (req, res, next) => {
        try {
            const clientIP = getPublicIP(req);
            //识别常见的浏览器、操作系统和设备等信息
            const u = new UAParser(req.headers['user-agent']);
            const address = await parseIP(clientIP);

            const newUsersOptLog = {
                operatorId: req.userId || '-',
                operator: req.user?.nickname || req.body.username || '未知',
                module,
                platform: u.getBrowser().name ? `${u.getBrowser().name}.v${u.getBrowser().major}` : '未知',
                operatorIP: clientIP,
                address: address || '-',
                content: content || `${req.originalUrl}`
            };

            await UsersOptLogModel.create(newUsersOptLog);
            next();
        } catch (err) {
            console.error(chalk.red('操作日志记录失败'), err);
        }
    };
};

module.exports = {actionRecords};
