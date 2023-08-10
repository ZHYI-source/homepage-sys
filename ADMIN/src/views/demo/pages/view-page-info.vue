<template>
  <section class="zy-view">
    <ZyViewRow>
      <ZyViewItem label="封面">{{viewData.coverImage}}</ZyViewItem>
      <ZyViewItem label="标题">{{viewData.title}}</ZyViewItem>
    </ZyViewRow>
    <ZyViewRow>
      <ZyViewItem label="分类">{{viewData.category}}</ZyViewItem>
      <ZyViewItem label="状态">
        <a-tag color="#f70">{{ viewData.status }}</a-tag>
      </ZyViewItem>
    </ZyViewRow>
    <ZyViewRow>
      <ZyViewItem label="摘要">
        <a-textarea
            v-model:value="viewData.summary"
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
