<template>
  <section class="zy-blog-article">
    <aside class="blog-left"
           :style="{'background-image': backgroundImg}">
      <section class="blog-l-info">
        <p class="info-title">博文精选</p>
        <p class="info-title-sub">有趣的人记录有趣的事。 </p>
        <p class="info-title-sub ban-bred">
          <span @click="goToPage('/blog')" title="发现更多有趣的文章"> 发现更多 <i class="iconfont icon-shujuzhongxin"></i></span>
        </p>
      </section>
    </aside>
    <section class="blog-right">
      <section class="blog-list">
        <article class="blog-item" v-for="(post,index) in state.postList" :key="index"
                 @click="goToPage('/PostDetail/'+post._id)">
          <header class="blog-header" :style="{width:!post.cover&&'100%'}">
            <h2>{{ post.title }}</h2>
            <p class="abstract">{{ post.abstract }}</p>
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
      </section>
    </section>
  </section>
</template>

<script setup>
import {nextTick, onBeforeUnmount, onMounted, reactive, ref, watch} from 'vue'
import {goToPage} from "../../../libs/util.router";
import {openFullscreen} from "../../../libs/util.common";
import {TimeUtils} from "../../../libs/util.time";
import lazyLoadImages from "../../../libs/util.lazyLoad";
import {blog_articlesList} from "../../../api/modules/api.blog_articles";

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
    params: {
      recommended: true,
      status: true,
    },
    pagination: {
      current: 1,
      pageSize: 3,
    },
  },
  postList: []
})

// 数据更新后使用 nextTick 来确保在 DOM 更新后执行 lazyLoadImages 方法
watch(() => state.postList, () => {
  nextTick(() => {
    lazyLoadImages();
  })
});
const getDataList = () => {
  blog_articlesList(state.query).then(res => {
    state.postList = res.data.result || []
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
.zy-blog-article {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  background-color: #fff;
  margin: 4rem 0;
  min-height: 350px;

  .blog-left {
    width: 35%;
    background-color: rgba(0, 0, 0, 0.5);
    background-image: url(https://blogcdn.dandyweng.com/backgrounds/08.jpg);
    background-size: cover;
    background-repeat: no-repeat;
    transform-style: preserve-3d;
    transition: background-image 2s ease-in-out;
    will-change: transition;

    .blog-l-info {
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);

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
        cursor: pointer;
        transition: all .3s linear;

        &:hover {
          color: #ffffff;
        }

      }
    }
  }

  .blog-right {
    width: 65%;
    height: 100%;
  }

  .blog-list {
    margin: 0 auto;
    padding: 1rem 3rem 1rem;

    .blog-item {
      display: flex;
      justify-content: space-between;
      letter-spacing: 1px;
      cursor: pointer;
      opacity: .7;
      transition: all .3s linear;
      margin: 0 auto 2rem;

      &:last-child {
        margin-bottom: 0;
      }

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

          span {
            padding-right: 5px;
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
          border-radius: 2px;
          transition: all .3s linear;
          box-shadow: 0 2px 5px rgba(0, 0, 25, 0.1), 0 5px 35px 1px rgba(0, 0, 50, 0.2) inset;
        }
      }

    }
  }

  @media screen and (max-width: 968px) {
    flex-direction: column;
    .blog-left {
      height: 180px;
      width: 100%;
      position: relative;
    }
    .blog-right {
      width: 100%;

      .blog-list {
        padding: 2rem 0 0 0;

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
