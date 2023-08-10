<template>
    <section class="zy-get">
        <a-form :model="state.form" style="background-color:#fff;" ref="formRef" :label-col="labelCol"
                :wrapper-col="wrapperCol">
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
                <a-input v-model:value="state.form.roleAuth" allowClear placeholder="请输入角色标识"/>
            </a-form-item>
            <a-form-item label="角色备注" name="remark">
                <a-textarea v-model:value="state.form.remark" allowClear placeholder="请输入角色备注"/>
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
    import {rolesCreate} from "../../../api/modules/api.roles";

    const perms = ref(['sys:users'])

    watch(perms, (newValue) => {
        console.log('Parent component - perms:', newValue);
    });

    const labelCol = {
        style: {
            width: '100px',
        },
    }
    const wrapperCol = {
        span: 14,
    }


    const props = defineProps({})
    const emit = defineEmits(['close'])
    const formRef = ref();

    const state = reactive({
        form: {}
    });
    const onSubmit = async () => {
        try {
            const values = await formRef.value.validateFields();
            rolesCreate(values).then(res => {
                ZyNotification.success('添加角色成功！')
                emit('close',true)
            })
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }

    };

    const close = () => {
        ZyConfirm('还没保存数据，确认退出?').then(ok => {
            if (!ok) return
            emit('close')
        })
    }
</script>

<style scoped>

</style>
