const bcrypt = require('bcrypt');
const PendingUser = require('../models/PendingUsers');
const LoginCredentials = require('../models/LoginCredentials');

// Method to filter by username for TESTING DONT IMPLEMENT API
const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.query;

        // Check if username is provided
        if (!username) {
            return res.status(400).json({ message: 'Username query parameter is required.' });
        }

        // Search for the user in LoginCredentials by username
        const user = await PendingUser.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const pendinguser_register = async (req, res) => {
    console.log("in register");
    // Destructure fields from the request body
    const { email, username, password, role } = req.body;
    
    try {
        // Hash the password using bcrypt before saving it
        const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

        // Create the new pending user with the hashed password
        const user = await PendingUser.create({
            email,
            username,
            password: hashedPassword, // Save the hashed password
            role
        });

        console.log('success');
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log('noo', error.message);
    }
};

module.exports = {
    pendinguser_register,
    getUserByUsername
};
