<template>
    <div class="project-list">
        <div class="project-item-card"
             title="我是项目"
             v-for="(item, index) in 6"
             :key="index"
             ref="projectItem"
             @mouseenter="(e) => handleMouseEnter(e, index)"
             @mousemove="(e) => handleMouseEnter(e, index)"
             @mouseleave="(e) => handleMouseLeave(e, index)"
        >
            <img class="card-img"
                 src="https://images.unsplash.com/photo-1682685797507-d44d838b0ac7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHw2fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60"
                 alt="pic"/>
            <div class="project-item-card__glow"></div>
        </div>
    </div>
</template>

<script setup>
    /**
     *@author ZY
     *@date 2023/7/21 21:37
     *@Description:3D卡片列表展示
     */
    import {ref, onMounted} from 'vue';
    // 引用和状态变量
    const projectItemRefs = ref([]);
    const projectItem = ref(null);

    // 辅助函数：将 projectItemCard 旋转至鼠标位置
    const rotateToMouse = (e, projectItemCard) => {
        // 获取 projectItemCard 的边界参数
        let bounds = projectItemCard.getBoundingClientRect();

        // 计算鼠标位置相对于卡片左上角的位置
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const leftX = mouseX - bounds.x;
        const topY = mouseY - bounds.y;

        // 计算卡片中心位置
        const center = {
            x: leftX - bounds.width / 2,
            y: topY - bounds.height / 2
        };

        // 计算从中心到鼠标位置的距离
        const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

        // 根据鼠标位置应用缩放和旋转变换
        projectItemCard.style.transform = `
            scale(1.02)
            rotate3d(
                ${center.y / 100},
                ${center.x / 100},
                0,
                ${Math.log(distance)  * 0.8}deg
            )
        `;

        // 根据鼠标位置调整发光效果
        const glowElement = projectItemCard.querySelector('.project-item-card__glow');
        glowElement.style.backgroundImage = `
            radial-gradient(
                circle at
                ${center.x * 2 + bounds.width / 2}px
                ${center.y * 2 + bounds.height / 2}px,
                #ffffff55,
                #0000000f
            )
        `;
    };

    // 事件处理程序：鼠标进入和离开
    const handleMouseEnter = (e, index) => {
        rotateToMouse(e, projectItemRefs.value[index]);
    };

    const handleMouseLeave = (e, index) => {
        // 鼠标离开时重置变换
        document.removeEventListener('mousemove', rotateToMouse);
        let projectItemCard = projectItemRefs.value[index];
        projectItemCard.style.transform = '';
        const glowElement = projectItemCard.querySelector('.project-item-card__glow');
        glowElement.style.backgroundImage = '';
    };

    // 挂载后设置 projectItemRefs
    onMounted(() => {
        projectItemRefs.value = [...projectItem.value];
    });
</script>


<style lang="scss" scoped>
    $primaryColor: #6a848e;
    $hoverColor: rgba(255, 255, 255, 0.27);
    $glowColorStart: rgba(255, 255, 255, 0.13);
    $glowColorEnd: #0000000f;
    // 定义一些常用的媒体查询断点
    $breakpoint-sm: 576px;   // 小屏幕，如手机
    $breakpoint-md: 768px;   // 中等屏幕，如平板电脑
    $breakpoint-lg: 992px;   // 大屏幕，如小型笔记本电脑
    $breakpoint-xl: 1200px;  // 超大屏幕，如桌面电脑

    // 定义媒体查询的mixin
    @mixin media-query($breakpoint) {
        @media only screen and (min-width: $breakpoint) {
            @content;
        }
    }
    @mixin media-query-max($breakpoint) {
        @media only screen and (max-width: $breakpoint) {
            @content;
        }
    }
    .project-list {
        width: 100%;
        display: flex;
        perspective: 1200px;
        padding: 1.8rem;
        justify-content: space-between;
        flex-wrap: wrap;
        @include media-query($breakpoint-sm) {
            perspective: 2000px;
        }

        @include media-query($breakpoint-md) {
            perspective: 1800px;
        }

        @include media-query($breakpoint-lg) {
            perspective: 1200px;
        }
        .project-item-card {
            min-width: 300px;
            width: calc(33.3% - 2rem);
            box-sizing: border-box;
            border: 2px solid #fff;
            border-radius: 8px;
            position: relative;
            transition-duration: 300ms;
            transition-property: transform, box-shadow;
            transition-timing-function: ease-out;
            overflow: hidden;
            cursor: pointer;
            transition: transform 250ms linear;
            margin-bottom: 1rem;

            @include media-query($breakpoint-sm) {
                width: calc(100% - .5rem);
            }
            @include media-query-max($breakpoint-sm) {
                width: calc(100% - .5rem);
            }

            @include media-query($breakpoint-md) {
                width: calc(50% - .5rem);
            }

            @include media-query($breakpoint-lg) {
                width: calc(33.3% - .5rem);
            }

            .card-img {
                display: inline-block;
                width: 100%;
                height: 100%;
                aspect-ratio: 16/9;
                object-fit: cover;


            }

            &:hover {
                transition-duration: 150ms;
                box-shadow: 0 0 20px 5px $hoverColor;
            }

            &__glow {
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                background-image: radial-gradient(circle at 50% -20%, $glowColorStart, $glowColorEnd);
            }
        }
    }

</style>
