import {createRouter, createWebHashHistory} from 'vue-router'
import routes from './routes'
import {useLoadingStore} from "../stores/loading";

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    scrollBehavior(to, from, savedPosition) {
        return {
            // 也可以这么写
            // el: document.getElementById('main'),
            el: '#zy-layout-all-group',
            top: 0,
        }
    },
    routes
})

router.beforeEach((to, from, next) => {
    const {loading, setLoading} = useLoadingStore()

    if (to.matched.length === 0) {
        // 不存在的路由地址
        next('/404')
    } else {
        window.document.title = (to.query.title ? to.query.title : to.meta.title) + '-ZHOUYI'

        if (to.path !== from.path) {
            setLoading(true)
        }
        next();
    }

})

router.afterEach((to, from) => {
    const {loading, setLoading} = useLoadingStore()
    setTimeout(() => {
        setLoading(false)
    }, 1000)
})

export default router
