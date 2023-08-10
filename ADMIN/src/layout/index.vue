<template>
  <main class="container" >
    <a-layout class="container-layout">
      <a-layout-sider class="container-sider"  theme="light" :collapsed="!isSidebarOpen" :trigger="null"
                      collapsible>
        <ZYMenuSide />
      </a-layout-sider>
      <a-layout class="container-main" :style="themeStyle">
        <ZYHeader/>
        <ZYTabs v-if="showTagBar"/>
        <panel-search v-if="searchActive"></panel-search>
        <!--页面内容-->
        <a-layout-content
            v-if="!searchActive"
            class="content-main"
            :style="{
          marginRight: '15px',
          padding: '10px',
          borderTopRightRadius:'5px',
          borderRight:'1px solid #f0f0f0',
          borderLeft:'1px solid #f0f0f0',
           position:'relative',
          background: '#fff',
          minHeight: '280px',
          minWidth: '375px'}"
        >
          <router-view v-slot="{ Component, route }">
            <transition name="fade-transverse" mode="out-in">
              <keep-alive :include="getIncludedComponents(route)"
                          :exclude="getExcludedComponents(route)">
                <component :is="Component" :key="route.fullPath"/>
              </keep-alive>
            </transition>
          </router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </main>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref, watchEffect} from 'vue';
import ZYHeader from "./components/zy-header/index.vue";
import ZYTabs from "./components/zy-tabs/index.vue";
import ZYMenuSide from "./components/zy-side/index.vue";
import PanelSearch from "./components/zy-header/panel-search.vue";
import hotkeys from 'hotkeys-js';
import {useMenuStore} from '@/stores/menu.js';
import {useSettingStore} from '@/stores/setting.js';
import {useSearchStore} from '@/stores/search.js';
import {adjustColorOpacity} from "../libs/util.common";


const menuStore = useMenuStore()
const settingStore = useSettingStore()
const searchStore = useSearchStore()

const isSidebarOpen = ref(menuStore.isSidebarOpen)

watchEffect(()=>{
  isSidebarOpen.value = menuStore.isSidebarOpen
})

const searchActive = computed(() => {
  return searchStore.searchActive
})
const showTagBar = computed(() => {
  return settingStore.showTagBar
})
let executedOnce = false; // 跟踪是否已执行过一次
const handleResize = (e) => {
  if (window.innerWidth < 900 && !executedOnce) {
    menuStore.toggleSidebar();
    executedOnce = true; // 设置为已执行过一次
  } else if (window.innerWidth >= 900 && executedOnce) {
    executedOnce = false; // 如果窗口宽度大于等于900且已执行过一次，则重置为未执行
    menuStore.toggleSidebar();
  }

};


hotkeys(searchStore.hotkey.open, event => {
  event.preventDefault()
  console.log("ss")
  searchStore.showSearchPanel(true)
})

hotkeys(searchStore.hotkey.close, event => {
  event.preventDefault()
  console.log("ccc")
  searchStore.showSearchPanel(false)
})


onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});


const themeStyle = ref({});
watchEffect(() => {
  let theme = settingStore.theme
  themeStyle.value.backgroundColor = adjustColorOpacity(theme.value.primaryColor, 10)
})


const getIncludedComponents = (route) => {
  const includedComponents = [];
  if (route.meta.cache) {
    includedComponents.push(route.component);
  }
  return includedComponents;
}

const getExcludedComponents = (route) => {
  const excludedComponents = [];
  if (!route.meta.cache) {
    excludedComponents.push(route.component);
  }
  return excludedComponents;
}
</script>

<style scoped lang="scss">

</style>
