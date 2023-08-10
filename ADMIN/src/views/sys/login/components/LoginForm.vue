<template>
  <div v-show="getShow">
    <h2 class="login-title">登录</h2>
    <a-form
        loading
        :model="state.formState"
        name="normal_login"
        class="login-form"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
    >
      <a-form-item
          name="username"
          :rules="[{ required: true, message: '请输入用户名!' }]"
      >
        <a-input v-model:value="state.formState.username" allowClear autocomplete="off" size="large"
                 placeholder="用户名">
          <template #prefix>
            <IconFont type="icon-yonghuming" style="font-size: 18px"/>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
          name="password"
          :rules="[{ required: true, message: '请输入密码!' }]"
      >
        <a-input-password v-model:value="state.formState.password" allowClear autocomplete="off" placeholder="密码"
                          size="large">
          <template #prefix>
            <IconFont type="icon-mima" style="font-size: 18px"/>
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item
          name="code"
          :rules="[{ required: true, message: '请输入验证码!' }]"
      >
        <div style="display: flex">
          <a-input v-model:value="state.formState.code" allowClear autocomplete="off" size="large" placeholder="验证码">
            <template #prefix>
              <IconFont type="icon-yanzhengma" style="font-size: 18px"/>
            </template>
          </a-input>
          <div class="login-code" v-html="state.captchaSvg" @click="getCaptcha"></div>
        </div>
      </a-form-item>
      <a-form-item>
        <a-form-item name="remember" no-style>
          <a-checkbox v-model:checked="state.formState.remember">记住密码</a-checkbox>
        </a-form-item>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" style="width: 100%" :disabled="disabled" html-type="submit" size="large"
                  class="login-form-button">
          登录
        </a-button>
      </a-form-item>
    </a-form>
    <div>
      <a-space class="login-btn-list">
        <a-button @click="setLoginState('register')" class="login-form-button">
          注册
        </a-button>
        <a-button @click="setOtherUser" class="login-form-button">
          其他用户
        </a-button>
        <a-button disabled class="login-form-button">
          手机登录
        </a-button>
        <a-button disabled class="login-form-button">
          扫二维码登录
        </a-button>
      </a-space>
    </div>
    <a-divider class="hr">其他方式登录</a-divider>
    <div class="other-login-type">
      <IconFont class="type-item" type="icon-github"/>
      <IconFont class="type-item" type="icon-gitee"/>
      <IconFont class="type-item" type="icon-weixin"/>
      <IconFont class="type-item" type="icon-weibo"/>
      <IconFont class="type-item" type="icon-qq"/>
    </div>
  </div>
</template>

<script setup>
import {reactive, ref, computed} from 'vue';
import loginBg from '@/assets/img/login-bg.png';
import {SmileOutlined} from '@ant-design/icons-vue';
import {notification} from 'ant-design-vue';

import {useAuthStore} from '../../../../stores/auth.js';
import {useLoginState} from '@/hooks/sys/useLogin.js';
import {authCaptcha} from "../../../../api/modules/api.auth";

const authStore = useAuthStore()
const {setLoginState, getLoginState} = useLoginState();
const getShow = computed(() => {
  return getLoginState.value === 'login'
});


const state = reactive({
  formState: {},
  captchaSvg: ''
})

const getCaptcha = () => {
  authCaptcha().then(res => {
    state.captchaSvg = ref(res.data)
  }).catch(err => {
  })
}

const setOtherUser = () => {
  state.formState.username = 'test'
}

const onFinish = values => {
  authStore.login(values).then(res => {

  }).catch(err => {
    getCaptcha()
  })

};
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};
const disabled = computed(() => {
  return !(state.formState.username && state.formState.password);
});

getCaptcha()

</script>

<style lang="scss" scoped>
.login-title {
  margin-bottom: 30px;
}

.hr {
  font-size: .9rem;
  color: #575656;
}

.login-form {
  max-width: 400px;
  background-color: #fff;
  overflow: hidden;

  .login-code {
    cursor: pointer;
  }
}

.login-btn-list {
  display: flex;
  flex-wrap: wrap;
}

.other-login-type {
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 22px;

  .type-item {
    cursor: pointer;

    &:hover {
      color: $color-primary !important;
    }
  }
}
</style>
