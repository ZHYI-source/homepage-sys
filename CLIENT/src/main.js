import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'



import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less'; // 导入 antd 的样式文件
// import 'ant-design-vue/dist/antd.css'; // 导入 antd 的样式文件（如果使用 .css 文件）

import '@/assets/styles/main.scss'


/************************ v-md-editor Start***************************************/
// TODO v-md-editor文档 https://code-farmer-i.github.io/vue-markdown-editor/zh/
import VueMarkdownEditor from '@kangc/v-md-editor';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import Prism from 'prismjs';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
//表情
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';
//高亮某行
import createHighlightLinesPlugin from '@kangc/v-md-editor/lib/plugins/highlight-lines/index';
import '@kangc/v-md-editor/lib/plugins/highlight-lines/highlight-lines.css';
//一键复制代码
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
//任务todo
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index';
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css';
//流程图
import createMermaidPlugin from '@kangc/v-md-editor/lib/plugins/mermaid/cdn.js';
import '@kangc/v-md-editor/lib/plugins/mermaid/mermaid.css';


VueMarkdownEditor.use(vuepressTheme, {Prism});
// VMdEditor的插件需要在主体使用之后引入
VueMarkdownEditor.use(createHighlightLinesPlugin());
VueMarkdownEditor.use(createCopyCodePlugin());
VueMarkdownEditor.use(createEmojiPlugin());
VueMarkdownEditor.use(createTodoListPlugin());
VueMarkdownEditor.use(createMermaidPlugin());

/************************ v-md-editor END ***************************************/

const app = createApp(App)
app.use(Antd)
app.use(createPinia())
app.use(router)
// 使用 VueMarkdownEditor
app.use(VueMarkdownEditor);
console.log('当前模式：', import.meta.env.MODE)


app.mount('#app')
