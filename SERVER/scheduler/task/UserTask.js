const TaskScheduler = require('./TaskScheduler')

const task = function() {
    console.log('允许定时任务...' + new Date().getMinutes() +"-"+ new Date().getSeconds());
};

// 创建一个 每个分钟的30s运行的任务
module.exports = new TaskScheduler('30 * * * * *', task);

