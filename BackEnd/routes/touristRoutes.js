const express = require("express");
const touristController= require('../controllers/touristController');

const router = express.Router();

// /tourist
// localhpost:8000/tourist
// router.get('/register', touristController.tourist_hello);
router.get('/getallproducts', touristController.getAllProducts);
// router.get('/search', touristController.searchTouristAttractions);
router.get('/viewProfile/:id', touristController.getTourist);
router.put('/update/:id',touristController.updateTouristProfile);
router.get('/sortProducts', touristController.sortProductsByRatings);
router.get('/filterProducts', touristController.filterProduct);
router.get('/searchProductName', touristController.searchProductsByName);
router.get('/filterPlacesByTag', touristController.filterPlacesByTag);

module.exports = router;