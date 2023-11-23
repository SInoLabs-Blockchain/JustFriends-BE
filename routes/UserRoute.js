import express from 'express';
import UserController from '../controllers/UserController.js';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and login
 */

/**
 * @swagger
 * /connect-wallet:
 *   post:
 *     tags: [Users]
 *     summary: Connect a user's wallet and get a challenge
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               walletAddress:
 *                 type: string
 *                 description: The wallet address to connect.
 *     responses:
 *       200:
 *         description: Challenge text for the user to sign.
 *       400:
 *         description: Bad request if the wallet address is not provided.
 */
router.post('/connect-wallet', UserController.connectWallet);

/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Users]
 *     summary: Login with wallet address and signed challenge
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               walletAddress:
 *                 type: string
 *                 description: The wallet address of the user.
 *               signature:
 *                 type: string
 *                 description: The signature of the challenge text.
 *     responses:
 *       200:
 *         description: JWT session key on successful login.
 *       400:
 *         description: Bad request if the wallet address or signature is not provided.
 */
router.post('/login', UserController.login);

/**
 * @swagger
 * /auth-me:
 *   post:
 *     tags: [Users]
 *     summary: Authenticate and get user information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information on successful authentication.
 *       401:
 *         description: Unauthorized if the token is invalid or expired.
 */
router.post('/auth-me', UserController.authMe);

/**
 * @swagger
 * /user:
 *   put:
 *     tags: [Users]
 *     summary: Update user information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               avatarUrl:
 *                 type: string
 *                 description: URL of the user's avatar.
 *               username:
 *                 type: string
 *                 description: New username of the user.
 *               coverUrl:
 *                 type: string
 *                 description: URL of the user's cover image.
 *     responses:
 *       200:
 *         description: User information updated successfully.
 *       400:
 *         description: Bad request if the required fields are not provided.
 */
router.put('/user', UserController.updateUser);

/**
 * @swagger
 * /users/search:
 *   get:
 *     tags: [Users]
 *     summary: Search for users by username or wallet address
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: The username or wallet address to search for.
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
 *         description: A list of users that match the search criteria.
 *       400:
 *         description: Bad request if the search query is not provided.
 */
router.get('/users/search', UserController.searchUsers);

router.post('/users', UserController.getUsersByWalletAddresses);

export default router;