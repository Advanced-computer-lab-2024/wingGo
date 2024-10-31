const mongoose = require('mongoose');
const { Schema } = mongoose;  // This imports Schema from mongoose

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number, // This should be quantity instead of price
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: false,
        default: null 
    },
    ratings: {
        type: Number,
        required: false,
        default: 0
    },
    reviews: {
        type: [String], // Array of strings for reviews
        required: false
    },
    sales: { 
        type: Number, 
        default: 0, 
        required: true } 

    }
, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
