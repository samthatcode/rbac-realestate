const express = require('express');
const router = express.Router();

const { verifyUserEmail, verifyMarketerEmail, verifyCode } = require('../Controllers/VerifyEmailController');
const { forgotPassword, resetPassword } = require('../Controllers/UserController');

const {
    allowIfAdmin,
    verifyTokenAndUser,
    allowIfLoggedin
} = require("../Middlewares/AuthMiddleware");

router.get('/verify-user-email-token', verifyUserEmail);
router.get('/verify-marketer-email-token', verifyMarketerEmail);

router.post('/forgot-password', forgotPassword);
router.post('/reset/:resetToken', resetPassword);
// router.post('/verify-code', verifyTokenAndUser, verifyCode);

module.exports = router;
