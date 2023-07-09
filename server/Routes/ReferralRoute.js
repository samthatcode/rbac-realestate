const express = require('express');
const router = express.Router();

const {
  createReferral,
  getReferral,
  trackReferral
} = require('../Controllers/ReferralController');

// Create a new referral
router.post('/referrals', createReferral);

// Get referral information
router.get('/referrals/:id', getReferral);

// Track referral
router.post('/referrals/track', trackReferral);

module.exports = router;
