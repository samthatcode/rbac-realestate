const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const MarketerSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Your password is required"],
    },
    firstName: {
        type: String,
        required: [true, "Your first name is required"],
    },
    lastName: {
        type: String,
        required: [true, "Your last name is required"],
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    stateProvince: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    profession: {
        type: String,
        required: true
    },
    discoverySource: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: "", // default value can be a URL to a default profile picture
    },
    referralLink: {
        type: String,
        required: true,
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
    role: {
        type: String,
        default: 'marketer',
    },
    referralCode: {
        type: String,
        required: true,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
    paymentMade: {
        type: Boolean,
        default: false
    },
    token: {
        type: String
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    // Other fields as needed
});

MarketerSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }

        const hashedPassword = await bcrypt.hash(this.password, 12);
        this.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});

const Marketer = mongoose.model('Marketer', MarketerSchema);

module.exports = Marketer;
