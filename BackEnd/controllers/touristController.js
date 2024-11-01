const bcrypt = require('bcrypt');
const Tourist = require('../models/tourist');
const Attraction = require('../models/attraction');
const Activity= require('../models/Activity');
const Itinerary = require ('../models/Itinerary');
const Product = require('../models/product');
const LoginCredentials = require('../models/LoginCredentials');
const Place = require('../models/Places');
const Complaints = require('../models/Complaints');
const axios = require('axios');
const FlightBooking = require('../models/FlightBooking');
const mongoose = require('mongoose');




const tourist_hello = (req, res) => {
    res.send('<h1>yayy</h1>');
    console.log('yay');
};

const tourist_register = async (req, res) => {
    // Destructure fields from the request body
    const { username, email, password, mobileNumber, nationality, DOB, jobOrStudent } = req.body;
    
    // Check for existing user
    const existingEmail = await Tourist.findOne({ email });
    const existingUsername = await LoginCredentials.findOne({ username });
    const existingMobile = await Tourist.findOne({ mobileNumber });

    if (existingEmail) {
        return res.status(400).json({ message: 'Email is already registered.' });
    }
    if (existingUsername) {
        return res.status(400).json({ message: 'Username is already registered.' });
    }
    if (existingMobile) {
        return res.status(400).json({ message: 'Mobile number is already registered.' });
    }

    const birthDate = new Date(DOB);
    if (isNaN(birthDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
    }
    const age = new Date().getFullYear() - birthDate.getFullYear();
    const isUnder18 = age < 18;

    // Restrict users under 18 from signing up for booking
    if (isUnder18) {
        return res.status(400).json({ message: 'You must be at least 18 years old to register.' });
    }
    
    try {
        // Hash the password using bcrypt before saving it
        const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

        // Create the new tourist with the hashed password
        const user = new Tourist({
            username,
            email,
            password: hashedPassword, // Save the hashed password
            mobileNumber,
            nationality,
            DOB,
            jobOrStudent 
        });

        // Save the tourist to the database
        await user.save();

        // Create login credentials and save it to LoginCredentials
        const loginCredentials = new LoginCredentials({
            username,
            password: hashedPassword,
            role: 'tourist',
            userId: user._id,  // Reference to the created tourist
            roleModel: 'Tourist'  // Set the role model as 'Tourist'
        });

        await loginCredentials.save();

        console.log('Success! Tourist registered and login credentials created.');
        res.status(201).json(user);  // <-- Change this to return 201 Created
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log('Error during registration:', error.message);
    }
};

const addComplaint = async (req, res) => {
    const {title, body } = req.body;
    const touristId = req.params.id; // Extracting the tourist ID from the URL parameters

    try {
        const newComplaint = new Complaints({
            title,
            body,
            tourist: touristId,
            state: 'pending' // Default state
        });

        await newComplaint.save();
        res.status(201).json({ message: 'Complaint filed successfully.', complaint: newComplaint });
    } catch (error) {
        res.status(500).json({ message: 'Error filing complaint.', error });
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

        // 2. Find the corresponding user in the Tourist collection
        const tourist = await Tourist.findById(userCredentials.userId);
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }

        // 3. Compare the old password with the hashed password in LoginCredentials
        const isMatch = await bcrypt.compare(oldPassword, userCredentials.password); // Compare old password
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

        // 7. Update the password in the Tourist collection
        tourist.password = hashedNewPassword;
        await tourist.save();

        res.status(200).json({ message: 'Password updated successfully in both collections' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




const getTourist = async(req,res) => {
    try{
        const id = req.params.id; // Use id as the unique identifier
        const touristExist = await Tourist.findById(id);
        if (!touristExist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }
       res.status(200).json(touristExist)
    }catch(error){
       res.status(400).json({error:error.message})
    }
 };

 const updateTouristProfile = async (req, res) => {
    try {
        const id = req.params.id; // Use id as the unique identifier
        const touristExist = await Tourist.findById(id);
        if (!touristExist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }

        // Check if the request is trying to update 'username' or 'wallet'
        if (req.body.username) {
            return res.status(400).json({ message: 'Username cannot be modified.' });
        }
        if (req.body.wallet) {
            return res.status(400).json({ message: 'Wallet cannot be modified.' });
        }

        // Create a copy of the request body excluding 'username' and 'wallet'
        const { username, wallet, ...updateData } = req.body;

        // If the password is being updated, hash it before saving
        if (req.body.password) {
            updateData.password = await bcrypt.hash(req.body.password, 10);
        }

        // Update the tourist's profile with the hashed password and other updated fields
        const updatedTourist = await Tourist.findByIdAndUpdate(id, updateData, {
            new: true,  // Return the updated document
        });

        // // Update login credentials if necessary
        // const loginUpdateFields = {};
        // if (req.body.password) {
        //     loginUpdateFields.password = updateData.password;  // Use the hashed password
        // }

        // if (Object.keys(loginUpdateFields).length > 0) {
        //     const updatedLoginCredentials = await LoginCredentials.findByIdAndUpdate(
        //         id, // Match by id
        //         { $set: loginUpdateFields },
        //         { new: true }  // Return the updated document
        //     );

        //     if (!updatedLoginCredentials) {
        //         return res.status(404).json({ message: 'Login credentials not found' });
        //     }
        // }

        res.status(200).json({
            message: 'Profile and login credentials updated successfully',
            updatedTourist
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const sortProductsByRatings = async (req, res) => {
    try {
        // Find products where archive is false and sort by ratings in descending order
        const products = await Product.find({ Archive: false }).sort({ ratings: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('seller', 'username');  // Populate seller username if available

        // If you need to send a public path for pictures stored locally
        const productData = products.map(product => ({
            name: product.name,
            picture: `../images/${product.picture}`,  // Build image URL dynamically
            // picture: `${req.protocol}://${req.get('host')}/images/${product.picture}`,  // Build image URL dynamically
            price: product.price,
            description: product.description,
            quantity: product.quantity,
            seller: product.seller ? product.seller.username : 'Admin',  // Handle null seller field
            ratings: product.ratings,
            reviews: product.reviews
        }));

        res.status(200).json(productData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const filterProduct = async (req, res) => {
    try {
        const price = req.query.price;  // Assuming 'price' is the query parameter for price

        let result;
        if (price) {
            // Find products with the exact price
            result = await Product.find({ price: price, Archive:false });
        } else {
            // If no price is provided, return all products
            result = await Product.find({Archive:false});
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




// const Place = require('../models/Places');

// Filter places by type or historical period
const filterPlacesByTag = async (req, res) => {
    const {tag} = req.query;

    const filterCriteria = {
        flagged: false  // Exclude flagged places
    };

    if (tag) {
        filterCriteria['tagss'] = tag; // Filter by tag
    }

    try {
        const places = await Place.find(filterCriteria);
        res.status(200).json(places);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const searchProductsByName = async (req, res) => {
    try {
        const query = req.query.name;  
        if (!query) {
            return res.status(400).json({ message: "Please provide a product name to search." });
        }

        // Perform a case-insensitive search for products with names that match the search query
        const products = await Product.find({ name: { $regex: query, $options: 'i' },Archive:false });

        if (products.length === 0) {
            return res.status(404).json({ message: "No products found matching your search." });
        }

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};





//sort all upcoming activities/itinieraries based on price/rating
// const sortUpcomingActivityOrItineraries = async (req, res) => {
//     const { sort, type } = req.query;
//     let sortCriteria;

//     if (sort === 'price') {
//         sortCriteria = { price: 1 }; // Ascending order by price
//     } else if (sort === 'ratings') {
//         sortCriteria = { ratings: -1 }; // Descending order by ratings
//     } else {
//         return res.status(400).json({ message: 'Invalid sort criteria. Use "price" or "ratings".' });
//     }

//     try {
//         if (type === 'activity') {
//             const activities = await Activity.find({ date: { $gte: new Date() } }).sort(sortCriteria);
//             return res.status(200).json(activities);
//         } else if (type === 'itinerary') {
//             const itineraries = await Itinerary.find({ date: { $gte: new Date() } }).sort(sortCriteria);
//             return res.status(200).json(itineraries);
//         } else {
//             return res.status(400).json({ message: 'Invalid type. Use "activity" or "itinerary".' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
const sortUpcomingActivityOrItineraries = async (req, res) => {
    const { sort, type } = req.query;
    let sortCriteria;

    // Determine the sorting criteria: price or ratings
    if (sort === 'price') {
        sortCriteria = { price: 1 }; // Ascending order by price
    } else if (sort === 'ratings') {
        sortCriteria = { ratings: -1 }; // Descending order by ratings
    } else {
        return res.status(400).json({ message: 'Invalid sort criteria. Use "price" or "ratings".' });
    }

    try {
        const currentDate = new Date(); // Get the current date for filtering

        if (type === 'activity') {
            // Fetch and sort upcoming activities based on the sort criteria
            const activities = await Activity.find({ date: { $gte: currentDate } , flagged: false }).sort(sortCriteria);
            return res.status(200).json(activities);
        } else if (type === 'itinerary') {
            // Fetch and sort upcoming itineraries based on available dates and sort criteria
            const itineraries = await Itinerary.find({ availableDates: { $elemMatch: { $gte: currentDate } } , flagged: false }).sort(sortCriteria);
            return res.status(200).json(itineraries);
        } else {
            return res.status(400).json({ message: 'Invalid type. Use "activity" or "itinerary".' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get all upcoming activities, itineraries, and historical places/museums
// Get all upcoming activities, itineraries, and historical places/museums
const getAllUpcomingEvents = async (req, res) => {
    try {
        // Get current date to filter upcoming activities and itineraries
        const currentDate = new Date();

        // Fetch all upcoming activities
        const activities = await Activity.find({ date: { $gte: currentDate } });

        // Fetch all upcoming itineraries
        const itineraries = await Itinerary.find({
            availableDates: { $gte: currentDate }
        });

        // Fetch all historical places and museums
        const places = await Place.find();

        // Filter places by opening hours (you can adjust this logic based on your openingHours format)
        const upcomingPlaces = places.filter(place => {
            const [openingTime, closingTime] = place.openingHours.split(" - "); // Assuming format is "9:00 AM - 7:00 PM"
            const openTime = new Date(currentTime.toDateString() + ' ' + openingTime); // Today’s opening time
            const closeTime = new Date(currentTime.toDateString() + ' ' + closingTime); // Today’s closing time

            // Check if the place is currently open or will open later today
            return currentTime >= openTime && currentTime <= closeTime;
        });

        res.status(200).json({
            activities,
            itineraries,
            places: upcomingPlaces
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// const getAllUpcomingEvents = async (req, res) => {
//     try {
//         // Get current date to filter upcoming activities and itineraries
//         const currentDate = new Date();

//         // Fetch all upcoming activities
//         const activities = await Activity.find({ date: { $gte: currentDate } });

//         // Fetch all upcoming itineraries
//         const itineraries = await Itinerary.find({
//             availableDates: { $gte: currentDate }
//         });

//         // Fetch all historical places and museums
//         const places = await Place.find();

//         // Filter places by opening hours (you can adjust this logic based on your openingHours format)
//         const upcomingPlaces = places.filter(place => {
//             const [openingTime, closingTime] = place.openingHours.split(" - "); // Assuming format is "9:00 AM - 7:00 PM"
//             const openTime = new Date(currentTime.toDateString() + ' ' + openingTime); // Today’s opening time
//             const closeTime = new Date(currentTime.toDateString() + ' ' + closingTime); // Today’s closing time

//             // Check if the place is currently open or will open later today
//             return currentTime >= openTime && currentTime <= closeTime;
//         });

//         res.status(200).json({
//             activities,
//             itineraries,
//             places: upcomingPlaces
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

const getAllUpcomingActivities = async (req, res) => {
    try {
        // Get current date to filter upcoming activities and itineraries
        const currentDate = new Date();

        // Fetch all upcoming activities
        const activities = await Activity.find({ 
            date: { $gte: currentDate },
            flagged: false   // Exclude flagged activities
        });
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllUpcomingIteneries = async (req, res) => {
    try {
        const currentDate = new Date();

        // Fetch itineraries where at least one date in availableDates is greater than or equal to today
        const itineraries = await Itinerary.find({
            availableDates: { $gte: currentDate }
            ,flagged: false  // Exclude flagged itineraries
        });

        if (itineraries.length === 0) {
            return res.status(404).json({ message: 'No upcoming itineraries found' });
        }

        res.status(200).json({
            itineraries
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// const getAllUpcomingPlaces = async (req, res) => {
//     try {
//         // Get the current day and time
//         const currentTime = new Date();

//         // Fetch all places
//         const places = await Place.find();

//         // Filter places by opening hours (you can adjust this logic based on your openingHours format)
//         const upcomingPlaces = places.filter(place => {
//             const [openingTime, closingTime] = place.openingHours.split(" - "); // Assuming format is "9:00 AM - 7:00 PM"
//             const openTime = new Date(currentTime.toDateString() + ' ' + openingTime); // Today’s opening time
//             const closeTime = new Date(currentTime.toDateString() + ' ' + closingTime); // Today’s closing time

//             // Check if the place is currently open or will open later today
//             return currentTime >= openTime && currentTime <= closeTime;
//         });

//         if (upcomingPlaces.length === 0) {
//             return res.status(404).json({ message: 'No upcoming places found based on current opening hours' });
//         }

//         res.status(200).json({
//             places: upcomingPlaces
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
const getAllUpcomingPlaces = async (req, res) => {
    try {
        // Get the current day and time
        const currentTime = new Date();

        // Fetch all places
        const places = await Place.find();

        // Filter places by opening hours (you can adjust this logic based on your openingHours format)
        const upcomingPlaces = places.filter( {flagged: false}
        );

        if (upcomingPlaces.length === 0) {
            return res.status(404).json({ message: 'No upcoming places found based on current opening hours' });
        }

        res.status(200).json({
            places: upcomingPlaces
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const filterUpcomingActivities = async (req, res) => {
    const { budget, date, category, ratings } = req.query; 
    // let filter = {}; // Initialize an empty filter object
    let filter = { date: { $gte: new Date() }
    // ,flagged: false
  }; // Default filter: only upcoming activities (date >= today)

    // Apply budget filter (if provided)
    if (budget) {
        filter.price = { $lte: budget }; // Price less than or equal to the specified budget
    }

    // Apply exact date filter (if provided)
    if (date) {
        const startOfDay = new Date(date);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999); // Set to the end of the day

        filter.date = { $gte: startOfDay, $lte: endOfDay }; // Activities on the exact specified date
    }

    // Apply category filter (if provided)
    if (category) {
        filter.category = category; // Exact match for category
    }

    // Apply ratings filter (if provided)
    if (ratings) {
        filter.ratings = ratings; // Ratings greater than or equal to the provided rating
    }

    try {
        // Find activities based on the constructed filter
        const activities = await Activity.find(filter); 
        
        res.status(200).json(activities); // Return filtered activities
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }
};
// Search for attractions, activities, itineraries, or places by name, category, or tags
const searchAllModels = async (req, res) => {
    const { query } = req.query;  // Only extract the query term

    if (!query) {
        return res.status(400).json({ message: "Please provide a search term." });
    }

    // General search criteria for all models
    let searchCriteria = {
        $or: [
            { name: { $regex: query, $options: 'i' } },  // Search by name (case-insensitive)
            { category: { $regex: query, $options: 'i' } },  // Search by category
            { tags: { $regex: query, $options: 'i' } }  // Search by tags
        ],
        flagged: false 
    };

    try {
        const attractions = await Attraction.find(searchCriteria);
        const activities = await Activity.find(searchCriteria);
        
        let itinerarySearchCriteria = {
            $or: [
                { title: { $regex: query, $options: 'i' } },  // Search by itinerary title
                { tags: { $regex: query, $options: 'i' } }  // Search by tags
            ],
            flagged: false 
        };
        const itineraries = await Itinerary.find(itinerarySearchCriteria);
              

        let placeSearchCriteria = {
            $or: [
                { name: { $regex: query, $options: 'i' } },  // Search by place name
                { tagss: { $regex: query, $options: 'i' } }
            ],
            flagged: false 
        };
        const places = await Place.find(placeSearchCriteria);

        const results = {
            attractions,
            activities,
            itineraries,
            places
        };

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const filterItineraries = async (req, res) => {
    const { budget, date, preferences, language } = req.query;

    let filter = {flagged: false }; // Initialize afilter object

    // Always apply upcoming dates filter (availableDates >= today)
    const currentDate = new Date();
    filter.availableDates = { $elemMatch: { $gte: currentDate } }; // Match any upcoming date within the array

    // Apply exact date filter if provided
    if (date) {
        const exactDate = new Date(date);
        const startOfDay = new Date(exactDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(exactDate.setHours(23, 59, 59, 999));

        filter.availableDates = { $elemMatch: { $gte: startOfDay, $lte: endOfDay } }; // Match exact date in array
    }

    // Apply budget filter
    if (budget) {
        filter.price = { $lte: budget }; // Price should be less than or equal to the specified budget
    }

    // Apply preferences filter (e.g., historic areas, beaches)
    if (preferences) {
        const preferenceArray = preferences.split(','); // Assuming preferences are provided as a comma-separated string
        filter.tags = { $in: preferenceArray }; // Match itineraries that have at least one of the specified tags
    }

    // Apply language filter
    if (language) {
        filter.language = language; // Exact match for language
    }

    try {
        // Find itineraries based on the constructed filter
        const itineraries = await Itinerary.find(filter);

        

        res.status(200).json(itineraries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addPreferencesToTourist = async (req, res) => {
    const { id } = req.params;  // Tourist ID
    const { preferences } = req.body;  // List of selected preference tag IDs

    try {
        const tourist = await Tourist.findById(id);
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }

        // Ensure the preferences field is an array and contains ObjectIds
        // tourist.preferences.push(preferences);
        // tourist.preferences = preferences || [];  // Set preferences

        // Ensure the preferences field is an array and push each preference if not already present
        if (Array.isArray(preferences)) {
            preferences.forEach(preference => {
                // Avoid duplicates in the preferences array
                // if (!tourist.preferences.includes(preference)) {
                    tourist.preferences.push(preference);
                // }
            });
        } else {
            // In case a single preference ID is provided
            // if (!tourist.preferences.includes(preferences)) {
                tourist.preferences.push(preferences);
            // }
        }

        const tourist2 = await Tourist.findById(id).populate('preferences');
        console.log(tourist2.preferences);

        
        await tourist.save();

        res.status(200).json({ message: 'Preferences updated successfully', tourist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const viewComplaints = async (req, res) => {
    const touristId = req.params.id; // Extracting the tourist ID from the URL parameters

    try {
        const complaints = await Complaints.find({ tourist: touristId }).select('title body state date');
        res.status(200).json({ complaints });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving complaints.', error });
    }
};
const bookItinerary = async (req, res) => {
    const { touristId, itineraryId } = req.params; // Extracting touristId and itineraryId from URL parameters
    const { bookingDate } = req.query;

    try {
       
        const parsedDate = new Date(bookingDate);

        const bookingObject = {
            itineraryId: itineraryId,
            bookingDate: parsedDate // Use the parsed date
        };

        // Retrieve tourist details and check if itineraryId is already booked
        const reqTourist = await Tourist.findById(touristId);
        if (!reqTourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }

        // Check if the itineraryId is already in bookedItineraries
        const isAlreadyBooked = reqTourist.bookedItineraries.some(
            (booking) => booking.itineraryId.toString() === itineraryId
        );

        if (isAlreadyBooked) {
            return res.status(400).json({ message: 'Itinerary already booked by this tourist' });
        }
        const itineraryUpdate = await Itinerary.findByIdAndUpdate(
            itineraryId, 
            { $addToSet: { touristIDs: { touristId: touristId, bookingDate: parsedDate } } }, // Add the object with both touristId and bookingDate
            { new: true }
        );
        
        if (!itineraryUpdate) {
            return res.status(404).json({ message: 'Itinerary not found or update failed' });
        }

        // Calculate new points and badge details
        const itineraryPrice = itineraryUpdate.price;
        const oldAmount = reqTourist.badge.amount;
        const oldPoints = reqTourist.loyaltyPoints;
        const newPoints = (itineraryPrice * oldAmount) + oldPoints;
        
        let newLevel = reqTourist.badge.level;
        let newAmount = oldAmount;
        
        if (newPoints > 100000) {
            newLevel = 2;
            newAmount = 1;
        }
        if (newPoints > 500000) {
            newLevel = 3;
            newAmount = 1.5;
        }

        // Update the tourist's booked itineraries and other details
        const touristUpdate = await Tourist.findByIdAndUpdate(
            touristId, 
            { 
                $push: { bookedItineraries: bookingObject }, // Add the booking
                $set: { 
                    loyaltyPoints: newPoints,          // Update loyalty points
                    'badge.level': newLevel,           // Update badge level
                    'badge.amount': newAmount          // Update badge amount
                }
            }, 
            { new: true }
        );

        if (!touristUpdate) {
            return res.status(404).json({ message: 'Tourist update failed' });
        }

        return res.status(200).json({
            message: 'Booking successful',
            itinerary: itineraryUpdate,
            tourist: touristUpdate
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error during the booking process.', error });
    }
};

const cancelItinerary = async (req, res) => {
    const { touristId, itineraryId } = req.params; // Extracting touristId and itineraryId from URL parameters

    try {
        // Step 1: Fetch the tourist with the given touristId
        const tourist = await Tourist.findById(touristId);

        // Check if the tourist exists
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found.' });
        }

        // Step 2: Check if the itinerary exists in the tourist's bookedItineraries array
        const itinerary = tourist.bookedItineraries.find(
            itinerary => itinerary.itineraryId.toString() === itineraryId
        );

        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found for this tourist.' });
        }

        // Step 3: Check if the booking date is more than 48 hours from now
        const now = new Date();
        const bookingDate = itinerary.bookingDate;
        const diffInMilliseconds = bookingDate.getTime() - now.getTime();

        if (diffInMilliseconds < 48 * 60 * 60 * 1000) {
            return res.status(400).json({ message: 'Cannot cancel the itinerary within 48 hours of the booking date.' });
        }

        // Step 4: Remove the specific itinerary from the bookedItineraries array using $pull
        const touristUpdate = await Tourist.findByIdAndUpdate(
            touristId,
            { $pull: { bookedItineraries: { itineraryId: itineraryId } } }, // Removes the matching object
            { new: true }
        );

        if (!touristUpdate) {
            return res.status(404).json({ message: 'Failed to update tourist bookings.' });
        }

        // Step 5: Remove the touristId from the itinerary's touristIDs array
        const itineraryUpdate = await Itinerary.findByIdAndUpdate(
            itineraryId,
            { $pull: { touristIDs: { touristId: touristId } } }, // Pulls the object containing the touristId
            { new: true }
        );

        if (!itineraryUpdate) {
            return res.status(404).json({ message: 'Itinerary not found or failed to update.' });
        }

        return res.status(200).json({
            message: 'Itinerary cancelled successfully.',
            tourist: touristUpdate,
            itinerary: itineraryUpdate
        });

    } catch (error) {
        return res.status(500).json({ message: 'Error cancelling the booking process.', error });
    }
};
const redeemPoints = async (req, res) => {
    const { touristId } = req.params; // Extracting touristId from URL parameters

    try {
        // Step 1: Fetch the tourist with the given touristId
        const tourist = await Tourist.findById(touristId);

        // Check if the tourist exists
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found.' });
        }
      
        // Calculate the value to be added to the wallet
        const oldPoints = tourist.loyaltyPoints;
        let newPoints = 0;
        let newLevel = 1;
        let newAmount = 0.5;
        const toBeAdded = (oldPoints / 10000) * 100; // Conversion rate for points to wallet amount

        if (oldPoints < 10000) {
            return res.status(400).json({ 
                message: 'Insufficient loyalty points. You need at least 10,000 points to redeem into your wallet.' 
            });
        }

        // Update the tourist document
        const touristUpdate = await Tourist.findByIdAndUpdate(
            touristId, 
            { 
                $set: { 
                    loyaltyPoints: newPoints,          // Reset loyalty points
                    'badge.level': newLevel,           // Reset badge level
                    'badge.amount': newAmount          // Reset badge amount
                },
                $inc: { wallet: toBeAdded }           // Increment wallet by toBeAdded amount
            }, 
            { new: true }
        );

        if (!touristUpdate) {
            return res.status(404).json({ message: 'Tourist update failed' });
        }

        return res.status(200).json({
            message: 'Points redeemed successfully and added to wallet.',
            tourist: touristUpdate
        });

    } catch (error) {
        return res.status(500).json({ message: 'Error redeeming points.', error });
    }
};
const bookActivity = async (req, res) => {
    const { touristId, activityId } = req.params; // Extracting touristId and activityId from URL parameters

    try {
        // Retrieve tourist details and check if the activityId is already booked
        const reqTourist = await Tourist.findById(touristId);
        if (!reqTourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }

        // Check if the activityId is already in bookedActivities
        const isAlreadyBooked = reqTourist.bookedActivities.some(
            (booking) => booking.toString() === activityId
        );

        if (isAlreadyBooked) {
            return res.status(400).json({ message: 'Activity already booked by this tourist' });
        }

        // Add the tourist to the activity's touristIDs array
        const activityUpdate = await Activity.findByIdAndUpdate(
            activityId, 
            { $addToSet: { touristIDs: touristId } }, // Use $addToSet to avoid duplicates
            { new: true }
        );

        if (!activityUpdate) {
            return res.status(404).json({ message: 'Activity not found or update failed' });
        }

        // Calculate new points and badge details based on the activity's price
        const activityPrice = activityUpdate.price;
        const oldAmount = reqTourist.badge.amount;
        const oldPoints = reqTourist.loyaltyPoints;
        const newPoints = (activityPrice * oldAmount) + oldPoints;

        // Determine new badge level and amount based on newPoints
        let newLevel = reqTourist.badge.level;
        let newAmount = oldAmount;

        if (newPoints > 100000) {
            newLevel = 2;
            newAmount = 1;
        }
        if (newPoints > 500000) {
            newLevel = 3;
            newAmount = 1.5;
        }

        // Update the tourist's booked activities and other details
        const touristUpdate = await Tourist.findByIdAndUpdate(
            touristId, 
            { 
                $addToSet: { bookedActivities: activityId }, // Add the activity to bookedActivities
                $set: { 
                    loyaltyPoints: newPoints,          // Update loyalty points
                    'badge.level': newLevel,           // Update badge level
                    'badge.amount': newAmount          // Update badge amount
                }
            }, 
            { new: true }
        );

        if (!touristUpdate) {
            return res.status(404).json({ message: 'Tourist update failed' });
        }

        return res.status(200).json({
            message: 'Activity booking successful',
            activity: activityUpdate,
            tourist: touristUpdate
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error during the activity booking process.', error });
    }
};
const cancelActivity = async (req, res) => {
    const { touristId, activityId } = req.params; // Extracting touristId and activityId from URL parameters

    try {
        // Step 1: Fetch the tourist with the given touristId and populate bookedActivities
        const tourist = await Tourist.findById(touristId).populate('bookedActivities');

        // Check if the tourist exists
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found.' });
        }

        // Step 2: Check if the activity exists in the tourist's bookedActivities array
        const activity = tourist.bookedActivities.find(
            activity => activity._id.toString() === activityId
        );

        // console.log('Retrieved Activity:', activity); // Debugging line

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found for this tourist.' });
        }

        // Step 3: Check if the booking date is more than 48 hours from now
        const now = new Date();
        const bookingDate = activity.date; // Ensure this is the correct path

        // Check if bookingDate is valid
        if (!bookingDate) {
            return res.status(400).json({ message: 'Booking date is not valid.' });
        }

        const diffInMilliseconds = bookingDate.getTime() - now.getTime();

        if (diffInMilliseconds < 48 * 60 * 60 * 1000) {
            return res.status(400).json({ message: 'Cannot cancel the activity within 48 hours of the booking date.' });
        }

        // Step 4: Remove the specific activity from the bookedActivities array using $pull
        const touristUpdate = await Tourist.findByIdAndUpdate(
            touristId,
            { $pull: { bookedActivities: activityId } },
            { new: true }
        );

        if (!touristUpdate) {
            return res.status(404).json({ message: 'Failed to update tourist bookings.' });
        }

        // Step 5: Remove the touristId from the activity's touristIDs array
        const activityUpdate = await Activity.findByIdAndUpdate(
            activityId,
            { $pull: { touristIDs: touristId } },
            { new: true }
        );

        if (!activityUpdate) {
            return res.status(404).json({ message: 'Activity not found or failed to update.' });
        }

        return res.status(200).json({
            message: 'Activity cancelled successfully.',
            tourist: touristUpdate,
            activity: activityUpdate
        });

    } catch (error) {
        console.error('Error cancelling the booking process:', error); // Log the error for debugging
        return res.status(500).json({ message: 'Error cancelling the booking process.', error });
    }
};

const purchaseProduct = async (req, res) => {
    const { touristId, productId } = req.params;

    try {
        const tourist = await Tourist.findById(touristId);
        const product = await Product.findById(productId);

        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.quantity <= 0) {
            return res.status(400).json({ message: 'Product out of stock' });
        }

        // Decrease product quantity
        product.quantity -= 1;

        // Add product to purchasedProducts array
        tourist.purchasedProducts.push({ productId: product._id, purchaseDate: new Date() });

        // Save changes
        await tourist.save();
        await product.save();

        res.status(200).json({
            message: 'Product purchased successfully',
            product,
            tourist
        });
    } catch (error) {
        res.status(500).json({ message: 'Error processing purchase', error });
    }
};
const rateProduct = async (req, res) => {
    const { touristId, productId } = req.params;
    const { rating } = req.body; // Expecting a rating in the body

    try {
        console.log(`Received request: Tourist ID: ${touristId}, Product ID: ${productId}, Rating: ${rating}`);

        // Check if tourist exists
        const tourist = await Tourist.findById(touristId);
        if (!tourist) {
            console.error('Tourist not found');
            return res.status(404).json({ message: 'Tourist not found' });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            console.error('Product not found');
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the tourist has purchased the product
        const purchasedProduct = tourist.purchasedProducts.find(
            (purchase) => purchase.productId.toString() === productId
        );

        if (!purchasedProduct) {
            console.error('Product not purchased by this tourist');
            return res.status(400).json({ message: 'Product not purchased by this tourist' });
        }

        // Initialize `ratings` array if it doesn't exist
        if (!Array.isArray(product.ratings)) {
            product.ratings = [];
        }

        // Check if the tourist has already rated this product
        const existingRatingIndex = product.ratings.findIndex(
            (review) => review.touristId.toString() === touristId
        );

        if (existingRatingIndex > -1) {
            // Update the existing rating if the tourist has already rated the product
            console.log('Updating existing rating');
            product.ratings[existingRatingIndex].rating = rating;
        } else {
            // Add a new rating if the tourist hasn't rated this product yet
            console.log('Adding new rating');
            product.ratings.push({ touristId, rating });
        }

        // Save the updated product
        await product.save();

        res.status(200).json({
            message: 'Product rated successfully',
            product
        });
    } catch (error) {
        console.error('Error processing rating:', error);  // Log the full error for debugging
        res.status(500).json({ message: 'Error processing rating', error });
    }
};
const reviewProduct = async (req, res) => {
    const { touristId, productId } = req.params;
    const { review } = req.body; // Expecting a review text in the body

    try {
        console.log(`Received request: Tourist ID: ${touristId}, Product ID: ${productId}, Review: ${review}`);

        // Check if tourist exists
        const tourist = await Tourist.findById(touristId);
        if (!tourist) {
            console.error('Tourist not found');
            return res.status(404).json({ message: 'Tourist not found' });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            console.error('Product not found');
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the tourist has purchased the product
        const purchasedProduct = tourist.purchasedProducts.find(
            (purchase) => purchase.productId.toString() === productId
        );

        if (!purchasedProduct) {
            console.error('Product not purchased by this tourist');
            return res.status(400).json({ message: 'Product not purchased by this tourist' });
        }

        // Initialize `reviews` array if it doesn't exist
        if (!Array.isArray(product.reviews)) {
            product.reviews = [];
        }

        // Check if the tourist has already reviewed this product
        const existingReviewIndex = product.reviews.findIndex(
            (review) => review.touristId.toString() === touristId
        );

        if (existingReviewIndex > -1) {
            // Update the existing review if the tourist has already reviewed the product
            console.log('Updating existing review');
            product.reviews[existingReviewIndex].review = review;
        } else {
            // Add a new review if the tourist hasn't reviewed this product yet
            console.log('Adding new review');
            product.reviews.push({ touristId, review });
        }

        // Save the updated product with the new or updated review
        await product.save();

        res.status(200).json({
            message: 'Product reviewed successfully',
            product
        });
    } catch (error) {
        console.error('Error processing review:', error);  // Log the full error for debugging
        res.status(500).json({ message: 'Error processing review', error });
    }
};
const rateActivity = async (req, res) => {
    const { touristId, activityId } = req.params;
    const { rating } = req.body; // Expecting a rating in the body

    try {
        console.log(`Received request: Tourist ID: ${touristId}, Activity ID: ${activityId}, Rating: ${rating}`);

        // Check if tourist exists
        const tourist = await Tourist.findById(touristId);
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }

        // Check if activity exists
        const activity = await Activity.findById(activityId);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Check if the tourist has attended (booked) the activity
        const attendedActivity = tourist.bookedActivities.includes(activityId);
        if (!attendedActivity) {
            return res.status(400).json({ message: 'Activity not attended by this tourist' });
        }

        // Initialize `ratings` array if it doesn't exist
        if (!Array.isArray(activity.ratings)) {
            activity.ratings = [];
        }

        // Check if the tourist has already rated this activity
        const existingRatingIndex = activity.ratings.findIndex(
            (review) => review.touristId.toString() === touristId
        );

        if (existingRatingIndex > -1) {
            // Update the existing rating if the tourist has already rated the activity
            console.log('Updating existing rating');
            activity.ratings[existingRatingIndex].rating = rating;
        } else {
            // Add a new rating if the tourist hasn't rated this activity yet
            console.log('Adding new rating');
            activity.ratings.push({ touristId, rating });
        }

        // Save the updated activity
        await activity.save();

        res.status(200).json({
            message: 'Activity rated successfully',
            activity
        });
    } catch (error) {
        console.error('Error processing rating:', error);  // Log the full error for debugging
        res.status(500).json({ message: 'Error processing rating', error });
    }
};
const commentOnActivity = async (req, res) => {
    const { touristId, activityId } = req.params;
    const { comment } = req.body; // Expecting a comment in the body

    try {
        console.log(`Received request: Tourist ID: ${touristId}, Activity ID: ${activityId}, Comment: ${comment}`);

        // Check if tourist exists
        const tourist = await Tourist.findById(touristId);
        if (!tourist) {
            console.error('Tourist not found');
            return res.status(404).json({ message: 'Tourist not found' });
        }

        // Check if activity exists
        const activity = await Activity.findById(activityId);
        if (!activity) {
            console.error('Activity not found');
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Check if the tourist has attended (booked) the activity
        const attendedActivity = tourist.bookedActivities.includes(activityId);
        if (!attendedActivity) {
            console.error('Activity not attended by this tourist');
            return res.status(400).json({ message: 'Activity not attended by this tourist' });
        }

        // Initialize `comments` array if it doesn't exist
        if (!Array.isArray(activity.comments)) {
            activity.comments = [];
        }

        // Add the new comment as a separate entry, even if the tourist has commented before
        activity.comments.push({ touristId, comment });
        console.log('Adding new comment');

        // Save the updated activity
        await activity.save();

        res.status(200).json({
            message: 'Comment added successfully',
            activity
        });
    } catch (error) {
        console.error('Error processing comment:', error);  // Log the full error for debugging
        res.status(500).json({ message: 'Error processing comment', error });
    }
};


const deleteTouristIfEligible = async (req, res) => {
    const { id } = req.params;  // Tourist ID

    try {
        // Find the tourist by ID
        const tourist = await Tourist.findById(id);
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }

        // Check bookedItineraries for upcoming bookings
        const hasUpcomingItinerary = tourist.bookedItineraries.some(booking => {
            console.log("date it "+ (new Date(booking.bookingDate) >= new Date()));
            return new Date(booking.bookingDate) >= new Date();
        });

        if (hasUpcomingItinerary) {
            return res.status(400).json({ message: 'Cannot delete tourist account: There is an upcoming itinerary booking.' });
        }

        // Check bookedActivities for upcoming bookings
        const hasUpcomingActivity = await Activity.exists({
            _id: { $in: tourist.bookedActivities },
            date: { $gte: new Date() }
        });

        if (hasUpcomingActivity) {
            return res.status(400).json({ message: 'Cannot delete tourist account: There is an upcoming activity booking.' });
        }

        // Delete the tourist account and associated login credentials
        await Tourist.findByIdAndDelete(id);
        await LoginCredentials.deleteOne({ userId: id, roleModel: 'Tourist' });

        res.status(200).json({ message: 'Tourist account and associated data deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getAccessToken = async () => {
    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', process.env.AMADEUS_API_KEY);
      params.append('client_secret', process.env.AMADEUS_API_SECRET);
  
      const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      const accessToken = response.data.access_token;
      
      return accessToken;
    } catch (error) {
      console.error('Error fetching token:', error.response?.data || error.message);
      throw new Error('Failed to retrieve access token');
    }
  };


const searchFlights = async (req, res) => {
    const { origin, destination, departureDate } = req.query;

    if (!origin || !destination || !departureDate) {
        return res.status(400).json({ message: 'Please provide origin, destination, and departureDate' });
    }

    try {
      
  
      const accessToken = await getAccessToken();
      console.log("Token retrieved successfully:", accessToken);
  
      const flightResponse = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          originLocationCode: origin,
          destinationLocationCode: destination,
          departureDate: departureDate,
          adults: 1,
        },
      });
      
      res.status(200).json(flightResponse.data);
    } catch (error) {
        console.error("Error fetching token:", error.response?.data || error.message);
        res.status(500).json({ message: 'Error fetching token', error: error.response?.data || error.message });
    }
  };

  const bookFlight = async (req, res) => {
    const { flightOffers } = req.body;
    const { touristId } = req.params;

    
    
    try {
        const type = "flight-order";
        const tourist = await Tourist.findById(touristId);

        if (!tourist) {
          return res.status(404).json({ message: 'Tourist not found' });
        }


        const name = tourist.username;
        var dob = tourist.DOB;
        //change dob format to YYYY-MM-DD
        dob = dob.toISOString().split('T')[0];
        const email = tourist.email;

        

    
        const accessToken = await getAccessToken();

        console.log("Im gonna end myself");
         // Step 1: Validate flight offer with Amadeus Flight Offers Price API
    const priceValidationResponse = await axios.post(
        'https://test.api.amadeus.com/v1/shopping/flight-offers/pricing',
        { data: 
            { 
                type: 'flight-offers-pricing', 
                flightOffers: [flightOffers],
            } 
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-HTTP-Method-Override': 'GET',
          },
        }
      );
      console.log("Nevermind I'm still here");
  
      const validatedFlightOffer = priceValidationResponse.data;
    //   console.log('Validated Flight Offer:', validatedFlightOffer);
    //   console.log('Validated Flight Offer:', validatedFlightOffer.data.flightOffers[0]);
    
        // Step 2: Use the access token to create a booking with Amadeus
        const amadeusResponse = await axios.post(
          'https://test.api.amadeus.com/v1/booking/flight-orders',
          {
            data: 
            {
                type,
                flightOffers: [validatedFlightOffer.data.flightOffers[0]],
                travelers: [
                    {
                        id: "1",
                        dateOfBirth: dob,
                        name: {
                        firstName: name,
                        lastName: name
                        },
                        contact: {
                            emailAddress: email,
                        }
                    }
                ]
            }
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
    
        // Step 3: Extract a summary of the booking details from Amadeus' response
        const flight = amadeusResponse.data.data; // Assuming the response has data array
        const flightOffer = flight.flightOffers[0];
        console.log('Flight Offer:', flightOffer);
        const flightId = flight.id;
        console.log('FlightID:', flightId);
        

        const summary = {
            flightId: flightId,
          userId: touristId,  // Add the user if authenticated
          origin: flightOffer.itineraries[0].segments[0].departure.iataCode,
          destination: flightOffer.itineraries[0].segments.slice(-1)[0].arrival.iataCode,
          departureDate: flightOffer.itineraries[0].segments[0].departure.at,
          arrivalDate: flightOffer.itineraries[0].segments.slice(-1)[0].arrival.at,
          duration: flightOffer.itineraries[0].duration,
          price: {
            currency: flightOffer.price.currency,
            total: flightOffer.price.total,
          },
          airline: flightOffer.validatingAirlineCodes[0],
          flightNumber: flightOffer.itineraries[0].segments[0].number,
          createdAt: new Date(),
        };
    
        // Step 4: Save the summary to MongoDB
        const newBooking = new FlightBooking(summary);
        await newBooking.save();
    
        res.status(201).json({ message: 'Flight booked successfully', booking: newBooking });
      } catch (error) {
        console.error('Error booking flight:', error.response?.data || error.message);
        res.status(500).json({ message: 'Error booking flight', error: error.response?.data || error.message });
      }
    };
  


module.exports = {
    tourist_hello,
    tourist_register,
    getTourist,
    updateTouristProfile,
    sortProductsByRatings,
    getAllProducts,
    filterProduct,
    searchProductsByName,
    filterPlacesByTag,
    // viewTouristActivities,
    // viewTouristItineraries,
    sortUpcomingActivityOrItineraries,
    searchAllModels,
    getAllUpcomingEvents,
    getAllUpcomingActivities,
    getAllUpcomingIteneries,
    getAllUpcomingPlaces,
    filterUpcomingActivities,
    filterItineraries,
    addComplaint,
    addPreferencesToTourist,
    viewComplaints,
    changePassword,
    bookItinerary,
    cancelItinerary,
    redeemPoints,
    bookActivity,
    cancelActivity,
    purchaseProduct,
    rateProduct,
    reviewProduct,
    rateActivity,
    commentOnActivity,
    deleteTouristIfEligible,
    searchFlights,
    bookFlight
};
