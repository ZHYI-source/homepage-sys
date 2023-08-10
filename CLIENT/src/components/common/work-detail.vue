<template>
  <section class="work-detail">
    <h2 class="work-name">{{ viewData.title }}</h2>
    <ul class="work-tips">
      <li class="tips-item">
        <!--        <span class="iconfont icon-business-icon-sales-center"></span>-->
        <span>项目类别: {{ viewData.category }}</span>
      </li>
      <li class="tips-item">
        <span>语言框架: {{ viewData.framework }}</span>
      </li>
      <li class="tips-item">
        <span>源码地址:  <a :href="viewData.demoUrl" target="_blank">{{ viewData.sourceUrl }}</a></span>
      </li>
      <li class="tips-item">
        <span>预览地址: <a :href="viewData.demoUrl" target="_blank">{{ viewData.demoUrl }}</a></span>
      </li>
    </ul>
    <hr/>
    <div class="work-desc" id="work-desc" v-html="state.content"/>
  </section>
</template>

<script setup>
import {reactive} from 'vue'
import mdToHtml from '../../libs/util.mdToHtml'

const props = defineProps({
  viewData: {
    type: Object,
    default: () => {
    }
  }
})


const state = reactive({
  content: ''
})
state.content = mdToHtml(props.viewData.content)


</script>

<style lang="scss">
/* 定义通用的颜色变量 */
:root {
  --color-primary: #ee8453;
}

.work-detail {
  width: 100%;
  max-width: 900px;
  box-sizing: border-box;
  overflow: hidden;
  padding: 8px;
  //background-image: url(../../assets/img/bg-map.png);

  .work-name {
    text-align: center;
    margin-bottom: 2rem;
  }

  .work-tips {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    padding: 1rem 0;

    .tips-item {
      width: 50%;
      min-width: 300px;

    }

  }

  #work-desc {
    //font-family: miranafont, Hiragino Sans GB, STXihei, Microsoft YaHei, SimSun, sans-serif;
    font-family: inherit;
    transition: all .2s linear;
    letter-spacing: .5px;
    font-size: 1rem;
    width: 100%;

    nav.table-of-contents {
      display: none;
    }

    /* 标题样式 */
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-family: inherit;
      margin: 10px 0;
    }

    /* 加粗样式 */
    strong {
      font-weight: 600;
    }

    /* 斜体样式 */
    em,
    i {
      font-style: italic;
    }

    /* 横线样式 */
    hr {
      margin: 10px auto;
      border: 0;
      border-top: 1px dashed #e3e3e3;
      background-image: none;
    }

    /* 缩写样式 */
    abbr {
      text-decoration: none;
      border-bottom: 2px dashed var(--color-primary);
      font-weight: bold;
      cursor: help;
      transition: all .2s linear;
    }

    abbr:hover {
      color: #e7672b;
    }

    /* 链接样式 */
    a {
      text-decoration: none;
      position: relative;
      font-style: italic;
    }

    a::after {
      content: "";
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: #e2e2e2;
      transform: scaleX(0);
      transition: transform 0.2s ease-in-out;
    }

    a:hover::after {
      transform: scaleX(1);
    }

    /* 列表样式 */
    dl {
      border: 1px solid #ccc;
      padding: 10px;
      border-radius: 5px;
    }

    dt {
      font-weight: bold;
      margin-bottom: 5px;
    }

    dd {
      margin-left: 20px;
    }

    /* 引用块样式 */
    blockquote {
      margin: 5px 0;
      padding: 15px;
      background-color: #f1f1f1;
      border-left: 4px solid var(--color-primary);
      border-radius: 4px;
      color: #666;
    }

    blockquote p {
      margin: 0;
      font-size: 1rem;
      line-height: 1.6;
    }

    blockquote ul {
      margin: 10px 0;
      padding-left: 20px;
    }

    blockquote li {
      margin: 5px 0;
      list-style-type: disc;
    }

    /* 代码样式 */
    p code,
    div code,
    {
      font-family: "Courier New", monospace;
      box-sizing: border-box;
      word-break: break-all;
      padding: 4px 5px;
      margin: 0 5px;
      color: var(--color-primary);
      font-size: 0.85em;
      background-color: rgba(27, 31, 35, 0.05);
      border-radius: 3px;
    }

    pre {
      width: 100%;
      margin: 0.8rem 0;
    }

    pre code {
      width: 100%;
      font-size: 0.9rem;
      color: #476582;
      border: 1px solid #ddd;
      border-radius: 4px;
      display: inline-block;
      font-family: "Courier New", monospace;
      box-sizing: border-box;
      word-break: break-all;
      padding: 1em;
      margin: 0;
    }

    /* 表格样式 */
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 0.5rem auto;
    }

    th,
    td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }

    th {
      background-color: #f2f2f2;
      font-weight: bold;
    }

    tr:nth-child(even) {
      background-color: #f2f2f2;
    }

    tr:hover {
      transition: all 0.3s linear;
      background-color: #eee;
    }

    /* 视频和图片样式 */
    video,
    img {
      border-radius: 8px;
      transition: all 0.3s linear;
    }

    video:hover,
    img:hover {
      border-radius: 3px;
    }

    /* 自定义音频播放器样式 */
    audio {
      display: block;
      margin: 10px 0;
      background-color: #f2f2f2;
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 10px;
    }

    audio::-webkit-media-controls-panel {
      background-color: #f2f2f2;
      border: none;
      border-radius: 5px;
      padding: 5px;
    }

    audio::-webkit-media-controls-play-button {
      color: var(--color-primary);
    }

    /* 序列表样式 */
    ul {
      padding-left: 20px;
    }
  }
}
</style>
