const express = require('express');
const router = express.Router();

const {
    login, 
    createMarketer,
    getMarketer,
    updateMarketer,
    getMarketerDashboard,
    generateReferralLink,
    trackReferral,
} = require('../Controllers/MarketerController');

const {
    verifyTokenAndUser,
    rootControllerFunction,
    allowIfLoggedin,
    allowIfAdmin,
} = require("../Middlewares/AuthMiddleware");


// Login for Marketer Dashboard
router.post('/login', login);

// Get Marketer Dashboard
router.get('/dashboard', allowIfLoggedin, getMarketerDashboard);

// Create a new marketer
router.post('/marketers', createMarketer);

// Get marketer information
router.get('/marketers/:id', getMarketer);

// Update marketer details
router.put('/marketers/:id', updateMarketer);

// Generate referral link for a marketer
router.post('/marketers/:marketerId/generate-referral-link', allowIfLoggedin, generateReferralLink);

// Track referral and update commission earnings
router.post('/marketers/track-referral', allowIfLoggedin, trackReferral);

router.post('/', verifyTokenAndUser, rootControllerFunction);


module.exports = router;
