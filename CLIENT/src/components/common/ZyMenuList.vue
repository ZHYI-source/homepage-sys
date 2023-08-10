<template>
    <div class="menu">
        <div
                v-for="(item, index) in menuItems"
                :key="index"
                class="menu-item"
                :class="{active:activeIndex=== index}"
                @mouseover="showOverlay(index)"
                @mouseleave="outOverlay(index)"
                @click="activateMenuItem(index,item)"
                ref="menuItem"
        >
            {{ item.name }}
        </div>
        <div class="overlay"
             :style="{top: overlayTop + 'px', left: overlayLeft + 'px', width: overlayWidth + 'px',height: overlayHeight + 'px' }"></div>
    </div>
</template>

<script setup>
    import {ref, onMounted} from 'vue';
    import {useRouter} from 'vue-router';
    import {useMenusStore} from '../../stores/menus'

    const router = useRouter()
    const menusAction = useMenusStore()

    // 定义菜单项数据
    const menuItems = [
        {name: 'HOME', id: 'home'},
        {name: 'ABOUT', id: 'about'},
        {name: 'RESUME', id: 'resume'},
        {name: 'BLOG', id: 'blog', path: '/blog'},
        {name: 'PORTFOLIO', id: 'work', path: '/portfolio'},
        {name: 'CONTACT', id: 'contact', path: '/contact'},
    ];

    // 响应式数据，用于存储当前鼠标悬停的选项的索引、底纹的位置和宽度，以及默认激活的菜单项索引
    const activeIndex = ref(0); // 默认设置为第一个菜单项
    const overlayLeft = ref(0);
    const overlayTop = ref(0);
    const overlayWidth = ref(0);
    const overlayHeight = ref(0);
    const menuItemRefs = ref([]);
    const menuItem = ref(null);

    const outOverlay = () => {
        const menuItem = menuItemRefs.value[activeIndex.value];
        if (menuItem) {
            overlayLeft.value = menuItem.offsetLeft;
            overlayTop.value = menuItem.offsetTop;
            overlayWidth.value = menuItem.offsetWidth;
            overlayHeight.value = menuItem.offsetHeight;
        }
    }
    // 方法，显示选项底纹
    const showOverlay = (index) => {

        const menuItem = menuItemRefs.value[index];
        if (menuItem) {
            overlayLeft.value = menuItem.offsetLeft;
            overlayTop.value = menuItem.offsetTop;
            overlayWidth.value = menuItem.offsetWidth;
            overlayHeight.value = menuItem.offsetHeight;
        }

    };

    // 方法，激活菜单项
    const activateMenuItem = (index, item) => {
        activeIndex.value = index;
        const menuItem = menuItemRefs.value[index];
        if (menuItem) {
            overlayLeft.value = menuItem.offsetLeft;
            overlayTop.value = menuItem.offsetTop;
            overlayWidth.value = menuItem.offsetWidth;
            overlayHeight.value = menuItem.offsetHeight;
        }
        if (!item) return
        if (item.path) {
            router.push(item.path)
        } else {
            menusAction.page = item.id
        }


    };

    // 在组件挂载时获取所有菜单项的引用
    onMounted(() => {
        menuItemRefs.value = [...menuItem.value];
        activateMenuItem(0)
    });
</script>


<style lang="scss" scoped>
    .menu {
        display: flex;
        width: 100%;
        height: 100%;
        background-color: transparent;
    }

    .menu-item {
        position: relative;
        padding: 0 10px;
        cursor: pointer;
        line-height: 45px;
        background-color: transparent;
        color: #a0a0a0;
        font-family: "Poppins", sans-serif;
        text-transform: uppercase;
        font-size: 12px;
        letter-spacing: 0.09em;
        transition: all .3s linear;

        &:hover {
            color: #EEEEEE;
        }
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        pointer-events: none;
        border-radius: 3px;
        border-bottom: 3px solid #ffffff;
        transition: left 0.2s ease-in, width 0.2s ease-in;
    }

    .active {
        color: #fff;
        border-radius: 3px;
        border-bottom: 3px solid #ffffff;
        transition: left 0.2s ease-in, width 0.2s ease-in;
    }


</style>

