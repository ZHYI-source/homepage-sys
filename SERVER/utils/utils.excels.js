// .js

const stream = require('stream');
const util = require('util');
const xlsx = require('xlsx');

/**
 * 将 JSON 数据导出为 Excel 文件
 * @param {Array} data - 导出的 JSON 数据数组 (必填)
 * @param {Object} headers - 自定义导出字段的映射关系和表头
 * @param {string} filename - 导出文件的名称，需要带有后缀名：data.xlsx (必填)
 * @param {Object} res - 响应对象，用于发送导出的 Excel 文件的 Blob 流数据 (必填)
 * @throws {Error} 如果在导出过程中出现错误，将抛出异常
 */
async function exportExcel({
                               data = [],
                               headers = {},
                               filename = 'data.xlsx',
                               res}) {
    try {

        // 检查是否提供了自定义导出字段的映射关系和表头
        const hasCustomFields = Object.keys(headers).length > 0;

        // 根据是否提供自定义字段映射关系进行数据处理
        let exportData;
        if (hasCustomFields) {
            // 自定义导出字段
            const exportFields = Object.keys(headers);

            // 根据导出字段筛选和转换数据
            exportData = data.map(item => {
                const exportItem = {};
                for (const field of exportFields) {
                    if (field in item) {
                        exportItem[field] = item[field];
                    }
                }
                return exportItem;
            });
        } else {
            // 导出所有字段
            exportData = data;
        }

        // 创建一个新的工作簿
        const workbook = xlsx.utils.book_new();
        // 创建一个新的工作表
        const worksheet = xlsx.utils.json_to_sheet(exportData);

        if (hasCustomFields) {
            // 自定义表头，根据映射关系替换表头字段 原理：worksheet[A1].v = '测试'
            const exportFields = Object.keys(headers);
            for (let c = 0; c < exportFields.length; c++) {
                const header = xlsx.utils.encode_col(c) + '1';
                worksheet[header].v = headers[exportFields[c]];
            }
        }
        // 将工作表添加到工作簿
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Data');
        // 将工作簿转换为二进制数据（Buffer）
        const excelBuffer = xlsx.write(workbook, {type: 'buffer', bookType: 'xlsx'});
        // 创建可读流
        const readableStream = new stream.PassThrough().end(excelBuffer);
        // 设置响应头，指定导出文件的类型和名称
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        // 告诉浏览器以附件形式处理响应数据，即将其下载到本地而不是在浏览器中直接显示
        res.setHeader('Content-Disposition', `attachment`);
        // 设置自定义的 x-filename 头 自定义文件名称
        res.setHeader('x-filename', encodeURIComponent(filename));
        // 使用流式传输发送数据
        await util.promisify(stream.pipeline)(readableStream, res);
    } catch (err) {
        throw err;
    }
}


/**
 * 将 Excel 文件转换为 JSON 数据
 * @param {string} filePath - Excel 文件路径
 * @returns {Array} - 转换后的 JSON 数据
 */
async function excelToJson(filePath){
    // 读取 Excel 文件
    const workbook = xlsx.readFile(filePath);
    // 获取第一个工作表
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    // 将工作表转换为 JSON 数据
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    return jsonData;
}


module.exports = {
    exportExcel,
    excelToJson
};
