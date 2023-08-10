<template>
    <section>
        <ZYSearchForm
                :formValue="formState"
                :rules="searchFormRules"
                @submit="handleQuery"
                @reset="handleReset"
        >
            <a-form-item name="name">
                <a-input v-model:value="formState.name" allowClear placeholder="请输入名称" autocomplete="off"/>
            </a-form-item>
        </ZYSearchForm>
        <a-alert message="点击图标复制代码" type="info" show-icon/>
        <section class="icon-list">
            <div class="icon-item" v-for="(item,index) in data" :key="index">
                <a-dropdown>
                    <div>
                        <a-button shape="circle">
                            <template #icon>
                                <IconFont :type="`icon-${item.font_class}`" style="font-size: 20px"/>
                            </template>

                        </a-button>
                        <span style="margin-left: 8px">{{item.name}}</span>
                    </div>

                    <template #overlay>
                        <a-menu @click="copyToClipboard">
                            <a-menu-item :key="{id:1,item}">
                                复制类名: {{item.font_class}}
                            </a-menu-item>
                            <a-menu-item :key="{id:2,item}">
                                复制组件
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
                <!--                <a-tooltip>-->
                <!--                    <template #title>{{item.name}}</template>-->
                <!--                    <a-button shape="circle" >-->
                <!--                        <template #icon>-->
                <!--                            <IconFont :type="`icon-${item.font_class}`"/>-->
                <!--                        </template>-->
                <!--                    </a-button>-->
                <!--                    {{item.font_class}}-->
                <!--                </a-tooltip>-->
            </div>
        </section>
    </section>
</template>

<script setup>
    import {reactive, ref} from 'vue'
    import {message} from 'ant-design-vue';
    import ZYSearchForm from "comps/common/ZySearchForm.vue";
    import iconData from "./data/iconfont.json";

    const data = ref(iconData.glyphs)

    // 查询参数
    const formState = reactive({
        name: '',
    });
    // 查询表单校验规则
    const searchFormRules = {
        name: [{required: true, message: '请输入名称', trigger: 'blur'},],
    }
    // 查询
    const handleQuery = () => {
        data.value = iconData.glyphs.filter(ele => {
            return ele.name.includes(formState.name)
        })
    }
    // 重置查询条件
    const handleReset = () => {
        data.value = iconData.glyphs
    }

    const copyToClipboard = ({key}) => {
        let {id,item} = key
        const textarea = document.createElement('textarea');
        textarea.value =id===1?item.font_class: `<IconFont type="icon-${item.font_class}"/>`;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        message.success(id===1?'复制成功: '+item.font_class: `复制成功: <IconFont type="icon-${item.font_class}"/>`);
    }


</script>

<style lang="scss" scoped>
    .icon-list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        box-sizing: border-box;
        margin: 20px 10px;

        .icon-item {
            flex: 0 0 20%;
            padding-bottom: 20px;
            font-size: .8rem;
            cursor: pointer;
            transition: all .2s linear;

            &:hover {
                color: $color-primary;
            }
        }

    }
</style>
