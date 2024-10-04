const bcrypt = require('bcrypt');
const TourGuide = require('../models/TourGuide');
const LoginCredentials = require('../models/LoginCredentials'); 


const axios = require('axios');
const Itinerary = require('../models/Itinerary');
const getCoordinates = require('../helpers/getCoordinates');


// Get a tour guide by id
const getTourGuide = async (req, res) => {
    try {
        const id = req.params.id; // Use id as the unique identifier

        // Find the tour guide by id
        const tourGuide = await TourGuide.findById(id);
        
        if (!tourGuide) {
            return res.status(404).json({ message: 'Tour guide not found' });
        }
        
        res.status(200).json(tourGuide);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update the tour guide profile (with password hashing if updated)
const updateTourGuideProfile = async (req, res) => {
    try {
        const id = req.params.id; // Use id as the unique identifier

        // Find the tour guide by id
        const tourGuide = await TourGuide.findById(id);

        if (!tourGuide) {
            return res.status(404).json({ message: 'Tour guide not found' });
        }

        // Save the original username and email before updating
        const originalEmail = tourGuide.email;
        const originalUsername = tourGuide.username;

        // Check if the password is being updated
        if (req.body.password) {
            // Hash the new password before saving it
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        // Now update the login credentials as well
        const loginUpdateFields = {};
        if (req.body.username) {
            loginUpdateFields.username = req.body.username;
        }
        if (req.body.password) {
            loginUpdateFields.password = req.body.password;  // Use the hashed password
        }

        if (Object.keys(loginUpdateFields).length > 0) {
            // Find login credentials by tour guide id (assuming id is stored in both TourGuide and LoginCredentials models)
            const updatedLoginCredentials = await LoginCredentials.findByIdAndUpdate(
                id, // Match by id
                { $set: loginUpdateFields },
                { new: true }  // Return the updated document
            );

            if (!updatedLoginCredentials) {
                return res.status(404).json({ message: 'Login credentials not found' });
            }
        }

        // Update the tour guide profile with the new data
        Object.assign(tourGuide, req.body);
        await tourGuide.save();

        res.status(200).json({ message: 'Profile and login credentials updated successfully', tourGuide });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

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
// Update itinerary
const updateItinerary = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        // Geocode the locations if they are provided in the update request
        if (updates.locations && Array.isArray(updates.locations)) {
            const locationDetails = await Promise.all(
                updates.locations.map(async (location) => {
                    const { lat, lng } = await getCoordinates(location); // Geocode address to lat/lng
                    return { address: location, lat, lng };
                })
            );
            updates.locations = locationDetails; // Replace locations with lat/lng
        }

        // Update the itinerary
        const updatedItinerary = await Itinerary.findByIdAndUpdate(id, updates, { new: true });
        
        if (!updatedItinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

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

module.exports = {
    getTourGuide,
    updateTourGuideProfile,
    createItinerary, getItineraries,getAllItineraries, updateItinerary, deleteItinerary ,getItinerariesByTourGuide
};
