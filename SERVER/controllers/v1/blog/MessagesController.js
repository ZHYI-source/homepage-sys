const mongoose = require('mongoose')
const {body, validationResult} = require('express-validator');
const {MessagesModel, UsersModel, ReplyModel} = require('@models/v1')
const tokenAuthentication = require('@middlewares/tokenAuthentication')
const apiResponse = require('@utils/utils.apiResponse')
const {checkApiPermission} = require("@middlewares/authMiddleware");
const {actionRecords} = require("@middlewares/actionLogMiddleware");
const {encryption, parseIP, getPublicIP, getEmailAvatar,} = require("@utils/utils.others");
const UAParser = require("ua-parser-js");


/**
 * 权限：
 * 'blog:messages:list'
 * 'blog:messages:create'
 * 'blog:messages:update'
 * 'blog:messages:delete'
 */

/**
 * 获取留言列表
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
 * @returns {Object} - 包含留言列表及分页信息的响应对象
 */
exports.messageslist = [
    tokenAuthentication,
    checkApiPermission('blog:messages:list'),
    // actionRecords({module: '留言/查询'}),
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
                        localField: 'user',
                        foreignField: '_id',
                        as: 'userInfo',
                    },
                },
                // 关联回复表获取留言的回复信息
                {
                    $lookup: {
                        from: 'replies',
                        let: {messageId: '$_id'},
                        pipeline: [
                            // 使用 $expr 来引用外部字段
                            {
                                $match: {
                                    $expr: {$eq: ['$message', '$$messageId']},
                                },
                            },
                            // 关联用户表获取回复的用户信息
                            {
                                $lookup: {
                                    from: 'users',
                                    localField: 'user',
                                    foreignField: '_id',
                                    as: 'userInfo',
                                },
                            },
                            {
                                $lookup: {
                                    from: 'users',
                                    localField: 'toUser',
                                    foreignField: '_id',
                                    as: 'toUserInfo',
                                },
                            },
                            {
                                $lookup: {
                                    from: 'messages',
                                    localField: 'message',
                                    foreignField: '_id',
                                    as: 'messageInfo',
                                },
                            },
                            // 对用户信息进行投影
                            {
                                $project: {
                                    'userInfo.password': 0,
                                    'toUserInfo.password': 0,
                                },
                            },
                        ],
                        as: 'repliesInfo',
                    },
                },
                // 对用户信息进行投影，选择要返回的自定义字段
                {
                    $project: {
                        'userInfo.password': 0,
                        'repliesInfo.toUserInfo.password': 0,
                        'repliesInfo.userInfo.password': 0,
                    },
                },
                {$sort: {[sortColumn]: sortOrder}},
                {$skip: (current - 1) * pageSize},
                {$limit: pageSize},
            ];

            let [result, total, repliesCount] = await Promise.all([
                // 执行聚合查询获取结果数据
                MessagesModel.aggregate(aggregationPipeline),
                // 计算满足查询条件的文档总数
                MessagesModel.countDocuments(query.params),
                ReplyModel.countDocuments(),
            ]);


            return apiResponse.successResponseWithData(res, "Success.", result.length > 0 ? {
                result,
                current,
                pageSize,
                total,
                repliesCount
            } : {result: [], total, repliesCount: total});
        } catch (err) {
            next(err);
        }
    }
]

/**
 * 创建留言
 * @param {Object} req - 请求对象，包含查询参数
 *    - params: 包含当前页码、页面大小和查询参数
 * @returns {object} 200 - 成功响应
 * @returns {object} 400 - 参数验证错误
 * @returns {Error} default - 未知错误
 * @security JWT - 需要提供有效的访问令牌
 */
exports.messagesCreate = [
    tokenAuthentication,
    checkApiPermission('blog:messages:create'),
    actionRecords({module: '留言/创建'}),
    [
        body("content").notEmpty().withMessage('留言内容不能为空.'),
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }
            const newMessages = {
                ...req.body,
                user: req.userId
            };
            await MessagesModel.create(newMessages);
            return apiResponse.successResponseWithData(res, "添加留言成功.", newMessages);
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 删除留言
 * @group 留言管理 - 留言相关
 * @param {Object} req - 请求对象，包含查询参数
 *    - params: 包含当前页码、页面大小和查询参数
 *      - _id: 留言ID (string)
 * @returns {object} 200 - 成功响应
 * @returns {object} 400 - 参数验证错误
 * @returns {Error} default - 未知错误
 * @security JWT - 需要提供有效的访问令牌
 */
exports.messagesDelete = [
    tokenAuthentication,
    checkApiPermission('blog:messages:delete'),
    actionRecords({module: '留言/删除'}),
    async (req, res, next) => {
        const {_id, pid} = req.body;
        // 验证给定的id是否符合有效的 ObjectId 格式
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return apiResponse.validationErrorWithData(res, "参数错误.", "参数id格式错误");
        }
        try {
            if (pid) {
                const replyMessages = await ReplyModel.findByIdAndDelete(_id);
                if (!replyMessages) {
                    return apiResponse.notFoundResponse(res, '该留言不存在或已被删除');
                }
            } else {
                // 首先删除关联的ReplyModel数据
                await ReplyModel.deleteMany({message: _id});
                // 删除与留言关联的ReplyModel数据成功后，再删除留言自身
                const messages = await MessagesModel.findByIdAndDelete(_id);
                if (!messages) {
                    return apiResponse.notFoundResponse(res, '该留言不存在或已被删除');
                }
            }
            return apiResponse.successResponse(res, '删除留言成功');
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 更新留言信息
 * @param {string} _id.body.required - 留言ID
 */
exports.messagesUpdate = [
    tokenAuthentication,
    checkApiPermission('blog:messages:update'),
    actionRecords({module: '留言/更新'}),
    async (req, res, next) => {
        const {_id, pid, content} = req.body;
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return apiResponse.validationErrorWithData(res, "参数错误.", "无效的留言 ID");
        }
        try {

            if (pid) {
                const replyInfo = await ReplyModel.findById(_id);
                if (!replyInfo) {
                    return apiResponse.notFoundResponse(res, "该留言不存在");
                }
                // 更新留言数据.
                const updateData = {content};
                // 使用 { new: true } 选项使 findByIdAndUpdate 返回更新后的留言对象。
                const updatedMessages = await ReplyModel.findByIdAndUpdate(_id, updateData, {new: true});
                if (!updatedMessages) {
                    return apiResponse.ErrorResponse(res, "留言更新失败");
                }
            } else {
                const messagesInfo = await MessagesModel.findById(_id);
                if (!messagesInfo) {
                    return apiResponse.notFoundResponse(res, "该留言不存在");
                }
                // 更新留言数据.
                const updateData = {...req.body};
                // 使用 { new: true } 选项使 findByIdAndUpdate 返回更新后的留言对象。
                const updatedMessages = await MessagesModel.findByIdAndUpdate(_id, updateData, {new: true});
                if (!updatedMessages) {
                    return apiResponse.ErrorResponse(res, "留言更新失败");
                }
            }


            return apiResponse.successResponse(res, "留言更新成功.");
        } catch (err) {
            next(err);
        }
    }
];


/*****************前台留言*********************/
/**
 * 前台获取留言列表
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
 * @returns {Object} - 包含留言列表及分页信息的响应对象
 */
exports.messagesClientlist = [
    actionRecords({module: '前台/留言列表'}),
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
                        localField: 'user',
                        foreignField: '_id',
                        as: 'userInfo',
                    },
                },
                // 关联回复表获取留言的回复信息
                {
                    $lookup: {
                        from: 'replies',
                        let: {messageId: '$_id'},
                        pipeline: [
                            // 使用 $expr 来引用外部字段
                            {
                                $match: {
                                    $expr: {$eq: ['$message', '$$messageId']},
                                },
                            },
                            // 关联用户表获取回复的用户信息
                            {
                                $lookup: {
                                    from: 'users',
                                    localField: 'user',
                                    foreignField: '_id',
                                    as: 'userInfo',
                                },
                            },
                            {
                                $lookup: {
                                    from: 'users',
                                    localField: 'toUser',
                                    foreignField: '_id',
                                    as: 'toUserInfo',
                                },
                            },
                            {
                                $lookup: {
                                    from: 'messages',
                                    localField: 'message',
                                    foreignField: '_id',
                                    as: 'messageInfo',
                                },
                            },
                            // 对用户信息进行投影
                            {
                                $project: {
                                    'userInfo.password': 0,
                                    'toUserInfo.password': 0,
                                },
                            },
                        ],
                        as: 'repliesInfo',
                    },
                },
                // 对用户信息进行投影，选择要返回的自定义字段
                {
                    $project: {
                        'userInfo.password': 0,
                        'userInfo.roleId': 0,
                        'userInfo.userIp': 0,
                        'userInfo.address': 0,
                        'repliesInfo.toUserInfo.password': 0,
                        'repliesInfo.toUserInfo.roleId': 0,
                        'repliesInfo.toUserInfo.userIp': 0,
                        'repliesInfo.toUserInfo.address': 0,
                        'repliesInfo.userInfo.address': 0,
                        'repliesInfo.userInfo.roleId': 0,
                        'repliesInfo.userInfo.userIp': 0,
                        'repliesInfo.userInfo.password': 0,
                    },
                },
                {$sort: {[sortColumn]: sortOrder}},
                {$skip: (current - 1) * pageSize},
                {$limit: pageSize},
            ];

            let [result, total, repliesCount] = await Promise.all([
                // 执行聚合查询获取结果数据
                MessagesModel.aggregate(aggregationPipeline),
                // 计算满足查询条件的文档总数
                MessagesModel.countDocuments(query.params),

                ReplyModel.countDocuments()
            ]);

            return apiResponse.successResponseWithData(res, "Success.", result.length > 0 ? {
                result,
                current,
                pageSize,
                total,
                repliesCount
            } : {result: [], total, repliesCount: total});
        } catch (err) {
            next(err);
        }
    }
]


/**
 * 创建留言
 * @param {Object} req - 请求对象，包含查询参数
 *    - params: 包含当前页码、页面大小和查询参数
 * @returns {object} 200 - 成功响应
 * @returns {object} 400 - 参数验证错误
 * @returns {Error} default - 未知错误
 * @security JWT - 需要提供有效的访问令牌
 */
exports.messagesClientCreate = [
    [body("content").notEmpty().withMessage('留言内容不能为空.')],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }

            // 从req.body中获取表单字段
            const {name, email, website, content} = req.body;

            // 查找是否存在该用户
            let user = await UsersModel.findOne({email: email, status: true});
            const clientIP = getPublicIP(req);
            //识别常见的浏览器、操作系统和设备等信息
            const u = new UAParser(req.headers['user-agent']);
            const address = await parseIP(clientIP);
            const equipment = u.getBrowser().name ? `${u.getBrowser().name}.v${u.getBrowser().major}` : '未知'

            // 如果用户不存在，则创建用户
            if (!user) {
                // 默认新建的用户名称是邮箱 密码是邮箱  角色是一般访客
                let password = await encryption(email)
                let avatar = await getEmailAvatar(email)
                user = await UsersModel.create({
                    type: 'user',//默认前台用户
                    nickname: name || '匿名',
                    avatar,
                    userIp: clientIP,
                    website,
                    address,
                    platform: equipment,
                    password,
                    email,
                    username: email,
                    roleId: '64a7aa20a971facd04696242',
                });
            } else {
                // 更新用户IP和地址
                user.userIp = clientIP;
                user.address = address
                user.website = website
                user.platform = equipment
                await user.save();
            }

            // 创建新的留言记录，并关联用户ID
            const newMessage = {
                content,
                user: user._id
            };
            await MessagesModel.create(newMessage);
            return apiResponse.successResponse(res, "添加留言成功.");
        } catch (err) {
            next(err);
        }
    }
];


/**
 * 回复留言
 * @param {Object} req - 请求对象，包含查询参数
 *    - params: 包含当前页码、页面大小和查询参数
 * @returns {object} 200 - 成功响应
 * @returns {object} 400 - 参数验证错误
 * @returns {Error} default - 未知错误
 * @security JWT - 需要提供有效的访问令牌
 */
exports.messagesClientReply = [
    actionRecords({module: '前台/留言回复'}),
    [body("content").notEmpty().withMessage('内容不能为空.')],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }

            // 从req.body中获取表单字段
            const {message, toUser, name, email, website, content} = req.body;

            // 查找是否存在该用户
            let user = await UsersModel.findOne({email: email, status: true});

            // 如果用户不存在，则创建用户
            if (!user) {
                const clientIP = getPublicIP(req);
                //识别常见的浏览器、操作系统和设备等信息
                const u = new UAParser(req.headers['user-agent']);
                const address = await parseIP(clientIP);
                const equipment = u.getBrowser().name ? `${u.getBrowser().name}.v${u.getBrowser().major}` : '未知'

                // 默认新建的用户名称是邮箱 密码是邮箱  角色是一般访客
                let password = await encryption(email)
                let avatar = await getEmailAvatar(email)
                user = await UsersModel.create({
                    type: 'user',//默认前台用户
                    nickname: name || '匿名',
                    avatar,
                    userIp: clientIP,
                    website,
                    address,
                    platform: equipment,
                    password,
                    email,
                    username: email,
                    roleId: '64a7aa20a971facd04696242',
                });
            }

            // 创建新的回复留言记录，并关联用户ID
            const newMessage = {
                content,
                message,
                toUser,
                user: user._id
            };
            await ReplyModel.create(newMessage);
            return apiResponse.successResponse(res, "回复成功.");
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 点赞留言
 * @param {Object} req - 请求对象，包含查询参数
 *    - params: 包含当前页码、页面大小和查询参数
 * @returns {object} 200 - 成功响应
 * @returns {object} 400 - 参数验证错误
 * @returns {Error} default - 未知错误
 * @security JWT - 需要提供有效的访问令牌
 */
exports.messagesClientLike = [
    async (req, res, next) => {
        try {
            const {_id} = req.body;
            // 验证给定的id是否符合有效的 ObjectId 格式
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                return apiResponse.validationErrorWithData(res, "参数错误.", "参数id格式错误");
            }
            const messages = await MessagesModel.findById(_id);
            if (!messages) {
                return apiResponse.notFoundResponse(res, '该留言不存在或已被删除');
            }
            // 更新喜欢次数并保存回数据库
            messages.likeNum = (messages.likeNum || 0) + 1;
            await messages.save();
            return apiResponse.successResponse(res, "点赞成功.");
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 反对留言
 * @param {Object} req - 请求对象，包含查询参数
 *    - params: 包含当前页码、页面大小和查询参数
 * @returns {object} 200 - 成功响应
 * @returns {object} 400 - 参数验证错误
 * @returns {Error} default - 未知错误
 * @security JWT - 需要提供有效的访问令牌
 */
exports.messagesClientOpposeNum = [
    async (req, res, next) => {
        try {
            const {_id} = req.body;
            // 验证给定的id是否符合有效的 ObjectId 格式
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                return apiResponse.validationErrorWithData(res, "参数错误.", "参数id格式错误");
            }
            const messages = await MessagesModel.findById(_id);
            if (!messages) {
                return apiResponse.notFoundResponse(res, '该留言不存在或已被删除');
            }
            // 更新喜欢次数并保存回数据库
            messages.opposeNum = (messages.opposeNum || 0) + 1;
            await messages.save();
            return apiResponse.successResponse(res, "操作成功.");
        } catch (err) {
            next(err);
        }
    }
];
