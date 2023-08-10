<template>
  <section class="zy-get">
    <a-form :model="state.form"
            class="zy-form"
            :label-col="labelCol"
            ref="formRef"
            :wrapper-col="wrapperCol">
      <a-form-item label="头像"
                   name="avatar"
                   :rules="[{ required: true, message: '请上传头像!' }]">
        <div class="upload-box">
          <a-textarea v-model:value="state.form.avatar" allowClear placeholder="在线地址"></a-textarea>
          <a-image style="margin: 1rem 0" v-if="state.form.avatar" width="80px" :src="state.form.avatar"></a-image>
          <ZyUpload v-model:url="state.form.avatar"/>
        </div>
      </a-form-item>
      <a-form-item label="昵称"
                   name="nickname"
                   :rules="[{ required: true, message: '请输入昵称!' }]">
        <a-input v-model:value="state.form.nickname" allowClear placeholder="请输入昵称"/>
      </a-form-item>
      <a-form-item label="用户名"
                   name="username"
                   :rules="[{ required: true, message: '请输入用户名!' }]"
      >
        <a-input v-model:value="state.form.username" allowClear placeholder="请输入用户名"/>
      </a-form-item>
      <a-form-item label="密码"
                   v-if="!state.form._id"
                   name="password"
                   :rules="[{ required: true, message: '请输入密码!' }]"
      >
        <a-input v-model:value="state.form.password" allowClear placeholder="请输入密码"/>
      </a-form-item>

      <a-form-item label="邮箱"
                   name="email">
        <a-input v-model:value="state.form.email" allowClear placeholder="请输入邮箱"/>
      </a-form-item>
      <a-form-item label="备注"
                   name="remark"
      >
        <a-textarea v-model:value="state.form.remark" allowClear placeholder="请输入备注"/>
      </a-form-item>
      <a-form-item label="角色" name="roleId"
                   :rules="[{ required: true, message: '请选择角色!' }]">
        <ZyRoleSelect v-model:value="state.form.roleId"/>
      </a-form-item>
    </a-form>
    <ZyFormButton @save="onSubmit" @close="close"/>
  </section>
</template>

<script setup>
import {reactive, toRaw, ref} from 'vue';
import ZyFormButton from "comps/common/ZyFormButton.vue";
import ZyUpload from "../../../components/common/ZyUpload.vue";
import {ZyConfirm, ZyNotification} from "../../../libs/util.toast";
import ZyRoleSelect from "../../../components/common/ZyRoleSelect.vue";
import {usersCreate, usersUpdate} from "../../../api/modules/api.users";

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
    avatar: 'https://gravatar.kuibu.net/avatar/5c04c6164bbf04f3e6bcbd01dfd00e03?s=100'
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
    let FUC = isAdd.value ? usersCreate : usersUpdate
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

<style lang="scss" scoped>
.upload-box {
  display: flex;
  flex-direction: column;
}
</style>
