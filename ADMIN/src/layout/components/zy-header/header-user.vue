<template>
  <div class="header-user">
    <a-dropdown v-if="userInfo.nickname" class="header-user-dropdown">
      <div class="header-user-logo">
        <ZyLogo size="25" :url="userInfo.avatar" :showTitle="false"/>
        <span class="header-user-name">
           {{ userInfo.nickname }}
        </span>
      </div>
      <template #overlay>
        <a-menu>
          <a-menu-item @click="logout">
            <span>
              <IconFont type="icon-guanbi"/>
              退出系统
            </span>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <span v-else class="username" @click="noLoginHandel">未登录</span>
  </div>
</template>

<script setup>
import {
  UserOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue';
import {Modal} from 'ant-design-vue';
import {createVNode} from 'vue';
import {useRouter} from 'vue-router';
import {useAuthStore} from '../../../stores/auth.js';
import dbUtils from '../../../libs/util.strotage.js'
import ZyLogo from "comps/common/ZyLogo.vue";

const router = useRouter()
const authStore = useAuthStore()
const userInfo = dbUtils.get('userInfo')
const logout = () => {
  Modal.confirm({
    title: '确认退出系统?',
    icon: createVNode(ExclamationCircleOutlined),
    onOk() {
      authStore.logout()
    },
  });
}
const noLoginHandel = () => {
  authStore.logout()
}

</script>

<style lang="scss" scoped>
.header-user {
  cursor: pointer;
  transition: all .2s linear;
  box-sizing: border-box;
  padding: 0 8px;
  display: flex;
  justify-content: center;
  align-items: center;


  .header-user-logo {
    display: flex;
    justify-content: center;
    align-items: center;

    .header-user-name {
      margin-left: 8px;
      transition: all .2s linear;
      font-size: .9rem;

      &:hover {
        color: $color-primary;
      }
    }
  }


}
</style>
