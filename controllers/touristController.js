const bcrypt = require('bcrypt');
const Tourist = require('../models/tourist');

const tourist_hello = (req, res) => {
    res.send('<h1>yayy</h1>');
    console.log('yay');
};

const tourist_register = async (req, res) => {
    // Destructure fields from the request body
    const { username, email, password, mobileNumber, nationality, DOB, type } = req.body;
    
    try {
        // Hash the password using bcrypt before saving it
        const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

        // Create the new tourist with the hashed password
        const user = await Tourist.create({
            username,
            email,
            password: hashedPassword, // Save the hashed password
            mobileNumber,
            nationality,
            DOB,
            type
        });

        console.log('Success! Tourist registered.');
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log('Error during registration:', error.message);
    }
};

module.exports = {
    tourist_hello,
    tourist_register
};
