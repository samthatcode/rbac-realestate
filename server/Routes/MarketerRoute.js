const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();


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
    approveMarketer
} = require('../Controllers/MarketerController');

const {
    verifyTokenAndMarketer,
    marketerRootControllerFunction,
    allowIfMarketer,
    allowIfLoggedin
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
router.get('/marketers', getMarketers);

// Get marketer information
router.get('/marketers/:marketerId', grantAccess('readOwn', 'profile'), getMarketer);

// Update marketer details
router.put('/marketers/:marketerId', grantAccess('updateOwn', 'profile'), upload.single('profilePicture'), updateMarketer);

router.delete('/marketers/:marketerId', grantAccess('deleteAny', 'profile'), deleteMarketer);

router.post("/marketers/:marketerId/approve", approveMarketer);


// Generate referral link for a marketer
router.get('/marketers/:marketerId/generate-referral-link', verifyTokenAndMarketer, allowIfMarketer, generateReferralLink);

// Track referral and update commission earnings
router.post('/marketers/track-referral', verifyTokenAndMarketer, allowIfMarketer, trackReferral);

router.post('/', verifyTokenAndMarketer, marketerRootControllerFunction);


module.exports = router;
