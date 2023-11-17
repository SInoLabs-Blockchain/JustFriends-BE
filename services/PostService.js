import { models } from '../SequelizeInit.js';
import crypto from 'crypto';
import { GraphQLClient } from 'graphql-request';

const PostService = {
  createPost: async ({ userId, content, type, preview }) => {
    if (content.length > 1000) {
      throw new Error('Content size exceeds the limit of 1000 characters.');
    }

    const timestamp = Date.now();
    const contentHash = crypto.createHash('sha256').update(userId + timestamp + content).digest('hex');
    
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

  getPostsByType: async (type, userId, page, limit) => {
    const offset = (page - 1) * limit;

    let attributesCondition = ['postId', 'userId', 'type', 'preview', 'createdAt', 'updatedAt'];
    let whereCondition = { type };
    let includeCondition = [
      {
        model: models.User,
        as: 'user',
        attributes: ['userId', 'username', 'avatarUrl', 'coverUrl'],
      }
    ];

    // Nếu type là 'free' và có userId, chỉ lấy những bài viết chưa xem
    if (userId) {
      includeCondition.push({
        model: models.PostView,
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

    return models.Post.findAll({
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
  },

  getPostById: async (postId) => {
    const post = await models.Post.findByPk(postId);
    if (!post) {
      throw new Error('Post not found.');
    }

    return post;
  },

  getPostsByContentHashes: async (contentHashes, user) => {
    const posts = await models.Post.findAll({
      where: {
        contentHash: contentHashes
      }
    });

    if (!user) {
      return posts.map(post => {
        if (post.type === 'paid') {
          return { ...post.dataValues, content: null };
        }
        return post;
      });
    }

    const client = new GraphQLClient(process.env.GRAPHQL_CLIENT);
    
    const contentHashesString = contentHashes.map(hash => `"${hash}"`).join(', ');

    const query = `
      {
        userPostEntities(where: { account: "${user.walletAddress}", content_in: [${contentHashesString}] }) {
          content
        }
      }
    `;
    const response = await client.request(query);
    const validContentHashes = new Set(response.userPostEntities.map(entity => entity.content));
    return posts.map(post => {
      if (post.type === 'paid' && post.userId !== user.userId && !validContentHashes.has(post.contentHash)) {
        return { ...post.dataValues, content: null };
      }
      return post;
    });
  },

};

export default PostService;