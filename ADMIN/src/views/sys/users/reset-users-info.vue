<template>
  <section class="zy-get">
    <a-form :model="state.form"
            class="zy-form"
            :label-col="labelCol"
            ref="formRef"
            :wrapper-col="wrapperCol">
      <a-form-item label="密码"
                   name="password"
                   :rules="[{ required: true, message: '请输入密码!' }]"
      >
        <a-input v-model:value="state.form.password" type="password" disabled allowClear placeholder="请输入密码"/>
      </a-form-item>
      <a-form-item label="新密码"
                   name="newPassword"
                   :rules="[{ required: true, message: '请输入新密码!' }]"
      >
        <a-input v-model:value="state.form.newPassword" allowClear placeholder="请输入新密码"/>
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
import {usersCreate, usersReset, usersUpdate} from "../../../api/modules/api.users";

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
state.form = props.updateData || {}


const onSubmit = async () => {
  try {
    const values = await formRef.value.validateFields();
    usersReset(toRaw(state.form)).then(res => {
      ZyNotification.success('密码重置成功')
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
