const express = require("express");
const guestController = require('../controllers/guestController');
const router = express.Router();



// Route to get all products


// Route to sort products by ratings
router.get('/hello', guestController.guest_hello);

router.get('/filterPlacesByTag', guestController.filterPlacesByTag);


module.exports = router;
