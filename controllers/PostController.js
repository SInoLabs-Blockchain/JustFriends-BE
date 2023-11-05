const PostService = require('../services/PostService');

const PostController = {
  createPost: async (req, res) => {
    try {
      const { content, type, preview } = req.body;
      userId = req.user.userId
      const post = await PostService.createPost({ userId, content, type, preview });
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = PostController;
