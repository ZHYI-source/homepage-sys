<template>
    <section class="zy-view">
        <ZyViewRow>
            <ZyViewItem label="头像">
                <a-image
                        :width="40"
                        :src="viewData.avatar"
                />
            </ZyViewItem>
            <ZyViewItem label="昵称">
                {{viewData.nickname}}
            </ZyViewItem>
        </ZyViewRow>
        <ZyViewRow>
            <ZyViewItem label="用户名">{{viewData.username}}</ZyViewItem>
            <ZyViewItem label="密码">{{viewData.password}}</ZyViewItem>
        </ZyViewRow>
        <ZyViewRow>
            <ZyViewItem label="角色">{{viewData.roleName}}</ZyViewItem>
            <ZyViewItem label="状态">
                <a-tag color="#f70">{{ viewData.status === 1 ? '正常' : '禁用' }}</a-tag>
            </ZyViewItem>
        </ZyViewRow>
        <ZyViewRow>
            <ZyViewItem label="备注">
                <a-textarea
                        v-model:value="viewData.remark"
                        style="width: 500px"
                        disabled
                        placeholder="Autosize height based on content lines"
                        auto-size
                />
            </ZyViewItem>
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
    console.log(props.viewData)
    const emit = defineEmits(['close'])

</script>

<style lang="scss" scoped>

</style>
