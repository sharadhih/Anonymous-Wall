const Post = require('../models/Post');

exports.getPosts = async (req, res) => {
	try {
		const { tags, search, sort, page = 1, limit = 10 } = req.query;
		const filter = {};

		if (tags) {
			const tagsArr = tags.split(',').map(t => t.trim());
			filter.tags = { $in: tagsArr };
		}
		if (search) {
			filter.content = { $regex: search, $options: 'i' };
		}

		const sortOption = sort === 'popular' ? { likesCount: -1, createdAt: -1 } : { createdAt: -1 };

		const [posts, total] = await Promise.all([
			Post.find(filter).sort(sortOption).skip((page - 1) * limit).limit(limit).lean(),
			Post.countDocuments(filter),
		]);

		return res.json({ posts, page, limit, total });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'server error' });
	}
};


// toggle like (client sends x-client-id header)
exports.toggleLike = async (req, res) => {
try {
const postId = req.params.id;
const clientId = req.header('x-client-id') || req.body.clientId;
if (!clientId) return res.status(400).json({ error: 'x-client-id header required' });


const post = await Post.findById(postId);
if (!post) return res.status(404).json({ error: 'post not found' });


let liked = false;
if (post.likedBy && post.likedBy.includes(clientId)) {
// unlike
post.likedBy = post.likedBy.filter(id => id !== clientId);
post.likesCount = Math.max(0, post.likesCount - 1);
liked = false;
} else {
// like
post.likedBy = post.likedBy || [];
post.likedBy.push(clientId);
post.likesCount = (post.likesCount || 0) + 1;
liked = true;
}


await post.save();


const io = req.app.get('io');
if (io) io.emit('post:liked', { postId: post._id, likesCount: post.likesCount });


return res.json({ liked, likesCount: post.likesCount });
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'server error' });
}
};


// create a new post
exports.createPost = async (req, res) => {
  try {
    const { content, tags, createdBy } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'content required' });
    }
    const post = await Post.create({
      content: content.trim(),
      tags: tags || [],
      createdBy: createdBy || null,
    });
    
    return res.status(201).json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
};


// optional admin delete (keep for completeness)
exports.deletePost = async (req, res) => {
try {
const postId = req.params.id;
await Post.findByIdAndDelete(postId);
const io = req.app.get('io');
if (io) io.emit('post:deleted', { postId });
return res.json({ ok: true });
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'server error' });
}
};


exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'post not found' });
    return res.json({ post });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
};