<template>
  <section>
    <ZySearchForm
        :formValue="state.query.params"
        @submit="goPage"
        @reset="handleReset"
    >
      <a-form-item name="content">
        <a-input v-model:value="state.query.params.content" allowClear
                 placeholder="请输入留言内容" @pressEnter="goPage"
                 autocomplete="off"/>
      </a-form-item>
    </ZySearchForm>
    <ZyFittleRow @add="goEdit"
                 addAuth="blog:messages:create"
                 :showDelete="false"/>
    <section v-if="state.dataList.length" class="ad-comment-box">
      <div class="box-title">共有 {{ state.total }} 条留言</div>
      <ZyComment v-for="item in state.dataList"
                 :comment="item"
                 :key="item._id"
                 class="comment-item"
                 @reply="submitReplyMessages"
                 @like="submitLikeMessages"
                 @oppose="submitOpposeMessages"
                 @delete="goDelete"
                 @edit="goEdit"
      >

        <ZyComment
            v-if="item.repliesInfo.length"
            v-for="repliesItem in item.repliesInfo"
            :pid="item._id"
            :key="repliesItem._id"
            :comment="repliesItem"
            @like="submitLikeMessages"
            @oppose="submitOpposeMessages"
            @reply="submitReplyMessages"
            @delete="goDelete"
            @edit="goEdit"
        >
        </ZyComment>
      </ZyComment>


      <div class="pagination" v-if="state.query.pagination.total>state.query.pagination.pageSize">
        <a-pagination
            v-model:current="state.query.pagination.current"
            :pageSize="state.query.pagination.pageSize"
            :total="state.query.pagination.total"
            @change="goPage"
            show-less-items/>
      </div>
    </section>

    <a-empty v-if="!state.dataList.length"/>

    <ZyModal :minWidth="650" :show="state.show.edit" :title="state.editTitle" key="GetMessagesInfo"
             @close="close">
      <GetMessagesInfo :updateData="state.updateData" @close="close"/>
    </ZyModal>
    <ZyModal :minWidth="650" :show="state.show.view" title="查看留言" key="ViewMessagesInfo"
             @close="close">
      <ViewMessagesInfo :viewData="state.viewData" @close="close"/>
    </ZyModal>
  </section>

</template>

<script setup>
/***留言管理 生成：2023/8/7 下午12:49:36***/
/**
 * 操作权限：
 'blog:messages:list'
 'blog:messages:create'
 'blog:messages:update'
 'blog:messages:delete'
 */

import {reactive, toRaw} from 'vue'
import GetMessagesInfo from "./get-messages-info.vue";
import ViewMessagesInfo from "./view-messages-info.vue";

import ZyModal from "comps/common/ZyModal.vue";
import ZyToolButton from "comps/common/ZyToolButton.vue";
import ZyFittleRow from "comps/common/ZyFittleRow.vue";
import ZySearchForm from "comps/common/ZySearchForm.vue";

import {ZyConfirm, ZyNotification} from "libs/util.toast";
import {isEmptyObject} from "libs/util.common";
import {TimeUtils} from "libs/util.time";
import {hasPerms} from 'libs/util.common';

import {messagesDelete, messagesList} from "api/modules/api.messages";
import ZyComment from "../../components/common/ZyComment.vue";
import {messagesLike, messagesOpposeNum, messagesReply} from "../../api/modules/api.messages";
import {setCookie} from "../../libs/util.cookie";


const columns = [
  {title: "留言内容", dataIndex: "content", width: 600, key: "content", align: 'left'},
  {title: "用户昵称", dataIndex: "user", key: "user", align: 'center'},
  {title: "用户头像", dataIndex: "avatar", key: "avatar", align: 'center'},
  {title: "设备", dataIndex: "platform", key: "platform", align: 'center'},
  {title: "地址", dataIndex: "address", key: "address", align: 'center'},
  {title: "IP", dataIndex: "userIp", key: "userIp", align: 'center'},
  {title: "主页", dataIndex: "website", key: "website", align: 'center'},
  // {title: "是否隐藏", dataIndex: "hidden", key: "hidden", align: 'center'},
  {title: "创建时间", dataIndex: "createdAt", key: "createdAt", align: 'center'},
  {title: '操作', width: 225, key: 'action', align: 'center', fixed: 'right'}
];

const state = reactive({
  show: {
    add: false,
    edit: false,
    view: false
  },
  total: 0,
  editTitle: '编辑',
  activeComponent: null,
  // 暂存更新数据
  updateData: {},
  resetData: {},
  // 暂存查看数据
  viewData: {},
  // 请求参数
  query: {
    params: {},
    pagination: {
      current: 1,
      pageSize: 20,
      total: 0,
      hideOnSinglePage: true,
    },
    sort: {
      columnKey: "createdAt",
      order: "descend" //降序（新的在前面）
    }
  },
  dataList: [],
  // loading
  loading: {
    spinning: false,
    tip: '加载中'
  }
})

// 查询
const goPage = (num = 1) => {
  state.query.pagination.current = num;
  getDataList()
  smoothScroll('.ad-comment-box')
}
// 重置查询条件
const handleReset = () => {
  goPage()
}

const submitLikeMessages = (id) => {
  messagesLike({_id: id}).then(res => {
    if (res.status) {
      setCookie(`admin-comment-like-${id}`, true, 30);
      getDataList()
    }
  })

}
const submitOpposeMessages = (id) => {
  messagesOpposeNum({_id: id}).then(res => {
    if (res.status) {
      setCookie(`admin-comment-oppose-${id}`, true, 30);
      getDataList()
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
      getDataList()
    }
  })

}


// 分页
const pageChange = ({current, pageSize}) => {
  // 更新当前页码和每页条数
  state.query.pagination = reactive({
    current: current,
    pageSize: pageSize,
  });
  getDataList()
}
// 排序
const sorterChange = ({columnKey, order}) => {
  // 更新排序
  state.query.sort = reactive({
    current: columnKey,
    order: order,
  });
  getDataList()
}

// 加载数据
const getDataList = () => {
  state.loading.spinning = true
  // 将响应式query返回起原始对象
  let p = toRaw(state.query)
  messagesList(p).then(res => {
    state.loading.spinning = false
    let datas = res.data.result
    for (const data of datas) {
      data.createdAt = TimeUtils.formatTime(data.createdAt)
      data.updatedAt = TimeUtils.formatTime(data.updatedAt)
      if (data.repliesInfo.length === 0) {
        delete data.children;
      } else {
        data.children = data.repliesInfo;
      }
    }
    state.dataList = datas
    state.total = res.data.total + res.data.repliesCount
    state.query.pagination.total = res.data.total
    state.query.pagination.current = res.data.current
    state.query.pagination.pageSize = res.data.pageSize
  }).catch(err => {
    state.loading.spinning = false
    console.log(err)
  })

}

// 处理表格变化事件
const handleTableChange = (paginationValue, filters, sorter) => {
  if (!isEmptyObject(paginationValue)) {
    pageChange(paginationValue)
  }
  if (!isEmptyObject(sorter)) {
    sorterChange(sorter)
  }
};


const goView = (row) => {
  state.show.view = true
  state.viewData = row
}


const goEdit = (row) => {
  state.show.edit = true
  row && row._id ? state.editTitle = '修改留言' : state.editTitle = '添加留言'
  state.updateData = row
}

const goDelete = (row) => {
  ZyConfirm('确认删除该条数据?').then(ok => {
    ok && messagesDelete(row).then(res => {
      ZyNotification.success('删除成功')
      goPage()
    })
  })
}

const smoothScroll = (ele) => {
  if (!document.querySelector(ele)) return
  document.querySelector(ele).scrollIntoView({
    behavior: 'smooth'
  })
}

const close = (isSave) => {
  state.show.reset = false
  state.show.view = false
  state.show.edit = false
  isSave && goPage()
}

goPage()

</script>

<style lang="scss" scoped>
.pagination {
  margin: 2rem 0;
}

.ad-comment-box {
  padding: 2rem;

  .box-title {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    font-family: "WenQuanYi Micro Hei";
  }

  .comment-item {
    border: 1px solid #eeeeee;
    padding: 1rem;
    transition: all .3s linear;
    box-shadow: 0 0 20px #EEEEEE;
    margin-bottom: 2rem;
  }
}
</style>
