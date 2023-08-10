// permissionInitializer.js

// 获取所有的接口路由信息
function getRoutesFromCode(router,path) {
    const routes = [];

    // 遍历应用中的每个路由
    router.stack.forEach((middleware) => {
        if (middleware.route) {
            const route = {
                path: path + middleware.route.path,
                methods: Object.keys(middleware.route.methods),
            };
            routes.push(route);
        }
    });

    return routes;
}
exports.initializePermissions = function (router,path) {
    const routes = getRoutesFromCode(router,path); // 从代码中获取所有的接口路由信息

    console.log('所有路由接口：',routes)
    // routes.forEach((route) => {
    //     console.log(`Path: ${route.path}`);
    //     console.log(`Methods: ${route.methods.join(', ')}`);
    //     console.log('---');
    // });
    // routes.forEach((route) => {
    //     if (hasPermissionAnnotation(route)) { // 判断接口是否有权限标记
    //         const permission = createPermissionFromRoute(route); // 根据接口信息创建权限对象
    //         savePermission(permission); // 保存权限到数据库
    //     }
    // });
}


