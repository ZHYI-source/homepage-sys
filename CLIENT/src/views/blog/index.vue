<template>
  <section class="zy-blog">
    <aside class="blog-left"
           :style="{'background-image': backgroundImg ,'background-position': backgroundPosition}">
      <div class="blog-l-content">
        <section class="blog-l-info">
          <img class="info-avatar lazy-image"
               data-src="http://www.zhouyi.run:3001/api/v1/files/preview?p=425a82c1dcbc37caa33680de28d2a04.jpg&&mimetype=image/jpeg">
          <p class="info-title">{{ setting.websiteInfo.name }}的博客</p>
          <p class="info-title-sub">有趣的人记录有趣的事。 </p>
          <p class="info-title-sub ban-bred">
          <span @click="goToPage('/')" title="回到主页" class="iconfont icon-shouye">
          </span>
            <span @click="goToPage('/contact')" title="留言" class="iconfont icon-pinglun">
          </span>
            <span @click="openFullscreen" title="全屏阅读更舒适" class="iconfont icon-quanping1">
          </span>
          </p>
          <p class="search-box">
            <input type="text" v-model="state.query.params.title" @input="goPage(1)" placeholder="🔎">
          </p>
        </section>
      </div>
    </aside>
    <section class="blog-right">
      <section class="blog-list c-mb-40 c-mt-40">
        <template v-if="state.postList.length">
          <article class="blog-item c-mb-20" v-for="(post,index) in state.postList" :key="index"
                   @click="goToPage('/PostDetail/'+post._id)">
            <header class="blog-header" :style="{width:!post.cover&&'100%'}">
              <h2>{{ post.title }}</h2>
              <p>{{ post.abstract }}</p>
              <div class="blog-tip">
                <span>{{ TimeUtils.formatRelativeTime(post.createdAt) }} 发布</span>
                <span><i class="iconfont icon-chakan2"></i> {{ post.viewNum }}</span>
                <!--                                                      |  <span>5条喜欢</span>-->
              </div>
            </header>
            <div class="blog-cover" v-if="post.cover">
              <img class="lazy-image" :data-src="post.cover">
            </div>
          </article>
          <div class="pagination" v-if="state.query.pagination.total>state.query.pagination.pageSize">
            <a-pagination
                v-model:current="state.query.pagination.current"
                :pageSize="state.query.pagination.pageSize"
                :total="state.query.pagination.total"
                @change="goPage"
                show-less-items/>
          </div>
        </template>
        <a-empty v-else/>
      </section>

    </section>
  </section>
</template>

<script setup>
import {onBeforeUnmount, onMounted, ref, reactive, watch, nextTick} from 'vue'
import {goToPage} from "../../libs/util.router";
import {openFullscreen} from "../../libs/util.common";
import {TimeUtils} from "../../libs/util.time";
import lazyLoadImages from "../../libs/util.lazyLoad";
import {blog_articlesList} from "../../api/modules/api.blog_articles";
import setting from "../../setting";

const backgroundPosition = ref('50% 0');
const backgroundImg = ref('url(http://www.zhouyi.run:3089/v1/common/files/preview/img/1691571900783.png)');
const handleScroll = (e) => {
  const offsetY = window.scrollY;
  backgroundPosition.value = `50% ${offsetY * 0.02}%`;
}

let currentImageIndex = 1;
const totalImages = 9;

function updateBackgroundImage() {
  backgroundImg.value = `url(http://www.zhouyi.run:3089/v1/common/files/preview/img/${getImageName(currentImageIndex)}.jpg)`;
  currentImageIndex = (currentImageIndex % totalImages) + 1;
}

function getImageName(index) {
  return index < 10 ? `0${index}` : `${index}`;
}

const state = reactive({
  query: {
    params: {},
    pagination: {
      total: 0,
      pageSize: 10,
      current: 1
    }
  },
  postList: []
})

const inputChange = () => {

}
// 查询
const goPage = (num = 1) => {
  state.query.pagination.current = num;
  getDataList()

}
const smoothScroll = (ele) => {
  document.querySelector(ele).scrollIntoView({
    behavior: 'smooth'
  })
}

// 数据更新后使用 nextTick 来确保在 DOM 更新后执行 lazyLoadImages 方法
watch(() => state.postList, () => {
  nextTick(() => {
    lazyLoadImages();
  })
});
const getDataList = () => {
  blog_articlesList(state.query).then(res => {
    state.postList = res.data.result || []
    state.query.pagination.total = res.data.total
    state.query.pagination.current = res.data.current
    state.query.pagination.pageSize = res.data.pageSize
  })
}
getDataList()

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  setInterval(updateBackgroundImage, 8000);
});


onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="scss" scoped>
.zy-blog {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  background-color: #fff;

  .blog-left {
    width: 35%;
    height: 100vh;
    position: sticky;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    background-repeat: no-repeat;
    background-position: center -30px;
    transform-style: preserve-3d;
    transition: background-image 2s ease-in-out;
    will-change: transition;

    .blog-l-content {
      position: absolute;
      top: 0;
      height: 100%;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }

    .blog-l-info {
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);

      .info-avatar {
        border-radius: 100%;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5), 0px 2px 20px 3px rgba(0, 0, 0, 0.25);
        width: 8rem;
        height: 8rem;
        display: inline-block;
        object-fit: cover;
        margin-bottom: 1rem;
      }

      .info-title {
        color: #fff;
        font-size: 2.1rem;
        font-family: "plantc", "Source Han Serif", serif;
        letter-spacing: 2px;
      }

      .info-title-sub {
        color: #EEEEEE;
      }

      .ban-bred {
        padding: 5px 10px;
        //background-color: rgba(#fff,.5);
        text-align: left;

        span {
          cursor: pointer;
          margin-right: 1rem;
        }

        .current {
          color: #ffffff;
        }
      }

      .search-box {


        input {
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          border: none;
          color: #EEEEEE;

          &::placeholder {
            opacity: .5;
          }
        }
      }
    }
  }

  .blog-right {
    width: 65%;
    //height: 100vh;
    overflow: auto;
  }

  .blog-list {
    margin: 40px auto;
    padding: 3rem 4.5rem;

    .blog-item {
      display: flex;
      justify-content: space-between;
      letter-spacing: 1px;
      cursor: pointer;
      opacity: .7;
      transition: all .3s linear;
      margin: 0 auto 3.5rem;

      &:hover {
        opacity: 1;

        img {
          filter: brightness(1.1);
        }
      }

      .blog-header {
        width: 68%;

        h2 {
          margin-bottom: 20px;
          font-weight: bold;
        }

        .blog-tip {
          padding: 5px 0;
          font-size: .9rem;
          color: #a1a0a0;
          display: flex;
          justify-content: left;
          align-items: center;

          span {
            padding-right: 1rem;
            line-height: 2rem;
          }
        }
      }

      .blog-cover {
        width: 30%;
        max-height: 160px;
        //width: 260px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 5px;
          transition: all .3s linear;
          box-shadow: 0 2px 5px rgba(0, 0, 25, 0.1), 0 5px 35px 1px rgba(0, 0, 50, 0.2) inset;
        }
      }

    }
  }

  @media screen and (max-width: 968px) {
    flex-direction: column;
    .blog-left {
      height: 300px;
      width: 100%;
      position: relative;

      .blog-l-info {
        .info-title {
          font-size: 1.7rem;
        }
      }
    }
    .blog-right {
      width: 100%;

      .blog-list {
        padding: 2rem;

        .blog-item {
          flex-direction: column-reverse;
          margin-bottom: 40px;

          .blog-header {
            width: 100%;
          }

          .blog-cover {
            width: 100%;
            height: 160px;
            margin-bottom: 2.5rem;
          }
        }
      }
    }
  }
}

</style>
