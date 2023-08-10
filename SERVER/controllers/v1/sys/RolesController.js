const mongoose = require('mongoose')
const {body, validationResult} = require('express-validator');
const {RolesModel} = require('@models/v1')
const tokenAuthentication = require('@middlewares/tokenAuthentication')
const {checkApiPermission} = require('@middlewares/authMiddleware')
const apiResponse = require('@utils/utils.apiResponse')
const {actionRecords} = require("@middlewares/actionLogMiddleware");

/**
 * 获取角色列表
 * @param {Object} req - 请求对象，包含查询参数
 *  -query: {
            params: {}, 查询参数 (object)
            pagination: {
                current: 1, 当前页码 (number)
                pageSize: 10,页面大小 (number)
            },
            sort: {
                columnKey: "createdAt",
                order: "ascend"
            }
        },
 *
 *
 * @param {Object} res - 响应对象
 * @returns {Object} - 包含角色列表及分页信息的响应对象
 */
exports.roleslist = [
    tokenAuthentication,
    checkApiPermission('sys:roles:list'),
    // actionRecords({module:'系统管理/角色管理/查询'}),
    async (req, res, next) => {
        try {
            let query = req.body;
            // 如果 query.params 为空，则设置一个空对象作为默认值
            let params = query.params || {};
            let current = Number(query.pagination?.current || 1) || 1;
            let pageSize = Number(query.pagination?.pageSize || 15) || 15;
            // 修改排序参数
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
                {$skip: (current - 1) * pageSize},
                {$limit: pageSize}
            ];

            let [result, total] = await Promise.all([
                // 执行聚合查询获取结果数据
                RolesModel.aggregate(aggregationPipeline),
                // 计算满足查询条件的文档总数
                RolesModel.countDocuments(query.params)
            ]);

            return apiResponse.successResponseWithData(res, "Success.", result.length > 0 ? {
                result,
                current,
                pageSize,
                total
            } : {result: [], total});
        } catch (err) {
            next(err); // 将错误传递给下一个中间件（全局错误处理中间件）
            // return apiResponse.ErrorResponse(res, err);
        }
    }
]

/**
 * 创建角色
 * @param {Object} req - 请求对象，包含查询参数
 *    - params: 包含当前页码、页面大小和查询参数
 * @returns {object} 200 - 成功响应
 * @returns {object} 400 - 参数验证错误
 * @returns {Error} default - 未知错误
 * @security JWT - 需要提供有效的访问令牌
 */
exports.rolesCreate = [
    tokenAuthentication,
    checkApiPermission('sys:roles:create'),
    actionRecords({module:'系统管理/角色管理/新增'}),
    [
        body("roleName").notEmpty().withMessage('角色名称不能为空.'),
        body("roleAuth").notEmpty().withMessage('角色标识不能为空.'),
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }
            const hasRole = await RolesModel.findOne({roleAuth: req.body.roleAuth})

            if (hasRole) return apiResponse.unauthorizedResponse(res, "添加失败,角色标识已存在.");

            const newRoles = {
                ...req.body
            };
            await RolesModel.create(newRoles);
            return apiResponse.successResponseWithData(res, "添加角色成功.", newRoles);
        } catch (err) {
            next(err); // 将错误传递给下一个中间件（全局错误处理中间件）
        }
    }
];

/**
 * 删除角色
 * @group 角色管理 - 角色相关
 * @param {Object} req - 请求对象，包含查询参数
 *    - params: 包含当前页码、页面大小和查询参数
 *      - _id: 角色ID (string)
 * @returns {object} 200 - 成功响应
 * @returns {object} 400 - 参数验证错误
 * @returns {Error} default - 未知错误
 * @security JWT - 需要提供有效的访问令牌
 */
exports.rolesDelete = [
    tokenAuthentication,
    checkApiPermission('sys:roles:delete'),
    actionRecords({module:'系统管理/角色管理/删除'}),
    async (req, res, next) => {
        try {
            const {_id} = req.body;
            // 验证给定的id是否符合有效的 ObjectId 格式
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                return apiResponse.validationErrorWithData(res, "参数错误.", "参数id格式错误");
            }
            const isAdmin = await RolesModel.findById(_id);
            if (isAdmin.roleAuth === 'SUPER-ADMIN') {
                return apiResponse.validationErrorWithData(res, '不能删除超级管理员角色');
            }
            if (isAdmin.roleAuth === 'VISITOR-ADMIN') {
                return apiResponse.validationErrorWithData(res, '不能删除访客管理员角色');
            }

            const roles = await RolesModel.findByIdAndDelete(_id);
            if (!roles) {
                return apiResponse.notFoundResponse(res, '该角色不存在或已被删除');
            }

            return apiResponse.successResponse(res, '删除角色成功');
        } catch (err) {
            next(err); // 将错误传递给下一个中间件（全局错误处理中间件）
        }
    }
];

/**
 * 更新角色信息
 * @param {string} id.body.required - 角色ID
 */
exports.rolesUpdate = [
    tokenAuthentication,
    checkApiPermission('sys:roles:update'),
    actionRecords({module:'系统管理/角色管理/更新'}),
    async (req, res, next) => {
        try {
            const {_id, roleAuth} = req.body;
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                return apiResponse.validationErrorWithData(res, "参数错误.", "无效的角色 ID");
            }

            const rolesInfo = await RolesModel.findById(_id);
            if (!rolesInfo) {
                return apiResponse.notFoundResponse(res, "该角色不存在");
            }
            if (rolesInfo.roleAuth === 'SUPER-ADMIN') {
                return apiResponse.validationErrorWithData(res, "不能修改超级管理员");
            }

            // 更新角色数据.
            const updateData = {...req.body};

            // 使用 { new: true } 选项使 findByIdAndUpdate 返回更新后的角色对象。
            const updatedRoles = await RolesModel.findByIdAndUpdate(_id, updateData, {new: true});
            if (!updatedRoles) {
                return apiResponse.ErrorResponse(res, "角色更新失败");
            }

            return apiResponse.successResponse(res, "角色更新成功.");
        } catch (err) {
            next(err); // 将错误传递给下一个中间件（全局错误处理中间件）
        }
    }
];


/**
 * 查找角色信息
 * @param {string} id.body.required - 角色ID
 */
exports.rolesFindOne = [
    tokenAuthentication,
    async (req, res, next) => {
        try {
            const {id} = req.body;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return apiResponse.validationErrorWithData(res, "无效的角色,请联系管理员.", "无效的角色 ID");
            }
            const rolesInfo = await RolesModel.findById(id);
            if (!rolesInfo) {
                return apiResponse.notFoundResponse(res, "该角色不存在");
            }
            return apiResponse.successResponseWithData(res, "查询成功.", rolesInfo);
        } catch (err) {
            next(err); // 将错误传递给下一个中间件（全局错误处理中间件）
        }
    }
];


