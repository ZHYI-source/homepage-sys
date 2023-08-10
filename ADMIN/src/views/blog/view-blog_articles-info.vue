<template>
    <section class="zy-view">
        
            
                <ZyViewRow>
                    <ZyViewItem label="博文名称">{{viewData.title}}</ZyViewItem>
                </ZyViewRow>
            
            
            
                <ZyViewRow>
                    <ZyViewItem label="昵称">{{viewData.content}}</ZyViewItem>
                </ZyViewRow>
            
            
            
                <ZyViewRow>
                    <ZyViewItem label="作者">{{viewData.userId}}</ZyViewItem>
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
