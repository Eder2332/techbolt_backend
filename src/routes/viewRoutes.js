const express = require('express');
const { homePage, dashboardPage, purchasePage } = require('../controllers/pageController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', homePage);
router.get('/compra', purchasePage);
router.get('/dashboard', requireAuth, dashboardPage);

module.exports = router;
