<template>
    <section class="zy-get">
        <a-form :model="state.form" ref="formRef" class="zy-form" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-item label="角色名称"
                         name="roleName"
                         :rules="[{ required: true, message: '请输入角色名称!' }]"
            >
                <a-input v-model:value="state.form.roleName" allowClear placeholder="请输入角色名称"/>
            </a-form-item>
            <a-form-item label="角色标识"
                         name="roleAuth"
                         :rules="[{ required: true, message: '请输入角色标识!' }]"
            >
                <a-input v-model:value="state.form.roleAuth" disabled allowClear placeholder="请输入角色标识"/>
            </a-form-item>
            <a-form-item label="角色备注" name="remark">
                <a-textarea v-model:value="state.form.remark"  allowClear placeholder="请输入角色备注"/>
            </a-form-item>
            <a-form-item label="状态"
                         name="status"
                         :rules="[{ required: true, message: '请选状态!' }]">
                <a-radio-group v-model:value="state.form.status">
                    <a-radio :value="true">正常</a-radio>
                    <a-radio :value="false">禁用</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="菜单权限" name="perms"
                         :rules="[{ required: true, message: '请选权限!' }]">
                <ZyPermTree v-model:value="state.form.perms"/>
            </a-form-item>
        </a-form>
        <ZyFormButton @save="onSubmit" @close="close"/>
    </section>
</template>

<script setup>
    import {ref, watch, reactive, toRaw} from 'vue';
    import ZyPermTree from "comps/common/ZyPermTree.vue";
    import ZyFormButton from "comps/common/ZyFormButton.vue";
    import {ZyConfirm, ZyNotification} from "../../../libs/util.toast";
    import {rolesCreate, rolesUpdate} from "../../../api/modules/api.roles";

    const labelCol = {
        style: {
            width: '100px',
        },
    }
    const wrapperCol = {
        span: 14,
    }

    const state = reactive({
        form: {}
    });
    const formRef = ref();
    const props = defineProps({
        updateData: {
            type: Object,
            default: () => {
            }
        }
    })
    const emit = defineEmits(['close'])

    state.form = props.updateData || {}


    const onSubmit = async () => {
        try {
            const values = await formRef.value.validateFields();
            values._id = state.form._id
            rolesUpdate(values).then(res => {
                if (res){
                    ZyNotification.success('修改角色成功！')
                    emit('close', true)
                }
            })
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }

    };

    const close = () => {
        ZyConfirm('还没保存数据，确认退出?').then(ok => {
            if (!ok) return
            emit('close', true)
        })
    }
</script>

<style scoped>

</style>
