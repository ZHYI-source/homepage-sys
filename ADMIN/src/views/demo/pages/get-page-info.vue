<template>
  <section class="zy-get">
    <a-form :model="state.form"
            class="zy-form"
            :label-col="labelCol"
            ref="formRef"
            :wrapper-col="wrapperCol">
      <a-form-item label="封面"
                   name="coverImage"
                   :rules="[{ required: true, message: '请输入封面!' }]">
        <a-input v-model:value="state.form.coverImage" allowClear placeholder="请输入封面"/>
      </a-form-item>
      <a-form-item label="标题"
                   name="title"
                   :rules="[{ required: true, message: '请输入标题!' }]"
      >
        <a-input v-model:value="state.form.title" allowClear placeholder="请输入标题"/>
      </a-form-item>
      <a-form-item label="分类"
                   name="category"
                   :rules="[{ required: true, message: '请输入分类!' }]"
      >
        <a-input v-model:value="state.form.category" allowClear placeholder="请输入分类"/>
      </a-form-item>
      <a-form-item label="摘要"
                   name="summary"
      >
        <a-textarea v-model:value="state.form.summary" allowClear placeholder="请输入备注"/>
      </a-form-item>
      <a-form-item label="内容"
                   name="content"
      >
        <div style="width: 500px">
          <Vditor v-model:value="state.form.content" :height="300"/>
        </div>
      </a-form-item>
    </a-form>

    <ZyFormButton @save="onSubmit" @close="close"/>
  </section>
</template>

<script setup>
import {reactive, toRaw, ref} from 'vue';
import ZyFormButton from "comps/common/ZyFormButton.vue";
import {ZyConfirm, ZyNotification} from "libs/util.toast";
import {usersCreate, usersUpdate} from "api/modules/api.users";
import Vditor from "../../../components/Vditor/index.vue";

const labelCol = {
  style: {
    width: '70px',
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
    ZyNotification.success('操作成功')
    emit('close', true)
   /* if (!isAdd.value) {
      delete state.form.password
    }
    let FUC = isAdd.value ? usersCreate : usersUpdate
    FUC(toRaw(state.form)).then(res => {
      ZyNotification.success('操作成功')
      emit('close', true)
    }).catch(err => {
      ZyNotification.error(err || '操作失败')
    })*/
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
