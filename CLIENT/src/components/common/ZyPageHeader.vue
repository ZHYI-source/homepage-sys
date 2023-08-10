<template>
  <section class="page-head-box">
    <section class="page-head" ref="card"
             :style="{'background-image':`url(${img})`}"
             @mousemove="handleMousemove"
             @mouseleave="handleMouseleave"
    >
      <div class="head-text-wrap" ref="titleDom">
        <p class="head-title">{{ title }}</p>
        <p class="head-title-sub">{{ subTitle }} </p>
        <p class="head-title-sub ban-bred">
          <span @click="goToPage('/')" class="iconfont icon-shouye">
          </span> /
          <slot name="action"/>
          <span class="current">{{ current }}</span>
        </p>
      </div>
    </section>
  </section>
</template>

<script setup>
import {goToPage} from "../../libs/util.router";
import {ref} from "vue";

const props = defineProps({
  img: {
    type: String,
    default: () => 'http://www.zhouyi.run:3089/v1/common/files/preview/img/1691567436630.png'
  },
  title: {
    type: String,
    default: () => 'Completed projects'
  },
  subTitle: {
    type: String,
    default: () => 'Interesting People Record Interesting.'
  },
  current: {
    type: String,
    default: () => 'CURRENT'
  },
  // 关闭背景动画
  disBgAnimate: {
    type: Boolean,
    default: () => false
  },
  // 关闭文字动画
  disTextAnimate: {
    type: Boolean,
    default: () => false
  }

})
let currentMousePos = {x: 0, y: 0};
let mouseFromCenter = {x: 0, y: 0};

const card = ref(null)
const titleDom = ref(null)

const handleMouseleave = (event) => {
  card.value.style.backgroundPosition = `center center`;
  titleDom.value.style.transform = "none";
}
const handleMousemove = (event) => {
  let wHeight = card.value.clientHeight;
  let wWidth = card.value.clientWidth;

  mouseFromCenter.x = currentMousePos.x - (wWidth / 2);
  mouseFromCenter.y = currentMousePos.y - (wHeight / 2);
  currentMousePos.x = event.pageX;
  currentMousePos.y = event.pageY;
  let mousePositionX = (currentMousePos.x / wWidth) * 100;

  let around1 = -1 * (currentMousePos.y * 100 / wHeight * 0.2 - 10) + 'deg';
  let around2 = (currentMousePos.x * 100 / wWidth * 0.2 - 10) + 'deg';

  if (!props.disBgAnimate) {
    card.value.style.backgroundPosition = mousePositionX * .5 + '%' + ' ' +  (currentMousePos.y / wHeight) * 25 + '%';
  }

  if (!props.disTextAnimate) {
    titleDom.value.style.transform = "translateX(" + ((mouseFromCenter.x / 25) * 0.7) + "px) rotatex(" + around1 + ") rotatey(" + around2 + ")  translateY(" + ((mouseFromCenter.y / 25) * 1.65) + "px) translateZ(100px)";
  }

}

</script>

<style lang="scss" scoped>
.page-head-box {
  perspective: 1600px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 60%);
  font-family: inherit;
}

.page-head {

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  width: 100%;
  height: 480px;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  transition: all .3s linear;
  background-attachment: fixed;
  transform-style: preserve-3d;

  &:hover {
    text-shadow: 0 3px 20px rgba(#fff, .8);
  }

  .head-text-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    max-width: 900px;
    margin-top: 110px;
    transform-style: preserve-3d;
    transform: translateZ(0px);
    transition: all .2s linear;


    .head-title {
      font-size: 2.3rem;
      color: #ffffff;
      transform: translateZ(0px);

    }

    .head-title-sub {
      font-size: 1.3em;
      color: #eaeaea;
      margin-bottom: 1rem;
      transform: translateZ(0px);

    }

    .ban-bred {
      letter-spacing: .5px;
      color: #555555;
      background-color: rgba(#eee, .5);
      padding: 0 1rem;
      border-radius: 5px;
      width: 30%;
      min-width: 225px;
      transform: translateZ(0px);

      span {
        display: inline-block;
        cursor: pointer;
        font-size: 1.1rem;
        padding: 0 2px;
      }

      .current {
        color: #ffffff;
      }
    }
  }

}
</style>
