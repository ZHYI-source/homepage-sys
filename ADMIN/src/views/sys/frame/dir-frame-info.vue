<template>
    <section style="width: 100%;">
        <Spin :spinning="loading" size="large">
            <iframe :src="meta.frameSrc" width="100%" :height="height"></iframe>
        </Spin>
    </section>
</template>

<script setup>
    import {ref, unref, onMounted} from 'vue'
    import {useRouter} from 'vue-router';
    import {Spin} from 'ant-design-vue';

    const {currentRoute} = useRouter()
    const {meta} = unref(currentRoute.value);
    const height = ref('600px')
    const width = ref('600px')
    const loading = ref(true)

    onMounted(() => {
        let header = document.getElementById('zy-header')
        let tab = document.getElementById('zy-tab')
        height.value = (window.innerHeight - tab.offsetHeight - header.offsetHeight - 50) + 'px'
        width.value = (window.innerWidth - 200 - 32) + 'px'
        setTimeout(() => {
            loading.value = false
        }, 500)

    })


</script>

<style scoped>

</style>
