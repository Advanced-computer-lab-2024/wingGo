const bcrypt = require('bcrypt');
const Tourist = require('../models/tourist');
const Attraction = require('../models/attraction');
const Activity= require('../models/Activity');
const Itinerary = require ('../models/Itinerary');
const Product = require('../models/product');
const LoginCredentials = require('../models/LoginCredentials');
const Place = require('../models/Places');



const tourist_hello = (req, res) => {
    res.send('<h1>yayy</h1>');
    console.log('yay');
};

//sort all upcoming activities/itineraries by price/ratings
const tourist_register = async (req, res) => {
    // Destructure fields from the request body
    const { username, email, password, mobileNumber, nationality, DOB, jobOrStudent } = req.body;
    
    // Check for existing user
    const existingEmail = await Tourist.findOne({ email });
    const existingUsername = await Tourist.findOne({ username });
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
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log('Error during registration:', error.message);
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

        // Update login credentials if necessary
        const loginUpdateFields = {};
        if (req.body.password) {
            loginUpdateFields.password = updateData.password;  // Use the hashed password
        }

        if (Object.keys(loginUpdateFields).length > 0) {
            const updatedLoginCredentials = await LoginCredentials.findByIdAndUpdate(
                id, // Match by id
                { $set: loginUpdateFields },
                { new: true }  // Return the updated document
            );

            if (!updatedLoginCredentials) {
                return res.status(404).json({ message: 'Login credentials not found' });
            }
        }

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
        const products = await Product.find().sort({ ratings: -1 });
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

        // Ensure the price is provided
        if (price) {
            // Find products with the exact price
            const result = await Product.find({ price: price });

            // If no products are found, return a 404 response
            if (result.length === 0) {
                return res.status(404).json({ message: 'No products found with the specified price' });
            }

            res.status(200).json(result);
        } else {
            res.status(400).json({ message: 'Price query parameter is required' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




// const Place = require('../models/Places');

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

const searchProductsByName = async (req, res) => {
    try {
        const query = req.query.name;  
        if (!query) {
            return res.status(400).json({ message: "Please provide a product name to search." });
        }

        // Perform a case-insensitive search for products with names that match the search query
        const products = await Product.find({ name: { $regex: query, $options: 'i' } });

        if (products.length === 0) {
            return res.status(404).json({ message: "No products found matching your search." });
        }

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};





//sort all upcoming activities/itinieraries based on price/rating
const sortUpcomingActivityOrItineraries = async (req, res) => {
    const { sort, type } = req.query;
    let sortCriteria;

    if (sort === 'price') {
        sortCriteria = { price: 1 }; // Ascending order by price
    } else if (sort === 'ratings') {
        sortCriteria = { ratings: -1 }; // Descending order by ratings
    } else {
        return res.status(400).json({ message: 'Invalid sort criteria. Use "price" or "ratings".' });
    }

    try {
        if (type === 'activity') {
            const activities = await Activity.find({ date: { $gte: new Date() } }).sort(sortCriteria);
            return res.status(200).json(activities);
        } else if (type === 'itinerary') {
            const itineraries = await Itinerary.find({ date: { $gte: new Date() } }).sort(sortCriteria);
            return res.status(200).json(itineraries);
        } else {
            return res.status(400).json({ message: 'Invalid type. Use "activity" or "itinerary".' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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

const getAllUpcomingActivities = async (req, res) => {
    try {
        // Get current date to filter upcoming activities and itineraries
        const currentDate = new Date();

        // Fetch all upcoming activities
        const activities = await Activity.find({ date: { $gte: currentDate } });
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


const getAllUpcomingPlaces = async (req, res) => {
    try {
        // Get the current day and time
        const currentTime = new Date();

        // Fetch all places
        const places = await Place.find();

        // Filter places by opening hours (you can adjust this logic based on your openingHours format)
        const upcomingPlaces = places.filter(place => {
            const [openingTime, closingTime] = place.openingHours.split(" - "); // Assuming format is "9:00 AM - 7:00 PM"
            const openTime = new Date(currentTime.toDateString() + ' ' + openingTime); // Today’s opening time
            const closeTime = new Date(currentTime.toDateString() + ' ' + closingTime); // Today’s closing time

            // Check if the place is currently open or will open later today
            return currentTime >= openTime && currentTime <= closeTime;
        });

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
    let filter = { date: { $gte: new Date() } }; // Default filter: only upcoming activities (date >= today)

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
        ]
    };

    try {
        const attractions = await Attraction.find(searchCriteria);
        const activities = await Activity.find(searchCriteria);
        
        let itinerarySearchCriteria = {
            $or: [
                { title: { $regex: query, $options: 'i' } },  // Search by itinerary title
                { tags: { $regex: query, $options: 'i' } }  // Search by tags
            ]
        };
        const itineraries = await Itinerary.find(itinerarySearchCriteria);
        
        let placeSearchCriteria = {
            $or: [
                { name: { $regex: query, $options: 'i' } },  // Search by place name
                { 'tags.types': { $regex: query, $options: 'i' } },  // Search by place types
                { 'tags.historicalPeriods': { $regex: query, $options: 'i' } }  // Search by historical periods
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
    const { budget, date, preferences, language } = req.query;

    let filter = {}; // Initialize an empty filter object

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

        if (itineraries.length === 0) {
            return res.status(404).json({ message: 'No itineraries found matching the criteria.' });
        }

        res.status(200).json(itineraries);
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
    filterItineraries
};
