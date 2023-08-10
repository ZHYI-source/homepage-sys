<template>
  <div class="zy-fittle-row">
    <div></div>
    <div class="row-btns">
      <a-space>
        <slot></slot>
        <a-button type="primary" size="small" @click="()=>{emit('add')}" v-if="showAdd" v-permission="addAuth">
          <template #icon>
            <IconFont type="icon-add"/>
          </template>
          {{ addText }}
        </a-button>
        <a-button type="primary" danger size="small" @click="()=>{emit('delete')}" v-if="showDelete" v-permission="deleteAuth">
          <template #icon>
            <delete-outlined/>
          </template>
          {{ deleteText }}
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script setup>
import {
  DeleteOutlined
} from '@ant-design/icons-vue';

const props = defineProps({
  showAdd: {
    type: Boolean,
    default: true,
  },
  showDelete: {
    type: Boolean,
    default: true,
  },
  addText: {
    type: String,
    default: '增加',
  },
  deleteText: {
    type: String,
    default: '删除',
  },
  addAuth: {
    type: String,
    default: '',
  },
  deleteAuth: {
    type: String,
    default: '',
  },

})
const emit = defineEmits(['add', 'delete'])

</script>

<style lang="scss" scoped>
.zy-fittle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;

  .row-btns {

  }
}
</style>
