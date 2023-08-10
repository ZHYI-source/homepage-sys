<template>
  <section>
    <ZYSearchForm
        :formValue="query.params"
        :rules="searchFormRules"
        @submit="goPage"
        @reset="handleReset"
    >
      <a-form-item name="name">
        <a-input v-model:value="query.params.name" allowClear placeholder="请输入名称" @pressEnter="goPage"
                 autocomplete="off"/>
      </a-form-item>
    </ZYSearchForm>
    <a-table
        bordered
        :resizable="true"
        :loading="loading"
        :columns="columns"
        :row-key="record => record.key"
        :pagination="query.pagination"
        @change="handleTableChange"
        :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
        :data-source="data">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a>{{ record.name }}</a>
        </template>
        <template v-else-if="column.key === 'action'">
          <ZyToolButton
              @view="goView(record)"
              @edit="goEdit(record)"
              @delete="goDelete(record)"
          >
          </ZyToolButton>
        </template>
      </template>
    </a-table>
    <ZyModal :show="openModal" title="编辑" @close="openModal = false">
    </ZyModal>
  </section>

</template>

<script setup>
import {reactive, ref, toRefs, toRaw} from 'vue'
import dirUserInfo from "../users/dir-users-info.vue";
import {ZyConfirm, ZyMessage, ZyNotification} from "../../../libs/util.toast";
import {TimeUtils} from "../../../libs/util.time";
import Logger from "../../../libs/util.log";
import ZYSearchForm from "comps/common/ZySearchForm.vue";
import ZyModal from "comps/common/ZyModal.vue";
import ZyToolButton from "comps/common/ZyToolButton.vue";
import {isEmptyObject} from "../../../libs/util.common";
import {menuList} from "../../../libs/util.menu";

// 查询表单校验规则
const searchFormRules = {
  name: [{required: true, message: '请输入名称', trigger: 'blur'},],
}
const columns = [
  {
    title: '菜单名称',
    dataIndex: 'menuName',
    key: 'menuName',
    align: 'center'
  },
  {
    title: '图标',
    dataIndex: 'menuIcon',
    key: 'menuIcon',
    align: 'center',
    sorter: true

  }, {
    title: '权限标识',
    dataIndex: 'permission',
    key: 'permission',
    // align: 'center'
  },
  {
    title: '组件',
    dataIndex: 'component',
    key: 'component',
    align: 'center'
  },
  {
    title: '排序',
    dataIndex: 'sortOrder',
    key: 'sortOrder',
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center'
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    align: 'center'
  },
  {
    title: '操作',
    width: 225,
    key: 'action',
    align: 'center',
    fixed: 'right'
  }
];
const data = [
  {
    id: 1,
    parentId: 0,
    menuName: '首页',
    menuIcon: 'dashboard',
    permission: 'dashboard:access',
    component: '/dir-dashboard-info.vue',
    sortOrder: 1,
    status: 'active',
    createdAt: '2022-04-26 14:11:49'
  },
  {
    id: 2,
    parentId: 0,
    menuName: '系统管理',
    menuIcon: 'sys',
    permission: 'sys',
    component: '/',
    sortOrder: 1,
    status: 'active',
    createdAt: '2022-04-26 14:11:49',
    children: [
      {
        id: '2-1',
        parentId: 2,
        menuName: '用户管理',
        menuIcon: 'user',
        permission: 'sys:users',
        component: '/dir-users-info.vue',
        sortOrder: 1,
        status: 'active',
        createdAt: '2022-04-26 14:11:49',
        children: [
          {
            id: '2-1-2',
            parentId: '2-1',
            menuName: '查询',
            menuIcon: 'caidanguanli',
            permission: 'sys:users:list',
            component: '/dir-menu-info.vue',
            sortOrder: 1,
            status: 'active',
            createdAt: '2022-04-26 14:11:49',
          },

          {
            id: '2-1-1',
            parentId: '2-1',
            menuName: '增加',
            menuIcon: 'user',
            permission: 'sys:users:create',
            component: '/dir-users-info.vue',
            sortOrder: 2,
            status: 'active',
            createdAt: '2022-04-26 14:11:49',
          },
          {
            id: '2-1-3',
            parentId: '2-1',
            menuName: '更新',
            menuIcon: 'shezhi',
            permission: 'sys:users:update',
            component: '/dir-icon-info.vue',
            sortOrder: 3,
            status: 'active',
            createdAt: '2022-04-26 14:11:49',
          },
          {
            id: '2-1-4',
            parentId: '2-1',
            menuName: '删除',
            menuIcon: 'shezhi',
            permission: 'sys:users:delete',
            component: '/dir-icon-info.vue',
            sortOrder: 3,
            status: 'active',
            createdAt: '2022-04-26 14:11:49',
          },
        ]
      },
      {
        id: 2 - 2,
        parentId: 2,
        menuName: '菜单管理',
        menuIcon: 'caidanguanli',
        permission: 'menu:access',
        component: '/dir-menu-info.vue',
        sortOrder: 2,
        status: 'active',
        createdAt: '2022-04-26 14:11:49',
        children: [
          {
            id: '2-1-2',
            parentId: '2-1',
            menuName: '查询',
            menuIcon: 'caidanguanli',
            permission: 'sys:users:list',
            component: '/dir-menu-info.vue',
            sortOrder: 1,
            status: 'active',
            createdAt: '2022-04-26 14:11:49',
          },

          {
            id: '2-1-1',
            parentId: '2-1',
            menuName: '增加',
            menuIcon: 'user',
            permission: 'sys:users:create',
            component: '/dir-users-info.vue',
            sortOrder: 2,
            status: 'active',
            createdAt: '2022-04-26 14:11:49',
          },

          {
            id: '2-1-3',
            parentId: '2-1',
            menuName: '更新',
            menuIcon: 'shezhi',
            permission: 'sys:users:update',
            component: '/dir-icon-info.vue',
            sortOrder: 3,
            status: 'active',
            createdAt: '2022-04-26 14:11:49',
          },
          {
            id: '2-1-4',
            parentId: '2-1',
            menuName: '删除',
            menuIcon: 'shezhi',
            permission: 'sys:users:delete',
            component: '/dir-icon-info.vue',
            sortOrder: 3,
            status: 'active',
            createdAt: '2022-04-26 14:11:49',
          },
        ]
      },
      {
        id: 2-3,
        parentId: 2,
        menuName: '图标列表',
        menuIcon: 'shezhi',
        permission: 'icon:access',
        component: '/dir-icon-info.vue',
        sortOrder: 3,
        status: 'active',
        createdAt: '2022-04-26 14:11:49',
      },
    ]
  },
  {
    id: 3,
    parentId: 0,
    menuName: 'Vue3文档内嵌',
    menuIcon: 'frame',
    permission: 'frame:access',
    component: '/dir-frame-info.vue',
    sortOrder: 1,
    status: 'active',
    createdAt: '2022-04-26 14:11:49',
  },
  {
    id: 4,
    parentId: 0,
    menuName: 'Vue3文档外链',
    menuIcon: 'wailian_icon',
    permission: 'dashboard:access',
    component: '/dir-wailian_icon-info.vue',
    sortOrder: 1,
    status: 'active',
    createdAt: '2022-04-26 14:11:49',
  },

];




// 请求参数
const query = reactive({
  params: {},
  pagination: {
    current: 1,
    pageSize: 10,
    total: 100,
    hideOnSinglePage: true,
  },
  sort: {
    columnKey: "id",
    order: "ascend"
  }
});
const loading = reactive({
  spinning: false,
  tip: '加载中'
});
// 查询
const goPage = (num = 1) => {
  query.pagination.current = num;
  getDataList()
}
// 重置查询条件
const handleReset = () => {
  goPage()
}
// 分页
const pageChange = ({current, pageSize}) => {
  // 更新当前页码和每页条数
  query.pagination.current = current;
  query.pagination.pageSize = pageSize;
  getDataList()
}
// 排序
const sorterChange = ({columnKey, order}) => {
  // 更新当前排序
  query.sort.current = columnKey;
  query.sort.order = order;
  getDataList()
}

// 加载数据
const getDataList = () => {
  loading.spinning = true
  // 将响应式query返回起原始对象
  let p = toRaw(query)
  console.log(p)
  setTimeout(() => {
    loading.spinning = false
  }, 1000)
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
  console.log(row)
  open.value = true
}
const goEdit = (row) => {
  console.log(row)
  ZyMessage.success('success')
  ZyNotification.info('提示', '你好啊')
}

const goDelete = (row) => {
  console.log(row)
  ZyConfirm('确认删除该条数据?').then(ok => {
    console.log(ok)
  })
}
</script>

<style scoped>

</style>
