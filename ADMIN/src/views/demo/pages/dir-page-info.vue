<template>
  <section>
    <ZySearchForm
        :formValue="state.query.params"
        @submit="goPage"
        @reset="handleReset"
    >
      <a-form-item name="name">
        <a-input v-model:value="state.query.params.username" allowClear placeholder="请输入标题" @pressEnter="goPage"
                 autocomplete="off"/>
      </a-form-item>
    </ZySearchForm>
    <ZyFittleRow @add="goEdit"
                 addAuth="sys:user:create"
    >
      <a-button size="small" type="primary">
        <IconFont type="icon-upload"/>
        导入
      </a-button>
      <a-button size="small" type="primary">
        <IconFont type="icon-upload"/>
        导出
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
              @view="goView(record)"
              @edit="goEdit(record)"
              @delete="goDelete(record)"
          >
          </ZyToolButton>
        </template>
      </template>
    </a-table>
    <ZyModal :minWidth="650" :show="state.show.edit" :title="state.editTitle" key="GetUserInfo"
             @close="close">
      <GetPageInfo :updateData="state.updateData" @close="close"/>
    </ZyModal>
    <ZyModal :minWidth="650" :show="state.show.view" title="查看用户" key="ViewUserInfo" @close="close">
      <ViewPageInfo :viewData="state.viewData" @close="close"/>
    </ZyModal>
  </section>

</template>

<script setup>
import {reactive, toRaw} from 'vue'
import GetPageInfo from "./get-page-info.vue";
import ViewPageInfo from "./view-page-info.vue";

import ZyModal from "comps/common/ZyModal.vue";
import ZyToolButton from "comps/common/ZyToolButton.vue";
import ZyFittleRow from "comps/common/ZyFittleRow.vue";
import ZySearchForm from "comps/common/ZySearchForm.vue";

import {ZyConfirm, ZyNotification} from "libs/util.toast";
import {isEmptyObject} from "libs/util.common";
import {TimeUtils} from "libs/util.time";
import {hasPerms} from 'libs/util.common';

import {usersDelete, usersList, usersUpdate} from "api/modules/api.users";

const columns = [
  {title: '封面', dataIndex: 'coverImage', ellipsis: true, key: 'coverImage', align: 'center'},
  {title: '标题', dataIndex: 'title', key: 'title', ellipsis: true, align: 'center'},
  {title: '摘要', dataIndex: 'summary', key: 'summary', ellipsis: true, align: 'center'},
  {title: '分类', dataIndex: 'category', key: 'category', ellipsis: true, align: 'center'},
  {title: '状态', dataIndex: 'status', key: 'status', ellipsis: true, align: 'center'},
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
  selectedRowKeys: [],
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


const onSelectChange = selectedRowKeys => {
  state.selectedRowKeys = selectedRowKeys;
};

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
  // usersList(p).then(res => {
  //   state.loading.spinning = false
  //   let datas = res.data.result
  //   for (const data of datas) {
  //     data.createdAt = TimeUtils.formatTime(data.createdAt)
  //     data.updatedAt = TimeUtils.formatTime(data.updatedAt)
  //   }
  //   state.dataList = datas
  //   state.query.pagination.total = res.data.total
  //   state.query.pagination.current = res.data.current
  //   state.query.pagination.pageSize = res.data.pageSize
  // }).catch(err => {
  //   state.loading.spinning = false
  //   console.log(err)
  // })
  let res={
    data:{
      result:[
        {
          "_id": "1",
          "title": "Lorem Ipsum",
          "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "summary": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "tags": ["lorem", "ipsum", "dolor"],
          "category": "General",
          "coverImage": "image1.jpg",
          "status": "draft",
          "createdAt": "2023-07-06T10:30:00Z",
          "updatedAt": "2023-07-06T10:30:00Z",
          "publishedAt": null
        },
        {
          "_id": "2",
          "title": "Aenean tincidunt",
          "content": "Aenean tincidunt ex sit amet consequat malesuada.",
          "summary": "Aenean tincidunt ex sit amet consequat malesuada.",
          "tags": ["aenean", "tincidunt", "malesuada"],
          "category": "Technology",
          "coverImage": "image2.jpg",
          "status": "published",
          "createdAt": "2023-07-05T14:20:00Z",
          "updatedAt": "2023-07-06T09:15:00Z",
          "publishedAt": "2023-07-06T09:15:00Z"
        },
        {
          "_id": "3",
          "title": "Sed fermentum",
          "content": "Sed fermentum libero ut fringilla pharetra.",
          "summary": "Sed fermentum libero ut fringilla pharetra.",
          "tags": ["sed", "fermentum", "fringilla"],
          "category": "Science",
          "coverImage": "image3.jpg",
          "status": "published",
          "createdAt": "2023-07-04T16:45:00Z",
          "updatedAt": "2023-07-05T11:10:00Z",
          "publishedAt": "2023-07-05T11:10:00Z"
        },
        {
          "_id": "4",
          "title": "Nulla facilisi",
          "content": "Nulla facilisi. Donec convallis diam vel maximus efficitur.",
          "summary": "Nulla facilisi. Donec convallis diam vel maximus efficitur.",
          "tags": ["nulla", "facilisi", "convallis"],
          "category": "General",
          "coverImage": "image4.jpg",
          "status": "draft",
          "createdAt": "2023-07-03T09:20:00Z",
          "updatedAt": "2023-07-03T09:20:00Z",
          "publishedAt": null
        },
        {
          "_id": "5",
          "title": "Vestibulum at varius",
          "content": "Vestibulum at varius dui, non maximus metus.",
          "summary": "Vestibulum at varius dui, non maximus metus.",
          "tags": ["vestibulum", "varius", "dui"],
          "category": "Technology",
          "coverImage": "image5.jpg",
          "status": "published",
          "createdAt": "2023-07-02T14:30:00Z",
          "updatedAt": "2023-07-04T09:45:00Z",
          "publishedAt": "2023-07-04T09:45:00Z"
        },
        {
          "_id": "6",
          "title": "Praesent gravida",
          "content": "Praesent gravida ipsum at lorem facilisis aliquam.",
          "summary": "Praesent gravida ipsum at lorem facilisis aliquam.",
          "tags": ["praesent", "gravida", "facilisis"],
          "category": "Science",
          "coverImage": "image6.jpg",
          "status": "published",
          "createdAt": "2023-07-01T10:10:00Z",
          "updatedAt": "2023-07-03T15:25:00Z",
          "publishedAt": "2023-07-03T15:25:00Z"
        },
        {
          "_id": "7",
          "title": "Fusce tempus",
          "content": "Fusce tempus velit vitae libero viverra lacinia.",
          "summary": "Fusce tempus velit vitae libero viverra lacinia.",
          "tags": ["fusce", "tempus", "viverra"],
          "category": "General",
          "coverImage": "image7.jpg",
          "status": "draft",
          "createdAt":"2023-06-30T12:05:00Z",
          "updatedAt": "2023-07-01T16:40:00Z",
          "publishedAt": null
        },
        {
          "_id": "8",
          "title": "Aliquam erat volutpat",
          "content": "Aliquam erat volutpat. Curabitur facilisis ullamcorper mauris ut efficitur.",
          "summary": "Aliquam erat volutpat. Curabitur facilisis ullamcorper mauris ut efficitur.",
          "tags": ["aliquam", "volutpat", "curabitur"],
          "category": "Technology",
          "coverImage": "image8.jpg",
          "status": "published",
          "createdAt": "2023-06-29T08:15:00Z",
          "updatedAt": "2023-07-02T13:20:00Z",
          "publishedAt": "2023-07-02T13:20:00Z"
        },
        {
          "_id": "9",
          "title": "Morbi consequat",
          "content": "Morbi consequat nibh vel nisi cursus ultrices.",
          "summary": "Morbi consequat nibh vel nisi cursus ultrices.",
          "tags": ["morbi", "consequat", "nibh"],
          "category": "Science",
          "coverImage": "image9.jpg",
          "status": "published",
          "createdAt": "2023-06-28T14:50:00Z",
          "updatedAt": "2023-06-30T10:30:00Z",
          "publishedAt": "2023-06-30T10:30:00Z"
        },
        {
          "_id": "10",
          "title": "Etiam nec pharetra",
          "content": "Etiam nec pharetra nunc, eu maximus diam.",
          "summary": "Etiam nec pharetra nunc, eu maximus diam.",
          "tags": ["etiam", "pharetra", "maximus"],
          "category": "General",
          "coverImage": "image10.jpg",
          "status": "draft",
          "createdAt": "2023-06-27T11:25:00Z",
          "updatedAt": "2023-06-27T11:25:00Z",
          "publishedAt": null
        }
      ],
      total:10,
      current:1,
      pageSize:15
    }
  }

  state.loading.spinning = false
  let datas = res.data.result
  for (const data of datas) {
    data.createdAt = TimeUtils.formatTime(data.createdAt)
    data.updatedAt = TimeUtils.formatTime(data.updatedAt)
    data.publishedAt = TimeUtils.formatTime(data.publishedAt)
  }
  state.dataList = datas
  state.query.pagination.total = res.data.total
  state.query.pagination.current = res.data.current
  state.query.pagination.pageSize = res.data.pageSize

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
  row && row._id ? state.editTitle = '修改文章' : state.editTitle = '添加文章'
  state.updateData = row
}

const goDelete = (row) => {
  ZyConfirm('确认删除该条数据?').then(ok => {
    ok && ZyNotification.success('删除成功')
    goPage()
    // ok && usersDelete(row).then(res => {
    //   ZyNotification.success('删除成功')
    //   goPage()
    // }).catch(err => {
    //   ZyNotification.error('操作失败')
    //   console.log(err)
    // })
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

<style  lang="scss" scoped>

</style>
