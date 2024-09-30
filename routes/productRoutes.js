const express = require("express");
const productController = require('../controllers/productController');
const router = express.Router();

router.get('/sort-by-ratings', productController.sortProductsByRatings);

module.exports = router;