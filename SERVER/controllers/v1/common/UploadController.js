const tokenAuthentication = require('@middlewares/tokenAuthentication')
const apiResponse = require('@utils/utils.apiResponse')
const {actionRecords} = require("@middlewares/actionLogMiddleware");
const {uploadMiddleware} = require("@middlewares/uploadMiddleware");
const fs = require('fs')
const path = require('path')


/**
 *  upload. 需要token校验
 * @returns {Object}
 */
exports.upload = [
    tokenAuthentication,
    actionRecords({module: '上传文件'}),
    uploadMiddleware('uploads/'),
    async (req, res) => {
        try {
            if (!req.file) return apiResponse.ErrorResponse(res, '没有上传文件');
            // 获取上传的文件信息
            const file = req.file;
            const filename = file.filename;
            const fileUrl = `${process.env.URL}:${process.env.PORT}/v1/common/upload/file/${filename}`;
            // 返回成功响应
            return apiResponse.successResponseWithData(res, '文件上传成功', {filename, fileUrl});
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }]


exports.file = [
    async (req, res) => {
        try {
            const filename = req.params.filename;
            const filePath = path.join(process.cwd(), 'uploads', filename); // 假设文件存储在 uploads 文件夹下
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    // 文件读取失败
                    console.error(err);
                    return apiResponse.ErrorResponse(res, '文件不存在');
                }

                // 设置响应头
                /*
                Content-Type 是指定响应的内容类型。在示例中，application/octet-stream 表示以二进制流的形式下载文件，
                适用于大多数文件类型。
                Content-Disposition 是指定响应的内容处理方式，可以控制浏览器如何处理下载的文件。
                attachment 表示文件作为附件下载，而 filename=${filename} 则指定了下载的文件名

                如果你希望浏览器直接在页面中显示文件内容，而不是下载文件，你可以使用 inline 代替 attachment。
                */
                res.setHeader('Content-Type', 'application/octet-stream');
                res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

                // 发送文件内容
                res.send(data);
            });
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
]

exports.deleteFile = [
    actionRecords({module: '删除文件'}),
    async (req, res) => {
        try {
            const filename = req.query.filename;
            const filePath = path.join(process.cwd(), 'uploads', filename); // 假设文件存储在 uploads 文件夹下

            fs.readFile(filePath, (err, data) => {
                if (err) {
                    // 文件读取失败
                    console.error(err);
                    return apiResponse.ErrorResponse(res, '文件不存在');
                }

                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(err);
                        return apiResponse.ErrorResponse(res, '文件删除失败');
                    }

                    return apiResponse.successResponse(res, '文件删除成功');
                });
            });
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
]
