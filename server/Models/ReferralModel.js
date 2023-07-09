const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReferralSchema = new Schema({
  referringMarketer: {
    type: Schema.Types.ObjectId,
    ref: 'Marketer',
    required: true
  },
  referredClient: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  referralDate: {
    type: Date,
    default: Date.now
  },
  // Other fields as needed
});

const Referral = mongoose.model('Referral', ReferralSchema);

module.exports = Referral;
