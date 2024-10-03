const express = require ('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const productController = require('../controllers/productController');

router.get('/getallproducts', productController.getAllProducts);

router.put('/update/:id', sellerController.updateSellerProfile);
router.get('/viewProfile/:id', sellerController.getSeller);
router.post('/addProduct', sellerController.addProduct);
router.put('/product/:productId', sellerController.editProduct);
module.exports = router;