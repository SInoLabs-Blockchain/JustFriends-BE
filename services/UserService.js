import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { recoverPersonalSignature } from 'eth-sig-util';
import { models } from '../SequelizeInit.js';
import dotenv from 'dotenv';
import { hri } from 'human-readable-ids';
import { Op } from 'sequelize';
import sequelize from 'sequelize';
import Web3 from 'web3';
import fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const EIP4337Module = JSON.parse(await readFile(new URL('../resources/EIP4337Module.json', import.meta.url)));

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
      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      await sleep(5000);
      const web3 = new Web3(process.env.RPC);
      const code = await web3.eth.getCode(walletAddress, "latest");
      if (code !== '0x') {
        const contract = new web3.eth.Contract(EIP4337Module.abi, walletAddress); // Empty ABI as we don't need to interact with any specific contract methods
        const ownerAddress = await contract.methods.owner().call();
        if (recoveredAddress.toLowerCase() !== ownerAddress.toLowerCase()) {
          throw new Error('Signature verification failed.');
        }
      } else {
        throw new Error('Signature verification failed.');
      }
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
          sequelize.where(sequelize.fn('lower', sequelize.col('username')), { [Op.like]: `%${searchQuery}%` }),
          sequelize.where(sequelize.fn('lower', sequelize.col('walletAddress')), { [Op.like]: `%${searchQuery}%` })
        ]
      },
      limit,
      offset,
      order: [['username', 'ASC']]
    });

    console.log("users", users);

    return {
      total: users.count,
      totalPages: Math.ceil(users.count / limit),
      currentPage: page,
      users: users.rows
    };
  },
}

export default UserService;