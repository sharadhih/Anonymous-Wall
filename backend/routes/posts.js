const router = require('express').Router();
const postController = require('../controllers/postController');

router.post('/', postController.createPost);
router.get('/', postController.getPosts);
router.patch('/:id/like', postController.toggleLike);
router.delete('/:id', postController.deletePost);
router.get('/:id', postController.getPostById);

module.exports = router;