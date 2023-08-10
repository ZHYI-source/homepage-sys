<template>
    <div class="header-fullscreen">
        <a-tooltip placement="top" :title="!isFullscreen?'全屏':'退出全屏'">
            <IconFont :type="isFullscreen?'icon-quanping':'icon-quanping1'" class="header-icon" @click="toggleFullscreen"/>
        </a-tooltip>
    </div>
</template>

<script setup>
    import {ref, computed} from 'vue';
    import {useFullscreenStore} from '@/stores/fullscreen.js';

    const fullscreenStore = useFullscreenStore()
    const isFullscreen = computed(() => {
        return fullscreenStore.isFullscreen
    })
    const toggleFullscreen = () => {
        fullscreenStore.toggleFullscreen();
    }

</script>

<style lang="scss" scoped>
    .header-fullscreen {
        cursor: pointer;
        transition: all .2s linear;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;

        &:hover {
            color: $color-primary;
        }
        .header-icon {
            font-size: 18px;
        }

    }
</style>
