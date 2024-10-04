const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
        required: true
    }
}, { timestamps: true });

const LoginCredentials = mongoose.model('LoginCredentials', loginCredentialsSchema);

module.exports = LoginCredentials;
