const bcrypt = require('bcrypt');
const PendingUser = require('../models/PendingUsers');
const TourGuide = require('../models/TourGuide');
const LoginCredentials = require('../models/LoginCredentials');
const Tourist = require('../models/tourist');
const Seller = require('../models/Seller');
const TourismGovernor = require('../models/TourismGovernor');
const ActivityCategory = require('../models/ActivityCategory');

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
        res.statua(200).json({message:'Category added successfully',newCategory});
    } catch(error){
        res.status(500).json({error:error.message});
    }
}

//Read all categories
const getCategories=async(req,res)=>{
    try{
        const categories=await ActivityCategory.find();
        res.status(200).jaon(categories);
    } catch(error){
        res.status(500).json({error:error.message});
    }
}
//add TourismGovernor to DB by username and password
const addTourismGovernor= async(req,res)=> {
    const{username,password}=req.body;
    try{
        //create gov.
        const newTG = new TourismGovernor({
            username,
            password,
        });
        await newTG.save();
        res.status(200).json({message:'Tourism Governor added successfully',newTG});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
const Attraction = require('../models/attraction');

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
        } else {
            res.status(400).json({ message: 'User role is not tour guide. Cannot approve for this role.' });
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
    const { id, tagId } = req.params;
    const { newTag } = req.body;

    if (!allowedTags.includes(newTag)) {
        return res.status(400).json({ error: 'Invalid tag' });
    }

    try {
        const attraction = await Attraction.findById(id);
        if (!attraction) {
            return res.status(404).json({ error: 'Attraction not found' });
        }

        const tagIndex = attraction.tags.indexOf(tagId);
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
    const { id, tagId } = req.params;

    try {
        const attraction = await Attraction.findById(id);
        if (!attraction) {
            return res.status(404).json({ error: 'Attraction not found' });
        }

        attraction.tags = attraction.tags.filter(tag => tag !== tagId);
        await attraction.save();
        res.status(200).json(attraction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    approvePendingUserById,
    deleteAccount,
    addTourismGovernor,
    createCategory,
    getCategories,
    addTag,
    getTags,
    updateTag,
    deleteTag
};
