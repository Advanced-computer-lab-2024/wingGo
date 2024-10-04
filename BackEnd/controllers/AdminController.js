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
const Attraction = require('../models/attraction');
// Admin function to add a product
const addProductAsAdmin = async (req, res) => {
    const { name, price, quantity, description} = req.body;
    let { sellerId } = req.body;  // Optional seller ID provided by the admin

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
            seller: sellerId  // Could be null if no seller
        });

        // Save the product to the database
        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully by Admin', newProduct });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Function to edit a product
const editProduct = async (req, res) => {
    const { productId } = req.params;
    const { name, price, quantity, description } = req.body;

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



// Controller function to delete an account using id
const deleteAccount = async (req, res) => {
    const { id } = req.params; // Use id as a unique identifier

    try {
        // Find the account in loginCredentials by id
        const account = await LoginCredentials.findById(id);

        if (!account) {
            return res.status(404).json({ message: 'Account not found in login credentials' });
        }

        // Check the role of the account
        const { role } = account;

        // Delete from TourGuide collection if role is 'tour guide'
        if (role === 'tour guide') {
            const tourGuide = await TourGuide.findOneAndDelete({ _id: id });

            if (!tourGuide) {
                return res.status(404).json({ message: 'Tour guide not found' });
            }
        }

        // Delete from Tourist collection if role is 'tourist'
        else if (role === 'tourist') {
            const tourist = await Tourist.findOneAndDelete({ _id: id });

            if (!tourist) {
                return res.status(404).json({ message: 'Tourist not found' });
            }
        } else {
            return res.status(400).json({ message: 'Invalid role. Cannot delete account' });
        }

        // Delete the login credentials
        await LoginCredentials.findByIdAndDelete(id);

        res.status(200).json({ message: `Account with id '${id}' has been deleted successfully.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

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

        // Check if a tour guide with this id already exists
        const existingTourGuide = await TourGuide.findOne({ _id: id });

        if (existingTourGuide) {
            return res.status(400).json({ message: 'Tour guide with this id already exists' });
        }

        // Check if the user's role is 'tour guide'
        if (pendingUser.role === 'tour guide') {
            // Hash the password using bcrypt
            const hashedPassword = await bcrypt.hash(pendingUser.password, 10);  // 10 is the salt rounds

            // Create a new tour guide profile after admin approval
            const tourGuide = new TourGuide({
                _id: pendingUser._id,
                email: pendingUser.email,
                username: pendingUser.username,
                password: hashedPassword, // Save the hashed password
               
            });

            // Save the tour guide profile
            await tourGuide.save();

            // Add login credentials to the loginCredentials collection
            const loginCredentials = new LoginCredentials({
                _id: pendingUser._id,
                username: pendingUser.username,
                password: hashedPassword, // Save the hashed password
                role: pendingUser.role
            });

            // Save the login credentials
            await loginCredentials.save();

            // Remove the pending user from the PendingUser collection
            await PendingUser.findByIdAndDelete(id);

            res.status(200).json({ message: 'User approved, added to tour guide collection, and login credentials saved', tourGuide });
        } 
        else if(pendingUser.role === 'seller'){
             // Hash the password using bcrypt
             const hashedPassword = await bcrypt.hash(pendingUser.password, 10);  // 10 is the salt rounds

             // Create a new seller profile after admin approval
             const seller = new Seller({
                 _id: pendingUser._id,
                 email: pendingUser.email,
                 username: pendingUser.username,
                 password: hashedPassword, // Save the hashed password
                
             });
 
             // Save the tour guide profile
             await seller.save();
 
             // Add login credentials to the loginCredentials collection
             const loginCredentials = new LoginCredentials({
                 _id: pendingUser._id,
                 username: pendingUser.username,
                 password: hashedPassword, // Save the hashed password
                 role: pendingUser.role
             });
 
             // Save the login credentials
             await loginCredentials.save();
 
             // Remove the pending user from the PendingUser collection
             await PendingUser.findByIdAndDelete(id);
 
             res.status(200).json({ message: 'User approved, added to seller collection, and login credentials saved', seller });
            

        }
        else if (pendingUser.role === 'advertiser') {
            
            // Hash the password using bcrypt
            const hashedPassword = await bcrypt.hash(pendingUser.password, 10);  // 10 is the salt rounds

            // Create a new advertiser profile after admin approval
            const advertiser = new Advertiser({
                _id: pendingUser._id,
                email: pendingUser.email,
                username: pendingUser.username,
                password: hashedPassword, // Save the hashed password
            });

            // Save the advertiser profile
            await advertiser.save();

            // Add login credentials to the loginCredentials collection
            const loginCredentials = new LoginCredentials({
                _id: pendingUser._id,
                username: pendingUser.username,
                password: hashedPassword, // Save the hashed password
                role: pendingUser.role
            });

            // Save the login credentials
            await loginCredentials.save();

            // Remove the pending user from the PendingUser collection
            await PendingUser.findByIdAndDelete(id);

            res.status(200).json({ message: 'User approved, added to advertiser collection, and login credentials saved', advertiser });
        } 
        
        else {
            res.status(400).json({ message: 'User role is not seller. Cannot approve for this role.' });
        }
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
        const attraction = await Attraction.findById(id);
        if (!attraction) {
            return res.status(404).json({ error: 'Attraction not found' });
        }

        attraction.tags.push(tag);
        await attraction.save();
        res.status(200).json(attraction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getTags = async (req, res) => {
    const { id } = req.params;

    try {
        const attraction = await Attraction.findById(id);
        if (!attraction) {
            return res.status(404).json({ error: 'Attraction not found' });
        }

        res.status(200).json(attraction.tags);
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
        const attraction = await Attraction.findById(id);
        if (!attraction) {
            return res.status(404).json({ error: 'Attraction not found' });
        }

        const tagIndex = attraction.tags.indexOf(oldTag);
        if (tagIndex === -1) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        attraction.tags[tagIndex] = newTag;
        await attraction.save();
        res.status(200).json(attraction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteTag = async (req, res) => {
    const { id } = req.params;
    const { tag } = req.body;

    try {
        const attraction = await Attraction.findById(id);
        if (!attraction) {
            return res.status(404).json({ error: 'Attraction not found' });
        }

        attraction.tags = attraction.tags.filter(existingTag => existingTag !== tag);
        await attraction.save();
        res.status(200).json(attraction);
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

module.exports = {
    approvePendingUserById, // done in frontEnd
    deleteAccount, // done in frontEnd, still not tested
    addTourismGovernor,
    createCategory,
    getCategories,
    addTag,
    getTags,
    updateTag,
    deleteTag,
    addProductAsAdmin, // done in frontEnd
    editProduct, // done in frontEnd
    updateCategory,
    deleteCategory,
    getCategory,
    addAdmin,
    sortProductsByRatings,
    getAllProducts,
    filterProduct, // done in frontEnd
    searchProductsByName, // done in frontEnd
    getPendingUsers, // done in frontEnd
    deletePendingUserById, // done in frontEnd
};
