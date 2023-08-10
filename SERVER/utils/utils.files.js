const fs = require('fs');
const apiResponse = require('@utils/utils.apiResponse')

/**
 * 读取文件
 * @param {string} filePath - 文件路径
 * @returns {Promise} - 读取文件的 Promise
 */
function findFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

/**
 * 删除文件
 * @param {string} filePath - 文件路径
 * @returns {Promise} - 删除文件的 Promise
 */
function deleteFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

/**
 * 下载文件
 * @param {string} filePath - 文件路径
 * @param {string} filename - 下载的文件名
 * @param {Object} res - 响应对象
 */
async function downloadFile(filePath, filename, res) {
    await fs.readFile(filePath, (err, data) => {
        if (err) {
            // 文件读取失败
            console.error('下载文件出错', err);
            return apiResponse.notFoundResponse(res, '文件不存在');
        }
        /*
            设置响应头:
            Content-Type 是指定响应的内容类型。在示例中，application/octet-stream 表示以二进制流的形式下载文件，
            适用于大多数文件类型。
            Content-Disposition 是指定响应的内容处理方式，可以控制浏览器如何处理下载的文件。
            attachment 表示文件作为附件下载，而 filename=${filename} 则指定了下载的文件名
            如果你希望浏览器直接在页面中显示文件内容，而不是下载文件，你可以使用 inline 代替 attachment。
        */

        // 设置响应头，指定导出文件的类型和名称
        res.setHeader('Content-Type', 'application/octet-stream');
        // 告诉浏览器以附件形式处理响应数据，即将其下载到本地而不是在浏览器中直接显示
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
        // 设置自定义的 x-filename 头 自定义文件名称
        res.setHeader('x-filename', encodeURIComponent(filename));

        // 发送文件内容
        res.send(data);
    });
}

/**
 * 预览图片
 * @param {string} filePath - 图片文件路径
 * @param {string} filename - 预览的文件名
 * @param {Object} res - 响应对象
 */
function previewImage(filePath, filename, res) {
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(filename)}"`);
    // 根据实际图片类型调整 Content-Type
    res.setHeader('Content-Type', 'image/jpeg,image/png,image/svg+xml,video/mp4,audio/mpeg');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('预览图片出错', err);
        }
    });
}


module.exports = {
    deleteFile,
    downloadFile,
    findFile,
    previewImage
};
