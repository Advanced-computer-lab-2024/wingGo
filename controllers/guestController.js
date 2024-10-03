// const Product = require('../models/product');
const path = require('path');

const guest_hello = (req, res) => {
    console.log('guest route hit!'); // Add this log
    res.send('<h1>yayy Guest</h1>');
};

const guestFilterPlaces = (req, res) => {
    console.log('guest route hit in filter!'); // Add this log
    res.send('<h1>yayy Guest</h1>');
};


module.exports = {
    guest_hello,
    guestFilterPlaces
};
