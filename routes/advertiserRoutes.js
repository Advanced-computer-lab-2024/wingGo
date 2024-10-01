const express = require("express");
const advertiserController = require('../controllers/advertiserController');
const router = express.Router();


router.get('/hello', advertiserController.advertiser_hello);
router.post('/:id/create', advertiserController.createAdvertiserProfile);
router.put('/:id/update', advertiserController.updateAdvertiserProfile);
router.get('/:id/read', advertiserController.getAdvertiserProfile);

module.exports = router;
