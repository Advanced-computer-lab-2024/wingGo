const bcrypt = require('bcrypt');
const PendingUser = require('../models/PendingUsers');

const pendinguser_register = async (req, res) => {
    // Destructure fields from the request body
    const { email, username, password, role } = req.body;
    
    try {
        // Hash the password using bcrypt before saving it
        const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

        // Create the new pending user with the hashed password
        const user = await PendingUser.create({
            email,
            username,
            password: hashedPassword, // Save the hashed password
            role
        });

        console.log('success');
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log('noo', error.message);
    }
};

module.exports = {
    pendinguser_register
};
