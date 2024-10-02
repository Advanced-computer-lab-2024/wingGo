const Place = require('../models/Places');

//create
const createPlace = async (req, res) => {
    try {
        const place = new Place(req.body);
        await place.save();
        res.status(201).json(place);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
//read all
const getAllPlaces = async (req, res) => {
    try {
        const places = await Place.find();
        res.json(places);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
//read by ID
const getPlaceById = async (req, res) => {
    try {
        const place = await Place.findById(req.params.id);
        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }
        res.json(place);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//update
const updatePlace = async (req, res) => {
    try {
        const place = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }
        res.json(place);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

//delete
const deletePlace = async (req, res) => {
    try {
        const place = await Place.findByIdAndDelete(req.params.id);
        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }
        res.status(204).send(); // No content response
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addTagToPlace = async (req, res) => {
    try {
        const place = await Place.findById(req.params.id);
        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }

        const { tag } = req.body;  // Get the tag from the request body
        place.tags.push(tag);  // Add the new tag to the tags array
        await place.save();

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
    addTagToPlace
};