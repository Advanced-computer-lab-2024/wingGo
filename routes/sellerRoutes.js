const express = require ('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');

// Route to get a tour guide by id
// router.get('/:id', tourGuideController.getTourGuide);

// Route to update a tour guide by id
// router.put('/update/:id', sellerController.updateSellerProfile);
router.get('/:id', sellerController.getSeller);
module.exports = router;