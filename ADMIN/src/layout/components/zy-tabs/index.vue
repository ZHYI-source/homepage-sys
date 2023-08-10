<template>
    <section class="zy-tabs" id="zy-tab">
        <a-tabs size="small" hide-add v-model:activeKey="currentTab" @tabClick="handleTabClick" @edit="onEdit"
                type="editable-card">
            <a-tab-pane v-for="pane in list" :key="pane.path" :tab="pane.meta.title" :closable="pane.path!=='/index'"/>
        </a-tabs>
    </section>
</template>
<script setup>
    import {computed, ref, watch} from 'vue';
    import {useTabsStore} from '@/stores/tabs.js';
    import {useRouter} from 'vue-router';

    const router = useRouter();
    let tabsStore = useTabsStore()
    // 计算属性，用于监听菜单的变化
    const tabsList = ref(tabsStore.tabsList);
    const current = ref(tabsStore.current);
    const list = computed({
        get: () => tabsStore.tabsList,
        set: (value) => {
            tabsList.value = value;
        },
    });

    const currentTab = computed({
        get: () => tabsStore.current,
        set: (value) => {
            current.value = value;
        },
    });

    // 导航到指定路由
    const navigateTo = (key) => {
        router.push(key);
    };

    const handleTabClick = (opt) => {
        navigateTo(opt)
        // 设置激活tabs和侧边栏的激活菜单
        tabsStore.currentSet(opt)
    };

    const onEdit = targetKey => {
        tabsStore.removeTabs(targetKey)
    };


</script>
<style lang="scss">
    .zy-tabs {
        width: 100%;


        .ant-tabs {
            width: 100%;
            padding-right: 18px;
            border: none;

            .ant-tabs-tab {

                font-size: .9rem;
                font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", 微软雅黑, Arial, sans-serif;

                &:first-child {
                    //border-left: none;
                    border-top-left-radius: 5px;
                    overflow: hidden;
                }
            }

            .ant-tabs-tab-active {


            }
        }

        .ant-tabs > .ant-tabs-nav {
            margin-bottom: 0;
        }
    }

</style>
