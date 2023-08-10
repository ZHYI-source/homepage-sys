const chalk = require('chalk');
const apiResponse = require('@utils/utils.apiResponse');
const log = require('@utils/utils.logger');
const {RolesModel, PermissionsModel} = require('@models/v1')
// 验证接口权限 auth:'接口的预设权限'
const checkApiPermission = (auth) => {
    return async (req, res, next) => {
        try {
            const roleInfo = await RolesModel.findById(req.user.roleId)
            if (!roleInfo) return log.error('该用户还未分配角色')
            if (roleInfo) {
                if (!roleInfo.status) {
                    apiResponse.unauthorizedResponse(res, '您的角色已被禁用,请联系管理员')
                    return false
                }
                // 对超级管理员或其他
                if (roleInfo.perms.includes('*') || roleInfo.perms.includes(auth)) {
                    const permissionInfo = await PermissionsModel.findOne({key: auth})
                    // 权限已被禁用
                    if (!roleInfo.perms.includes('*') && !permissionInfo.status) {
                        console.error(chalk.red('【权限已被禁用】: ' + req.method + req.baseUrl))
                        return apiResponse.unauthorizedResponse(res, '您访问的权限已被禁用，请联系管理员')
                    }
                    /*console.error(chalk.bold.greenBright('*********************************************'))
                    console.error(chalk.greenBright('【OPERATOR】: ' + req.users.nickname))
                    console.error(chalk.greenBright('【PASS】: ' + req.method + ' ' + req.baseUrl))
                    console.error(chalk.bold.greenBright('*********************************************'))*/
                    // 接口验证通过，继续下一步中间件或处理程序
                    return next();
                } else {
                    console.error(chalk.bold.red('*********************************'))
                    console.error(chalk.red('【OPERATOR】: ' + req.user.nickname))
                    console.error(chalk.red('【权限未通过】: ' + req.method + req.baseUrl))
                    console.error(chalk.red('【    DATE】: ' + new Date().toLocaleString()))
                    console.error(chalk.bold.red('*********************************'))
                    return apiResponse.unauthorizedResponse(res, '您暂时没有权限访问,请联系管理员')
                }
            }

        } catch (err) {
            console.error(chalk.bold.red('*********************************'))
            console.error(err)
            console.error(chalk.red('【    DATE】: ' + new Date().toLocaleString()))
            console.error(chalk.bold.red('*********************************'))
            return apiResponse.unauthorizedResponse(res, '接口权限验证错误')
        }
    };
};


// 检查用户角色
const checkUserRole = (allowedRoles) => {
    return (req, res, next) => {
        // 从 req.users 中获取用户信息，假设用户信息中有一个字段 role 表示用户角色
        const userRole = req.user.role;
        // 检查用户角色是否在允许的角色列表中
        if (!allowedRoles.includes(userRole)) {
            return apiResponse.forbiddenResponse(res, '您未被授权访问此资源.');
        }
        // 用户角色验证通过，继续下一步中间件或处理程序
        next();
    };
};

// 检查用户权限
const checkUserPermission = (allowedPermissions) => {
    return (req, res, next) => {
        console.log(allowedPermissions)
        // 从 req.users 中获取用户信息，假设用户信息中有一个字段 permissions 表示用户权限
        // const userPermissions = req.users.permissions;
        //
        // // 检查用户是否具有允许的权限之一
        // const hasPermission = userPermissions.some(permission => allowedPermissions.includes(permission));
        // if (!hasPermission) {
        //     return apiResponse.forbiddenResponse(res, '无权限访问该接口.');
        // }

        // 用户权限验证通过，继续下一步中间件或处理程序
        next();
    };
};

// 验证菜单权限
const hasMenuPermission = (userRoles, menuRoute) => {
    // 假设 userRoles 是当前用户的角色列表
    // 假设 menus 是角色与菜单的关联表
    /*    const userMenus = menus.filter(menu => userRoles.includes(menu.role_id));
        return userMenus.some(menu => menu.route === menuRoute);*/
};

// 验证按钮权限
const hasButtonPermission = (userRoles, buttonRoute) => {
    // 假设 userRoles 是当前用户的角色列表
    // 假设 buttons 是角色与按钮的关联表
    // const userButtons = buttons.filter(button => userRoles.includes(button.role_id));
    // return userButtons.some(button => button.route === buttonRoute);
};


module.exports = {checkApiPermission, checkUserRole, checkUserPermission, hasMenuPermission, hasButtonPermission};
