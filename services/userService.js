const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const { recoverPersonalSignature } = require('eth-sig-util');
const { models } = require('../SequelizeInit');
require('dotenv').config();

const UserService = {
  createChallenge: async (walletAddress) => {
    try {
      // Tìm challenge hiện tại dựa trên walletAddress
      let challenge = await models.Challenge.findOne({ where: { wallet_address: walletAddress } });

      // Tạo một challenge text mới
      const newChallengeText = crypto.randomBytes(32).toString('hex');

      if (challenge) {
        // Nếu challenge đã tồn tại, cập nhật challengeText mới
        challenge.challengeText = newChallengeText;
        await challenge.save();
      } else {
        // Nếu không, tạo một challenge mới
        challenge = await models.Challenge.create({
          wallet_address: walletAddress,
          challenge_text: newChallengeText
        });
      }

      return challenge;
    } catch (error) {
      console.error('Error in createChallenge:', error);
      throw error;
    }
  },

  verifySignature: async (walletAddress, signature) => {
    const challenge = await models.Challenge.findOne({ where: { wallet_address: walletAddress } });
    if (!challenge) {
      throw new Error('Challenge not found.');
    }

    const recoveredAddress = recoverPersonalSignature({
      data: challenge.challenge_text,
      sig: signature
    });

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new Error('Signature verification failed.');
    }

    await models.Challenge.destroy({ where: { wallet_address: walletAddress } });
    return true;
  },

  findOrCreateUser: async (walletAddress) => {
    let user = await models.User.findOne({ where: { walletAddress } });
    if (!user) {
      user = await models.User.create({ walletAddress });
    }
    return user;
  },

  generateJWT: (userId, walletAddress) => {
    return jwt.sign({ userId, walletAddress }, process.env.SESSION_SECRET, { expiresIn: '1h' });
  },

  getUserById: async (userId) => {
    try {
      const user = await models.User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (userId, updateData) => {
    const user = await models.User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Cập nhật thông tin người dùng
    await user.update(updateData);
    return user;
  },

  searchUsers: async (searchQuery, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    const users = await User.findAndCountAll({
      where: {
        [Op.or]: [
          { username: { [Op.iLike]: `%${searchQuery}%` } },
          { walletAddress: { [Op.iLike]: `%${searchQuery}%` } }
        ]
      },
      limit,
      offset,
      order: [['username', 'ASC']]
    });

    return {
      total: users.count,
      totalPages: Math.ceil(users.count / limit),
      currentPage: page,
      users: users.rows
    };
  },
}

module.exports = UserService;
