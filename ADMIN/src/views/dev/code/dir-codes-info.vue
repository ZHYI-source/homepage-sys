<template>
  <section>
    <a-alert
        message="💥代码生成功能：主要是开发人员使用。可能需要结合代码进行理解功能"
        type="info" style="margin-bottom: 10px" closable/>
    <ZySearchForm
        :formValue="state.query.params"
        @submit="goPage"
        @reset="handleReset"
    >
      <a-form-item name="name">
        <a-input v-model:value="state.query.params.name" allowClear placeholder="请输入文件名称" @pressEnter="goPage"
                 autocomplete="off"/>
      </a-form-item>
    </ZySearchForm>
    <ZyFittleRow @add="goEdit"
                 addText="创建"
                 @delete="goDeleteAll"
                 deleteText="批量删除"
                 addAuth="dev:codes:singleCurdFrontAndBack"
                 deleteAuth="dev:codes:deleteAll"
                 >
    </ZyFittleRow>
    <a-table
        :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
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
        <template v-if="column.key === 'avatar'">
          <a-image
              :width="40"
              :src="record.avatar"
          />
        </template>
        <template v-else-if="column.key === 'url'">
          <a-button type="primary" size="small" @click="downloadLink(record.url)">下载链接</a-button>
        </template>
        <template v-else-if="column.key === 'action'">
          <ZyToolButton
              viewAuth="dev:codes:list"
              deleteAuth="dev:codes:delete"
              :showEdit="false"
              :showView="false"
              @view="goView(record)"
              @edit="goEdit(record)"
              @delete="goDelete(record)"
          >
          </ZyToolButton>
        </template>
      </template>

    </a-table>
    <ZyModal :minWidth="650" :show="state.show.edit" :title="state.editTitle" :key="state.editTitle"
             @close="close">
      <GetCodesInfo :updateData="state.updateData" @close="close"/>
    </ZyModal>
    <ZyModal :minWidth="650" :show="state.show.view" title="查看代码生成" key="ViewCodesInfo" @close="close">
      <ViewCodesInfo :viewData="state.viewData" @close="close"/>
    </ZyModal>

  </section>
</template>

<script setup>
/***代码生成管理 生成：2023/7/5 下午9:38:20***/

import {reactive, toRaw} from 'vue'
import GetCodesInfo from "./get-codes-info.vue";
import ViewCodesInfo from "./view-codes-info.vue";

import ZyModal from "comps/common/ZyModal.vue";
import ZyToolButton from "comps/common/ZyToolButton.vue";
import ZyFittleRow from "comps/common/ZyFittleRow.vue";
import ZySearchForm from "comps/common/ZySearchForm.vue";

import {ZyConfirm, ZyNotification} from "libs/util.toast";
import {isEmptyObject} from "libs/util.common";
import {TimeUtils} from "libs/util.time";
import {hasPerms} from 'libs/util.common';

import {codesDelete, codesList,codesDeleteAll} from "api/modules/api.codes";
import {deleteFile} from "api/modules/api.upload";

const columns = [

  {title: "文件名称", dataIndex: "name", key: "name", align: 'center'},

  {title: "文件类型", dataIndex: "type", key: "type", align: 'center'},

  {title: "下载地址", dataIndex: "url", key: "url", align: 'center'},

  {title: "备注", dataIndex: "remark", key: "remark", align: 'center'},

  {title: "创建时间", dataIndex: "createdAt", key: "createdAt", align: 'center'},
  {title: '操作', key: 'action', align: 'center', fixed: 'right'}
];

const state = reactive({
  show: {
    add: false,
    edit: false,
    view: false
  },
  collections: [],
  editTitle: '编辑',
  activeComponent: null,
  selectedRowKeys:[],
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
      order: "descend"
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
// 下载文件
const downloadLink = (url) => {
  let a = document.createElement("a");
  a.href = url;
  a.click();
  // 释放之前创建的URL对象
  window.URL.revokeObjectURL(url);
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
  codesList(p).then(res => {
    state.loading.spinning = false
    let datas = res.data?.result || []
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

const onSelectChange = selectedRowKeys => {
  state.selectedRowKeys = selectedRowKeys;
};
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
  state.editTitle = '创建代码生成'
  state.updateData.back = row
}
// 批量删除
const goDeleteAll = () => {
  ZyConfirm('确认删除数据?').then(ok => {
    ok && codesDeleteAll({ids:state.selectedRowKeys||[]}).then(res => {
      ZyNotification.success('删除成功')
      goPage()
    })
  })
}
const goDelete = (row) => {
  ZyConfirm('确认删除该条数据?').then(ok => {
    ok && codesDelete(row).then(res => {
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

<style lang="scss" scoped>

</style>
