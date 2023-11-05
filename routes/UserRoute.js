const express = require('express');
const UserController = require('../controllers/UserController');
const router = express.Router();

router.post('/connect-wallet', UserController.connectWallet);
router.post('/login', UserController.login);

module.exports = router;
