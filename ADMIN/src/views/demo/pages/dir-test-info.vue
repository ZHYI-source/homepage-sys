<template>
    <section>
        <a-space>
            <a-button size="small" type="primary">
                <IconFont type="icon-upload"/>
                下载图片
            </a-button>
            <ZyUpload :showUploadList="true"/>
        </a-space>
    </section>

</template>

<script setup>
    import {reactive, ref, watchEffect, toRaw, watch} from 'vue'
    import {uploadImg} from "api/modules/api.test";
    import {ZyNotification} from "libs/util.toast";
    import dbUtils from "libs/util.strotage";
    import ZyUpload from "comps/common/ZyUpload.vue";
</script>

<style lang="scss" scoped>

</style>
