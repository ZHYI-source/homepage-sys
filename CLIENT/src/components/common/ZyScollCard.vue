<template>
    <div class="stage" ref="stageRef">
        <div class="container">
            <div class="ring">
                <div class="img"
                     v-for="i in numImages"
                     :key="i"
                     :style="getImageStyle(i - 1)"
                     @mouseenter="handleMouseEnter(i)"
                     @mouseleave="handleMouseLeave">

                    哈哈哈
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
    import {onMounted, onBeforeUnmount} from 'vue';
    import {gsap} from 'gsap';
    import {ref} from 'vue'

    const stageRef = ref(null);
    const numImages = 6;
    let xPos = 0;

    // 初始化 '.ring' 元素的位置
    const initRingPosition = () => {
        gsap.set('.ring', {rotationY: 90, cursor: 'grab'});
    };

    // 鼠标按下或触摸开始事件处理函数
    const dragStart = (e) => {
        if (e.touches) e.clientX = e.touches[0].clientX;
        xPos = Math.round(e.clientX);
        gsap.set('.ring', {cursor: 'grabbing'});
        window.addEventListener('mousemove', drag);
        window.addEventListener('touchmove', drag);
    };

    // 鼠标或触摸移动事件处理函数
    const drag = (e) => {
        if (e.touches) e.clientX = e.touches[0].clientX;
        gsap.to('.ring', {
            rotationY: '-=' + ((Math.round(e.clientX) - xPos) % 360),
            onUpdate: () => {
                gsap.set('.img', {backgroundPosition: (i) => getBgPos(i)});
            },
        });

        xPos = Math.round(e.clientX);
    };

    // 鼠标或触摸结束事件处理函数
    const dragEnd = () => {
        window.removeEventListener('mousemove', drag);
        window.removeEventListener('touchmove', drag);
        gsap.set('.ring', {cursor: 'grab'});
    };

    // 获取背景图位置样式
    const getBgPos = (i) => {
        const rotationY = gsap.getProperty('.ring', 'rotationY') - 180;
        const wrappedValue = gsap.utils.wrap(0, 360, rotationY + i * 36);
        const backgroundPosition = (100 - wrappedValue / 360 * 500).toFixed(2);
        return `${backgroundPosition}px 0px`;
    };

    // 获取图片样式
    const getImageStyle = (i) => {
        return {
            z: -500,
            transform: `rotateY(${i * -36}deg) translateZ(-500px)`,
            backgroundImage: `url(https://picsum.photos/id/${i + 32}/600/400/)`,
            backgroundPosition: getBgPos(i),
            backfaceVisibility: 'hidden',
        };
    };

    // 鼠标进入图片事件处理函数
    const handleMouseEnter = (i) => {
        gsap.to('.img', {opacity: (j) => (j === i - 1 ? 1 : 0.5), ease: 'power3'});
    };

    // 鼠标离开图片事件处理函数
    const handleMouseLeave = () => {
        gsap.to('.img', {opacity: 1, ease: 'power2.inOut'});
    };

    onMounted(() => {
        initRingPosition();
        stageRef.value.addEventListener('mousedown', dragStart);
        stageRef.value.addEventListener('touchstart', dragStart);
        stageRef.value.addEventListener('mouseup', dragEnd);
        stageRef.value.addEventListener('touchend', dragEnd);
    });

    onBeforeUnmount(() => {
        stageRef.value.removeEventListener('mousedown', dragStart);
        stageRef.value.removeEventListener('touchstart', dragStart);
        stageRef.value.removeEventListener('mouseup', dragEnd);
        stageRef.value.removeEventListener('touchend', dragEnd);
    });
</script>

<style lang="scss" scoped>

    .stage, .ring, .img {
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        user-select: none;
    }

    .stage {
        height: 500px;
        /*background: radial-gradient(circle at 50% 100%, #000, #01282d)*/
    }

    .stage {
        div, svg {
            position: absolute;
        }

    }


    .container {
        perspective: 2000px;
        width: 300px;
        height: 400px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

</style>
