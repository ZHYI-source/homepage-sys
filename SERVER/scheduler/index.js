const UserTask = require('./task/UserTask')

class Scheduler {
    constructor() {
        this.jobs = []; // 存储所有定时任务的引用
    }

    // 添加定时任务
    add(job) {

        this.jobs.push(job);
    }

    // 启动所有定时任务
    start() {
        this.jobs.forEach(job => job.start());
    }

    // 停止所有定时任务
    stop() {
        this.jobs.forEach(job => job.stop());
    }
}

const scheduler = new Scheduler();

/*
* 添加需要和主进程启动/停止同步的定时任务
* */
scheduler.add(UserTask)

// 导出所有任务
module.exports = scheduler
