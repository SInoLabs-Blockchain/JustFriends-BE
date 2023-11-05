const express = require('express');
const UserController = require('../controllers/UserController');
const router = express.Router();

router.post('/connect-wallet', UserController.connectWallet);
router.post('/login', UserController.login);
router.post('/auth-me', UserController.authMe);
router.put('/', UserController.updateUser);

module.exports = router;
