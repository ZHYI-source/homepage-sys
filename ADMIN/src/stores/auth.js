import {defineStore} from 'pinia';
import {useRouter} from 'vue-router';
import {useDbStore} from './db.js'
import dbUtils from '../libs/util.strotage.js'
import {useTabsStore} from './tabs';
import {authLogin} from "../api/modules/api.auth";
import {ZyNotification} from "../libs/util.toast";
import {rolesFindOne} from "../api/modules/api.roles";
import {usersFindOne} from "../api/modules/api.users";


export const useAuthStore = defineStore('auth', () => {
    let router = useRouter()
    const db = useDbStore();
    // 重置tabs
    let tabStore = useTabsStore()

    async function logout() {
        // 执行退出登录逻辑，例如清除用户凭证和重置用户状态等
        // ...
        // 重置tabs
        tabStore.resetTabs()
        // 清除所有缓存
        db.removeAllInfo()

        // 导航到登录页或其他适当的页面
        await router.replace('/login');

    }

    async function login(value) {
        // 执行登录逻辑
        // ...
        return new Promise((resolve, reject) => {
            authLogin(value).then(res => {

                dbUtils.clear()
                dbUtils.set('token', res.data.token)

                usersFindOne({_id: res.data._id}).then(user=>{
                    // 存储用户信息
                    dbUtils.set('userInfo', {
                        ...user.data
                    })
                })
                rolesFindOne({id: res.data.roleId}).then(role => {
                    setPerm(role.data.perms)
                    // 导航到登录页或其他适当的页面
                    resolve({...res.data, ...role.data})

                    ZyNotification.success(`欢迎: ${res.data.nickname}`)
                    router.replace('/');
                })
            }).catch(err => {
                reject(err)
            })
        })
    }

    // 获取用户的角色权限列表数据 并且存储本地
    async function setPerm(value) {
        dbUtils.set('perms', value)
    }

    return {
        setPerm,
        logout,
        login,
    };

})
