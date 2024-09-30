const express = require('express');
const router = express.Router();
const tourGuideController = require('../controllers/TourGuideController');

// Route to get a tour guide by id
router.get('/:id', tourGuideController.getTourGuide);

// Route to update a tour guide by id
router.put('/update/:id', tourGuideController.updateTourGuideProfile);

module.exports = router;
