<template>
  <section>
    <ZySearchForm
        :formValue="state.query.params"
        @submit="goPage"
        @reset="handleReset"
    >
      <a-form-item name="name">
        <a-input v-model:value="state.query.params.username" allowClear placeholder="请输入用户名" @pressEnter="goPage"
                 autocomplete="off"/>
      </a-form-item>
      <a-form-item name="type">
        <a-select
            allowClear placeholder="选择用户类型"
            class="input-one"
            v-model:value="state.query.params.type"
            @change="goPage"
        >
          <a-select-option value="admin">admin</a-select-option>
          <a-select-option value="user">user</a-select-option>
        </a-select>
      </a-form-item>
    </ZySearchForm>
    <ZyFittleRow @add="goEdit"
                 addAuth="sys:user:create"
                 :showDelete="false"/>
    <a-table
        bordered
        :resizable="true"
        :loading="state.loading"
        :columns="columns"
        :row-key="record => record._id"
        :pagination="state.query.pagination"
        :expandedRowRender="state.expandedRowKeys"
        @expand="onExpand"
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
        <template v-else-if="column.key === 'status'">
          <a-switch v-model:checked="record.status" :disabled="!hasPerms('sys:users:update')" checked-children="正常"
                    un-checked-children="停用"
                    @change="statusChange(record)"/>
        </template>
        <template v-else-if="column.key === 'action'">
          <ZyToolButton
              viewAuth="sys:user:list"
              editAuth="sys:user:update"
              deleteAuth="sys:user:delete"
              :showView="false"
              @view="goView(record)"
              :showEdit="record.status"
              @edit="goEdit(record)"
              @delete="goDelete(record)"
          >
            <a-button type="primary"
                      size="small"
                      @click="resetPassword(record)"
                      v-permission="'sys:users:reset'">重置密码
            </a-button>
          </ZyToolButton>
        </template>
      </template>
      <!--  <template #expandedRowRender="{ record }">
          <a-descriptions title="权限信息" bordered v-for="(item,index) in record.role" :key="index">
            <a-descriptions-item label="角色名称">{{ item.roleName }}</a-descriptions-item>
            <a-descriptions-item label="角色标识">{{ item.roleAuth }}</a-descriptions-item>
            <a-descriptions-item label="角色状态">
              <a-badge :status="item.status?'success':'error'" :text="item.status?'正常':'停用'"/>
            </a-descriptions-item>
            <a-descriptions-item label="角色备注" :span="3">{{ item.remark || '-' }}</a-descriptions-item>
            <a-descriptions-item label="角色权限">
              <a-tag color="#55acee" style="margin: 5px;cursor: pointer" v-for="(items,index) in item.perms" :key="index">
                <template #icon>
                  <IconFont type="icon-quanxianguanli"/>
                </template>
                {{ items }}
              </a-tag>
            </a-descriptions-item>
          </a-descriptions>
        </template>
  -->
    </a-table>
    <ZyModal :minWidth="650" :show="state.show.edit" :title="state.editTitle" key="GetUserInfo"
             @close="close">
      <GetUserInfo :updateData="state.updateData" @close="close"/>
    </ZyModal>
    <ZyModal :minWidth="650" :show="state.show.view" title="查看用户" key="ViewUserInfo" @close="close">
      <ViewUserInfo :viewData="state.viewData" @close="close"/>
    </ZyModal>
    <ZyModal :minWidth="650" :show="state.show.reset" title="重置密码" key="ResetUserInfo"
             @close="close">
      <ResetUserInfo :updateData="state.resetData" @close="close"/>
    </ZyModal>
  </section>

</template>

<script setup>
import {reactive, toRaw} from 'vue'
import {ZyConfirm, ZyNotification} from "../../../libs/util.toast";
import {isEmptyObject} from "../../../libs/util.common";
import GetUserInfo from "./get-users-info.vue";
import ZyModal from "../../../components/common/ZyModal.vue";
import ViewUserInfo from "./view-users-info.vue";
import ZyToolButton from "../../../components/common/ZyToolButton.vue";
import ZyFittleRow from "../../../components/common/ZyFittleRow.vue";
import ZySearchForm from "../../../components/common/ZySearchForm.vue";
import {usersDelete, usersList, usersUpdate} from "../../../api/modules/api.users";
import {TimeUtils} from "../../../libs/util.time";
import ResetUserInfo from "./reset-users-info.vue";
import {hasPerms} from '../../../libs/util.common';

const columns = [
  {title: '头像', dataIndex: 'avatar', key: 'avatar', align: 'center'},
  {title: '昵称', dataIndex: 'nickname', key: 'nickname', align: 'center'},
  {title: '用户名', dataIndex: 'username', key: 'username', align: 'center'},
  {title: '类型', dataIndex: 'type', key: 'type', align: 'center'},
  // {title: '密码', width: 180, dataIndex: 'password', key: 'password', ellipsis: true, align: 'center'},
  {title: '备注', dataIndex: 'remark', key: 'remark', align: ''},
  {title: '账号状态', dataIndex: 'status', key: 'status', align: 'center'},
  {
    title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', sorter: (a, b) => {
    }, align: 'center'
  },
  {title: '操作', width: 225, key: 'action', align: 'center', fixed: 'right'}
];

const state = reactive({
  show: {
    add: false,
    edit: false,
    view: false
  },
  editTitle: '编辑用户',
  activeComponent: null,
  expandedRowKeys: [],
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
      columnKey: "type",
      order: "ascend"
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
const onExpand = (bool, row) => {

}

const statusChange = (data) => {
  usersUpdate({_id: data._id, status: data.status}).then(res => {
    ZyNotification.success(data.status ? '启用成功' : '停用成功')
    goPage()
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
  usersList(p).then(res => {
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
  row && row._id ? state.editTitle = '修改用户' : state.editTitle = '添加用户'
  state.updateData = row
}

const goDelete = (row) => {
  ZyConfirm('确认删除该条数据?').then(ok => {
    ok && usersDelete(row).then(res => {
      ZyNotification.success('删除成功')
      goPage()
    }).catch(err => {
      ZyNotification.error('操作失败')
      console.log(err)
    })
  })
}
// 重置密码
const resetPassword = (data) => {
  state.resetData = data || {}
  state.show.reset = true
}
const close = (isSave) => {
  state.show.add = false
  state.show.reset = false
  state.show.view = false
  state.show.edit = false
  isSave && goPage()
}

goPage()

</script>

<style scoped>

</style>
