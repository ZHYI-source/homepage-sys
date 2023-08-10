<template>
  <section class="zy-tree">
    <a-tree
        :expandedKeys="internalExpandedKeys"
        :selectedKeys="internalSelectedKeys"
        :checkedKeys="internalCheckedKeys"
        checkable
        :tree-data="state.treeData"
        :field-names="fieldNames"
        @update:expandedKeys="updateExpandedKeys"
        @update:selectedKeys="updateSelectedKeys"
        @update:checkedKeys="updateCheckedKeys"
    >
      <template #title="{ auth, name, key }">
        <span v-if="auth">
          {{ name }}
          <a-tag color="orange" style="margin-left: 5px" v-bind:key="key">
            <template #icon>
              <IconFont type="icon-quanxianguanli"/>
            </template>
            {{ key }}
          </a-tag>
        </span>
        <template v-else>{{ name }}</template>
      </template>
    </a-tree>
  </section>
</template>

<script setup>
import {ref, watch, reactive} from 'vue';
import {permissionsTree} from "api/modules/api.permissions";

const props = defineProps({
  value: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:value']);


const state = reactive({
  treeData: [],
  // 定义一个空数组来存储筛选后的key值
  keysArray: [],
})

const internalExpandedKeys = ref();
const internalSelectedKeys = ref();
const internalCheckedKeys = ref();

const fieldNames = {
  children: 'children',
  title: 'name',
  key: 'key',
};


// 递归遍历state.treeData数组，筛选出key值并存储到state.keysArray数组中
function extractKeys(data) {
  data.forEach(item => {
    state.keysArray.push(item.key);
    if (item.children) {
      extractKeys(item.children);
    }
  });
}


watch(internalCheckedKeys, (newValue) => {
  // 父组件直接使用 v-model:value
  emit('update:value', newValue);
});


function getTree() {
  permissionsTree().then(res => {
    state.treeData = res.data.result
    if (props.value.includes('*')) {
      // 对于超级管理员的判断
      extractKeys(state.treeData)
      internalExpandedKeys.value = state.keysArray
      internalSelectedKeys.value = state.keysArray
      internalCheckedKeys.value = state.keysArray
    } else {
      internalExpandedKeys.value = props.value
      internalSelectedKeys.value = props.value
      internalCheckedKeys.value = props.value
    }
  })
}


function updateExpandedKeys(keys) {
  internalExpandedKeys.value = keys;
}

function updateSelectedKeys(keys) {
  internalSelectedKeys.value = keys;
}


function updateCheckedKeys(keys) {
  internalCheckedKeys.value = keys;
}

getTree()
</script>

<style lang="scss" scoped>
.zy-tree {
  border-radius: 5px;
  overflow: hidden;
  padding: 5px;
  margin: 10px 0;
  border: 1px solid #eee;
}
</style>
