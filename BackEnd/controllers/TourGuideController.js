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
const createTourguideProfile = async (req, res) => {
   
    const id = req.params.id; // Use id as the unique identifier

      
     const tourguide = await TourGuide.findById(id);
     
    if (tourguide.isCreatedProfile !== 0) {
        return res.status(400).json({ message: 'Profile already created for this tourguide.' });
    }
    else{
        tourguide.isCreatedProfile = 1;
     await tourguide.save();
     return updateTourGuideProfile(req, res);
    
    //  return res.status(201).json({ message: 'Profile created successfully.' });
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
    const { tourGuideId, title, activities, locations, timeline, duration, language, price, availableDates, accessibility, pickupLocation, dropoffLocation, bookings } = req.body;

    try {
        // Validate if tourGuideId exists in the TourGuide collection
        const tourGuideExists = await TourGuide.findById(tourGuideId);
        if (!tourGuideExists) {
            return res.status(400).json({ error: 'Invalid tourGuideId. Tour guide not found.' });
        }

        // Create and save the new itinerary without latitude and longitude
        const newItinerary = new Itinerary({
            tourGuideId,
            title,
            activities,
            locations,
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

// Read itinerary with tour guide id and itinerary id
const getItineraries = async (req, res) => {
    const { id } = req.params;  // Itinerary ID from the URL params
    const { tourGuideId } = req.query;  // Tour Guide ID from query params

    try {
        // Find the itinerary by ID and ensure it belongs to the correct tour guide
        const itinerary = await Itinerary.findOne({ _id: id, tourGuideId });  // Match both the itinerary ID and tourGuideId

        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found or you do not have permission to view this itinerary.' });
        }

        res.status(200).json(itinerary);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
//get all without tour guide
const getAllItineraries = async (req, res) => {
    try {
        const itineraries = await Itinerary.find();  // Fetch all itineraries
        res.status(200).json(itineraries);  // Return the array of itineraries
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
////////////get all Itineraries of the tourguide
const getItinerariesByTourGuide = async (req, res) => {
    const { tourGuideId } = req.params;

    try {
        const itineraries = await Itinerary.find({ tourGuideId });  // Fetch by tourGuideId
        if (!itineraries.length) {
            return res.status(404).json({ message: 'No itineraries found for this tour guide.' });
        }
        res.status(200).json(itineraries);  // Return the itineraries
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update itinerary
const updateItinerary = async (req, res) => {
    const { id } = req.params;  // Itinerary ID from URL
    const { tourGuideId } = req.query;  // Tour Guide ID from query

    try {
        // Find the itinerary by its ID and check if it belongs to the tour guide
        const itinerary = await Itinerary.findOne({ _id: id, tourGuideId });

        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found or you do not have permission to update this itinerary.' });
        }

        // Update the itinerary without geocoding
        Object.assign(itinerary, req.body);
        await itinerary.save();

        res.status(200).json({ message: 'Itinerary updated successfully', itinerary });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Delete itinerary if no bookings exist
const deleteItinerary = async (req, res) => {
    const { id } = req.params;  // Itinerary ID from URL
    const { tourGuideId } = req.query;  // Tour Guide ID from query

    try {
        // Find the itinerary by ID and tourGuideId to ensure the guide is the owner
        const itinerary = await Itinerary.findOne({ _id: id, tourGuideId });

        // If the itinerary is not found or doesn't belong to the tour guide, return 404
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found or you do not have permission to delete this itinerary.' });
        }

        // Check if the itinerary has bookings (assuming bookings is a number)
        if (itinerary.bookings && itinerary.bookings > 0) {
            return res.status(400).json({ message: 'Cannot delete an itinerary with bookings.' });
        }

        // Delete the itinerary if it has no bookings
        await Itinerary.findByIdAndDelete(id);
        res.status(200).json({ message: 'Itinerary deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = {
    getTourGuide,
    updateTourGuideProfile,
    createItinerary, getItineraries,getAllItineraries, updateItinerary, deleteItinerary ,getItinerariesByTourGuide,createTourguideProfile
};
