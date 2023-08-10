<template>
    <section class="zy-view">

            <ZyViewRow>
                <ZyViewItem label="权限名称">{{viewData.name}}</ZyViewItem>
            </ZyViewRow>

            <ZyViewRow>
                <ZyViewItem label="权限键">{{viewData.key}}</ZyViewItem>
            </ZyViewRow>

            <ZyViewRow>
                <ZyViewItem label="父级">{{viewData.parent_key}}</ZyViewItem>
            </ZyViewRow>

            <ZyViewRow>
                <ZyViewItem label="按钮">{{viewData.auth}}</ZyViewItem>
            </ZyViewRow>

            <ZyViewRow>
                <ZyViewItem label="排序">{{viewData.sortOrder}}</ZyViewItem>
            </ZyViewRow>

            <ZyViewRow>
                <ZyViewItem label="状态">{{viewData.status}}</ZyViewItem>
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
