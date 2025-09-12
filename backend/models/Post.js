const mongoose = require('mongoose');
const {Schema} = mongoose;
const PostSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    tags : [{type: String, index: true}],
    likesCount : {type: Number, default: 0},
    likedBy : [{type: String}],
    commentsCount: {type: Number, default: 0},
    createdBy :{type:String, default: null},
    createdAt : {type: Date, default: Date.now},
    updatedAt :{type: Date, default : Date.now}
})

PostSchema.index({ createdAt: -1 }) // this will help in sorting the posts by createdAt in descending order
PostSchema.index({ tags: 1 }) // this will help in searching the posts by tags
PostSchema.index({ likesCount: -1 }) // this will help in sorting the posts by likesCount in descending order

module.exports = mongoose.model('Post',PostSchema);
