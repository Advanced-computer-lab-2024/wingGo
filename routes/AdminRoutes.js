const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');

router.get('/getallproducts', adminController.getAllProducts);

// Route to approve a pending user by id
router.put('/approve/:id', adminController.approvePendingUserById);

// Route to delete an account by id
router.delete('/deleteAccount/:id', adminController.deleteAccount);
router.put('/product/:productId', adminController.editProduct);
router.post('/addGovernor', adminController.addTourismGovernor);
//create an activity category
router.post('/categories', adminController.createCategory);

// Get all activity categories
router.get('/getcategories', adminController.getCategories);
router.get('/sortProducts', adminController.sortProductsByRatings);

// Get one activity category by ID
router.get('/getcategory/:id', adminController.getCategory);

// Update an activity category by ID
router.put('/updatecategory/:id', adminController.updateCategory);

// Delete an activity category by ID
router.delete('/deletecategory/:id', adminController.deleteCategory);

// Route to add a new admin
router.post('/add-admin', adminController.addAdmin);
router.get('/filterProducts', adminController.filterProduct);


module.exports = router;
