<template>
  <section class="renderBox" :class="{showTocA:showTocState}">
    <ul class="renderToc">
      <li class="title" @click="taggerToc">
        目录
      </li>
      <li v-for="item in renderedMarkdownToc" :key="item.anchor">
        <template v-if="item.children.length">
          <p class="has-children" @click="scrollTo(item.anchor)">- {{ item.titleText }}</p>
          <ul class="subToc">
            <li v-for="childItem in item.children" :key="childItem.anchor"
                @click="scrollTo(childItem.anchor)">
              - {{ childItem.titleText }}
            </li>
          </ul>
        </template>
        <p class="toc-item" v-else @click="scrollTo(item.anchor)">
          - {{ item.titleText }}
        </p>
      </li>
    </ul>
    <section v-html="renderedMarkdown" id="custom-markdown">
    </section>
  </section>
</template>

<script setup>
import {ref, onMounted, computed, watch} from 'vue';
import MarkdownIt from 'markdown-it';
import emoji from 'markdown-it-emoji';
import checkbox from 'markdown-it-checkbox';
import markdownItSup from 'markdown-it-sup';
import markdownItSub from 'markdown-it-sub';
import markdownItFootnote from 'markdown-it-footnote';
import markdownItTocDoneRight from 'markdown-it-toc-done-right';
import markdownItMark from 'markdown-it-mark';
import markdownItDefList from 'markdown-it-deflist';
import markdownItContainer from 'markdown-it-container';
import markdownItAbbr from 'markdown-it-abbr';
// 流程图表文档： https://mermaid.js.org/syntax/classDiagram.html
import markdownItMermaid from "@md-reader/markdown-it-mermaid";
import hljs from 'highlight.js';
// 代码主题选择 https://highlightjs.org/static/demo/
import 'highlight.js/styles/github.css';

// import 'highlight.js/styles/github-dark.css';
// import 'highlight.js/styles/kimbie-light.css';
// import 'highlight.js/styles/monokai.css';
// import 'highlight.js/styles/purebasic.css';
// import 'highlight.js/styles/school-book.css';
// import 'highlight.js/styles/xcode.css';
// import 'highlight.js/styles/atom-one-dark.css';
// import 'highlight.js/styles/brown-paper.css';
// import 'highlight.js/styles/intellij-light.css';
// import 'highlight.js/styles/gradient-light.css';
// import 'highlight.js/styles/foundation.css';


const props = defineProps({
  markdownContent: {
    type: String,
    required: true,
    default: () => ''
  },
  showToc: {
    type: Boolean,
    default: () => false
  }
})

const showTocState = computed(() => props.showToc);

const show = ref(true)
const taggerToc = () => {
  show.value = !show.value
}


const renderedMarkdown = ref('');
const tempData = ref([]);
const renderedMarkdownToc = ref([]);

const renderMarkdown = () => {
  const md = new MarkdownIt({
    html: true, // 允许解析和渲染 HTML 标签
    breaks: true,
    linkify: true,
    quotes: true,

    highlight: (code, lang) => {
      // 使用 hljs.js 进行代码高亮
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre><code class="hljs language-${lang}">${hljs.highlight(code, {
            language: lang,
            ignoreIllegals: true
          }).value}</code></pre>`;
        } catch (error) {
        }
      }

      return `<pre><code class="hljs">${encodeURIComponent(code)}</code></pre>`;
    },
  });
  md.use(emoji);
  md.use(checkbox);
  md.use(markdownItSup);
  md.use(markdownItSub);
  md.use(markdownItFootnote);
  md.use(markdownItDefList);
  md.use(markdownItMark);
  md.use(markdownItAbbr);
  md.use(markdownItMermaid, {
    startOnLoad: true,
    securityLevel: true,
    theme: "base", // default: 默认主题 dark: 暗色主题 neutral: 中性主题 forest: 森林主题 neutral: 中性主题 dark: 暗色主题 base: 基本主题
  });

  // 使用 markdown-it-container 插件定义自定义容器的渲染逻辑
  const containers = ["tip", "warning", "danger", "details"];
  containers.forEach((container) => {
    md.use(markdownItContainer, container, {
      // 渲染逻辑
      render: (tokens, idx) => {
        const token = tokens[idx];
        if (token.nesting === 1) {
          // 容器开始标签
          return container !== "details" ?
              `<div class="${container}-container"><p class="cu-title">${container === 'tip' ? '提示' : container === 'warning' ? '注意' : '警告'}</p>` :
              '<details class="details-container">';
        } else {
          // 容器结束标签
          return container !== "details" ? `</div>` : '</details>';
        }
      },
    });

  });


  // 自定义摘要的渲染逻辑
  md.renderer.rules.details_summary = function (tokens, idx) {
    const token = tokens[idx];
    return '<summary class="details-summary">' + md.utils.escapeHtml(token.content) + '</summary>';
  };
  // 目录配置
  md.use(markdownItTocDoneRight, {
    level: [1, 2],
    slugify: (s) => {
      // 修改 slugify 方法，生成标题的唯一 id 属性
      const anchor = s.trim().toLowerCase().replace(/\s+/g, '-');
      return 'toc_' + anchor;
    },
  });
  md.renderer.rules.heading_open = (tokens, idx, options, env, renderer) => {
    const token = tokens[idx];
    const level = Number(token.tag.substr(1));
    const titleToken = tokens[idx + 1];
    const titleText = titleToken.content;
    const anchor = titleText.trim().toLowerCase().replace(/\s+/g, '-');
    // 在标题标签上添加id属性
    token.attrSet('id', 'toc_' + anchor);
    tempData.value.push({level, anchor: 'toc_' + anchor, titleText})
    renderedMarkdownToc.value = buildTree(tempData.value)
    return `<h${level} id="toc_${anchor}">`;
  };

// 构建树状结构的函数
  function buildTree(dataList) {
    const root = {children: []}; // 创建根节点
    const stack = [root]; // 使用栈来辅助构建树结构
    for (const item of dataList) {
      const node = {anchor: item.anchor, titleText: item.titleText, children: []};
      if (item.level === 1) {
        // 处理栈为空或当前项的 level 为 1 的情况
        while (stack.length > 1) {
          stack.pop();
        }
      }
      // 获取当前父节点
      const parent = stack[stack.length - 1];
      // 将当前节点添加到父节点的 children 数组中
      parent.children.push(node);
      if (item.level === 1) {
        // 如果当前项的 level 为 1，将其视为新的一级节点并将其推入栈中
        stack.push(node);
      }
    }
    return root.children; // 返回根节点的 children 数组作为最终的树结构
  }

  let htmlOutput = md.render(props.markdownContent)
  renderedMarkdown.value = htmlOutput.replaceAll('<input', '<input disabled ');
};
// 添加 scrollTo 方法用于滚动跳转
const scrollTo = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({behavior: 'smooth'});
  }
}
// 监听 markdownContent 属性变化，并重新解析 Markdown 和更新视图
watch(() => props.markdownContent, () => {
  renderMarkdown();
});


onMounted(() => {
  renderMarkdown();

});

</script>
<style lang="scss">

/* 定义通用的颜色变量 */
:root {
  --color-primary: #bb1d1d;
}

.renderBox {
  position: relative;
  display: flex;
  .renderToc {
    font-family: inherit;
    z-index: 1;
    width: 0;
    max-width: 220px;
    list-style-type: none;
    border-radius: 8px;
    overflow: hidden;
    transition: all .2s linear;

    ul {
      padding: 0 !important;
    }

    li {
      margin-bottom: 5px;
      cursor: pointer;
      transition: all .3s linear;
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
      &:hover {
        color: var(--color-primary);
      }
    }

    .title {
      color: var(--color-primary);
      font-weight: bold;
      border-bottom: 1px solid #d4d4d4;
    }

    .toc-item, .has-children {
      font-weight: bold;
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
      &:hover {
        color: var(--color-primary);
      }
    }
  }

  .subToc {
    list-style: none;
    padding-left: 20px;
  }

  .subToc li {
    color: #333;
    font-size: .9rem;
  }
}


/* 通用样式 */
#custom-markdown {
  //font-family: miranafont, Hiragino Sans GB, STXihei, Microsoft YaHei, SimSun, sans-serif;
  font-family: inherit;
  transition: all .2s linear;
  letter-spacing: .5px;
  font-size: 16px;
  line-height: 2;
  width: 100%;
  color: #444343;
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
    margin: 1.2rem 0;
    font-weight: bold;
    color: #2f2f2f;
  }
  p {
    margin: 1.2rem 0;
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
    font-size: 1rem;
  }

  //a::after {
  //  content: "";
  //  position: absolute;
  //  bottom: -2px;
  //  left: 0;
  //  width: 100%;
  //  height: 1px;
  //  background-color: #e2e2e2;
  //  transform: scaleX(0);
  //  transition: transform 0.2s ease-in-out;
  //}
  //
  //a:hover::after {
  //  transform: scaleX(1);
  //}

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
    margin: 1rem 0;
    padding: 15px;
    background-color: #f1f1f1;
    border-left: 4px solid #686868;
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
    font-family: Consolas,Liberation Mono,Menlo,Courier,monospace;
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
    //max-height: 80vh;
    font-size: 14px;
    //color: #476582;

    //border: 1px dashed #ddd;
    border-radius: 4px;
    display: inline-block;
    font-family: Consolas,Liberation Mono,Menlo,Courier,monospace;
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

.showTocA {
  .renderToc {
    transition: all .2s linear;
    width: 300px;
  }

  #custom-markdown {
    box-sizing: border-box;
    transition: all .2s linear;
    width: calc(100% - 220px);
    padding-left: 20px;
  }
}


/* 自定义容器样式 */
.tip-container,
.warning-container,
.danger-container,
.details-container {
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 10px;

  .cu-title {
    font-weight: bold;
  }
}

.tip-container {
  border: 1px solid #8bc34a;
  background-color: #f1f8e9;

  .cu-title {
    color: #8bc34a;
  }
}

.warning-container {
  border: 1px solid #ffc107;
  background-color: #fff8e1;

  .cu-title {
    color: #ffc107;
  }
}

.danger-container {
  border: 2px solid #f44336;
  background-color: #ffebee;

  .cu-title {
    color: #f44336;
  }
}

.details-container {
  border: 1px solid #ddd;
  background-color: #f0f9ff;
}

/* 自定义容器摘要样式 */
.details-summary {
  font-weight: bold;
  cursor: pointer;
}

/* 待办列表样式 */
input[type="checkbox"] {
  width: 15px;
  height: 15px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  border-radius: 2px;
}

label {
  position: relative;
  padding-left: 5px;
  cursor: pointer;
  font-size: 14px;
}

input[type="checkbox"]:disabled + label {
  opacity: 0.9;
  cursor: not-allowed;
  pointer-events: none;
}

input:checked {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

label::after {
  content: "✔";
  position: absolute;
  left: -12px;
  top: -2px;
  font-size: 12px;
  color: #fff;
  transform: scale(0.8);
  display: none;
}

input:checked + label::after {
  display: block;
}

/* 序列表样式 */
ul {
  list-style-type: disc;
  //padding-left: 20px;
}

ol {
  list-style-type: decimal;
  padding-left: 30px;
}

ul ul,
ol ul,
ul ol,
ol ol {
  margin-top: 10px;
  padding-left: 30px;
}

</style>
