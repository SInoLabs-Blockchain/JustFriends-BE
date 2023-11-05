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

  getPosts: async (req, res) => {
    const { type } = req.query;
    const { userId } = req.user || {}; // Nếu không có user, userId sẽ là undefined
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Kiểm tra type có hợp lệ không
    if (!type || !['paid', 'free'].includes(type)) {
      return res.status(400).json({ message: 'Invalid type parameter' });
    }

    try {
      const posts = await PostService.getPostsByType(type, userId, page, limit);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  markPostAsViewed: async (req, res) => {
    try {
      const { postId } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      await PostService.markPostAsViewed(userId, postId);

      res.status(200).json({ message: 'Post marked as viewed' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = PostController;
