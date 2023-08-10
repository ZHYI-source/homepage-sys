<template>
  <section class="contact-box">
    <ZyPageHeader title="留言板" disBgAnimate subTitle=" Leave your footprints and let me know you read my message here . "
                  current="Contact"/>
    <section class="contact-main ">
      <section class="fit-form c-mb-60 c-mt-60">
        <ZySectionHeader title="留下足迹" titleNum="01"/>
        <ZyForm @submitForm="submitMessagesCreate"/>
      </section>
      <div class="contact-anchor"></div>
      <ZySectionHeader title="所有足迹" titleNum="02"/>

      <a-empty v-if="!state.messageList.length"/>

      <template v-if="state.messageList.length">
        <section class="contact-head c-mb-40 c-mt-60">
          <h4 class="c-mb-40">已有 {{ state.total }} 条足迹</h4>
        </section>
        <section class="message-list">
          <Comment v-for="item in state.messageList"
                   :key="item._id"
                   :comment="item"
                   class="comment-item"
                   @reply="submitReplyMessages"
                   @like="submitLikeMessages"
                   @oppose="submitOpposeMessages"
          >
            <Comment
                v-if="item.repliesInfo.length"
                v-for="repliesItem in item.repliesInfo"
                :pid="item._id"
                :key="repliesItem._id"
                :comment="repliesItem"
                @like="submitLikeMessages"
                @oppose="submitOpposeMessages"
                @reply="submitReplyMessages"
            >

            </Comment>
          </Comment>
          <div class="pagination" v-if="state.query.pagination.total>state.query.pagination.pageSize">
            <a-pagination
                v-model:current="state.query.pagination.current"
                :pageSize="state.query.pagination.pageSize"
                :total="state.query.pagination.total"
                @change="goPage"
                show-less-items/>
          </div>
        </section>
      </template>
    </section>
  </section>
</template>

<script setup>
import {reactive} from 'vue'
import ZyComment from "../../components/common/ZyComment.vue";
import ZySectionHeader from "../../components/common/ZySectionHeader.vue";
import ZyPageHeader from "../../components/common/ZyPageHeader.vue";
import Zy3DImg from "../../components/common/Zy3DImg.vue";
import {setCookie} from '../../libs/util.cookie'
import {
  messagesCreate,
  messagesLike,
  messagesList,
  messagesOpposeNum,
  messagesReply
} from "../../api/modules/api.messages";
import {TimeUtils} from "../../libs/util.time";
import ZyForm from "../../components/common/ZyForm.vue";
import Comment from "./comment.vue";

const state = reactive({
  query: {
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
      hideOnSinglePage: true,
    },
  },
  total: 0,
  messageList: [],
  show: {
    replies: false
  }
})

const smoothScroll = (ele) => {
  document.querySelector(ele).scrollIntoView({
    behavior: 'smooth'
  })
}

const goPage = (num = 1) => {
  state.query.pagination.current = num
  getMessageList()
  smoothScroll('.contact-anchor')

}
const submitLikeMessages = (id) => {
  messagesLike({_id: id}).then(res => {
    if (res.status) {
      setCookie(`comment-like-${id}`, true, 30);
      getMessageList()
    }
  })

}
const submitOpposeMessages = (id) => {
  messagesOpposeNum({_id: id}).then(res => {
    if (res.status) {
      setCookie(`comment-oppose-${id}`, true, 30);
      getMessageList()
    }
  })
}
const submitReplyMessages = ([currentItem, newItem]) => {
  let p = {
    message: currentItem.pid ? currentItem.pid : currentItem._id,
    toUser: currentItem.userInfo[0]._id,//目标用户始终是当前评论的初始用户
    ...newItem
  }

  messagesReply(p).then(res => {
    if (res.status) {
      let info = {
        name: newItem.name,
        email: newItem.email,
        website: newItem.website
      }
      localStorage.setItem('ZY-CLIENT-USERINFO', JSON.stringify(info))
      getMessageList()
    }
  })

}

const submitMessagesCreate = (form) => {
  messagesCreate(form).then(res => {
    if (res.status) {
      let info = {
        name: form.name,
        email: form.email,
        website: form.website
      }
      localStorage.setItem('ZY-CLIENT-USERINFO', JSON.stringify(info))
      goPage(1)
    }
  })
}


const getMessageList = () => {
  messagesList(state.query).then(res => {
    state.messageList = res.data.result
    state.total = res.data.total + res.data.repliesCount
    state.query.pagination.total = res.data.total
    state.query.pagination.current = res.data.current
    state.query.pagination.pageSize = res.data.pageSize
  })
}

getMessageList()

</script>

<style lang="scss" scoped>
.contact-box {
  box-sizing: border-box;
  background-color: #fff;

  .contact-head {
    text-align: center;

    h4 {
      color: #c9c8c8;
    }

  }

  .contact-main {
    max-width: 920px;
    margin: 0 auto;
    padding: 1rem;

    .message-list {
      width: 100%;
      padding: 1rem;
      @media screen and (max-width: 768px) {
        width: 100% !important;
        padding: 0;
      }
      .pagination {
        margin: 2rem 0;
      }

      .comment-item {
        border: 1px solid #e5e5e5;
        padding: 1rem;
        opacity: .8;
        transition: all .3s linear;
        box-shadow: 0 0 20px #EEEEEE;
        margin-bottom: 2rem;

        &:hover {
          opacity: 1;
        }
      }
    }
  }

}
</style>
