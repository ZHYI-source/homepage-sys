<template>
  <section>
    <section v-if="!state.show.edit">
      <ZySearchForm
          :formValue="state.query.params"
          @submit="goPage"
          @reset="handleReset"
      >
        <a-form-item name="title">
          <a-input class="input-one" v-model:value="state.query.params.title" allowClear
                   placeholder="请输入博文名称" @pressEnter="goPage"
                   autocomplete="off"/>
        </a-form-item>
        <a-form-item name="category">
          <a-input class="input-one" v-model:value="state.query.params.category" allowClear
                   placeholder="请输入博文类别" @pressEnter="goPage"
                   autocomplete="off"/>
        </a-form-item>
        <a-form-item name="status">
          <a-select
              class="input-one"
              placeholder="请选择博文状态"
              v-model:value="state.query.params.status"
              allowClear
              @change="goPage"
          >
            <a-select-option :value="true">已发布</a-select-option>
            <a-select-option :value="false">草稿</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="recommended">
          <a-select
              class="input-one"
              placeholder="请选择是否精选"
              v-model:value="state.query.params.recommended"
              allowClear
              @change="goPage"
          >
            <a-select-option :value="true">精选</a-select-option>
            <a-select-option :value="false">普通</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="isReship">
          <a-select
              class="input-one"
              placeholder="请选择是否转载"
              v-model:value="state.query.params.isReship"
              allowClear
              @change="goPage"
          >
            <a-select-option :value="true">是</a-select-option>
            <a-select-option :value="false">否</a-select-option>
          </a-select>
        </a-form-item>
      </ZySearchForm>
      <ZyFittleRow @add="goEdit"
                   addAuth="blog:blog_articles:create"
                   :showDelete="false"/>
      <a-table
          bordered
          :resizable="true"
          :loading="state.loading"
          :columns="columns"
          :row-key="record => record._id"
          :pagination="state.query.pagination"
          @change="handleTableChange"
          :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
          :data-source="state.dataList">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'userId'">
            <span>{{ record.user.length ? record.user[0].nickname : '-' }}</span>
          </template>
          <template v-else-if="column.key === 'title'">
            <a :href="`http://www.zhouyi.run/#/PostDetail/${record._id}`" target="_blank">{{ record.title }}</a>
          </template>
          <template v-else-if="column.key === 'recommended'">
            <a-switch @change="goRepublish(record)" :disabled="!hasPerms('blog:blog_articles:update')"
                      v-model:checked="record.recommended" checked-children="是"
                      un-checked-children="否"></a-switch>
          </template>
          <template v-else-if="column.key === 'isReship'">
            <a-tag v-if="record.isReship" color="green">是</a-tag>
            <a-tag v-if="!record.isReship">否</a-tag>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-switch @change="goRepublish(record)" :disabled="!hasPerms('blog:blog_articles:update')"
                      v-model:checked="record.status" checked-children="发布"
                      un-checked-children="草稿"></a-switch>
          </template>
          <template v-else-if="column.key === 'action'">
            <ZyToolButton
                viewAuth="blog:blog_articles:list"
                editAuth="blog:blog_articles:update"
                deleteAuth="blog:blog_articles:delete"
                :showView="false"
                @view="goView(record)"
                @edit="goEdit(record)"
                @delete="goDelete(record)"
            >
            </ZyToolButton>
          </template>
        </template>
      </a-table>
      <ZyModal :minWidth="650" :show="state.show.view" title="查看博文管理" key="ViewBlog_articlesInfo"
               @close="close">
        <ViewBlog_articlesInfo :viewData="state.viewData" @close="close"/>
      </ZyModal>
    </section>
    <GetBlog_articlesInfo v-if="state.show.edit" :updateData="state.updateData" @close="close"/>
  </section>
</template>

<script setup>
/***博文管理管理 生成：2023/7/17 下午1:26:24***/
/**
 * 操作权限：
 'blog:blog_articles:list'
 'blog:blog_articles:create'
 'blog:blog_articles:update'
 'blog:blog_articles:delete'
 */

import {reactive, toRaw} from 'vue'
import GetBlog_articlesInfo from "./get-blog_articles-info.vue";
import ViewBlog_articlesInfo from "./view-blog_articles-info.vue";

import ZyModal from "comps/common/ZyModal.vue";
import ZyToolButton from "comps/common/ZyToolButton.vue";
import ZyFittleRow from "comps/common/ZyFittleRow.vue";
import ZySearchForm from "comps/common/ZySearchForm.vue";

import {ZyConfirm, ZyNotification} from "libs/util.toast";
import {isEmptyObject} from "libs/util.common";
import {TimeUtils} from "libs/util.time";
import {hasPerms} from 'libs/util.common';

import {blog_articlesDelete, blog_articlesList} from "api/modules/api.blog_articles";
import {blog_articlesUpdate} from "../../api/modules/api.blog_articles";

const columns = [
  {title: "博文名称", dataIndex: "title", ellipsis: true, width: 600, key: "title", align: 'left'},
  // {title: "作者", dataIndex: "userId", key: "userId", align: 'center'},
  {title: "类别", dataIndex: "category", ellipsis: true, width: 100, key: "category", align: 'center'},
  {
    title: "浏览量",
    dataIndex: "viewNum",
    sorter: (a, b) => a.viewNum - b.viewNum,
    ellipsis: true,
    width: 100,
    key: "viewNum",
    align: 'center'
  },
  {
    title: "点赞量",
    dataIndex: "likeNum",
    sorter: (a, b) => a.likeNum - b.likeNum,
    ellipsis: true,
    width: 100,
    key: "likeNum",
    align: 'center'
  },
  {title: "是否精选", dataIndex: "recommended", ellipsis: true, width: 100, key: "recommended", align: 'center'},
  {title: "是否转载", dataIndex: "isReship", ellipsis: true, width: 100, key: "isReship", align: 'center'},
  {
    title: "创建时间",
    dataIndex: "createdAt",
    sorter: (a, b) => a.createdAt - b.createdAt,
    ellipsis: true,
    width: 180,
    key: "createdAt",
    align: 'center'
  },
  {title: "状态", dataIndex: "status", ellipsis: true, width: 100, key: "status", align: 'center'},
  // {title: "备注", dataIndex: "remark", ellipsis: true, width: 200, key: "remark", align: 'center'},
  {title: '操作', width: 225, key: 'action', align: 'center', fixed: 'right'}
];

const state = reactive({
  show: {
    add: false,
    edit: false,
    view: false
  },
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
      pageSize: 10,
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
}
// 重置查询条件
const handleReset = () => {
  goPage()
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

const goRepublish = (row) => {
  blog_articlesUpdate(row).then(res => {
    if (res.status) {
      ZyNotification.success('操作成功')
      goPage(1)
    }
  })
}

// 加载数据
const getDataList = () => {
  state.loading.spinning = true
  // 将响应式query返回起原始对象
  let p = toRaw(state.query)
  blog_articlesList(p).then(res => {
    state.loading.spinning = false
    let datas = res.data.result
    for (const data of datas) {
      data.createdAt = TimeUtils.formatTime(data.createdAt)
      data.updatedAt = TimeUtils.formatTime(data.updatedAt)
    }
    state.dataList = datas
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
  row && row._id ? state.editTitle = '修改博文管理' : state.editTitle = '添加博文管理'
  state.updateData = row
}

const goDelete = (row) => {
  ZyConfirm('确认删除该条数据?').then(ok => {
    ok && blog_articlesDelete(row).then(res => {
      ZyNotification.success('删除成功')
      goPage()
    })
  })
}
// 重置密码
const resetPassword = (data) => {
  state.resetData = data || {}
  state.show.reset = true
}
const close = (isSave) => {
  state.show.reset = false
  state.show.view = false
  state.show.edit = false
  isSave && goPage()
}

goPage()

</script>

<style scoped>

</style>
