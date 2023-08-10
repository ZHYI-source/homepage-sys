<template>
  <div class="row-item">
    <div class="row-label"
         :style="{width:labelWidth+'px',color:labelColor}">
      {{ label ? label + ':' : '' }}
    </div>
    <div class="row-content"
         :style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
/*详情页 行单项*/
const props = defineProps({
  label: {
    type: String,
    default: () => ''
  },
  labelColor: {
    type: String,
    default: () => ''
  },
  labelWidth: {
    type: [String, Number],
    default: () => 70
  },
  // 自定义内容区域的样式
  contentStyle: {
    type: Object,
    default: () => {
    }
  }
})

</script>

<style lang="scss" scoped>
.row-item {
  width: 100%;
  min-width: 175px;
  display: flex;
  justify-items: flex-start;
  align-items: center;

  .row-label {
    width: 70px;
    font-weight: bold;
    color: #444343;
    text-align: right;
  }

  .row-content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    padding-left: 8px;
    font-size: 14px;
    width: calc(100% - 70px);
  }
}
</style>
