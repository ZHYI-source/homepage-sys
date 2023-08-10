import {useRouter} from 'vue-router'
import dbUtils from "./util.strotage";

/**
 * 检查路由对象是否具有权限
 * @param {Array} perms - 权限列表
 * @param {Object} route - 路由对象
 * @returns {boolean} - 是否具有权限
 */
function hasPermission(perms, route) {
    if (route.meta && route.meta.perms) {
        // 如果路由对象定义了 meta 属性或者定义 meta.perms 属性，那么就根据权限值来判断是否具有权限
        return perms.some(perm => route.meta.perms.includes(perm))
    } else {
        // 如果路由对象没有定义 meta 属性或者没有定义 meta.perms 属性，那么默认认为具有权限，返回 true。
        return true
    }
}

/**
 * 根据权限列表筛选异步路由配置
 * @param {Array} routes - 路由配置表
 * @param {Array} perms - 权限列表
 * @returns {Array} - 筛选后的路由配置
 */
function filterAsyncRouter(routes, perms) {
    const res = []

    routes.forEach(route => {
        // 创建临时变量 tmp  可以在后续的操作中不会修改原始的路由对象。
        const tmp = {...route}
        if (!tmp.hidden && tmp.children) {
            // 先对子路由进行深度筛选，确保子路由也符合权限要求
            tmp.children = filterAsyncRouter(tmp.children, perms)
            if (tmp.children && tmp.children.length > 0) {
                res.push(tmp)
            }
        } else {
            // 对于没有子路由的路由对象，直接进行权限判断
            if (!tmp.hidden && hasPermission(perms, tmp)) {
                res.push(tmp)
            }
        }
    })

    return res
}


export const menuList = function () {
    const asyncRoutes = useRouter().options.routes[0].children.filter(e => !e.hidden)
    //筛选路由表
    const permissionList = dbUtils.get('perms');
    if (!permissionList.length) {
        // 清空所有缓存数据
        dbUtils.clear()
        // 重置路由重新登录
        return useRouter().replace('/login')
    }
    let accessedRouters
    if (permissionList.includes('*')) {
        accessedRouters = asyncRoutes
    } else {
        accessedRouters = filterAsyncRouter(asyncRoutes, permissionList);
    }
    return accessedRouters
}




