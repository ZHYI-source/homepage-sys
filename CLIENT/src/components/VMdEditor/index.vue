<template>
  <section id="zy-md-editor" style="width: 100%;height: 100%">
    <v-md-editor
        ref="editor"
        v-model="content"
        :height="height + 'px'"
        :mode="mode"
        :placeholder="placeholder"
        :toolbar="toolbarCustom"
        :left-toolbar=toolbar.leftToolbar
        :right-toolbar="toolbar.rightToolbar"
        :disabled-menus="toolbar.disabledMenus"
        @change="handleChange"
        @image-click="handleClickImage"
        @upload-image="handleUploadImage"
        @copy-code-success="handleCopyCodeSuccess"
    ></v-md-editor>
  </section>
</template>

<script setup>
import {watchEffect, ref} from "vue";
import toolbar from './toolbar'
import axios from 'axios'
import utilStrotage from 'libs/util.strotage'

const props = defineProps(
    {
      height: {
        type: Number,
        default() {
          return 400
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
          //可选值：edit(纯编辑模式) editable(编辑与预览模式) preview(纯预览模式)。
          return 'preview'
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

const content = ref('')
const editor = ref(null)
// 自定义菜单
const toolbarCustom = {
  media: {
    title: '媒体文件',
    icon: 'v-md-icon-open-in-new',
    itemWidth: '56px',
    rowNum: 5,
    menus: [
      {
        name: '在线音频文件',
        text: '在线音频地址',
        action() {
          let url = '在线音频地址';
          let content = `<audio src="${url}" controls></audio>`;
          editor.value.insert((selected) => {
            return {
              text: content,
              selected: content,
            };
          });
        },
      },
      {
        name: '在线视频文件',
        text: '在线视频地址',
        action() {
          let url = '在线视频地址';
          let content = `<video src="${url}" width="720" height="auto" controls></video>`;
          editor.value.insert((selected) => {
            return {
              text: content,
              selected: content,
            };
          });
        },
      },
      {
        name: '上传本地文件',
        text: '本地媒体文件',
        action() {
          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.click();
          fileInput.addEventListener('change', function (event) {
            const file = event.target.files[0];
            // 检查文件类型
            const allowedVideoTypes = ['video/mp4', 'video/webm']; // 允许的视频文件类型
            const allowedAudioTypes = ['audio/mpeg', 'audio/wav']; // 允许的音频文件类型

            if (allowedVideoTypes.includes(file.type)) {
              // 用户上传的是视频文件
              handleVideoFile(file);
            } else if (allowedAudioTypes.includes(file.type)) {
              // 用户上传的是音频文件
              handleAudioFile(file);
            } else {
              // 文件类型不合法，进行错误处理或提示用户
              console.error('不支持的文件类型');
            }
          });

          function handleVideoFile(file) {
            // 处理视频文件逻辑
            console.log('视频文件：', file);

            // 调用上传函数或其他逻辑
            let param = new FormData();
            param.append('file', file, file.name);
            let config = {
              headers: {'Content-Type': 'multipart/form-data', 'authorization': utilStrotage.get('token')}
            };
            axios.post(`/v1/common/files/upload`, param, config)
                .then(response => {
                  if (response.data.status) {
                    let url = response.data.data.previewUrl || response.data.data.downloadUrl;
                    let content = `<video src="${url}" width="720" height="auto" controls></video>`;
                    editor.value.insert((selected) => {
                      return {
                        text: content,
                        selected: content,
                      };
                    });
                  }
                });
          }

          function handleAudioFile(file) {
            // 处理音频文件逻辑
            console.log('音频文件：', file);

            // 调用上传函数或其他逻辑
            let param = new FormData();
            param.append('file', file, file.name);
            let config = {
              headers: {'Content-Type': 'multipart/form-data', 'authorization': utilStrotage.get('token')}
            };
            axios.post(`/v1/common/files/upload`, param, config)
                .then(response => {
                  if (response.data.status) {
                    let url = response.data.data.previewUrl || response.data.data.downloadUrl;
                    let content = `<audio src="${url}" controls></audio>`;
                    editor.value.insert((selected) => {
                      return {
                        text: content,
                        selected: content,
                      };
                    });
                  }
                });
          }

        },
      },
    ],
  },
  file: {
    title: '上传其他文件',
    icon: 'v-md-icon-open-in-new',
    itemWidth: '56px',
    rowNum: 5,
    menus: [
      {
        name: '在线其他类型文件',
        text: '在线其他类型文件地址',
        action() {
          let url = '在线其他类型文件地址';
          let content = `[${'其他类型文件名称'}](${url})`;
          editor.value.insert((selected) => {
            return {
              text: content,
              selected: content,
            };
          });
        },
      },
      {
        name: '上传本地其他类型文件',
        text: '上传本地其他类型文件',
        action() {
          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.click();
          fileInput.addEventListener('change', function (event) {
            const file = event.target.files[0];
            // 调用上传函数或其他逻辑
            let param = new FormData();
            param.append('file', file, file.name);
            let config = {
              headers: {'Content-Type': 'multipart/form-data', 'authorization': utilStrotage.get('token')}
            };
            axios.post(`/v1/common/files/upload`, param, config)
                .then(response => {
                  if (response.data.status) {
                    let url = response.data.data.previewUrl || response.data.data.downloadUrl;
                    let content = `[${file.name}](${url})`;
                    editor.value.insert((selected) => {
                      return {
                        text: content,
                        selected: content,
                      };
                    });
                  }
                });
          })
        },
      },
    ],
  },
}

watchEffect(() => {
  content.value = props.mdContent
})

const handleCopyCodeSuccess = (code) => {
  let oInput = document.createElement('input')
  oInput.value = code
  document.body.appendChild(oInput)
  oInput.select()
  document.execCommand("Copy");
  oInput.remove()
}

const handleUploadImage = (event, insertImage, files) => {
  // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
  let file = files[0]
  let param = new FormData() // 创建form对象
  param.append('file', file, file.name) // 通过append向form对象添加数据
  let config = {
    headers: {'Content-Type': 'multipart/form-data', 'authorization': utilStrotage.get('token')}
  }
  axios.post(`/v1/common/files/upload`, param, config)
      .then(response => {
        if (response.data.status) {
          editor.value.insert((selected) => {
            return {
              text: `<a href="${response.data.data.previewUrl}" target="_blank">
<img src="${response.data.data.previewUrl}" alt="${response.data.data.filename}" width="750">
</a>`,
              selected: content,
            };
          });
        }
      })
}

const handleClickImage = (images, currentIndex) => {
  window.open(images[currentIndex])
}

const handleChange = (val) => {
  // 父组件使用 v-model:value  或者 @update:value
  emit('update:value', val)
}

</script>

<style lang="scss">
#zy-md-editor {
  .v-md-editor__main {
    img {
      border-radius: 5px;
      cursor: pointer;
      transition: all .3s linear;
    }

    video {
      border-radius: 10px;
      transition: all .2s linear;

      &:hover {
        border-radius: 3px;
      }
    }

    hr {
      height: 1px;
      border: none;
      background-image: none;
      margin: .8rem 0;
    }
  }
}

</style>
