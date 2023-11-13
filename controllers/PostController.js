import PostService from '../services/PostService.js';
import { Op } from 'sequelize';

const PostController = {
  createPost: async (req, res) => {
    try {
      const { content, type, preview } = req.body;
      const { userId } = req.user;
      const post = await PostService.createPost({ userId, content, type, preview });
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  searchPosts: async (req, res) => {
    try {
      const { searchQuery, page = 1 } = req.query;
      const results = await PostService.searchPosts(searchQuery, Number(page));
      res.json(results);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getPosts: async (req, res) => {
    const { type, page = 1, limit = 10 } = req.query;
    const { userId } = req.user || {};

    if (!type || !['paid', 'free'].includes(type)) {
      return res.status(400).json({ message: 'Invalid type parameter' });
    }

    try {
      const posts = await PostService.getPostsByType(type, userId, Number(page), Number(limit));
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  markPostAsViewed: async (req, res) => {
    try {
      const { postId } = req.body;
      const { id: userId } = req.user || {};

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

export default PostController;