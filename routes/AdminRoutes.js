const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');

// Route to approve a pending user by id
router.put('/approve/:id', adminController.approvePendingUserById);

// Route to delete an account by id
router.delete('/deleteAccount/:id', adminController.deleteAccount);

router.post('/addGovernor', adminController.addTourismGovernor);
//create an activity category
router.post('/categories', adminController.createCategory);

// Get all activity categories
router.get('/categories', adminController.getCategories);

// Get one activity category by ID
router.get('/categories/:id', adminController.getCategory);

// Update an activity category by ID
router.put('/categories/:id', adminController.updateCategory);

// Delete an activity category by ID
router.delete('/categories/:id', adminController.deleteCategory);
module.exports = router;
