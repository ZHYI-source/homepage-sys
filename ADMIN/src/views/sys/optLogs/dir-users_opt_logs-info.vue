<template>
  <section>
    <ZySearchForm
        :formValue="state.query.params"
        @submit="goPage"
        @reset="handleReset"
    >
      <a-form-item name="operator">
        <a-input v-model:value="state.query.params.operator" allowClear
                 placeholder="请输入操作人" @pressEnter="goPage"
                 autocomplete="off"/>
      </a-form-item>
      <a-form-item name="module">
        <a-input v-model:value="state.query.params.module" allowClear
                 placeholder="请输入操作模块" @pressEnter="goPage"
                 autocomplete="off"/>
      </a-form-item>

      <a-form-item name="platform">
        <a-input v-model:value="state.query.params.platform" allowClear
                 placeholder="请输入操作平台" @pressEnter="goPage"
                 autocomplete="off"/>
      </a-form-item>
      <a-form-item name="operatorIP">
        <a-input v-model:value="state.query.params.operatorIP" allowClear
                 placeholder="请输入设备IP" @pressEnter="goPage"
                 autocomplete="off"/>
      </a-form-item>
    </ZySearchForm>
    <ZyFittleRow @add="goEdit"
                 @delete="goDeleteAll"
                 addAuth="sys:users_opt_logs:create"
                 deleteText="批量删除"
                 deleteAuth="sys:users_opt_logs:deleteAll"
    >
      <a-button type="primary" size="small" v-permission="'sys:users_opt_logs:export'" @click="goExport">
        <template #icon>
          <IconFont type="icon-daochu1"/>
        </template>
        导出
      </a-button>
      <a-upload
          v-permission="'sys:users_opt_logs:import'"
          :headers="headers"
          @change="handleImportChange"
          :showUploadList="false"
          action="/v1/sys/users_opt_logs/import">
        <a-button type="primary" size="small">
          <template #icon>
            <IconFont type="icon-daoru1"/>
          </template>
          导入
        </a-button>
      </a-upload>

      <a-button type="primary" size="small" @click="getTemplate">
        <template #icon>
          <IconFont type="icon-down-arrow"/>
        </template>
        导入模板下载
      </a-button>
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
        <template v-else-if="column.key === 'action'">
          <ZyToolButton
              viewAuth="sys:users_opt_logs:list"
              editAuth="sys:users_opt_logs:update"
              deleteAuth="sys:users_opt_logs:delete"
              @view="goView(record)"
              @edit="goEdit(record)"
              @delete="goDelete(record)"
          >
          </ZyToolButton>
        </template>
      </template>

    </a-table>
    <ZyModal :minWidth="650" :show="state.show.edit" :title="state.editTitle" key="GetUsers_opt_logsInfo"
             @close="close">
      <GetUsers_opt_logsInfo :updateData="state.updateData" @close="close"/>
    </ZyModal>
    <ZyModal :minWidth="650" :show="state.show.view" title="查看操作日志" key="ViewUsers_opt_logsInfo"
             @close="close">
      <ViewUsers_opt_logsInfo :viewData="state.viewData" @close="close"/>
    </ZyModal>
  </section>

</template>

<script setup>
/***操作日志管理 生成：2023/7/7 下午2:37:53***/
/**
 * 操作权限：
 'sys:users_opt_logs:list'
 'sys:users_opt_logs:create'
 'sys:users_opt_logs:update'
 'sys:users_opt_logs:delete'
 'sys:users_opt_logs:deleteAll'
 */

import {reactive, toRaw} from 'vue'
import GetUsers_opt_logsInfo from "./get-users_opt_logs-info.vue";
import ViewUsers_opt_logsInfo from "./view-users_opt_logs-info.vue";

import ZyModal from "comps/common/ZyModal.vue";
import ZyToolButton from "comps/common/ZyToolButton.vue";
import ZyFittleRow from "comps/common/ZyFittleRow.vue";
import ZySearchForm from "comps/common/ZySearchForm.vue";

import {ZyConfirm, ZyNotification} from "libs/util.toast";
import {isEmptyObject} from "libs/util.common";
import {TimeUtils} from "libs/util.time";
import {hasPerms} from 'libs/util.common';

import {
  users_opt_logsDelete,
  users_opt_logsExport,
  users_opt_logsList,
  users_opt_logsDeleteAll,
  users_opt_logsDownloadTemplate
} from "api/modules/api.users_opt_logs";
import dbUtils from "libs/util.strotage";

const columns = [
  {
    title: "操作时间",
    dataIndex: "createdAt",
    sorter: (a, b) => a.createdAt - b.createdAt,
    key: "createdAt",
    align: 'center'
  },
  {title: "操作人", dataIndex: "operator", key: "operator", align: 'center'},
  {title: "操作模块", dataIndex: "module", key: "module", align: 'center'},
  {title: "操作平台", dataIndex: "platform", key: "platform", align: 'center'},
  {title: "设备IP", dataIndex: "operatorIP", key: "operatorIP", align: 'center'},
  {title: "设备位置", dataIndex: "address", key: "address", align: 'center'},
  {title: "操作内容", dataIndex: "content", key: "content", align: 'center'},
  {title: '操作', width: 225, key: 'action', align: 'center', fixed: 'right'}
];
const headers = {
  authorization: dbUtils.get('token')
}
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
  selectedRowKeys: [],
  // 请求参数
  query: {
    params: {},
    pagination: {
      current: 1,
      pageSize: 11,
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
  users_opt_logsList(p).then(res => {
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
  row && row._id ? state.editTitle = '修改操作日志' : state.editTitle = '添加操作日志'
  state.updateData = row
}
// 导出EXCEL
const goExport = () => {
  state.loading.spinning = true
  // 将响应式query返回起原始对象
  let p = toRaw(state.query)
  users_opt_logsExport(p).then(res => {
    state.loading.spinning = false
  }).catch(err => {
    state.loading.spinning = false
    console.log(err)
  })
}
// 导入数据
const handleImportChange = ({
                              file,
                            }) => {
  if (file.status === 'error') {
    ZyNotification.error(file.response.message || '导入失败')
  }
  if (file.status === 'done') {
    ZyNotification.success(file.response.message || '上传成功')
    goPage()
  }
};
// 下载模板
const getTemplate = () => {
  users_opt_logsDownloadTemplate().then(res => {
    state.loading.spinning = false
  }).catch(err => {
    state.loading.spinning = false
    console.log(err)
  })
}

// 批量删除
const goDeleteAll = () => {
  ZyConfirm('确认删除数据?').then(ok => {
    ok && users_opt_logsDeleteAll({ids: state.selectedRowKeys || []}).then(res => {
      ZyNotification.success('删除成功')
      goPage()
    })
  })
}
const goDelete = (row) => {
  ZyConfirm('确认删除该条数据?').then(ok => {
    ok && users_opt_logsDelete(row).then(res => {
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
