const express = require('express');
const router = express.Router();

const {
    Login,
    Logout,
    createMarketer,
    getMarketer,
    getMarketers,
    updateMarketer,
    getMarketerDashboard,
    generateReferralLink,
    trackReferral,
    deleteMarketer,
} = require('../Controllers/MarketerController');

const {
    verifyTokenAndMarketer,
    marketerRootControllerFunction,
    allowIfMarketer
} = require("../Middlewares/AuthMiddleware");
const { grantAccess } = require('../Controllers/MarketerController');

// Create a new marketer
router.post('/marketers/signup', createMarketer);

// Login for Marketer Dashboard
router.post('/marketers/login', Login);

router.post('/marketers/logout', Logout);

// Get Marketer Dashboard
router.get('/marketers/dashboard', verifyTokenAndMarketer, allowIfMarketer, getMarketerDashboard);

// Get marketer information
router.get('/marketers', verifyTokenAndMarketer, allowIfMarketer, grantAccess('readAny', 'profile'), getMarketers);

// Get marketer information
router.get('/marketers/:marketerId', verifyTokenAndMarketer, allowIfMarketer, grantAccess('readOwn', 'profile'), getMarketer);

// Update marketer details
router.put('/marketers/:marketerId', verifyTokenAndMarketer, allowIfMarketer, grantAccess('updateAny', 'profile'), updateMarketer);

router.delete('/marketers/:marketerId', verifyTokenAndMarketer, allowIfMarketer, grantAccess('deleteAny', 'profile'), deleteMarketer);

// Generate referral link for a marketer
router.get('/marketers/:marketerId/generate-referral-link', verifyTokenAndMarketer, allowIfMarketer, generateReferralLink);

// Track referral and update commission earnings
router.post('/marketers/track-referral', verifyTokenAndMarketer, allowIfMarketer, trackReferral);

router.post('/', verifyTokenAndMarketer, marketerRootControllerFunction);


module.exports = router;
