<template>
  <a-upload
      v-model:file-list="state.fileList"
      :headers="headers"
      @change="handleChange"
      @preview="handlePreview"
      @download="downloadChange"
      @remove="handleRemove"
      list-type="picture"
      :showUploadList="showUploadList?{showDownloadIcon: true, showRemoveIcon: true}:false"
      action="/v1/common/files/upload">
    <a-button size="small" type="primary">
      <IconFont type="icon-upload"/>
      上传
    </a-button>
  </a-upload>
</template>

<script setup>
import {reactive, watch} from 'vue';
import {ZyNotification} from "libs/util.toast";
import dbUtils from "libs/util.strotage";
import {deleteFile, deleteImg, deleteMedia} from "api/modules/api.upload";

const props = defineProps({
  url: {
    type: String
  },
  showUploadList: {
    type: Boolean,
    default() {
      return false
    }
  },

})
const state = reactive({
  fileList: [],
  showUploadListOpt: false
})
watch(() => props.url, (newValue) => {
  let obj = {
    uid: '1',
    name: '图片.png',
    status: 'done',
    response: {},
    url: newValue,
  }
  state.fileList.push(obj)
});

const emit = defineEmits(['update:url','uploadChange'])

const headers = {
  authorization: dbUtils.get('token')
}

const handleChange = ({
                        file,
                        fileList,
                      }) => {
  if (file.status === 'error') {
    ZyNotification.error(file.response.message || '上传失败')
  }
  if (file.status === 'done') {
    emit('update:url', file.response.data.previewUrl)
    emit('uploadChange', file)
    // ZyNotification.success('上传成功')
  }
};
const handleRemove = (file) => {
  if (!file.response?.data?.filename) {
    return console.log('删除失败')
  }
  let FUC = null
  if (file.type.startsWith('image/') && file.type !== 'image/svg+xml') {
    FUC = deleteImg
  } else if (file.type.startsWith('video/')) {
    FUC = deleteMedia
  } else {
    FUC = deleteFile
  }
  console.log(file)
  FUC(file.response.data.filename).then(res => {

  })
}
const downloadChange = (file) => {
  let url = file.response.data.downloadUrl
  const link = document.createElement('a');
  link.href = url;
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
const handlePreview = (file) => {
  let url = file.response.data.previewUrl
  if (!url) return
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('target', '_blank');
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

</script>

<style scoped>

</style>
