import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueJsx()],
    server: {
        //本地服务器主机名 配置后可以使用本地网络访问
        host: '0.0.0.0',
        //指定启动端口号
        port: 3088,
        //设为 true 时若端口已被占用则会直接退出，而不是尝试下一个可用端口
        strictPort: false,
        //服务器启动时自动在浏览器中打开应用程序,当此值为字符串时，会被用作 URL 的路径名
        open: true,
        proxy: {
            '/v1': {
                target: ' http://localhost:3089',
                // target: ' http://www.zhouyi.run:3089',
                changeOrigin: true,
                // rewrite: (path) => path.replace(/^\/api/, ''),
            }
        }
    },
    resolve: {
        // 别名
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            "comps": fileURLToPath(new URL('src/components', import.meta.url)),
            "views": fileURLToPath(new URL('src/views', import.meta.url)),
            "store": fileURLToPath(new URL('src/store', import.meta.url)),
            "utils": fileURLToPath(new URL('src/utils', import.meta.url)),
            "libs": fileURLToPath(new URL('src/libs', import.meta.url)),
            "api": fileURLToPath(new URL('src/api', import.meta.url)),
            "styles": fileURLToPath(new URL('src/styles', import.meta.url)),
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@import \'@/assets/styles/abstracts/_variables.scss\';'
            },
            less: {
                modifyVars: {
                    // 在这里添加你想要修改的 Ant Design Vue 主题变量
                    // 例如，修改主色为蓝色
                    '@primary-color': "#d2b48c",
                    '@success-color': "#80b178",
                    '@warning-color': "#d8c49a",
                    '@error-color': "#d1786b",
                    '@heading-color': "#333333",
                    '@text-color': "#666666",
                    '@text-color-secondary': "#999999",
                },
                javascriptEnabled: true
            }

        },

    },
})
