<template>
    <section class="zy-view">
        
            
                <ZyViewRow>
                    <ZyViewItem label="资源名称">{{viewData.srcName}}</ZyViewItem>
                </ZyViewRow>
            
            
            
                <ZyViewRow>
                    <ZyViewItem label="资源类型">{{viewData.srcType}}</ZyViewItem>
                </ZyViewRow>
            
            
            
                <ZyViewRow>
                    <ZyViewItem label="资源预览路径">{{viewData.previewPath}}</ZyViewItem>
                </ZyViewRow>
            
            
            
                <ZyViewRow>
                    <ZyViewItem label="资源下载路径">{{viewData.downloadPath}}</ZyViewItem>
                </ZyViewRow>
            
            
            
                <ZyViewRow>
                    <ZyViewItem label="资源删除路径">{{viewData.deletePath}}</ZyViewItem>
                </ZyViewRow>
            
            
            
                <ZyViewRow>
                    <ZyViewItem label="用户ID">{{viewData.userId}}</ZyViewItem>
                </ZyViewRow>
            
            
            
                <ZyViewRow>
                    <ZyViewItem label="备注">{{viewData.remark}}</ZyViewItem>
                </ZyViewRow>
            
            
            
                <ZyViewRow>
                    <ZyViewItem label="状态: 0禁用 1正常">{{viewData.status}}</ZyViewItem>
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
