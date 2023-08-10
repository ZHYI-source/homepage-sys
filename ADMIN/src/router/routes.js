/**
 * 在主框架内显示
 * 路由配置说明
 * {
      path: '/dir-demo-info',    // 页面地址（唯一）
      name: 'dir-demo-info',     // 页面名称（唯一）
      hidden: false,              // 隐藏（不展示在侧边栏菜单）
      meta: {
          title: '用户管理',       // 页面标题
          icon: 'yonghuguanli',  // 页面图标
          cache: true,          // 页面是否进行缓存 默认true
          link: false,           // 页面是否是外链 默认false
          frameSrc: false,       // 页面是否是内嵌 默认false
          requiresAuth: true,   // 页面是否是需要登录 默认true
          perms: [               // 页面的操作的权限列表
              'sys:users:list',   // 查询
              'sys:users:create', // 增加
              'sys:users:update', // 更新
              'sys:users:delete', // 删除
          ],
      },
      component: () => import('@/views/sys/users/dir-users-info.vue'),// 懒加载页面组件
   }
 *
 */
const frameIn = [
    {
        path: '/',
        redirect: {name: 'index'},
        component: () => import('@/layout/index.vue'),
        /*************************************************************************************/
        /********************children 建议最多 再加一级children  否则侧边栏体验不好*********************/
        /*************************************************************************************/
        children: [
            {
                path: '/index',
                name: 'index',
                meta: {
                    cache: true,
                    title: '首页',
                    icon: 'shouye',
                    requiresAuth: true,
                },
                component: () => import('@/views/home/index.vue'),
            },
            {
                path: '/pages',
                name: 'pages',
                meta: {
                    cache: true,
                    title: '页面示例',
                    requiresAuth: true,
                    perms: ['pages'],
                },
                children: [
                    {
                        path: '/dir-max-info',
                        name: 'dir-max-info',
                        meta: {
                            cache: true,
                            title: '数据中心',
                            requiresAuth: true,
                        },
                        component: () => import('@/views/demo/pages/dir-max-info.vue'),
                    },
                    {
                        path: '/dir-color-info',
                        name: 'dir-color-info',
                        meta: {
                            cache: true,
                            title: '颜色板',
                            requiresAuth: true,
                        },
                        component: () => import('@/views/demo/pages/dir-color-info.vue'),
                    },
                    {
                        path: '/dir-test-info',
                        name: 'dir-test-info',
                        meta: {
                            cache: true,
                            title: '测试页面',
                            requiresAuth: true,
                        },
                        component: () => import('@/views/demo/pages/dir-test-info.vue'),
                    },
                    {
                        path: '/dir-page-info',
                        name: 'dir-page-info',
                        meta: {
                            cache: true,
                            title: '综合页面',
                            requiresAuth: true,
                            perms: ['pages:all'],
                        },
                        component: () => import('@/views/demo/pages/dir-page-info.vue'),
                    }
                ]

            },
            {
                path: '/components',
                name: 'components',
                meta: {
                    cache: true,
                    title: '组件示例',
                    icon: 'shezhi',
                    requiresAuth: true,
                    perms: ['components'],
                },
                children: [
                    {
                        path: '/echart',
                        name: 'echart',
                        meta: {
                            cache: true,
                            title: '图表地图',
                            requiresAuth: true,
                            perms: ['components:echart'],
                        },
                        children: [
                            {
                                path: '/guizhouMap',
                                name: 'guizhouMap',
                                meta: {
                                    cache: true,
                                    title: '贵州地图',
                                    requiresAuth: true,
                                    perms: ['components:echart:guizhouMap'],
                                },
                                component: () => import('@/views/demo/echarts/guizhou.vue'),
                            },
                            {
                                path: '/chinaMap',
                                name: 'chinaMap',
                                meta: {
                                    cache: true,
                                    title: '中国地图',
                                    requiresAuth: true,
                                    perms: ['components:echart:chinaMap'],
                                },
                                component: () => import('@/views/demo/echarts/china.vue'),
                            },
                            {
                                path: '/worldMap',
                                name: 'worldMap',
                                meta: {
                                    cache: true,
                                    title: '世界地图',
                                    requiresAuth: true,
                                    perms: ['components:echart:worldMap'],
                                },
                                component: () => import('@/views/demo/echarts/world.vue'),
                            },
                            {
                                path: '/line',
                                name: 'line',
                                meta: {
                                    cache: true,
                                    title: '折线图',
                                    requiresAuth: true,
                                    perms: ['components:echart:line'],
                                },
                                component: () => import('@/views/demo/echarts/line.vue'),
                            },
                            {
                                path: '/pie',
                                name: 'pie',
                                meta: {
                                    cache: true,
                                    title: '饼图',
                                    requiresAuth: true,
                                    perms: ['components:echart:pie'],
                                },
                                component: () => import('@/views/demo/echarts/pie.vue'),
                            },
                        ]

                    },
                    {
                        path: '/editor',
                        name: 'editor',
                        meta: {
                            cache: true,
                            title: '富文本',
                            requiresAuth: true,
                            perms: ['components:editor'],
                        },
                        children: [
                            {
                                path: '/Tinymce',
                                name: 'Tinymce',
                                meta: {
                                    cache: true,
                                    title: 'Tinymce',
                                    requiresAuth: true,
                                    perms: ['components:editor:Tinymce'],
                                },
                                component: () => import('@/components/Tinymce/index.vue'),
                            },
                            {
                                path: '/Vditor',
                                name: 'Vditor',
                                meta: {
                                    cache: true,
                                    title: 'Vditor',
                                    requiresAuth: true,
                                    perms: ['components:editor:Vditor'],
                                },
                                component: () => import('@/components/Vditor/index.vue'),
                            },
                            {
                                path: '/VMdEditor',
                                name: 'VMdEditor',
                                meta: {
                                    cache: true,
                                    title: 'Markdown',
                                    requiresAuth: true,
                                    perms: ['components:editor:VMdEditor'],
                                },
                                component: () => import('@/components/VMdEditor/index.vue'),
                            }
                        ]

                    },
                ]
            },
            {
                path: '/blog',
                name: 'blog',
                meta: {
                    cache: true,
                    title: '博客管理',
                    icon: 'shezhi',
                    requiresAuth: true,
                    perms: ['blog'],
                },
                children: [
                    {
                        path: '/dir-blog_articles-info',
                        name: 'dir-blog_articles-info',
                        meta: {
                            cache: true,
                            title: '博文管理',
                            requiresAuth: true,
                            perms: [
                                'blog:blog_articles:list',
                                'blog:blog_articles:create',
                                'blog:blog_articles:update',
                                'blog:blog_articles:delete'
                            ],
                        },
                        component: () => import('@/views/blog/dir-blog_articles-info.vue'),
                    },
                    {
                        path: '/dir-portfolios-info',
                        name: 'dir-portfolios-info',
                        meta: {
                            cache: true,
                            title: '作品管理',
                            requiresAuth: true,
                            perms: [
                                'blog:portfolios:list',
                                'blog:portfolios:create',
                                'blog:portfolios:update',
                                'blog:portfolios:delete'
                            ],
                        },
                        component: () => import('@/views/blog/dir-portfolios-info.vue'),
                    },
                    {
                        path: '/dir-messages-info',
                        name: 'dir-messages-info',
                        meta: {
                            cache: true,
                            title: '留言管理',
                            requiresAuth: true,
                            perms: [
                                'blog:messages:list',
                                'blog:messages:create',
                                'blog:messages:update',
                                'blog:messages:delete',
                            ],
                        },
                        component: () => import('@/views/blog/dir-messages-info.vue'),
                    }
                ]
            },

            {
                path: '/sys',
                name: 'sys',
                meta: {
                    title: '系统管理',
                    icon: 'shezhi',
                    requiresAuth: true,

                },
                children: [
                    {
                        path: '/dir-users-info',
                        name: 'dir-users-info',
                        meta: {
                            title: '用户管理',
                            icon: 'yonghuguanli',
                            requiresAuth: true,
                            perms: [
                                'sys:users:list',
                                'sys:users:create',
                                'sys:users:update',
                                'sys:users:delete',
                                'sys:users:reset',
                            ],
                        },
                        component: () => import('@/views/sys/users/dir-users-info.vue'),
                    },
                    {
                        path: '/dir-roles-info',
                        name: 'dir-roles-info',
                        meta: {
                            title: '角色管理',
                            icon: 'caidanguanli',
                            requiresAuth: true,
                            perms: [ //页面的操作的权限
                                'sys:roles:list',
                                'sys:roles:create',
                                'sys:roles:update',
                                'sys:roles:delete',
                            ],
                        },
                        component: () => import('@/views/sys/roles/dir-roles-info.vue'),
                    },
                    {
                        path: '/dir-permissions-info',
                        name: 'dir-permissions-info',
                        meta: {
                            title: '权限管理',
                            icon: 'yonghuguanli',
                            requiresAuth: true,
                            perms: [
                                'sys:permissions:list',
                                'sys:permissions:create',
                                'sys:permissions:update',
                                'sys:permissions:delete',
                                'sys:permissions:reset',
                            ],
                        },
                        component: () => import('@/views/sys/permission/dir-permissions-info.vue'),
                    },
                    {
                        path: '/dir-users_opt_logs-info',
                        name: 'dir-users_opt_logs-info',
                        meta: {
                            title: '操作日志',
                            icon: 'yonghuguanli',
                            requiresAuth: true,
                            perms: [
                                'sys:users_opt_logs:list',
                                'sys:users_opt_logs:create',
                                'sys:users_opt_logs:update',
                                'sys:users_opt_logs:delete',
                                'sys:users_opt_logs:deleteAll',
                                'sys:users_opt_logs:export',
                            ],
                        },
                        component: () => import('@/views/sys/optLogs/dir-users_opt_logs-info.vue'),
                    },
                    {
                        path: '/dir-resources-info',
                        name: 'dir-resources-info',
                        meta: {
                            title: '资源管理',
                            icon: 'yonghuguanli',
                            requiresAuth: true,
                            perms: [
                                'sys:resources:list',
                                'sys:resources:create',
                                'sys:resources:update',
                                'sys:resources:delete'
                            ],
                        },
                        component: () => import('@/views/sys/resources/dir-resources-info.vue'),
                    }
                ]
            },
            {
                path: '/dev',
                name: 'dev',
                meta: {
                    cache: true,
                    title: '开发工具',
                    requiresAuth: true,
                },
                children: [
                    {
                        path: '/dir-codes-info',
                        name: 'dir-codes-info',
                        meta: {
                            cache: true,
                            title: '代码生成',
                            requiresAuth: true,
                            perms: [
                                'dev:codes:list',
                                'dev:codes:delete',
                                'dev:codes:deleteAll',
                                'dev:codes:singleCurdFrontAndBack',
                            ],
                        },
                        component: () => import('@/views/dev/code/dir-codes-info.vue'),
                    },
                    {
                        path: '/dir-icon-info',
                        name: 'dir-icon-info',
                        meta: {
                            title: '图标列表',
                            requiresAuth: true,
                            icon: 'shezhi',
                            perms: ['dev:icon'],
                        },
                        component: () => import('@/views/dev/icon/dir-icon-info.vue'),
                    },
                ]

            },
            {
                path: 'frame',
                name: 'frame',
                meta: {
                    frameSrc: 'http://blog.zhouyi.run/#/',
                    title: '博客主页',
                    requiresAuth: true,
                    icon: 'wailian_icon',
                },
                component: () => import('@/views/sys/frame/dir-frame-info.vue'),
            },
            {
                path: 'https://gitee.com/Z568_568',
                meta: {
                    link: true,
                    title: '源码',
                    requiresAuth: true,
                    icon: 'github'
                },
            },

            // 重定向页面 必须保留
            {
                path: '/redirect/:path(.*)/:_origin_params(.*)?',
                name: 'Redirect',
                hidden: true,//不展示在侧边栏菜单
                meta: {
                    title: '重定向',
                },
                component: () => import('@/views/sys/function/redirect'),
            },
        ]
    },
]

/**
 * 在主框架之外显示
 */
const frameOut = [
    // 登录
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录',
        },
        component: () => import('@/views/sys/login/dir-login-info.vue'),
    },
    {
        path: '/dataCenter',
        name: 'dataCenter',
        meta: {
            title: '大屏展示',
        },
        component: () => import('@/views/demo/dataCenter/index.vue'),
    }
]

/**
 * 错误页面
 */
const errorPage = [
    {
        path: '/401',
        name: '401',
        component: () => import('@/views/error/401.vue'),
        meta: {
            title: '401',
        },
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import('@/views/error/404.vue'),
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
