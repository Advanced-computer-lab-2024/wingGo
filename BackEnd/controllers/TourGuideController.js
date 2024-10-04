const bcrypt = require('bcrypt');
const TourGuide = require('../models/TourGuide');
const LoginCredentials = require('../models/LoginCredentials'); 

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

module.exports = {
    getTourGuide,
    updateTourGuideProfile,
};
