const express = require("express");
const touristController= require('../controllers/touristController');
const productController = require('../controllers/productController');

const router = express.Router();

// /tourist
// localhpost:8000/tourist
// router.get('/register', touristController.tourist_hello);
router.get('/getallproducts', productController.getAllProducts);
router.get('/search', touristController.searchTouristAttractions);
router.get('/:id', touristController.getTourist);
router.put('/update/:id',touristController.updateTouristProfile);
module.exports = router;