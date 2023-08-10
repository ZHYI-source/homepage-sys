const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
        operator: {
            type: String,
            comment: '操作人'
        },
        operatorId: {
            type: String,
            comment: '操作人ID'
        },
        module: {
            type: String,
            comment: '操作模块'
        },
        platform: {
            type: String,
            comment: '操作平台'
        },
        operatorIP: {
            type: String,
            comment: '设备IP'
        },
        address: {
            type: String,
            comment: '设备位置'
        },
        content: {
            type: String,
            comment: '操作内容'
        },
    },
    {
        timestamps: true,
        versionKey: false, // 设置不需要version  _V:0
    });

// 表格名称一定要复数加上s
module.exports = mongoose.model('users_opt_logs', Schema);
