// const Product = require('../models/product');
const path = require('path');


const Place = require('../models/Places');

// Filter places by type or historical period
const filterPlacesByTag = async (req, res) => {
    try {
        const { type, historicalPeriod } = req.query; // Get type and historicalPeriod from query parameters

        // Build the filter criteria
        const filter = {};
        if (type) {
            filter['tags.types'] = type;
        }
        if (historicalPeriod) {
            filter['tags.historicalPeriods'] = historicalPeriod;
        }

        // Fetch places that match the filter
        const places = await Place.find(filter);

        if (places.length === 0) {
            return res.status(404).json({ message: 'No places found with the specified tags' });
        }

        res.status(200).json(places);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



module.exports = {
    filterPlacesByTag
};
