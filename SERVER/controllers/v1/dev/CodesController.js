const mongoose = require('mongoose')
const {body, validationResult} = require('express-validator');
const {CodesModel} = require('@models/v1')
const tokenAuthentication = require('@middlewares/tokenAuthentication')
const apiResponse = require('@utils/utils.apiResponse')
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const util = require('util')
const writeFile = util.promisify(fs.writeFile);
const {checkApiPermission} = require("@middlewares/authMiddleware");
const {actionRecords} = require("@middlewares/actionLogMiddleware");

/**
 * 获取代码生成列表
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
 * @returns {Object} - 包含代码生成列表及分页信息的响应对象
 */
exports.codeslist = [
    tokenAuthentication,
    checkApiPermission('dev:codes:list'),

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
                CodesModel.aggregate(aggregationPipeline),
                // 计算满足查询条件的文档总数
                CodesModel.countDocuments(query.params)
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
 * 创建代码生成
 * @param {Object} req - 请求对象，包含查询参数
 *    - params: 包含当前页码、页面大小和查询参数
 * @returns {object} 200 - 成功响应
 * @returns {object} 400 - 参数验证错误
 * @returns {Error} default - 未知错误
 * @security JWT - 需要提供有效的访问令牌
 */
exports.codesCreate = [
    tokenAuthentication,
    checkApiPermission('dev:codes:create'),
    actionRecords({module: '开发工具/代码生成/创建'}),
    [

        body("name").notEmpty().withMessage('文件名称不能为空.'),

        body("type").notEmpty().withMessage('文件类型不能为空.'),

    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }
            const newCodes = {
                ...req.body
            };
            await CodesModel.create(newCodes);
            return apiResponse.successResponseWithData(res, "添加代码生成成功.", newCodes);
        } catch (err) {
            next(err); // 将错误传递给下一个中间件（全局错误处理中间件）
        }
    }
];

/**
 * 删除代码文件
 * @group 代码生成管理 - 代码生成相关
 * @param {Object} req - 请求对象，包含查询参数
 *    - params: 包含当前页码、页面大小和查询参数
 *      - id: 代码生成ID (string)
 * @returns {object} 200 - 成功响应
 * @returns {object} 400 - 参数验证错误
 * @returns {Error} default - 未知错误
 * @security JWT - 需要提供有效的访问令牌
 */
exports.codesDelete = [
    tokenAuthentication,
    checkApiPermission('dev:codes:delete'),
    actionRecords({module: '开发工具/代码生成/删除'}),
    async (req, res, next) => {
        const {_id, name} = req.body;
        // 验证给定的id是否符合有效的 ObjectId 格式
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return apiResponse.validationErrorWithData(res, "参数错误.", "参数id格式错误");
        }
        try {
            const filePath = path.join(process.cwd(), 'uploads/codes', name); // 假设文件存储在 uploads 文件夹下
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    // 文件读取失败
                    console.error('错误', err);

                    return apiResponse.notFoundResponse(res, '文件不存在');
                }

                fs.unlink(filePath, async (err) => {
                    if (err) {
                        console.error(err);
                        return apiResponse.ErrorResponse(res, '文件删除失败');
                    }
                    // 删除数据库数据
                    const codeInfo = await CodesModel.findByIdAndDelete(_id);
                    if (!codeInfo) {
                        return apiResponse.notFoundResponse(res, '该文件不存在或已被删除');
                    }
                    return apiResponse.successResponse(res, '文件删除成功');
                });
            });

        } catch (err) {
            next(err); // 将错误传递给下一个中间件（全局错误处理中间件）
        }
    }
];


/**
 * 批量删除代码生成
 * @group 代码生成管理 - 代码生成相关
 * @param {Object} req - 请求对象，包含查询参数
 *    - params: 包含当前页码、页面大小和查询参数
 *      - id: 代码生成ID (string)
 * @returns {object} 200 - 成功响应
 * @returns {object} 400 - 参数验证错误
 * @returns {Error} default - 未知错误
 * @security JWT - 需要提供有效的访问令牌
 */
exports.codesDeleteAll = [
    tokenAuthentication,
    checkApiPermission('dev:codes:deleteAll'),
    actionRecords({module: '开发工具/代码生成/批量删除'}),
    async (req, res, next) => {
        const {ids} = req.body;
        try {
            const codesFileData = await CodesModel.find({_id: {$in: ids}});
            let errInfo = [];
            let info = [];

            // 生成一个 Promise 数组，每个 Promise 表示一个文件的删除操作
            const deletePromises = codesFileData.map((file) => {
                const filePath = path.join(process.cwd(), 'uploads/codes', file.name);
                return new Promise((resolve, reject) => {
                    fs.unlink(filePath, async (err) => {
                        if (err) {
                            console.error(err);
                            errInfo.push(`${file.name}删除失败`);
                            resolve();
                        } else {
                            const codeInfo = await CodesModel.findByIdAndDelete(file._id);
                            if (!codeInfo) {
                                errInfo.push(`${file.name}删除失败`);
                            } else {
                                info.push(`${file.name}删除成功`);
                            }
                            resolve();
                        }
                    });
                });
            });

            // 等待所有的删除操作完成
            await Promise.all(deletePromises);

            return apiResponse.successResponseWithData(res, '文件删除成功', {errInfo, info});
        } catch (err) {
            next(err);
        }
    }
];


/**
 * 获取所有表名列表
 * @param {Object} req - 请求对象，包含查询参数
 * @param {Object} res - 响应对象
 */
exports.modelsList = [
    tokenAuthentication,
    async (req, res, next) => {
        try {
            // 获取数据库中所有集合的名称
            const collectionNames = await mongoose.connection.db.listCollections().toArray();

            // 提取集合名称并发送回响应
            const collections = collectionNames.map(collection => collection.name);

            return apiResponse.successResponseWithData(res, '成功', collections)
        } catch (error) {
            console.error('Error querying collections:', error);
            next(error); // 将错误传递给下一个中间件（全局错误处理中间件）
        }
    }
]


// 首字母大写处理
function capitalizeFirstLetter(str) {
    return str.replace(/^\w/, c => c.toUpperCase());
}

// 创建新模块
const createFolder = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, {recursive: true});
    }
};


/**
 * 单表前后端端增删改文件代码
 * @route POST /v1/dev/singleCurdFrontAndBackAndBack
 * @param {String} tableName - 表名称 在mongodb注册的名称
 * @param {String} comment - 表中文
 * @param {String} newModules - 新模块: book 或者 auth   默认: sys
 * @param {String} auth - 权限：sys:users:create 只需传 sys
 * @group API - 根路径
 */
exports.singleCurdFrontAndBack = [
    tokenAuthentication,
    checkApiPermission('dev:codes:singleCurdFrontAndBack'),
    actionRecords({module: '开发工具/代码生成/创建'}),
    [
        body("tableName").notEmpty().withMessage('模型名称不能为空.'),
        body("comment").notEmpty().withMessage('模型中文名不能为空.'),
        body("auth").notEmpty().withMessage('根权限不能为空.'),
    ],
    async (req, res, next) => {
        try {
            const {tableName, comment, newModules, auth} = req.body;
            const Model = await mongoose.model(tableName);
            if (!Model) {
                res.status(404).json({error: '模型不存在'});
                return;
            }

            const schema = Model.schema;
            const fields = [];
            // 获取模型中所有字段信息
            for (const path in schema.paths) {
                if (schema.paths.hasOwnProperty(path)) {
                    const field = {
                        name: path,
                        type: schema.paths[path].instance,
                        comment: schema.paths[path].options.comment || '',
                    };
                    fields.push(field);
                }
            }
            // 表名称首字母大写
            let modelName = await capitalizeFirstLetter(tableName)

            // 读取文件
            const readFile = async (filePath) => {
                try {
                    return await fs.promises.readFile(filePath, 'utf-8');
                } catch (error) {
                    console.error(`文件读取失败: ${filePath}`, error);
                    throw error;
                }
            };

            // 渲染ejs模板
            const renderTemplate = async (templatePath, data) => {
                try {
                    const templateContent = await readFile(templatePath);
                    return await ejs.render(templateContent, data);
                } catch (error) {
                    console.error(`模板渲染失败: ${templatePath}`, error);
                    throw error;
                }
            };

            // 加载模板文件路径
            const dirTemplatePath = path.join(process.cwd(), 'templates', 'dirTemplate.ejs');
            const getTemplatePath = path.join(process.cwd(), 'templates', 'getTemplate.ejs');
            const viewTemplatePath = path.join(process.cwd(), 'templates', 'viewTemplate.ejs');
            const apiTemplatePath = path.join(process.cwd(), 'templates', 'apiTemplate.ejs');
            // 后端
            const crudControllersPath = path.join(process.cwd(), 'templates', 'crudControllersTemplate.ejs');
            const crudRoutesPath = path.join(process.cwd(), 'templates', 'crudRoutesTemplate.ejs');

            // 渲染前端列表页模板
            const crudControllersTemplate = await renderTemplate(crudControllersPath, {
                modelName,
                tableName,
                comment,
                fields,
                auth: auth || 'sys', // 根权限默认在系统管理
            });
            // 渲染前端列表页模板
            const crudRoutesTemplate = await renderTemplate(crudRoutesPath, {
                modelName,
                tableName,
                comment,
                fields,
                auth: auth || 'sys', // 根权限默认在系统管理
            });
            // 渲染前端列表页模板
            const dirTemplate = await renderTemplate(dirTemplatePath, {
                modelName,
                tableName,
                comment,
                fields,
                auth: auth || 'sys', // 根权限默认在系统管理
            });
            // 渲染前端编辑页模板
            const getTemplate = await renderTemplate(getTemplatePath, {
                modelName,
                tableName,
                comment,
                fields,
                auth: auth || 'sys', // 根权限默认在系统管理
            });
            // 渲染前端详情页模板
            const viewTemplate = await renderTemplate(viewTemplatePath, {
                modelName,
                tableName,
                comment,
                fields,
                auth: auth || 'sys', // 根权限默认在系统管理
            });
            // 渲染前端api模板
            const apiTemplate = await renderTemplate(apiTemplatePath, {
                modelName,
                tableName,
                comment,
                fields,
                auth: auth || 'sys', // 根权限默认在系统管理
            });

            // 设置生成文件存放目标文件夹
            const dirTemplatePathA = path.join(process.cwd(), 'uploads/codes');
            const getTemplateA = path.join(process.cwd(), 'uploads/codes');
            const viewTemplateA = path.join(process.cwd(), 'uploads/codes');
            const apiTemplateA = path.join(process.cwd(), 'uploads/codes');

            const crudControllersTemplateA = path.join(process.cwd(), 'uploads/codes');
            const routesTemplateA = path.join(process.cwd(), 'uploads/codes');


            // 处理新模块或者已有模块  不存在则生成对应文件夹
            await createFolder(dirTemplatePathA);
            await createFolder(getTemplateA);
            await createFolder(viewTemplateA);
            await createFolder(apiTemplateA);

            // 拼接前端文件存放路径
            const dirFilePath = path.join(dirTemplatePathA, `dir-${tableName}-info.vue`);
            const getFilePath = path.join(getTemplateA, `get-${tableName}-info.vue`);
            const viewFilePath = path.join(viewTemplateA, `view-${tableName}-info.vue`);
            const apiFilePath = path.join(apiTemplateA, `api.${tableName}.js`);

            // 拼接后端文件的存放路径
            const routerFilePath = path.join(routesTemplateA, `${tableName}.js`);
            const controllerFilePath = path.join(crudControllersTemplateA, `${modelName}Controller.js`);

            // 将渲染好的模板写入目标文件
            await writeFile(dirFilePath, dirTemplate);
            await writeFile(getFilePath, getTemplate);
            await writeFile(viewFilePath, viewTemplate);
            await writeFile(apiFilePath, apiTemplate);

            await writeFile(routerFilePath, crudRoutesTemplate);
            await writeFile(controllerFilePath, crudControllersTemplate);


            let data = [
                {
                    name: `${tableName}.js`,
                    type: '后端路由文件-JS',
                    url: `${process.env.URL}:${process.env.PORT}/v1/dev/codes/download?name=${tableName}.js`,
                    remark: `按钮权限：
                    【 ${auth}:${tableName}:list  】  
                    【 ${auth}:${tableName}:create  】   
                    【 ${auth}:${tableName}:update  】   
                    【 ${auth}:${tableName}:delete   】  
                    `,
                },
                {
                    name: `${modelName}Controller.js`,
                    type: '后端控制器文件-JS',
                    url: `${process.env.URL}:${process.env.PORT}/v1/dev/codes/download?name=${modelName}Controller.js`,
                    remark: `按钮权限：
                    【 ${auth}:${tableName}:list  】  
                    【 ${auth}:${tableName}:create  】   
                    【 ${auth}:${tableName}:update  】   
                    【 ${auth}:${tableName}:delete   】  
                    `,
                },
                {
                    name: `dir-${tableName}-info.vue`,
                    type: '前端页面-VUE',
                    url: `${process.env.URL}:${process.env.PORT}/v1/dev/codes/download?name=dir-${tableName}-info.vue`,
                    remark: `按钮权限：
                    【 ${auth}:${tableName}:list  】  
                    【 ${auth}:${tableName}:create  】   
                    【 ${auth}:${tableName}:update  】   
                    【 ${auth}:${tableName}:delete   】  
                    `,
                },
                {
                    name: `get-${tableName}-info.vue`,
                    type: '前端页面-VUE',
                    url: `${process.env.URL}:${process.env.PORT}/v1/dev/codes/download?name=get-${tableName}-info.vue`,
                    remark: `按钮权限：
                    【 ${auth}:${tableName}:list  】  
                    【 ${auth}:${tableName}:create  】   
                    【 ${auth}:${tableName}:update  】   
                    【 ${auth}:${tableName}:delete   】  
                    `,
                },
                {
                    name: `view-${tableName}-info.vue`,
                    type: '前端页面-VUE',
                    url: `${process.env.URL}:${process.env.PORT}/v1/dev/codes/download?name=view-${tableName}-info.vue`,
                    remark: `按钮权限：
                    【 ${auth}:${tableName}:list  】  
                    【 ${auth}:${tableName}:create  】   
                    【 ${auth}:${tableName}:update  】   
                    【 ${auth}:${tableName}:delete   】  
                    `,
                },
                {
                    name: `api.${tableName}.js`,
                    type: '前端请求接口-JS',
                    url: `${process.env.URL}:${process.env.PORT}/v1/dev/codes/download?name=api.${tableName}.js`,
                    remark: `按钮权限：
                    【 ${auth}:${tableName}:list  】  
                    【 ${auth}:${tableName}:create  】   
                    【 ${auth}:${tableName}:update  】   
                    【 ${auth}:${tableName}:delete   】  
                    `,
                }
            ]
            // 生成好的文件信息插入数据库
            const codesInfo = await CodesModel.insertMany(data)

            return apiResponse.successResponseWithData(res, '操作成功', codesInfo);
        } catch (err) {
            next(err);
        }
    }
];

// 代码文件下载  **&name=文件名称  filePath:默认uploads/codes
exports.download = [
    actionRecords({module: '开发工具/代码生成/下载文件'}),
    async (req, res) => {
        try {
            const {name, filePath = 'uploads/codes'} = req.query;
            const fileFullPath = path.join(process.cwd(), filePath, name);

            fs.readFile(fileFullPath, (err, data) => {
                if (err) {
                    // 文件读取失败
                    console.error(err);
                    return apiResponse.notFoundResponse(res, '文件不存在');
                }
                // 设置响应头
                res.setHeader('Content-Type', 'application/octet-stream');
                res.setHeader('Content-Disposition', `attachment; filename=${name}`);

                // 发送文件内容
                res.send(data);
            });
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
];
