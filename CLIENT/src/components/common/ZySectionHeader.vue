<template>
  <h5 class="section-title c-mb-40">
    🎯 {{ title }}
    <span v-if="!disShowNum" :data-number="titleNum"></span>
  </h5>
</template>

<script setup>
const props = defineProps({
  title: {
    type: [Number, String],
    default: () => 'Tips'
  },
  titleNum: {
    type: [String],
    default: () => '01'
  },
  disShowNum: {
    type: Boolean,
    default: () => false
  }
})

</script>

<style lang="scss" scoped>
.section-title {
  display: flex;
  align-items: center;
  white-space: nowrap;
  letter-spacing: 0;
  font-weight: 800;
  color: #7c7d7d;
  font-size: 1.25rem;
  line-height: 1.2;
  -webkit-box-reflect: below -5px linear-gradient(transparent, rgba(0, 0, 0, .4));

  span {
    position: relative;
    margin-left: 20px;
    margin-right: 35px;
    display: inline-block;
    height: 1px;
    border-bottom: dotted 2px rgba(225, 225, 235, 0.9);
    width: 100%;

    &:after {
      content: attr(data-number);
      border-radius: 50%;
      position: absolute;
      font-size: 11px;
      font-weight: 600;
      text-align: center;
      color: #7B7B7D;
      opacity: .8;
      width: 15px;
      height: 15px;
      top: -6px;
      right: -35px;
    }
  }
}

.title-icon {
  font-size: 2.3rem;
  margin-right: 15px;
}
</style>
