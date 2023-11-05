const UserService = require('../services/UserService');

class UserController {
  static async connectWallet(req, res) {
    try {
      const { walletAddress } = req.body;
      if (!walletAddress) {
        return res.status(400).json({ message: 'Wallet address is required' });
      }
      const challenge = await UserService.createChallenge(walletAddress);
      return res.status(200).json({ challenge: challenge.challenge_text });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

static async login(req, res) {
    try {
      const { walletAddress, signature } = req.body;

      // Verify the signature
      await UserService.verifySignature(walletAddress, signature);

      // Find or create the user
      const user = await UserService.findOrCreateUser(walletAddress);

      // Generate a session key (JWT)
      const sessionKey = UserService.generateJWT(user.userId, walletAddress);

      return res.json({ sessionKey });
    } catch (error) {
      return res.status(error.message === 'Challenge not found.' ? 404 : 401).send(error.message);
    }
  }
}

module.exports = UserController;
