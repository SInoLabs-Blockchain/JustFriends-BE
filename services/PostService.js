import { models } from '../SequelizeInit.js';
import crypto from 'crypto';

const PostService = {
  createPost: async ({ userId, content, type, preview }) => {
    if (content.length > 1000) {
      throw new Error('Content size exceeds the limit of 1000 characters.');
    }

    const contentHash = crypto.createHash('sha256').update(content).digest('hex');
    if (!preview) {
      preview = content.substring(0, Math.min(content.length, Math.ceil(content.length / 10)));
    }

    // Ensure preview is not longer than content
    if (preview.length >= content.length) {
      throw new Error('Preview length must be less than content length.');
    }

    const post = await models.Post.create({
      userId,
      content,
      contentHash,
      type,
      preview
    });

    return post;
  },

  searchPosts: async (searchQuery, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    const posts = await models.Post.findAndCountAll({
      where: {
        content: {
          [Op.iLike]: `%${searchQuery}%`
        }
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      total: posts.count,
      totalPages: Math.ceil(posts.count / limit),
      currentPage: page,
      posts: posts.rows
    };
  },

  getPosts: async (type, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    const posts = await models.Post.findAndCountAll({
      where: type ? { type } : {},
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      total: posts.count,
      totalPages: Math.ceil(posts.count / limit),
      currentPage: page,
      posts: posts.rows
    };
  },

  getPostById: async (postId) => {
    const post = await models.Post.findByPk(postId);
    if (!post) {
      throw new Error('Post not found.');
    }

    return post;
  },

  getPostsOwned: async (userId, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    const posts = await models.Post.findAndCountAll({
      where: userId ? { userId } : {},
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      total: posts.count,
      totalPages: Math.ceil(posts.count / limit),
      currentPage: page,
      posts: posts.rows
    };
  },
};

export default PostService;