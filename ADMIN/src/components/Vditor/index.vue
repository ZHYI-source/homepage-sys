<template>
    <div id="VditorRef"></div>
</template>

<script setup>
    // TODO 配置文档： https://ld246.com/article/1549638745630#API

    import {ref, onMounted,} from 'vue'
    import Vditor from 'vditor'
    import 'vditor/dist/index.css'
    import toolbar from './toolbar'

    const props = defineProps(
        {
            height: {
                type: Number,
                default() {
                    return 500
                }
            },
            placeholder: {
                type: String,
                default() {
                    return '请输入内容'
                }
            },
            mode: {
                type: String,
                default() {
                    return 'sv'
                }
            },
            mdContent: {
                type: String,
                default() {
                    return ''
                }
            }
        }
    )
    const emit = defineEmits(["update:value"])

    function init() {
        new Vditor('VditorRef', {
            lang: 'zh_CN',
            mode: 'sv',
            fullscreen: {
                index: 520, //全屏层级
            },
            toolbar,
            height: props.height,
            placeholder: props.placeholder,
            cache: {
                enable: false
            },
            preview: {
                delay: 50,
                actions: []
            },
            input: (v) => {
                // 父组件使用 v-model:value  或者 @update:value
                emit("update:value", v)
            },

            toolbarConfig: {
                pin: props.mode
            },
            counter: {
                enable: true,
            },
            resize: {
                enable: true
            },

            upload: {
                accept: 'image/*,.mp3, .wav, .rar',
                token: 'test',
                url: '/api/upload/editor',
                linkToImgUrl: '/api/upload/fetch',
                filename(name) {
                    return name.replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '').replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '').replace('/\\s/g', '')
                },
                success: function (a, b) {
                    console.log(a, b)
                }
            },
        })
    }

    onMounted(() => {
        init()
    })
</script>

<style scoped>

</style>
