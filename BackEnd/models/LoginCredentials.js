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
        enum: ['tour guide', 'tourist', 'seller', 'advertiser', 'admin'], // Add all roles
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        refPath: 'roleModel',  // Dynamically reference the correct model based on role
        required: true
    },
    roleModel: {
        type: String,
        required: true,
        enum: ['TourGuide', 'Tourist', 'Seller', 'Advertiser'], // Ensure these match your model names
        default: function () {
            // Map the role to the correct model name
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
