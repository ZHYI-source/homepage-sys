<template>
    <section class="zy-view">
                <ZyViewRow>
                    <ZyViewItem label="作品名称">{{viewData.title}}</ZyViewItem>
                </ZyViewRow>
                <ZyViewRow>
                    <ZyViewItem label="作品封面">{{viewData.cover}}</ZyViewItem>
                </ZyViewRow>
                <ZyViewRow>
                    <ZyViewItem label="作品简介">{{viewData.abstract}}</ZyViewItem>
                </ZyViewRow>
                <ZyViewRow>
                    <ZyViewItem label="作品内容">{{viewData.content}}</ZyViewItem>
                </ZyViewRow>
                <ZyViewRow>
                    <ZyViewItem label="作者">{{viewData.userId}}</ZyViewItem>
                </ZyViewRow>
                <ZyViewRow>
                    <ZyViewItem label="备注">{{viewData.remark}}</ZyViewItem>
                </ZyViewRow>
                <ZyViewRow>
                    <ZyViewItem label="分类">{{viewData.category}}</ZyViewItem>
                </ZyViewRow>
                <ZyViewRow>
                    <ZyViewItem label="技术框架">{{viewData.framework}}</ZyViewItem>
                </ZyViewRow>
                <ZyViewRow>
                    <ZyViewItem label="是否精选">{{viewData.recommended}}</ZyViewItem>
                </ZyViewRow>
                <ZyViewRow>
                    <ZyViewItem label="状态">{{viewData.status}}</ZyViewItem>
                </ZyViewRow>
                <ZyViewRow>
                    <ZyViewItem label="createdAt">{{viewData.createdAt}}</ZyViewItem>
                </ZyViewRow>
                <ZyViewRow>
                    <ZyViewItem label="updatedAt">{{viewData.updatedAt}}</ZyViewItem>
                </ZyViewRow>
    </section>
</template>

<script setup>
    import ZyViewRow from "comps/common/ZyViewRow.vue";
    import ZyViewItem from "comps/common/ZyViewItem.vue";

    const props = defineProps({
        viewData: {
            type: Object,
            default: () => {
            }
        }
    })
    const emit = defineEmits(['close'])

</script>

<style lang="scss" scoped>

</style>
