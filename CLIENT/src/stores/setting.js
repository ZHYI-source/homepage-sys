import {ref} from 'vue';
import {defineStore} from 'pinia';
import setting from '@/setting.js'
// 默认的系统设置
const setData = {
    defaultThemes: (setting.theme.list.find(theme => theme.fixed === true)),
    defaultLocal: 'zh',
    defaultShowTagBar: true,
    defaultShowLogo: true,
    defaultShowLoading: false,
};

export const useSettingStore = defineStore('setting', () => {
    const theme = ref(setData.defaultThemes);
    const local = ref(setData.defaultLocal);
    const showLogo = ref(setData.defaultShowLogo);
    const showTagBar = ref(setData.defaultShowTagBar);
    const showLoading = ref(setData.defaultShowLoading);

    // 设置主题颜色
    function themeSet(type) {
        theme.value = setting.theme.list.find(theme => theme.name === type);
    }

    // 设置主题语言
    function localSet(type) {
        local.value = type;
    }

    function showLogoSet(value) {
        showLogo.value = value;
    }

    function showTagBarSet(value) {
        showTagBar.value = value;
    }
    function showLoadingSet(value) {
        showTagBar.value = value;
    }
    return {
        theme,
        local,
        showLogo,
        showTagBar,
        showLoading,
        themeSet,
        localSet,
        showLogoSet,
        showTagBarSet,
        showLoadingSet,
    };
});
