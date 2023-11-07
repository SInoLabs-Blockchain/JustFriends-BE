import UserService from '../services/UserService.js';

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
      await UserService.verifySignature(walletAddress, signature);
      const user = await UserService.findOrCreateUser(walletAddress);
      const sessionKey = UserService.generateJWT(user.userId, walletAddress);
      return res.json({ sessionKey });
    } catch (error) {
      return res.status(error.message === 'Challenge not found.' ? 404 : 401).send(error.message);
    }
  },

  authMe: async (req, res) => {
    try {
      const user = await UserService.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const userData = user.get();
      res.json(userData);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  updateUser: async (req, res) => {
    try {
      const userId = req.user.id;
      const { avatarUrl, username, coverUrl } = req.body;
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

export default UserController;
