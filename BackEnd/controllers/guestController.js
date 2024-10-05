// const Product = require('../models/product');
const path = require('path');

const guest_hello = (req, res) => {
    console.log('guest route hit!'); // Add this log
    res.send('<h1>yayy Guest</h1>');
};



const Place = require('../models/Places');

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



module.exports = {
    guest_hello,
    filterPlacesByTag,
    sortUpcomingActivityOrItenraries
};
