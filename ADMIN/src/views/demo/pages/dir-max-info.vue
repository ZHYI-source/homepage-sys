<template>
    <section ref="maxRef" class="max">
        大屏展示
        <a-button @click="toggleFullscreen">打开大屏</a-button>
    </section>
</template>

<script setup>
    import {ref, onMounted} from 'vue'
    import {useRouter} from 'vue-router'
    const maxRef = ref(null)
    const isFullscreen = ref(false)
    const router=useRouter()
    const toggleFullscreen = () => {
        isFullscreen.value = !isFullscreen.value;
        let ele = maxRef.value
        if (isFullscreen.value) {
            router.push('/dataCenter')
            // 进入全屏
            if (ele.requestFullscreen) {
                ele.requestFullscreen();
            } else if (ele.mozRequestFullScreen) {
                ele.mozRequestFullScreen();
            } else if (ele.webkitRequestFullscreen) {
                ele.webkitRequestFullscreen();
            } else if (ele.msRequestFullscreen) {
                ele.msRequestFullscreen();
            }


        } else {
            // 退出全屏
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
    onMounted(()=>{
        // toggleFullscreen()
    })

</script>

<style lang="scss" scoped>
.max {
    height: 100%;
    background-color: #fff;
}
</style>
