const express = require("express");
const productController = require('../controllers/productController');
const router = express.Router();



// Route to get all products


// Route to sort products by ratings
router.get('/sortByRatings', productController.sortProductsByRatings);

module.exports = router;
