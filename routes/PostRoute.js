import express from 'express';
import PostController from '../controllers/PostController.js';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post creation and management
 */

/**
 * @swagger
 * /post:
 *   post:
 *     tags: [Posts]
 *     summary: Create a new post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - type
 *             properties:
 *               content:
 *                 type: string
 *                 description: Content of the post.
 *               type:
 *                 type: string
 *                 description: Type of the post (paid or free).
 *               preview:
 *                 type: string
 *                 description: Preview of the post (required if type is paid).
 *     responses:
 *       201:
 *         description: Post created successfully.
 *       400:
 *         description: Bad request if the required fields are not provided.
 */
router.post('/post', PostController.createPost);

/**
 * @swagger
 * /posts/search:
 *   get:
 *     tags: [Posts]
 *     summary: Search for posts by content
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: The content to search for in posts.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results per page.
 *     responses:
 *       200:
 *         description: A list of posts that match the search criteria.
 *       400:
 *         description: Bad request if the search query is not provided.
 */
router.get('/posts/search', PostController.searchPosts);

router.post('/posts', PostController.getPosts);

export default router;