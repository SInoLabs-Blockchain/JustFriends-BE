import UserService from '../services/UserService';
import { models } from '../SequelizeInit';
import { recoverPersonalSignature } from 'eth-sig-util';
import { ethers } from 'ethers';

jest.mock('../SequelizeInit', () => ({
  models: {
    Challenge: {
      findOne: jest.fn(),
      destroy: jest.fn(),
    },
    User: {
      findByPk: jest.fn(),
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
});