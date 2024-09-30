const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const touristSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    DOB: {
        type: String, //Make as a date
        required: true
    },
    type: {
        type: String,
        required: true
    }
}, {timestamps: true});


const Tourist = mongoose.model('Tourist', touristSchema);

//export module so tahy you can use it somewhere else in the proj
module.exports= Tourist;