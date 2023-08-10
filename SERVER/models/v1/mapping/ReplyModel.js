const mongoose = require('mongoose')
let schema = new mongoose.Schema({
        message: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'messages',
            required: true,
            comment: '关联的留言ID'
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
            comment: '原始用户ID'
        },
        toUser:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
            comment: '目标用户ID'
        },

        content: {
            type: String,
            comment: '回复内容'
        },
    },
    {
        timestamps: true,
        versionKey: false, // 设置不需要version  _V:0
    });
module.exports = mongoose.model('replies', schema);
