const mongoose = require('mongoose')
const {body, validationResult} = require('express-validator');
const {UsersModel} = require('@models/v1')
const tokenAuthentication = require('@middlewares/tokenAuthentication')
const apiResponse = require('@utils/utils.apiResponse')
const {encryption} = require("@utils/utils.others");
const {checkApiPermission} = require("@middlewares/authMiddleware");
const {actionRecords} = require("@middlewares/actionLogMiddleware");

/**
 * 获取管理员列表
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
 * @param {Object} res - 响应对象
 * @returns {Object} - 包含管理员列表及分页信息的响应对象
 */
exports.userslist = [
    tokenAuthentication,
    checkApiPermission('sys:users:list'),
    // actionRecords({module: '系统管理/用户管理/查询'}),
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

                // 添加关联查询角色表的阶段
                {
                    $lookup: {
                        from: 'roles', // 角色表的名称
                        localField: 'roleId',
                        foreignField: '_id',
                        as: 'role'
                    }
                },

                {$sort: {[sortColumn]: sortOrder}},
                {$skip: (current - 1) * pageSize},
                {$limit: pageSize}
            ];

            let [result, total] = await Promise.all([
                // 执行聚合查询获取结果数据
                UsersModel.aggregate(aggregationPipeline),
                // 计算满足查询条件的文档总数
                UsersModel.countDocuments(query.params)
            ]);

            return apiResponse.successResponseWithData(res, "Success.", result.length > 0 ? {
                result,
                current,
                pageSize,
                total
            } : {result: [], total});
        } catch (err) {
            next(err); // 将错误传递给下一个中间件（全局错误处理中间件）
        }
    }
]

/**
 * 创建管理员
 * @param {Object} req - 请求对象，包含查询参数
 *    - params: 包含当前页码、页面大小和查询参数
 * @returns {object} 200 - 成功响应
 * @returns {object} 400 - 参数验证错误
 * @returns {Error} default - 未知错误
 * @security JWT - 需要提供有效的访问令牌
 */
exports.usersCreate = [
    tokenAuthentication,
    checkApiPermission('sys:users:create'),
    actionRecords({module: '系统管理/用户管理/新增'}),
    [
        body("avatar").notEmpty().withMessage('用户头像不能为空.'),

        body("username").notEmpty().withMessage('用户名不能为空.'),

        body("nickname").notEmpty().withMessage('昵称不能为空.'),

        body("password").notEmpty().withMessage('密码不能为空.'),

        body("roleId").notEmpty().withMessage('角色不能为空.'),

    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }

            let hasUser = await UsersModel.findOne({username: req.body.username});
            if (hasUser) return apiResponse.ErrorResponse(res, `${req.body.username}已经存在,请更换其他用户名.`);
            const newUsers = {
                ...req.body
            };
            newUsers.password = await encryption(req.body.password)
            await UsersModel.create(newUsers);
            return apiResponse.successResponseWithData(res, "添加管理员成功.", newUsers);
        } catch (err) {
            next(err); // 将错误传递给下一个中间件（全局错误处理中间件）
        }
    }
];

/**
 * 删除管理员
 * @group 管理员管理 - 管理员相关
 * @param {Object} req - 请求对象，包含查询参数
 *    - params: 包含当前页码、页面大小和查询参数
 *      - id: 管理员ID (string)
 * @returns {object} 200 - 成功响应
 * @returns {object} 400 - 参数验证错误
 * @returns {Error} default - 未知错误
 * @security JWT - 需要提供有效的访问令牌
 */
exports.usersDelete = [
    tokenAuthentication,
    checkApiPermission('sys:users:delete'),
    actionRecords({module: '系统管理/用户管理/删除'}),
    async (req, res, next) => {
        const {_id} = req.body;
        // 验证给定的id是否符合有效的 ObjectId 格式
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return apiResponse.validationErrorWithData(res, "参数错误.", "参数id格式错误");
        }
        try {
            const users = await UsersModel.findById(_id);
            if (!users) {
                return apiResponse.notFoundResponse(res, '该管理员不存在或已被删除');
            }

            if (users.username === 'admin') {
                return apiResponse.notFoundResponse(res, '超级管理员不能删除');
            }
            await UsersModel.findByIdAndDelete(_id)

            return apiResponse.successResponse(res, '删除管理员成功');
        } catch (err) {
            next(err); // 将错误传递给下一个中间件（全局错误处理中间件）
        }
    }
];

/**
 * 更新管理员信息
 * @param {string} id.body.required - 管理员ID
 */
exports.usersUpdate = [
    tokenAuthentication,
    checkApiPermission('sys:users:update'),
    actionRecords({module: '系统管理/用户管理/更新'}),
    async (req, res, next) => {
        try {
            const {_id} = req.body;
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                return apiResponse.validationErrorWithData(res, "参数错误.", "无效的管理员 ID");
            }
            const usersInfo = await UsersModel.findById(_id);
            if (!usersInfo) {
                return apiResponse.notFoundResponse(res, "该管理员不存在");
            }
            // 更新管理员数据.
            const updateData = {...req.body};
            if (req.body.password) {
                updateData.password = await encryption(req.body.password)
            }
            // 使用 { new: true } 选项使 findByIdAndUpdate 返回更新后的管理员对象。
            const updatedUsers = await UsersModel.findByIdAndUpdate(_id, updateData, {new: true});

            if (!updatedUsers) {
                return apiResponse.ErrorResponse(res, "管理员更新失败");
            }

            return apiResponse.successResponse(res, "管理员更新成功.");
        } catch (err) {
            next(err); // 将错误传递给下一个中间件（全局错误处理中间件）
        }
    }
];


/**
 * 重置管理员密码
 * @param {string} id.body.required - 管理员ID
 */
exports.usersReset = [
    tokenAuthentication,
    checkApiPermission('sys:users:reset'),
    actionRecords({module: '系统管理/用户管理/重置密码'}),
    async (req, res, next) => {
        try {

            const {_id} = req.body;
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                return apiResponse.validationErrorWithData(res, "参数错误.", "无效的管理员 ID");
            }
            const usersInfo = await UsersModel.findById(_id);
            if (!usersInfo) {
                return apiResponse.notFoundResponse(res, "该管理员不存在");
            }
            // 更新管理员数据.
            const updateData = {password: req.body.password};
            if (req.body.newPassword) {
                updateData.password = await encryption(req.body.newPassword)
            }
            // 使用 { new: true } 选项使 findByIdAndUpdate 返回更新后的管理员对象。
            const updatedUsers = await UsersModel.findByIdAndUpdate(_id, updateData, {new: true});

            if (!updatedUsers) {
                return apiResponse.ErrorResponse(res, "管理员密码更新失败");
            }

            return apiResponse.successResponse(res, "管理员密码更新成功.");
        } catch (err) {
            next(err); // 将错误传递给下一个中间件（全局错误处理中间件）
        }
    }
];


/**
 * 获取管理员信息
 * @param {string} id.body.required - 管理员ID
 */
exports.usersFindOne = [
    tokenAuthentication,
    async (req, res, next) => {
        try {
            const {_id} = req.body;
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                return apiResponse.validationErrorWithData(res, "参数错误.", "无效的管理员 ID");
            }
            const usersInfo = await UsersModel.findById(_id);
            if (!usersInfo) {
                return apiResponse.notFoundResponse(res, "该管理员不存在");
            }
            return apiResponse.successResponseWithData(res, "成功.", usersInfo);
        } catch (err) {
            next(err); // 将错误传递给下一个中间件（全局错误处理中间件）
        }
    }
];
