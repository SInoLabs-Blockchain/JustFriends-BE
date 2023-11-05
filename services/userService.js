const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { recoverPersonalSignature } = require('eth-sig-util');
const { models } = require('../SequelizeInit');
require('dotenv').config();

class UserService {
  static async createChallenge(walletAddress) {
    const challengeText = uuidv4(); // Using UUID for simplicity as a random challenge
    const challenge = await models.Challenge.create({
      wallet_address: walletAddress,
      challenge_text: challengeText,
    });
    return challenge;
  }

  static async verifySignature(walletAddress, signature) {
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
  }

  static async findOrCreateUser(walletAddress) {
    let user = await models.User.findOne({ where: { walletAddress } });
    if (!user) {
      user = await models.User.create({ walletAddress });
    }
    return user;
  }

  static generateJWT(userId, walletAddress) {
    return jwt.sign({ userId, walletAddress }, process.env.SESSION_SECRET, { expiresIn: '1h' });
  }

}

module.exports = UserService;
