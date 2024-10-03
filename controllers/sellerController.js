const bcrypt = require('bcrypt');
const Seller = require('../models/Seller');
const LoginCredentials = require('../models/LoginCredentials'); 
const Product = require('../models/product');

const updateSellerProfile = async (req, res) => {
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
// Function to add a product
const addProduct = async (req, res) => {
    const { name, price, quantity, description,sellerId} = req.body;
    // const sellerId = req.sellerId;  // Assuming sellerId comes from authentication middleware

    try {
        // Check if the seller exists
        const sellerExist = await Seller.findById(sellerId);
        if (!sellerExist) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        // Create a new product
        const newProduct = new Product({
            name,
            price,
            quantity,
            description,
            seller: sellerId  // Link the product to the seller
        });

        // Save product to the database
        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully', newProduct });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('seller', 'username');  // Populate seller username if available

        // If you need to send a public path for pictures stored locally
        const productData = products.map(product => ({
            name: product.name,
            picture: `${req.protocol}://${req.get('host')}/images/${product.picture}`,  // Build image URL dynamically
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

// Function to edit a product
const editProduct = async (req, res) => {
    const { productId } = req.params;
    const { name, price, quantity, description } = req.body;
    const sellerId = req.sellerId;  // Assuming sellerId comes from authentication middleware

    try {
        // Check if the product exists and belongs to the seller
        const product = await Product.findOne({ _id: productId, seller: sellerId });
        if (!product) {
            return res.status(404).json({ message: 'Product not found or you do not have permission to edit this product' });
        }

        // Update product details
        if (name) product.name = name;
        if (price) product.price = price;
        if (quantity) product.quantity = quantity;
        if (description) product.description = description;

        // Save the updated product to the database
        await product.save();
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getSeller = async(req,res) => {
    try{
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
 module.exports = {
    updateSellerProfile,
    getSeller,
    addProduct,
    editProduct,
    getAllProducts
};