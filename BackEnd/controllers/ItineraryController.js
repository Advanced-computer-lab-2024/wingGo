// controllers/ItineraryController.js
const axios = require('axios');
const Itinerary = require('../models/Itinerary');

// Use Nominatim to get latitude and longitude
const getCoordinates = require('../helpers/getCoordinates');

// Create an itinerary
const createItinerary = async (req, res) => {
    const { tourGuideId, title, activities, locations, timeline, duration, language, price, availableDates, accessibility, pickupLocation, dropoffLocation,bookings  } = req.body;

    try {
        // Fetch coordinates for each location
        const locationDetails = await Promise.all(
            locations.map(async (location) => {
                const { lat, lng } = await getCoordinates(location);
                return { address: location, lat, lng };
            })
        );

        const newItinerary = new Itinerary({
            tourGuideId,
            title,
            activities,
            locations: locationDetails,  // Save locations with lat/lng
            timeline,
            duration,
            language,
            price,
            availableDates,
            accessibility,
            pickupLocation,
            dropoffLocation,
            bookings  
        });

        await newItinerary.save();
        res.status(201).json(newItinerary);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Read itineraries for a specific tour guide
const getItineraries = async (req, res) => {
    const { id } = req.params;
    try {
        const itinerary = await Itinerary.findById(id);
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }
        res.status(200).json(itinerary);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//get all 
const getAllItineraries = async (req, res) => {
    try {
        const itineraries = await Itinerary.find();  // Fetch all itineraries
        res.status(200).json(itineraries);  // Return the array of itineraries
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getItinerariesByTourGuide = async (req, res) => {
    const { tourGuideId } = req.params;

    try {
        // Find all itineraries that belong to the given tour guide
        const itineraries = await Itinerary.find({ tourGuideId });
        
        // If no itineraries are found, return an empty array
        if (!itineraries || itineraries.length === 0) {
            return res.status(200).json({ message: 'No itineraries found for this tour guide.' });
        }

        res.status(200).json(itineraries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update itinerary
// Update an itinerary by ID
const updateItinerary = async (req, res) => {
    const { id } = req.params;  // Get the itinerary ID from the URL parameter
    const updates = req.body;   // Get the fields to be updated from the request body

    try {
        // Find the itinerary by ID and update it with the provided fields
        const updatedItinerary = await Itinerary.findByIdAndUpdate(id, updates, { new: true });
        
        if (!updatedItinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        // Return the updated itinerary
        res.status(200).json(updatedItinerary);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
// Delete itinerary if no bookings exist
const deleteItinerary = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the itinerary by ID
        const itinerary = await Itinerary.findById(id);

        // If the itinerary is not found, return 404
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        // Check if the itinerary has bookings (assuming bookings is a number)
        if (itinerary.bookings && itinerary.bookings > 0) {
            return res.status(400).json({ message: 'Cannot delete an itinerary with bookings' });
        }

        // Delete the itinerary
        await Itinerary.findByIdAndDelete(id);
        res.status(200).json({ message: 'Itinerary deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = { createItinerary, getItineraries,getAllItineraries, updateItinerary, deleteItinerary ,getItinerariesByTourGuide};