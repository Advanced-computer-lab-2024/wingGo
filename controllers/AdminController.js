const bcrypt = require('bcrypt');
const PendingUser = require('../models/PendingUsers');
const TourGuide = require('../models/TourGuide');
const LoginCredentials = require('../models/LoginCredentials');
const Tourist = require('../models/tourist');

// Controller function to delete an account
const deleteAccount = async (req, res) => {
    const { username } = req.params; // Use username as a unique identifier

    try {
        // Find the account in loginCredentials
        const account = await LoginCredentials.findOne({ username });

        if (!account) {
            return res.status(404).json({ message: 'Account not found in login credentials' });
        }

        // Check the role of the account
        const { role } = account;

        // Delete from TourGuide collection if role is 'tour guide'
        if (role === 'tour guide') {
            const tourGuide = await TourGuide.findOneAndDelete({ username });

            if (!tourGuide) {
                return res.status(404).json({ message: 'Tour guide not found' });
            }
        }

        // Delete from Tourist collection if role is 'tourist'
        else if (role === 'tourist') {
            const tourist = await Tourist.findOneAndDelete({ username });

            if (!tourist) {
                return res.status(404).json({ message: 'Tourist not found' });
            }
        } else {
            return res.status(400).json({ message: 'Invalid role. Cannot delete account' });
        }

        // Delete the login credentials
        await LoginCredentials.findOneAndDelete({ username });

        res.status(200).json({ message: `Account with username '${username}' has been deleted successfully.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Controller function to approve a pending user by username or email
const approvePendingUserByField = async (req, res) => {
    const { username, email } = req.body;

    try {
        // Find the pending user by either email or username
        const pendingUser = await PendingUser.findOne({ 
            $or: [
                { email: email }, 
                { username: username }
            ]
        });

        if (!pendingUser) {
            return res.status(404).json({ message: 'Pending user not found' });
        }

        // Check if a tour guide with this email or username already exists
        const existingTourGuide = await TourGuide.findOne({ 
            $or: [
                { email: pendingUser.email }, 
                { username: pendingUser.username }
            ]
        });

        if (existingTourGuide) {
            return res.status(400).json({ message: 'Tour guide with this email or username already exists' });
        }

        // Check if the user's role is 'tour guide'
        if (pendingUser.role === 'tour guide') {
            // Hash the password using bcrypt
            const hashedPassword = await bcrypt.hash(pendingUser.password, 10);  // 10 is the salt rounds

            // Create a new tour guide profile after admin approval
            const tourGuide = new TourGuide({
                email: pendingUser.email,
                username: pendingUser.username,
                password: hashedPassword, // Save the hashed password
                mobileNumber: '', // Initially empty
                yearsOfExperience: 0, // Initially zero
                previousWork: '' // Initially empty
            });

            // Save the tour guide profile
            await tourGuide.save();

            // Add login credentials to the loginCredentials collection
            const loginCredentials = new LoginCredentials({
                username: pendingUser.username,
                password: hashedPassword, // Save the hashed password
                role: pendingUser.role
            });

            // Save the login credentials
            await loginCredentials.save();

            // Remove the pending user from the PendingUser collection
            await PendingUser.deleteOne({ _id: pendingUser._id });

            res.status(200).json({ message: 'User approved, added to tour guide collection, and login credentials saved', tourGuide });
        } else {
            res.status(400).json({ message: 'User role is not tour guide. Cannot approve for this role.' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    approvePendingUserByField,
    deleteAccount
};
