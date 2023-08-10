const mongoose = require('mongoose')
let schema = new mongoose.Schema({
        content: {
            type: String,
            comment: '留言内容'
        },
        hidden: {
            type: Boolean,
            required: true,
            default: false,
            comment: '是否隐藏'
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
            comment: '关联的用户ID'
        },
        replies: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reply',
            comment: '关联的回复ID'
        },
        likeNum: {
            type: Number,
            default: 0,
            comment: '点赞量',
        },
        opposeNum: {
            type: Number,
            default: 0,
            comment: '反对量',
        },
    },
    {
        timestamps: true,
        versionKey: false, // 设置不需要version  _V:0
    });
module.exports = mongoose.model('messages', schema);
