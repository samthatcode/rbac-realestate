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

    console.log('Referring marketer ID:', referringMarketerId);  
    console.log('Query object:', query);  

    const referrals = await Referral.find(query)
      .populate('referringMarketer')
      .populate('referredClient');
    console.log('Fetched referrals:', referrals);  
    res.status(200).json({
      message: 'Referrals fetched successfully',
      data: referrals
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};




// Handle referral tracking
module.exports.trackReferral = async (req, res, next) => {
  try {
    const { referringMarketerId, referredClientId } = req.body;

    // Create a new referral record
    const referral = await Referral.create({
      referringMarketer: referringMarketerId,
      referredClient: referredClientId
    });

    res.status(201).json({
      message: 'Referral tracked successfully',
      data: referral
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get referral statistics
module.exports.getReferralStats = async (req, res, next) => {
  console.log('getReferralStats called');
  try {
    const marketerId = req.query.marketerId;

    if (!marketerId) {
      return res.status(400).json({ error: 'marketerId is required' });
    }
    // Find all referrals
    const referrals = await Referral.find({ referringMarketer: req.query.marketerId });

    // Calculate the total number of referrals
    const referralCount = referrals.length;

    // Assume a fixed commission of \$10 per referral
    const commissionPerReferral = 10;

    // Calculate the total commission earned
    const commissionEarned = referralCount * commissionPerReferral;

    res.status(200).json({
      data: {
        referralCount,
        commissionEarned
      }
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
