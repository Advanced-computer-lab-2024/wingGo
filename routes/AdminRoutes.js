const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');

// Route to approve a pending user by id
router.put('/approve/:id', adminController.approvePendingUserById);

// Route to delete an account by id
router.delete('/deleteAccount/:id', adminController.deleteAccount);

router.post('/addGovernor', adminController.addTourismGovernor);
module.exports = router;
