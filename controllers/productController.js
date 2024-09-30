const Product = require('../models/product');

const sortProductsByRatings = async (req, res) => {
    try {
        const products = await Product.find().sort({ ratings: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    sortProductsByRatings,
};