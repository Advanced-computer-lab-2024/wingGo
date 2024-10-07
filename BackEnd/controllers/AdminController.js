const bcrypt = require('bcrypt');
const PendingUser = require('../models/PendingUsers');
const TourGuide = require('../models/TourGuide');
const LoginCredentials = require('../models/LoginCredentials');
const Tourist = require('../models/tourist');
const Seller = require('../models/Seller');
const TourismGovernor = require('../models/TourismGovernor');
const ActivityCategory = require('../models/ActivityCategory');
const Advertiser = require('../models/advertiser');
const Product = require('../models/product');
const mongoose = require('mongoose');
const Itinerary = require('../models/Itinerary');


//Create activity category
const createCategory= async(req,res)=>{
    const {name}=req.body;
    try{
        const notnew= await ActivityCategory.findOne({name});
        if(notnew){
            return res.status(400).json({message:'Category already exists'});
        }
        const newCategory= new ActivityCategory({name});
        await newCategory.save();
        res.status(200).json({message:'Category added successfully',newCategory});
    } catch(error){
        res.status(500).json({error:error.message});
    }
}

//get all categories
const getCategories=async(req,res)=>{
    try{
        const categories=await ActivityCategory.find();
        res.status(200).json(categories);
    } catch(error){
        res.status(500).json({error:error.message});
    }
}; 


//update category
const updateCategory= async(req,res)=>{
    const {id} = req.params;
    const {name}=req.body;
    try{
        const UpdatedCategory = await ActivityCategory.findByIdAndUpdate(id, {name},{new:true});
        if(!UpdatedCategory){
            return res.status(400).json({message:'Category not found'});
        }
        res.status(200).json(UpdatedCategory);
    }catch(error){
        res.status(400).json({error:error.message});
    }
}
//delete a category
const deleteCategory= async(req,res)=>{
    const {id}=req.params;
    try{
        const deletedCategory= await ActivityCategory.findByIdAndDelete(id);
        if(!deletedCategory){
            return res.status(400).json({message:'Category not found'});
        }
        res.status(200).json(deletedCategory);
    } catch(error){
        res.status(400).json({error:error.message});
    }
}
//view one category 
const getCategory=async(req,res)=>{
    const {id}=req.params;
    try{
        const category= await ActivityCategory.findById(id);
        if(!category){
            return res.status(400).json({message:'Category not found'});
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
//add TourismGovernor to DB by username and password
const addTourismGovernor= async(req,res)=> {
    const{username,password}=req.body;
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        //create gov.
        const newTG = new TourismGovernor({
            username,
            password:hashedPassword,
        });
        await newTG.save();
        res.status(200).json({message:'Tourism Governor added successfully',newTG});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Admin function to add a product
const addProductAsAdmin = async (req, res) => {
    const { name, price, quantity, description} = req.body;
    let { sellerId } = req.body;  // Optional seller ID provided by the admin
    const picture = req.file ? req.file.filename : null;
    try {
        // If sellerId is provided, check if the seller exists
        if (sellerId) {
            const sellerExist = await Seller.findById(sellerId);
            if (!sellerExist) {
                return res.status(404).json({ message: 'Seller not found. Cannot associate this product with a seller.' });
            }
        } else {
            sellerId = null;  // If no seller is provided, set it to null
        }

        // Create the product
        const newProduct = new Product({
            name,
            price,
            quantity,
            description,
            seller: sellerId,  // Could be null if no seller
            picture  // only if a picture is uploaded
        });

        // Save the product to the database
        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully by Admin', newProduct });
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
    const { name, price, quantity, description } = req.body;
    const picture = req.file ? req.file.filename : null;
    try {
        console.log('Product ID:', productId); // Add this line to log the product ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.name = name || product.name;
        product.price = price || product.price;
        product.quantity = quantity || product.quantity;
        product.description = description || product.description;
        

        await product.save();
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (err) {
        console.error('Error updating product:', err.message);
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


const deleteAccount = async (req, res) => {
    const { id } = req.params; // Extract the ID from the request parameters

    try {
        // Ensure that the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        // No need to convert to ObjectId, Mongoose will handle it
        const account = await LoginCredentials.findById(id);

        if (!account) {
            return res.status(404).json({ message: 'Account not found in login credentials' });
        }

        // Delete the corresponding user from the correct collection based on the roleModel
        const UserModel = mongoose.model(account.roleModel);
        const deletedUser = await UserModel.findByIdAndDelete(account.userId);

        if (!deletedUser) {
            return res.status(404).json({ message: `${account.roleModel} not found` });
        }

        // Finally, delete the account from LoginCredentials
        await LoginCredentials.findByIdAndDelete(id);

        res.status(200).json({ message: `Account with id '${id}' has been deleted successfully.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// // Controller function to delete an account using id
// const deleteAccount = async (req, res) => {
//     const { id } = req.params; // Use id as a unique identifier

//     try {
//         // Find the account in loginCredentials by id
//         const account = await LoginCredentials.findById(id);

//         if (!account) {
//             return res.status(404).json({ message: 'Account not found in login credentials' });
//         }

//         // Check the role of the account
//         const { role } = account;

//         // Delete from TourGuide collection if role is 'tour guide'
//         if (role === 'tour guide') {
//             const tourGuide = await TourGuide.findOneAndDelete({ _id: id });

//             if (!tourGuide) {
//                 return res.status(404).json({ message: 'Tour guide not found' });
//             }
//         }
//         // Delete from Tourist collection if role is 'tourist'
//         else if (role === 'tourist') {
//             const tourist = await Tourist.findOneAndDelete({ _id: id });

//             if (!tourist) {
//                 return res.status(404).json({ message: 'Tourist not found' });
//             }
//         } 
//         else if (role === 'seller') {
//             const seller = await Seller.findOneAndDelete({ _id: id });

//             if (!seller) {
//                 return res.status(404).json({ message: 'Seller not found' });
//             }
//         } else if (role === 'advertiser') {
//             const advertiser = await Advertiser.findOneAndDelete({ _id: id });

//             if (!advertiser) {
//                 return res.status(404).json({ message: 'Advertiser not found' });
//             }
//         }  
//         else {
//             return res.status(400).json({ message: 'Invalid role. Cannot delete account' });
//         }

//         // Delete the login credentials
//         await LoginCredentials.findByIdAndDelete(id);

//         res.status(200).json({ message: `Account with id '${id}' has been deleted successfully.` });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };
const getPendingUsers = async (req, res) => {
    try {
        const pendingUsers = await PendingUser.find();
        res.status(200).json(pendingUsers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deletePendingUserById = async (req, res) => {
    try {
        const { id } = req.params;
        await PendingUser.findByIdAndDelete(id);
        res.status(200).json({ message: 'User was declined successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Controller function to approve a pending user by id
const approvePendingUserById = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the pending user by id
        const pendingUser = await PendingUser.findById(id);
        if (!pendingUser) {
            return res.status(404).json({ message: 'Pending user not found' });
        }

        let userCollection;
        let userDocument;

        // Check the role and create the user document in the correct collection
        if (pendingUser.role === 'tour guide') {
            userCollection = TourGuide;
            userDocument = new TourGuide({
                _id: pendingUser._id,
                email: pendingUser.email,
                username: pendingUser.username,
                password: await bcrypt.hash(pendingUser.password, 10)
            });
        } else if (pendingUser.role === 'seller') {
            userCollection = Seller;
            userDocument = new Seller({
                _id: pendingUser._id,
                email: pendingUser.email,
                username: pendingUser.username,
                password: await bcrypt.hash(pendingUser.password, 10)
            });
        } else if (pendingUser.role === 'advertiser') {
            userCollection = Advertiser;
            userDocument = new Advertiser({
                _id: pendingUser._id,
                email: pendingUser.email,
                username: pendingUser.username,
                password: await bcrypt.hash(pendingUser.password, 10)
            });
        } else {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Save the user to the corresponding collection
        await userDocument.save();

        // Create login credentials
        const loginCredentials = new LoginCredentials({
            username: pendingUser.username,
            password: userDocument.password,  // Hashed password
            role: pendingUser.role,
            userId: pendingUser._id,  // Reference to the created user document
            roleModel: userDocument.constructor.modelName  // Dynamically set the role model
        });

        await loginCredentials.save();

        // Remove the user from PendingUser collection after approval
        await PendingUser.findByIdAndDelete(id);

        res.status(200).json({ message: 'User approved, added to respective collection, and login credentials saved', userDocument });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const allowedTags = ['historic areas', 'beaches', 'family-friendly', 'shopping', 'budget-friendly'];

const addTag = async (req, res) => {
    const { id } = req.params;
    const { tag } = req.body;

    if (!allowedTags.includes(tag)) {
        return res.status(400).json({ error: 'Invalid tag' });
    }

    try {
        const itinerary = await Itinerary.findById(id);
        if (!itinerary) {
            return res.status(404).json({ error: 'itinerary not found' });
        }

        // Check if the tag already exists
        if (itinerary.tags.includes(tag)) {
            return res.status(400).json({ error: 'Tag already exists' });
        }

        itinerary.tags.push(tag);
        await itinerary.save();
        res.status(200).json(itinerary);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getTags = async (req, res) => {
    const { id } = req.params;

    try {
        const itinerary = await Itinerary.findById(id);
        if (!itinerary) {
            return res.status(404).json({ error: 'itinerary not found' });
        }

        res.status(200).json(itinerary.tags);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateTag = async (req, res) => {
    const { id } = req.params;
    const { oldTag, newTag } = req.body;

    if (!allowedTags.includes(newTag)) {
        return res.status(400).json({ error: 'Invalid tag' });
    }

    try {
        const itinerary = await Itinerary.findById(id);
        if (!itinerary) {
            return res.status(404).json({ error: 'itinerary not found' });
        }

        const tagIndex = itinerary.tags.indexOf(oldTag);
        if (tagIndex === -1) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        itinerary.tags[tagIndex] = newTag;
        await itinerary.save();
        res.status(200).json(itinerary);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteTag = async (req, res) => {
    const { id } = req.params;
    const { tag } = req.body;

    try {
        const itinerary = await Itinerary.findById(id);
        if (!itinerary) {
            return res.status(404).json({ error: 'itinerary not found' });
        }

        itinerary.tags = itinerary.tags.filter(existingTag => existingTag !== tag);
        await itinerary.save();
        res.status(200).json(itinerary);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const sortProductsByRatings = async (req, res) => {
    try {
        const products = await Product.find().sort({ ratings: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};
// Controller function to add a new admin
const addAdmin = async (req, res) => {
    const { username, password } = req.body;  // Get username and password from request body

    try {
        // Check if the username already exists
        const existingUser = await LoginCredentials.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);  // 10 is the salt rounds

        // Create a new admin
        const newAdmin = new LoginCredentials({
            username,
            password: hashedPassword,  // Save the hashed password
            role: 'admin'  // Set role as 'admin'
        });

        // Save the new admin in the database
        await newAdmin.save();

        res.status(201).json({ message: 'Admin added successfully', admin: newAdmin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('seller', 'username');  // Populate seller username if available

        // If you need to send a public path for pictures stored locally
        const productData = products.map(product => ({
            id: product._id,
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

const getAttractions = async (req, res) => {
    try {
        const itinerary = await Itinerary.find().populate('tags');
        res.status(200).json(itinerary);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    approvePendingUserById, // done in frontEnd
    deleteAccount, // done in frontEnd
    addTourismGovernor, // done in frontEnd
    createCategory, // done in frontEnd
    getCategories, // done in frontEnd
    addTag, // done in frontEnd
    getTags, // done in frontEnd
    updateTag, // done in frontEnd
    deleteTag, // done in frontEnd
    addProductAsAdmin, // done in frontEnd
    editProduct, // done in frontEnd
    updateCategory, // done in frontEnd
    deleteCategory, // done in frontEnd
    getCategory, // done in frontEnd
    addAdmin, // done in frontEnd
    sortProductsByRatings, // done in frontEnd
    getAllProducts, // done in frontEnd
    filterProduct, // done in frontEnd
    searchProductsByName, // done in frontEnd
    getPendingUsers, // done in frontEnd
    deletePendingUserById, // done in frontEnd
    getAttractions, // done in frontEnd
    getProductImage
};
