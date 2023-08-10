const mongoose = require('mongoose')
const {body, validationResult} = require('express-validator');
const {PermissionsModel} = require('@models/v1')
const tokenAuthentication = require('@middlewares/tokenAuthentication')
const apiResponse = require('@utils/utils.apiResponse')
const {checkApiPermission} = require("@middlewares/authMiddleware");
const {actionRecords} = require("@middlewares/actionLogMiddleware");

// 验证权限标识默认有且仅有一个冒号 :
function hasSingleColon(str, num = 1) {
    const colonCount = (str.match(/:/g) || []).length;
    return colonCount === num;
}


/**
 * 获取权限管理列表
 * @param {Object} req - 请求对象，包含查询参数
 *  -query: {
 *   params: {}, 查询参数 (object)
 *       pagination: {
 *           current: 1, 当前页码 (number)
 *           pageSize: 10,页面大小 (number)
 *       },
 *       sort: {
 *           columnKey: "createdAt",
 *           order: "ascend"
 *        }
 *   },
 * @param {Object} res - 响应对象
 * @returns {Object} - 包含权限管理列表及分页信息的响应对象
 */
exports.permissionsTree = [
    tokenAuthentication,
    async (req, res, next) => {
        try {
            let query = req.body;
            // 如果 query.params 为空，则设置一个空对象作为默认值
            let params = query.params || {};
            let sortColumn = query.sort?.columnKey || 'sortOrder'; // 默认排序字段为 'id'
            let sortOrder = query.sort?.order === 'ascend' ? 1 : -1; // 根据排序顺序确定排序方式
            let aggregationPipeline = [
                // 使用提供的查询参数进行文档筛选
                {$match: params},
                {$sort: {[sortColumn]: sortOrder}},
            ];

            let [result, total] = await Promise.all([
                // 执行聚合查询获取结果数据
                PermissionsModel.aggregate(aggregationPipeline),
                // 计算满足查询条件的文档总数
                PermissionsModel.countDocuments(query.params)
            ]);
            // 将权限文档转换为树状结构
            const resultData = PermissionsModel.toTree(result);
            return apiResponse.successResponseWithData(res, "Success.", resultData.length > 0 ? {
                result: resultData,
            } : {result: []});
        } catch (err) {
            next(err); // 将错误传递给下一个中间件（全局错误处理中间件）
            // return apiResponse.ErrorResponse(res, err);
        }
    }
]

/**
 * 获取权限管理列表
 * @param {Object} req - 请求对象，包含查询参数
 *  -query: {
 *   params: {}, 查询参数 (object)
 *       pagination: {
 *           current: 1, 当前页码 (number)
 *           pageSize: 10,页面大小 (number)
 *       },
 *       sort: {
 *           columnKey: "createdAt",
 *           order: "ascend"
 *        }
 *   },
 * @param {Object} res - 响应对象
 * @returns {Object} - 包含权限管理列表及分页信息的响应对象
 */
exports.permissionslist = [
    tokenAuthentication,
    checkApiPermission('sys:permissions:list'),
    // actionRecords({module: '系统管理/权限管理/查询'}),
    async (req, res, next) => {
        try {
            let query = req.body;
            // 如果 query.params 为空，则设置一个空对象作为默认值
            let params = query.params || {};
            let sortColumn = query.sort?.columnKey || 'createdAt'; // 默认排序字段为 'id'
            let sortOrder = query.sort?.order === 'ascend' ? 1 : -1; // 根据排序顺序确定排序方式
            // 对 params 的每个属性值进行模糊匹配
            let fuzzyParams = {};
            for (let key in params) {
                if (params.hasOwnProperty(key)) {
                    fuzzyParams[key] = {$regex: new RegExp(params[key], 'i')};
                }
            }
            let aggregationPipeline = [
                // 使用提供的查询参数进行文档筛选
                {$match: fuzzyParams},
                {$sort: {[sortColumn]: sortOrder}},
            ];

            let [result, total] = await Promise.all([
                // 执行聚合查询获取结果数据
                PermissionsModel.aggregate(aggregationPipeline),
                // 计算满足查询条件的文档总数
                PermissionsModel.countDocuments(query.params)
            ]);
            // 将权限文档转换为树状结构
            const resultData = PermissionsModel.toTree(result);
            return apiResponse.successResponseWithData(res, "Success.", resultData.length > 0 ? {
                result: resultData,
            } : {result: []});
        } catch (err) {
            next(err); // 将错误传递给下一个中间件（全局错误处理中间件）
            // return apiResponse.ErrorResponse(res, err);
        }
    }
]

/**
 * 创建权限管理
 * @param {Object} req - 请求对象，包含查询参数
 *    - params: 包含当前页码、页面大小和查询参数
 * @returns {object} 200 - 成功响应
 * @returns {object} 400 - 参数验证错误
 * @returns {Error} default - 未知错误
 * @security JWT - 需要提供有效的访问令牌
 */
exports.permissionsCreate = [
    tokenAuthentication,
    checkApiPermission('sys:permissions:create'),
    actionRecords({module: '系统管理/权限管理/新增'}),
    [
        body("name").notEmpty().withMessage('权限名称不能为空.'),
        body("key").notEmpty().withMessage('权限标识不能为空.'),
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }
            const newPermissions = {
                ...req.body
            };
            // 有且禁用一个冒号：并且 允许自动生成子级别 autoSon=true
            if (hasSingleColon(newPermissions.key) && newPermissions.autoSon) {
                let data = [
                    {...req.body},
                    {name: '查询', key: newPermissions.key + ':list', parent_key: newPermissions.key, auth: true},
                    {name: '增加', key: newPermissions.key + ':create', parent_key: newPermissions.key, auth: true},
                    {name: '删除', key: newPermissions.key + ':delete', parent_key: newPermissions.key, auth: true},
                    {name: '更新', key: newPermissions.key + ':update', parent_key: newPermissions.key, auth: true}
                ]
                await PermissionsModel.insertMany(data)

            } else {
                await PermissionsModel.create(newPermissions);
            }
            return apiResponse.successResponseWithData(res, "添加权限成功.", newPermissions);
        } catch (err) {
            next(err); // 将错误传递给下一个中间件（全局错误处理中间件）
        }
    }
];

/**
 * 删除权限管理
 * @group 权限管理管理 - 权限管理相关
 * @param {Object} req - 请求对象，包含查询参数
 *    - params: 包含当前页码、页面大小和查询参数
 *      - _id: 权限管理ID (string)
 * @returns {object} 200 - 成功响应
 * @returns {object} 400 - 参数验证错误
 * @returns {Error} default - 未知错误
 * @security JWT - 需要提供有效的访问令牌
 */
exports.permissionsDelete = [
    tokenAuthentication,
    checkApiPermission('sys:permissions:delete'),
    actionRecords({module: '系统管理/权限管理/删除'}),
    async (req, res, next) => {
        const {_id, key} = req.body;
        // 验证给定的id是否符合有效的 ObjectId 格式
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return apiResponse.validationErrorWithData(res, "参数错误.", "参数id格式错误");
        }
        try {
            //有且仅有一个冒号
            if (hasSingleColon(key, 0) || hasSingleColon(key, 1)) {
                // 删除包含传入key内容的所有权限 传入 dev:codes  会将 dev:codes  dev:codes:*  全部删除掉
                await PermissionsModel.deleteMany({key: {$regex: `.*${key}.*`}});
                return apiResponse.successResponse(res, '删除权限成功');
            }
            const permissions = await PermissionsModel.findByIdAndDelete(_id);
            if (!permissions) {
                return apiResponse.notFoundResponse(res, '该权限不存在或已被删除');
            }
            return apiResponse.successResponse(res, '删除权限成功');
        } catch (err) {
            next(err); // 将错误传递给下一个中间件（全局错误处理中间件）
        }
    }
];

/**
 * 更新权限管理信息
 * @param {string} _id.body.required - 权限管理ID
 */
exports.permissionsUpdate = [
    tokenAuthentication,
    checkApiPermission('sys:permissions:update'),
    actionRecords({module: '系统管理/权限管理/更新'}),
    async (req, res, next) => {
        const {_id} = req.body;
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return apiResponse.validationErrorWithData(res, "参数错误.", "无效的权限管理 ID");
        }
        try {
            const permissionsInfo = await PermissionsModel.findById(_id);
            if (!permissionsInfo) {
                return apiResponse.notFoundResponse(res, "该权限管理不存在");
            }
            // 更新权限管理数据.
            const updateData = {...req.body};

            // 使用 { new: true } 选项使 findByIdAndUpdate 返回更新后的权限管理对象。
            const updatedPermissions = await PermissionsModel.findByIdAndUpdate(_id, updateData, {new: true});
            if (!updatedPermissions) {
                return apiResponse.ErrorResponse(res, "权限管理更新失败");
            }

            return apiResponse.successResponse(res, "权限管理更新成功.");
        } catch (err) {
            next(err); // 将错误传递给下一个中间件（全局错误处理中间件）
        }
    }
];
/**
 * 停用该权限
 * @param {string} _id.body.required - 权限管理ID
 */
exports.permissionsStop = [
    tokenAuthentication,
    checkApiPermission('sys:permissions:stop'),
    actionRecords({module: '系统管理/权限管理/停用权限'}),
    async (req, res, next) => {
        const {_id} = req.body;
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return apiResponse.validationErrorWithData(res, "参数错误.", "无效的权限管理 ID");
        }
        try {
            const permissionsInfo = await PermissionsModel.findById(_id);
            if (!permissionsInfo) {
                return apiResponse.notFoundResponse(res, "该条数据不存在");
            }
            permissionsInfo.status = !permissionsInfo.status
            permissionsInfo.disabled = !permissionsInfo.disabled
            await permissionsInfo.save()
            return apiResponse.successResponse(res, "权限管理更新成功.");
        } catch (err) {
            next(err); // 将错误传递给下一个中间件（全局错误处理中间件）
        }
    }
];
