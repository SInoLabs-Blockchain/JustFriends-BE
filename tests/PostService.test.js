import { PostService } from '../services/PostService';
import { Post } from '../SequelizeInit';
import crypto from 'crypto';

// Mock the Post model
jest.mock('../models', () => ({
  Post: {
    create: jest.fn()
  }
}));

// Mock the crypto module
jest.mock('crypto', () => ({
  createHash: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  digest: jest.fn().mockReturnValue('mocked-hash')
}));

describe('PostService', () => {
  describe('createPost', () => {
    it('should create a new post with the correct parameters', async () => {
      const postData = {
        userId: 1,
        content: 'Test content',
        type: 'free'
      };

      // Mock the create method to simulate Sequelize behavior
      Post.create.mockResolvedValue({
        ...postData,
        postId: 1,
        contentHash: 'mocked-hash',
        preview: 'Test'
      });

      // Call the createPost method
      const newPost = await PostService.createPost(postData);

      // Check if the create method was called with the correct parameters
      expect(Post.create).toHaveBeenCalledWith({
        ...postData,
        contentHash: 'mocked-hash',
        preview: expect.any(String) // Since the preview is generated dynamically
      });

      // Check if the new post has the 'mocked-hash' as its contentHash
      expect(newPost.contentHash).toBe('mocked-hash');
    });

    it('should throw an error if content exceeds 1000 characters', async () => {
      const postData = {
        userId: 1,
        content: 'a'.repeat(1001), // Content with 1001 characters
        type: 'free'
      };

      // Expect the createPost method to throw an error
      await expect(PostService.createPost(postData)).rejects.toThrow('Content size exceeds the limit of 1000 characters.');
    });
  });
});