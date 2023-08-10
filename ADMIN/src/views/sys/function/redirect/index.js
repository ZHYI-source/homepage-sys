import {defineComponent, unref} from 'vue';
import {useRouter} from 'vue-router';

export default defineComponent({
    name: 'Redirect',
    template: '<div></div>', // 添加一个空白的模板 防止告警
    setup() {
        const {currentRoute, replace} = useRouter();
        const {params, query} = unref(currentRoute);
        const {path} = params;
        const _path = Array.isArray(path) ? path.join('/') : path;
        // 执行重定向操作，将路由的路径和查询参数设置为新的路径和查询参数
        replace({
            path: _path,
            query,
        });
        return {};
    },
});
