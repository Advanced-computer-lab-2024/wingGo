const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourGuideSchema = new Schema({
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
        type: String, // No default, user must provide it or leave it undefined
    },
    yearsOfExperience: {
        type: Number, // No default, user must provide it or leave it undefined
    },
    previousWork: {
        type: String, // Can be a URL or description of previous work, no default
    }
}, { timestamps: true });

const TourGuide = mongoose.model('TourGuide', tourGuideSchema);

module.exports = TourGuide;
