const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');

// Admin route to approve a pending user by username or email
router.put('/approve', adminController.approvePendingUserByField);

// Admin route to delete an account by username
router.delete('/delete-account/:username', adminController.deleteAccount);

module.exports = router;
