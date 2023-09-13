const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvestmentSchema = new Schema({  
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true,
    },
    investmentAmount: {
        type: Number,
        required: true
    },
    images: {
        type: [String],
        required: true,
    },
    roiPercentage: {
        type: Number, // Assuming ROI is represented as a percentage (e.g., 10 for 10%)
        required: true
    },
    maturityPeriod: {
        type: String, // You can use 'String' to represent the period (e.g., "5 years")
        required: true
    },
    terms: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Investment = mongoose.model('Investment', InvestmentSchema);

module.exports = Investment;
