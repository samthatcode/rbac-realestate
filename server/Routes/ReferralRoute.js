const express = require('express');
const router = express.Router();

const {
  getReferral,
  getReferrals
} = require('../Controllers/ReferralController');

// Get referral information
router.get('/referrals/:referralsId', getReferral);

// Get all referrals
router.get('/referrals', getReferrals);

module.exports = router;
