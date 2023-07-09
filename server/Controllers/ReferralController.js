const Referral = require('../Models/ReferralModel');

// Create a new referral
exports.createReferral = async (req, res, next) => {
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
exports.getReferral = async (req, res, next) => {
  try {
    const referralId = req.params.id;
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
exports.trackReferral = async (req, res, next) => {
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

  