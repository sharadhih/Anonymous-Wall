const router = require('express').Router();
const commentsController = require('../controllers/commentController');


router.post('/:id/comments', commentsController.createComment);
router.get('/:id/comments', commentsController.getComments);


module.exports = router;