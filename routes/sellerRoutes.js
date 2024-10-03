const express = require ('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');


router.get('/getallproducts', sellerController.getAllProducts);
router.put('/update/:id', sellerController.updateSellerProfile);
router.get('/viewProfile/:id', sellerController.getSeller);
router.post('/addProduct', sellerController.addProduct);
router.put('/product/:productId', sellerController.editProduct);
router.get('/sortProducts', sellerController.sortProductsByRatings);
module.exports = router;