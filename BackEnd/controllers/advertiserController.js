const bcrypt = require('bcrypt');
const Advertiser = require('../models/advertiser');
const LoginCredentials = require('../models/LoginCredentials');
const Activity = require('../models/Activity');
const getCoordinates = require('../helpers/getCoordinates');
const Transport = require('../models/Transport');
const { uploadDocument } = require('../helpers/s3Helper');
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

        // Update LoginCredentials if necessary
        if (Object.keys(loginUpdateFields).length > 0) {
            const updatedLoginCredentials = await LoginCredentials.findOneAndUpdate(
                { userId: id, roleModel: 'Advertiser' },  // Find by userId and roleModel for the advertiser
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

    const {name, date, time, location, price, category, tags, specialDiscounts, isBookingOpen, advertiser} = req.body

    // const {lat, lng} = await getCoordinates(location.address);

    // location.lat = lat;
    // location.lng = lng;

    try{
        const newActivity = new Activity({
            name,
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
        const {id} = req.params; // Use id as the unique identifier
        const {advertiserId }= req.query;
        console.log(id);
        console.log(advertiserId);
         
        // Find the activity by id
        const activity = await Activity.findOne({ _id: id, advertiser: advertiserId });

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


const changeLogo = async (req, res) => {
    const { id } = req.params;
    

    try {
        const advertiser = await Advertiser.findById(id);

        if (!advertiser) {
            return res.status(404).json({ message: 'Advertiser not found' });
        }
        
        const logoUrl = req.file.location;
        advertiser.logoUrl = logoUrl;
        await advertiser.save();

        res.status(200).json({ message: 'Logo updated successfully', advertiser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const acceptTerms = async (req, res) => {
    const advertiserId = req.params.id;

    try {
        const advertiser = await Advertiser.findByIdAndUpdate(advertiserId, { termsAccepted: true }, { new: true });
        if (!advertiser) {
            return res.status(404).json({ message: 'Advertiser not found.' });
        }
        res.status(200).json({ message: 'Terms accepted successfully.', advertiser });
    } catch (error) {
        res.status(500).json({ message: 'Error accepting terms.', error });
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
        const advertiser = await Advertiser.findById(userCredentials.userId);
        if (!advertiser) {
            return res.status(404).json({ message: 'advertiser not found' });
        }

        console.log('Old Password (entered):', oldPassword);
        const hashedoldPassword = await bcrypt.hash(oldPassword, 10); // Hash new password
        console.log('Old Password (hashed):', hashedoldPassword);
        console.log('Stored Hashed Password:', advertiser.password);

        // 3. Compare the old password with the hashed password in TourGuide
        const isMatch = await bcrypt.compare(oldPassword, advertiser.password);
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
        advertiser.password = hashedNewPassword;
        await advertiser.save();

        res.status(200).json({ message: 'Password updated successfully in both collections' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
c=1;
const requestAccountDeletion = async (req, res) => {
    try {
        const { id } = req.params;  // Advertiser ID

        // Find all activities related to this advertiser
        const activities = await Activity.find({ advertiser: id });

        // Check for any upcoming activities with bookings
        const hasUpcomingActivitiesWithBookings = activities.some(activity => {
            const today = new Date();
            console.log(c+" "+activity.date >= today);
           console.log(c+" "+ activity.touristIDs && activity.touristIDs.length > 0);
           c++;
            return activity.date >= today && activity.touristIDs && activity.touristIDs.length > 0;
        });

        

        if (hasUpcomingActivitiesWithBookings) {
            return res.status(400).json({
                message: "Cannot delete account: there are upcoming activities with bookings."
            });
        }

        // Delete all activities associated with the advertiser
        await Activity.deleteMany({ advertiser: id });

        // Delete the advertiser profile and related login credentials
        const advertiser = await Advertiser.findByIdAndDelete(id);
        await LoginCredentials.findOneAndDelete({ userId: id, roleModel: 'Advertiser' });

        if (!advertiser) {
            return res.status(404).json({ message: "Advertiser account not found." });
        }

        res.status(200).json({ message: "Account and all associated data deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createTransport = async (req, res) => {
    const { type, duration, price } = req.body;

    try {
        const newTransport = new Transport({ type, duration, price, touristID: null });
        await newTransport.save();
        res.status(201).json(newTransport);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllTransports = async (req, res) => {
    try {
        const transports = await Transport.find();
        res.status(200).json(transports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTransportById = async (req, res) => {
    const { id } = req.params;

    try {
        const transport = await Transport.findById(id);
        if (!transport) {
            return res.status(404).json({ message: 'Transport not found' });
        }
        res.status(200).json(transport);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Read All Unbooked Transports
const getAllUnbookedTransports = async (req, res) => {
    try {
        const transports = await Transport.find({ touristID: null });
        res.status(200).json(transports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Read Unbooked Transport by ID
const getUnbookedTransportById = async (req, res) => {
    const { id } = req.params;

    try {
        const transport = await Transport.findOne({ _id: id, touristID: null });
        if (!transport) {
            return res.status(404).json({ message: 'Transport not found or already booked' });
        }
        res.status(200).json(transport);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTransport = async (req, res) => {
    const { id } = req.params;
    const { type, duration, price, touristID } = req.body;

    try {
        const updatedTransport = await Transport.findByIdAndUpdate(
            id,
            { type, duration, price, touristID },
            { new: true }
        );
        if (!updatedTransport) {
            return res.status(404).json({ message: 'Transport not found' });
        }
        res.status(200).json(updatedTransport);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteTransport = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTransport = await Transport.findByIdAndDelete(id);
        if (!deletedTransport) {
            return res.status(404).json({ message: 'Transport not found' });
        }
        res.status(200).json({ message: 'Transport deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
    deleteActivity,
    changeLogo,
    acceptTerms,
    changePassword,
    requestAccountDeletion,
    createTransport,
    getAllTransports,
    getTransportById,
    updateTransport,
    deleteTransport,
    getAllUnbookedTransports,
    getUnbookedTransportById
};