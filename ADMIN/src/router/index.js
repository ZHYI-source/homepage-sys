import {createRouter, createWebHashHistory} from 'vue-router'
import routes from './routes'
import dbUtils from '../libs/util.strotage.js'
import {useSearchStore} from '@/stores/search.js'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return {x: 0, y: 0};
        }
    },
    routes
})

function hasPermission(perms, route) {
    if (perms.includes('*')) return true
    if (route.meta && route.meta.perms) {
        // 如果路由对象定义了 meta 属性或者定义 meta.perms 属性，那么就根据权限值来判断是否具有权限
        return perms.some(perm => route.meta.perms.includes(perm))
    } else {
        // 如果路由对象没有定义 meta 属性或者没有定义 meta.perms 属性，那么默认认为具有权限，返回 true。
        return true
    }
}

router.beforeEach(async (to, from, next) => {
    const searchStore = useSearchStore()
    searchStore.showSearchPanel(false)
    // 检查是否需要登录
    if (to.meta.requiresAuth) {
        const isLoggedIn = dbUtils.get('token')
        // 检查用户是否已经登录
        if (isLoggedIn) {
            // 已经登录 访问登录页则直接跳到主页
            if (to.name === 'login') {
                return next('/');
            }
            // 已经登录 访问非登录页则需要验证权限
            const permissionList = dbUtils.get('perms');
            // 如果还未找到缓存的权限数组则返回登录页
            if (!permissionList) {
                // 清空所有缓存数据
                dbUtils.clear()
                // 重定向到登录页
                return next({name: 'login'});
            }
            const hasRoles = hasPermission(permissionList, to)
            if (hasRoles) {
                // 有权限直接访问
                return next();
            }
            // 无权限则重定向到401
            return next({name: '401'});
        }
        // 未登录
        // 清空所有缓存数据
        dbUtils.clear()
        // 重定向到登录页
        return next({name: 'login'});
    }
    // 无需登录的页面 直接访问即可
    next();
});


router.afterEach((to, from) => {
    window.document.title = to.meta.title + " - ZY'Admin";
})

router.onError((error) => {
    // 在这里处理路由错误
    console.error('路由错误:', error);
});

export default router
