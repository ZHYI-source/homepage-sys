<template>
  <section class="article-list">
    <article
        v-for="(article, index) in articles"
        :key="index"
        class="article-item"
        @mouseover="showOverlay(index)"
        @click="activateArticle(index)"
        ref="articleItem"
    >
      <div class="article-left">
        <h2>
          {{ article.title }}</h2>
        <p>{{ article.content }}</p>

        <div class="article-tip">
          <div class="article-tip-item">
            <i class="iconfont icon-new new-article"></i> | 3天前 | Vue.js
          </div>
        </div>
        <div class="article-tip">
          <div class="article-tip-item">
           # vue  # JavaScript
          </div>
        </div>
        <div class="user-info">
          <img src="https://randomuser.me/api/portraits/women/26.jpg" alt="pic"/>
          <span>Leah Taylor</span>
        </div>
      </div>
      <div class="article-right" v-if="false">
        <div class="card"
             :style="{'background-image':'url(https://source.unsplash.com/200x240/?UK)'}"
             ref="cardItem"
             @mouseenter="(e)=>handleMouseEnter(e,index)"
             @mousemove="(e)=>handleMouseEnter(e,index)"
             @mouseleave="(e)=>handleMouseLeave(e,index)"
        >
          <div class="glow" />
        </div>
        <!--        <img src="https://source.unsplash.com/200x240/?UK">-->
      </div>
    </article>
    <div class="overlay"
         :style="{top: overlayTop + 'px', left: overlayLeft + 'px', width: overlayWidth + 'px',height: overlayHeight + 'px' }"></div>
  </section>
</template>


<script setup>
import {ref, onMounted} from 'vue';

// 定义文章数据
const articles = [
  {
    title: 'Vue3-Antd-JavaScript开箱即用的后台管理系统',
    content: 'Animate images with ink transition in PNG sprite.',
  },
  {
    title: 'Ink transition with PNG sprite',
    content: 'Animate images with ink transition in PNG sprite.',
  },
  {
    title: 'Ink transition with PNG sprite',
    content: 'Animate images with ink transition in PNG Animate images with ink transition in PNG spriteAnimate images with ink transition in PNG spriteAnimate images with ink transition in PNG sprite sprite.',
  },
  {
    title: 'Ink transition with PNG sprite',
    content: 'Animate images with ink transition in PNG sprite.',
  },
  // 添加更多文章...
];

// 响应式数据，用于存储当前鼠标悬停的文章索引、底纹的位置和高度
const activeIndex = ref(0); // 默认设置为第一个菜单项
const overlayLeft = ref(0);
const overlayTop = ref(0);
const overlayWidth = ref(0);
const overlayHeight = ref(0);
const articleItemRefs = ref([]);
const articleItem = ref(null);

// 方法，显示文章底纹
const showOverlay = (index) => {
  activeIndex.value = index;
  const articleItem = articleItemRefs.value[index];
  if (articleItem) {
    overlayLeft.value = articleItem.offsetLeft;
    overlayTop.value = articleItem.offsetTop;
    overlayWidth.value = articleItem.offsetWidth;
    overlayHeight.value = articleItem.offsetHeight;
  }
};

// 方法，激活文章
const activateArticle = (index) => {
  activeIndex.value = index;
  const articleItem = articleItemRefs.value[index];
  if (articleItem) {
    overlayTop.value = articleItem.offsetTop;
    overlayHeight.value = articleItem.offsetHeight;
    overlayLeft.value = articleItem.offsetLeft;
    overlayWidth.value = articleItem.offsetWidth;
  }
};


const cardItemRefs = ref([]);
const cardItem = ref(null);

const rotateToMouse = (e, card) => {
  let bounds = card.getBoundingClientRect();
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const leftX = mouseX - bounds.x;
  const topY = mouseY - bounds.y;
  const center = {
    x: leftX - bounds.width / 2,
    y: topY - bounds.height / 2
  };
  const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

  card.style.transform = `
      scale3d(1.07, 1.07, 1.07)
      rotate3d(
        ${center.y / 100},
        ${-center.x / 100},
        0,
        ${Math.log(distance) * 2}deg
      )
    `;

  const glowElement = card.querySelector('.glow');
  glowElement.style.backgroundImage = `
      radial-gradient(
        circle at
        ${center.x * 2 + bounds.width / 2}px
        ${center.y * 2 + bounds.height / 2}px,
        #ffffff55,
        #0000000f
      )
    `;
}

const handleMouseEnter = (e, index) => {
  rotateToMouse(e, cardItemRefs.value[index])

}
const handleMouseLeave = (e, index) => {
  document.removeEventListener('mousemove', rotateToMouse);
  let card = cardItemRefs.value[index]
  card.style.transform = '';
  const glowElement = card.querySelector('.glow');
  glowElement.style.backgroundImage = '';
}


// 在组件挂载时获取所有文章项的引用
onMounted(() => {
  articleItemRefs.value = [...articleItem.value];
  // cardItemRefs.value = [...cardItem.value];
  activateArticle(0)
});
</script>


<style lang="scss" scoped>
.article-list {
  width: 100%;
  margin: auto;
}

.article-item {
  position: relative;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  background-color: #fff;
  /*box-shadow: 0px 1px 2px rgba(50, 50, 50, .1),*/
  /*0px 2px 4px rgba(60, 60, 60, 0.1);*/
  border-radius: 4px;
  padding: 20px;
  /*margin: 20px 0;*/

  &:hover .article-right {
    z-index: 1;
    transform: rotate(3deg);
    transform-origin: center;
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.3));
    transition: ease-in-out 300ms;
  }

  .article-left {
    width: 100% ;
    box-sizing: border-box;
    padding: 0 20px;

    h2 {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      font-size: 1.4rem;
      text-transform: uppercase;
      color: #a39391;

      .new-article {
        font-size: 1.8rem;
        color: #ff0000;
        line-height: 100%;
        margin-right: 5px;
      }
    }

    .article-tip {
      display: flex;
      align-items: center;

      .article-tip-item {
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 2rem;
      }
    }

    .user-info {
      display: flex;
      align-items: center;
    }

    .user-info img {
      border-radius: 50%;
      height: 30px;
      width: 30px;
    }

    .user-info span {
      font-size: 13px;
      margin-left: 10px;
    }

  }

  .article-right {
    width: 40%;
    height: 13rem;
    padding: 8px;
    box-sizing: border-box;
    transition: ease-in-out 300ms;
    transform: translateX(50%);
    z-index: 1;
    font-family: system-ui, sans-serif;
    perspective: 1500px;
    border-radius: 8px;

    img {
      display: inline-block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 3px;
      box-shadow: 0 0 25px rgba(0, 0, 0, 0.08);
    }

    .card {
      width: 100%;
      height: 100%;
      box-shadow: 0 5px 20px 5px rgba(54, 54, 54, 0.27);
      border-radius: 8px;
      background-image: url(https://images.unsplash.com/photo-1557426575-6e9ea75ef57a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=240&ixid=MnwxfDB8MXxyYW5kb218MHx8VUt8fHx8fHwxNjg5OTMwOTcx&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=200);
      background-size: cover;
      position: relative;
      transition-duration: 300ms;
      transition-property: transform, box-shadow;
      transition-timing-function: ease-out;
    }

    .card:hover {
      transition-duration: 150ms;
      box-shadow: 0 5px 20px 5px rgba(255, 255, 255, 0.27);
    }

    .card .glow {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background-image: radial-gradient(circle at 50% -20%, #ffffff22, #0000000f);
    }


  }

}

.overlay {
  position: absolute;
  left: 0;
  width: 100%;
  /*background-color: rgba(0, 0, 0, 0.08);*/
  pointer-events: none;
  border-radius: 3px;
  transition: all 0.2s ease;

  &::before {
    background-color: #d0d0d0;
    content: "";
    height: 70%;
    left: -3px;
    position: absolute;
    top: 50%;
    border-radius: 5px;
    transform: translateY(-50%);
    width: 6px;
  }
}


</style>
