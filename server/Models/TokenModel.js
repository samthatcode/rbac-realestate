const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    _marketerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Marketer'
    },
    token: {
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

const Token = mongoose.model("Token", TokenSchema);
module.exports = Token;