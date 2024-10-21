const express = require('express');
const router = express.Router();
const PlaceController = require('../controllers/GovornorController');



router.post('/createPlace', PlaceController.createPlace);

router.get('/getAllPlaces', PlaceController.getAllPlaces);

router.get('/getPlace/:id', PlaceController.getPlaceById);

router.put('/updatePlace/:id', PlaceController.updatePlace);

router.delete('/deletePlace/:id', PlaceController.deletePlace);

///// dont use ////////////////////////
router.put('/addTag/:id', PlaceController.addTagToPlace);
///////////////////////////////////////

router.get('/hello', PlaceController.hello);

// Create a new preference tag
router.post('/preferences', PlaceController.createPreferenceTag);
// Add Tag updated
router.put('/addTagUpdated/:id', PlaceController.addTagUpdated);

router.put('/changePassword/:id', PlaceController.changePassword); // Define route for password change

module.exports = router;