const mongoose = require('mongoose');
const config = require('../config/db.config');
mongoose.connect(config.url);
mongoose.Promise = global.Promise;
const chalk = require('chalk');
const db = mongoose.connection;

db.once('open', () => {
    let isDev = process.env.NODE_ENV === 'development'
    console.log(chalk.rgb(123, 45, 67).bold(`连接${isDev ? chalk.blue.bold('开发环境') : chalk.blue.bold('生产环境')}数据库成功：` + chalk.hex('#DEADED').underline(db.name)))
})

db.on('error', function (error) {
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
});

db.on('close', function () {
    console.log('***********数据库断开，重新连接数据库************');
    mongoose.connect(config.url);
});

module.exports = db;
