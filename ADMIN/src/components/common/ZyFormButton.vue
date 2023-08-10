<template>
  <a-divider />
  <a-space style="box-sizing: border-box;padding-left: 100px">
    <a-button type="primary" @click="()=>{emit('save')}" v-if="showSave">{{ saveText }}</a-button>
    <a-button @click="()=>{emit('close')}" v-if="showClose">{{ closeText }}
    </a-button>
    <slot></slot>
  </a-space>
</template>

<script setup>
const props = defineProps({

  showSave: {
    type: Boolean,
    default: true,
  },
  showClose: {
    type: Boolean,
    default: true,
  },

  saveText: {
    type: String,
    default: '保存',
  },
  closeText: {
    type: String,
    default: '取消',
  }

})
const emit = defineEmits(['save', 'close',])

</script>

<style scoped>

</style>
