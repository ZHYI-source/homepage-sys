/**
 *@author ZY
 *@date 2022/4/9 21:00
 *@Description: 配置swagger
 */

const options = {
    swaggerDefinition: {
        info: {
            title: 'ZY-NODE-MONGODB-API',
            version: '1.0.0',
            description: `基于Express + MongoDB编写的基本API骨架。项目地址：https://gitee.com/Z568_568/node.mongodb.git`
        },
        host: `${process.env.SWA_HOST}:${process.env.SWA_PORT}`,
        basePath: '/',
        produces: ['application/json', 'application/xml'],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'authorization',
                description: 'token'
            }
        }
    },
    route: {
        url: '/swagger',//打开swagger文档页面地址
        docs: '/swagger.json' //swagger文件 api
    },
    basedir: __dirname, //app absolute path

    files: [  //在那个文件夹下面收集注释
        '../routes/**/**/*.js',
    ]
}

module.exports = options
