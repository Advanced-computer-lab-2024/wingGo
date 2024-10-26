const express = require("express");
const touristController= require('../controllers/touristController');

const router = express.Router();

// /tourist
// localhpost:8000/tourist
router.get('/register', touristController.tourist_hello);
router.get('/getallproducts', touristController.getAllProducts);
//router.get('/search', touristController.searchTouristAttractions);
router.get('/viewProfile/:id', touristController.getTourist);
router.put('/update/:id',touristController.updateTouristProfile);
router.get('/sort-upcoming', touristController.sortUpcomingActivityOrItineraries);


router.get('/sortProducts', touristController.sortProductsByRatings);
router.get('/filterProducts', touristController.filterProduct);
router.get('/searchProductName', touristController.searchProductsByName);



router.get('/filterPlacesByTag', touristController.filterPlacesByTag);
// router.get('/viewActivities',touristController.viewTouristActivities);
// router.get('/viewItineraries',touristController.viewTouristItineraries);
router.get('/viewActivities', touristController.getAllUpcomingActivities);
router.get('/viewItineraries', touristController.getAllUpcomingIteneries);
router.get('/viewPlaces',touristController.getAllUpcomingPlaces);

router.get('/viewUpcoming',touristController.getAllUpcomingEvents);

router.get('/filterActivities',touristController.filterUpcomingActivities);
router.get('/filterItineraries',touristController.filterItineraries);


router.get('/sort', touristController.sortUpcomingActivityOrItineraries);

router.get('/search', touristController.searchAllModels);
router.get('/itineraries', touristController.filterItineraries);
router.post('/complaints/:id', touristController.addComplaint);

router.get('/viewmycomplaints/:id', touristController.viewComplaints);

router.put('/:id/preferences', touristController.addPreferencesToTourist);

router.put('/changePassword/:id', touristController.changePassword); // Define route for password change
router.post('/bookItinerary/:touristId/:itineraryId', touristController.bookItinerary);
router.delete('/cancelItinerary/:touristId/:itineraryId', touristController.cancelItinerary);
router.put('/redeemPoints/:touristId', touristController.redeemPoints);
router.post('/bookActivity/:touristId/:activityId', touristController.bookActivity);
router.delete('/cancelActivity/:touristId/:activityId', touristController.cancelActivity);

module.exports = router;