const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer'); // Add multer for handling file uploads
const adminController = require('../controllers/AdminController');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/'); // Save in 'images' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Save file with a unique name
    }
});

const upload = multer({ storage: storage });

// Routes for handling products and file uploads
router.get('/getallproducts', adminController.getAllProducts);

// Route to add a product with image (multer)
router.post('/add-product', upload.single('picture'), adminController.addProductAsAdmin);

// Route to edit a product with image (multer)
router.put('/product/:productId', upload.single('picture'), adminController.editProduct);

// Route to approve a pending user by id
router.put('/approve/:id', adminController.approvePendingUserById);

// Route to get pending users
router.get('/pending-users', adminController.getPendingUsers);

// Route to delete a pending user by id
router.delete('/pending-users/:id', adminController.deletePendingUserById);

// Route to delete an account by id
router.delete('/deleteAccount/:id', adminController.deleteAccount);

// Route to add a new governor
router.post('/addGovernor', adminController.addTourismGovernor);

// Route to create a category
router.post('/categories', adminController.createCategory);

// Route to get all categories
router.get('/getcategories', adminController.getCategories);

// Route to get one category by ID
router.get('/getcategory/:id', adminController.getCategory);

// Route to update a category by ID
router.put('/updatecategory/:id', adminController.updateCategory);

// Route to delete a category by ID
router.delete('/deletecategory/:id', adminController.deleteCategory);

// Route to sort products by ratings
router.get('/sortProducts', adminController.sortProductsByRatings);

// Route to filter products by price
router.get('/filterProducts', adminController.filterProduct);

// Route to search products by name
router.get('/searchProductName', adminController.searchProductsByName);

// Route to add tags to attractions
router.put('/attractions/:id/addTags', adminController.addTag);

// Route to get all tags for an attraction
router.get('/attractions/:id/tags', adminController.getTags);

// Route to update tags for an attraction
router.put('/attractions/:id/updateTags', adminController.updateTag);

// Route to delete a tag from an attraction
router.put('/attractions/:id/deleteTag', adminController.deleteTag);

// Route to add a new admin
router.post('/add-admin', adminController.addAdmin);

module.exports = router;
