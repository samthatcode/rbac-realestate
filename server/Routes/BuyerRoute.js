const express = require('express');
const router = express.Router();

const { 
    redirectFirstTimeBuyer,
    getBuyerDashboard,
    purchaseProduct,
    viewPurchaseHistory,
    viewInvestmentPortfolio, } = require('../Controllers/BuyerController');
    
const { allowIfLoggedin } = require('../Middlewares/AuthMiddleware');

// Redirect first-time buyers
router.get('/redirect', redirectFirstTimeBuyer);

// Buyer dashboard
router.get('/dashboard', allowIfLoggedin, getBuyerDashboard);

// Purchase a product
router.post('/purchase', allowIfLoggedin, purchaseProduct);

// View purchase history
router.get('/purchase-history', allowIfLoggedin, viewPurchaseHistory);

// View investment portfolio
router.get('/investment-portfolio', allowIfLoggedin, viewInvestmentPortfolio);

module.exports = router;
