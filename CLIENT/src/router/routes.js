/**
 * 在主框架内显示
 */
const frameIn = [
    {
        path: '/',
        redirect: {name: 'index'},
        component: () => import('@/layout/index.vue'),
        children: [
            // 首页
            {
                path: '/index',
                name: 'index',
                meta: {
                    title: '首页',
                },
                component: () => import('@/views/home/index.vue'),
            },
            {
                path: '/blog',
                name: 'blog',
                meta: {
                    title: '博客文章',
                },
                component: () => import('@/views/blog/index.vue'),
            },
            {
                path: '/PostDetail/:id',
                name: 'PostDetail',
                meta: {
                    title: '博客详情',
                },
                component: () => import('@/views/blog/PostDetail.vue'),
            },
            {
                path: '/portfolio',
                name: 'portfolio',
                meta: {
                    auth: true,
                    title: '作品集',
                },
                component: () => import('@/views/portfolio/index.vue'),
            },
            {
                path: '/contact',
                name: 'contact',
                meta: {
                    auth: true,
                    title: '留言板',
                },
                component: () => import('@/views/contact/index.vue'),
            },
        ]
    }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
    // 登录
    // {
    //     path: '/login',
    //     name: 'login',
    //     meta: {
    //         title: '登录',
    //     },
    //     component: _import('system/login')
    // }
]

/**
 * 错误页面
 */
const errorPage = [
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import('@/views/404/index.vue'),
        meta: {
            title: '404',
        },
    }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
    ...frameIn,
    ...frameOut,
    ...errorPage
]
