<template>
  <main class="zy-layout-all-group" id="zy-layout-all-group" ref="layoutGroup">
    <!-- 顶栏-->
    <section class="zy-theme-header" v-if="router.currentRoute.value.path==='/index'"
             :style="{top:showHeader?0:'-100%'}">
      <div class="header-logo">
        <span class="logo-text" @click="goIndex">{{setting.websiteInfo.name||'ZHOU YI'}}</span>
      </div>
      <div class="header-right">
        <ZyMenuList/>
      </div>

    </section>
    <!-- 主体内容-->
    <section class="zy-theme-container-main"
             id="zy-theme-container-main"
    >
      <RouterView/>
      <ZyGoTop/>
    </section>
    <footer class="main-footer" ref="layoutFooter" v-if="router.currentRoute.value.path==='/index'">
      <div class="main-info">
        <div class="info-item">
          <div class="item-title">微信</div>
          <a-image
              :width="80"
              src="http://www.zhouyi.run:3001/api/v1/files/preview?p=6f0b0673e1a42ba952edfca76a557ca.png&&mimetype=image/png"
          />
        </div>
        <div class="info-item">
          <div class="item-title">QQ</div>
          <a-image
              :width="90"
              src="http://www.zhouyi.run:3001/api/v1/files/preview?p=d110c3b8573988728c2685d9a5889d2.png&&mimetype=image/png"
          />
        </div>

      </div>

      <div class="copyright" v-if="setting.reference.show">
        {{ ` Copyright ©${new Date().getFullYear()} by` }}
        <a target="_blank" class="out-link" :href="setting.reference.authorizationUrl">
          @{{setting.reference.authorization}}</a>. All rights reserved. |
        <a target="_blank" class="out-link" href="https://beian.miit.gov.cn/#/Integrated/index">
          {{setting.reference.number}}
        </a>
      </div>
    </footer>
  </main>
</template>

<script setup>
import ZyGoTop from "../components/common/ZyGoTop.vue";
import ZyMenuList from "../components/common/ZyMenuList.vue";
import {ref, reactive, watchEffect, onBeforeUnmount, onMounted, watch} from 'vue'
import {useRouter} from 'vue-router'
import setting from "../setting";

const router = useRouter()
const showHeader = ref(true)

const state = reactive({
  lastScrollTop: 0,
  show: {
    menuList: true
  },
})


watch(router.currentRoute, (e) => {
  state.show.menuList = e.path === '/index'
})


const goIndex = () => {
  router.push('/index')
}
const watchScroll = () => {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  if (scrollTop === 0) {
    showHeader.value = true
  } else showHeader.value = scrollTop < state.lastScrollTop;
  state.lastScrollTop = scrollTop
}

onMounted(() => {
  window.addEventListener('scroll', watchScroll)


})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', watchScroll);
});
</script>

<style lang="scss" scoped>
.zy-layout-all-group {
  width: 100%;
  height: 100%;
  box-sizing: border-box;


  .zy-theme-header {
    height: 50px;
    background-color: rgba(#000000, .5);
    position: fixed;
    top: -100%;
    left: 0;
    width: 100%;
    z-index: 9;
    pointer-events: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    transition: all .4s ease;

    .header-logo {
      width: 200px;

      img {
        display: inline-block;
        width: 40px;
        height: 40px;
        object-fit: cover;
      }

      .logo-text {
        color: #EEEEEE;
        font-weight: bold;
        font-size: 20px;
        font-family: "Droid Sans Mono";
        padding: 0 15px;
        cursor: pointer;
        display: inline-block;
        /* -webkit-box-reflect: below -5px linear-gradient(transparent, rgba(0, 0, 0, .4));*/
      }
    }

    .header-right {
      overflow: auto;

      &::-webkit-scrollbar {
        display: none;
      }

    }
  }

  .zy-theme-container-main {
    box-sizing: border-box;
    position: relative;
    scroll-behavior: smooth;
    height: 100%;
  }

  .main-footer {
    border-top: 1px solid #f1f1f1;
    padding: 1.5rem;
    background-color: #fff;

    .main-info {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      padding: 1rem;
      @media screen and (min-width: 768px) {
        display: none;
      }

      .info-item {
        margin: 5px;

        .item-title {
          font-size: 1.2rem;
          font-family: "plantc", "Source Han Serif", serif;
        }
      }
    }

    .copyright {
      text-align: center;
      font-size: .8rem;
      color: #a8a8a8;
      letter-spacing: 1px;

      a {
        color: #a8a8a8;
      }
    }

  }


}

</style>
