const bcrypt = require('bcrypt');
const Advertiser = require('../models/advertiser');
const LoginCredentials = require('../models/LoginCredentials');
// const Attraction = require('../models/attraction');

const advertiser_hello = (req, res) => {
    console.log('Advertiser route hit!'); // Add this log
    res.send('<h1>yayy Advertiser</h1>');
};

const createAdvertiserProfile = async (req, res) => {
    const { id } = req.params; // ID of the advertiser after approval
    const { companyName, website, hotline, companyProfile, contactEmail, contactPerson, logoUrl, socialMediaLinks } = req.body;

    try {
        // Check if the profile already exists
        const existingProfile = await Advertiser.findOne({ _id: id });
        if (existingProfile) {
            return res.status(400).json({ message: 'Profile already exists. Please update instead.' });
        }

        // Create a new advertiser profile
        const newProfile = new Advertiser({
            _id: id, // Use the same ID as the advertiser
            companyName,
            website,
            hotline,
            companyProfile,
            contactEmail,
            contactPerson,
            logoUrl,
            socialMediaLinks
        });

        await newProfile.save();
        res.status(201).json({ message: 'Advertiser profile created successfully!', profile: newProfile });
    } catch (error) {
        res.status(400).json({ error: error.message });
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


module.exports = {
    advertiser_hello,
    createAdvertiserProfile,
    updateAdvertiserProfile,
    getAdvertiserProfile
};