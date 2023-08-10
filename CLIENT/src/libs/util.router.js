import router from '../router'; // Assuming you have already imported and configured your router in 'router.js'


/**
 * 导航到特定页面。
 * @param {string} path - 目标页面的路由名称。
 * @param {object} query - 查询参数（可选）。
 * @param {Function} onComplete - 导航成功完成时要调用的函数（可选）。
 * @param {Function} onAbort - 导航中止时要调用的函数（可选）。
 */
export const goToPage = (path,query = {}, onComplete, onAbort) => {
    router.push({
        path,
        query,
    }, onComplete, onAbort);
};
