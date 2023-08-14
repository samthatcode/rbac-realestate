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
    getInactiveMarketers,
    approveMarketer
} = require('../Controllers/MarketerController');

const {
    verifyTokenAndMarketer,
    marketerRootControllerFunction,
    allowIfMarketer,
    allowIfAdmin,
    verifyTokenAndUser, allowIfLoggedin,
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
router.get('/marketers', allowIfAdmin, verifyTokenAndUser, allowIfLoggedin, grantAccess('readAny', 'profile'), getMarketers);

// Get marketer information
router.get('/marketers/:marketerId', verifyTokenAndMarketer, allowIfMarketer, grantAccess('readOwn', 'profile'), getMarketer);

// Update marketer details
router.put('/marketers/:marketerId', allowIfAdmin, verifyTokenAndUser, allowIfLoggedin, grantAccess('updateAny', 'profile'), updateMarketer);

router.delete('/marketers/:marketerId', allowIfAdmin, verifyTokenAndUser, allowIfLoggedin, grantAccess('deleteAny', 'profile'), deleteMarketer);

router.get("/marketers/inactive", allowIfAdmin, verifyTokenAndUser, allowIfLoggedin, getInactiveMarketers);

router.post("/marketers/:marketerId/approve", allowIfAdmin, verifyTokenAndUser, allowIfLoggedin, approveMarketer);


// Generate referral link for a marketer
router.get('/marketers/:marketerId/generate-referral-link', verifyTokenAndMarketer, allowIfMarketer, generateReferralLink);

// Track referral and update commission earnings
router.post('/marketers/track-referral', verifyTokenAndMarketer, allowIfMarketer, trackReferral);

router.post('/', verifyTokenAndMarketer, marketerRootControllerFunction);


module.exports = router;
