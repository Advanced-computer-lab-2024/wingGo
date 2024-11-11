const bcrypt = require('bcrypt');
const TourGuide = require('../models/TourGuide');
const LoginCredentials = require('../models/LoginCredentials'); 
const {previewgeneratePreSignedUrl}  = require('../downloadMiddleware');


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

const changePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    const { id } = req.params; // Extract user ID from the request params

    try {
        // 1. Find the user in LoginCredentials
        const userCredentials = await LoginCredentials.findById(id);
        if (!userCredentials) {
            return res.status(404).json({ message: 'User credentials not found' });
        }

        // 2. Find the corresponding user in the TourGuide collection
        const tourGuide = await TourGuide.findById(userCredentials.userId);
        if (!tourGuide) {
            return res.status(404).json({ message: 'TourGuide not found' });
        }

        console.log('Old Password (entered):', oldPassword);
        const hashedoldPassword = await bcrypt.hash(oldPassword, 10); // Hash new password
        console.log('Old Password (hashed):', hashedoldPassword);
        console.log('Stored Hashed Password:', tourGuide.password);

        // 3. Compare the old password with the hashed password in TourGuide
        const isMatch = await bcrypt.compare(oldPassword, tourGuide.password);
        console.log('Is password match:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        // 4. Check if the new password matches the confirm password
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: 'New password and confirm password do not match' });
        }

        // 5. Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10); // Hash new password
        
        // 6. Update the password in LoginCredentials
        userCredentials.password = hashedNewPassword;
        await userCredentials.save();

        // 7. Update the password in the TourGuide collection
        tourGuide.password = hashedNewPassword;
        await tourGuide.save();

        res.status(200).json({ message: 'Password updated successfully in both collections' });
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

        // Check if the password is being updated
        if (req.body.password) {
            // Hash the new password before saving it
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        // Now update the login credentials as well
        const loginUpdateFields = {};
        if (req.body.username) {
            const existingUsername = await LoginCredentials.findOne({ username: req.body.username });

            if (existingUsername) {
                return res.status(400).json({ message: 'Username is already taken' });
            }

            loginUpdateFields.username = req.body.username;  // Username update
        }
        if (req.body.password) {
            loginUpdateFields.password = req.body.password;  // Use the hashed password
        }

        if (Object.keys(loginUpdateFields).length > 0) {
            // Find login credentials by userId and roleModel (TourGuide)
            const updatedLoginCredentials = await LoginCredentials.findOneAndUpdate(
                { userId: id, roleModel: 'TourGuide' },  // Find by userId and roleModel for the tour guide
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
    const { tourGuideId, title, activities, locations, timeline, duration, language, price, availableDates, accessibility, pickupLocation, dropoffLocation, bookings , tags} = req.body;

    try {
        // Validate if tourGuideId exists in the TourGuide collection
        const tourGuideExists = await TourGuide.findById(tourGuideId);
        if (!tourGuideExists) {
            return res.status(400).json({ error: 'Invalid tourGuideId. Tour guide not found.' });
        }
        if (!tourGuideExists.termsAccepted) {
            return res.status(403).json({ error: 'Terms and conditions must be accepted to create an itinerary.' });
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
            bookings,
            tags
        });

        await newItinerary.save();
        res.status(201).json(newItinerary);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Read itinerary with tour guide id and itinerary id
// const getItineraries = async (req, res) => {
//     const { id } = req.params;  // Itinerary ID from the URL params
//     const { tourGuideId } = req.query;  // Tour Guide ID from query params

//     try {
//         // Find the itinerary by ID and ensure it belongs to the correct tour guide
//         const itinerary = await Itinerary.findOne({ _id: id, tourGuideId });  // Match both the itinerary ID and tourGuideId

//         if (!itinerary) {
//             return res.status(404).json({ message: 'Itinerary not found or you do not have permission to view this itinerary.' });
//         }

//         res.status(200).json(itinerary);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };
const getItineraries = async (req, res) => {
    const { id } = req.params;  // Itinerary ID from the URL params

    try {
        // Find the itinerary by ID and ensure it belongs to the correct tour guide
        const itinerary = await Itinerary.findOne({ _id: id});  // Match both the itinerary ID and tourGuideId

        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found.' });
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

const changeProfilePhoto = async (req, res) => {

    const { id } = req.params;  // Tour Guide ID from query

    try {

        // Find the tour guide by ID and check if it belongs to the tour guide
        const tourGuide = await TourGuide.findById(id);

        if (!tourGuide) {
            return res.status(404).json({ message: 'Tour guide not found or you do not have permission to update this tour guide.' });
        }

        const photoUrl = req.file.location;

        tourGuide.photo = photoUrl;
        await tourGuide.save();
    

        res.status(200).json({ message: 'Profile updated successfully', tourGuide });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const acceptTerms = async (req, res) => {
    const tourGuideId = req.params.id;

    try {
        const tourGuide = await TourGuide.findByIdAndUpdate(tourGuideId, { termsAccepted: true }, { new: true });
        if (!tourGuide) {
            return res.status(404).json({ message: 'Tour Guide not found.' });
        }
        res.status(200).json({ message: 'Terms accepted successfully.', tourGuide });
    } catch (error) {
        res.status(500).json({ message: 'Error accepting terms.', error });
    }
};


const deleteTourGuideAccount = async (req, res) => {
    const { id } = req.params;  // Tour Guide ID

    try {
        // Find the tour guide
        const tourGuide = await TourGuide.findById(id);
        if (!tourGuide) {
            return res.status(404).json({ message: 'Tour guide not found' });
        }

        // Check each itinerary created by the tour guide
        const itineraries = await Itinerary.find({ tourGuideId: id });
        
        for (let itinerary of itineraries) {
            // Check if any upcoming bookings exist
            for (let booking of itinerary.touristIDs) {
                if (booking.bookingDate >= new Date()) { // If there's a future booking date
                    return res.status(400).json({
                        message: 'Cannot delete account: Upcoming itinerary bookings exist.'
                    });
                }
            }
        }

        // If no future bookings, delete itineraries and account
        await Itinerary.deleteMany({ tourGuideId: id }); // Delete all itineraries by this guide
        const tourguidedel =await TourGuide.findByIdAndDelete(id); 

        await LoginCredentials.findOneAndDelete({ userId: id, roleModel: 'TourGuide' });

        if (!tourguidedel) {
            return res.status(404).json({ message: "tour guide account not found." });
        }
     
        res.status(200).json({ message: 'Tour guide account and itineraries deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Method to activate or deactivate an itinerary
// we dont check if it belongs to the tourguide 3shan aslan msh hanedih el option ela lw bt belong to him
const activateOrDeactivateItinerary = async (req, res) => {
    const { id } = req.params;  // Itinerary ID from URL parameters
    const { deactivate } = req.body;  // Boolean value from request body

    try {
        // Find the itinerary by ID
        const itinerary = await Itinerary.findById(id);

        // Check if the itinerary exists and belongs to the tour guide
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        // Update the deactivated field based on the provided boolean value
        itinerary.deactivated = deactivate;
        await itinerary.save();

        res.status(200).json({
            message: `Itinerary has been ${deactivate ? 'deactivated' : 'activated'} successfully.`,
            itinerary,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const previewPhoto = async (req, res) => {
    const { id } = req.params;
    try {
        const tourguide = await TourGuide.findById(id);
        
        if (!tourguide) {
            return res.status(404).json({ message: 'TourGuide not found' });
        }

        if (tourguide.photo) {
            const key = tourguide.photo.split('/').slice(-1)[0];
            const preSignedUrl = await previewgeneratePreSignedUrl(key);
            
            // Instead of redirecting, send the pre-signed URL directly
            return res.json({ imageUrl: preSignedUrl });
        } else {
            return res.status(404).json({ message: 'Image not found for this advertiser.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getTourGuide,
    updateTourGuideProfile,
    createItinerary, getItineraries,getAllItineraries, updateItinerary, deleteItinerary ,getItinerariesByTourGuide,createTourguideProfile,
    changeProfilePhoto,
    acceptTerms, changePassword,
    deleteTourGuideAccount,
    activateOrDeactivateItinerary,
    previewPhoto
};
