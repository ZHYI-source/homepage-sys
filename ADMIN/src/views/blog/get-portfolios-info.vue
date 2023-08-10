<template>
  <a-page-header
      :title="isAdd?'创建作品':'修改作品'"
      @back="() => emit('close')"
  />
  <section class="zy-get">
    <a-form :model="state.form"
            class="zy-form"
            :label-col="labelCol"
            ref="formRef"
            :wrapper-col="wrapperCol">
      <a-form-item label="作品名称"
                   name="title"
                   :rules="[{ required: true, message: '请输入作品名称!' }]">
        <a-input v-model:value="state.form.title" allowClear placeholder="请输入作品名称"/>
      </a-form-item>
      <a-form-item label="封面"
                   name="cover">
        <div class="form-upload">
          <a-textarea v-model:value="state.form.cover" allowClear placeholder="在线地址"/>
          <a-image class="upload-img" :width="225" v-if="state.form.cover" :src="state.form.cover"></a-image>
          <ZyUpload  v-model:url="state.form.cover"/>
        </div>
      </a-form-item>
      <a-form-item label="作品简介"
                   name="abstract"
                   :rules="[{ required: true, message: '请输入作品简介!' }]">
        <a-textarea v-model:value="state.form.abstract" allowClear placeholder="请输入作品简介"/>
      </a-form-item>
      <a-form-item label="内容"
                   name="content"
                   :rules="[{ required: true, message: '请输入内容!' }]">
        <VMdEditor v-model:value="state.form.content" :mdContent="state.form.content" :height="400"/>
      </a-form-item>
      <a-form-item label="分类"
                   name="category"
                   :rules="[{ required: true, message: '请输入分类!' }]">
        <a-input v-model:value="state.form.category" allowClear placeholder="请输入分类"/>
      </a-form-item>
      <a-form-item label="技术框架"
                   name="framework">
        <a-textarea v-model:value="state.form.framework" allowClear placeholder="请输入技术框架"/>
      </a-form-item>
      <div style="display: flex">
        <a-form-item label="是否精选"
                     name="recommended">
          <a-switch v-model:checked="state.form.recommended" allowClear placeholder="请输入是否精选"/>
        </a-form-item>
        <a-form-item label="状态"
                     name="status">
          <a-switch v-model:checked="state.form.status" allowClear placeholder="请输入状态"/>
        </a-form-item>
      </div>
      <a-form-item label="源码地址"
                   name="sourceUrl">
        <a-textarea v-model:value="state.form.sourceUrl" allowClear placeholder="请输入技术框架"/>
      </a-form-item>
      <a-form-item label="示例地址"
                   name="demoUrl">
        <a-textarea v-model:value="state.form.demoUrl" allowClear placeholder="请输入示例地址"/>
      </a-form-item>
      <a-form-item label="备注"
                   name="remark">
        <a-textarea v-model:value="state.form.remark" allowClear placeholder="请输入备注"/>
      </a-form-item>
    </a-form>
    <ZyFormButton @save="onSubmit" @close="close"/>
  </section>
</template>

<script setup>
import {reactive, toRaw, ref} from 'vue';
import ZyFormButton from "comps/common/ZyFormButton.vue";
import {ZyConfirm, ZyNotification} from "libs/util.toast";
import {portfoliosCreate, portfoliosUpdate} from "api/modules/api.portfolios";
import VMdEditor from "comps/VMdEditor/index.vue";
import ZyUpload from "../../components/common/ZyUpload.vue";

const labelCol = {
  style: {
    width: '100px',
  },
}
const wrapperCol = {
  span: 14,
}

const state = reactive({
  form: {
    cover:'http://www.zhouyi.run:3089/v1/common/files/preview/img/1691545299360.png'
  }
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
    let FUC = isAdd.value ? portfoliosCreate : portfoliosUpdate
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
