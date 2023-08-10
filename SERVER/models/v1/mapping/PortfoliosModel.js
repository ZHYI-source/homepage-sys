const mongoose = require('mongoose')
let schema = new mongoose.Schema({
        title: {
            type: String,
            required: true,
            comment: '作品名称'
        },
        cover: {
            type: String,
            required: true,
            default: 'https://images.pexels.com/photos/12825195/pexels-photo-12825195.png?auto=compress&cs=tinysrgb&w=600&lazy=load',
            comment: '作品封面'
        },
        abstract: {
            type: String,
            comment: '作品简介'
        },
        content: {
            type: String,
            comment: '作品内容'
        },
        sourceUrl: {
            type: String,
            comment: '源码地址'
        },
        demoUrl: {
            type: String,
            comment: '示例地址'
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId, // 使用 ObjectId 类型来引用角色表
            ref: 'users', // 关联的角色表名称
            comment: '作者'
        },
        remark: {
            type: String,
            comment: '备注',
        },
        category: {
            type: String,
            comment: '分类',
        },
        framework: {
            type: String,
            comment: '技术框架',
        },
        recommended: {
            type: Boolean,
            required: true,
            default: false,
            comment: '是否精选'
        },
        status: {
            type: Boolean,
            required: true,
            default: true,
            comment: '状态'
        },
    },
    {
        timestamps: true,
        versionKey: false, // 设置不需要version  _V:0
    });
module.exports = mongoose.model('portfolios', schema);
