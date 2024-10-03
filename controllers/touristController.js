const bcrypt = require('bcrypt');
const Tourist = require('../models/tourist');
const Attraction = require('../models/attraction');
const Activity= require('../models/Activity');
const Itinerary = require ('../models/Itinerary');
const Product = require('../models/product');


const tourist_hello = (req, res) => {
    res.send('<h1>yayy</h1>');
    console.log('yay');
};

//sort all upcoming activities/itineraries by price/ratings

const tourist_register = async (req, res) => {
    // Destructure fields from the request body
    const { username, email, password, mobileNumber, nationality, DOB, jobOrStudent  } = req.body;
    
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
        const user = await Tourist.create({
            username,
            email,
            password: hashedPassword, // Save the hashed password
            mobileNumber,
            nationality,
            DOB,
            jobOrStudent 
        });

        const user2 = await LoginCredentials.create({
            username,
            password: hashedPassword,
            role: 'tourist'
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

module.exports = {
    tourist_hello,
    tourist_register,
    searchTouristAttractions,
    getTourist,
    updateTouristProfile,
    sortProductsByRatings,
    getAllProducts,
    filterProduct,
    searchProductsByName

};
