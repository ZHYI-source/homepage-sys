<template>
  <section class="zy-get">
    <a-form :model="state.form"
            class="zy-form"
            :label-col="labelCol"
            ref="formRef"
            :wrapper-col="wrapperCol">


      <a-form-item label="操作人"
                   name="operator"
                   :rules="[{ required: true, message: '请输入操作人!' }]">
        <a-input v-model:value="state.form.operator" allowClear placeholder="请输入操作人"/>
      </a-form-item>


      <a-form-item label="操作模块"
                   name="module"
                   :rules="[{ required: true, message: '请输入操作模块!' }]">
        <a-input v-model:value="state.form.module" allowClear placeholder="请输入操作模块"/>
      </a-form-item>


      <a-form-item label="操作平台"
                   name="platform"
                   :rules="[{ required: true, message: '请输入操作平台!' }]">
        <a-input v-model:value="state.form.platform" allowClear placeholder="请输入操作平台"/>
      </a-form-item>


      <a-form-item label="设备IP"
                   name="operatorIP"
                   :rules="[{ required: true, message: '请输入设备IP!' }]">
        <a-input v-model:value="state.form.operatorIP" allowClear placeholder="请输入设备IP"/>
      </a-form-item>


      <a-form-item label="设备位置"
                   name="address"
                   :rules="[{ required: true, message: '请输入设备位置!' }]">
        <a-input v-model:value="state.form.address" allowClear placeholder="请输入设备位置"/>
      </a-form-item>


      <a-form-item label="操作内容"
                   name="content"
                  >
        <a-input v-model:value="state.form.content" allowClear placeholder="请输入操作内容"/>
      </a-form-item>


    </a-form>
    <ZyFormButton @save="onSubmit" @close="close"/>
  </section>
</template>

<script setup>
import {reactive, toRaw, ref} from 'vue';
import ZyFormButton from "comps/common/ZyFormButton.vue";
import {ZyConfirm, ZyNotification} from "libs/util.toast";
import {users_opt_logsCreate, users_opt_logsUpdate} from "api/modules/api.users_opt_logs";

const labelCol = {
  style: {
    width: '100px',
  },
}
const wrapperCol = {
  span: 14,
}

const state = reactive({
  form: {}
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
const isAdd = ref(!props.updateData) // 是否是添加
if (!isAdd.value) {
  state.form = props.updateData || {}
}


const onSubmit = async () => {
  try {
    const values = await formRef.value.validateFields();
    if (!isAdd.value) {
      delete state.form.password
    }
    let FUC = isAdd.value ? users_opt_logsCreate : users_opt_logsUpdate
    FUC(toRaw(state.form)).then(res => {
      ZyNotification.success('操作成功')
      emit('close', true)
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
