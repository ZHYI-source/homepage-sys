import {ref} from 'vue';
import {defineStore} from 'pinia';
import {useDbStore} from './db.js'
import storage from '../libs/util.strotage.js'
// 默认的 选中菜单
const defaultMenus = [
    {
        meta: {title: "首页"},
        name: "index",
        path: "/index"
    }
];

export const useMenuStore = defineStore('menu', () => {
    const isSidebarOpen = ref(true); // 默认打开侧边栏
    const openKeys = ref([]);
    const selectedKeys = ref([]);
    const db = useDbStore();

    function initKeys() {
        const storedData = storage.sysGet('sys')
        if (storedData) {
            // 如果本地存储中有数据，则使用存储的数据
            openKeys.value = storedData.openKeys || [defaultMenus[0].path];
            selectedKeys.value = storedData.selectedKeys || [defaultMenus[0].path];
            isSidebarOpen.value = storedData.isSidebarOpen || isSidebarOpen.value;
        } else {
            // 如果本地存储中没有数据，则使用默认值
            openKeys.value = [defaultMenus[0].path];
            selectedKeys.value = [defaultMenus[0].path];
            // 将默认数据存入数据库
            db.setSysInfo({
                isSidebarOpen: isSidebarOpen.value,
                selectedKeys: selectedKeys.value,
                openKeys: openKeys.value
            });
        }
    }

    // 初始化 openKeys selectedKeys isSidebarOpen
    initKeys();

    async function toggleSidebar() {
        isSidebarOpen.value = !isSidebarOpen.value;
        await db.setSysInfo({isSidebarOpen: isSidebarOpen.value});
    }

    function openKeysSet(path) {
        openKeys.value = [path];
    }

    function selectedKeysSet(path) {
        selectedKeys.value = [path];
    }

    return {
        isSidebarOpen,
        openKeys,
        selectedKeys,
        toggleSidebar,
        openKeysSet,
        selectedKeysSet
    };
});
