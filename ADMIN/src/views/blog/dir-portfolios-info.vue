<template>
  <section>
    <section v-if="!state.show.edit">
      <ZySearchForm
          :formValue="state.query.params"
          @submit="goPage"
          @reset="handleReset"
      >
        <a-form-item name="title">
          <a-input v-model:value="state.query.params.title" allowClear
                   placeholder="请输入作品名称" @pressEnter="goPage"
                   autocomplete="off"/>
        </a-form-item>
        <a-form-item name="category">
          <a-input v-model:value="state.query.params.category" allowClear
                   placeholder="请输入分类" @pressEnter="goPage"
                   autocomplete="off"/>
        </a-form-item>
        <a-form-item name="recommended">
          <a-select
              class="input-one"
              placeholder="是否精选"
              v-model:value="state.query.params.recommended"
              allowClear
              @change="goPage"
          >
            <a-select-option :value="true">是</a-select-option>
            <a-select-option :value="false">否</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="status">
          <a-select
              class="input-one"
              placeholder="是否精选"
              v-model:value="state.query.params.status"
              allowClear
              @change="goPage"
          >
            <a-select-option :value="true">正常</a-select-option>
            <a-select-option :value="false">禁用</a-select-option>
          </a-select>
        </a-form-item>
      </ZySearchForm>
      <ZyFittleRow @add="goEdit"
                   addAuth="blog:portfolios:create"
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
          <template v-if="column.key === 'cover'">
            <a-image
                :width="100"
                :src="record.cover"
            />
          </template>
          <template v-else-if="column.key === 'demoUrl'">
            <a :href="record.demoUrl" target="_blank">{{ record.demoUrl }}</a>
          </template>
          <template v-else-if="column.key === 'sourceUrl'">
            <a :href="record.sourceUrl" target="_blank">{{ record.sourceUrl }}</a>
          </template>
          <template v-else-if="column.key === 'recommended'">
            <a-tag v-if="record.status" color="green">是</a-tag>
            <a-tag v-if="!record.status">否</a-tag>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag v-if="record.status" color="green">正常</a-tag>
            <a-tag v-if="!record.status">禁止</a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <ZyToolButton
                viewAuth="blog:portfolios:list"
                editAuth="blog:portfolios:update"
                deleteAuth="blog:portfolios:delete"
                @view="goView(record)"
                @edit="goEdit(record)"
                @delete="goDelete(record)"
            >
            </ZyToolButton>
          </template>
        </template>
      </a-table>
      <ZyModal :minWidth="650" :show="state.show.view" title="查看作品集" key="ViewPortfoliosInfo"
               @close="close">
        <ViewPortfoliosInfo :viewData="state.viewData" @close="close"/>
      </ZyModal>
    </section>
    <GetPortfoliosInfo v-if="state.show.edit" :updateData="state.updateData" @close="close"/>
  </section>
</template>

<script setup>
/***作品集管理 生成：2023/8/6 下午10:16:02***/
/**
 * 操作权限：
 'blog:portfolios:list'
 'blog:portfolios:create'
 'blog:portfolios:update'
 'blog:portfolios:delete'
 */

import {reactive, toRaw} from 'vue'
import GetPortfoliosInfo from "./get-portfolios-info.vue";
import ViewPortfoliosInfo from "./view-portfolios-info.vue";
import ZyModal from "comps/common/ZyModal.vue";
import ZyToolButton from "comps/common/ZyToolButton.vue";
import ZyFittleRow from "comps/common/ZyFittleRow.vue";
import ZySearchForm from "comps/common/ZySearchForm.vue";
import {ZyConfirm, ZyNotification} from "libs/util.toast";
import {isEmptyObject} from "libs/util.common";
import {TimeUtils} from "libs/util.time";

import {portfoliosDelete, portfoliosList} from "api/modules/api.portfolios";

const columns = [
  {title: "分类", dataIndex: "category", ellipsis: true, width: 100, key: "category", align: 'center'},
  {title: "作品名称", dataIndex: "title", ellipsis: true, width: 205, key: "title", align: 'center'},
  {title: "作品封面", dataIndex: "cover", ellipsis: true, width: 205, key: "cover", align: 'center'},
  {title: "作品简介", dataIndex: "abstract", ellipsis: true, width: 405, key: "abstract", align: 'center'},
  {title: "示例地址", dataIndex: "demoUrl", ellipsis: true, width: 205, key: "demoUrl", align: 'center'},
  {title: "源码地址", dataIndex: "sourceUrl", ellipsis: true, width: 205, key: "sourceUrl", align: 'center'},
  {title: "技术框架", dataIndex: "framework", ellipsis: true, width: 205, key: "framework", align: 'center'},
  {title: "是否精选", dataIndex: "recommended", ellipsis: true, width: 100, key: "recommended", align: 'center'},
  {title: "状态", dataIndex: "status", width: 105, key: "status", align: 'center', fixed: 'right'},
  {title: "创建时间", dataIndex: "createdAt", width: 205, key: "createdAt", align: 'center'},
  {title: "备注", dataIndex: "remark", ellipsis: true, width: 305, key: "remark", align: 'center'},
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

// 加载数据
const getDataList = () => {
  state.loading.spinning = true
  // 将响应式query返回起原始对象
  let p = toRaw(state.query)
  portfoliosList(p).then(res => {
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
  row && row._id ? state.editTitle = '修改作品集' : state.editTitle = '添加作品集'
  state.updateData = row
}

const goDelete = (row) => {
  ZyConfirm('确认删除该条数据?').then(ok => {
    ok && portfoliosDelete(row).then(res => {
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
