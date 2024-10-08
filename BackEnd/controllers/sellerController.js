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
            const existingUsername = await LoginCredentials.findOne({ username: req.body.username });

            if (existingUsername) {
                return res.status(400).json({ message: 'Username is already taken' });
            }

            loginUpdateFields.username = req.body.username;  // Username update
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
    try {
        const id = req.params.id;
        const seller = await Seller.findById(id);

        if (seller.isCreatedProfile !== 0) {
            return res.status(400).json({ message: 'Profile already created for this seller.' });
        } else {
            seller.isCreatedProfile = 1;
            await seller.save(); // Save the isCreatedProfile update
            
            // Instead of calling updateSellerProfile with res, return the updated seller profile here
            const updateData = { ...req.body };
            if (req.body.password) {
                updateData.password = await bcrypt.hash(req.body.password, 10);
            }
            
            // Update seller details
            const updatedSeller = await Seller.findByIdAndUpdate(id, updateData, {
                new: true, // Return the updated document
            });

            // Send a success response after updating everything
            return res.status(201).json({
                message: 'Seller profile created and updated successfully',
                updatedSeller
            });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Error creating seller profile: ' + err.message });
    }
};







// Function to add a product
const addProduct = async (req, res) => {
    const { name, price, quantity, description, sellerId } = req.body;
    console.log('Received request to add product:', req.body);
    
    // Check if an image was uploaded, otherwise set picture to null
    const picture = req.file ? req.file.filename : null;

    try {
        // Check if the seller exists
        const sellerExist = await Seller.findById(sellerId);
        if (!sellerExist) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        // Create a new product, conditionally including the image if available
        const newProduct = new Product({
            name,
            price,
            quantity,
            description,
            seller: sellerId,
            picture // Only include picture if it was uploaded
        });

        // Save the product to the database
        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully', newProduct });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('seller', 'username');

        const productData = products.map(product => ({
            name: product.name,
            picture: product.picture ? `/images/${product.picture}` : null,  // Correct path to the image
            price: product.price,
            description: product.description,
            quantity: product.quantity,
            seller: product.seller ? product.seller.username : 'Admin',
            ratings: product.ratings,
            reviews: product.reviews
        }));

        res.status(200).json(productData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getProductImage = async (req, res) => {
    const productId = req.params.id;
    
    try {
        // Find the product by its ID
        const product = await Product.findById(productId);
        
        // Check if the product exists
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // If the product has an image
        if (product.picture) {
            // Serve the image from the 'images' directory
            const imagePath = path.join(__dirname, '..', 'images', product.picture);
            
            // Respond with the image file
            return res.sendFile(imagePath);
        } else {
            // If no image is found, return a placeholder or 404
            return res.status(404).json({ message: 'Image not found for this product.' });
        }
    } catch (error) {
        // Handle any errors
        res.status(500).json({ error: error.message });
    }
};


// Function to edit a product
const editProduct = async (req, res) => {
    const { productId } = req.params;
    const { name, price, quantity, description, sellerId } = req.body;

    // Check if an image was uploaded, otherwise leave the existing one
    const picture = req.file ? req.file.filename : null;

    console.log('Received request to edit product with ID:', productId);
    console.log('Request body:', req.body);

    try {
        // Check if the seller exists
        const sellerExist = await Seller.findById(sellerId);
        if (!sellerExist) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        // Check if the product exists and belongs to the seller
        const product = await Product.findOne({ _id: productId, seller: sellerId });
        if (!product) {
            return res.status(404).json({ message: 'Product not found or you do not have permission to edit this product' });
        }

        // Update product details conditionally, only updating fields provided in the request
        if (name) product.name = name;
        if (price) product.price = price;
        if (quantity) product.quantity = quantity;
        if (description) product.description = description;
        if (picture) product.picture = picture; // Update the image only if a new one is uploaded

        // Save the updated product to the database
        await product.save();

        res.status(200).json({ message: 'Product updated successfully', product });
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
    updateSellerProfile,
    createSellerProfile,
    updateSellerProfile,
    getSeller,
    addProduct,
    editProduct,
    sortProductsByRatings,
    getAllProducts,
    filterProduct,
    searchProductsByName,
    getProductImage
};