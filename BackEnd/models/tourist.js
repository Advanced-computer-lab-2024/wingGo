const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const touristSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true 
    },
    username: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true 
    },
    nationality: {
        type: String,
        required: true
    },
    DOB: {
        type: Date, //Make as a date
        required: true
    },
    jobOrStudent: {
        type: String,
        required: true,
        enum: ['job', 'student'] // Ensures the field is either job or student
    },
    wallet: {
        type: Number,
        default: 0    // Initialize to zero
          
    },
    preferences: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PreferenceTag' }]


}, {timestamps: true});


const Tourist = mongoose.model('Tourist', touristSchema);

//export module so tahy you can use it somewhere else in the proj
module.exports= Tourist;