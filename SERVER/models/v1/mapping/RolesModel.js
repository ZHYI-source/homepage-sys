const mongoose = require('mongoose')
let UserSchema = new mongoose.Schema({
        roleName: {
            type: String,
            required: true,
            unique: true, // 唯一约束
            index: true, // 索引
            comment: '角色名称'
        },
        roleAuth: {
            type: String,
            required: true,
            comment: '角色标识'
        },
        perms: {
            type: Array,
            comment: '权限列表',
        },
        remark: {
            type: String,
            comment: '备注',
        },
        status: {
            type: Boolean,
            required: true,
            default: 1,
            comment: '状态: 0禁用 1正常'
        },
    },
    {
        timestamps: true,
        versionKey: false, // 设置不需要version  _V:0
    });
module.exports = mongoose.model('roles', UserSchema);
