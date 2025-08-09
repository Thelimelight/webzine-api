const authModel = require('../models/authModel');
const bcrypt = require('bcrypt');
const path = require('path')
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET

exports.register = async (req, res) => {
    try {
        const {name, email, password, role} = req.body;
        const validRoles = ['superAdmin', 'editor', 'associateEditor'];
        const profileImage = req.file ? req.file.path : 'https://www.gravatar.com/avatar';

        if(role && !validRoles.includes(role)) {
            return res.status(400).json({message: "Invalid role provided"})
        }

        if(!name || !email || !password) {
            return res.status(400).json({message: "Please all fields"});
        }

        const existingUser = await authModel.findOne({ email });
        if(existingUser) {
            return res.status(400).json({message: "email already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new authModel ({
            name, 
            email, 
            password: hashedPassword, 
            profileImage, 
            role: role || 'admin',
        })
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        })

        res.status(201).json({
            token, newUser
        })
    }
    catch(err) {
        console.error('Error while register', err);
        res.status(500).json({message: "Server error"})
    }
}

exports.login = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await authModel.findOne({email});

        if(!user) {
            return res.status(400).json({message: "Invalid creditionals"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({message: "Invalid creditionals"});
        } 

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '1d',
        })
        
        res.status(200).json({
            token, user: {
                id: user.id,
                name: user.name,
                email: user.email,
                profileImage: path.basename(user.profileImage),
            }
        })
        
    }
    catch(err) {
        console.error("Error while login", err);
        res.status(500).json({message: "Server error"});
    }
}