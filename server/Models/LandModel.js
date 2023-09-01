const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LandSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    location: {
        type: String,
        required: true,
    },
    acreage: {
        type: Number,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date(),
    }
});

const Land = mongoose.model('Land', LandSchema);

module.exports = Land;
