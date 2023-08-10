<template>
  <section class="zy-role-select">
    <a-select v-model:value="state.roleValue" placeholder="请选择角色"  @change="handleChange">
      <a-select-option v-for="(item,index) in state.dataList" :value="item._id" :key="index">
        {{ item.roleName }}
      </a-select-option>
    </a-select>
  </section>
</template>

<script setup>
import {watchEffect, reactive} from 'vue';
import {rolesList} from "api/modules/api.roles";

const props = defineProps({
  value: {
    type: String,
    default: () => '',
  },
});

const emit = defineEmits(['update:value']);


const state = reactive({
  dataList: [],
  roleValue: [],
  query: {
    params: {},
    pagination: {
      current: 1,
      pageSize: 100,
    },
    sort: {
      columnKey: "createdAt",
      order: "ascend"
    }
  },
})

const handleChange = value => {
  console.log(`selected ${value}`);
  emit('update:value', value);
};

watchEffect(() => {
  if (props.value) {
    // 回填
    state.roleValue = [props.value]
  }
});


function getRoles() {
  rolesList(state.query).then(res => {
    state.dataList = res.data.result || []
  })
}


getRoles()
</script>

<style lang="scss" scoped>
.zy-role-select {
  width: 100%;

}
</style>
