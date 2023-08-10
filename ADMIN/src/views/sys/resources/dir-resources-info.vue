<template>
  <section>
    <ZySearchForm
        :formValue="state.query.params"
        @submit="goPage"
        @reset="handleReset"
    >
      <a-form-item name="srcName">
        <a-input v-model:value="state.query.params.srcName" allowClear
                 placeholder="请输入资源名称" @pressEnter="goPage"
                 autocomplete="off"/>
      </a-form-item>
      <a-form-item name="srcType">
        <a-input v-model:value="state.query.params.srcType" allowClear
                 placeholder="请输入资源类型" @pressEnter="goPage"
                 autocomplete="off"/>
      </a-form-item>
    </ZySearchForm>
    <ZyFittleRow @add="goEdit"
                 addAuth="sys:resources:create"
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
          <span>{{ record.user[0].nickname }}</span>
        </template>
        <template v-else-if="column.key === 'previewPath'">
          <a-button v-copy="record.previewPath" style="margin-right: 5px" size="small">复制</a-button>
          <a-image v-if="record.srcType.startsWith('image/')&&record.previewPath" width="60px"
                   :src="record.previewPath"></a-image>
          <a v-if="!record.previewPath" :href="record.previewPath" target="_blank">{{ record.previewPath }}</a>
          <a v-if="record.srcType.startsWith('video/')&&record.previewPath" target="_blank" :href="record.previewPath">查看</a>
        </template>
        <template v-else-if="column.key === 'downloadPath'">
          <a-button v-copy="record.downloadPath" style="margin-right: 5px" size="small">复制</a-button>
          <a v-if="record.downloadPath" target="_blank" :href="record.downloadPath">下载</a>
        </template>
        <template v-else-if="column.key === 'action'">
          <ZyToolButton
              viewAuth="sys:resources:list"
              editAuth="sys:resources:update"
              deleteAuth="sys:resources:delete"
              @view="goView(record)"
              @edit="goEdit(record)"
              @delete="goDelete(record)"
          >
          </ZyToolButton>
        </template>
      </template>

    </a-table>
    <ZyModal :minWidth="650" :show="state.show.edit" :title="state.editTitle" key="GetResourcesInfo"
             @close="close">
      <GetResourcesInfo :updateData="state.updateData" @close="close"/>
    </ZyModal>
    <ZyModal :minWidth="650" :show="state.show.view" title="查看资源管理" key="ViewResourcesInfo"
             @close="close">
      <ViewResourcesInfo :viewData="state.viewData" @close="close"/>
    </ZyModal>
  </section>

</template>

<script setup>
/***资源管理管理 生成：2023/7/17 上午9:34:00***/
/**
 * 操作权限：
 'sys:resources:list',
 'sys:resources:create',
 'sys:resources:update',
 'sys:resources:delete'
 */

import {reactive, toRaw} from 'vue'
import GetResourcesInfo from "./get-resources-info.vue";
import ViewResourcesInfo from "./view-resources-info.vue";

import ZyModal from "comps/common/ZyModal.vue";
import ZyToolButton from "comps/common/ZyToolButton.vue";
import ZyFittleRow from "comps/common/ZyFittleRow.vue";
import ZySearchForm from "comps/common/ZySearchForm.vue";

import {ZyConfirm, ZyNotification} from "libs/util.toast";
import {isEmptyObject} from "libs/util.common";
import {TimeUtils} from "libs/util.time";
import {hasPerms} from 'libs/util.common';

import {resourcesDelete, resourcesList} from "api/modules/api.resources";

const columns = [
  {title: "资源名称", dataIndex: "srcName", key: "srcName", align: 'center'},
  {title: "资源类型", dataIndex: "srcType", key: "srcType", align: 'center'},
  {title: "资源大小", dataIndex: "srcSize", key: "srcSize", align: 'center'},
  {title: "资源预览", dataIndex: "previewPath", ellipsis: true, key: "previewPath", align: 'center'},
  {title: "下载地址", dataIndex: "downloadPath", ellipsis: true, key: "downloadPath", align: 'center'},
  {title: "操作人", dataIndex: "userId", key: "userId", align: 'center'},
  {title: "备注", dataIndex: "remark", key: "remark", align: 'center'},
  {title: "创建时间", dataIndex: "createdAt", key: "createdAt", align: 'center'},
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
  resourcesList(p).then(res => {
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
  row && row._id ? state.editTitle = '修改资源管理' : state.editTitle = '添加资源管理'
  state.updateData = row
}

const goDelete = (row) => {
  ZyConfirm('确认删除该条数据?').then(ok => {
    ok && resourcesDelete(row).then(res => {
      let url = row.deletePath
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
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
