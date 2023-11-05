const UserService = require('../services/UserService');

const UserController = {
  connectWallet: async(req, res) => {
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
  },

  login: async (req, res) => {
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
  },

  authMe: async (req, res) => {
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
  },

  updateUser: async (req, res) => {
    try {
      const userId = req.user.id; // Lấy ID người dùng từ JWT token sau khi đã xác thực
      const { avatarUrl, username, coverUrl } = req.body;

      // Cập nhật thông tin người dùng
      const updatedUser = await UserService.updateUser(userId, { avatarUrl, username, coverUrl });
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  searchUsers: async (req, res) => {
    try {
      const { searchQuery } = req.query;
      const page = parseInt(req.query.page, 10) || 1;
      const results = await UserService.searchUsers(searchQuery, page);

      res.json(results);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
}

module.exports = UserController;
