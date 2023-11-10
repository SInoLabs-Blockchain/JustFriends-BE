import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { recoverPersonalSignature } from 'eth-sig-util';
import { models } from '../SequelizeInit.js';
import dotenv from 'dotenv';
import randomNumber from 'random-number';
import { hri } from 'human-readable-ids';

dotenv.config();

const UserService = {
  createChallenge: async (walletAddress) => {
    try {
      let challenge = await models.Challenge.findOne({ where: { wallet_address: walletAddress } });
      const newChallengeText = crypto.randomBytes(32).toString('hex');

      if (challenge) {
        challenge.challengeText = newChallengeText;
        await challenge.save();
      } else {
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
      const username = hri.random();
      user = await models.User.create({ walletAddress, username });
    }
    return user;
  },

  generateJWT: (userId, walletAddress) => {
    return jwt.sign({ userId, walletAddress }, process.env.JWT_SECRET, { expiresIn: '10h' });
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

    // Update user information
    await user.update(updateData);
    return user;
  },

  searchUsers: async (searchQuery, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    const users = await models.User.findAndCountAll({
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

export default UserService;