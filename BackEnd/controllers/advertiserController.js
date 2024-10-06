const bcrypt = require('bcrypt');
const Advertiser = require('../models/advertiser');
const LoginCredentials = require('../models/LoginCredentials');
const Activity = require('../models/Activity');
const getCoordinates = require('../helpers/getCoordinates');
// const Attraction = require('../models/attraction');

const advertiser_hello = (req, res) => {
    console.log('Advertiser route hit!'); // Add this log
    res.send('<h1>yayy Advertiser</h1>');
};

const createAdvertiserProfile = async (req, res) => {
   
    const id = req.params.id; // Use id as the unique identifier

      
     const advertiser = await Advertiser.findById(id);
     
    if (advertiser.isCreatedProfile !== 0) {
        return res.status(400).json({ message: 'Profile already created for this advertiser.' });
    }
    else{
     advertiser.isCreatedProfile = 1;
     await advertiser.save();
     return updateAdvertiserProfile(req, res);
    
    //  return res.status(201).json({ message: 'Profile created successfully.' });
    }
};

// Update advertiser profile
const updateAdvertiserProfile = async (req, res) => {
    try {
        const id = req.params.id; // Use id as the unique identifier

        // Find the advertiser by id
        const advertiser = await Advertiser.findById(id);

        if (!advertiser) {
            return res.status(404).json({ message: 'Advertiser not found' });
        }

        // Save the original username and email before updating
        const originalEmail = advertiser.contactEmail;
        const originalUsername = advertiser.contactPerson;  // Assuming contact person acts as the username

        // Check if the password is being updated
        if (req.body.password) {
            // Hash the new password before saving it
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        // Now update the login credentials as well
        const loginUpdateFields = {};
        if (req.body.username) {
            loginUpdateFields.username = req.body.username;  // Username update
        }
        if (req.body.password) {
            loginUpdateFields.password = req.body.password;  // Use the hashed password
        }

        // Update LoginCredentials if necessary
        if (Object.keys(loginUpdateFields).length > 0) {
            const updatedLoginCredentials = await LoginCredentials.findByIdAndUpdate(
                id, // Match by id (assumed to be shared between Advertiser and LoginCredentials)
                { $set: loginUpdateFields },
                { new: true }  // Return the updated document
            );

            if (!updatedLoginCredentials) {
                return res.status(404).json({ message: 'Login credentials not found' });
            }
        }

        // Update the advertiser profile with the new data
        Object.assign(advertiser, req.body);
        await advertiser.save();

        res.status(200).json({ message: 'Profile and login credentials updated successfully', advertiser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




// Read advertiser profile without sensitive data
const getAdvertiserProfile = async (req, res) => {
    const { id } = req.params;

    try {
        // Exclude the password field
        const profile = await Advertiser.findById(id).select('-password');
        if (!profile) {
            return res.status(404).json({ message: 'Advertiser profile not found' });
        }

        // Return the non-sensitive profile information
        res.status(200).json({
            companyName: profile.companyName,
            website: profile.website,
            hotline: profile.hotline,
            companyProfile: profile.companyProfile,
            contactEmail: profile.contactEmail,
            contactPerson: profile.contactPerson,
            logoUrl: profile.logoUrl,
            socialMediaLinks: profile.socialMediaLinks
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const createActivity = async (req, res) => {

    const {date, time, location, price, category, tags, specialDiscounts, isBookingOpen, advertiser} = req.body

    const {lat, lng} = await getCoordinates(location.address);

    location.lat = lat;
    location.lng = lng;

    try{
        const newActivity = new Activity({
            date,
            time,
            location,
            price,
            category,
            tags,
            specialDiscounts,
            isBookingOpen,
            advertiser
        });

        await newActivity.save();
        res.status(201).json({message: 'Activity created successfully!', activity: newActivity});

    }
    catch(error){
        res.status(400).json({error: error.message});
    }

}

const updateActivity = async (req, res) => {
    try {
        const {activityID} = req.params.id; // Use id as the unique identifier
        const {advertiserID }= req.query;
         
        // Find the activity by id
        const activity = await Activity.findOne({ _id: activityID, advertiser: advertiserID });

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        if (req.body.advertiser) {
            delete req.body.advertiser;
        }

        if (req.body.location && req.body.location.address) {
            // Parse the location address (assuming you have a function to do this)
            const {lat,lng} = await getCoordinates(req.body.location.address);
            req.body.location = {
                type: 'Point',
                lat: lat,
                lng: lng,
                address: req.body.location.address
            };
        }



        // Update the activity with the new data
        Object.assign(activity, req.body);
        await activity.save();

        res.status(200).json({ message: 'Activity updated successfully', activity });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getActivity = async (req, res) => {
    const { id } = req.params;
    const {advertiserId} = req.query;
    
    
    try {
        const activity = await Activity.findOne({ _id: id, advertiser: advertiserId });
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        res.status(200).json({ activity });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllActivities = async(req,res) => {

    const { advertiserId } = req.query;
    

    const activities = await Activity.find({advertiser: advertiserId}).sort({date: 'desc'});
    res.status(200).json({activities});

};

const deleteActivity = async (req, res) => {
    const { id } = req.params;
    const {advertiserId} = req.query;

    try {
        const activity = await Activity.findOneAndDelete({ _id: id, advertiser: advertiserId });
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        res.status(200).json({ message: 'Activity deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    advertiser_hello,
    createAdvertiserProfile, //done
    updateAdvertiserProfile, 
    getAdvertiserProfile, //done
    createActivity,
    updateActivity,
    getActivity,
    getAllActivities,
    deleteActivity
};