const Referral = require('../Models/ReferralModel');
const mongoose = require('mongoose');

// Get referral information
module.exports.getReferral = async (req, res, next) => {
  try {
    const referralId = req.params.referralId;
    const referral = await Referral.findById(referralId)
      .populate('referringMarketer')
      .populate('referredClient');

    if (!referral) {
      return res.status(404).json({ error: 'Referral not found' });
    }

    res.status(200).json({ data: referral });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get all referrals
module.exports.getReferrals = async (req, res, next) => {
  try {
    let referringMarketerId = req.query.referringMarketerId;
    let query = {};

    if (!referringMarketerId) {
      console.log('No referring marketer id provided');
      return res.status(400).json({ message: 'No referring marketer id provided' });
    }

    // Convert referringMarketerId to ObjectId
    referringMarketerId = mongoose.Types.ObjectId(referringMarketerId);
    query.referringMarketer = referringMarketerId;

    const referrals = await Referral.find(query)
      .populate('referringMarketer')
      .populate('referredClient');
    
    // Calculate the total number of referrals
    const referralCount = referrals.length;

    // Assume a fixed commission of \$10 per referral
    const commissionPerReferral = 10;

    // Calculate the total commission earned
    const commissionEarned = referralCount * commissionPerReferral;

    res.status(200).json({
      message: 'Referrals fetched successfully',
      data: referrals,
      stats: {
        referralCount,
        commissionEarned
      }
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
