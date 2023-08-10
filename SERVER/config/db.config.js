/*
* TODO:- windows安装mongodb 后 启动mongodb服务两种方式cmd：
*    1. 管理员cmd: net start MongoDB
*    2. cmd : mongod --dbpath D:\mongodb\data  *这种关闭cmd窗口mongodb服务也就断开了
* */

module.exports = {
    port: process.env.DB_PORT,
    url: `mongodb://${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
}
