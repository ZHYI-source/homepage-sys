<template>
    <a-sub-menu :key="menuInfo.path">
        <template #icon>
            <IconFont :type="menuInfo.meta.icon?`icon-${menuInfo.meta.icon}`:'icon-shezhi'"/>
        </template>
        <template #title>{{ menuInfo.meta.title }}</template>
        <template v-for="item in menuInfo.children" :key="item.path">
            <template v-if="!item.children">
                <a-menu-item :key="item.path" @click="handleMenuItem(item)" :style="themeStyle">
                    <template #icon>
                        <IconFont :type="item.meta.icon?`icon-${item.meta.icon}`:'icon-shezhi'"/>
                    </template>
                    {{ item.meta.title }}
                </a-menu-item>
            </template>
            <template v-else>
                <RecursiveMenuItem
                        :menu-info="item"
                        :key="item.path"
                        @menu-click="handleMenuItem"/>
            </template>
        </template>
    </a-sub-menu>
</template>

<script setup>
    // 定义接收的props
    import {ref, watchEffect} from "vue";
    import {adjustColorOpacity} from "../../../libs/util.common";
    import {useSettingStore} from "../../../stores/setting";

    const settingStore = useSettingStore();
    const props = defineProps(
        {
            menuInfo: {
                type: Object,
                default: () => ({}),
            },
        }
    )
    // 定义可触发的事件
    const emit = defineEmits(['menu-click',])

    const handleMenuItem = (item) => {
        // 触发自定义事件
        emit('menu-click', item);
    };
    const themeStyle = ref({});
    watchEffect(() => {
        let theme = settingStore.theme
        themeStyle.value.backgroundColor = adjustColorOpacity(theme.value.primaryColor, 10)
    })

</script>

<style scoped>

</style>
