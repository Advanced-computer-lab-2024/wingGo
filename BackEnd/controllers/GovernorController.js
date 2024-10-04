const Place = require('../models/Places');

// Create a new place
const createPlace = async (req, res) => {
    try {
        const { governerId, types, historicalPeriods, ...placeData } = req.body.tags || {}; // Extract tags separately

        // Validate types
        const allowedTypes = ['Monuments', 'Museums', 'Religious Sites', 'Palaces/Castles'];
        if (types && types.some(type => !allowedTypes.includes(type))) {
            return res.status(400).json({ message: 'Invalid type in types array. Allowed values are Monuments, Museums, Religious Sites, Palaces/Castles.' });
        }

        // Create a new place with validated tags
        const place = new Place({
            ...req.body,  // Spread the rest of the place data (e.g., name, description, location)
            tags: {
                types: types || [],  // Use an empty array if types are missing
                historicalPeriods: historicalPeriods || []  // Use an empty array if historicalPeriods are missing
            }
        });

        await place.save();
        res.status(201).json(place);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


// Get all places
const getAllPlaces = async (req, res) => {

    const {governerId} = req.query;
    try {
        const places = await Place.find({governerId});
        res.json(places);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get place by ID
const getPlaceById = async (req, res) => {

    const {governerId} = req.query;
    const {id} = req.params;
    try {
        
        const place = await Place.findOne({governerId, _id: id});
        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }
        res.json(place);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const hello = async (req, res) => {
  
        console.log('in hello ');
        res.send('<h1>yayy govornor</h1>');
      
};

// Update an existing place
const updatePlace = async (req, res) => {

    const {governerId} = req.query;
    try {
        const { types, historicalPeriods, ...placeData } = req.body;

        // Validate types if provided
        const allowedTypes = ['Monuments', 'Museums', 'Religious Sites', 'Palaces/Castles'];
        if (types && types.some(type => !allowedTypes.includes(type))) {
            return res.status(400).json({ message: 'Invalid type in types array. Allowed values are Monuments, Museums, Religious Sites, Palaces/Castles.' });
        }

        // Find the place by ID and update with the new data
        const place = await Place.findOne({governerId, _id: req.params.id});
        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }

        if(req.body.governerId){
            req.body.governerId.delete;
        }

        // Update place data
        Object.assign(place, placeData);

        // Explicitly update tags (types and historicalPeriods)
        if (types) {
            place.tags.types = types;
        }
        if (historicalPeriods) {
            place.tags.historicalPeriods = historicalPeriods;
        }

        await place.save();
        res.json(place);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


// Delete a place
const deletePlace = async (req, res) => {

    const {governerId} = req.query;
    try {
        const place = await Place.findOneAndDelete({governerId, _id: req.params.id});
        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }
        res.status(204).send();  // No content response
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a tag to a place (already provided in previous response)
const addTagToPlace = async (req, res) => {

    const {governerId} = req.query;
    try {
        const place = await Place.findOne({governerId, _id: req.params.id});
        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }

        const { tag, category } = req.body;  // Get the tag and its category (type or historical period) from the request body

        // Check if it's a type or a historical period
        if (category === 'type') {
            // Ensure the tag is one of the allowed types
            const allowedTypes = ['Monuments', 'Museums', 'Religious Sites', 'Palaces/Castles'];
            if (!allowedTypes.includes(tag)) {
                return res.status(400).json({ message: 'Invalid type. Allowed values are Monuments, Museums, Religious Sites, Palaces/Castles.' });
            }

            // Add the tag to the types array
            if (!place.tags.types.includes(tag)) {
                place.tags.types.push(tag);
            } else {
                return res.status(400).json({ message: 'Type already exists for this place.' });
            }
        } else if (category === 'historicalPeriod') {
            // Add the tag to the historicalPeriods array (no validation needed here)
            if (!place.tags.historicalPeriods.includes(tag)) {
                place.tags.historicalPeriods.push(tag);
            } else {
                return res.status(400).json({ message: 'Historical period already exists for this place.' });
            }
        } else {
            return res.status(400).json({ message: 'Invalid category. Must be either "type" or "historicalPeriod".' });
        }

        await place.save();  // Save the updated place with the new tag
        res.status(200).json(place);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    createPlace,
    getAllPlaces,
    getPlaceById,
    updatePlace,
    deletePlace,
    addTagToPlace,
    hello
};
