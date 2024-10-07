const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema with refPath for dynamic referencing
const loginCredentialsSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['tour guide', 'tourist', 'seller', 'advertiser', 'admin'], // Add 'admin' to the roles
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        refPath: 'roleModel',  // Dynamically reference the correct model based on role
        required: function () { return this.role !== 'admin'; } // userId is required unless the role is 'admin'
    },
    roleModel: {
        type: String,
        required: function () { return this.role !== 'admin'; }, // roleModel is required unless the role is 'admin'
        enum: ['TourGuide', 'Tourist', 'Seller', 'Advertiser'], // Ensure these match your model names
        default: function () {
            return {
                'tour guide': 'TourGuide',
                'tourist': 'Tourist',
                'seller': 'Seller',
                'advertiser': 'Advertiser'
            }[this.role];
        }
    }
}, { timestamps: true });

const LoginCredentials = mongoose.model('LoginCredentials', loginCredentialsSchema);

module.exports = LoginCredentials;