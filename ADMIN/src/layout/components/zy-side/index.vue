<template>
  <section class="menu-side" :style="themeStyle">
    <ZyHeaderLogo :isSidebarOpen="isSidebarOpen" v-if="showLogo" :title="webSiteTitle"/>
    <a-menu class="side-menu-list"
            :selectedKeys="selectedKeys"
            :openKeys="openKeys"
            mode="inline"
    >
      <template v-for="item in menuListData">
        <template v-if="!item.children">
          <a-menu-item :key="item.path" @click="handleMenuItem(item)">
            <IconFont :type="item.meta.icon?`icon-${item.meta.icon}`:'icon-shezhi'"/>
            <span>{{ item.meta.title }}</span>
          </a-menu-item>
        </template>
        <template v-else>
          <RecursiveMenuItem
              :key="item.path"
              :menu-info="item"
              @menu-click="handleMenuItem"
          />
        </template>
      </template>

    </a-menu>
  </section>
</template>

<script setup>
import {UserOutlined} from '@ant-design/icons-vue';
import {ref, computed, watch, watchEffect} from 'vue';
import {useRouter} from 'vue-router';

import {useMenuStore} from '@/stores/menu.js';
import {useDbStore} from '@/stores/db.js';
import {menuList} from '@/libs/util.menu.js';
import storage from '@/libs/util.strotage.js'
import {useTabsStore} from '@/stores/tabs.js';
import {useSettingStore} from '@/stores/setting.js';
import RecursiveMenuItem from "./RecursiveMenuItem.vue";
import ZyHeaderLogo from "comps/common/ZyHeaderLogo.vue";
import {adjustColorOpacity} from "../../../libs/util.common";
import setting from '@/setting.js';
// 使用 useMenuStore 获取菜单存储实例
const menuStore = useMenuStore();
const dbStore = useDbStore();
const tabsStore = useTabsStore();
const settingStore = useSettingStore();
// 使用 useRouter 获取路由实例
const router = useRouter();

// 使用 ref 创建响应式的变量
const themeStyle = ref({});
const menuListData = ref([]);
const selectedKeys = ref(menuStore.selectedKeys);
const openKeys = ref(menuStore.openKeys)
const webSiteTitle = ref(setting.websiteInfo.name)

// 初始化菜单 并且联动初始化tabs激活项
const initMenus = () => {
  menuListData.value = menuList();
  let tR = router.currentRoute.value
  tabsStore.currentSet(tR.path)
};

// 计算属性，用于判断是否展开侧边栏
const isSidebarOpen = computed(() => {
  return !menuStore.isSidebarOpen;
});
const showLogo = computed(() => {
  return settingStore.showLogo
})


/*****其他工具函数*****/

// 路由有父元素则返回该路由和父元素
function findItemWithParent(data, itemId) {
  for (const item of data) {
    if (item.path === itemId) {
      // 找到目标项，返回它的父元素
      return item; // 如果根节点也是目标项，可以返回 null 或其他合适的值
    }
    if (item.children) {
      const parent = findItemWithParent(item.children, itemId);
      if (parent) {
        // 找到目标项的父元素，将其返回
        return {...item}; // 这里根据实际情况返回父元素的副本或其他数据处理
      }
    }
  }
  return null; // 没有找到目标项及其父元素，返回 null 或其他合适的值
}

/********************/

watchEffect(() => {
  const currentOpenKeys = menuStore.openKeys;
  const currentSelectedKeys = menuStore.selectedKeys;
  const currentMenuParent = findItemWithParent(router.options.routes[0].children, currentOpenKeys[0]);
  openKeys.value = Array.from(new Set([currentMenuParent.path, currentOpenKeys[0]]));

  selectedKeys.value = [currentSelectedKeys[0]];
  let theme = settingStore.theme
  themeStyle.value.backgroundColor = adjustColorOpacity(theme.value.primaryColor, 10)

  // 菜单数据持久化
  dbStore.setSysInfo({selectedKeys: selectedKeys.value, openKeys: openKeys.value});
});


// 导航到指定路由
const navigateTo = (key) => {
  router.push(key);
};

// 处理菜单项点击事件
const handleMenuItem = (item) => {
  let {path, meta} = item
  selectedKeys.value = [path]
  if (meta && meta.link) {
    window.open(path, '_blank')
  } else {
    tabsStore.addTabs(item)
    tabsStore.currentSet(path)
  }


};


// 初始化菜单数据
initMenus();

</script>


<style lang="scss" scoped>
.menu-side {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: $color-bg;

  .side-menu-list {
    height: calc(100% - 60px);
    overflow: hidden;
    overflow-y: auto;
    background-color: transparent;
    border: none;
  }
}
</style>
