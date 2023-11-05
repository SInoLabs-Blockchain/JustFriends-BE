const UserService = require('../services/UserService');
const { models } = require('../SequelizeInit');
const { recoverPersonalSignature } = require('eth-sig-util');
const { ethers } = require('ethers')

jest.mock('../SequelizeInit', () => ({
  models: {
    Challenge: {
      findOne: jest.fn(),
      destroy: jest.fn(),
    },
  },
}));

jest.mock('eth-sig-util', () => ({
  recoverPersonalSignature: jest.fn(),
}));

describe('UserService', () => {
  describe('verifySignature', () => {
    it('should verify the signature correctly', async () => {
      // Setup
      const walletAddress = '0x123';
      const signature = 'signature';
      const challengeText = 'challengeText';
      const mockChallenge = { challenge_text: challengeText };

      models.Challenge.findOne.mockResolvedValue(mockChallenge);
      recoverPersonalSignature.mockReturnValue(walletAddress);

      // Execute
      const result = await UserService.verifySignature(walletAddress, signature);

      // Assert
      expect(models.Challenge.findOne).toHaveBeenCalledWith({ where: { wallet_address: walletAddress } });
      expect(recoverPersonalSignature).toHaveBeenCalledWith({
        data: challengeText,
        sig: signature,
      });
      expect(result).toBe(true);
      expect(models.Challenge.destroy).toHaveBeenCalledWith({ where: { wallet_address: walletAddress } });
    });

    it('should throw an error if the challenge is not found', async () => {
      // Setup
      const walletAddress = '0x123';
      const signature = 'signature';

      models.Challenge.findOne.mockResolvedValue(null);

      // Execute & Assert
      await expect(UserService.verifySignature(walletAddress, signature))
        .rejects
        .toThrow('Challenge not found.');
    });

    it('should throw an error if the signature does not match', async () => {
      // Setup
      const walletAddress = '0x123';
      const signature = 'signature';
      const challengeText = 'challengeText';
      const mockChallenge = { challenge_text: challengeText };
      const incorrectWalletAddress = '0x456';

      models.Challenge.findOne.mockResolvedValue(mockChallenge);
      recoverPersonalSignature.mockReturnValue(incorrectWalletAddress);

      // Execute & Assert
      await expect(UserService.verifySignature(walletAddress, signature))
        .rejects
        .toThrow('Signature verification failed.');
    });

    it('should return true for a valid signature', async () => {
			// Given a challenge text
			const challengeText = 'Please sign this message to log in.';

			// Create a new wallet
			const wallet = ethers.Wallet.createRandom();
			console.log('New Wallet Address:', wallet.address);

			// Sign the challenge text with the new wallet
			const signature = await wallet.signMessage(challengeText);

			// Mock the Challenge model's findOne method to return the challenge text
			models.Challenge.findOne.mockResolvedValue({ challenge_text: challengeText, wallet_address: wallet.address });

			// When calling verifySignature
			const result = await UserService.verifySignature(wallet.address, signature);

			// Then it should return true
			expect(result).toBe(true);
			expect(models.Challenge.findOne).toHaveBeenCalledWith({ where: { wallet_address: wallet.address } });
    });
  });

 describe('updateUser', () => {
    it('should update the user with given data', async () => {
      const userId = 1;
      const updateData = {
        avatarUrl: 'http://example.com/avatar.jpg',
        username: 'updateduser',
        coverUrl: 'http://example.com/cover.jpg'
      };

      // Mock the findByPk method to simulate Sequelize behavior
      User.findByPk.mockResolvedValue({
        ...updateData,
        update: jest.fn().mockResolvedValue([1])
      });

      // Call the updateUser method
      const result = await UserService.updateUser(userId, updateData);

      // Check if the findByPk was called with the correct userId
      expect(User.findByPk).toHaveBeenCalledWith(userId);

      // Check if the update method was called with the correct data
      expect(result.update).toHaveBeenCalledWith(updateData);

      // Check if the result contains the updated data
      expect(result).toMatchObject(updateData);
    });

    it('should throw an error if user is not found', async () => {
      const userId = 2;
      const updateData = {
        avatarUrl: 'http://example.com/avatar.jpg',
        username: 'updateduser',
        coverUrl: 'http://example.com/cover.jpg'
      };

      // Mock the findByPk method to return null
      User.findByPk.mockResolvedValue(null);

      // Expect the updateUser method to throw an error
      await expect(UserService.updateUser(userId, updateData)).rejects.toThrow('User not found');
    });
  });
});
