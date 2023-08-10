const mongoose = require('mongoose')
let schema = new mongoose.Schema({
        title: {
            type: String,
            required: true,
            comment: '博文名称'
        },
        cover: {
            type: String,
            comment: '博文封面'
        },
        abstract: {
            type: String,
            comment: '博文摘要'
        },
        content: {
            type: String,
            required: true,
            comment: '博文内容'
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
        viewNum: {
            type: Number,
            default: 0,
            comment: '浏览量',
        },
        likeNum: {
            type: Number,
            default: 0,
            comment: '点赞量',
        },
        isReship: {
            type: Boolean,
            default: false,
            comment: '是否转载'
        },
        isReshipUrl: {
            type: String,
            comment: '转载文章地址'
        },
        isReshipName: {
            type: String,
            comment: '转载文章名称'
        },
        recommended: {
            type: Boolean,
            required: true,
            default: false,
            comment: '是否精选'
        },
        likeToken: {
            type: Array,
            comment: '点赞的临时标识'
        },
        status: {
            type: Boolean,
            required: true,
            default: true,
            comment: '状态 发布和草稿'
        },
    },
    {
        timestamps: true,
        versionKey: false, // 设置不需要version  _V:0
    });
module.exports = mongoose.model('blog_articles', schema);
