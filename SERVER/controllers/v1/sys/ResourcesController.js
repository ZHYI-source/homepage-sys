const mongoose = require('mongoose')
const {body, validationResult} = require('express-validator');
const {ResourcesModel} = require('@models/v1')
const tokenAuthentication = require('@middlewares/tokenAuthentication')
const apiResponse = require('@utils/utils.apiResponse')
const {checkApiPermission} = require("@middlewares/authMiddleware");
const {actionRecords} = require("@middlewares/actionLogMiddleware");
/**
* 权限：
* 'sys:resources:list'
* 'sys:resources:create'
* 'sys:resources:update'
* 'sys:resources:delete'
*/

/**
* 获取资源管理列表
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
* @returns {Object} - 包含资源管理列表及分页信息的响应对象
*/
exports.resourceslist = [
    tokenAuthentication,
    checkApiPermission('sys:resources:list'),
    // actionRecords({module: '资源管理/查询'}),
    async (req, res, next) => {
    try {
        let query = req.body;
        // 如果 query.params 为空，则设置一个空对象作为默认值
        let params = query.params || {};
        let current = Number(query.pagination?.current || 1) || 1;
        let pageSize = Number(query.pagination?.pageSize||15) || 15;
        // 修改排序参数
        let sortColumn = query.sort?.columnKey || 'createdAt'; // 默认排序字段为 'id'
        let sortOrder = query.sort?.order === 'ascend' ? 1 : -1; // 根据排序顺序确定排序方式 1 升序 -1降序（descend：大-小）
        // 对 params 的每个属性值进行模糊匹配
        let fuzzyParams = {};
        for (let key in params) {
            if (params.hasOwnProperty(key)) {
                fuzzyParams[key] = { $regex: new RegExp(params[key], 'i') };
            }
        }

        let aggregationPipeline = [
            // 使用提供的查询参数进行文档筛选
            {$match: fuzzyParams},
            // 添加关联查询表的阶段
            {
                $lookup: {
                    from: 'users', // 角色表的名称
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },

            {$sort: {[sortColumn]: sortOrder}},
            {$skip: (current - 1) * pageSize},
            {$limit: pageSize}
        ];

        let [result, total] = await Promise.all([
            // 执行聚合查询获取结果数据
            ResourcesModel.aggregate(aggregationPipeline),
            // 计算满足查询条件的文档总数
            ResourcesModel.countDocuments(query.params)
        ]);

        return apiResponse.successResponseWithData(res, "Success.", result.length > 0 ? {
            result,
            current,
            pageSize,
            total
        } : {result: [], total});
    } catch (err) {
        next(err);
        }
    }
]

/**
* 创建资源管理
* @param {Object} req - 请求对象，包含查询参数
*    - params: 包含当前页码、页面大小和查询参数
* @returns {object} 200 - 成功响应
* @returns {object} 400 - 参数验证错误
* @returns {Error} default - 未知错误
* @security JWT - 需要提供有效的访问令牌
*/
exports.resourcesCreate = [
    tokenAuthentication,
    checkApiPermission('sys:resources:create'),
    actionRecords({module: '资源管理/创建'}),
    [
            body("srcName").notEmpty().withMessage('资源名称不能为空.'),
            body("srcType").notEmpty().withMessage('资源类型不能为空.'),
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }
            const newResources = {
                ...req.body
            };
            newResources.userId = req.userId

            await ResourcesModel.create(newResources);
            return apiResponse.successResponseWithData(res, "添加资源管理成功.", newResources);
        } catch (err) {
        next(err);
        }
    }
];

/**
* 删除资源管理
* @group 资源管理管理 - 资源管理相关
* @param {Object} req - 请求对象，包含查询参数
*    - params: 包含当前页码、页面大小和查询参数
*      - _id: 资源管理ID (string)
* @returns {object} 200 - 成功响应
* @returns {object} 400 - 参数验证错误
* @returns {Error} default - 未知错误
* @security JWT - 需要提供有效的访问令牌
*/
exports.resourcesDelete = [
    tokenAuthentication,
    checkApiPermission('sys:resources:delete'),
    actionRecords({module: '资源管理/删除'}),
    async (req, res, next) => {
        const {_id} = req.body;
        // 验证给定的id是否符合有效的 ObjectId 格式
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return apiResponse.validationErrorWithData(res, "参数错误.", "参数id格式错误");
        }
        try {
            const resources = await ResourcesModel.findByIdAndDelete(_id);
            if (!resources) {
                return apiResponse.notFoundResponse(res, '该资源管理不存在或已被删除');
            }
            return apiResponse.successResponse(res, '删除资源管理成功');
    } catch (err) {
        next(err);
    }
    }
];

/**
* 更新资源管理信息
* @param {string} _id.body.required - 资源管理ID
*/
exports.resourcesUpdate = [
    tokenAuthentication,
    checkApiPermission('sys:resources:update'),
    actionRecords({module: '资源管理/更新'}),
    async (req, res, next) => {
        const {_id} = req.body;
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return apiResponse.validationErrorWithData(res, "参数错误.", "无效的资源管理 ID");
        }
        try {
            const resourcesInfo = await ResourcesModel.findById(_id);
            if (!resourcesInfo) {
                return apiResponse.notFoundResponse(res, "该资源管理不存在");
            }
            // 更新资源管理数据.
            const updateData = {...req.body};

            // 使用 { new: true } 选项使 findByIdAndUpdate 返回更新后的资源管理对象。
            const updatedResources = await ResourcesModel.findByIdAndUpdate(_id, updateData, {new: true});
            if (!updatedResources) {
                return apiResponse.ErrorResponse(res, "资源管理更新失败");
            }

            return apiResponse.successResponse(res, "资源管理更新成功.");
        } catch (err) {
            next(err);
        }
    }
];
