const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer'); // Add multer
const sellerController = require('../controllers/sellerController');
const  upload  = require('../uploadMiddleware');





// Define routes
router.get('/getallproducts', sellerController.getAllProducts);
router.put('/update/:id', sellerController.updateSellerProfile);
router.get('/viewProfile/get/:id', sellerController.getSeller);
router.post('/addProduct', upload.single('picture'), sellerController.addProduct);  // Use multer middleware for file upload
router.put('/product/:productId', upload.single('picture'), sellerController.editProduct);
router.get('/sortProducts', sellerController.sortProductsByRatings);
router.get('/filterProducts', sellerController.filterProduct);
router.post('/createProfile/:id', sellerController.createSellerProfile);
router.get('/searchProductName', sellerController.searchProductsByName);
router.get('/productImage/:id', sellerController.getProductImage);

router.post('/changeLogo/:id', upload.single('file'), sellerController.changeLogo);

module.exports = router;
