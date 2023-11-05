const { models } = require('../SequelizeInit');
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
  },

  searchPosts: async (searchQuery, page = 1, limit = 10) => {
    const offset = (page - 1) * limZZit;

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

  getPostsByType: async (type, userId, page, limit) => {
    const offset = (page - 1) * limit;

    let attributesCondition = ['postId', 'userId', 'type', 'preview', 'createdAt', 'updatedAt'];
    let whereCondition = { type };
    let includeCondition = [
      {
        model: User,
        as: 'user',
        attributes: ['userId', 'username', 'avatarUrl', 'coverUrl'],
      }
    ];

    // Nếu type là 'free' và có userId, chỉ lấy những bài viết chưa xem
    if (userId) {
      includeCondition.push({
        model: PostView,
        as: 'views',
        required: false,
        attributes: [],
        where: {
          userId: userId
        }
      });
      whereCondition['$views.postId$'] = { [Op.is]: null };
    }

    if (type == 'free') {
      attributesCondition.push('content'); // Thêm 'content' vào danh sách các thuộc tính được trả về
    }

    return Post.findAll({
      where: whereCondition,
      attributes: attributesCondition,
      include: includeCondition,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      subQuery: false
    });
  },

  markPostAsViewed: async (userId, postId) => {
    // Logic để đánh dấu một bài viết đã được xem
    return models.PostView.create({ userId, postId });
  }
};

module.exports = PostService;
