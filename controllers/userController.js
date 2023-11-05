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

  static async authMe (req, res) {
    try {
      // req.user được thiết lập bởi middleware xác thực
      const user = await UserService.getUserById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Trả về thông tin user nhưng loại bỏ thông tin nhạy cảm
      const userData = user.get();
      res.json(userData);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = UserController;
