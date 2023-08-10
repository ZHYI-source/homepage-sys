import {unref} from 'vue';
import {useRouter} from 'vue-router';



/**
 * @description: 重新加载当前页面
 * @param {Object} _router - 可选的路由实例，如果未提供，则使用默认的useRouter()
 * @returns {Object} - 包含redo函数的对象
 */
export function useRedo(_router) {
    const {replace, currentRoute} = _router || useRouter();
    const {query, params = {}, name, fullPath} = unref(currentRoute.value);

    /**
     * @description: 执行重新加载当前页面的操作
     * @returns {Promise<boolean>} - 一个Promise，表示重新加载操作是否成功
     */
    const REDIRECT_NAME = 'Redirect'

    function redo() {
        return new Promise((resolve) => {
            if (name === REDIRECT_NAME) {
                // 如果当前路由名称为重定向名称，表示已经处于重定向状态，无需再次执行重定向
                resolve(false);
                return;
            }
            if (name && Object.keys(params).length > 0) {
                // 如果存在路由名称并且params参数非空，则将params参数序列化为字符串并保存到'_origin_params'字段中
                params['_origin_params'] = JSON.stringify(params ?? {});
            }

            params['path'] = fullPath;
            // 执行重定向操作，将路由名称设置为重定向名称，并传递params和query参数
            replace({name: REDIRECT_NAME, params, query}).then(() => resolve(true));

        });
    }

    return {redo};
}

