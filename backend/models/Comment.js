const mongoose = require('mongoose');
const {Schema} = mongoose;

const CommentSchema = new Schema({
    postId:{
        type: mongoose.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    parentId:{
        type: mongoose.Types.ObjectId,
        ref: 'Comment',
        default: null,
    },
    content:{
        type: String,
        required: true,
        trim: true,
    },
    authorClientId: { type: String, default: null }, // optional
    createdAt: { type: Date, default: Date.now },
})

CommentSchema.index({ postId: 1, parentId: 1, createdAt: 1 }) // this will help in fetching comments for a post and its replies in chronological order
module.exports = mongoose.model('Comment', CommentSchema);
