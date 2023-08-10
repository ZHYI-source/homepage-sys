<template>
    <section class="zy-home">
        <div class="img-box">
            <ZyLogo :showTitle="false" size="80"/>
        </div>
        <hr/>
        <section class="one">
            <header class="major">
                <h1>ZY·Admin管理系统</h1>
                <p class="sub-title">基于 Vue 3 + js + Pinia +Vite + <a href="https://www.antdv.com/docs/vue/getting-started-cn">Ant Design Vue</a>.</p>
                <p>ZY·Admin是一个现代化的管理系统，提供了一系列功能丰富的组件和工具，帮助开发者快速搭建和开发管理后台应用。
                  <br>
                  对快速构建Vue3全栈项目有很大的帮助，解决每次新建项目基础配置的烦恼.
                </p>
                <a href="https://gitee.com/Z568_568/ZY-Admin.git" target="_blank">
                    <a-button type="primary">源码</a-button>
                </a>
                <a href="http://www.zhouyi.run/#/About" target="_blank">
                    <a-button type="primary">个人主页</a-button>
                </a>
            </header>
            <div class="zy-code">
                <code>$ https://gitee.com/Z568_568/ZY-Admin.git</code>
                <code>$ npm i</code>
                <code>$ npm run dev</code>
                <code>$ npm run build</code>
            </div>

        </section>

    </section>
</template>

<script setup>
import ZyLogo from "../../components/common/ZyLogo.vue";

</script>

<style lang="scss" scoped>
.zy-home {
  padding-top: 2rem;
}
    .img-box {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 2rem auto 2rem;
    }

    .one {
        max-width: 1200px;
        margin: 2rem auto;

        .major {
            text-align: center;
            margin-bottom: 2rem;

            h1 {
                margin-bottom: 1rem;
            }

            p:nth-child(3) {
                margin-bottom: 1rem;
            }

            a {
                margin: .5rem;
            }
        }
    }
</style>
