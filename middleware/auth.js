const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel')
const secret = process.env.JWT_SECRET

const authenticate = async (req, res, next ) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message: "Authorized: no token"})
    }

    const token = authHeader.split(' ')[1];
    try {
        // 2. verify token
        const decoded = jwt.verify(token, secret);

        // 3. find user by decoded token id 
        const user = await authModel.findById(decoded.id);
        if(!user) {
            return res.status(401).json({message: "Authorized: User not found"});
        }

        // 4. attach user to req and continue
        req.user = user;
        next();
    }
    catch(err) {
        console.error("Auth error",err);
        res.status(401).json({message: "Invalid or expired token"});
    }

}

module.exports = authenticate;