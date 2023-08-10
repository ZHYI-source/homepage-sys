<template>
    <a-layout-header class="container-header" id="zy-header">
        <a-row type="flex" align="middle" justify="space-between">
            <a-col flex="45px">
                <menu-unfold-outlined
                        v-if="isSidebarOpen"
                        class="trigger"
                        @click="toggleSidebarAt"
                />
                <menu-fold-outlined v-else class="trigger" @click="toggleSidebarAt"/>
            </a-col>
            <a-col flex="2/3" class="weather-box" style="display: flex;justify-content: center;align-items: center">
                <iframe name="weather_inc" src="http://i.tianqi.com/?c=code&id=1" width="600" height="25" frameborder="0"
                        marginwidth="0" marginheight="0" scrolling="no"></iframe>
            </a-col>
            <a-col flex="auto">
                <a-row type="flex" align="middle" justify="end">
                    <a-space :size="12">
                        <HeaderSearch/>
                        <HeaderFullscreen/>
                        <HeaderUser/>
                        <HeaderSetting/>
                    </a-space>
                </a-row>
            </a-col>
        </a-row>
    </a-layout-header>
</template>

<script setup>
    import {
        MenuUnfoldOutlined,
        MenuFoldOutlined,
    } from '@ant-design/icons-vue';
    import {ref, computed, watchEffect} from 'vue';
    import {useMenuStore} from '@/stores/menu.js';
    import HeaderUser from "./header-user.vue";
    import HeaderFullscreen from "./header-fullscreen.vue";
    import HeaderSetting from "./header-setting.vue";
    import HeaderTheme from "./header-theme.vue";
    import HeaderSearch from "./header-search.vue";

    const menuStore = useMenuStore()

    const isSidebarOpen = computed(() => {
        return !menuStore.isSidebarOpen
    })

    const toggleSidebarAt = () => {
        menuStore.toggleSidebar()
    }


</script>

<style lang="scss">

    .container-header {
        box-sizing: border-box;
        height: 60px;
        line-height: 60px;
        background-color: transparent;

        .notify {
            color: #a8a5a5;
            font-size: 1.5rem;
            font-weight: 700;
            font-family: Bubblegum Sans, cursive;
            text-shadow: 0 0 2px $color-primary;
        }
    }
</style>
