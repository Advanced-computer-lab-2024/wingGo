const express = require('express');
const router = express.Router();
const PlaceController = require('../controllers/GovernorController');


router.post('/createPlace', PlaceController.createPlace);

router.get('/getAllPlaces', PlaceController.getAllPlaces);

router.get('getPlace/:id', PlaceController.getPlaceById);

router.put('updatePlace/:id', PlaceController.updatePlace);

router.delete('/deletePlace/:id', PlaceController.deletePlace);

router.put('/addTag/:id', PlaceController.addTagToPlace);


module.exports = router;