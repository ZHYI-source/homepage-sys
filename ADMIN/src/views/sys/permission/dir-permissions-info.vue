<template>
    <section>
        <ZySearchForm
                :formValue="state.query.params"
                @submit="goPage"
                @reset="handleReset"
        >
            <a-form-item name="name">
                <a-input v-model:value="state.query.params.name" allowClear placeholder="请输入权限名称" @pressEnter="goPage"
                         autocomplete="off"/>
            </a-form-item>
        </ZySearchForm>
        <ZyFittleRow @add="goEdit"
                     addAuth="syspermissions:create"
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
                <template v-if="column.key === 'status'">
                    <a-switch v-model:checked="record.status" :disabled="!hasPerms('sys:permissions:stop')"
                              checked-children="正常"
                              un-checked-children="停用"
                              @change="statusChange(record)"/>
                </template>
                <template v-if="column.key === 'auth'">
                    <a-tag color="#87d068" v-if="record.auth">是</a-tag>
                </template>
                <template v-if="column.key === 'key'">
                    <a-tag color="green" v-copy="record.key">{{record.key}}</a-tag>
                </template>
                <template v-if="column.key === 'parent_key'">
                    <a-tag color="green" v-if="record.parent_key" v-copy="record.key">{{record.parent_key}}</a-tag>
                </template>
                <template v-else-if="column.key === 'action'">
                    <ZyToolButton
                            viewAuth="sys:permissions:list"
                            editAuth="sys:permissions:update"
                            deleteAuth="sys:permissions:delete"
                            @view="goView(record)"
                            :showEdit="record.status"
                            @edit="goEdit(record)"
                            @delete="goDelete(record)"
                    >
                    </ZyToolButton>
                </template>
            </template>
        </a-table>
        <ZyModal :minWidth="650" :show="state.show.edit" :title="state.editTitle" :key="state.editTitle"
                 @close="close">
            <GetPermissionsInfo :updateData="state.updateData" @close="close"/>
        </ZyModal>
        <ZyModal :minWidth="650" :show="state.show.view" title="查看权限" key="ViewPermissionsInfo" @close="close">
            <ViewPermissionsInfo :viewData="state.viewData" @close="close"/>
        </ZyModal>
    </section>

</template>

<script setup>
    /***权限管理管理 生成：2023/7/6 下午4:02:21***/

    import {reactive, toRaw} from 'vue'
    import GetPermissionsInfo from "./get-permissions-info.vue";
    import ViewPermissionsInfo from "./view-permissions-info.vue";

    import ZyModal from "comps/common/ZyModal.vue";
    import ZyToolButton from "comps/common/ZyToolButton.vue";
    import ZyFittleRow from "comps/common/ZyFittleRow.vue";
    import ZySearchForm from "comps/common/ZySearchForm.vue";

    import {ZyConfirm, ZyNotification} from "libs/util.toast";
    import {isEmptyObject} from "libs/util.common";
    import {TimeUtils} from "libs/util.time";
    import {hasPerms} from 'libs/util.common';

    import {permissionsDelete, permissionsList, permissionsStop} from "api/modules/api.permissions";

    const columns = [

        {title: "权限名称", width: 275, dataIndex: "name", key: "name",},

        {title: "权限标识", width: 275, dataIndex: "key", key: "key",},

        {title: "父级标识", dataIndex: "parent_key", key: "parent_key",},

        {title: "权限按钮", dataIndex: "auth", key: "auth", align: 'center'},
        {title: "排序", dataIndex: "sortOrder", key: "sortOrder", align: 'center'},

        {title: "状态", width: 100, dataIndex: "status", key: "status", align: 'center'},

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
                columnKey: "sortOrder",
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


    const statusChange = (data) => {
        permissionsStop({_id: data._id}).then(res => {
            ZyNotification.success(data.status ? '启用成功' : '停用成功')
            goPage()
        })

    }

    function traverseTree(node) {
        // 处理当前节点
        node.createdAt = TimeUtils.formatTime(node.createdAt)
        node.updatedAt = TimeUtils.formatTime(node.updatedAt)
        // 递归遍历子节点
        if (node.children) {
            node.children.forEach(child => {
                traverseTree(child);
            });
        }
    }

    // 加载数据
    const getDataList = () => {
        state.loading.spinning = true
        // 将响应式query返回起原始对象
        let p = toRaw(state.query)
        permissionsList(p).then(res => {
            state.loading.spinning = false
            let datas = res.data.result
            // 遍历树状结构
            datas.forEach(node => {
                traverseTree(node);
            });

            state.dataList = datas
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
        row && row._id ? state.editTitle = '修改权限' : state.editTitle = '添加权限'
        state.updateData = row
    }
    // 验证权限标识默认有且仅有一个冒号 :
    function hasSingleColon(str,num=1) {
      const colonCount = (str.match(/:/g) || []).length;
      return colonCount === num;
    }
    const goDelete = (row) => {
      if (hasSingleColon(row.key,0)||hasSingleColon(row.key,1)){
        ZyConfirm('确认删除该条数据以及所有子级数据?').then(ok => {
          ok && permissionsDelete(row).then(res => {
            ZyNotification.success('删除成功')
            goPage()
          })
        })
      }else {
        ZyConfirm('确认删除该条数据?').then(ok => {
          ok && permissionsDelete(row).then(res => {
            ZyNotification.success('删除成功')
            goPage()
          })
        })
      }

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
