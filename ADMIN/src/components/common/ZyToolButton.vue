<template>
    <a-space>
        <a-button size="small" @click="()=>{emit('view')}" v-if="showView" v-permission="viewAuth">{{viewText}}
        </a-button>
        <a-button type="primary" size="small" @click="()=>{emit('edit')}" v-if="showEdit" v-permission="editAuth">
            {{editText}}
        </a-button>
        <a-button type="primary" danger size="small" @click="()=>{emit('delete')}" v-if="showDelete"
                  v-permission="deleteAuth">{{deleteText}}
        </a-button>
        <slot></slot>
    </a-space>
</template>

<script setup>
    const props = defineProps({
        showView: {
            type: Boolean,
            default: true,
        },
        showEdit: {
            type: Boolean,
            default: true,
        },
        showDelete: {
            type: Boolean,
            default: true,
        },
        viewText: {
            type: String,
            default: '查看',
        },
        editText: {
            type: String,
            default: '编辑',
        },
        deleteText: {
            type: String,
            default: '删除',
        },
        // 权限指令值 字符串数组
        viewAuth: {
            type: String,
            default: '', // 'sys'
        },
        editAuth: {
            type: String,
            default: '',
        },
        deleteAuth: {
            type: String,
            default: '',
        },

    })
    const emit = defineEmits(['view', 'edit', 'delete'])

</script>

<style scoped>

</style>
