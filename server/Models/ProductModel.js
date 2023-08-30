const mongoose = require('mongoose');
const Schema = mongoose.Schema;
             
const ProductSchema = new Schema({
    
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
    numberOfRooms: {
        type: Number,
        required: true,
    },   
    numberOfBeds: {
        type: Number,
        required: true,
    },
    numberOfBaths: {
        type: Number,
        required: true,
    },
    squareFootage: {
        type: Number,
        required: true,
    },
    images: {
        type: [String], // Array of image URLs
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

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
