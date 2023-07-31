const mongoose = require('mongoose');
const { Schema } = mongoose;

const VerificationCodeSchema = new Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    code: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 43200
    }
});

const VerificationCode = mongoose.model("VerificationCode", VerificationCodeSchema);
module.exports = VerificationCode;