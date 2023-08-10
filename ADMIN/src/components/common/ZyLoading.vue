<template>
    <div id="loading" v-show="loading">
        <div class="mg-loading"></div>
    </div>
</template>

<script setup>
    import {ref, computed, watchEffect} from "vue";
    import {useShowLoading} from '@/hooks/sys/useLoading.js';

    const {setLoadingState, getLoadingState} = useShowLoading()

    const loading = ref(false)

    watchEffect(() => {
        loading.value = getLoadingState.value
    });

</script>

<style scoped lang="scss">

    #loading {
        position: absolute;
        z-index: 999;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(#F9F9F9,.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .mg-loading {
        position: relative;
        width: 50px;
        perspective: 200px;
    }

    .mg-loading:before,
    .mg-loading:after {
        position: absolute;
        width: 20px;
        height: 20px;
        content: "";
        animation: jumping 0.5s infinite alternate;
        background: rgba(0, 0, 0, 0);
    }

    .mg-loading:before {
        left: 0;
    }

    .mg-loading:after {
        right: 0;
        animation-delay: 0.15s;
    }

    @keyframes jumping {
        0% {
            transform: scale(1) translateY(0px) rotateX(0deg);
            box-shadow: 0 0 0 rgba(0, 0, 0, 0);
        }

        100% {
            transform: scale(1.2) translateY(-25px) rotateX(45deg);
            background: $color-primary;
            box-shadow: 0 25px 40px $color-primary;
        }
    }
</style>
