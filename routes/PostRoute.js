const express = require('express');
const PostController = require('../controllers/PostController');

const router = express.Router();

router.post('/post', PostController.createPost);
router.get('/posts/search', PostController.searchPosts);

module.exports = router;
