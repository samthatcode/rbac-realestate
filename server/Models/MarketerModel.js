const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MarketerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    referralLink: {
        type: String,
        unique: true,
    },
    clients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    }],
    referrals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Referral'
    }],
    commissionEarnings: {
        type: Number,
        default: 0,
    },
    referralCode: {
        type: String,
        required: true,
        unique: true
    },
    // Other fields as needed
});

const Marketer = mongoose.model('Marketer', MarketerSchema);

module.exports = Marketer;
