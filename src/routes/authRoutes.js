const express = require('express');
const { showRegisterPage, showLoginPage } = require('../controllers/pageController');
const {
  register,
  login,
  logout,
  me
} = require('../controllers/authController');

const router = express.Router();

router.get('/register', showRegisterPage);
router.post('/register', register);
router.get('/login', showLoginPage);
router.post('/login', login);
router.get('/me', me);
router.post('/logout', logout);

module.exports = router;
