const bcrypt = require('bcrypt');
const Tourist = require('../models/tourist');
const Attraction = require('../models/attraction');
const Activity= require('../models/Activity');
const Itinerary = require ('../models/Itinerary');
const Product = require('../models/product');
const Cart = require('../models/cartItems');
const LoginCredentials = require('../models/LoginCredentials');
const Place = require('../models/Places');
const Complaints = require('../models/Complaints');
const axios = require('axios');
const FlightBooking = require('../models/FlightBooking');
const mongoose = require('mongoose');
const TourGuide = require('../models/TourGuide');
const nodemailer = require('nodemailer');
const HotelBooking = require('../models/HotelBooking');
const Transport = require('../models/Transport');
const Seller = require('../models/Seller');const Wishlist = require('../models/WishList');

const Order = require('../models/order');


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
            jobOrStudent,
            wallet: 0,  // Initialize wallet balance to zero
            loyaltyPoints: 0,  // Initialize loyalty points to zero
            badges: [],  // Initialize badges as an empty array
            transports: [],  // Initialize transports as an empty array 
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
        const userCredentials = await LoginCredentials.findOne({ userId: id });
        if (!userCredentials) {
            return res.status(404).json({ message: 'User credentials not found' });
        }
        console.log(userCredentials);

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
        console.log(oldPassword);
        console.log(newPassword, confirmNewPassword);
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
    const { sort, type, touristId } = req.query;  // Add touristId to query parameters
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
            // Fetch the tourist to access their booked itineraries
            const tourist = await Tourist.findById(touristId);

            // If tourist not found, return error
            if (!tourist) {
                return res.status(404).json({ message: 'Tourist not found' });
            }

            // Get list of itinerary IDs that the tourist has booked
            const bookedItineraryIds = tourist.bookedItineraries.map(item => item.itineraryId);

            console.log()

            // Fetch and sort upcoming itineraries based on criteria
            const itineraries = await Itinerary.find({
                availableDates: { $elemMatch: { $gte: currentDate } },  // Match upcoming dates
                flagged: false,
                $or: [
                    { deactivated: false },  // Not deactivated
                    { _id: { $in: bookedItineraryIds }, deactivated: true }  // Deactivated but booked by tourist
                ]
            }).sort(sortCriteria);

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
    const { touristId } = req.query;  // Extract touristId from query parameters

    try {
        const currentDate = new Date();

        // Fetch the tourist to get their booked itineraries
        const tourist = await Tourist.findById(touristId);

        // If tourist not found, return error
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }

        // Get list of itinerary IDs that the tourist has booked
        const bookedItineraryIds = tourist.bookedItineraries.map(item => item.itineraryId);

        // Fetch itineraries where at least one date in availableDates is upcoming, excluding flagged itineraries
        const itineraries = await Itinerary.find({
            availableDates: { $elemMatch: { $gte: currentDate } },  // Match upcoming dates
            flagged: false,  // Exclude flagged itineraries
            $or: [
                { deactivated: false },  // Not deactivated
                { _id: { $in: bookedItineraryIds }, deactivated: true }  // Deactivated but booked by tourist
            ]
        });

        if (itineraries.length === 0) {
            return res.status(404).json({ message: 'No upcoming itineraries found' });
        }

        res.status(200).json({ itineraries });
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
        console.log("here");

        // Filter places by opening hours (you can adjust this logic based on your openingHours format)
        const upcomingPlaces = places.filter(place => !place.flagged);

      

        console.log("here 2");

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
    const { query, touristId  } = req.query;  // Only extract the query term

    if (!query) {
        return res.status(400).json({ message: "Please provide a search term." });
    }

    // General search criteria for all models
    let searchCriteria = {
    $and: [
        {
            $or: [
                { name: { $regex: query, $options: 'i' } },      // Search by name (case-insensitive)
                { category: { $regex: query, $options: 'i' } },  // Search by category
                { tags: { $regex: query, $options: 'i' } }       // Search by tags
            ]
        },
        { flagged: false }
    ]
};


    try {
        const attractions = await Attraction.find(searchCriteria);
        const activities = await Activity.find(searchCriteria);
        
       // Fetch the tourist to get their booked itineraries
       const tourist = await Tourist.findById(touristId);
       const bookedItineraryIds = tourist ? tourist.bookedItineraries.map(item => item.itineraryId) : [];

       // Itinerary search criteria with deactivation check
       let itinerarySearchCriteria = {
        $and: [
            {
                $or: [
                    { title: { $regex: query, $options: 'i' } },  // Search by itinerary title
                    { tags: { $regex: query, $options: 'i' } }    // Search by tags
                ]
            },
            { flagged: false },
            {
                $or: [
                    { deactivated: false },                         // Include only active itineraries
                    { _id: { $in: bookedItineraryIds }, deactivated: true }  // Or include deactivated itineraries that are booked by this tourist
                ]
            }
        ]
    };
       const itineraries = await Itinerary.find(itinerarySearchCriteria);
              

       let placeSearchCriteria = {
        $and: [
            {
                $or: [
                    { name: { $regex: query, $options: 'i' } },  // Search by place name
                    { tagss: { $regex: query, $options: 'i' } }  // Search by tags
                ]
            },
            { flagged: false }
        ]
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
    const { budget, date, preferences, language, touristId } = req.query;

    let filter = { flagged: false }; // Initialize filter object

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
        // Fetch the tourist to get their booked itineraries
        const tourist = await Tourist.findById(touristId);

        // Get list of itinerary IDs that the tourist has booked
        const bookedItineraryIds = tourist ? tourist.bookedItineraries.map(item => item.itineraryId) : [];

        // Add deactivated filter condition
        filter.$or = [
            { deactivated: false },  // Include active itineraries
            { _id: { $in: bookedItineraryIds }, deactivated: true }  // Include deactivated but booked by tourist
        ];

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
    console.log(preferences);
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
        //console.log(tourist2.preferences);

        
        await tourist.save();

        res.status(200).json({ message: 'Preferences updated successfully', tourist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const removePreferencesFromTourist = async (req, res) => {
    const { id } = req.params;  // Tourist ID
    const { preferences } = req.body;  // List of preference IDs to remove

    try {
        const tourist = await Tourist.findById(id);
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }

        // Ensure the preferences field is an array and remove each preference
        if (Array.isArray(preferences)) {
            preferences.forEach(preference => {
                // Pull each preference from the array
                tourist.preferences.pull(preference);
            });
        } else {
            // In case a single preference ID is provided
            tourist.preferences.pull(preferences);
        }

        await tourist.save();

        res.status(200).json({ message: 'Preferences removed successfully', tourist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const viewComplaints = async (req, res) => {
    const touristId = req.params.id; // Extracting the tourist ID from the URL parameters

    try {
        const complaints = await Complaints.find({ tourist: touristId }).select('title body state date');
        console.log(complaints);
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
    const { touristId, itineraryId } = req.params;

    try {
        // Step 1: Fetch the tourist with the given touristId
        const tourist = await Tourist.findById(touristId);

        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found.' });
        }

        // Step 2: Check if the itinerary exists in the tourist's bookedItineraries array
        const bookedItinerary = tourist.bookedItineraries.find(
            itinerary => itinerary.itineraryId.toString() === itineraryId
        );

        if (!bookedItinerary) {
            return res.status(404).json({ message: 'Itinerary not found for this tourist.' });
        }

        // Fetch the full itinerary details to get the price
        const itinerary = await Itinerary.findById(itineraryId);

        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found.' });
        }

        // Step 3: Check if the booking date is more than 48 hours from now
        const now = new Date();
        const bookingDate = bookedItinerary.bookingDate;

        if (!bookingDate) {
            return res.status(400).json({ message: 'Booking date is not valid.' });
        }

        const diffInMilliseconds = bookingDate.getTime() - now.getTime();

        if (diffInMilliseconds < 48 * 60 * 60 * 1000) {
            return res.status(400).json({ message: 'Cannot cancel the itinerary within 48 hours of the booking date.' });
        }

        // Step 4: Add the itinerary price to the tourist's wallet
        if (!itinerary.price || isNaN(itinerary.price)) {
            return res.status(400).json({ message: 'Itinerary price is invalid or missing.' });
        }

        tourist.wallet = (tourist.wallet || 0) + itinerary.price;
        await tourist.save();

        // Step 5: Remove the specific itinerary from the bookedItineraries array
        const touristUpdate = await Tourist.findByIdAndUpdate(
            touristId,
            { $pull: { bookedItineraries: { itineraryId: itineraryId } } },
            { new: true }
        );

        if (!touristUpdate) {
            return res.status(404).json({ message: 'Failed to update tourist bookings.' });
        }

        // Step 6: Remove the touristId from the itinerary's touristIDs array
        const itineraryUpdate = await Itinerary.findByIdAndUpdate(
            itineraryId,
            { $pull: { touristIDs: { touristId: touristId } } },
            { new: true }
        );

        if (!itineraryUpdate) {
            return res.status(404).json({ message: 'Itinerary not found or failed to update.' });
        }

        return res.status(200).json({
            message: 'Itinerary cancelled successfully.',
            walletBalance: tourist.wallet,
            tourist: touristUpdate,
            itinerary: itineraryUpdate
        });

    } catch (error) {
        console.error('Error cancelling the booking process:', error); // Log the error for debugging
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
       
        
        
       
        if (oldPoints < 10000) {
            return res.status(400).json({ 
                message: 'Insufficient loyalty points. You need at least 10,000 points to redeem into your wallet.' 
            });
        }
        const redeemablePoints = Math.floor(oldPoints / 10000) * 10000;
        const remainingPoints = oldPoints % 10000;

        // Convert redeemable points to wallet amount
        const amountToAdd = (redeemablePoints / 10000) * 100; // Conversion rate: 10,000 points = 100 EGP

        // Step 3: Update tourist's wallet and loyalty points
       
        tourist.loyaltyPoints = remainingPoints;
        let newPoints = remainingPoints;
        let newLevel = 1;
        let newAmount = 0.5;


        // Update the tourist document
        const touristUpdate = await Tourist.findByIdAndUpdate(
            touristId, 
            { 
                $set: { 
                    loyaltyPoints: newPoints,          // Reset loyalty points
                    'badge.level': newLevel,           // Reset badge level
                    'badge.amount': newAmount          // Reset badge amount
                },
                $inc: { wallet: amountToAdd }           // Increment wallet by toBeAdded amount
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
         // Step 4: Add the price of the activity to the tourist's wallet
         const activityPrice = activity.price; // Ensure the 'price' field exists in the Activity schema
         tourist.wallet = (tourist.wallet || 0) + activityPrice;
         // Save the updated tourist document
        await tourist.save();

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
            message: 'Activity cancelled successfully. The amount has been added to your wallet.',
            walletBalance: tourist.wallet,
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

        // Push a new rating to the `ratings` array
        product.ratings.push({ touristId, rating });

        // Save the updated product
        await product.save();

        res.status(200).json({
            message: 'Product rated successfully',
            product
        });
    } catch (error) {
        console.error('Error processing rating:', error);
        res.status(500).json({ message: 'Error processing rating', error });
    }
};



const getTouristById = async (req, res) => {
    const { id } = req.params;
    try {
      const tourist = await Tourist.findById(id);
      if (!tourist) {
        return res.status(404).json({ message: 'Tourist not found' });
      }
      res.status(200).json(tourist);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tourist data', error });
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
        if (!product.reviews) {
            product.reviews = [];
        }

        // Append the new review to the `reviews` array
        product.reviews.push({
            touristId,
            review,
        });

        // Save the updated product
        await product.save();

        res.status(200).json({ message: 'Review added successfully', product });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Error adding review', error });
    }
};


const rateActivity = async (req, res) => {
    const { touristId, activityId } = req.params;
    const { rating } = req.body; // Expecting a rating in the body

    try {
        // Fetch the completed activities for the tourist
        const completedActivities = await getCompletedActivities(touristId); // Ensure correct touristId

        // Check if the activity is in the list of completed activities
        const isCompleted = completedActivities.some(activity => activity._id.toString() === activityId);
        if (!isCompleted) {
            return res.status(400).json({ message: 'You can only rate activities that you have completed.' });
        }

        // Find the activity
        const activity = await Activity.findById(activityId);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
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

        // Calculate the new average rating
        const totalRating = activity.ratings.reduce((sum, ratingObj) => sum + ratingObj.rating, 0);
        const averageRating = totalRating / activity.ratings.length;

        // Update the average rating field in the activity
        activity.averageRating = averageRating;

        // Save the updated activity
        await activity.save();

        // Send a response with the updated information
        return res.status(200).json({
            message: 'Activity rated successfully',
            averageRating: activity.averageRating,
            activity
        });

    } catch (error) {
        console.error('Error processing rating:', error);
        return res.status(500).json({ message: 'Error processing rating', error });
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



const getCompletedItineraries = async (req, res) => {
    const { touristId } = req.params;
    const currentDate = new Date();

    try {
        // Find the tourist and filter their booked itineraries based on past booking dates
        const tourist = await Tourist.findById(touristId).populate('bookedItineraries.itineraryId');
        
        if (!tourist) {
            //return res.status(404).json({ message: 'Tourist not found' });
       return [];
        }

        // Filter for completed itineraries
        const completedItineraries = tourist.bookedItineraries.filter(booking =>
            booking.bookingDate < currentDate // Check if the booking date is in the past
        ).map(booking => booking.itineraryId);

    //   res.status(200).json(completedItineraries);
     return completedItineraries;
    } catch (error) {
        console.error('Error fetching completed itineraries:', error);
        res.status(500).json({ error: 'An error occurred while retrieving completed itineraries' });
    }
};
const getCompletedActivities = async (touristId) => {
    const currentDate = new Date();

    try {
        // Ensure the touristId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(touristId)) {
            throw new Error('Invalid touristId');
        }

        // Find the tourist and populate the booked activities to get activity details
        const tourist = await Tourist.findById(touristId).populate('bookedActivities');

        if (!tourist) {
            throw new Error('Tourist not found');
        }

        // Filter for completed activities based on the activity date being in the past
        const completedActivities = tourist.bookedActivities.filter(activity =>
            activity.date < currentDate // Check if the activity date is in the past
        );

        return completedActivities;
    } catch (error) {
        console.error('Error fetching completed activities:', error);
        throw new Error('An error occurred while retrieving completed activities');
    }
};

//function to rate an itinerary but i want to add a check to ensure that the tourist has actually booked the itinerary before rating it and use the getCompletedItineraries function to check if the itinerary is in the list of completed itineraries

const rateItinerary = async (req, res) => {
    const { touristId, itineraryId } = req.params;
    const { rating } = req.body;

    console.log('rate ');

    try {
        // Fetch the completed itineraries for the tourist
        const completedItineraries = await getCompletedItineraries({ params: { touristId } }, res);

        // Check if the itinerary is in the list of completed itineraries
        const isCompleted = completedItineraries.some(itinerary => itinerary._id.toString() === itineraryId);

        if (!isCompleted) {
            return res.status(400).json({ message: 'You can only rate itineraries that you have completed.' });
        }

        // Find the itinerary and add the rating
        const itinerary = await Itinerary.findById(itineraryId);
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        // Add the new rating to the ratings array
        itinerary.ratings.push(rating);

        // Recalculate the average rating
        const totalRatings = itinerary.ratings.length;
        const sumRatings = itinerary.ratings.reduce((sum, r) => sum + r, 0);  // Ratings are numeric values
        itinerary.averageRating = sumRatings / totalRatings;

        await itinerary.save();

        res.status(200).json({ message: 'Itinerary rated successfully', itinerary });
    } catch (error) {
        console.error('Error in rateItinerary:', error.message);
        res.status(500).json({ error: 'An error occurred while rating the itinerary.' });
    }

    console.log('rate done');
};




const commentOnItinerary = async (req, res) => {
    const { touristId, itineraryId } = req.params;
    const { comment } = req.body;

    console.log('comment');

    try {
        // Fetch the completed itineraries for the tourist
        const completedItineraries = await getCompletedItineraries({ params: { touristId } }, res);

        // Check if the itinerary is in the list of completed itineraries
        const isCompleted = completedItineraries.some(itinerary => itinerary._id.toString() === itineraryId);

        if (!isCompleted) {
            return res.status(400).json({ message: 'You can only comment on itineraries that you have completed.' });
        }

        // Find the itinerary and add the comment
        const itinerary = await Itinerary.findById(itineraryId);
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        // Add the comment to the itinerary
        itinerary.comment.push({ tourist: touristId, text: comment });
        await itinerary.save();

        res.status(200).json({ message: 'Comment added successfully', itinerary });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

    console.log('rate done');
};
const commentOnActivity = async (req, res) => {
    const { touristId, activityId } = req.params; // Retrieve touristId and activityId from the URL
    const { comment } = req.body;

    // Check if touristId and activityId are provided
    if (!touristId || !activityId) {
        return res.status(400).json({ message: 'Missing required parameters: touristId or activityId' });
    }

    try {
        // Log the touristId to confirm it is correctly passed
        console.log(`Received touristId: ${touristId} and activityId: ${activityId}`);

        // Fetch the completed activities for the tourist
        let completedActivities;
        try {
            completedActivities = await getCompletedActivities(touristId); // Pass touristId directly like in rateActivity
        } catch (err) {
            console.error('Error fetching completed activities:', err.message);
            return res.status(500).json({ message: 'Error occurred while retrieving completed activities', error: err.message });
        }

        // Check if completed activities are retrieved
        if (!completedActivities || completedActivities.length === 0) {
            return res.status(404).json({ message: 'No completed activities found for this tourist.' });
        }

        // Check if the activity is in the list of completed activities
        const isCompleted = completedActivities.some(activity => activity._id.toString() === activityId);

        if (!isCompleted) {
            return res.status(400).json({ message: 'You can only comment on activities that you have completed.' });
        }

        // Find the activity by its ID
        const activity = await Activity.findById(activityId);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Initialize `comments` array if it doesn't exist
        if (!Array.isArray(activity.comments)) {
            activity.comments = [];
        }

        // Add the new comment as a separate entry
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
        res.status(500).json({ message: 'Error processing comment', error: error.message });
    }
};




//function to rate tourguide using the tourguide id and use the getCompletedItineraries function to check if the tourguide is in the list of completed itineraries
const rateTourGuide = async (req, res) => {
    const { touristId, tourGuideId } = req.params;
    const { rating } = req.body;
console.log(tourGuideId);
    try {
        // Fetch the completed itineraries for the tourist
        const completedItineraries = await getCompletedItineraries({ params: { touristId } }, res);

        // Check if the tourGuideId is in the list of completed itineraries
        const isCompleted = completedItineraries.some(itinerary => itinerary.tourGuideId.toString() === tourGuideId);

        if (!isCompleted) {
            return res.status(400).json({ message: 'You can only rate tour guides that you have interacted with.' });
        }
console.log("isCompleted=true");
        // Find the tour guide and add the rating
        const tourGuide = await TourGuide.findById(tourGuideId);
        if (!tourGuide) {
            return res.status(404).json({ message: 'Tour guide not found' });
        }

        // Add the new rating to the ratings array
        tourGuide.ratings.push(rating);

        // Recalculate the average rating
        const totalRatings = tourGuide.ratings.length;
        const sumRatings = tourGuide.ratings.reduce((sum, r) => sum + r, 0);  // Ratings are numeric values
        tourGuide.averageRating = sumRatings / totalRatings;

        await tourGuide.save();

        res.status(200).json({ message: 'Tour guide rated successfully', tourGuide });
    } catch (error) {
        console.error('Error in rateTourGuide:', error.message);
        res.status(500).json({ error: 'An error occurred while rating the tour guide.' });
    }
};
//function to comment on tourguide using the tourguide id and use the getCompletedItineraries function to check if the tourguide is in the list of completed itineraries
const commentOnTourGuide = async (req, res) => {
    const { touristId, tourGuideId } = req.params;
    const { comment } = req.body;

    try {
        // Fetch the completed itineraries for the tourist
        const completedItineraries = await getCompletedItineraries({ params: { touristId } }, res);

        // Check if the tourGuideId is in the list of completed itineraries
        const isCompleted = completedItineraries.some(itinerary => itinerary.tourGuideId.toString() === tourGuideId);

        if (!isCompleted) {
            return res.status(400).json({ message: 'You can only comment on tour guides that you have interacted with.' });
        }

        // Find the tour guide and add the comment
        const tourGuide = await TourGuide.findById(tourGuideId);
        if (!tourGuide) {
            return res.status(404).json({ message: 'Tour guide not found' });
        }

        // Add the comment to the tour guide
        tourGuide.comment.push({ tourist: touristId, text: comment });
        await tourGuide.save();

        res.status(200).json({ message: 'Comment added successfully', tourGuide });
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


const searchFlights = async (origin, destination, departureDate, accessToken) => {

    try {
      
        console.log("Origin:", origin);
        console.log("Destination:", destination);
        console.log("Departure Date:", departureDate);
        
        const newAccessToken = await getAccessToken();
        if(!origin || !destination || !departureDate){
            return { message: 'Please provide origin, destination, and departureDate' };
        }
  
      console.log("Token retrieved successfully:", accessToken);
  
      const flightResponse = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
        params: {
          originLocationCode: origin,
          destinationLocationCode: destination,
          departureDate: departureDate,
          adults: 1,
        },
      });
      console.log("searchFlights is done");
      return flightResponse.data;
    } catch (error) {
        console.error('Error fetching flights:', error.response?.data || error.message);
        return { message: 'Error fetching token', error: error.response?.data || error.message };
    }
  };

  const getFlightPrices = async (req, res) => {
    const { origin, destination, departureDate } = req.query;

    
    

    if (!origin || !destination || !departureDate) {
        return res.status(400).json({ message: 'Please provide origin, destination, and departureDate' });
    }

    try {
        const accessToken = await getAccessToken();
        console.log('Token retrieved successfully:', accessToken);

        const FlightSearchResponse = await searchFlights(origin, destination, departureDate, accessToken);
        console.log("Flight Search Response:", FlightSearchResponse.data);

        if(FlightSearchResponse.data.length > 6){
            FlightSearchResponse.data = FlightSearchResponse.data.slice(0,6);
        }

        const flightResponse = await axios.post('https://test.api.amadeus.com/v1/shopping/flight-offers/pricing', {
            data: {
              type: 'flight-offers-pricing',
              flightOffers: FlightSearchResponse.data,
            },
          }, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'X-HTTP-Method-Override': 'GET',
            },
          });

        res.status(200).json(flightResponse.data);
    } catch (error) {
        console.error('Error fetching token:', error.response?.data || error.message);
        res.status(500).json({ message: 'Error fetching token', error: error.response?.data || error.message });
    }
};


const bookFlight = async (req, res) => {
    const { flightOffers } = req.body;
    const { touristId } = req.params;

    
    
    try {
        const type = "flight-order";
        const tourist = await Tourist.findById(touristId);

        const priceValidationResponse = flightOffers;

        if (!tourist) {
          return res.status(404).json({ message: 'Tourist not found' });
        }


        const name = tourist.username;
        var dob = tourist.DOB;
        //change dob format to YYYY-MM-DD
        dob = dob.toISOString().split('T')[0];
        const email = tourist.email;
        const wallet = tourist.wallet;
        

    
        const accessToken = await getAccessToken();

        console.log("Im gonna end myself");
         // Step 1: Validate flight offer with Amadeus Flight Offers Price API
    
  
      const validatedFlightOffer = priceValidationResponse;
console.log("validatedFlightOffer:", validatedFlightOffer);
      if(validatedFlightOffer.price.total > wallet){
        return res.status(400).json({ message: 'Insufficient funds in wallet' });
        }
       
        // Step 2: Use the access token to create a booking with Amadeus
        const amadeusResponse = await axios.post(
          'https://test.api.amadeus.com/v1/booking/flight-orders',
          {
            data: 
            {
                type,
                flightOffers: [validatedFlightOffer],
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
        
        await Tourist.findByIdAndUpdate(touristId, { wallet: wallet - validatedFlightOffer.price.total });
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

const shareActivityViaEmail = async (req, res) => {
    const { email } = req.body;
    const { id } = req.params;

    if (!email || !id) {
        return res.status(400).json({ message: 'Please provide email and id' });
    }

    try {
        const item = await Activity.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        const link = `http://localhost:3000/activity-details/${id}`;

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "winggo567@gmail.com",
                pass: "smkg eghm yrzv yyir"
            }
        });

        await transporter.sendMail({
            from: "winggo567@gmail.com",
            to: email,
            subject: 'Check out this Activity',
            text: `Here is the link: ${link}`,
            html: `<p>Here is the link: <a href="${link}">${link}</a></p>`
        });

        res.status(200).json({ message: 'Activity shared successfully via email', link });
    } catch (error) {
        res.status(500).json({ message: 'Error sharing via email', error });
    }
};

const shareItineraryViaEmail = async (req, res) => {
    const { email } = req.body;
    const { id } = req.params;

    if (!email || !id) {
        return res.status(400).json({ message: 'Please provide email and id' });
    }

    try {
        const item = await Itinerary.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        const link = `http://localhost:3000/it-details/${id}`;

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "winggo567@gmail.com",
                pass: "smkg eghm yrzv yyir"
            }
        });

        await transporter.sendMail({
            from: "winggo567@gmail.com",
            to: email,
            subject: 'Check out this Itinerary',
            text: `Here is the link: ${link}`,
            html: `<p>Here is the link: <a href="${link}">${link}</a></p>`
        });

        res.status(200).json({ message: 'Itinerary shared successfully via email', link });
    } catch (error) {
        res.status(500).json({ message: 'Error sharing via email', error });
    }
};

const sharePlaceViaEmail = async (req, res) => {
    const { email } = req.body;
    const { id } = req.params;

    if (!email || !id) {
        return res.status(400).json({ message: 'Please provide email and id' });
    }

    try {
        const item = await Place.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Place not found' });
        }

        const link = `http://localhost:3000/place-details/${id}`;

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "winggo567@gmail.com",
                pass: "smkg eghm yrzv yyir"
            }
        });

        await transporter.sendMail({
            from: "winggo567@gmail.com",
            to: email,
            subject: 'Check out this Place',
            text: `Here is the link: ${link}`,
            html: `<p>Here is the link: <a href="${link}">${link}</a></p>`
        });

        res.status(200).json({ message: 'Place shared successfully via email', link });
    } catch (error) {
        res.status(500).json({ message: 'Error sharing via email', error });
    }
};

const shareProductViaEmail = async (req, res) => {
    const { email } = req.body;
    const { id } = req.params;

    if (!email || !id) {
        return res.status(400).json({ message: 'Please provide email and id' });
    }

    try {
        const item = await Product.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const link = `${req.protocol}://${req.get('host')}/product/${id}`;

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "winggo567@gmail.com",
                pass: "smkg eghm yrzv yyir"
            }
        });

        await transporter.sendMail({
            from: "winggo567@gmail.com",
            to: email,
            subject: 'Check out this Product',
            text: `Here is the link: ${link}`,
            html: `<p>Here is the link: <a href="${link}">${link}</a></p>`
        });

        res.status(200).json({ message: 'Product shared successfully via email', link });
    } catch (error) {
        res.status(500).json({ message: 'Error sharing via email', error });
    }
};

    // const shareViaLink = (req, res) => { // To be done with FrontEnd
    //     const { type, id } = req.body;

    //     if (!type || !id) {
    //         return res.status(400).json({ message: 'Please provide type and id' });
    //     }

    //     try {
    //         const link = `${req.protocol}://${req.get('host')}/${type}/${id}`;
    //         res.status(200).json({ message: 'Link generated successfully', link });
    //     } catch (error) {
    //         res.status(500).json({ message: 'Error generating link', error });
    //     }
    // };

    const convertCurrency = async (amount, fromCurrency, toCurrency) => {
        try {
            const response = await axios.get('https://api.exchangerate-api.com/v4/latest/' + fromCurrency);
            const rate = response.data.rates[toCurrency];
            return amount * rate;
        } catch (error) {
            console.error('Error converting currency:', error.message);
            throw new Error('Failed to convert currency');
        }
    };

    const updateProductPricesToCurrency = async (req, res) => {
        const { currency = 'USD' } = req.query;  // Default currency is USD
    
        try {
            const products = await Product.find();
            await Promise.all(products.map(async product => {
                if (currency !== 'USD') {
                    const priceInCurrency = await convertCurrency(product.price, 'USD', currency);
                    product.price = priceInCurrency;
                    await product.save();
                }
            }));
    
            res.status(200).json({ message: 'Product prices updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };


  
    const searchHotelsByCity = async (cityCode) => {

        

        if (!cityCode) {
            return res.status(400).json({ message: 'Please provide cityCode' });
        }

        try {
      
  
        const accessToken = await getAccessToken();
        console.log("Token retrieved successfully:", accessToken);
    
        const hotelResponse = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city', {
            headers: {
            Authorization: `Bearer ${accessToken}`,
            },
            params: {
                cityCode: cityCode,
            },
        });
        
        return hotelResponse.data;
        } catch (error) {
            console.error("Error fetching token:", error.response?.data || error.message);
            return { message: 'Error fetching token', error: error.response?.data || error.message };
        }

    };

    const searchHotelsByGeoLocation = async (latitude,longitude) => {
        
    
        if (!latitude || !longitude) {
            return res.status(400).json({ message: 'Please provide latitude and longitude' });
        }
        
        try {
            const accessToken = await getAccessToken();
    
            const hotelResponse = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-geocode', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    latitude: latitude,
                    longitude: longitude,
                },
            });
    
            return hotelResponse.data;

        } catch (error) {
            console.error("Error fetching token:", error.response?.data || error.message);
            return { message: 'Error fetching token', error: error.response?.data || error.message };
        }
    }

    const getHotelOffersByCity = async (req, res) => {

        const { cityCode } = req.query;

        if (!cityCode) {
            return res.status(400).json({ message: 'Please provide cityCode' });
        }

        try {

            const accessToken = await getAccessToken();
            console.log("Token retrieved successfully:", accessToken);

            const hotelSearchResponse = await searchHotelsByCity(cityCode);
            console.log("Hotel Search Response:", hotelSearchResponse);

            const hotelIds = hotelSearchResponse.data.slice(0,10).map(hotel => hotel.hotelId);
            console.log("Hotel IDs:", hotelIds);

            const hotelOffersResponse = await axios.get('https://test.api.amadeus.com/v3/shopping/hotel-offers', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    hotelIds: hotelIds,
                
                },
                paramsSerializer: params => {
                  return Object.keys(params)
                    .map(key => `${key}=${encodeURIComponent(params[key].join(','))}`)
                    .join('&');
                },
            });

            res.status(200).json(hotelOffersResponse.data);

        } catch (error) {
            console.error("Error fetching token:", error.response?.data || error.message);
            res.status(500).json({ message: 'Error fetching token', error: error.response?.data || error.message });
        }
    }

    const getHotelOffersByLocation = async (req, res) => {

        const { latitude, longitude } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({ message: 'Please provide latitude and longitude' });
        }

        try {

            const accessToken = await getAccessToken();
            console.log("Token retrieved successfully:", accessToken);

            const hotelSearchResponse = await searchHotelsByGeoLocation(latitude,longitude);
            console.log("Hotel Search Response:", hotelSearchResponse);

            const hotelIds = hotelSearchResponse.data.slice(0,10).map(hotel => hotel.hotelId);
            console.log("Hotel IDs:", hotelIds);

            const hotelOffersResponse = await axios.get('https://test.api.amadeus.com/v3/shopping/hotel-offers', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    hotelIds: hotelIds,
                
                },
                paramsSerializer: params => {
                  return Object.keys(params)
                    .map(key => `${key}=${encodeURIComponent(params[key].join(','))}`)
                    .join('&');
                },
            });

            res.status(200).json(hotelOffersResponse.data);

        } catch (error) {
            console.error("Error fetching token:", error.response?.data || error.message);
            res.status(500).json({ message: 'Error fetching token', error: error.response?.data || error.message });
        }

    };

    const bookHotel = async (req, res) => {

        const { hotelOffers } = req.body;
        const { touristId } = req.params;

        try {
            const type = "hotel-order";
            const tourist = await Tourist.findById(touristId);

            if (!tourist) {
                return res.status(404).json({ message: 'Tourist not found' });
            }
            const name = tourist.username;
            const email = tourist.email;
            const mobileNumber  = tourist.mobileNumber;
            const wallet = tourist.wallet;
            console.log("wallet: ", wallet);
            var dob = tourist.DOB;
            //change dob format to YYYY-MM-DD
            dob = dob.toISOString().split('T')[0];
            
            
            const accessToken = await getAccessToken();
            console.log("Token retrieved successfully:", accessToken);
             // Extract fields from hotelOffers for booking
             const offerId = hotelOffers.offers[0].id;  // Retrieve the offer ID
             const checkInDate = hotelOffers.offers[0].checkInDate;  // Check-in date
             const checkOutDate = hotelOffers.offers[0].checkOutDate;  // Check-out date
             const roomType = hotelOffers.offers[0].room.type;  // Room type
             const rateCode = hotelOffers.offers[0].rateCode;  // Rate code
             const totalPrice = hotelOffers.offers[0].price.total;  // Total price for the offer
             console.log("Total Price: ", totalPrice);
             const currency = hotelOffers.offers[0].price.currency;  // Currency of the offer

            if(wallet < totalPrice){
                return res.status(400).json({ message: 'Insufficient funds in wallet' });
            }
            const newWallet = wallet - totalPrice;

            const bookingResponse = await axios.post(
                'https://test.api.amadeus.com/v2/booking/hotel-orders',
                {
                    
                        data: {
                            type: type,
                            guests: [
                                {
                                    tid: 1,
                                    firstName: name,
                                    lastName: name,
                                    phone: mobileNumber,
                                    email: email
                                  }
                            ],
                            roomAssociations: [
                                {
                                    hotelOfferId: offerId,
                                    guestReferences: [{ guestReference: "1" }],
                                },
                            ],
                            travelAgent: {
                                contact: { email: email },
                            },
                            payment: {
                                method: "CREDIT_CARD",
                                paymentCard: {
                                    paymentCardInfo:
                                    {
                                        vendorCode: "VI",
                                        cardNumber: "4111111111111111",
                                        expiryDate: "2028-01",
                                        holderName: "BOB SMITH",
                                    }
                                },
                                
                            }
                            
                        },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                
                await Tourist.findByIdAndUpdate(touristId, { wallet: newWallet });


              const data = bookingResponse.data.data;
              console.log('Hotel Booking Response:', JSON.stringify(data, null, 2)); // Print full response

    const bookingSummary = {
      bookingId: data.id,
      bookingStatus: data.hotelBookings[0].bookingStatus,
      confirmationNumber: data.hotelBookings[0].hotelProviderInformation[0].confirmationNumber,
      checkInDate: new Date(data.hotelBookings[0].hotelOffer.checkInDate),
      checkOutDate: new Date(data.hotelBookings[0].hotelOffer.checkOutDate),
      guests: 
        {
            adults: 1
        }
      ,
      hotel: {
        hotelId: data.hotelBookings[0].hotel.hotelId,
        name: data.hotelBookings[0].hotel.name,
        address: data.hotelBookings[0].hotel.address,
      },
      userId: touristId,
    };

              const newBooking = new HotelBooking(bookingSummary);
              await newBooking.save();

                res.status(201).json({ message: 'Hotel booked successfully', booking: newBooking });
        }
        catch (error) {
            console.error('Error booking hotel:', error.response?.data || error.message);
            res.status(500).json({ message: 'Error booking hotel', error: error.response?.data || error.message });
        }
    }

    const bookTransport = async (req, res) => {
        const { touristId, transportId } = req.params;
    
        try {
            // Find the tourist by ID
            const tourist = await Tourist.findById(touristId);
            if (!tourist) {
                return res.status(404).json({ message: 'Tourist not found' });
            }
    
            // Find the transport by ID
            const transport = await Transport.findById(transportId);
            if (!transport) {
                return res.status(404).json({ message: 'Transport not found' });
            }
    
            // Check if the tourist has enough funds in their wallet
            if (tourist.wallet < transport.price) {
                return res.status(400).json({ message: 'Insufficient funds in wallet' });
            }
    
            // Subtract the price of the transport from the tourist's wallet
            tourist.wallet -= transport.price;
    
            // Add the tourist ID to the transport's touristID field
            transport.touristID = touristId;
            await transport.save();
    
            // Add the transport ID to the tourist's transports field
            tourist.transports.push(transportId);
            await tourist.save();
    
            res.status(200).json({
                message: 'Transport booked successfully',
                transport,
                tourist
            });
        } catch (error) {
            res.status(500).json({ message: 'Error booking transport', error: error.message });
        }
    };

           
    const getBookedItineraries = async (req, res) => {
        const { touristId } = req.params;
    
        try {
            // Find the tourist by ID and populate the itinerary details
            const tourist = await Tourist.findById(touristId).populate({
                path: 'bookedItineraries.itineraryId',
                model: 'Itinerary'
            });
    
            if (!tourist) {
                return res.status(404).json({ message: 'Tourist not found' });
            }
    
            // Extract and format the itinerary data
            const bookedItineraries = tourist.bookedItineraries.map((booking) => ({
                itinerary: booking.itineraryId,
                bookingDate: booking.bookingDate
            }));
    
            res.status(200).json(bookedItineraries);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };   
    const getBookedActivities = async (req, res) => {
        const { touristId } = req.params;
    
        try {
            // Find the tourist by ID and populate the activity details
            const tourist = await Tourist.findById(touristId).populate({
                path: 'bookedActivities', // Directly populate the 'bookedActivities' field
                model: 'Activity'
            });
    
            if (!tourist) {
                return res.status(404).json({ message: 'Tourist not found' });
            }
    
            // Extract and format the booked activities data
            const bookedActivities = tourist.bookedActivities.map((activity) => ({
                activity: activity,  // Activity details
            }));
    
            res.status(200).json(bookedActivities);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    const getTouristUsername = async (req, res) => {
        try {
            const { id } = req.params;
            const tourist = await Tourist.findById(id).select('username'); // Only select the username field
    
            if (!tourist) {
                return res.status(404).json({ message: "Tourist not found" });
            }
    
            res.json({ username: tourist.username });
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    };    const getPurchasedProducts = async (req, res) => {
        const { touristId } = req.params;
    
        try {
            const tourist = await Tourist.findById(touristId).populate('purchasedProducts.productId');
            
            if (!tourist) {
                return res.status(404).json({ message: 'Tourist not found' });
            }
    
            // Format the purchased products to match the desired output structure
            const purchasedProductData = tourist.purchasedProducts.map(purchased => ({
                _id: purchased.productId ? purchased.productId._id : null,
                name: purchased.productId ? purchased.productId.name : null,
                picture: purchased.productId
                    ? `../images/${purchased.productId.picture || 'null'}` // Use a placeholder if picture is null
                    : null,
                price: purchased.productId ? purchased.productId.price : null,
                sales: purchased.productId ? purchased.productId.sales : 0,
                description: purchased.productId ? purchased.productId.description : null,
                quantity: purchased.productId ? purchased.productId.quantity : 0,
                seller: purchased.productId && purchased.productId.seller ? purchased.productId.seller.username : 'Admin', // Handle null seller field
                sellerID: purchased.productId && purchased.productId.seller ? purchased.productId.seller._id : 'Admin',
                ratings: purchased.productId ? purchased.productId.ratings : [],
                reviews: purchased.productId ? purchased.productId.reviews : [],
                archive: purchased.productId ? purchased.productId.archive : false,
                purchaseDate: purchased.purchaseDate || null // Include purchase date from purchasedProducts array
            }));
    
            res.status(200).json(purchasedProductData);
        } catch (error) {
            console.error("Error fetching purchased products:", error);
            res.status(500).json({ message: 'Error fetching purchased products', error });
        }
    };

    const getUnbookedItineraries = async (req, res) => {
        const { touristId } = req.params;
    
        try {
            // Fetch the tourist to get their booked itineraries
            const tourist = await Tourist.findById(touristId);
            
            if (!tourist) {
                return res.status(404).json({ message: 'Tourist not found' });
            }
    
            // Get list of itinerary IDs that the tourist has already booked
            const bookedItineraryIds = tourist.bookedItineraries.map(item => item.itineraryId);
    
            // Fetch itineraries excluding the ones already booked by the tourist
            const unbookedItineraries = await Itinerary.find({
                _id: { $nin: bookedItineraryIds },
                flagged: false,   // Optionally exclude flagged itineraries
                availableDates: { $elemMatch: { $gte: new Date() } }, // Only upcoming dates
                deactivated: false // Exclude deactivated itineraries
            });
    
            if (unbookedItineraries.length === 0) {
                return res.status(404).json({ message: 'No unbooked itineraries found' });
            }
    
            res.status(200).json(unbookedItineraries);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    

    // Check if a specific itinerary is booked by a tourist
const isItineraryBooked = async (req, res) => {
    const { touristId, itineraryId } = req.params;
  
    try {
      // Find the tourist by ID
      const tourist = await Tourist.findById(touristId);
  
      if (!tourist) {
        return res.status(404).json({ message: "Tourist not found" });
      }
  
      // Check if the itinerary ID exists in the tourist's bookedItineraries array
      const isBooked = tourist.bookedItineraries.some(
        (booking) => booking.itineraryId.toString() === itineraryId
      );
  
      res.status(200).json({ isBooked });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Check if a specific activity is booked by a tourist
const isActivityBooked = async (req, res) => {
    const { touristId, activityId } = req.params;
  
    try {
        // Find the tourist by ID
        const tourist = await Tourist.findById(touristId);

        if (!tourist) {
            return res.status(404).json({ message: "Tourist not found" });
        }

        // Check if the activity ID exists in the tourist's bookedActivities array
        const isBooked = tourist.bookedActivities.some(
            (bookedActivityId) => bookedActivityId.toString() === activityId
        );

        res.status(200).json({ isBooked });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const searchFlightsByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const flights = await FlightBooking.find({ userId });

        if (!flights.length) {
            return res.status(404).json({ message: "No flights found for this user" });
        }

        res.status(200).json(flights);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const searchHotelsByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const hotels = await HotelBooking.find({ userId });

        if (!hotels.length) {
            return res.status(404).json({ message: "No hotels found for this user" });
        }

        res.status(200).json(hotels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
  
const getActivity = async (req, res) => {
    const { id } = req.params;  // Itinerary ID from the URL params

    try {
        // Find the itinerary by ID and ensure it belongs to the correct tour guide
        const activity = await Activity.findOne({ _id: id});  

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found.' });
        }

        res.status(200).json(activity);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const addToCart = async (req, res) => {
    const { productId, touristId } = req.params; // Extract productId and touristId from request parameters

    try {
        // Step 1: Check if the item already exists in the cart
        const existingCartItem = await Cart.findOne({ productId, touristId });

        if (existingCartItem) {
            return res.status(400).json({ message: 'This product is already in the cart for this tourist.' });
        }

        // Step 2: Fetch the product to get its amount
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        const productAmount = product.quantity; // Assuming the product has a `price` field

        // Step 3: Create a new cart item
        const cartItem = new Cart({
            touristId,
            productId
        });

        // Step 4: Save the cart item
        await cartItem.save();

        // Step 5: Return success response with product amount
        return res.status(201).json({
            message: `Product added to cart successfully. Product amount: ${productAmount}.`,
            cartItem
        });
    } catch (error) {
        console.error('Error adding item to cart:', error); // Log error for debugging
        return res.status(500).json({ message: 'Error adding item to cart.', error });
    }
};



const removeFromCart = async (req, res) => {
    const { productId, touristId } = req.params; // Extract productId and touristId from request parameters

    try {
        // Step 1: Find the cart item matching the touristId and productId
        const cartItem = await Cart.findOneAndDelete({ touristId, productId });

        // Step 2: Check if the cart item exists
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found.' });
        }

        // Step 3: Return success response
        return res.status(200).json({
            message: 'Product removed from cart successfully.',
            cartItem
        });
    } catch (error) {
        console.error('Error removing item from cart:', error); // Log error for debugging
        return res.status(500).json({ message: 'Error removing item from cart.', error });
    }
};

const updateCartItemAmount = async (req, res) => {
    const { cartItemId } = req.params; // Extract cartItemId from request parameters
    const { amount } = req.body; // Extract amount from request body

    try {
        // Validate the amount
        if (!amount || isNaN(amount)) {
            return res.status(400).json({ message: 'Invalid amount. It must be a valid number.' });
        }

        // Step 1: Find the cart item
        const cartItem = await Cart.findById(cartItemId);

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found.' });
        }

        // Step 2: Fetch the related product to check its quantity
        const product = await Product.findById(cartItem.productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // Step 3: Validate the new amount against the product's quantity
        if (amount < 1 || amount > product.quantity) {
            return res.status(400).json({
                message: `Amount must be between 1 and the available product quantity (${product.quantity}).`
            });
        }

        // Step 4: Update the amount
        cartItem.amount = amount;
        await cartItem.save();

        // Step 5: Return success response
        return res.status(200).json({
            message: 'Cart item amount updated successfully.',
            cartItem
        });
    } catch (error) {
        console.error('Error updating cart item amount:', error); // Log the error for debugging
        return res.status(500).json({ message: 'Error updating cart item amount.', error });
    }
};

const addDeliveryAddress = async (req, res) => {
    const { touristId } = req.params; // Extract touristId from request parameters
    const { addresses } = req.body; // Extract addresses array from the request body

    try {
        // Validate the addresses array
        if (!Array.isArray(addresses) || addresses.length === 0) {
            return res.status(400).json({ message: 'Invalid addresses. Please provide an array of non-empty strings.' });
        }

        // Validate each address in the array
        const validAddresses = addresses
            .filter(address => typeof address === 'string' && address.trim() !== '')
            .map(address => address.trim());

        if (validAddresses.length === 0) {
            return res.status(400).json({ message: 'No valid addresses provided.' });
        }

        // Find the tourist by ID
        const tourist = await Tourist.findById(touristId);

        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found.' });
        }

        // Add only unique addresses that are not already in the array
        const uniqueAddresses = validAddresses.filter(address => !tourist.deliveryAddresses.includes(address));

        // Check if there are no new unique addresses to add
        if (uniqueAddresses.length === 0) {
            return res.status(200).json({
                message: 'No new addresses to add. All provided addresses are already stored.',
                deliveryAddresses: tourist.deliveryAddresses
            });
        }

        // Add unique addresses to the deliveryAddresses array
        tourist.deliveryAddresses.push(...uniqueAddresses);

        // Save the updated tourist document
        await tourist.save();

        // Return success response
        return res.status(200).json({
            message: 'Addresses added successfully.',
            addedAddresses: uniqueAddresses,
            deliveryAddresses: tourist.deliveryAddresses
        });
    } catch (error) {
        console.error('Error adding addresses:', error); // Log the error for debugging
        return res.status(500).json({ message: 'Error adding addresses.', error });
    }
};

const chooseAddress = async (req, res) => {
    const { touristId } = req.params; // Extract touristId from request parameters
    const { address } = req.body; // Extract the chosen address from the request body

    try {
        // Validate the address
        if (!address || typeof address !== 'string' || address.trim() === '') {
            return res.status(400).json({ message: 'Invalid address. Please provide a valid address.' });
        }

        // Find the tourist by ID
        const tourist = await Tourist.findById(touristId);

        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found.' });
        }

        // Check if the address exists in the deliveryAddresses array
        if (!tourist.deliveryAddresses.includes(address.trim())) {
            return res.status(400).json({ message: 'Address not found in the deliveryAddresses array.' });
        }

        // Set the chosenAddress field
        tourist.chosenAddress = address.trim();

        // Save the updated tourist document
        await tourist.save();

        // Return success response
        return res.status(200).json({
            message: 'Chosen address updated successfully.',
            chosenAddress: tourist.chosenAddress
        });
    } catch (error) {
        console.error('Error choosing address:', error); // Log the error for debugging
        return res.status(500).json({ message: 'Error choosing address.', error });
    }
};
// const getNotifications = async (req, res) => {
//     try {
//       const tourist = await Tourist.findById(req.user._id)
//         .select('notifications')
//         .populate('notifications.eventId notifications.itineraryId'); // Populate event/itinerary data
  
//       res.status(200).json({ notifications: tourist.notifications });
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching notifications', error });
//     }
//   };

const getNotifications = async (req, res) => {
    try {
      // Extract userId from the route parameter
      const { userId } = req.params;
  
      // Fetch the tourist by ID
      const tourist = await Tourist.findById(userId)
        .select('notifications')
        .populate('notifications.eventId notifications.itineraryId'); // Populate event/itinerary data
  
      if (!tourist) {
        return res.status(404).json({ message: 'Tourist not found' });
      }
  
      // Return the notifications
      res.status(200).json({ notifications: tourist.notifications });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching notifications', error });
    }
  };
  
  //// payments
  // Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "winggo567@gmail.com",
      pass: "smkg eghm yrzv yyir"
    }
  });
  
  const payForProducts = async (req, res) => {
    const { touristId, productId } = req.params;
  
    try {
      // Fetch the tourist and product
      const tourist = await Tourist.findById(touristId);
      const product = await Product.findById(productId).populate('seller');
  
      if (!tourist) {
        return res.status(404).json({ message: 'Tourist not found' });
      }
      if (!product) {
        return res.status(404).json({ message: 'product not found' });
      }
  
      // Check if tourist has enough balance
      if (tourist.wallet < product.price) {
        return res.status(400).json({ message: 'Insufficient wallet balance' });
      }
  
      // Deduct product price from tourist wallet
      tourist.wallet -= product.price;
  
      // Reduce product quantity
      product.quantity -= 1;
  
      // Check if product is out of stock
      if (product.quantity === 0) {
        const seller = product.seller;
  
        // Notify the seller in-app
        await Seller.findByIdAndUpdate(seller._id, {
          $push: {
            notifications: {
              type: 'stock-alert',
              message: `Your product '${product.name}' is now out of stock.`,
              date: new Date()
            }
          }
        });
  
        // Send email notification
        await transporter.sendMail({
          from: "winggo567@gmail.com",
          to: seller.email,
          subject: 'Out of Stock Alert',
          html: `<p>Your product <strong>${product.name}</strong> is now out of stock.</p>`
        });
      }
  
      // Save updated tourist and product
      await tourist.save();
      await product.save();
  
      res.status(200).json({ message: 'Payment successful', wallet: tourist.wallet });
    } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({ message: 'Error processing payment', error });
    }
  };


  const payForOrder = async (req, res) => {
    const { orderId } = req.params;
  
    try {
      // Fetch the order
      const order = await Order.findById(orderId).populate('products.productId buyer');
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Check if the order is already paid
      if (order.paymentStatus === 'paid') {
        return res.status(400).json({ message: 'Order has already been paid for' });
      }
  
      const buyer = order.buyer;
  
      // Check if buyer has sufficient wallet balance
      if (buyer.wallet < order.totalPrice) {
        return res.status(400).json({ message: 'Insufficient wallet balance' });
      }
  
      // Deduct the total price from buyer's wallet
      buyer.wallet -= order.totalPrice;
  
      // Process each product in the order
      const notifications = []; // To collect notifications for sellers
      for (const item of order.products) {
        const product = await Product.findById(item.productId).populate('seller');
  
        if (!product) {
          return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
        }
  
        // Check if enough quantity is available
        if (product.quantity < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for product: ${product.name}`,
          });
        }
  
        // Deduct quantity
        product.quantity -= item.quantity;
  
        // Check if the product is out of stock
        if (product.quantity === 0) {
          const seller = product.seller;
  
          // Notify the seller in-app
          notifications.push({
            sellerId: seller._id,
            notification: {
              type: 'stock-alert',
              message: `Your product '${product.name}' is now out of stock.`,
              date: new Date(),
            },
          });
  
          // Send email notification to the seller
          await transporter.sendMail({
            from: "winggo567@gmail.com",
            to: seller.email,
            subject: 'Out of Stock Alert',
            html: `<p>Your product <strong>${product.name}</strong> is now out of stock.</p>`,
          });
        }
  
        // Save updated product
        await product.save();
      }
  
      // Update buyer's wallet and save
      await buyer.save();
  
      // Mark order as paid
      order.paymentStatus = 'paid';
      await order.save();
  
      // Push notifications to sellers
      for (const { sellerId, notification } of notifications) {
        await Seller.findByIdAndUpdate(sellerId, { $push: { notifications: notification } });
      }
  
      res.status(200).json({ message: 'Order payment successful', wallet: buyer.wallet });
    } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({ message: 'Error processing payment', error });
    }
  };
    const getItemsInCart = async (req, res) => {
    const { touristId } = req.params; // Extract touristId from request parameters

    try {
        // Find all cart items for the given touristId
        const cartItems = await Cart.find({ touristId }).populate('productId');

        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json({ message: 'No items found in the cart for this tourist.' });
        }

        // Map the cart items to include product details
        const itemsWithDetails = cartItems.map(item => ({
            cartItemId: item._id,
            product: {
                id: item.productId._id,
                name: item.productId.name, // Assuming the Product model has a 'name' field
                price: item.productId.price, // Assuming the Product model has a 'price' field
                quantity: item.productId.quantity // Assuming the Product model has a 'quantity' field
            },
            amount: item.amount // Assuming Cart has an 'amount' field
        }));

        // Return the items in the cart
        return res.status(200).json({
            message: 'Cart items retrieved successfully.',
            items: itemsWithDetails
        });
    } catch (error) {
        console.error('Error retrieving cart items:', error); // Log the error for debugging
        return res.status(500).json({ message: 'Error retrieving cart items.', error });
    }
};






//add item to wishlist
const addWishlist = async (req, res) => {
    const { touristId ,productId} = req.params;
    

    try {
        // Find the tourist by ID
        const tourist = await Tourist.findById(touristId);

        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        // Check if the product is already in the wishlist
        const existingWishlistItem = await Wishlist.findOne({ touristId, productId });
        if (existingWishlistItem) {
            return res.status(400).json({ message: 'Product is already in the wishlist' });
        }


        // Add to wishlist
        const wishlistItem = new Wishlist({ touristId, productId });
        await wishlistItem.save();

    // Populate product details in the wishlist item
        const populatedWishlistItem = await Wishlist.findById(wishlistItem._id).populate('productId');
        res.status(200).json({
            message: 'Product added to wishlist successfully',
            wishlistItem: populatedWishlistItem,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// View wishlist
const viewWishlist = async (req, res) => {
    const { touristId } = req.params;

    try {
        // Find the tourist by ID
        const tourist = await Tourist.findById(touristId);

        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }

        // Find all the wishlist items for the tourist and populate the product details
        const wishlistItems = await Wishlist.find({ touristId })
            .populate('productId') // Populate the productId with product details
            .exec();

        if (wishlistItems.length === 0) {
            return res.status(404).json({ message: 'No products in wishlist' });
        }

        res.status(200).json({ message: 'Wishlist fetched successfully', wishlistItems });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove an item from the wishlist
const removeWishlistItem = async (req, res) => {
    const { touristId, productId } = req.params;

    try {
        // Check if the tourist exists
        const tourist = await Tourist.findById(touristId);
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }

        // Find and remove the wishlist item
        const removedItem = await Wishlist.findOneAndDelete({ touristId, productId });

        if (!removedItem) {
            return res.status(404).json({ message: 'Product not found in the wishlist' });
        }

        res.status(200).json({ message: 'Product removed from wishlist successfully', removedItem });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
    removePreferencesFromTourist,
    viewComplaints,
    changePassword,
    bookItinerary,
    cancelItinerary,
    redeemPoints,
    bookActivity,
    cancelActivity,
    purchaseProduct,
    searchFlightsByUserId,
    searchHotelsByUserId,
    rateProduct,
    reviewProduct,
    rateActivity,
    commentOnActivity,
    deleteTouristIfEligible,
    searchFlights,
    bookFlight,
    getCompletedItineraries,
    rateItinerary,
    commentOnItinerary,
    rateTourGuide,
    commentOnTourGuide,
    // shareViaLink,
    convertCurrency,
    updateProductPricesToCurrency,
    searchHotelsByCity,
    searchHotelsByGeoLocation,
    getHotelOffersByCity,
    getHotelOffersByLocation,
    bookHotel,
    bookTransport,
    getFlightPrices,
    getTouristById,
    getBookedItineraries,
    getBookedActivities,
    getTouristUsername,
    getPurchasedProducts,
    getUnbookedItineraries,
    isItineraryBooked,
    isActivityBooked,
    shareActivityViaEmail,
    shareItineraryViaEmail,
    sharePlaceViaEmail,
    shareProductViaEmail,
    getActivity,
    addWishlist,
    viewWishlist,
    removeWishlistItem,
    getNotifications,
    payForProducts,
    payForOrder,
    addToCart,
    removeFromCart,
    updateCartItemAmount,
    addDeliveryAddress,
    chooseAddress,
    getItemsInCart
};
