const mongoose = require('mongoose')
let schema = new mongoose.Schema({
        srcName: {
            type: String,
            required: true,
            comment: '资源名称'
        },
        srcType: {
            type: String,
            required: true,
            comment: '资源类型'
        },
        previewPath: {
            type: String,
            comment: '资源预览路径'
        },
        downloadPath: {
            type: String,
            comment: '资源下载路径'
        },
        deletePath: {
            type: String,
            comment: '资源删除路径'
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users', // 关联的角色表名称
            comment: '用户ID'
        },
        srcSize:{
            type: String,
            comment: '资源大小',
        },
        remark: {
            type: String,
            comment: '备注',
        },
        status: {
            type: Boolean,
            required: true,
            default: true,
            comment: '状态: false禁用 true正常'
        },
    },
    {
        timestamps: true,
        versionKey: false, // 设置不需要version  _V:0
    });
module.exports = mongoose.model('resources', schema);
