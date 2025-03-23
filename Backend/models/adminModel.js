const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,    
        required: true,
        unique: true   
    },
    password: {
        type: String,    
        required: true
    }
});

// Generate JWT Token for Admin
adminSchema.methods.generateAuthToken = function () {
    const token =  jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
};

adminSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const AdminModel = mongoose.model('Admin', adminSchema);
module.exports = AdminModel;
