<script setup>
import {watchEffect, ref,computed} from 'vue'
import {ConfigProvider} from "ant-design-vue";
import {useSettingStore} from '@/stores/setting.js'
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh');


const settingStore = useSettingStore()
const locale = ref(zhCN);

// 监听全局主题状态
watchEffect(() => {
  const theme = settingStore.theme;
  const local = settingStore.local;
  locale.value = local === 'en' ? enUS : zhCN
  ConfigProvider.config({
    theme: theme.value,
  });
});

</script>

<template>
  <a-config-provider :locale="locale">
    <RouterView/>
  </a-config-provider>
</template>

<style scoped lang="scss">

</style>
