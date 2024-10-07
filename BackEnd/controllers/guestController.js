// const Product = require('../models/product');
const path = require('path');
const Activity= require('../models/Activity');
const Itinerary = require ('../models/Itinerary');
const Place = require('../models/Places');

const guest_hello = (req, res) => {
    console.log('guest route hit!'); // Add this log
    res.send('<h1>yayy Guest</h1>');
};




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
//sort all upcoming activities/itinieraries based on price/rating
const sortUpcomingActivityOrItenraries= async(req,res)=>{
    const {sort, type}=req.query;
    let sortCriteria;
    if(sort=='price'){
        sortCriteria={price:1};
    }
    else if (sort=='ratings'){
        sortCriteria={ratings:1};
    }
    else {
        return res.stats(400).json({message:'Invalid sort criteria'});
    }
    try{
        if(type=='activity'){
            const Activities=await Activity.find({date:{$gte:new Date()}}).sort(sort);
            return res.status(200).json(Activities);
        }
        else if(type=='itinerary'){
            const itineraries= await Itinerary.find({date:{$gte:new Date()}}).sort(sort);
            return res.status(200).json(itineraries);
        } else{
            return res.status(500).json({error:error.message});
        }
} catch(error){
    res.status(500).json({error:error.message});
}
};


const getAllUpcomingActivities = async (req, res) => {
    try {
        // Get current date to filter upcoming activities and itineraries
        const currentDate = new Date();

        // Fetch all upcoming activities
        const activities = await Activity.find({ date: { $gte: currentDate } });
        res.status(200).json({
            activities
        });
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
    console.log('in activities filter');
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
        if (activities.length === 0) {
            return res.status(404).json({ message: 'No activities found with the specified filters' });
        }
        res.status(200).json(activities); // Return filtered activities
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }
};
  // Assuming Itinerary is the same for guests






const filterItineraries = async (req, res) => {
    // Malak Filter
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
    guest_hello,
    filterPlacesByTag,
    sortUpcomingActivityOrItenraries,
    getAllUpcomingActivities,
    getAllUpcomingIteneries,
    getAllUpcomingPlaces,
    filterUpcomingActivities,
    filterItineraries
};
