<template>
    <section class="zy-get">

        <a-form :model="state.form"
                class="zy-form"
                :label-col="labelCol"
                ref="formRef"
                :wrapper-col="wrapperCol">

            <a-form-item label="权限名称"
                         name="name"
                         :rules="[{ required: true, message: '请输入权限名称!' }]">
                <a-input v-model:value="state.form.name" allowClear placeholder="权限名称：增加"/>
            </a-form-item>

            <a-form-item label="权限标识"
                         name="key"
                         :rules="[{ required: true, message: '请输入权限标识!' }]">
                <a-input v-model:value="state.form.key" allowClear placeholder="权限标识：sys:user / sys:user:create"/>
            </a-form-item>

            <a-form-item label="父级标识"
                         name="parent_key">
                <a-input v-model:value="state.form.parent_key" allowClear placeholder="父级标识：sys"/>

            </a-form-item>
            <a-form-item label="排序"
                         name="sortOrder">
                <a-input v-model:value="state.form.sortOrder" allowClear placeholder="排序:值越大越往后"/>

            </a-form-item>

            <a-form-item label="权限按钮"
                         name="auth">
                <a-radio-group v-model:value="state.form.auth" name="auth">
                    <a-radio :value="true">是</a-radio>
                    <a-radio :value="false">否</a-radio>
                </a-radio-group>
            </a-form-item>
          <a-form-item label="生成子级"
                         name="autoSon">
                <a-radio-group v-model:value="state.form.autoSon" name="auth">
                    <a-radio :value="true">是</a-radio>
                    <a-radio :value="false">否</a-radio>
                </a-radio-group>
            <a-alert message="生成子级:自动生成增删改查权限按钮"></a-alert>
            </a-form-item>
        </a-form>
        <ZyFormButton @save="onSubmit" @close="close"/>
    </section>
</template>

<script setup>
    import {reactive, toRaw, ref} from 'vue';
    import ZyFormButton from "comps/common/ZyFormButton.vue";
    import {ZyConfirm, ZyNotification} from "libs/util.toast";
    import {permissionsCreate, permissionsUpdate} from "api/modules/api.permissions";

    const labelCol = {
        style: {
            width: '100px',
        },
    }
    const wrapperCol = {
        span: 14,
    }

    const state = reactive({
        form: {
            auth: false,
          autoSon: false,
        }
    });

    const props = defineProps({
        updateData: {
            type: Object,
            default: () => {
            }
        }
    })
    const emit = defineEmits(['close'])
    const formRef = ref();
    const isAdd = ref(!props.updateData) // 是否是添加
    if (!isAdd.value) {
        state.form = props.updateData || {}
    }

    const onSubmit = async () => {
        try {
            const values = await formRef.value.validateFields();
            if (!isAdd.value) {
                delete state.form.password
            }
            let FUC = isAdd.value ? permissionsCreate : permissionsUpdate
            FUC(toRaw(state.form)).then(res => {
                ZyNotification.success('操作成功')
                emit('close', true)
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
