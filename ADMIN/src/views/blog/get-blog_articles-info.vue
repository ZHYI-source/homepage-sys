<template>
  <a-page-header
      :title="isAdd?'创建博文':'修改博文'"
      @back="() => emit('close')"
  />
  <section class="zy-get">
    <a-form :model="state.form"
            class="zy-form"
            :label-col="labelCol"
            ref="formRef"
            :wrapper-col="wrapperCol">
      <a-form-item label="md文件">
        <a-upload
            :headers="headers"
            @change="handleChange"
            list-type="picture"
            action="/v1/blog/blog_articles/uploadMd">
          <a-button size="small" type="primary">
            <IconFont type="icon-upload"/>
            上传
          </a-button>
        </a-upload>
      </a-form-item>

      <a-form-item label="内容"
                   name="content"
                   :rules="[{ required: true, message: '请输入内容!' }]">
        <VMdEditor style="width: 65vw" v-model:value="state.form.content" :mdContent="state.form.content"
                   :height="400"/>
        <a-button style="margin-top: 1rem" type="primary" :loading="state.oneLoading" size="small" @click="OneClickFilling">
          一键填写
        </a-button>
      </a-form-item>
      <a-form-item label="标题"
                   name="title"
                   :rules="[{ required: true, message: '请输入标题!' }]">
        <a-input v-model:value="state.form.title" :maxlength="50"  allowClear placeholder="请输入标题"/>
      </a-form-item>

      <a-form-item label="封面"
                   name="cover">
        <div class="form-upload">
          <a-textarea v-model:value="state.form.cover" allowClear placeholder="封面在线地址"></a-textarea>
          <a-image class="upload-img" :width="225" v-if="state.form.cover" :src="state.form.cover"></a-image>
          <div class="img-list">
            <a-image class="upload-img" :width="100"
                     v-if="state.coverList.length"
                     v-for="item in state.coverList"
                     :previewMask="false"
                     :src="item"
                     @click="selectCover(item)"
            ></a-image>
          </div>
          <ZyUpload v-model:url="state.form.cover"/>
        </div>
      </a-form-item>

      <a-form-item label="摘要"
                   name="abstract">
        <a-textarea v-model:value="state.form.abstract" :maxlength="100" :rows="4" allowClear placeholder="请输入摘要"/>
      </a-form-item>

      <div style="display: flex">
        <a-form-item label="分类"
                     name="category"
                     :rules="[{ required: true, message: '请输入分类!' }]">
          <a-input class="input-one" v-model:value="state.form.category" allowClear placeholder="请输入分类"/>
        </a-form-item>
        <a-form-item label="立即发布"
                     name="status">
          <a-switch size="small" v-model:checked="state.form.status"/>
        </a-form-item>
        <a-form-item label="是否精选"
                     name="recommended">
          <a-switch size="small" v-model:checked="state.form.recommended"/>
        </a-form-item>
        <a-form-item label="转载"
                     name="isReship">
          <a-switch size="small" v-model:checked="state.form.isReship"/>
        </a-form-item>
      </div>
      <template v-if="state.form.isReship">
        <a-form-item label="转载文章"
                     name="isReshipName"
                     :rules="[{ required: true, message: '请输入转载文章!' }]">
          <a-textarea v-model:value="state.form.isReshipName" allowClear placeholder="请输入转载文章"/>
        </a-form-item>
        <a-form-item label="转载地址"
                     name="isReshipUrl"
                     :rules="[{ required: true, message: '请输入转载地址!' }]">
          <a-textarea v-model:value="state.form.isReshipUrl" allowClear placeholder="请输入转载地址"/>
        </a-form-item>
      </template>
    </a-form>
    <ZyFormButton @save="onSubmit" @close="close(true)"/>

  </section>
</template>

<script setup>
import {reactive, toRaw, ref} from 'vue';
import ZyFormButton from "comps/common/ZyFormButton.vue";
import {ZyConfirm, ZyNotification} from "libs/util.toast";
import {blog_articlesCreate, blog_articlesUploadMd, blog_articlesUpdate} from "api/modules/api.blog_articles";
import VMdEditor from "comps/VMdEditor/index.vue";
import ZyUpload from "../../components/common/ZyUpload.vue";
import dbUtils from "libs/util.strotage";
import {marked} from 'marked';

const headers = {
  authorization: dbUtils.get('token')
}
const labelCol = {
  style: {
    width: '100px',
  },
}
const wrapperCol = {
  span: 14,
}

const state = reactive({
  form: {
    status: true,
    category:'随记',
    cover:'https://images.pexels.com/photos/1534609/pexels-photo-1534609.jpeg?auto=compress&cs=tinysrgb&w=1600'
  },
  coverList:[],
  oneLoading: false
});

const props = defineProps({
  updateData: {
    type: Object,
    default: () => {
    }
  }
})
const emit = defineEmits(['close'])
const formRef = ref();
const isAdd = ref(!props.updateData) // 是否是添加
if (!isAdd.value) {
  state.form = props.updateData || {}
}


const handleChange = ({
                        file,
                        fileList,
                      }) => {
  if (file.status === 'error') {
    ZyNotification.error(file.response.message || '上传失败')
  }
  if (file.status === 'done') {
    state.form.content = file.response.data.fileData
    state.form.abstract = file.response.data.plainTextExcerpt
    state.form.title = file.name.replace(/\.[^.]+$/, '')
  }
};

const selectCover=(url)=>{
  state.form.cover = url
}


// 一键填写
const OneClickFilling = () => {
  if (!state.form.content){
    return ZyNotification.error('内容为空')
  }
  let content = marked.parse(state.form.content)
  // 提取图片地址
  const imgSrcRegex = /<img[^>]+src="([^">]+)"/g;
  const imgSrcMatches = content.match(imgSrcRegex);
  const imageUrls = imgSrcMatches ? imgSrcMatches.map(match => match.match(/src="([^">]+)"/)[1]) : [];

  // 提取部分文字作为摘要
  const excerptLength = 150; // 摘要长度
  const cleanedFileData = marked.parse(content).replace(/<\/?[^>]+(>|$)/g, '').replace(/\n/g, '').replace(/\\"/g, ''); // 移除 HTML 标签
  const plainTextExcerpt = cleanedFileData.slice(0, excerptLength);
  state.form.abstract = plainTextExcerpt
  state.coverList = imageUrls
  state.form.title = cleanedFileData.slice(0, 20);


}


const onSubmit = async () => {
  try {
    const values = await formRef.value.validateFields();
    if (!isAdd.value) {
      delete state.form.password
    }
    let FUC = isAdd.value ? blog_articlesCreate : blog_articlesUpdate
    FUC(toRaw(state.form)).then(res => {
      ZyNotification.success('操作成功')
      emit('close', true)
    }).catch(err => {
      ZyNotification.error(err || '操作失败')
    })
  } catch (errorInfo) {
    console.log('Failed:', errorInfo);
  }

};

const close = (save) => {
  ZyConfirm('还没保存数据，确认退出?').then(ok => {
    if (!ok) return
    emit('close', save)
  })
}
</script>

<style lang="scss" scoped>
.img-list {
  display: flex;
  justify-content: left;
  align-items: center;
  flex-wrap: wrap;
}
</style>
