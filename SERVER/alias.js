const moduleAlias = require('module-alias');
const path = require('path');

/**
 * alias.js
 *
 *@author ZY
 *@date 2023/7/7
 *@Description:模块别名配置
*/

moduleAlias.addAliases({
    '@middlewares': path.join(__dirname, 'middlewares'),
    '@models': path.join(__dirname, 'models'),
    '@routes': path.join(__dirname, 'routes'),
    '@db': path.join(__dirname, 'db'),
    '@controllers': path.join(__dirname, 'controllers'),
    '@config': path.join(__dirname, 'config'),
    '@utils': path.join(__dirname, 'utils'),
    '@scheduler': path.join(__dirname, 'scheduler'),

});

