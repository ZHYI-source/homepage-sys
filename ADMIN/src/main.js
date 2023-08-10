import {createApp} from 'vue';
import {createPinia} from 'pinia';
import App from './App.vue';
import router from './router';
import Antd from 'ant-design-vue';
import {createFromIconfontCN} from '@ant-design/icons-vue';
import "ant-design-vue/dist/antd.variable.min.css";
import '@/assets/styles/main.scss';
import Logger from "./libs/util.log";
import Directives from './directives/index'


/************************ v-md-editor Start***************************************/
// TODO v-md-editor文档 https://code-farmer-i.github.io/vue-markdown-editor/zh/
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
// vuepress主题
// import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
// import Prism from 'prismjs';
// import '@kangc/v-md-editor/lib/theme/style/vuepress.css';

// github主题
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js';


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
// vuepress主题
// VueMarkdownEditor.use(vuepressTheme, {Prism});
VueMarkdownEditor.use(githubTheme, {
    Hljs: hljs,
    extend(md) {
    },
});
// VMdEditor的插件需要在主体使用之后引入
VueMarkdownEditor.use(createHighlightLinesPlugin());
VueMarkdownEditor.use(createCopyCodePlugin());
VueMarkdownEditor.use(createEmojiPlugin());
VueMarkdownEditor.use(createTodoListPlugin());
VueMarkdownEditor.use(createMermaidPlugin());

/************************ v-md-editor END ***************************************/

// 创建 IconFont
// TODO icon生成地址 https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=4123035
const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4123035_17iywx1cj2r.js',
});

const app = createApp(App);
// 使用全局自定义指令
app.use(Directives);
// 使用 Antd
app.use(Antd);

// 使用 Pinia
app.use(createPinia());
// 使用 VueMarkdownEditor
app.use(VueMarkdownEditor);

// 使用路由
app.use(router);


// 注册全局组件
app.component('IconFont', IconFont);

Logger.capsule(import.meta.env.VITE_APP_WEB_TITLE, import.meta.env.VITE_APP_WEB_VERSION);
Logger.capsule('当前环境', import.meta.env.MODE);
Logger.admin()

// 挂载应用
app.mount('#app');

