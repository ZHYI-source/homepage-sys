<template>
    <section class="zy-view">
        
            
                <ZyViewRow>
                    <ZyViewItem label="留言内容">{{viewData.content}}</ZyViewItem>
                </ZyViewRow>
            
            
            
                <ZyViewRow>
                    <ZyViewItem label="是否隐藏">{{viewData.hidden}}</ZyViewItem>
                </ZyViewRow>
            
            
            
                <ZyViewRow>
                    <ZyViewItem label="关联的用户ID">{{viewData.user}}</ZyViewItem>
                </ZyViewRow>
            
            
            
                <ZyViewRow>
                    <ZyViewItem label="replies">{{viewData.replies}}</ZyViewItem>
                </ZyViewRow>
            
            
            
                <ZyViewRow>
                    <ZyViewItem label="留言创建时间">{{viewData.createdAt}}</ZyViewItem>
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
