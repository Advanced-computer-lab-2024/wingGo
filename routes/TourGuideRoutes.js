const express = require('express');
const router = express.Router();
const tourGuideController = require('../controllers/TourGuideController');

// Route to get a tour guide by email or username
router.get('/:value', tourGuideController.getTourGuide);

// Route to update a tour guide by email or username
router.put('/update/:value', tourGuideController.updateTourGuideProfile);

module.exports = router;
