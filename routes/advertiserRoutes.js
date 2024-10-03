const express = require("express");
const advertiserController = require('../controllers/advertiserController');
const router = express.Router();


router.get('/hello', advertiserController.advertiser_hello);
router.post('createProfile/:id', advertiserController.createAdvertiserProfile);
router.put('/updateProfile/:id', advertiserController.updateAdvertiserProfile);
router.get('/viewProfile/:id', advertiserController.getAdvertiserProfile);

module.exports = router;
