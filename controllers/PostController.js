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
  },

  searchPosts: async (req, res) => {
    try {
      const { searchQuery } = req.query;
      const page = parseInt(req.query.page, 10) || 1;
      const results = await PostService.searchPosts(searchQuery, page);

      res.json(results);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = PostController;
