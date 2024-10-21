const express = require("express");
const advertiserController = require('../controllers/advertiserController');
const router = express.Router();
const  upload  = require('../uploadMiddleware');

router.get('/hello', advertiserController.advertiser_hello);
router.post('/createProfile/:id', advertiserController.createAdvertiserProfile);
router.put('/updateProfile/:id', advertiserController.updateAdvertiserProfile);
router.get('/viewProfile/:id', advertiserController.getAdvertiserProfile);

router.get('/activities', advertiserController.getAllActivities);
router.get('/activities/:id', advertiserController.getActivity);
router.delete('/activities/:id', advertiserController.deleteActivity);
router.put('/activities/:id', advertiserController.updateActivity);
router.post('/activities', advertiserController.createActivity);

router.post('/uploadLogo/:id', upload.single('file'), advertiserController.changeLogo);
router.put('/acceptterms/:id', advertiserController.acceptTerms);

router.put('/changePassword/:id', advertiserController.changePassword); // Define route for password change

module.exports = router;
