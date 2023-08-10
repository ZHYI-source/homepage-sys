const mongoose = require('mongoose')
let permissionSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            comment: '权限名称'
        },
        key: {
            type: String,
            required: true,
            comment: '权限键'
        },
        parent_key: {
            type: String,
            comment: '父级权限键（可选）'
        },
        auth: {
            type: Boolean,
            default: false,
            comment: '是否是权限按钮'
        },
        sortOrder: {
            type: Number,
            default: 0,
            comment: '排序字段'
        },
        status: {
            type: Boolean,
            required: true,
            default: true,
            comment: '状态: 0禁用 1正常'
        },
        disabled: {
            type: Boolean,
            required: true,
            default: false,
            comment: '状态: 0正常 1禁用'
        },
    },
    {
        timestamps: true,
        versionKey: false, // 设置不需要version  _V:0
    });


// 添加静态方法: 转换为树状结构
permissionSchema.statics.toTree = function (permissions) {
    const tree = [];
    const map = {};

    permissions.forEach(permission => {
        map[permission.key] = { ...permission };
    });

    permissions.forEach(permission => {
        const parent = map[permission.parent_key];
        if (parent) {
            if (!parent.children) {
                parent.children = [];
            }
            parent.children.push(map[permission.key]);
        } else {
            tree.push(map[permission.key]);
        }
    });
    return tree;
};

// 添加静态方法: 转换为扁平结构
permissionSchema.statics.toFlat = function (permissions) {
    const flat = [];

    const flatten = (permission, parentKey = null) => {
        const flatPermission = { ...permission, parentKey };
        flat.push(flatPermission);

        permission.children.forEach(child => {
            flatten(child, permission.key);
        });
    };

    permissions.forEach(permission => {
        flatten(permission);
    });

    return flat;
};

module.exports = mongoose.model('permissions', permissionSchema);
