const Comment = require('../models/Comment');
const Post = require('../models/Post');
const buildTree = require('../utils/buildTree');


// create comment (or reply)
exports.createComment = async (req, res) => {
try {
const postId = req.params.id; // endpoint: POST /api/posts/:id/comments
const { content, parentId } = req.body;
const authorClientId = req.header('x-client-id') || req.body.clientId || null;


if (!content || !content.trim()) return res.status(400).json({ error: 'content required' });


const comment = await Comment.create({ postId, parentId: parentId || null, content: content.trim(), authorClientId });


// increment commentsCount on Post
await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });


const io = req.app.get('io');
if (io) io.emit('comment:created', { postId, comment });


return res.status(201).json(comment);
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'server error' });
}
};


// get nested comments for a post
exports.getComments = async (req, res) => {
try {
const postId = req.params.id; // endpoint: GET /api/posts/:id/comments
const comments = await Comment.find({ postId }).sort({ createdAt: 1 }).lean();
const tree = buildTree(comments);
return res.json({ comments: tree });
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'server error' });
}
};