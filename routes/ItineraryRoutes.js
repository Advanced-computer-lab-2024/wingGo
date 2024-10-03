// routes/ItineraryRoutes.js
const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/ItineraryController');

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

module.exports = router;