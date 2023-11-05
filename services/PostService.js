const { models } = require('../models');
const crypto = require('crypto');

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
  }
};

module.exports = PostService;
