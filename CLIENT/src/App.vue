<script setup>
import ZyLoading from "./components/common/ZyLoading.vue";
import {onMounted} from 'vue'
import lazyLoadImages from "./libs/util.lazyLoad";

onMounted(()=>{
  // 懒加载图片
  lazyLoadImages();
})

</script>

<template>
  <RouterView/>
  <ZyLoading/>
</template>

<style scoped lang="scss">

</style>
