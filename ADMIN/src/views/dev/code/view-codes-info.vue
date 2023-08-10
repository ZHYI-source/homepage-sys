<template>
    <section class="zy-view">
        
            <ZyViewRow>
                <ZyViewItem label="文件名称">{{viewData.name}}</ZyViewItem>
            </ZyViewRow>
        
            <ZyViewRow>
                <ZyViewItem label="文件类型">{{viewData.type}}</ZyViewItem>
            </ZyViewRow>
        
            <ZyViewRow>
                <ZyViewItem label="下载地址">{{viewData.url}}</ZyViewItem>
            </ZyViewRow>
        
            <ZyViewRow>
                <ZyViewItem label="备注">{{viewData.remark}}</ZyViewItem>
            </ZyViewRow>
        
            <ZyViewRow>
                <ZyViewItem label="_id">{{viewData._id}}</ZyViewItem>
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
