const express = require('express');
const router = express.Router();

const {
  createReferral,
  getReferral,
  getReferrals,
  trackReferral,
  getReferralStats
} = require('../Controllers/ReferralController');

// Get referral information
router.get('/referrals/:referralsId', getReferral);

// Get all referrals
router.get('/referrals', getReferrals);

// Track referral
router.post('/track-referrals', trackReferral);

// Get referral information
router.get('/referrals/stats', getReferralStats);

module.exports = router;
