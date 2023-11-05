const express = require('express');
const PostController = require('../controllers/PostController');

const router = express.Router();

router.post('/post', PostController.createPost);

module.exports = router;
