const mongoose = require('mongoose')
const {body, validationResult} = require('express-validator');
const {Blog_articlesModel} = require('@models/v1')
const tokenAuthentication = require('@middlewares/tokenAuthentication')
const apiResponse = require('@utils/utils.apiResponse')
const {getPublicIP} = require('@utils/utils.others')
const {checkApiPermission} = require("@middlewares/authMiddleware");
const {actionRecords} = require("@middlewares/actionLogMiddleware");
const {uploadMiddleware} = require("@middlewares/uploadMiddleware");
const {findFile} = require('@utils/utils.files')
const fs = require('fs')
const path = require('path')
const marked = require('marked');

/**
 * 权限：
 * 'blog:blog_articles:list'
 * 'blog:blog_articles:create'
 * 'blog:blog_articles:update'
 * 'blog:blog_articles:delete'
 */

/**
 * 获取博文管理列表
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
 * @returns {Object} - 包含博文管理列表及分页信息的响应对象
 */
exports.blog_articleslist = [
    tokenAuthentication,
    checkApiPermission('blog:blog_articles:list'),
    // actionRecords({module: '博文管理/查询'}),
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
                {
                    $lookup: {
                        from: 'users', // 用户表的名称
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {$sort: {[sortColumn]: sortOrder}},
                {$skip: (current - 1) * pageSize},
                {$limit: pageSize}
            ];

            // 添加筛选条件
            // 判断 params.status 是否为 true 或 false，设置 fuzzyParams.status
            if (params.hasOwnProperty('status') && (params.status === true || params.status === false)) {
                fuzzyParams.status = params.status;
            }
            // 判断 params.isReship 是否为 true 或 false，设置 fuzzyParams.isReship
            if (params.hasOwnProperty('isReship') && (params.isReship === true || params.isReship === false)) {
                fuzzyParams.isReship = params.isReship;
            }

            // 判断 params.recommended 是否为 true 或 false，设置 fuzzyParams.recommended
            if (params.hasOwnProperty('recommended') && (params.recommended === true || params.recommended === false)) {
                fuzzyParams.recommended = params.recommended;
            }
            let [result, total] = await Promise.all([
                // 执行聚合查询获取结果数据
                Blog_articlesModel.aggregate(aggregationPipeline),
                // 计算满足查询条件的文档总数
                Blog_articlesModel.countDocuments(query.params)
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
 * 创建博文管理
 * @param {Object} req - 请求对象，包含查询参数
 *    - params: 包含当前页码、页面大小和查询参数
 * @returns {object} 200 - 成功响应
 * @returns {object} 400 - 参数验证错误
 * @returns {Error} default - 未知错误
 * @security JWT - 需要提供有效的访问令牌
 */
exports.blog_articlesCreate = [
    tokenAuthentication,
    checkApiPermission('blog:blog_articles:create'),
    actionRecords({module: '博文管理/创建'}),
    [
        body("title").notEmpty().withMessage('博文名称不能为空.'),
        body("content").notEmpty().withMessage('博文内容不能为空.'),
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }
            const newBlog_articles = {
                ...req.body
            };
            newBlog_articles.userId = req.userId
            await Blog_articlesModel.create(newBlog_articles);
            return apiResponse.successResponseWithData(res, "添加博文管理成功.", newBlog_articles);
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 上传md文件
 * @param {Object} req - 请求对象，包含查询参数
 *    - params: 包含当前页码、页面大小和查询参数
 * @returns {object} 200 - 成功响应
 * @returns {object} 400 - 参数验证错误
 * @returns {Error} default - 未知错误
 * @security JWT - 需要提供有效的访问令牌
 */
exports.blog_articlesUploadMd = [
    tokenAuthentication,
    uploadMiddleware('uploads/'),
    async (req, res) => {
        try {
            if (!req.file) return apiResponse.ErrorResponse(res, '没有上传文件');
            // 获取上传的文件信息
            const file = req.file;
            const filename = file.filename;
            const filePath = path.join(process.cwd(), 'uploads/files', filename); // 假设文件存储在 uploads 文件夹下
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    // 文件读取失败
                    console.error(err);
                    return apiResponse.ErrorResponse(res, '文件不存在');
                }
                let fileData = data


                // 提取图片地址
                const imgSrcRegex = /<img[^>]+src="([^">]+)"/g;
                const imgSrcMatches = fileData.match(imgSrcRegex);
                const imageUrls = imgSrcMatches ? imgSrcMatches.map(match => match.match(/src="([^">]+)"/)[1]) : [];

                // 提取部分文字作为摘要
                const excerptLength = 150; // 摘要长度
                const cleanedFileData = marked.parse(fileData).replace(/<\/?[^>]+(>|$)/g, '').replace(/\n/g, '').replace(/\\"/g, ''); // 移除 HTML 标签
                const plainTextExcerpt = cleanedFileData.slice(0, excerptLength);
                // 删除该文件
                fs.unlink(filePath, err => {
                    if (err) {
                        console.error(err);
                        return apiResponse.ErrorResponse(res, '文件删除失败');
                    }
                    // 返回成功响应
                    return apiResponse.successResponseWithData(res, '解析成功', {
                        filename,
                        fileData,
                        imageUrls,
                        plainTextExcerpt
                    });
                });
            });

        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
];

/**
 * 删除博文管理
 * @group 博文管理管理 - 博文管理相关
 * @param {Object} req - 请求对象，包含查询参数
 *    - params: 包含当前页码、页面大小和查询参数
 *      - _id: 博文管理ID (string)
 * @returns {object} 200 - 成功响应
 * @returns {object} 400 - 参数验证错误
 * @returns {Error} default - 未知错误
 * @security JWT - 需要提供有效的访问令牌
 */
exports.blog_articlesDelete = [
    tokenAuthentication,
    checkApiPermission('blog:blog_articles:delete'),
    actionRecords({module: '博文管理/删除'}),
    async (req, res, next) => {
        const {_id} = req.body;
        // 验证给定的id是否符合有效的 ObjectId 格式
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return apiResponse.validationErrorWithData(res, "参数错误.", "参数id格式错误");
        }
        try {
            const blog_articles = await Blog_articlesModel.findByIdAndDelete(_id);
            if (!blog_articles) {
                return apiResponse.notFoundResponse(res, '该博文管理不存在或已被删除');
            }
            return apiResponse.successResponse(res, '删除博文管理成功');
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 更新博文管理信息
 * @param {string} _id.body.required - 博文管理ID
 */
exports.blog_articlesUpdate = [
    tokenAuthentication,
    checkApiPermission('blog:blog_articles:update'),
    actionRecords({module: '博文管理/更新'}),
    async (req, res, next) => {
        const {_id} = req.body;
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return apiResponse.validationErrorWithData(res, "参数错误.", "无效的博文管理 ID");
        }
        try {
            const blog_articlesInfo = await Blog_articlesModel.findById(_id);
            if (!blog_articlesInfo) {
                return apiResponse.notFoundResponse(res, "该博文管理不存在");
            }
            // 更新博文管理数据.
            const updateData = {...req.body};

            // 使用 { new: true } 选项使 findByIdAndUpdate 返回更新后的博文管理对象。
            const updatedBlog_articles = await Blog_articlesModel.findByIdAndUpdate(_id, updateData, {new: true});
            if (!updatedBlog_articles) {
                return apiResponse.ErrorResponse(res, "博文管理更新失败");
            }

            return apiResponse.successResponse(res, "博文管理更新成功.");
        } catch (err) {
            next(err);
        }
    }
];


/**
 * 前台获取博文管理列表
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
 * @returns {Object} - 包含博文管理列表及分页信息的响应对象
 */
exports.client_blog_articleslist = [
    actionRecords({module: '前台/博文列表/查询'}),
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
                {
                    $lookup: {
                        from: 'users', // 用户表的名称
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                // 添加对点赞数和浏览量的排序
                {$sort: {[sortColumn]: sortOrder, likeNum: sortOrder, viewNum: sortOrder}},
                {$skip: (current - 1) * pageSize},
                {$limit: pageSize}
            ];
            // 添加筛选条件
            // 判断 params.recommended 是否为 true 或 false，设置 fuzzyParams.recommended
            if (params.hasOwnProperty('recommended') && (params.recommended === true || params.recommended === false)) {
                fuzzyParams.recommended = params.recommended;
            }

            fuzzyParams.status = true;

            let [result, total] = await Promise.all([
                // 执行聚合查询获取结果数据
                Blog_articlesModel.aggregate(aggregationPipeline),
                // 计算满足查询条件的文档总数
                Blog_articlesModel.countDocuments(params)
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
 * 前台获取博文相关列表
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
 * @returns {Object} - 包含博文管理列表及分页信息的响应对象
 */
exports.client_blog_articlesRelate = [
    async (req, res, next) => {
        try {
            let {_id} = req.body;
            let current = 1;
            let pageSize = 15;
            // 修改排序参数
            let sortColumn = 'createdAt'; // 默认排序字段为 'id'
            let sortOrder = 1; // 根据排序顺序确定排序方式 1 升序 -1降序（descend：大-小）
            const postSelf = await Blog_articlesModel.findById(_id)
            let aggregationPipeline = [
                // 使用提供的查询参数进行文档筛选
                {
                    $match: {
                        $and: [
                            {category: {$regex: new RegExp(postSelf.category, 'i')}},
                            {_id: {$ne: postSelf._id}} // 排除 _id 等于 postSelf._id 的文档
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'users', // 用户表的名称
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $project: {
                        _id: 1, // 返回 _id 字段
                        title: 1 // 返回 title 字段
                        // 添加其他需要返回的字段，如果不需要返回其他字段，可以省略
                    }
                },
                {$sort: {[sortColumn]: sortOrder}},
                {$skip: (current - 1) * pageSize},
                {$limit: pageSize}
            ];

            let result = await Blog_articlesModel.aggregate(aggregationPipeline)

            return apiResponse.successResponseWithData(res, "Success.", result.length > 0 ? result : null);
        } catch (err) {
            next(err);
        }
    }
]


/**
 * 前台获取博文详情
 * @param {Object} req - 请求对象，包含查询参数
 * @param {Object} res - 响应对象
 * @returns {Object} - 包含博文详情
 */
exports.client_blog_articlesDetail = [
    actionRecords({module: '前台/博文列表/详情'}),
    async (req, res, next) => {
        try {
            const {_id} = req.body;
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                return apiResponse.validationErrorWithData(res, "参数错误.", "无效的博文 ID");
            }
            try {
                const blog_articlesInfo = await Blog_articlesModel.findById(_id)
                    .select('-likeToken');
                if (!blog_articlesInfo) {
                    return apiResponse.notFoundResponse(res, "该博文不存在");
                }

                // 更新浏览次数并保存回数据库
                blog_articlesInfo.viewNum = (blog_articlesInfo.viewNum || 0) + 1;
                await blog_articlesInfo.save();

                return apiResponse.successResponseWithData(res, "博文详情查询成功.", blog_articlesInfo);
            } catch (err) {
                next(err);
            }
        } catch (err) {
            next(err);
        }
    }
]


/**
 * 前台博文点赞
 * @param {Object} req - 请求对象，包含查询参数
 * @param {Object} res - 响应对象
 * @returns {Object} - 包含博文详情
 */
exports.client_blog_articlesLike = [
    actionRecords({module: '前台/博文列表/点赞'}),
    async (req, res, next) => {
        try {
            const {_id} = req.body;
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                return apiResponse.validationErrorWithData(res, "参数错误.", "无效的博文 ID");
            }
            try {
                const blog_articlesInfo = await Blog_articlesModel.findById(_id);
                if (!blog_articlesInfo) {
                    return apiResponse.notFoundResponse(res, "该博文不存在");
                }


                // 检查请求中是否包含 temptoken
                const {temptoken} = req.headers;

                if (!temptoken) {
                    // 生成临时 Token
                    const temptoken = getPublicIP(req);
                    // 将临时 Token 保存到博文详情中，用于标识该博文已经被点赞
                    blog_articlesInfo.likeToken = temptoken;
                    await blog_articlesInfo.save();
                    return apiResponse.successResponseWithData(res, "点赞成功.", {token: temptoken});
                }

                // 检查博文详情中是否包含 temptoken，避免重复点赞
                if (blog_articlesInfo.likeToken.includes(temptoken)) {
                    return apiResponse.validationErrorWithData(res, "您已经点赞过该博文.", "");
                }

                // 更新浏览次数并保存回数据库
                blog_articlesInfo.likeNum = (blog_articlesInfo.likeNum || 0) + 1;
                await blog_articlesInfo.save();

                return apiResponse.successResponse(res, "点赞成功.");
            } catch (err) {
                next(err);
            }
        } catch (err) {
            next(err);
        }
    }
]


