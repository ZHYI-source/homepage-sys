const mongoose = require('mongoose')
let CodeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        comment: '文件名称'
    },
    type: {
        type: String,
        comment: '文件类型'
    },
    url: {
        type: String,
        comment: '下载地址'
    },
    remark: {
        type: String,
        comment: '备注'
    },

}, {
    timestamps: true,
    versionKey: false, // 设置不需要version  _V:0
});

module.exports = mongoose.model('codes', CodeSchema);
