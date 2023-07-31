const Referral = require('../Models/ReferralModel');
const Marketer = require('../Models/MarketerModel');
const Client = require('../Models/ClientModel');

// Create a new referral
module.exports.createReferral = async (req, res, next) => {
  try {
    const { referringMarketerId, referredClientId } = req.body;

    // Check if the referring marketer or referred client exists
    const referringMarketer = await Marketer.findById(referringMarketerId);
    const referredClient = await Client.findById(referredClientId);

    if (!referringMarketer) {
      return res.status(404).json({ error: 'Referring marketer not found' });
    }

    if (!referredClient) {
      return res.status(404).json({ error: 'Referred client not found' });
    }

    const referral = await Referral.create({
      referringMarketer: referringMarketerId,
      referredClient: referredClientId
    });

    res.status(201).json({
      message: 'Referral created successfully',
      data: referral
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

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
  try {
    // Find all referrals
    const referrals = await Referral.find();

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
