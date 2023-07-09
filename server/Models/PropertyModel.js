const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropertySchema  = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: { // added category field
        type: Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date(),
    }
});

const Property = mongoose.model('Property', PropertySchema);

module.exports = Property;
