const bcrypt = require('bcrypt');
const Seller = require('../models/Seller');
const LoginCredentials = require('../models/LoginCredentials'); 
const Product = require('../models/product');
const { default: mongoose } = require('mongoose');

const updateSellerProfile = async (req, res) => {
    console.log(req.body);
    try {
        const id = req.params.id; // Use id as the unique identifier
        const sellerExist = await Seller.findById(id);
        

        if (!sellerExist) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        // Create a copy of the request body
        const updateData = { ...req.body };

        // If the password is being updated, hash it before saving
        if (req.body.password) {
            updateData.password = await bcrypt.hash(req.body.password, 10);
        }

        // Update the seller's profile with the hashed password and other updated fields
        const updatedSeller = await Seller.findByIdAndUpdate(id, updateData, {
            new: true,  // Return the updated document
        });
        const loginUpdateFields = {};
        if (req.body.username) {
            loginUpdateFields.username = req.body.username;
        }
        if (req.body.password) {
            loginUpdateFields.password =  updateData.password;  // Use the hashed password
        }

        if (Object.keys(loginUpdateFields).length > 0) {
            // Find login credentials by tour guide id (assuming id is stored in both TourGuide and LoginCredentials models)
            const updatedLoginCredentials = await LoginCredentials.findByIdAndUpdate(
                id, // Match by id
                { $set: loginUpdateFields },
                { new: true }  // Return the updated document
            );

            if (!updatedLoginCredentials) {
                return res.status(404).json({ message: 'Login credentials not found' });
            }
        }

        res.status(200).json({message:'Profile and login credentials updated successfully',updatedSeller});

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getSeller = async(req,res) => {
    try{
        console.log('in seller');
        const id = req.params.id; // Use id as the unique identifier
        const sellerExist = await Seller.findById(id);
        if (!sellerExist) {
            return res.status(404).json({ message: 'Seller not found' });
        }
       res.status(200).json(sellerExist)
    }catch(error){
       res.status(400).json({error:error.message})
    }
 }

 const sortProductsByRatings = async (req, res) => {
    try {
        const products = await Product.find().sort({ ratings: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

 const createSellerProfile = async (req, res) => {
    return updateSellerProfile(req, res);
};
 module.exports = {
    updateSellerProfile,
    createSellerProfile,
    updateSellerProfile,
    getSeller,
    addProduct,
    editProduct,
    sortProductsByRatings,
    getAllProducts
    
};