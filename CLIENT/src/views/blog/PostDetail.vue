<template>
  <section class="zy-blog-detail" ref="detailLayerRef">
    <ZyPageHeader title="文章详情" subTitle="有趣的人记录有趣的事" disBgAnimate
                  img="https://images.unsplash.com/photo-1495305730668-3d13ae2a3250?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  current="PostDetail">
      <template #action>
        <span class="page-action" @click="goToPage('/blog')">博文列表 / </span>
      </template>
    </ZyPageHeader>
    <main class="contents-wrap">
      <div class="content-header">
        <h2 class="header-text">{{ state.postDetailData.title }}</h2>
        <div class="header-tip">
          <!--                    <div class="tip-item">-->
          <!--                        <span class="tip-icon">TOC</span>-->
          <!--                        <a-switch size="small" v-model:checked="state.openToc"/>-->
          <!--                    </div>-->
          <div class="tip-item"><i class="iconfont icon-zuozhe tip-icon"></i>ZHOUYI</div>
          <div class="tip-item"><i
              class="iconfont icon-shijian tip-icon"></i>{{ TimeUtils.formatRelativeTime(state.postDetailData.createdAt) }}
          </div>
          <div class="tip-item" @click="changeFontFamily">更换字体</div>
          <!--<div class="tip-item"><i class="iconfont icon-daochu tip-icon"></i>分享文章</div>-->
        </div>
      </div>

      <hr style="margin-bottom: 2rem">
      <ZyMarkdownRenderer :markdownContent="state.postDetailData.content" :showToc="state.openToc"/>
      <!--      <hr style="margin: 50px auto">-->
      <div class="content-footer">
        <div class="footer-l" v-show="state.postDetailData.category">
          # {{ state.postDetailData.category }}
        </div>
        <div class="footer-r">
          <div class="view">
            浏览
            ({{ state.postDetailData.viewNum || 0 }})
          </div>
          <div class="like" @click="likePost">
            点赞 ({{ state.postDetailData.likeNum || 0 }})
          </div>
        </div>
      </div>
      <div class="reship" v-if="state.postDetailData.isReship">
        <p>转载：- <a :href="state.postDetailData.isReshipUrl" target="_blank">
          《{{ state.postDetailData.isReshipName }}》</a></p>
        <p>著名：如侵犯您的版权，请
          <router-link to="/">联系我</router-link>
          回复原文章的地址，我会给您删除此文章，给您带来不便请您谅解！
        </p>
      </div>

      <section v-if="state.postRelateData.length">
        <h2 class="section-title">
          🎯 相关文章
          <span data-number="01"></span>
        </h2>
        <div class="related">
          <ul>
            <li v-for="(item,index) in state.postRelateData" :key="item._id"
                @click="goToCurrentPage('PostDetail',item._id)">
              {{ item.title }}
            </li>

          </ul>
        </div>
      </section>

      <section v-if="false">
        <h2 class="section-title">
          🎯 评论 (163)
          <span data-number="02"></span>
        </h2>
        <div class="post-comment-form">
          <ZyForm/>
        </div>
        <ZyComment/>
      </section>
    </main>
  </section>
</template>

<script setup>
import {reactive, onMounted, ref, watch} from 'vue'
import {useRouter} from 'vue-router'
import ZyMarkdownRenderer from "../../components/common/ZyMarkdownRenderer.vue";
import ZyComment from "../../components/common/ZyComment.vue";
import {goToPage} from "../../libs/util.router";
import lazyLoadImages from "../../libs/util.lazyLoad";
import ZyPageHeader from "../../components/common/ZyPageHeader.vue";
import ZyForm from "../../components/common/ZyForm.vue";
import ZyPickColor from "../../components/common/ZyPickColor.vue";
import {blog_articlesDetail, blog_articlesLike, blog_articlesRelate} from "../../api/modules/api.blog_articles";
import {TimeUtils} from "../../libs/util.time";
import dbUtils from "../../libs/util.strotage";


const router = useRouter()
const detailLayerRef = ref(null)
const state = reactive({
  query: {
    _id: router.currentRoute.value.params.id
  },
  openToc: false,
  fontFamily: false,
  postDetailData: {},
  postRelateData: []
})


watch(() => router.currentRoute.value.params, (val) => {
  val.id && refreshGetPageData(val.id)
})

const refreshGetPageData = (id) => {
  state.query._id = id
  getPostDetail()
}
const goToCurrentPage = (path, postId) => {
  router.push({name: path, params: {id: postId}});
  refreshGetPageData(postId)
}
const changeFontFamily = () => {
  state.fontFamily = !state.fontFamily
  state.fontFamily ? (detailLayerRef.value.style.fontFamily = '"lustria", SimSun, serif') : detailLayerRef.value.style.fontFamily = 'Söhne,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Helvetica Neue,Arial,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
}
const getRelateList = (_id) => {
  blog_articlesRelate({_id}).then(res => {
    state.postRelateData = res.data || []
  })
}
const getPostDetail = () => {
  blog_articlesDetail(state.query).then(res => {
    state.postDetailData = res.data || {}
  })
}
const getPostRelate = () => {
  getRelateList({_id: state.query._id})
}
const likePost = () => {
  blog_articlesLike({_id: state.query._id}).then(res => {
    if (res.status) {
      if (res.data?.token) {
        // 如果返回了临时 Token，将其保存在浏览器的 LocalStorage 或 SessionStorage 中
        dbUtils.set('tempToken', res.data.token)
      }
      // 本地更新点赞数
      state.postDetailData.likeNum += 1
    }

  })
}


getPostDetail()
getPostRelate()
onMounted(() => {
  // 懒加载图片
  lazyLoadImages();

})
</script>

<style lang="scss" scoped>
.zy-blog-detail {
  width: 100%;
  flex: 1 0 auto;
  box-sizing: border-box;
  background-color: rgb(255, 255, 255);
  padding-bottom: 2rem;
  /*font-family: "lustria", SimSun, serif;*/
  /*font-family: -apple-system,BlinkMacSystemFont,"opensans","Optima","Microsoft Yahei",sans-serif;*/
  letter-spacing: .5px;
  font-family: Söhne,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Helvetica Neue,Arial,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
  .page-action {
    font-size: 1rem;
    cursor: pointer;
  }


  .contents-wrap {
    max-width: 960px;
    box-sizing: border-box;
    padding: 20px 15px;
    position: relative;
    border-radius: 5px;
    //box-shadow: 0 0 3px rgba(60, 72, 88, 0.15);
    margin: 1rem auto 0;

    .content-header {
      margin-top: 2rem;
      margin-bottom: 2rem;

      .header-text {
        line-height: 3rem;
        word-spacing: 2px;
        letter-spacing: .5px;
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 1rem;
        font-family: inherit;
      }

      .header-tip {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;

        .tip-item {
          letter-spacing: .5px;
          padding: 10px 10px 0 0;
          color: #afafaf;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: .9rem;
          cursor: pointer;

          .tip-icon {
            margin-right: 5px;
          }
        }
      }
    }

    .content-footer {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 3rem auto;

      .footer-r {
        display: flex;
        justify-content: right;
        align-items: center;
        color: #999797;
        font-size: .9rem;

        .like {
          margin: 0 1rem 0 1rem;
          cursor: pointer;

          &:hover {
            color: #c60e0e;
          }
        }
      }

    }

    .reship {
      width: 100%;
      min-height: 120px;
      background-color: #000000;
      position: relative;
      margin: 3rem auto;
      box-sizing: border-box;
      padding: 2rem;

      &:before {
        content: '';
        position: absolute;
        top: -18px;
        left: 50%;
        border: 10px solid transparent;
        border-bottom-color: #000000;
      }
    }
  }

  .related {
    margin: 3rem auto;

    ul {
      padding-left: 2.5rem;

      li {
        letter-spacing: 1px;
        font-size: 14px;
        padding: .1rem 0 .5rem 5px;
        cursor: pointer;
        color: #9a9a9a;

        &:hover {
          color: $color-primary;
        }
      }

      li::marker {
        content: '📍';

      }
    }
  }

  .post-comment-form {
    margin: 2rem auto;

    .cont-form {
      width: 100%;
      background-color: #fff;

      input {
        width: 100%;
        height: 50px;
        margin-bottom: 30px;
        padding: 10px;
        border: none;
        -webkit-box-shadow: 0 0 90px rgba(0, 0, 0, 0.15);
        box-shadow: 0 0 90px rgba(0, 0, 0, 0.15);
        font-family: "Poppins", sans-serif;

        &:first-child {
          margin-right: 1rem;
        }

      }

      textarea {
        width: 100%;
        height: 150px;
        margin-bottom: 30px;
        padding: 10px;
        border: none;
        -webkit-box-shadow: 0 0 90px rgba(0, 0, 0, 0.15);
        box-shadow: 0 0 90px rgba(0, 0, 0, 0.15);
        font-family: "Poppins", sans-serif;
      }

      .site-btn {
        position: relative;
        display: inline-block;
        color: #fff;
        padding: 14px 40px;
        border: none;
        font-family: "Poppins", sans-serif;
        line-height: normal;
        text-transform: uppercase;
        border-radius: 50px;
        font-size: 12px;
        letter-spacing: 1px;
        background: #333;
      }
    }
  }
}
</style>
