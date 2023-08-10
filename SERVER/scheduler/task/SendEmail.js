const TaskScheduler = require('./TaskScheduler')

const {send} = require('@utils/utils.mailer')


const task = async function () {
    await send('1840354092@qq.com', '每个星期三中午12点 发送邮件')
    return console.log('允许定时任务每个星期三中午12点 发送邮件...' + new Date().getMinutes() + "-" + new Date().getSeconds());
};

// 创建一个 每个星期三中午12点 发送邮件
module.exports = new TaskScheduler('0 0 12 ? * WED', task);

