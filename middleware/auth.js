const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');

const verifytoken = (req,res,next)=>{
    const token = req.cookies['auth-token'];
    if(!token){
        return res.status(401).send('Access denied. No token provided.');
    }
    try {
        const verified = jwt.verify(token,process.env.JWT_SECRET);
        req.user = verified;
        next();
        
    } catch (error) {
        res.status(400).send('Invalid token');
    }
}

const Isadmin = async (req,res,next)=>{
    try {
        const admin = await Admin.findById(req.user._id);
        if(admin){
            next();
        }else{
            res.status(403).send('Access denied. Admins only.');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    verifytoken,
    Isadmin
}