require('./alias'); // 引入路径别名配置文件

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const chalk = require('chalk');
const isDev = process.env.NODE_ENV === 'development';
const mount = require('mount-routes');
const scheduler = require('./scheduler');
const sessionAuth = require('./middlewares/sessionMiddleware');
const errorHandler = require('./utils/utils.errorHandler');
const apiResponse= require('./utils/utils.apiResponse');

// 访问不同的 .env 文件
require('dotenv').config({ path: isDev ? './.env.development' : './.env.production' });

require('express-async-errors');

// mongodb 数据库连接
require('./db/index');

const app = express();

// Session全局中间件配置
app.use(sessionAuth);

// 处理post参数解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 解决跨域
app.use(cors());

// 设置跨域和设置允许的请求的头部信息
app.all('/v1/*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, token');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization');
    res.header('Content-Type', 'application/json;charset=UTF-8');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    if (req.method === 'OPTIONS') res.send(200);
    /*让options请求快速返回*/
    else next();
});

if (isDev) {
    console.log(chalk.bold.yellow('当前是开发环境'));
    app.use(logger('dev'));
} else {
    console.log(chalk.bold.yellow('当前是生产环境'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 使用swagger API文档，必须在解决跨域设置数据格式之前
const options = require('./config/swagger.config'); // 配置信息
const expressSwagger = require('express-swagger-generator')(app);
expressSwagger(options);

// 监听SIGINT信号，当应用程序被强制关闭时停止所有定时任务
process.on('SIGINT', (signal) => {
    scheduler.stop();
    process.exit();
});

// 带路径的用法并且可以打印出路由表 true代表展示路由表在打印台
mount(app, './routes', isDev);

// 添加全局错误处理中间件
app.use(errorHandler);

// throw 404 if URL not found
app.all('*', function (req, res) {
    return apiResponse.notFoundResponse(res, '404 --- 接口不存在');
});


/*
* netstat -ano | findstr :8080  查看端口进程
* taskkill /F /PID 12345  关闭该进程
* */


app.listen(process.env.PORT, () => {
    /* 开启定时任务 */
    // scheduler.start();

    console.log(
        chalk.hex('#8e44ad').bold(`
 .----------------.  .----------------.  .----------------.  .----------------.  .----------------.  .----------------. 
| .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. |
| |   ________   | || |  ____  ____  | || |    ___       | || |      __      | || |   ______     | || |     _____    | |
| |  |  __   _|  | || | |_  _||_  _| | || |  .' _ '.     | || |     /  \\     | || |  |_   __ \\   | || |    |_   _|   | |
| |  |_/  / /    | || |   \\ \\  / /   | || |  | (_) '___  | || |    / /\\ \\    | || |    | |__) |  | || |      | |     | |
| |     .'.' _   | || |    \\ \\/ /    | || |  .\`___'/ _/  | || |   / ____ \\   | || |    |  ___/   | || |      | |     | |
| |   _/ /__/ |  | || |    _|  |_    | || | | (___)  \\_  | || | _/ /    \\ \\_ | || |   _| |_      | || |     _| |_    | |
| |  |________|  | || |   |______|   | || | \`._____.\\__| | || ||____|  |____|| || |  |_____|     | || |    |_____|   | |
| |              | || |              | || |              | || |              | || |              | || |              | |
| '--------------' || '--------------' || '--------------' || '--------------' || '--------------' || '--------------' |
 '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------' 
`),
    );
    console.log(chalk.bold.green(`项目启动成功: ${process.env.URL}:${process.env.PORT}/v1`));
    console.log(chalk.bold.green(`接口文档地址: ${process.env.URL}:${process.env.PORT}/swagger`));
});

module.exports = app;
