<template>
  <section class="comment" v-if="comment.userInfo.length">
    <a-comment :id="'comment-'+comment._id">
      <template #actions>
        <span>来自：{{ comment.userInfo[0].userIp || '未知' }}</span>
        <span>城市：{{ comment.userInfo[0].address || '未知' }}</span>
        <span>操作平台：{{ comment.userInfo[0].platform || '未知' }}</span>
        <template v-if="!comment.toUser">
                    <span :class="{active:state.likeActive}"
                          @click="likeComment(comment._id)">赞同({{ comment.likeNum || 0 }})</span>
          <span :class="{active:state.opposeActive}"
                @click="opposeComment(comment._id)">反对({{ comment.opposeNum || 0 }})</span>
        </template>
        <span @click="handleReply">回复</span>
        <span @click="handleDelete(comment._id)" v-permission='"blog:messages:delete"'>删除</span>
        <span @click="handleEdit(comment._id)" v-permission='"blog:messages:update"'>修改</span>
      </template>
      <template #author>
        <!-- 没有回复信息的-->
        <template v-if="!comment.toUser">
          <a-popover v-if="comment.userInfo[0].website">
            <template #content>
              <p>点击访问 {{ comment.userInfo[0].nickname }} 的主页</p>
            </template>
            <a :href="comment.userInfo[0].website" target="_blank">
              <span class="nickname">{{ comment.userInfo[0].nickname }}</span>
              <span class="author" v-if="comment.userInfo[0].username === 'admin'"></span>
            </a>
          </a-popover>
          <a v-else :href="comment.userInfo[0].website" target="_blank">
            <span class="nickname">{{ comment.userInfo[0].nickname }}</span>
            <span class="author" v-if="comment.userInfo[0].username === 'admin'"></span>
          </a>
        </template>
        <template v-if="comment.toUser">
          <template v-if="comment.userInfo[0].website">
            <a-popover>
              <template #content>
                <p>点击访问 {{ comment.userInfo[0].nickname }} 的主页</p>
              </template>
              <a :href="comment.userInfo[0].website" target="_blank">
                <span class="nickname">{{ comment.userInfo[0].nickname }}</span>
                <span class="author" v-if="comment.userInfo[0].username === 'admin'"></span>
              </a>
            </a-popover>
            @
            <a-popover>
              <template #content>
                <p>点击访问 {{ comment.toUserInfo[0].nickname }} 的主页</p>
              </template>
              <a :href="comment.toUserInfo[0].website" target="_blank">
                <span class="nickname">{{ comment.toUserInfo[0].nickname }}</span>
                <span class="author" v-if="comment.toUserInfo[0].username === 'admin'"></span>
              </a>
            </a-popover>
          </template>
          <template v-else>
            <a :href="comment.userInfo[0].website" target="_blank">
              <span class="nickname">{{ comment.userInfo[0].nickname }}</span>
            </a>
            <span class="author" v-if="comment.userInfo[0].username === 'admin'"></span>
            @
            <a :href="comment.toUserInfo[0].website" target="_blank">
              <span class="nickname">{{ comment.toUserInfo[0].nickname }}</span>
              <span class="author" v-if="comment.toUserInfo[0].username === 'admin'"></span>
            </a>
          </template>
        </template>
        <div class="date">在 {{ TimeUtils.formatRelativeTime(comment.createdAt) }} 说:</div>
      </template>
      <template #avatar>
        <a-image :previewMask="false" :width="40" :src="comment.userInfo[0].avatar" alt="匿名"/>
      </template>
      <template #content>
        <p>
          {{ comment.content }}
        </p>
      </template>
      <template v-if="comment.toUser">
        <div class="reply-box">
          <slot/>
        </div>
        <ZyForm v-if="state.show.replies" @submitForm="submitReply"/>
      </template>
      <template v-if="!comment.toUser">
        <ZyForm v-if="state.show.replies" @submitForm="submitReply"/>
        <div class="reply-box">
          <slot/>
        </div>
      </template>
    </a-comment>
  </section>
</template>

<script setup>
import {reactive, watch} from 'vue'
import ZyForm from "../../components/common/ZyForm.vue";
import {TimeUtils} from "../../libs/util.time";
import {getCookie} from "../../libs/util.cookie";

const props = defineProps({
  comment: {
    type: Object
  },
  pid: {
    type: String
  },
})
const state = reactive({
  show: {
    replies: false
  },
  likeActive: getCookie(`admin-comment-like-${props.comment._id}`),
  opposeActive: getCookie(`admin-comment-oppose-${props.comment._id}`)
})

const emits = defineEmits(['reply', 'like', 'oppose', 'delete', 'edit'])


const likeComment = (id) => {
  if (state.likeActive) return
  state.likeActive = true
  emits('like', id)
}
const opposeComment = (id) => {
  if (state.opposeActive) return
  state.opposeActive = true
  emits('oppose', id)
}
const handleReply = () => {
  state.show.replies = !state.show.replies
}
const handleDelete = (id) => {
  emits('delete', {_id: id, pid: props.pid})
}
const handleEdit = (id) => {
  emits('edit', {...props.comment, pid: props.pid})
}

const submitReply = (form) => {
  // 第一个是当前评论数据 第二个是回复内容
  let newInfo = {...props.comment, pid: props.pid}
  emits('reply', [newInfo, form])
}
</script>

<style lang="scss">
.comment {
  margin-bottom: 1rem;

  .active {
    color: #b60101;
  }

  .nickname {
    font-weight: 600;
    font-size: 1rem;
  }

  .date {
    font-size: .8rem;
  }

  /*.reply-box {*/
  /*    height: 150px;*/
  /*    overflow: hidden;*/
  /*    transition: all .3s linear;*/
  /*}*/
  .reply-box-active {
    height: auto;
    overflow: hidden;
  }

  .author:after {
    content: '管理员';
    background: #03658c;
    color: #FFF;
    font-size: 12px;
    padding: 3px 5px;
    font-weight: 700;
    margin-left: 10px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
  }
}


.ant-comment-avatar {
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
