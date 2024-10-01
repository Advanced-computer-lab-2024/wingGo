const express = require("express");
const productController = require('../controllers/productController');
const router = express.Router();

router.get('/sortByRatings', productController.sortProductsByRatings);

module.exports = router;