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

/**
 * markdown 转 Html
 * @param {string} markdownContent markdown内容
 * @returns {string} 转换后的html
 */
export default function (markdownContent) {

    let tempData = []
    let renderedMarkdownToc = []

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
   /* md.use(markdownItTocDoneRight, {
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
        tempData.push({level, anchor: 'toc_' + anchor, titleText})
        renderedMarkdownToc = buildTree(tempData.value)
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
    }*/

    let htmlOutput = md.render(markdownContent)
    return htmlOutput.replaceAll('<input', '<input disabled ');
};

