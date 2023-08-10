<template>
  <a-layout class="login-box">
    <a-layout-header class="login-logo">
      <ZyLogo class="login-img"/>
    </a-layout-header>
    <a-layout-content class="login-content">
      <a-row align="middle" justify="center" class="login-content-main">
        <a-col class="login-content-bgc" :pull="1">
          <img :src="loginBg" width="480">
          <h2>{{setting.websiteInfo.desc || '开箱即用的中后台管理系统'}}</h2>
          <p style="margin-top: 15px">✨✨✨ 欢迎使用 {{setting.websiteInfo.name || 'ZY·Admin'}}@{{ setting.websiteInfo.version || '1.0.0' }}！</p>
          <p style="margin-top: 15px">
            <a href='https://gitee.com/Z568_568/all-blog-sys/stargazers'><img
                src='https://gitee.com/Z568_568/all-blog-sys/badge/star.svg?theme=dark' alt='star'/></a>
            <a href='https://gitee.com/Z568_568/all-blog-sys/members'><img
                src='https://gitee.com/Z568_568/all-blog-sys/badge/fork.svg?theme=dark' alt='fork'/></a>
          </p>
        </a-col>

        <a-col class="login-content-form">
          <LoginForm/>
          <RegisterForm/>
        </a-col>
      </a-row>
    </a-layout-content>
    <a-layout-footer class="login-footer">
      <div v-if="setting.reference.show" class="copyright">{{ ` Copyright ©${new Date().getFullYear()} by` }}<a target="_blank" class="out-link"
                                                                                  :href="setting.reference.authorizationUrl">@{{
          setting.reference.authorization
        }}</a>
        . All rights reserved. | <a target="_blank" class="out-link"
                                    href="https://beian.miit.gov.cn/#/Integrated/index">{{
            setting.reference.number
          }}</a>
      </div>
    </a-layout-footer>
  </a-layout>
</template>

<script setup>
import ZyHeaderLogo from "comps/common/ZyHeaderLogo.vue";
import {reactive, ref, computed} from 'vue';
import loginBg from '@/assets/img/login-bg.png';
import {UserOutlined, LockOutlined} from '@ant-design/icons-vue';
import {useAuthStore} from '../../../stores/auth.js';
import LoginForm from "./components/LoginForm.vue";
import RegisterForm from "./components/RegisterForm.vue";
import ZyLogo from "comps/common/ZyLogo.vue";
import setting from "@/setting.js";

const authStore = useAuthStore()
const formState = reactive({
  username: 'admin',
  password: 'admin',
  code: '',
  remember: true,
});
const onFinish = values => {
  console.log('Success:', values);
  authStore.login()

};
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};
const disabled = computed(() => {
  return !(formState.username && formState.password);
});

</script>

<style lang="scss" scoped>
$color-bg: #ffffff;
.login-box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: $color-bg;

  .login-logo, .login-footer {
    color: #444343;
    background-color: $color-bg;

  }

  .login-content {
    height: 100%;

    .login-content-main {
      height: 100%;

      .login-content-bgc {
        text-align: center;
        padding-bottom: 100px;
      }

      .login-content-form {
        border: 1px solid #e3e3e3;
        padding: 60px;
        border-radius: 8px;
        overflow: hidden;
        box-sizing: border-box;

        .login-title {
          margin-bottom: 30px;
        }

        .login-form {
          max-width: 400px;
          background-color: #fff;
          overflow: hidden;

          .login-form-button {
            margin-right: 15px;
          }
        }
      }
    }
  }

  .login-footer {
    text-align: center;
    font-size: .8rem;
    color: #828181;
  }
}
</style>
