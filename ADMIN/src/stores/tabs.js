import {ref} from 'vue';
import {defineStore} from 'pinia';
import {useMenuStore} from './menu.js';
import db from '../libs/util.strotage';
import {useRouter} from 'vue-router';


// 去重函数，根据 key 去重
function unique(arr, key) {
    if (!arr) return arr;
    if (key === undefined) return [...new Set(arr)];
    const map = {
        'string': e => e[key],
        'function': e => key(e),
    };
    const fn = map[typeof key];
    const obj = arr.reduce((o, e) => ((o[fn(e)] = e), o), {});
    return Object.values(obj);
}

// 根据路径从数组中移除对应的项
function removeFromArrayByPath(arr, pathToDelete) {
    const indexToDelete = arr.findIndex(item => item.path === pathToDelete);
    if (indexToDelete !== -1) {
        arr.splice(indexToDelete, 1);
    }
}

export const useTabsStore = defineStore('tabs', () => {
    // 默认的 tabs
    let defaultTabs = [
        {
            meta: {auth: true, title: "首页"},
            name: "index",
            path: "/index"
        }
    ];
    const router = useRouter();
    let tabsList = ref([]);
    let current = ref(defaultTabs[0].path);

    // 初始化 tabs
    function initTabs() {
        tabsList.value = []
        const storedTabs = db.get('tabs');
        const tabs = storedTabs || defaultTabs;
        tabsList.value = tabs;
        current.value = tabs[0].path;
        db.set('tabs', tabs);
    }

    initTabs()

    function resetTabs() {
        tabsList.value = []
        defaultTabs = [{
            meta: {auth: true, title: "首页"},
            name: "index",
            path: "/index"
        }]
        tabsList.value = defaultTabs;
        current.value = defaultTabs[0].path;
    }

    // 添加新的 tab
    function addTabs(item) {
        tabsList.value.push(item);
        tabsList.value = unique(tabsList.value, 'path');
        db.set('tabs', tabsList.value);
    }

    // 移除指定的 tab
    function removeTabs(key) {
        const tabIndex = tabsList.value.findIndex(item => item.path === key);
        const currentIndex = tabsList.value.findIndex(item => item.path === current.value);

        // 先进行删除
        removeFromArrayByPath(tabsList.value, key);
        db.set('tabs', tabsList.value);

        // 再设置激活项
        if (tabIndex >= 0) {
            // 后一个 下标
            const tabNextIndex = Math.min(tabIndex + 1, tabsList.value.length - 1);
            // 前一个 下标
            const tabPreIndex = Math.max(tabIndex - 1, 0);
            const tabNextItem = tabsList.value[tabNextIndex];
            const tabPreIndexItem = tabsList.value[tabPreIndex];
            // 选中项和将要删除的项不是同一个则不改变激活项
            if (currentIndex !== tabIndex) {
                return currentSet(current.value);
            }
            // 如果前后都无法找到则设置激活项为第一个 （激活首页）
            currentSet(tabNextItem ? tabNextItem.path : (tabPreIndexItem ? tabPreIndexItem.path : tabsList.value[0].path));
        } else {
            currentSet(tabsList.value[0].path);
        }
    }


    // 设置当前选中的 tab
    function currentSet(path) {
        const menuStore = useMenuStore();
        //设置tabs和侧边栏的激活菜单
        menuStore.selectedKeysSet(path);
        menuStore.openKeysSet(path);
        current.value = path;
        router.push(path)
    }

    return {
        tabsList,
        defaultTabs,
        current,
        resetTabs,
        addTabs,
        currentSet,
        removeTabs,
        initTabs
    };
});
