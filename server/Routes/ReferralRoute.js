const express = require('express');
const router = express.Router();

const {
  createReferral,
  getReferral,
  trackReferral,
  getReferralStats
} = require('../Controllers/ReferralController');

// Create a new referral
router.post('/referrals', createReferral);

// Get referral information
router.get('/referrals/:referralsId', getReferral);

// Track referral
router.post('/track-referrals', trackReferral);

// Get referral information
router.get('/referrals/stats', getReferralStats);

module.exports = router;
