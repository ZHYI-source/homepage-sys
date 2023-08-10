<template>
  <section class="zy-get">
    <a-form :model="state.form"
            class="zy-form"
            :label-col="labelCol"
            ref="formRef"
            :wrapper-col="wrapperCol">

      <a-form-item label="模型"
                   name="tableName"
                   :rules="[{ required: true, message: '请选择模型!' }]">
        <a-select v-model:value="state.form.tableName" placeholder="请选择模型">
          <a-select-option v-for="(item,index) in state.collections" :value="item" :key="index">
            {{ item }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="模型备注"
                   name="comment"
                   :rules="[{ required: true, message: '请输入模型备注（中文）!' }]">
        <a-input v-model:value="state.form.comment" allowClear placeholder="请输入模型备注"/>
        <a-alert message="模型备注：主要作为文件内的中文说明" type="info"/>
      </a-form-item>

      <a-form-item label="根权限"
                   name="auth"
                   :rules="[{ required: true, message: '请输入根权限!' }]">
        <a-input v-model:value="state.form.auth" allowClear placeholder="请输入根权限"/>
        <a-alert message="根权限：例如页面需要建在系统管理下面则填'sys'" type="info"/>
      </a-form-item>
    </a-form>
    <ZyFormButton @save="onSubmit" @close="close"/>
  </section>
</template>

<script setup>
import {reactive, toRaw, ref} from 'vue';
import ZyFormButton from "comps/common/ZyFormButton.vue";
import {ZyConfirm, ZyNotification} from "libs/util.toast";
import {codesCollections,singleCurdFrontAndBack} from "api/modules/api.codes";

const labelCol = {
  style: {
    width: '100px',
  },
}
const wrapperCol = {
  span: 14,
}

const state = reactive({
  form: {},
  collections: []
});

const props = defineProps({
  updateData: {
    type: Object,
    default: () => {
    }
  }
})
const emit = defineEmits(['close'])
const formRef = ref();


// 加载模型列表
const getCodesCollections = () => {
  codesCollections().then(res => {
    state.collections = res.data || []
  })
}
getCodesCollections()

const onSubmit = async () => {
  try {
    const values = await formRef.value.validateFields();
    singleCurdFrontAndBack(toRaw(state.form)).then(res => {
      ZyNotification.success('操作成功')
      emit('close', true)
    }).catch(err => {
      ZyNotification.error(err || '操作失败')
    })
  } catch (errorInfo) {
    console.log('Failed:', errorInfo);
  }

};

const close = () => {
  ZyConfirm('还没保存数据，确认退出?').then(ok => {
    if (!ok) return
    emit('close')
  })
}
</script>

<style scoped>

</style>
