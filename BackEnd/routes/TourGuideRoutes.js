const express = require('express');
const router = express.Router();
const tourGuideController = require('../controllers/TourGuideController');
const itineraryController = require('../controllers/TourGuideController');

// Create a new itinerary
router.post('/Createitinerary', itineraryController.createItinerary);

// Get all itineraries for a tour guide
router.get('/getitinerary/:id', itineraryController.getItineraries);

router.get('/getALLitineraries', itineraryController.getAllItineraries);

router.get('/itineraries/tourGuide/:tourGuideId', itineraryController.getItinerariesByTourGuide);
// Update an itinerary
router.put('/Updateitinerary/:id', itineraryController.updateItinerary);

// Delete an itinerary (only if no bookings exist)
router.delete('/Deleteitinerary/:id', itineraryController.deleteItinerary);

// Route to get a tour guide by id
router.get('/fetch/:id', tourGuideController.getTourGuide);

// Route to update a tour guide by id
router.put('/update/:id', tourGuideController.updateTourGuideProfile);

module.exports = router;
