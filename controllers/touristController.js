const bcrypt = require('bcrypt');
const Tourist = require('../models/tourist');
const Attraction = require('../models/attraction');

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

const searchTouristAttractions = async (req, res) => { // to be tested later after crud -Omar Nasr
    const { query } = req.query; 

    try {
        const results = await Attraction.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } }
            ]
        });

        res.status(200).json(results);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log('Error during search:', error.message);
    }
};

const getTouristAttractions = async (req, res) => {
    try {
        const results = await Attraction.find({});

        res.status(200).json(results);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log('Error during search:', error.message);
    }
};

module.exports = {
    tourist_hello,
    tourist_register,
    searchTouristAttractions
};
