const express = require("express");
const advertiserController = require('../controllers/advertiserController');
const router = express.Router();


router.get('/hello', advertiserController.advertiser_hello);
router.post('/createProfile/:id', advertiserController.createAdvertiserProfile);
router.put('/updateProfile/:id', advertiserController.updateAdvertiserProfile);
router.get('/viewProfile/:id', advertiserController.getAdvertiserProfile);

router.get('/activities', advertiserController.getAllActivities);
router.get('/activities/:id', advertiserController.getActivity);
router.delete('/activities/:id', advertiserController.deleteActivity);
router.put('/activities/:id', advertiserController.updateActivity);
router.post('/activities', advertiserController.createActivity);

module.exports = router;
