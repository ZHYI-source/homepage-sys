<template>
  <section class="zy-view">

    <ZyViewRow>
      <ZyViewItem label="操作人">{{ viewData.operator }}</ZyViewItem>
    </ZyViewRow>

    <ZyViewRow>
      <ZyViewItem label="操作模块">{{ viewData.module }}</ZyViewItem>
    </ZyViewRow>


    <ZyViewRow>
      <ZyViewItem label="操作平台">{{ viewData.platform }}</ZyViewItem>
    </ZyViewRow>


    <ZyViewRow>
      <ZyViewItem label="设备IP">{{ viewData.operatorIP }}</ZyViewItem>
    </ZyViewRow>


    <ZyViewRow>
      <ZyViewItem label="设备位置">{{ viewData.address }}</ZyViewItem>
    </ZyViewRow>


    <ZyViewRow>
      <ZyViewItem label="操作内容">{{ viewData.content }}</ZyViewItem>
    </ZyViewRow>


    <ZyViewRow>
      <ZyViewItem label="createdAt">{{ viewData.createdAt }}</ZyViewItem>
    </ZyViewRow>


    <ZyViewRow>
      <ZyViewItem label="updatedAt">{{ viewData.updatedAt }}</ZyViewItem>
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
