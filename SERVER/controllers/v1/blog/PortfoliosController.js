const mongoose = require('mongoose')
const {body, validationResult} = require('express-validator');
const {PortfoliosModel} = require('@models/v1')
const tokenAuthentication = require('@middlewares/tokenAuthentication')
const apiResponse = require('@utils/utils.apiResponse')
const {checkApiPermission} = require("@middlewares/authMiddleware");
const {actionRecords} = require("@middlewares/actionLogMiddleware");
/**
 * 权限：
 * 'blog:portfolios:list'
 * 'blog:portfolios:create'
 * 'blog:portfolios:update'
 * 'blog:portfolios:delete'
 */

/**
 * 获取作品集列表
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
 * @returns {Object} - 包含作品集列表及分页信息的响应对象
 */
exports.portfolioslist = [
    tokenAuthentication,
    checkApiPermission('blog:portfolios:list'),
    // actionRecords({module: '作品集/查询'}),
    async (req, res, next) => {
        try {
            let query = req.body;
            // 如果 query.params 为空，则设置一个空对象作为默认值
            let params = query.params || {};
            let current = Number(query.pagination?.current || 1) || 1;
            let pageSize = Number(query.pagination?.pageSize || 15) || 15;
            // 修改排序参数
            let sortColumn = query.sort?.columnKey || 'createdAt'; // 默认排序字段为 'id'
            let sortOrder = query.sort?.order === 'ascend' ? 1 : -1; // 根据排序顺序确定排序方式 1 升序 -1降序（descend：大-小）
            // 对 params 的每个属性值进行模糊匹配
            let fuzzyParams = {};
            for (let key in params) {
                if (params.hasOwnProperty(key)) {
                    if (params[key]) {
                        fuzzyParams[key] = {$regex: new RegExp(params[key], 'i')};
                    } else {
                        delete fuzzyParams[key]; //删除空属性
                    }
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
                PortfoliosModel.aggregate(aggregationPipeline),
                // 计算满足查询条件的文档总数
                PortfoliosModel.countDocuments(query.params)
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
 * 创建作品集
 * @param {Object} req - 请求对象，包含查询参数
 *    - params: 包含当前页码、页面大小和查询参数
 * @returns {object} 200 - 成功响应
 * @returns {object} 400 - 参数验证错误
 * @returns {Error} default - 未知错误
 * @security JWT - 需要提供有效的访问令牌
 */
exports.portfoliosCreate = [
    tokenAuthentication,
    checkApiPermission('blog:portfolios:create'),
    actionRecords({module: '作品集/创建'}),
    [
        body("title").notEmpty().withMessage('作品名称不能为空.'),
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }
            const newPortfolios = {
                ...req.body
            };
            await PortfoliosModel.create(newPortfolios);
            return apiResponse.successResponseWithData(res, "添加作品集成功.", newPortfolios);
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 删除作品集
 * @group 作品集管理 - 作品集相关
 * @param {Object} req - 请求对象，包含查询参数
 *    - params: 包含当前页码、页面大小和查询参数
 *      - _id: 作品集ID (string)
 * @returns {object} 200 - 成功响应
 * @returns {object} 400 - 参数验证错误
 * @returns {Error} default - 未知错误
 * @security JWT - 需要提供有效的访问令牌
 */
exports.portfoliosDelete = [
    tokenAuthentication,
    checkApiPermission('blog:portfolios:delete'),
    actionRecords({module: '作品集/删除'}),
    async (req, res, next) => {
        const {_id} = req.body;
        // 验证给定的id是否符合有效的 ObjectId 格式
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return apiResponse.validationErrorWithData(res, "参数错误.", "参数id格式错误");
        }
        try {
            const portfolios = await PortfoliosModel.findByIdAndDelete(_id);
            if (!portfolios) {
                return apiResponse.notFoundResponse(res, '该作品集不存在或已被删除');
            }
            return apiResponse.successResponse(res, '删除作品集成功');
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 更新作品集信息
 * @param {string} _id.body.required - 作品集ID
 */
exports.portfoliosUpdate = [
    tokenAuthentication,
    checkApiPermission('blog:portfolios:update'),
    actionRecords({module: '作品集/更新'}),
    async (req, res, next) => {
        const {_id} = req.body;
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return apiResponse.validationErrorWithData(res, "参数错误.", "无效的作品集 ID");
        }
        try {
            const portfoliosInfo = await PortfoliosModel.findById(_id);
            if (!portfoliosInfo) {
                return apiResponse.notFoundResponse(res, "该作品集不存在");
            }
            // 更新作品集数据.
            const updateData = {...req.body};

            // 使用 { new: true } 选项使 findByIdAndUpdate 返回更新后的作品集对象。
            const updatedPortfolios = await PortfoliosModel.findByIdAndUpdate(_id, updateData, {new: true});
            if (!updatedPortfolios) {
                return apiResponse.ErrorResponse(res, "作品集更新失败");
            }

            return apiResponse.successResponse(res, "作品集更新成功.");
        } catch (err) {
            next(err);
        }
    }
];



exports.portfoliosClientlist=[
    actionRecords({module: '前台/作品集'}),
    async (req, res, next) => {
        try {
            let query = req.body;
            // 如果 query.params 为空，则设置一个空对象作为默认值
            let params = query.params || {};
            let current = Number(query.pagination?.current || 1) || 1;
            let pageSize = Number(query.pagination?.pageSize || 15) || 15;
            // 修改排序参数
            let sortColumn = query.sort?.columnKey || 'createdAt'; // 默认排序字段为 'id'
            let sortOrder = query.sort?.order === 'ascend' ? 1 : -1; // 根据排序顺序确定排序方式 1 升序 -1降序（descend：大-小）
            // 对 params 的每个属性值进行模糊匹配
             let fuzzyParams = {};
            for (let key in params) {
                if (params.hasOwnProperty(key)) {
                    if (params[key]) {
                        fuzzyParams[key] = {$regex: new RegExp(params[key], 'i')};
                    } else {
                        delete fuzzyParams[key]; //删除空属性
                    }
                }
            }

            let aggregationPipeline = [
                // 使用提供的查询参数进行文档筛选
                {$match: fuzzyParams},
                {$sort: {[sortColumn]: sortOrder}},
                {$skip: (current - 1) * pageSize},
                {$limit: pageSize}
            ];

            // 添加筛选条件
            params.recommended && (fuzzyParams.recommended = params.recommended);
            fuzzyParams.status = true;

            let [result, total] = await Promise.all([
                // 执行聚合查询获取结果数据
                PortfoliosModel.aggregate(aggregationPipeline),
                // 计算满足查询条件的文档总数
                PortfoliosModel.countDocuments(query.params)
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
