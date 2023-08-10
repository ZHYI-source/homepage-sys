<template>
    <section>
        <a-space>
            <a-image
                    width="60px"
                    height="60px"
                    v-for="(item,index) in fileList"
                    :key="index"
                    :src="item"/>
        </a-space>
    </section>
</template>

<script setup>
    import {ref, watch} from 'vue'

    const props = defineProps({
        urls: {
            type: Array,
            default: () => []
        }
    })
    const fileList = ref([])

    watch(props.urls, (newValue) => {
        fileList.value = [...props.urls]
    });
</script>

<style scoped>

</style>
