<template>
  <section class="zy-view">
    <ZyViewRow>
      <ZyViewItem label="角色名称">
        <a-tag color="#f50">超级管理员</a-tag>
      </ZyViewItem>
      <ZyViewItem label="角色标识">
        super admin
      </ZyViewItem>
    </ZyViewRow>
    <ZyViewRow>
      <ZyViewItem label="备注">
        <a-textarea
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
