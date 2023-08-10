<template>
  <section class="zy-get">
    <a-form :model="state.form"
            class="zy-form"
            :label-col="labelCol"
            ref="formRef"
            :wrapper-col="wrapperCol">
      <a-form-item label="资源名称">
       <ZyUpload v-model:url="state.form.srcName" @uploadChange="uploadChange"/>
      </a-form-item>
      <a-form-item label="资源名称"
                   name="srcName"
                   :rules="[{ required: true, message: '请输入资源名称!' }]">
        <a-input v-model:value="state.form.srcName" allowClear placeholder="请输入资源名称"/>
      </a-form-item>
      <a-form-item label="资源类型"
                   name="srcType"
                   :rules="[{ required: true, message: '请输入资源类型!' }]">
        <a-input v-model:value="state.form.srcType" allowClear placeholder="请输入资源类型"/>
      </a-form-item>
      <a-form-item label="资源预览路径"
                   name="previewPath"
      >
        <a-input v-model:value="state.form.previewPath" allowClear placeholder="请输入资源预览路径"/>
      </a-form-item>
      <a-form-item label="资源下载路径"
                   name="downloadPath"
      >
        <a-input v-model:value="state.form.downloadPath" allowClear placeholder="请输入资源下载路径"/>
      </a-form-item>
      <a-form-item label="资源删除路径"
                   name="deletePath"
      >
        <a-input v-model:value="state.form.deletePath" allowClear placeholder="请输入资源删除路径"/>
      </a-form-item>
      <a-form-item label="备注"
                   name="remark"
      >
        <a-input v-model:value="state.form.remark" allowClear placeholder="请输入备注"/>
      </a-form-item>
    </a-form>
    <ZyFormButton @save="onSubmit" @close="close"/>
  </section>
</template>

<script setup>
import {reactive, toRaw, ref} from 'vue';
import ZyFormButton from "comps/common/ZyFormButton.vue";
import {ZyConfirm, ZyNotification} from "libs/util.toast";
import {resourcesCreate, resourcesUpdate} from "api/modules/api.resources";
import ZyUpload from "comps/common/ZyUpload.vue";

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
// 将字节数转换为可读性更好的文件大小表示
function formatFileSize(bytes) {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const fileSize = (bytes / Math.pow(1024, i)).toFixed(2);
  return `${fileSize} ${sizes[i]}`;
}

const uploadChange=(file)=>{
  state.form.deletePath = file.response.data.deleteUrl
  state.form.downloadPath = file.response.data.downloadUrl
  state.form.previewPath = file.response.data.previewUrl
  state.form.srcName = file.response.data.filename
  state.form.srcType = file.type
  state.form.srcSize = formatFileSize(file.size)
}

const onSubmit = async () => {
  try {
    const values = await formRef.value.validateFields();
    if (!isAdd.value) {
      delete state.form.password
    }
    let FUC = isAdd.value ? resourcesCreate : resourcesUpdate
    FUC(toRaw(state.form)).then(res => {
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
